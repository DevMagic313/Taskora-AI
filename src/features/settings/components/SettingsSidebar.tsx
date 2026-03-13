"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
    User,
    Palette,
    Bell,
    Building2,
    Users,
    ShieldCheck,
    Key,
    Webhook,
    Puzzle,
    Trash2,
    Lock,
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    comingSoon?: boolean;
    danger?: boolean;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const settingsNav: NavGroup[] = [
    {
        title: "Account",
        items: [
            { label: "Profile", href: "/settings/profile", icon: User },
            { label: "Appearance", href: "/settings/appearance", icon: Palette },
            { label: "Notifications", href: "/settings/notifications", icon: Bell },
            { label: "Security", href: "/settings/security", icon: Lock },
        ],
    },
    {
        title: "Workspace",
        items: [
            { label: "General", href: "/settings/workspace/general", icon: Building2 },
            { label: "Members", href: "/settings/members", icon: Users },
            { label: "Roles & Permissions", href: "/settings/roles", icon: ShieldCheck, comingSoon: true },
        ],
    },
    {
        title: "Developer",
        items: [
            { label: "API Keys", href: "/settings/api-keys", icon: Key },
            { label: "Webhooks", href: "/settings/webhooks", icon: Webhook, comingSoon: true },
            { label: "Integrations", href: "/settings/integrations", icon: Puzzle, comingSoon: true },
        ],
    },
    {
        title: "Danger",
        items: [
            { label: "Delete Account", href: "/settings/delete-account", icon: Trash2, danger: true, comingSoon: true },
        ],
    },
];

export function SettingsSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    const initials = user?.name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    return (
        <>
            {/* ─── Desktop Sidebar ─── */}
            <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] border-r border-border/50 bg-card/30 backdrop-blur-sm overflow-y-auto">
                {/* User info */}
                <div className="p-5 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                        </div>
                    </div>
                </div>

                {/* Nav Groups */}
                <nav className="flex-1 p-3 space-y-5">
                    {settingsNav.map((group) => (
                        <div key={group.title}>
                            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                {group.title}
                            </p>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    if (item.comingSoon) {
                                        return (
                                            <div
                                                key={item.href}
                                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-not-allowed opacity-40 select-none ${
                                                    item.danger ? "text-red-500" : "text-muted-foreground"
                                                }`}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{item.label}</span>
                                                <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                                                    Soon
                                                </span>
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : item.danger
                                                    ? "text-red-500 hover:bg-red-500/10"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                        >
                                            <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                                            <span className="truncate">{item.label}</span>
                                            {isActive && (
                                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* ─── Mobile Horizontal Tab Bar ─── */}
            <div className="lg:hidden border-b border-border/50 bg-card/50 backdrop-blur-sm overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-1 px-4 py-2 min-w-max">
                    {settingsNav.flatMap((group) =>
                        group.items.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            if (item.comingSoon) {
                                return (
                                    <div
                                        key={item.href}
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs cursor-not-allowed opacity-40 whitespace-nowrap"
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        {item.label}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : item.danger
                                            ? "text-red-500"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {item.label}
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}
