/**
 * Analytics API service for fetching dashboard statistics and activity data.
 */

export interface AnalyticsData {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
    priorityBreakdown: {
        low: number;
        medium: number;
        high: number;
    };
    categoryBreakdown: Array<{
        category: string;
        count: number;
    }>;
    dailyActivity: Array<{
        date: string;
        created: number;
        completed: number;
    }>;
    recentActivity: Array<{
        _id: string;
        actionType: "created" | "updated" | "completed" | "deleted";
        created_at: string;
        taskTitle: string;
    }>;
}

const API_URL = "/api/analytics";

export const analyticsApi = {
    /** Fetch full analytics dashboard data */
    getAnalytics: async (): Promise<AnalyticsData> => {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch analytics");
        return data.data;
    },
};
