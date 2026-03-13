"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Building2, Copy, Calendar, Hash, Camera, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { SettingsFormSkeleton } from "@/components/ui/SettingsSkeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Workspace, WorkspaceFormValues } from "@/features/settings/types";

const workspaceSchema = z.object({
    name: z.string().min(1, "Workspace name is required").max(50),
    slug: z
        .string()
        .min(1, "Slug is required")
        .max(50)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Only lowercase letters, numbers, and hyphens"),
});

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 50);
}

export default function WorkspaceGeneralPage() {
    const { user } = useAuth();
    const supabase = createClient();

    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm<WorkspaceFormValues>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: { name: "", slug: "" },
    });

    const nameValue = watch("name");

    const loadWorkspace = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from("workspaces")
                .select("*")
                .eq("owner_id", user.id)
                .single();
            if (error && error.code !== "PGRST116") throw error;
            if (data) {
                const ws = data as Workspace;
                setWorkspace(ws);
                setLogoPreview(ws.logo_url);
                reset({ name: ws.name, slug: ws.slug });
            }
        } catch {
            toast.error("Failed to load workspace");
        } finally {
            setLoading(false);
        }
    }, [user, supabase, reset]);

    useEffect(() => {
        loadWorkspace();
    }, [loadWorkspace]);

    // Auto-generate slug when name changes (if slug was not manually edited)
    useEffect(() => {
        if (nameValue && !workspace) {
            setValue("slug", generateSlug(nameValue), { shouldDirty: true });
        }
    }, [nameValue, workspace, setValue]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB");
            return;
        }
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (values: WorkspaceFormValues) => {
        if (!user) return;
        setSaving(true);
        try {
            let logoUrl = workspace?.logo_url || null;

            if (logoFile) {
                const ext = logoFile.name.split(".").pop();
                const path = `workspace-logos/${workspace?.id || "new"}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from("workspace-logos")
                    .upload(path, logoFile, { upsert: true });
                if (uploadError) throw uploadError;
                const { data: urlData } = supabase.storage.from("workspace-logos").getPublicUrl(path);
                logoUrl = urlData.publicUrl;
            }

            if (workspace) {
                const { error } = await supabase
                    .from("workspaces")
                    .update({ name: values.name, slug: values.slug, logo_url: logoUrl })
                    .eq("id", workspace.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("workspaces")
                    .insert({
                        name: values.name,
                        slug: values.slug,
                        logo_url: logoUrl,
                        owner_id: user.id,
                    });
                if (error) throw error;
            }

            toast.success("Workspace saved successfully");
            setLogoFile(null);
            await loadWorkspace();
        } catch {
            toast.error("Failed to save workspace");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteWorkspace = async () => {
        if (!workspace) return;
        setDeleting(true);
        try {
            const { error } = await supabase
                .from("workspaces")
                .delete()
                .eq("id", workspace.id);
            if (error) throw error;
            toast.success("Workspace deleted");
            window.location.href = "/dashboard";
        } catch {
            toast.error("Failed to delete workspace");
            setDeleting(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    if (loading) return <SettingsFormSkeleton />;

    return (
        <div className="animate-fade-in">
            <SettingsHeader
                title="Workspace"
                description="Manage your workspace settings and information."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Workspace Logo */}
                <SettingsCard>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                        Workspace Logo
                    </label>
                    <div className="flex items-center gap-5">
                        <label className="relative h-16 w-16 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center cursor-pointer group shrink-0">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                            ) : (
                                <Building2 className="h-6 w-6 text-primary" />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-4 w-4 text-white" />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                            />
                        </label>
                        <div>
                            <p className="text-sm font-medium">Upload logo</p>
                            <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or WebP. Max 2MB.</p>
                        </div>
                    </div>
                </SettingsCard>

                {/* Name & Slug */}
                <SettingsCard className="space-y-5">
                    <div>
                        <label htmlFor="ws_name" className="text-sm font-medium mb-1.5 block">
                            Workspace Name
                        </label>
                        <input
                            id="ws_name"
                            {...register("name")}
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                            placeholder="My Workspace"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="ws_slug" className="text-sm font-medium mb-1.5 block">
                            Workspace Slug
                        </label>
                        <input
                            id="ws_slug"
                            {...register("slug")}
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors font-mono"
                            placeholder="my-workspace"
                        />
                        {errors.slug && (
                            <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
                        )}
                    </div>
                </SettingsCard>

                {/* Read-only Info */}
                {workspace && (
                    <SettingsCard className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" /> Created At
                                </p>
                                <p className="text-sm mt-0.5">
                                    {new Date(workspace.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <Hash className="h-3.5 w-3.5" /> Workspace ID
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <code className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                    {workspace.id}
                                </code>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(workspace.id)}
                                    className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </SettingsCard>
                )}

                {/* Save */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={(!isDirty && !logoFile) || saving}
                        className="h-10 rounded-lg bg-primary text-primary-foreground px-6 text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : workspace ? "Save Changes" : "Create Workspace"}
                    </button>
                </div>
            </form>

            {/* Danger Zone */}
            {workspace && (
                <div className="mt-8">
                    <SettingsCard danger>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-red-500 flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" /> Danger Zone
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Permanently delete this workspace and all its data. This action cannot be undone.
                                </p>
                            </div>
                            <button
                                onClick={() => setDeleteOpen(true)}
                                className="h-9 rounded-lg bg-red-500 text-white px-4 text-sm font-medium hover:bg-red-600 transition-colors shrink-0"
                            >
                                Delete Workspace
                            </button>
                        </div>
                    </SettingsCard>
                </div>
            )}

            <ConfirmModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteWorkspace}
                title="Delete Workspace"
                description={`This will permanently delete "${workspace?.name}" and all associated data including tasks, members, and API keys.`}
                confirmLabel="Delete Workspace"
                confirmVariant="danger"
                isLoading={deleting}
                confirmText={workspace?.name}
            />
        </div>
    );
}
