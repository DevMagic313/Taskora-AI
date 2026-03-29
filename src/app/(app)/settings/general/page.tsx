"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
    Settings, LayoutGrid, List, Columns3, Flag, Volume2, VolumeX,
    Minimize2, Calendar, Clock, Globe, CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { Toggle } from "@/components/ui/Toggle";
import { SettingsToggleSkeleton } from "@/components/ui/SettingsSkeleton";
import type {
    UserSettings,
    TaskViewOption,
    DateFormatOption,
    TimeFormatOption,
    WeekStart,
} from "@/features/settings/types";
import { DEFAULT_USER_SETTINGS } from "@/features/settings/types";

export const dynamic = "force-dynamic";

export default function GeneralSettingsPage() {
    const { user } = useAuth();
    const supabase = createClient();

    const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadSettings = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("user_settings")
                .eq("id", user.id)
                .maybeSingle();
            if (error) throw error;
            if (data?.user_settings) {
                setSettings({ ...DEFAULT_USER_SETTINGS, ...data.user_settings });
            }
        } catch {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const updateSetting = async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        if (!user) return;
        const updated = { ...settings, [key]: value };
        setSettings(updated); // Optimistic
        setSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    user_settings: updated,
                    updated_at: new Date().toISOString(),
                });
            if (error) throw error;
            toast.success("Setting saved", { duration: 1500, icon: "✓" });
        } catch {
            setSettings(settings); // Revert
            toast.error("Failed to save setting");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <SettingsToggleSkeleton rows={6} />;

    const now = new Date();
    const datePreview = (fmt: DateFormatOption) => {
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const y = String(now.getFullYear());
        if (fmt === "MM/DD/YYYY") return `${m}/${d}/${y}`;
        if (fmt === "DD/MM/YYYY") return `${d}/${m}/${y}`;
        return `${y}-${m}-${d}`;
    };
    const timePreview = (fmt: TimeFormatOption) => {
        if (fmt === "12h") return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        return now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    };

    return (
        <div className="animate-fade-in">
            <SettingsHeader
                title="General"
                description="Configure your task preferences and display options."
            />

            <div className="space-y-6">
                {/* ─── Task Preferences ─── */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-5">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Task Preferences</h3>
                    </div>

                    {/* Default Task View */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                            Default Task View
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {([
                                { value: "grid" as TaskViewOption, label: "Grid", icon: LayoutGrid, desc: "Card layout" },
                                { value: "list" as TaskViewOption, label: "List", icon: List, desc: "Compact rows" },
                                { value: "kanban" as TaskViewOption, label: "Kanban", icon: Columns3, desc: "Coming Soon", comingSoon: true },
                            ]).map((opt) => {
                                const Icon = opt.icon;
                                const isActive = settings.defaultTaskView === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => !opt.comingSoon && updateSetting("defaultTaskView", opt.value)}
                                        disabled={opt.comingSoon || saving}
                                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 text-center ${
                                            opt.comingSoon
                                                ? "border-border opacity-40 cursor-not-allowed"
                                                : isActive
                                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                : "border-border text-muted-foreground hover:bg-muted hover:border-border/80"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="text-xs font-bold">{opt.label}</span>
                                        <span className="text-[9px] text-muted-foreground">{opt.desc}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Default Priority */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                            Default Priority
                        </label>
                        <div className="flex gap-2">
                            {([
                                { value: "low" as const, label: "Low", color: "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
                                { value: "medium" as const, label: "Medium", color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
                                { value: "high" as const, label: "High", color: "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400", dot: "bg-red-500" },
                            ]).map((p) => {
                                const isActive = settings.defaultPriority === p.value;
                                return (
                                    <button
                                        key={p.value}
                                        onClick={() => updateSetting("defaultPriority", p.value)}
                                        disabled={saving}
                                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 px-3 text-xs font-bold transition-all duration-200 ${
                                            isActive ? p.color + " shadow-sm" : "border-border text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        <div className={`h-2 w-2 rounded-full ${isActive ? p.dot : "bg-muted-foreground/30"}`} />
                                        <Flag className="h-3.5 w-3.5" />
                                        {p.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Toggle Settings */}
                    <div className="divide-y divide-border">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">Auto-mark completed</p>
                                    <p className="text-xs text-muted-foreground">Automatically mark all sub-tasks done when parent completes</p>
                                </div>
                            </div>
                            <Toggle
                                checked={settings.autoMarkCompleted}
                                onChange={() => updateSetting("autoMarkCompleted", !settings.autoMarkCompleted)}
                                disabled={saving}
                            />
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    {settings.taskSounds ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-primary" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">Task sounds</p>
                                    <p className="text-xs text-muted-foreground">Play a sound when completing or creating tasks</p>
                                </div>
                            </div>
                            <Toggle
                                checked={settings.taskSounds}
                                onChange={() => updateSetting("taskSounds", !settings.taskSounds)}
                                disabled={saving}
                            />
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Minimize2 className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">Compact mode</p>
                                    <p className="text-xs text-muted-foreground">Reduce spacing and card sizes for denser layouts</p>
                                </div>
                            </div>
                            <Toggle
                                checked={settings.compactMode}
                                onChange={() => updateSetting("compactMode", !settings.compactMode)}
                                disabled={saving}
                            />
                        </div>
                    </div>
                </SettingsCard>

                {/* ─── Date & Time ─── */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-5">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Date & Time</h3>
                    </div>

                    {/* Start of Week */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                            Week Starts On
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {([
                                { value: "sunday" as WeekStart, label: "Sunday" },
                                { value: "monday" as WeekStart, label: "Monday" },
                            ]).map((opt) => {
                                const isActive = settings.startOfWeek === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateSetting("startOfWeek", opt.value)}
                                        disabled={saving}
                                        className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 px-4 text-sm font-bold transition-all duration-200 ${
                                            isActive
                                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                : "border-border text-muted-foreground hover:bg-muted hover:border-border/80"
                                        }`}
                                    >
                                        <Calendar className="h-4 w-4" />
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Format */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                            Date Format
                        </label>
                        <div className="space-y-2">
                            {(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] as DateFormatOption[]).map((fmt) => {
                                const isActive = settings.dateFormat === fmt;
                                return (
                                    <button
                                        key={fmt}
                                        onClick={() => updateSetting("dateFormat", fmt)}
                                        disabled={saving}
                                        className={`w-full flex items-center justify-between rounded-xl border-2 py-3 px-4 text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-border text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        <span className="font-bold">{fmt}</span>
                                        <span className={`text-xs ${isActive ? "text-primary" : "text-muted-foreground/60"}`}>
                                            {datePreview(fmt)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Format */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                            Time Format
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {(["12h", "24h"] as TimeFormatOption[]).map((fmt) => {
                                const isActive = settings.timeFormat === fmt;
                                return (
                                    <button
                                        key={fmt}
                                        onClick={() => updateSetting("timeFormat", fmt)}
                                        disabled={saving}
                                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 px-4 transition-all duration-200 ${
                                            isActive
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-border hover:bg-muted hover:border-border/80"
                                        }`}
                                    >
                                        <Clock className="h-4 w-4" />
                                        <span className={`text-sm font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{fmt === "12h" ? "12-hour" : "24-hour"}</span>
                                        <span className={`text-[10px] ${isActive ? "text-primary/70" : "text-muted-foreground/60"}`}>
                                            {timePreview(fmt)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </SettingsCard>

                <p className="text-xs text-muted-foreground text-center pb-4">
                    Changes are saved automatically to your account.
                </p>
            </div>
        </div>
    );
}
