import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getBillingUsage } from "@/features/billing/server";

interface TaskInput {
    id: string;
    title: string;
    description?: string;
    priority: string;
    status: string;
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { tasks } = body as { tasks: TaskInput[] };

        if (!Array.isArray(tasks) || tasks.length === 0) {
            return NextResponse.json({ status: "error", message: "Tasks array is required" }, { status: 400 });
        }

        const usage = await getBillingUsage(supabase, user.id);
        if (usage.used >= usage.monthlyLimit) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `You have reached your ${usage.planName} AI limit for this billing cycle.`,
                    data: usage,
                },
                { status: 402 }
            );
        }

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            return NextResponse.json({ status: "error", message: "Groq API key is not configured" }, { status: 500 });
        }

        const taskList = tasks.map((t) =>
            `{ id: "${t.id}", title: "${t.title}", description: "${t.description || ""}", currentPriority: "${t.priority}", status: "${t.status}" }`
        ).join("\n");

        const systemPrompt = `You are an expert project manager. Analyze the following tasks and suggest priority changes where appropriate.

Consider:
- Task urgency and importance
- Dependencies between tasks
- Current completion status
- Whether current priorities make sense

Return ONLY a valid JSON array of objects. Do not include markdown or conversational text.
Each object must have exactly:
- "taskId": the task id string
- "currentPriority": one of "low", "medium", "high"
- "suggestedPriority": one of "low", "medium", "high"
- "reason": a brief explanation of why the priority should change

ONLY include tasks where you recommend a change (suggestedPriority != currentPriority).
If no changes are needed, return an empty array [].`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Here are my current tasks:\n${taskList}` },
                ],
                temperature: 0.3,
                max_tokens: 1500,
            }),
        });

        if (!response.ok) {
            const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
            throw new Error(
                ((errorData.error as Record<string, string>)?.message) || "Error communicating with Groq API"
            );
        }

        const data = (await response.json()) as {
            choices: Array<{ message: { content: string } }>;
        };

        let content = data.choices[0]?.message?.content || "[]";
        content = content.replace(/```json/gi, "").replace(/```/gi, "").trim();

        let suggestions;
        try {
            suggestions = JSON.parse(content);
        } catch {
            console.error("Failed to parse AI reprioritize response:", content);
            throw new Error("AI returned invalid JSON format.");
        }

        if (!Array.isArray(suggestions)) {
            throw new Error("AI did not return an array of suggestions.");
        }

        const validPriorities = ["low", "medium", "high"];
        const sanitized = suggestions
            .filter((s: Record<string, unknown>) =>
                typeof s.taskId === "string" &&
                validPriorities.includes(s.currentPriority as string) &&
                validPriorities.includes(s.suggestedPriority as string) &&
                s.currentPriority !== s.suggestedPriority &&
                typeof s.reason === "string"
            )
            .map((s: Record<string, unknown>) => ({
                taskId: s.taskId as string,
                currentPriority: s.currentPriority as string,
                suggestedPriority: s.suggestedPriority as string,
                reason: (s.reason as string).trim(),
            }));

        await supabase.from("ai_usage_events").insert({
            user_id: user.id,
            feature: "reprioritize",
        });

        return NextResponse.json({ status: "success", data: sanitized });
    } catch (error: unknown) {
        console.error("AI Reprioritize Error:", error);
        const message = error instanceof Error ? error.message : "Internal server error during AI reprioritization";
        return NextResponse.json({ status: "error", message }, { status: 500 });
    }
}
