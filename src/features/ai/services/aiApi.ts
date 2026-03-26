/** Structured task from AI generation */
export interface GeneratedTask {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    estimatedHours: number;
    dependencies: string[];
}

/** AI generation history entry from Supabase */
export interface GenerationHistoryEntry {
    id: string;
    user_id: string;
    goal: string;
    result: GeneratedTask[];
    created_at: string;
}

/** Reprioritization suggestion from AI */
export interface ReprioritizeSuggestion {
    taskId: string;
    currentPriority: "low" | "medium" | "high";
    suggestedPriority: "low" | "medium" | "high";
    reason: string;
}

/** Task summary sent as context to streaming chat */
export interface ChatTaskContext {
    title: string;
    priority: string;
    status: string;
    due_date?: string | null;
}

/** Chat message shape */
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export class ApiError extends Error {
    status: number;
    details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export const aiApi = {
    /**
     * Generate tasks from a prompt via Groq.
     */
    generateTasks: async (prompt: string): Promise<GeneratedTask[]> => {
        const res = await fetch("/api/ai/generate-tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new ApiError(data.message || "Failed to generate tasks", res.status, data?.data);
        }
        return data.data;
    },

    /**
     * Get last 10 generation histories for the current user.
     */
    getGenerationHistory: async (): Promise<GenerationHistoryEntry[]> => {
        const res = await fetch("/api/ai/history");
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch history");
        }
        return data.data;
    },

    /**
     * Save a generation to history.
     */
    saveGenerationHistory: async (goal: string, result: GeneratedTask[]): Promise<void> => {
        const res = await fetch("/api/ai/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ goal, result }),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to save history");
        }
    },

    /**
     * Send tasks for AI reprioritization analysis.
     */
    reprioritizeTasks: async (
        tasks: Array<{ id: string; title: string; description?: string; priority: string; status: string }>
    ): Promise<ReprioritizeSuggestion[]> => {
        const res = await fetch("/api/ai/reprioritize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Failed to get reprioritization suggestions");
        }
        return data.data;
    },
};
