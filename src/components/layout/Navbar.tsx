"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
    Sparkles,
    Moon,
    Sun,
    Monitor,
    Bell,
    Menu,
    X,
    LogOut,
    Settings,
    CreditCard,
    ChevronDown,
    User,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Navbar() {
    const { user, handleLogout } = useAuth();
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const themeIcon = theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;

    const cycleTheme = () => {
        const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
        const currentIndex = themes.indexOf(theme);
        setTheme(themes[(currentIndex + 1) % themes.length]);
    };

    const onLogout = async () => {
        await handleLogout();
        router.push("/");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-between h-full px-4 lg:px-6 max-w-[1600px] mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/20 transition-transform group-hover:scale-105 group-hover:rotate-3">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-black tracking-tighter hidden sm:block">Taskora AI</span>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={cycleTheme}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title={`Theme: ${theme}`}
                    >
                        {themeIcon}
                    </button>

                    {/* Notification Bell */}
                    <Link
                        href="/notifications"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
                    >
                        <Bell className="h-4 w-4" />
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-muted transition-colors"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold overflow-hidden shrink-0">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0)?.toUpperCase() || "U"
                                )}
                            </div>
                            <span className="text-sm font-semibold hidden sm:block max-w-[120px] truncate">
                                {user?.name || "User"}
                            </span>
                            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border/80 bg-card shadow-xl animate-scale-in p-2">
                                <div className="px-3 py-2.5 border-b border-border/50 mb-2">
                                    <p className="text-sm font-bold truncate">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>

                                <Link
                                    href="/settings"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <Settings className="h-4 w-4" /> Settings
                                </Link>
                                <Link
                                    href="/pricing"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <CreditCard className="h-4 w-4" /> Pricing
                                </Link>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <User className="h-4 w-4" /> Profile
                                </Link>

                                <div className="border-t border-border/50 mt-2 pt-2">
                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 border-b border-border bg-card shadow-xl animate-slide-up p-4 space-y-1">
                    {[
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Tasks", href: "/tasks" },
                        { label: "AI Planner", href: "/ai-planning" },
                        { label: "Analytics", href: "/analytics" },
                        { label: "Notifications", href: "/notifications" },
                        { label: "Settings", href: "/settings" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
