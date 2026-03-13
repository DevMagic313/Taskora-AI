"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Key, Plus, Copy, AlertTriangle, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { SettingsTableSkeleton } from "@/components/ui/SettingsSkeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { ApiKey } from "@/features/settings/types";

// Simple pseudo-random key generator for demo
function generateApiKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "sk_live_";
    for (let i = 0; i < 40; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

function hashKey(key: string): string {
    // Simple hash for demo — in production use server-side hashing
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        const char = key.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return hash.toString(36);
}

export default function ApiKeysPage() {
    const { user } = useAuth();
    const supabase = createClient();

    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyName, setKeyName] = useState("");
    const [generating, setGenerating] = useState(false);

    // New key modal
    const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Revoke
    const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
    const [revoking, setRevoking] = useState(false);

    const loadKeys = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from("api_keys")
                .select("*")
                .eq("user_id", user.id)
                .is("revoked_at", null)
                .order("created_at", { ascending: false });
            if (error) throw error;
            setKeys((data || []) as ApiKey[]);
        } catch {
            toast.error("Failed to load API keys");
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        loadKeys();
    }, [loadKeys]);

    const handleGenerate = async () => {
        if (!user || !keyName.trim()) return;
        setGenerating(true);
        try {
            const rawKey = generateApiKey();
            const preview = `sk_...${rawKey.slice(-4)}`;

            const { error } = await supabase.from("api_keys").insert({
                user_id: user.id,
                name: keyName.trim(),
                key_hash: hashKey(rawKey),
                preview,
            });
            if (error) throw error;

            setNewKeyValue(rawKey);
            setKeyName("");
            await loadKeys();
        } catch {
            toast.error("Failed to generate API key");
        } finally {
            setGenerating(false);
        }
    };

    const handleRevoke = async () => {
        if (!revokeTarget) return;
        setRevoking(true);
        try {
            const { error } = await supabase
                .from("api_keys")
                .update({ revoked_at: new Date().toISOString() })
                .eq("id", revokeTarget.id);
            if (error) throw error;
            toast.success("API key revoked");
            setRevokeTarget(null);
            await loadKeys();
        } catch {
            toast.error("Failed to revoke key");
        } finally {
            setRevoking(false);
        }
    };

    const copyKey = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <SettingsTableSkeleton rows={3} />;

    return (
        <div className="animate-fade-in">
            <SettingsHeader
                title="API Keys"
                description="Use these keys to interact with the Taskora AI public API from your own applications."
            />

            <div className="space-y-6">
                {/* Generate Key */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Generate New Key</h3>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                            className="flex-1 h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder='Key name (e.g., "My App", "Zapier")'
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={!keyName.trim() || generating}
                            className="h-10 rounded-lg bg-primary text-primary-foreground px-4 text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {generating ? "Generating..." : "Generate New Key"}
                        </button>
                    </div>
                </SettingsCard>

                {/* Keys Table */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Your API Keys</h3>
                    </div>

                    {keys.length === 0 ? (
                        <div className="text-center py-8">
                            <Key className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No API keys yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Generate your first key above
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border text-left">
                                            <th className="pb-3 font-medium text-muted-foreground text-xs">Name</th>
                                            <th className="pb-3 font-medium text-muted-foreground text-xs">Key</th>
                                            <th className="pb-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">Created</th>
                                            <th className="pb-3 font-medium text-muted-foreground text-xs hidden md:table-cell">Last Used</th>
                                            <th className="pb-3 font-medium text-muted-foreground text-xs text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {keys.map((key) => (
                                            <tr key={key.id}>
                                                <td className="py-3 font-medium">{key.name}</td>
                                                <td className="py-3">
                                                    <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                                        {key.preview}
                                                    </code>
                                                </td>
                                                <td className="py-3 text-muted-foreground text-xs hidden sm:table-cell">
                                                    {new Date(key.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 text-muted-foreground text-xs hidden md:table-cell">
                                                    {key.last_used_at
                                                        ? new Date(key.last_used_at).toLocaleDateString()
                                                        : "Never"}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <button
                                                        onClick={() => setRevokeTarget(key)}
                                                        className="text-xs text-red-500 hover:underline font-medium"
                                                    >
                                                        Revoke
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="sm:hidden space-y-3 mt-2">
                                {keys.map((key) => (
                                    <div key={key.id} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm">{key.name}</span>
                                            <button onClick={() => setRevokeTarget(key)} className="text-xs text-red-500 hover:underline font-medium">Revoke</button>
                                        </div>
                                        <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded block w-fit">
                                            {key.preview}
                                        </code>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                                            <span>Used: {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : "Never"}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </SettingsCard>

                {/* Security Note */}
                <div className="flex items-start gap-2 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                        Your API key grants full access to your account. Never share it publicly or commit it to version control.
                    </p>
                </div>
            </div>

            {/* New Key Modal */}
            {newKeyValue && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                        onClick={() => setNewKeyValue(null)}
                    />
                    <div className="relative w-full max-w-lg mx-4 rounded-xl border border-border bg-card p-6 shadow-2xl animate-scale-in">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            API Key Generated
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            Copy your API key now. You won&apos;t be able to see it again.
                        </p>

                        <div className="mt-4 flex items-center gap-2">
                            <code className="flex-1 text-xs font-mono bg-muted text-foreground p-3 rounded-lg overflow-x-auto border border-border">
                                {newKeyValue}
                            </code>
                            <button
                                onClick={() => copyKey(newKeyValue)}
                                className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                                This key will not be shown again. Copy it now and store it securely.
                            </p>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setNewKeyValue(null)}
                                className="h-10 rounded-lg bg-primary text-primary-foreground px-6 text-sm font-medium hover:opacity-90 transition-all"
                            >
                                {copied ? "Done ✓" : "I've Copied It"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={!!revokeTarget}
                onClose={() => setRevokeTarget(null)}
                onConfirm={handleRevoke}
                title="Revoke API Key"
                description={`Are you sure you want to revoke "${revokeTarget?.name}"? Any integrations using this key will stop working.`}
                confirmLabel="Revoke Key"
                confirmVariant="danger"
                isLoading={revoking}
            />
        </div>
    );
}
