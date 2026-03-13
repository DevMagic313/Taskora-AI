/**
 * Frontend Task type and API service.
 * Cookies are sent automatically by the browser for Supabase session auth.
 */

export interface ClientTask {
    id: string;
    title: string;
    description?: string;
    category: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "completed";
    checked: boolean;
    assigned_to?: string;
    pending_reason?: string;
    start_date?: string;
    due_date?: string;
    comments?: string;
    notes?: string;
    remarks?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}

const API_URL = "/api/tasks";

export const taskApi = {
    /** Fetch all tasks for the logged in user */
    getTasks: async (): Promise<ClientTask[]> => {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch tasks");
        return data.data;
    },

    /** Create a new task */
    createTask: async (
        taskData: Pick<ClientTask, "title" | "description" | "priority" | "status" | "checked" | "start_date" | "due_date" | "comments" | "notes" | "remarks"> & { assigned_to?: string }
    ): Promise<ClientTask> => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create task");
        return data.data;
    },

    /** Update an existing task */
    updateTask: async (
        id: string,
        updates: Partial<Pick<ClientTask, "title" | "description" | "priority" | "status" | "checked" | "category" | "assigned_to" | "pending_reason" | "start_date" | "due_date" | "comments" | "notes" | "remarks">>
    ): Promise<ClientTask> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update task");
        return data.data;
    },

    /** Delete a task completely */
    deleteTask: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error((data as Record<string, string>).message || "Failed to delete task");
        }
    },
};
