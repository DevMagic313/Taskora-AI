"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Type, Columns3, Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import type {
    AppearancePreferences,
    SidebarStyle,
    AccentColor,
    FontSize,
} from "@/features/settings/types";
import { ACCENT_COLORS, DEFAULT_APPEARANCE } from "@/features/settings/types";

const STORAGE_KEY = "taskora-appearance";

function loadPreferences(): AppearancePreferences {
    if (typeof window === "undefined") return DEFAULT_APPEARANCE;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return { ...DEFAULT_APPEARANCE, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return DEFAULT_APPEARANCE;
}

function savePreferences(prefs: AppearancePreferences) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function applyAccentColor(color: AccentColor) {
    const root = document.documentElement;
    // Remove existing accent classes
    root.classList.forEach((cls) => {
        if (cls.startsWith("accent-")) root.classList.remove(cls);
    });
    root.classList.add(`accent-${color}`);
}

function applyFontSize(size: FontSize) {
    const body = document.body;
    body.classList.remove("font-comfortable", "font-compact");
    if (size !== "default") {
        body.classList.add(`font-${size}`);
    }
}

export const dynamic = "force-dynamic";

export default function AppearancePage() {
    const { theme, setTheme } = useTheme();
    const [prefs, setPrefs] = useState<AppearancePreferences>(DEFAULT_APPEARANCE);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const loaded = loadPreferences();
        setPrefs(loaded);
        applyAccentColor(loaded.accentColor);
        applyFontSize(loaded.fontSize);
        const root = window.document.documentElement;
        root.classList.remove("sidebar-default", "sidebar-compact", "sidebar-minimal");
        root.classList.add(`sidebar-${loaded.sidebarStyle}`);
        setMounted(true);
    }, []);

    const updatePref = <K extends keyof AppearancePreferences>(
        key: K,
        value: AppearancePreferences[K]
    ) => {
        setPrefs((prev) => {
            const next = { ...prev, [key]: value };
            savePreferences(next);
            return next;
        });
        if (key === "sidebarStyle") {
            const root = window.document.documentElement;
            root.classList.remove("sidebar-default", "sidebar-compact", "sidebar-minimal");
            root.classList.add(`sidebar-${value}`);
        }
    };

    if (!mounted) return null;

    const themeOptions = [
        { value: "light" as const, label: "Light", icon: Sun },
        { value: "dark" as const, label: "Dark", icon: Moon },
        { value: "system" as const, label: "System", icon: Monitor },
    ];

    const sidebarOptions: { value: SidebarStyle; label: string; description: string }[] = [
        { value: "default", label: "Default", description: "Full sidebar with labels" },
        { value: "compact", label: "Compact", description: "Icons with smaller labels" },
        { value: "minimal", label: "Minimal", description: "Icons only" },
    ];

    const fontOptions: { value: FontSize; label: string; size: string }[] = [
        { value: "default", label: "Default", size: "14px" },
        { value: "comfortable", label: "Comfortable", size: "16px" },
        { value: "compact", label: "Compact", size: "13px" },
    ];

    return (
        <div className="animate-fade-in">
            <SettingsHeader
                title="Appearance"
                description="Customize how Taskora AI looks and feels."
            />

            <div className="space-y-6">
                {/* Theme */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Theme</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {themeOptions.map((opt) => {
                            const Icon = opt.icon;
                            const isActive = theme === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => setTheme(opt.value)}
                                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                                        isActive
                                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                                            : "border-border text-muted-foreground hover:bg-muted hover:border-border/80"
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-xs font-bold">{opt.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </SettingsCard>

                {/* Sidebar Style */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Columns3 className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Sidebar Style</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {sidebarOptions.map((opt) => {
                            const isActive = prefs.sidebarStyle === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => updatePref("sidebarStyle", opt.value)}
                                    className={`flex flex-col items-start rounded-xl border-2 p-4 transition-all duration-200 text-left ${
                                        isActive
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border hover:bg-muted hover:border-border/80"
                                    }`}
                                >
                                    {/* Mini preview */}
                                    <div className="w-full h-12 rounded-lg bg-muted/50 mb-3 flex overflow-hidden border border-border/50">
                                        <div
                                            className={`bg-muted border-r border-border/50 ${
                                                opt.value === "default"
                                                    ? "w-1/3"
                                                    : opt.value === "compact"
                                                    ? "w-1/5"
                                                    : "w-[12%]"
                                            }`}
                                        >
                                            <div className="p-1 space-y-0.5">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="h-1 w-full rounded-sm bg-muted-foreground/20" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex-1 p-1">
                                            <div className="h-full rounded bg-muted-foreground/5" />
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold ${isActive ? "text-primary" : ""}`}>
                                        {opt.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground mt-0.5">
                                        {opt.description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </SettingsCard>

                {/* Accent Color */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Accent Color</h3>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {(Object.entries(ACCENT_COLORS) as [AccentColor, typeof ACCENT_COLORS[AccentColor]][]).map(
                            ([key, val]) => {
                                const isActive = prefs.accentColor === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            updatePref("accentColor", key);
                                            applyAccentColor(key);
                                        }}
                                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200 min-w-[72px] ${
                                            isActive
                                                ? "border-primary shadow-sm"
                                                : "border-border hover:border-border/80"
                                        }`}
                                    >
                                        <div
                                            className={`h-8 w-8 rounded-full ${
                                                isActive ? "ring-2 ring-offset-2 ring-offset-card" : ""
                                            }`}
                                            style={{
                                                backgroundColor: val.light,
                                                ...(isActive ? { boxShadow: `0 0 0 2px var(--card), 0 0 0 4px ${val.light}` } : {}),
                                            }}
                                        />
                                        <span className="text-[10px] font-semibold">{val.label}</span>
                                    </button>
                                );
                            }
                        )}
                    </div>
                </SettingsCard>

                {/* Font Size */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Type className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Font Size</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {fontOptions.map((opt) => {
                            const isActive = prefs.fontSize === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        updatePref("fontSize", opt.value);
                                        applyFontSize(opt.value);
                                    }}
                                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-all duration-200 ${
                                        isActive
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border hover:bg-muted hover:border-border/80"
                                    }`}
                                >
                                    <span style={{ fontSize: opt.size }} className="font-semibold">
                                        Aa
                                    </span>
                                    <span className="text-[10px] font-semibold text-muted-foreground">
                                        {opt.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </SettingsCard>

                <p className="text-xs text-muted-foreground text-center pb-4">
                    Changes are applied and saved automatically.
                </p>
            </div>
        </div>
    );
}
