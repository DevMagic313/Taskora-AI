import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// PUT: Update a task
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await request.json();
        const { title, description, priority, status, category, due_date, start_date, assigned_to, pending_reason, checked, comments, notes, remarks } = body;

        // Verify the task belongs to this user
        const { data: existingTask, error: findError } = await supabase
            .from("tasks")
            .select("id")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

        if (findError || !existingTask) {
            return NextResponse.json({ status: "error", message: "Task not found" }, { status: 404 });
        }

        const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

        if (title) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description ? description.trim() : "";
        if (priority) updateData.priority = priority;
        if (category !== undefined) updateData.category = category ? category.trim() : "General";
        if (due_date !== undefined) updateData.due_date = due_date ? new Date(due_date).toISOString() : null;
        if (start_date !== undefined) updateData.start_date = start_date ? new Date(start_date).toISOString() : null;
        if (assigned_to !== undefined) updateData.assigned_to = assigned_to ? assigned_to.trim() : null;
        if (pending_reason !== undefined) updateData.pending_reason = pending_reason ? pending_reason.trim() : null;
        if (checked !== undefined) updateData.checked = checked;
        if (comments !== undefined) updateData.comments = comments ? comments.trim() : null;
        if (notes !== undefined) updateData.notes = notes ? notes.trim() : null;
        if (remarks !== undefined) updateData.remarks = remarks ? remarks.trim() : null;

        let statusChanged = false;
        if (status) {
            updateData.status = status;
            if (status === "completed") {
                updateData.completed_at = new Date().toISOString();
            } else {
                updateData.completed_at = null;
            }
        }

        const { data: updatedTask, error } = await supabase
            .from("tasks")
            .update(updateData)
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) {
            console.error("Supabase Update Error:", error);
            throw error;
        }

        // Always log the update action
        await supabase.from("task_logs").insert({
            task_id: id,
            user_id: user.id,
            action_type: status === "completed" ? "completed" : "updated",
        });

        // Revalidate cache
        revalidatePath("/dashboard");
        revalidatePath("/tasks");
        if (status === "completed") {
            revalidatePath("/analytics");
        }

        return NextResponse.json({
            status: "success",
            message: "Task updated successfully",
            data: updatedTask,
        });
    } catch (error: any) {
        console.error("Task API Error Object:", error);
        console.error("Task API Error Message:", error?.message);
        return NextResponse.json({ status: "error", message: error?.message || "Internal server error" }, { status: 500 });
    }
}

// DELETE: Delete a task
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        // Log deletion before deleting
        await supabase.from("task_logs").insert({
            task_id: id,
            user_id: user.id,
            action_type: "deleted",
        });

        const { error, count } = await supabase
            .from("tasks")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;
        if (count === 0) {
            return NextResponse.json({ status: "error", message: "Task not found" }, { status: 404 });
        }

        // Revalidate cache
        revalidatePath("/dashboard");
        revalidatePath("/tasks");
        revalidatePath("/analytics");

        return NextResponse.json({ status: "success", message: "Task deleted successfully" });
    } catch (error) {
        console.error("Task delete error:", error);
        return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
    }
}
