"use client";

import { create } from "zustand";
import { taskApi } from "../services/taskApi";
import type { ClientTask } from "../services/taskApi";

interface TaskState {
    tasks: ClientTask[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTasks: () => Promise<void>;
    createTask: (data: Pick<ClientTask, "title" | "description" | "priority" | "status" | "checked" | "start_date" | "due_date" | "comments" | "notes" | "remarks"> & { assigned_to?: string; category?: string }) => Promise<void>;
    updateTask: (id: string, updates: Partial<Pick<ClientTask, "title" | "description" | "priority" | "status" | "checked" | "category" | "assigned_to" | "pending_reason" | "start_date" | "due_date" | "comments" | "notes" | "remarks">>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const tasks = await taskApi.getTasks();
            set({ tasks, isLoading: false });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to fetch tasks";
            set({ error: message, isLoading: false });
        }
    },

    createTask: async (data) => {
        try {
            const newTask = await taskApi.createTask(data);
            set((state) => ({ tasks: [newTask, ...state.tasks] }));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to create task";
            set({ error: message });
            throw err;
        }
    },

    updateTask: async (id, updates) => {
        // 1. Optimistically update UI instantly
        const previousTasks = get().tasks;
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));

        try {
            // 2. Fire backend request
            await taskApi.updateTask(id, updates);
        } catch (err: unknown) {
            // 3. Revert on failure
            const message = err instanceof Error ? err.message : "Failed to update task";
            set({ tasks: previousTasks, error: message });
            throw err;
        }
    },

    deleteTask: async (id) => {
        const previousTasks = get().tasks;
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
        }));

        try {
            await taskApi.deleteTask(id);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to delete task";
            set({ tasks: previousTasks, error: message });
            throw err;
        }
    },
}));
