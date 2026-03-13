"use client";

import { create } from "zustand";
import { analyticsApi } from "../services/analyticsApi";
import type { AnalyticsData } from "../services/analyticsApi";

interface AnalyticsState {
    data: AnalyticsData | null;
    isLoading: boolean;
    error: string | null;
    fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
    data: null,
    isLoading: false,
    error: null,

    fetchAnalytics: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await analyticsApi.getAnalytics();
            set({ data, isLoading: false });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to load analytics";
            set({ error: message, isLoading: false });
        }
    },
}));
