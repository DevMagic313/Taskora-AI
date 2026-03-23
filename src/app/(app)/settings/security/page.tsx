"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
    Lock,
    Eye,
    EyeOff,
    Shield,
    Monitor,
    Globe,
    Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import type { PasswordFormValues, ConnectedAccount } from "@/features/settings/types";

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" };
    if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "Strong", color: "bg-green-500" };
    return { score, label: "Excellent", color: "bg-emerald-500" };
}

// Provider SVG icons
function GoogleIcon() {
    return (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
    );
}

export const dynamic = "force-dynamic";

export default function SecurityPage() {
    const { user } = useAuth();
    const supabase = createClient();

    const [saving, setSaving] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // For demo — in production, detect from auth provider
    const [connectedAccounts] = useState<ConnectedAccount[]>([
        { provider: "google", connected: false },
        { provider: "github", connected: false },
    ]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const newPasswordValue = watch("newPassword");
    const strength = useMemo(() => getPasswordStrength(newPasswordValue || ""), [newPasswordValue]);

    const onSubmit = async (values: PasswordFormValues) => {
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: values.newPassword,
            });
            if (error) throw error;
            toast.success("Password updated successfully");
            reset();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update password";
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const handleConnectProvider = async (provider: "google" | "github") => {
        try {
            const { error } = await supabase.auth.linkIdentity({
                provider,
                options: { redirectTo: `${window.location.origin}/settings/security` },
            });
            if (error) throw error;
        } catch {
            toast.error(`Failed to connect ${provider}`);
        }
    };

    const handleDisconnectProvider = async (provider: "google" | "github") => {
        // Check if this is the last auth method
        const connectedCount = connectedAccounts.filter((a) => a.connected).length;
        const hasPassword = true; // In production, detect this from auth state
        if (connectedCount <= 1 && !hasPassword) {
            toast.error("Cannot disconnect your only authentication method");
            return;
        }
        toast(`Disconnecting ${provider}...`, { icon: "🔗" });
    };

    const providerIcons: Record<string, React.ReactNode> = {
        google: <GoogleIcon />,
        github: <GitHubIcon />,
    };

    return (
        <div className="animate-fade-in">
            <SettingsHeader
                title="Security"
                description="Manage your password and authentication methods."
            />

            <div className="space-y-6">
                {/* Change Password */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Change Password</h3>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label htmlFor="currentPassword" className="text-sm font-medium mb-1.5 block">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    id="currentPassword"
                                    type={showCurrent ? "text" : "password"}
                                    {...register("currentPassword")}
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="text-sm font-medium mb-1.5 block">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showNew ? "text" : "password"}
                                    {...register("newPassword")}
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {/* Strength indicator */}
                            {newPasswordValue && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                    i <= strength.score ? strength.color : "bg-muted"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">{strength.label}</p>
                                </div>
                            )}
                            {errors.newPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="text-sm font-medium mb-1.5 block">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="h-10 rounded-lg bg-primary text-primary-foreground px-6 text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </SettingsCard>

                {/* Connected Accounts */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Connected Accounts</h3>
                    </div>
                    <div className="divide-y divide-border">
                        {connectedAccounts.map((account) => (
                            <div key={account.provider} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                        {providerIcons[account.provider]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium capitalize">{account.provider}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {account.connected ? "Connected" : "Not connected"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        account.connected
                                            ? handleDisconnectProvider(account.provider)
                                            : handleConnectProvider(account.provider)
                                    }
                                    className={`h-9 rounded-lg px-4 text-xs font-medium transition-colors ${
                                        account.connected
                                            ? "border border-border text-foreground hover:bg-muted"
                                            : "bg-primary text-primary-foreground hover:opacity-90"
                                    }`}
                                >
                                    {account.connected ? "Disconnect" : "Connect"}
                                </button>
                            </div>
                        ))}
                    </div>
                </SettingsCard>

                {/* Active Sessions */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Active Sessions</h3>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Globe className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">Current Session</p>
                                    <span className="text-[9px] font-bold uppercase bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">
                                        Active
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {typeof navigator !== "undefined" ? navigator.userAgent.split("(")[1]?.split(")")[0] || "Unknown device" : "Unknown device"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-muted/30">
                        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                            To end all other sessions, change your password above.
                        </p>
                    </div>
                </SettingsCard>
            </div>
        </div>
    );
}
