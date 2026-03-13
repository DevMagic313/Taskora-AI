"use client";

import { create } from "zustand";
import { notificationsApi } from "../services/notificationsApi";

interface NotificationState {
    isSubscribed: boolean;
    isLoading: boolean;
    error: string | null;
    fetchStatus: () => Promise<void>;
    subscribe: (fcmToken: string) => Promise<void>;
    unsubscribe: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    isSubscribed: false,
    isLoading: false,
    error: null,

    fetchStatus: async () => {
        set({ isLoading: true, error: null });
        try {
            const status = await notificationsApi.getStatus();
            set({ isSubscribed: status.isSubscribed, isLoading: false });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to check notification status";
            set({ error: message, isLoading: false });
        }
    },

    subscribe: async (fcmToken: string) => {
        set({ isLoading: true, error: null });
        try {
            await notificationsApi.subscribe(fcmToken);
            set({ isSubscribed: true, isLoading: false });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to enable notifications";
            set({ error: message, isLoading: false });
        }
    },

    unsubscribe: async () => {
        set({ isLoading: true, error: null });
        try {
            await notificationsApi.unsubscribe();
            set({ isSubscribed: false, isLoading: false });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to disable notifications";
            set({ error: message, isLoading: false });
        }
    },
}));
