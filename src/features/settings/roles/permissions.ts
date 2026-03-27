export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export interface RolePermissions {
  label: string;
  description: string;
  color: string;
  badgeColor: string;
  iconColor: string;
  permissions: {
    // Tasks
    createTask: boolean;
    editOwnTask: boolean;
    editAnyTask: boolean;
    deleteOwnTask: boolean;
    deleteAnyTask: boolean;
    viewTasks: boolean;
    // Members
    inviteMembers: boolean;
    removeMembers: boolean;
    changeMemberRole: boolean;
    // Workspace
    viewAnalytics: boolean;
    manageRoles: boolean;
    editWorkspace: boolean;
    deleteWorkspace: boolean;
  };
  canManageRole: (targetRole: WorkspaceRole) => boolean;
}

export const ROLE_PERMISSIONS: Record<WorkspaceRole, RolePermissions> = {
  owner: {
    label: "Owner",
    description: "Full control over the workspace and all its resources",
    color: "from-amber-500 to-orange-500",
    badgeColor:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40",
    iconColor: "text-amber-500",
    permissions: {
      createTask: true,
      editOwnTask: true,
      editAnyTask: true,
      deleteOwnTask: true,
      deleteAnyTask: true,
      viewTasks: true,
      inviteMembers: true,
      removeMembers: true,
      changeMemberRole: true,
      viewAnalytics: true,
      manageRoles: true,
      editWorkspace: true,
      deleteWorkspace: true,
    },
    canManageRole: (target) => target !== "owner",
  },
  admin: {
    label: "Admin",
    description: "Can manage members and tasks but cannot delete the workspace",
    color: "from-blue-500 to-indigo-500",
    badgeColor:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40",
    iconColor: "text-blue-500",
    permissions: {
      createTask: true,
      editOwnTask: true,
      editAnyTask: true,
      deleteOwnTask: true,
      deleteAnyTask: true,
      viewTasks: true,
      inviteMembers: true,
      removeMembers: true,
      changeMemberRole: true,
      viewAnalytics: true,
      manageRoles: false,
      editWorkspace: true,
      deleteWorkspace: false,
    },
    canManageRole: (target) => target === "member" || target === "viewer",
  },
  member: {
    label: "Member",
    description: "Can create and manage their own tasks",
    color: "from-emerald-500 to-green-500",
    badgeColor:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40",
    iconColor: "text-emerald-500",
    permissions: {
      createTask: true,
      editOwnTask: true,
      editAnyTask: false,
      deleteOwnTask: true,
      deleteAnyTask: false,
      viewTasks: true,
      inviteMembers: false,
      removeMembers: false,
      changeMemberRole: false,
      viewAnalytics: false,
      manageRoles: false,
      editWorkspace: false,
      deleteWorkspace: false,
    },
    canManageRole: () => false,
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access to view tasks and workspace content",
    color: "from-slate-500 to-gray-500",
    badgeColor:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/40",
    iconColor: "text-slate-500",
    permissions: {
      createTask: false,
      editOwnTask: false,
      editAnyTask: false,
      deleteOwnTask: false,
      deleteAnyTask: false,
      viewTasks: true,
      inviteMembers: false,
      removeMembers: false,
      changeMemberRole: false,
      viewAnalytics: false,
      manageRoles: false,
      editWorkspace: false,
      deleteWorkspace: false,
    },
    canManageRole: () => false,
  },
};

export const ROLE_ORDER: WorkspaceRole[] = [
  "owner",
  "admin",
  "member",
  "viewer",
];

export const PERMISSION_LABELS: Record<
  keyof RolePermissions["permissions"],
  { label: string; category: string }
> = {
  createTask: { label: "Create tasks", category: "Tasks" },
  editOwnTask: { label: "Edit own tasks", category: "Tasks" },
  editAnyTask: { label: "Edit any task", category: "Tasks" },
  deleteOwnTask: { label: "Delete own tasks", category: "Tasks" },
  deleteAnyTask: { label: "Delete any task", category: "Tasks" },
  viewTasks: { label: "View all tasks", category: "Tasks" },
  inviteMembers: { label: "Invite new members", category: "Members" },
  removeMembers: { label: "Remove members", category: "Members" },
  changeMemberRole: { label: "Change member roles", category: "Members" },
  viewAnalytics: { label: "View analytics", category: "Workspace" },
  manageRoles: { label: "Manage roles & permissions", category: "Workspace" },
  editWorkspace: { label: "Edit workspace settings", category: "Workspace" },
  deleteWorkspace: { label: "Delete workspace", category: "Workspace" },
};
