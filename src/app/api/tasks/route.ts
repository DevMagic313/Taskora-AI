import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ensureBillingProfile } from "@/features/billing/server";
import { PLAN_CONFIG } from "@/features/billing/constants";

// GET: Fetch all tasks for authenticated user
// POST: Create a new task
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data: tasks, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json(
            { status: "success", data: tasks },
            {
                headers: {
                    "Cache-Control": "private, max-age=0, stale-while-revalidate=60",
                },
            }
        );
    } catch (error) {
        console.error("Tasks fetch error:", error);
        return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { plan } = await ensureBillingProfile(supabase, user.id);
        const taskLimit = PLAN_CONFIG[plan].taskLimit;

        if (taskLimit !== -1) {
            const { count, error: countError } = await supabase
                .from("tasks")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id);

            if (countError) throw countError;

            if ((count || 0) >= taskLimit) {
                return NextResponse.json(
                    { status: "error", message: `Task limit of ${taskLimit} reached for your current plan. Please upgrade to create more tasks.` },
                    { status: 403 }
                );
            }
        }

        const body = await request.json();
        const { title, description, priority, category, dueDate, start_date, assigned_to, checked, comments, notes, remarks, status } = body;

        if (!title || title.trim() === "") {
            return NextResponse.json({ status: "error", message: "Task title is required" }, { status: 400 });
        }

        const validPriorities = ["low", "medium", "high"];
        const taskPriority = validPriorities.includes(priority) ? priority : "medium";

        const newTask = {
            user_id: user.id,
            title: title.trim(),
            description: description?.trim() || "",
            category: category?.trim() || "General",
            priority: taskPriority,
            status: status || "pending",
            assigned_to: assigned_to?.trim() || "",
            checked: checked === true,
            start_date: start_date ? new Date(start_date).toISOString() : null,
            due_date: dueDate ? new Date(dueDate).toISOString() : null,
            comments: comments?.trim() || "",
            notes: notes?.trim() || "",
            remarks: remarks?.trim() || "",
        };

        const { data: task, error } = await supabase
            .from("tasks")
            .insert(newTask)
            .select()
            .single();

        if (error) throw error;

        // Log task creation
        await supabase.from("task_logs").insert({
            task_id: task.id,
            user_id: user.id,
            action_type: "created",
        });

        // Revalidate cache for UI updates
        revalidatePath("/dashboard");
        revalidatePath("/tasks");
        revalidatePath("/analytics");

        return NextResponse.json(
            { status: "success", message: "Task created successfully", data: task },
            { status: 201 }
        );
    } catch (error) {
        console.error("Task creation error:", error);
        return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
    }
}
