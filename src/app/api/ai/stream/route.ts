import { createClient } from "@/lib/supabase/server";
import { getBillingUsage } from "@/features/billing/server";
import {
    buildTaskoraAssistantPrompt,
    summarizeTaskContext,
} from "@/features/ai/prompts/taskoraAssistantPrompt";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

interface TaskContext {
    title: string;
    priority: string;
    status: string;
    due_date?: string | null;
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const body = await request.json();
        const { messages, tasks } = body as { messages: ChatMessage[]; tasks: TaskContext[] };

        if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Messages are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const usage = await getBillingUsage(supabase, user.id);
        if (usage.used >= usage.monthlyLimit) {
            return new Response(
                JSON.stringify({
                    error: `You have reached your ${usage.planName} AI limit for this billing cycle.`,
                    data: usage,
                }),
                {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            return new Response(JSON.stringify({ error: "Groq API key is not configured" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const taskSummary = summarizeTaskContext(Array.isArray(tasks) ? tasks : []);
        const systemPrompt = buildTaskoraAssistantPrompt({
            today: new Date().toISOString().split("T")[0],
            taskSummary,
        });

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages.map((m) => ({ role: m.role, content: m.content })),
                ],
                temperature: 0.5,
                max_tokens: 1000,
                stream: true,
            }),
        });

        if (!groqResponse.ok) {
            const errorData = (await groqResponse.json().catch(() => ({}))) as Record<string, unknown>;
            const errorMsg = ((errorData.error as Record<string, string>)?.message) || "Groq API error";
            return new Response(JSON.stringify({ error: errorMsg }), {
                status: 502,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!groqResponse.body) {
            return new Response(JSON.stringify({ error: "No response body from Groq" }), {
                status: 502,
                headers: { "Content-Type": "application/json" },
            });
        }

        await supabase.from("ai_usage_events").insert({
            user_id: user.id,
            feature: "assistant_chat",
        });

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const transformStream = new TransformStream({
            async transform(chunk, controller) {
                const text = decoder.decode(chunk, { stream: true });
                const lines = text.split("\n").filter((line) => line.trim() !== "");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") {
                            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                            return;
                        }
                        try {
                            const parsed = JSON.parse(data) as {
                                choices: Array<{ delta: { content?: string } }>;
                            };
                            const content = parsed.choices[0]?.delta?.content;
                            if (content) {
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                            }
                        } catch {
                            // skip unparseable chunks
                        }
                    }
                }
            },
        });

        const stream = groqResponse.body.pipeThrough(transformStream);

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("AI Stream Error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
