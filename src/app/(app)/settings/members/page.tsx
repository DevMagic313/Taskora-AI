"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Users, Mail, Shield, UserMinus, UserPlus, Crown, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { SettingsTableSkeleton } from "@/components/ui/SettingsSkeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { WorkspaceMember, WorkspaceInvite } from "@/features/settings/types";

const ROLES = ["admin", "member", "viewer"] as const;

export default function MembersPage() {
    const { user } = useAuth();
    const supabase = createClient();

    const [members, setMembers] = useState<WorkspaceMember[]>([]);
    const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Invite form
    const [invEmail, setInvEmail] = useState("");
    const [invRole, setInvRole] = useState<"admin" | "member" | "viewer">("member");
    const [inviting, setInviting] = useState(false);

    // Remove
    const [removeTarget, setRemoveTarget] = useState<WorkspaceMember | null>(null);
    const [removing, setRemoving] = useState(false);

    const loadData = useCallback(async () => {
        if (!user) return;
        try {
            // Get workspace
            const { data: ws } = await supabase
                .from("workspaces")
                .select("id")
                .eq("owner_id", user.id)
                .single();

            if (!ws) {
                setLoading(false);
                return;
            }
            setWorkspaceId(ws.id);

            // Get members with profile info
            const { data: membersData } = await supabase
                .from("workspace_members")
                .select("*, profiles:user_id(full_name, avatar_url, email)")
                .eq("workspace_id", ws.id);

            if (membersData) {
                setMembers(
                    membersData.map((m: Record<string, unknown>) => {
                        const profile = m.profiles as Record<string, unknown> | null;
                        return {
                            ...m,
                            full_name: profile?.full_name ?? null,
                            avatar_url: profile?.avatar_url ?? null,
                            email: profile?.email ?? null,
                        } as WorkspaceMember;
                    })
                );
            }

            // Get pending invites
            const { data: invData } = await supabase
                .from("workspace_invites")
                .select("*")
                .eq("workspace_id", ws.id)
                .is("accepted_at", null);

            if (invData) setInvites(invData as WorkspaceInvite[]);
        } catch {
            toast.error("Failed to load members");
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const sendInvite = async () => {
        if (!workspaceId || !user || !invEmail.trim()) return;
        setInviting(true);
        try {
            const { error } = await supabase.from("workspace_invites").insert({
                workspace_id: workspaceId,
                email: invEmail.trim().toLowerCase(),
                role: invRole,
                invited_by: user.id,
            });
            if (error) throw error;
            toast.success(`Invite sent to ${invEmail}`);
            setInvEmail("");
            await loadData();
        } catch {
            toast.error("Failed to send invite");
        } finally {
            setInviting(false);
        }
    };

    const revokeInvite = async (inviteId: string) => {
        try {
            const { error } = await supabase
                .from("workspace_invites")
                .delete()
                .eq("id", inviteId);
            if (error) throw error;
            toast.success("Invite revoked");
            await loadData();
        } catch {
            toast.error("Failed to revoke invite");
        }
    };

    const changeRole = async (memberId: string, newRole: string) => {
        try {
            const { error } = await supabase
                .from("workspace_members")
                .update({ role: newRole })
                .eq("id", memberId);
            if (error) throw error;
            toast.success("Role updated");
            await loadData();
        } catch {
            toast.error("Failed to change role");
        }
    };

    const removeMember = async () => {
        if (!removeTarget) return;
        setRemoving(true);
        try {
            const { error } = await supabase
                .from("workspace_members")
                .delete()
                .eq("id", removeTarget.id);
            if (error) throw error;
            toast.success("Member removed");
            setRemoveTarget(null);
            await loadData();
        } catch {
            toast.error("Failed to remove member");
        } finally {
            setRemoving(false);
        }
    };

    if (loading) return <SettingsTableSkeleton rows={4} />;

    return (
        <div className="animate-fade-in">
            <SettingsHeader
                title="Members"
                description="Manage workspace members and invitations."
            />

            <div className="space-y-6">
                {/* Invite */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Invite Member</h3>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={invEmail}
                            onChange={(e) => setInvEmail(e.target.value)}
                            className="flex-1 h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="colleague@example.com"
                        />
                        <select
                            value={invRole}
                            onChange={(e) => setInvRole(e.target.value as typeof invRole)}
                            className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {ROLES.map((r) => (
                                <option key={r} value={r}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={sendInvite}
                            disabled={!invEmail.trim() || inviting}
                            className="h-10 rounded-lg bg-primary text-primary-foreground px-4 text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {inviting ? "Sending..." : "Send Invite"}
                        </button>
                    </div>

                    {/* Pending invites */}
                    {invites.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Pending Invites
                            </p>
                            {invites.map((inv) => (
                                <div
                                    key={inv.id}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-sm">{inv.email}</span>
                                        <span className="text-[10px] font-medium uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                            {inv.role}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => revokeInvite(inv.id)}
                                        className="text-xs text-red-500 hover:underline font-medium"
                                    >
                                        Revoke
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </SettingsCard>

                {/* Members Table */}
                <SettingsCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Members</h3>
                        <span className="text-xs text-muted-foreground">({members.length})</span>
                    </div>

                    {members.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No members yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Invite team members to collaborate
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {members.map((member) => {
                                const isSelf = member.user_id === user?.id;
                                const isOwner = member.role === "owner";
                                const initials = (member.full_name || "U")
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2);

                                return (
                                    <div key={member.id} className="flex items-center gap-4 py-3">
                                        {/* Avatar */}
                                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                            {member.avatar_url ? (
                                                <img src={member.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                                            ) : (
                                                initials
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium truncate">
                                                    {member.full_name || "Unknown"}
                                                </p>
                                                {isSelf && (
                                                    <span className="text-[9px] font-bold uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                                        You
                                                    </span>
                                                )}
                                                {isOwner && (
                                                    <Crown className="h-3.5 w-3.5 text-amber-500" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {member.email}
                                            </p>
                                        </div>

                                        {/* Role badge */}
                                        <span className="text-[10px] font-medium uppercase bg-muted text-muted-foreground px-2 py-1 rounded hidden sm:block">
                                            {member.role}
                                        </span>

                                        {/* Joined */}
                                        <span className="text-xs text-muted-foreground hidden md:block">
                                            {new Date(member.joined_at).toLocaleDateString()}
                                        </span>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {!isSelf && !isOwner && (
                                                <>
                                                    <select
                                                        value={member.role}
                                                        onChange={(e) => changeRole(member.id, e.target.value)}
                                                        className="h-8 rounded-md border border-border bg-background px-2 text-xs focus:outline-none"
                                                    >
                                                        {ROLES.map((r) => (
                                                            <option key={r} value={r}>
                                                                {r.charAt(0).toUpperCase() + r.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => setRemoveTarget(member)}
                                                        className="h-8 w-8 rounded-md flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        <UserMinus className="h-3.5 w-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </SettingsCard>
            </div>

            <ConfirmModal
                open={!!removeTarget}
                onClose={() => setRemoveTarget(null)}
                onConfirm={removeMember}
                title="Remove Member"
                description={`Are you sure you want to remove ${removeTarget?.full_name || removeTarget?.email} from this workspace?`}
                confirmLabel="Remove"
                confirmVariant="danger"
                isLoading={removing}
            />
        </div>
    );
}
