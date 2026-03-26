import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getBillingUsage } from "@/features/billing/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { prompt } = body;

        if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
            return NextResponse.json({ status: "error", message: "Prompt is required" }, { status: 400 });
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

        const systemPrompt = `You are an expert productivity assistant and project manager. Your task is to break down the user's overarching goal into actionable, specific, and clear tasks.

Constraint 1: Limit token usage by being highly concise. Do not add conversational fluff.
Constraint 2: Return ONLY a valid JSON array of objects. Do not include markdown formatting like \`\`\`json or any conversational text.

Each object in the JSON array must have exactly the following keys:
- "title": A clear, action-oriented title for the task.
- "description": A brief explanation or details about how to complete the task.
- "priority": Must be exactly one of: "low", "medium", "high". Assign intelligently based on dependency sequence and importance.
- "estimatedHours": A number estimating how many hours this task will take (e.g., 0.5, 1, 2, 4, 8). Be realistic.
- "dependencies": An array of strings listing titles of other tasks from this list that must be completed first. Use [] if no dependencies.

Example output format:
[
  {
    "title": "Set up project repository",
    "description": "Initialize Git repo, add .gitignore, and create folder structure",
    "priority": "high",
    "estimatedHours": 1,
    "dependencies": []
  },
  {
    "title": "Design database schema",
    "description": "Define tables, relationships, and indexes for the application",
    "priority": "high",
    "estimatedHours": 3,
    "dependencies": ["Set up project repository"]
  }
]`;

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
                    { role: "user", content: prompt },
                ],
                temperature: 0.3,
                max_tokens: 2000,
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

        // Strip out markdown code blocks if the AI still returns them
        content = content.replace(/```json/gi, "").replace(/```/gi, "").trim();

        let tasks;
        try {
            tasks = JSON.parse(content);
        } catch {
            console.error("Failed to parse AI response:", content);
            throw new Error("AI returned invalid JSON format.");
        }

        if (!Array.isArray(tasks)) {
            throw new Error("AI did not return an array of tasks.");
        }

        const validPriorities = ["low", "medium", "high"];
        const sanitizedTasks = tasks
            .map((task: Record<string, unknown>) => ({
                title: typeof task.title === "string" ? (task.title as string).trim() : "Untitled Task",
                description: typeof task.description === "string" ? (task.description as string).trim() : "",
                priority: validPriorities.includes(task.priority as string) ? task.priority : "medium",
                estimatedHours: typeof task.estimatedHours === "number" && task.estimatedHours > 0
                    ? task.estimatedHours
                    : 1,
                dependencies: Array.isArray(task.dependencies)
                    ? (task.dependencies as unknown[]).filter((d): d is string => typeof d === "string")
                    : [],
            }))
            .filter((task: { title: string }) => task.title.length > 0);

        const { error: usageError } = await supabase.from("ai_usage_events").insert({
            user_id: user.id,
            feature: "generation",
        });
        if (usageError) {
            console.error("Failed to record AI usage event:", usageError);
            return NextResponse.json(
                { status: "error", message: "Could not record AI usage. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ status: "success", data: sanitizedTasks });
    } catch (error: unknown) {
        console.error("AI Generation Error:", error);
        const message = error instanceof Error ? error.message : "Internal server error during AI generation";
        return NextResponse.json({ status: "error", message }, { status: 500 });
    }
}
