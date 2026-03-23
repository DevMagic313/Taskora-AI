"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

export default function DeleteAccountPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!user) return;
        setIsDeleting(true);
        try {
            const supabase = createClient();
            
            // Step 1: Delete all user tasks
            await supabase.from("tasks").delete().eq("user_id", user.id);
            
            // Step 2: Delete task logs
            await supabase.from("task_logs").delete().eq("user_id", user.id);
            
            // Step 3: Delete AI generation history
            await supabase.from("ai_generation_history").delete().eq("user_id", user.id);
            
            // Step 4: Delete workspaces owned by user
            await supabase.from("workspaces").delete().eq("owner_id", user.id);
            
            // Step 5: Delete profile
            await supabase.from("profiles").delete().eq("id", user.id);
            
            // Step 6: Sign out and delete auth user via API route
            await supabase.auth.signOut();
            
            // Step 7: Call our API route to delete the auth user
            await fetch("/api/account/delete", { method: "DELETE" });
            
            toast.success("Your account has been deleted.");
            router.push("/");
            // Fallback hard refresh to clear state
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete account. Please try again.");
            setIsDeleting(false);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <SettingsHeader 
                title="Delete Account" 
                description="Permanently remove your account and all associated data."
            />

            <SettingsCard danger={true}>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-red-500/10 rounded-full shrink-0 mt-1">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Delete Account</h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                This will permanently delete your account, all your tasks, workspaces, AI generation history, and all associated data. This action cannot be undone.
                            </p>
                            
                            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
                                <li>All tasks and task history</li>
                                <li>All workspaces and workspace data</li>
                                <li>AI generation history</li>
                                <li>Profile and account data</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                        <button
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={isDeleting}
                            className="h-10 rounded-lg bg-red-500 text-white px-6 text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <svg className="animate-spin -ml-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="h-4 w-4" />
                                    Delete My Account
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </SettingsCard>

            <ConfirmModal
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Are you absolutely sure?"
                description={`Please type your email address to confirm deletion of your account. This action is irreversible.`}
                confirmLabel="Delete Account Permanently"
                confirmVariant="danger"
                confirmText={user?.email || ""}
                isLoading={isDeleting}
            />
        </div>
    );
}
