/**
 * Notifications API service for managing FCM token subscriptions.
 */

const API_URL = "/api/notifications";

export interface NotificationStatus {
    isSubscribed: boolean;
}

export const notificationsApi = {
    /** Check if the current user has notifications enabled */
    getStatus: async (): Promise<NotificationStatus> => {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to check notification status");
        return data.data;
    },

    /** Save an FCM token to enable push notifications */
    subscribe: async (fcmToken: string): Promise<void> => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fcmToken }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to subscribe to notifications");
    },

    /** Remove FCM token to disable push notifications */
    unsubscribe: async (): Promise<void> => {
        const res = await fetch(API_URL, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to unsubscribe from notifications");
    },
};
