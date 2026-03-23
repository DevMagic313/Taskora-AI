"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ListTodo,
    Sparkles,
    BarChart3,
    Bell,
    CreditCard,
    Settings,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Tasks", href: "/tasks", icon: ListTodo },
    { label: "AI Planner", href: "/ai-planning", icon: Sparkles },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Pricing", href: "/pricing", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
];

const mobileNavItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Tasks", href: "/tasks", icon: ListTodo },
    { label: "AI", href: "/ai-planning", icon: Sparkles },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarStyle, setSidebarStyle] = useState<string>("default");

    useEffect(() => {
        const getStyle = () => {
            const root = document.documentElement;
            if (root.classList.contains("sidebar-minimal")) setSidebarStyle("minimal");
            else if (root.classList.contains("sidebar-compact")) setSidebarStyle("compact");
            else setSidebarStyle("default");
        };
        getStyle();
        const observer = new MutationObserver(getStyle);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const sidebarWidth = collapsed
        ? "w-16"
        : sidebarStyle === "minimal"
            ? "w-16"
            : sidebarStyle === "compact"
                ? "w-48"
                : "w-52 lg:w-64";

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 py-6 relative group ${sidebarWidth}`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-8 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground transition-colors"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <ChevronRight className="h-3.5 w-3.5" />
                    ) : (
                        <ChevronLeft className="h-3.5 w-3.5" />
                    )}
                </button>

                {/* Nav Links */}
                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group/link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    } ${sidebarStyle === "minimal" || collapsed ? "justify-center px-2" : ""}`}
                                title={collapsed || sidebarStyle === "minimal" ? item.label : undefined}
                            >
                                <Icon
                                    className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover/link:text-foreground"
                                        }`}
                                />
                                {(sidebarStyle !== "minimal" && !collapsed) && (
                                    <span className={`truncate ${sidebarStyle === "compact" ? "text-xs" : "text-sm"}`}>
                                        {item.label}
                                    </span>
                                )}
                                {(sidebarStyle !== "minimal" && !collapsed) && isActive && (
                                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Pro Card */}
                {sidebarStyle === "default" && !collapsed && (
                    <div className="mx-3 mt-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                Pro Features
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            Unlock advanced AI features and unlimited task generation.
                        </p>
                        <Link
                            href="/pricing"
                            className="group/btn inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                        >
                            Upgrade Now
                            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                        </Link>
                    </div>
                )}
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/80 backdrop-blur-xl safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    {mobileNavItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-colors ${isActive
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                                <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
                                {isActive && (
                                    <div className="absolute bottom-1 h-1 w-6 rounded-full bg-primary/60" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
