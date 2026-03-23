"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { 
  Users, UserPlus, Trash2, Crown, Shield, 
  User, Eye, Mail, Loader2 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SettingsToggleSkeleton } from "@/components/ui/SettingsSkeleton";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "member", "viewer"]),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface Member {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "member" | "viewer";
  joined_at: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface Workspace {
  id: string;
  name: string;
  owner_id: string;
}

const ROLE_CONFIG = {
  owner: { 
    label: "Owner", 
    icon: Crown, 
    color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40" 
  },
  admin: { 
    label: "Admin", 
    icon: Shield, 
    color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40" 
  },
  member: { 
    label: "Member", 
    icon: User, 
    color: "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40" 
  },
  viewer: { 
    label: "Viewer", 
    icon: Eye, 
    color: "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800/40" 
  },
};

export default function MembersPage() {
  const { user } = useAuth();
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<Member | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "member" },
  });

  const loadData = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    setLoading(true);
    try {
      // Load workspace
      const { data: ws } = await supabase
        .from("workspaces")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();
      
      if (!ws) {
        setLoading(false);
        return;
      }
      setWorkspace(ws);

      // Query 1: Get workspace members
      const { data: membersData, error: membersError } = await supabase
        .from("workspace_members")
        .select("id, user_id, role, joined_at")
        .eq("workspace_id", ws.id);

      if (membersError) throw membersError;

      // Query 2: Get profiles for each member separately
      const userIds = (membersData || []).map((m: any) => m.user_id);

      let profilesMap: Record<string, any> = {};

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", userIds);

        profilesMap = (profilesData || []).reduce((acc: any, p: any) => {
          acc[p.id] = p;
          return acc;
        }, {});
      }

      // Combine members with their profiles
      const mappedMembers = (membersData || []).map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        role: m.role,
        joined_at: m.joined_at,
        full_name: profilesMap[m.user_id]?.full_name || null,
        email: profilesMap[m.user_id]?.email || null,
        avatar_url: profilesMap[m.user_id]?.avatar_url || null,
      }));
      setMembers(mappedMembers);

      // Load pending invites
      const { data: invitesData } = await supabase
        .from("workspace_invites")
        .select("*")
        .eq("workspace_id", ws.id)
        .is("accepted_at", null);
      setInvites(invitesData || []);

    } catch (err) {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleInvite = async (values: InviteFormValues) => {
    const supabase = createClient();
    if (!workspace) {
      toast.error("Please create a workspace first in Settings → General");
      return;
    }
    setInviting(true);
    try {
      // Check if already invited
      const existing = invites.find(i => i.email === values.email);
      if (existing) {
        toast.error("This email has already been invited");
        return;
      }
      
      // Check if already a member
      const existingMember = members.find(m => m.email === values.email);
      if (existingMember) {
        toast.error("This user is already a member");
        return;
      }

      const { error } = await supabase
        .from("workspace_invites")
        .insert({
          workspace_id: workspace.id,
          email: values.email,
          role: values.role,
          invited_by: user!.id,
        });

      if (error) throw error;

      toast.success(`Invitation sent to ${values.email}`);
      reset();
      await loadData();
    } catch (err) {
      toast.error("Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (member: Member) => {
    const supabase = createClient();
    if (member.role === "owner") {
      toast.error("Cannot remove the workspace owner");
      return;
    }
    setRemovingId(member.id);
    try {
      const { error } = await supabase
        .from("workspace_members")
        .delete()
        .eq("id", member.id);

      if (error) throw error;
      toast.success("Member removed successfully");
      await loadData();
    } catch (err) {
      toast.error("Failed to remove member");
    } finally {
      setRemovingId(null);
      setConfirmRemove(null);
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("workspace_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;
      toast.success("Role updated");
      await loadData();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("workspace_invites")
        .delete()
        .eq("id", inviteId);

      if (error) throw error;
      toast.success("Invitation cancelled");
      await loadData();
    } catch (err) {
      toast.error("Failed to cancel invitation");
    }
  };

  if (loading) return <SettingsToggleSkeleton rows={4} />;

  return (
    <div className="animate-fade-in">
      <SettingsHeader
        title="Members"
        description="Manage who has access to your workspace."
      />

      <div className="space-y-6">
        {/* No workspace warning */}
        {!workspace && (
          <SettingsCard>
            <div className="flex items-center gap-3 p-2">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/20 
                flex items-center justify-center">
                <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">No workspace found</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create a workspace in{" "}
                  <a href="/settings/workspace/general" 
                    className="text-primary underline">
                    Settings → General
                  </a>{" "}
                  before inviting members.
                </p>
              </div>
            </div>
          </SettingsCard>
        )}

        {/* Invite form */}
        <SettingsCard>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Invite a teammate</h3>
          </div>
          <form onSubmit={handleSubmit(handleInvite)} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 
                    h-4 w-4 text-muted-foreground" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="colleague@company.com"
                    className="h-10 w-full rounded-lg border border-border 
                      bg-background pl-9 pr-3 text-sm focus:outline-none 
                      focus:ring-2 focus:ring-ring transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <select
                {...register("role")}
                className="h-10 rounded-lg border border-border bg-background 
                  px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring 
                  transition-colors"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <Button 
                type="submit" 
                isLoading={inviting}
                disabled={!workspace}
                icon={!inviting ? <UserPlus className="h-4 w-4" /> : undefined}
              >
                Invite
              </Button>
            </div>
          </form>
        </SettingsCard>

        {/* Current members */}
        <SettingsCard>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">
              Members ({members.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No members yet. Invite your first teammate above.
              </p>
            ) : (
              members.map((member) => {
                const roleConfig = ROLE_CONFIG[member.role];
                const RoleIcon = roleConfig.icon;
                const isOwner = member.role === "owner";
                const isCurrentUser = member.user_id === user?.id;
                const initials = (member.full_name || member.email || "U")
                  .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

                return (
                  <div key={member.id} 
                    className="flex items-center gap-3 py-4 first:pt-2">
                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full bg-primary/10 
                      text-primary flex items-center justify-center 
                      text-xs font-bold shrink-0 overflow-hidden">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt="" 
                          className="h-full w-full object-cover" />
                      ) : initials}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {member.full_name || member.email || "Unknown"}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold bg-primary/10 
                            text-primary px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                    {/* Role badge / selector */}
                    {isOwner || isCurrentUser ? (
                      <span className={`inline-flex items-center gap-1 
                        rounded-full border px-2.5 py-1 text-xs font-bold 
                        ${roleConfig.color}`}>
                        <RoleIcon className="h-3 w-3" />
                        {roleConfig.label}
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                        className="h-8 rounded-lg border border-border 
                          bg-background px-2 text-xs focus:outline-none 
                          focus:ring-2 focus:ring-ring transition-colors"
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}
                    {/* Remove button */}
                    {!isOwner && !isCurrentUser && (
                      <button
                        onClick={() => setConfirmRemove(member)}
                        disabled={removingId === member.id}
                        className="h-8 w-8 rounded-lg flex items-center 
                          justify-center text-muted-foreground 
                          hover:bg-red-50 hover:text-red-600 
                          dark:hover:bg-red-900/20 dark:hover:text-red-400 
                          transition-colors disabled:opacity-50"
                      >
                        {removingId === member.id 
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />
                        }
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </SettingsCard>

        {/* Pending invites */}
        {invites.length > 0 && (
          <SettingsCard>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">
                Pending Invites ({invites.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {invites.map((invite) => (
                <div key={invite.id} 
                  className="flex items-center gap-3 py-3 first:pt-1">
                  <div className="h-9 w-9 rounded-full bg-muted flex 
                    items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {invite.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Invited as {invite.role} • {new Date(invite.created_at)
                        .toLocaleDateString(undefined, { 
                          month: "short", day: "numeric" 
                        })}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider 
                    bg-amber-50 text-amber-600 border border-amber-200 
                    dark:bg-amber-900/20 dark:text-amber-400 
                    dark:border-amber-800/40 px-2 py-1 rounded-full">
                    Pending
                  </span>
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center 
                      text-muted-foreground hover:bg-red-50 hover:text-red-600 
                      dark:hover:bg-red-900/20 dark:hover:text-red-400 
                      transition-colors"
                    title="Cancel invite"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </SettingsCard>
        )}
      </div>

      {/* Confirm remove modal */}
      <ConfirmModal
        open={confirmRemove !== null}
        onClose={() => setConfirmRemove(null)}
        onConfirm={() => confirmRemove && handleRemoveMember(confirmRemove)}
        title="Remove Member"
        description={`Are you sure you want to remove ${
          confirmRemove?.full_name || confirmRemove?.email
        } from your workspace? They will lose access immediately.`}
        confirmLabel="Remove Member"
        confirmVariant="danger"
        isLoading={removingId !== null}
      />
    </div>
  );
}
