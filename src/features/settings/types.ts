// ─── Profile ────────────────────────────────────────────────────

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
    email_confirmed: boolean;
    bio: string | null;
    timezone: string | null;
    language: string;
    notification_preferences: NotificationPreferences;
    created_at: string;
    updated_at: string;
}

export interface ProfileFormValues {
    full_name: string;
    bio: string;
    timezone: string;
    language: string;
}

// ─── Notifications ──────────────────────────────────────────────

export interface NotificationPreferences {
    taskAssigned: boolean;
    taskDue: boolean;
    commentMention: boolean;
    memberJoined: boolean;
    aiCompleted: boolean;
    weeklySummary: boolean;
    overdueReminders: boolean;
    teamDigest: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
    taskAssigned: true,
    taskDue: true,
    commentMention: true,
    memberJoined: false,
    aiCompleted: true,
    weeklySummary: false,
    overdueReminders: false,
    teamDigest: false,
};

// ─── Appearance ─────────────────────────────────────────────────

export type ThemeOption = "light" | "dark" | "system";
export type SidebarStyle = "default" | "compact" | "minimal";
export type FontSize = "default" | "comfortable" | "compact";
export type AccentColor = "blue" | "violet" | "green" | "orange" | "pink" | "red";

export interface AppearancePreferences {
    sidebarStyle: SidebarStyle;
    accentColor: AccentColor;
    fontSize: FontSize;
}

export const DEFAULT_APPEARANCE: AppearancePreferences = {
    sidebarStyle: "default",
    accentColor: "violet",
    fontSize: "default",
};

export const ACCENT_COLORS: Record<AccentColor, { label: string; light: string; dark: string }> = {
    blue:   { label: "Blue",   light: "#3b82f6", dark: "#60a5fa" },
    violet: { label: "Violet", light: "#8b5cf6", dark: "#a78bfa" },
    green:  { label: "Green",  light: "#22c55e", dark: "#4ade80" },
    orange: { label: "Orange", light: "#f97316", dark: "#fb923c" },
    pink:   { label: "Pink",   light: "#ec4899", dark: "#f472b6" },
    red:    { label: "Red",    light: "#ef4444", dark: "#f87171" },
};

// ─── Workspace ──────────────────────────────────────────────────

export interface Workspace {
    id: string;
    name: string;
    logo_url: string | null;
    slug: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export interface WorkspaceFormValues {
    name: string;
    slug: string;
}

export interface WorkspaceMember {
    id: string;
    workspace_id: string;
    user_id: string;
    role: "owner" | "admin" | "member" | "viewer";
    joined_at: string;
    // Joined from profiles
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
}

export interface WorkspaceInvite {
    id: string;
    workspace_id: string;
    email: string;
    role: "admin" | "member" | "viewer";
    invited_by: string;
    created_at: string;
    accepted_at: string | null;
}

// ─── API Keys ───────────────────────────────────────────────────

export interface ApiKey {
    id: string;
    user_id: string;
    workspace_id: string;
    name: string;
    key_hash: string;
    preview: string;
    last_used_at: string | null;
    created_at: string;
    revoked_at: string | null;
}

// ─── Security ───────────────────────────────────────────────────

export interface ConnectedAccount {
    provider: "google" | "github";
    connected: boolean;
}

export interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// ─── User Settings (General Preferences) ────────────────────────

export type TaskViewOption = "grid" | "list" | "kanban";
export type WeekStart = "sunday" | "monday";
export type DateFormatOption = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
export type TimeFormatOption = "12h" | "24h";

export interface UserSettings {
    defaultTaskView: TaskViewOption;
    defaultPriority: "low" | "medium" | "high";
    autoMarkCompleted: boolean;
    taskSounds: boolean;
    compactMode: boolean;
    startOfWeek: WeekStart;
    dateFormat: DateFormatOption;
    timeFormat: TimeFormatOption;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    defaultTaskView: "grid",
    defaultPriority: "medium",
    autoMarkCompleted: false,
    taskSounds: true,
    compactMode: false,
    startOfWeek: "monday",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
};
