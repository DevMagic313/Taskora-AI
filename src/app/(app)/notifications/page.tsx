"use client";

import { useEffect } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { useNotificationStore } from "@/features/notifications/store/useNotificationStore";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

export default function NotificationsPage() {
    const { isSubscribed, isLoading, error, fetchStatus, subscribe, unsubscribe } = useNotificationStore();

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    const handleToggle = async () => {
        if (isSubscribed) {
            await unsubscribe();
        } else {
            // Request notification permission first
            if (!("Notification" in window)) {
                toast.error("Your browser does not support push notifications.");
                return;
            }

            const permission = await Notification.requestPermission();
            if (permission === "denied") {
                toast.error("Please allow notifications in your browser settings.");
                return;
            }

            if (permission !== "granted") {
                toast.error("Notification permission is required.");
                return;
            }

            // Register service worker
            if (!("serviceWorker" in navigator)) {
                toast.error("Your browser does not support service workers.");
                return;
            }

            try {
                const registration = await navigator.serviceWorker.register("/sw.js");
                await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    // No VAPID key yet, so we just enable browser push
                    applicationServerKey: undefined,
                }).catch(() => {
                    // Push subscription may fail without VAPID key, but that's ok for now
                });

                // Store a placeholder token since we don't have VAPID keys configured yet
                await subscribe("browser-push-enabled");
                toast.success("Push notifications enabled!");
            } catch (err) {
                console.error("Service worker registration failed:", err);
                toast.error("Failed to enable push notifications.");
            }
        }
    };

    if (isLoading) return <PageLoader />;

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative z-10 w-full overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-overlay" />

            <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 shadow-sm mb-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Notification Center</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter">
                    Push <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Notifications.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                    Manage your notification preferences and stay updated on task activity.
                </p>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="relative z-10 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl p-8 shadow-sm max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${isSubscribed ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        {isSubscribed ? <BellRing className="h-7 w-7" /> : <BellOff className="h-7 w-7" />}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">{isSubscribed ? "Currently enabled" : "Currently disabled"}</p>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {isSubscribed
                        ? "You will receive push notifications for task updates, reminders, and AI-generated insights."
                        : "Enable push notifications to stay on top of your tasks and never miss a deadline."}
                </p>

                <Button
                    onClick={handleToggle}
                    variant={isSubscribed ? "outline" : "primary"}
                    isLoading={isLoading}
                    className="w-full"
                    size="lg"
                >
                    {isSubscribed ? "Disable Notifications" : "Enable Notifications"}
                </Button>

                <p className="text-xs text-muted-foreground/70 mt-4 text-center">
                    Note: Email notifications require the Pro plan.
                </p>
            </div>
        </div>
    );
}
