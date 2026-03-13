"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
    Bell,
    CheckSquare,
    Clock,
    MessageCircle,
    UserPlus,
    Sparkles,
    Mail,
    BarChart3,
    AlertCircle,
    Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { Toggle } from "@/components/ui/Toggle";
import { SettingsToggleSkeleton } from "@/components/ui/SettingsSkeleton";
import type { NotificationPreferences } from "@/features/settings/types";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "@/features/settings/types";

interface NotificationRow {
    key: keyof NotificationPreferences;
    icon: React.ElementType;
    title: string;
    description: string;
    comingSoon?: boolean;
}

const IN_APP_ITEMS: NotificationRow[] = [
    { key: "taskAssigned", icon: CheckSquare, title: "Task assigned to me", description: "Get notified when a task is assigned to you" },
    { key: "taskDue", icon: Clock, title: "Task due in 24 hours", description: "Reminder before a task's deadline" },
    { key: "commentMention", icon: MessageCircle, title: "Comment mentioning me", description: "When someone mentions you in a comment" },
    { key: "memberJoined", icon: UserPlus, title: "Workspace member joined", description: "When a new member joins your workspace" },
    { key: "aiCompleted", icon: Sparkles, title: "AI generation completed", description: "When an AI task generation finishes" },
];

const EMAIL_ITEMS: NotificationRow[] = [
    { key: "weeklySummary", icon: BarChart3, title: "Weekly productivity summary", description: "A weekly digest of your productivity stats", comingSoon: true },
    { key: "overdueReminders", icon: AlertCircle, title: "Task overdue reminders", description: "Get reminded about overdue tasks", comingSoon: true },
    { key: "teamDigest", icon: Users, title: "Team activity digest", description: "Weekly summary of team activity", comingSoon: true },
];

export default function NotificationsPage() {
    const { user } = useAuth();
    const supabase = createClient();

    const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadPreferences = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("notification_preferences")
                .eq("id", user.id)
                .maybeSingle();
            if (error) throw error;
            if (data?.notification_preferences) {
                setPrefs({ ...DEFAULT_NOTIFICATION_PREFERENCES, ...data.notification_preferences });
            }
        } catch {
            toast.error("Failed to load notification preferences");
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        loadPreferences();
    }, [loadPreferences]);

    const togglePref = async (key: keyof NotificationPreferences) => {
        if (!user) return;
        const updated = { ...prefs, [key]: !prefs[key] };
        setPrefs(updated); // Optimistic
        setSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .upsert({ id: user.id, notification_preferences: updated, updated_at: new Date().toISOString() });
            if (error) throw error;
        } catch {
            setPrefs(prefs); // Revert
            toast.error("Failed to save preference");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <SettingsToggleSkeleton rows={5} />;

    return (
        <div className="animate-fade-in">
            <SettingsHeader
                title="Notifications"
                description="Choose what notifications you want to receive."
            />

            <div className="space-y-6">
                {/* In-App Notifications */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">In-App Notifications</h3>
                    </div>
                    <div className="divide-y divide-border">
                        {IN_APP_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.key}
                                    className="flex items-center justify-between py-4 first:pt-2"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{item.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <Toggle
                                        checked={prefs[item.key]}
                                        onChange={() => togglePref(item.key)}
                                        disabled={saving}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </SettingsCard>

                {/* Email Notifications */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Email Notifications</h3>
                    </div>
                    <div className="divide-y divide-border">
                        {EMAIL_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.key}
                                    className="flex items-center justify-between py-4 first:pt-2 opacity-50"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium truncate">
                                                    {item.title}
                                                </p>
                                                <span className="text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground rounded px-1.5 py-0.5 shrink-0">
                                                    Coming Soon
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <Toggle checked={false} onChange={() => {}} disabled />
                                </div>
                            );
                        })}
                    </div>
                </SettingsCard>
            </div>
        </div>
    );
}
