"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    CheckCircle2, Clock, TrendingUp, Sparkles, ArrowRight, ListTodo, Plus, Target, Lock,
    Flame, CalendarDays, BarChart3, Zap
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { useTaskStore } from "@/features/tasks/store/useTaskStore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { billingApi, type BillingUsageResponse } from "@/features/billing/api";

export const dynamic = "force-dynamic";

const STAGGER_DELAYS = [
    "delay-0", "[animation-delay:80ms]", "[animation-delay:160ms]",
    "[animation-delay:240ms]", "[animation-delay:320ms]", "[animation-delay:400ms]",
    "delay-500",
];

/* ─── Animated Counter Hook ─── */
function useAnimatedCount(target: number, duration = 800) {
    const [count, setCount] = useState(0);
    const prevTarget = useRef(target);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const start = prevTarget.current;
        prevTarget.current = target;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(Math.floor(start + (target - start) * eased));
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [target, duration]);

    return count;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { tasks, isLoading, fetchTasks } = useTaskStore();
    const router = useRouter();

    const [usage, setUsage] = useState<BillingUsageResponse | null>(null);

    useEffect(() => {
        fetchTasks();
        billingApi.getUsage().then((u) => setUsage(u)).catch(() => {});
    }, [fetchTasks]);

    const usageMaxed = usage ? usage.used >= usage.monthlyLimit : false;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const highPriorityTasks = tasks.filter((t) => t.priority === "high" && t.status === "pending").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const animTotal = useAnimatedCount(totalTasks);
    const animCompleted = useAnimatedCount(completedTasks);
    const animPending = useAnimatedCount(tasks.filter((t) => t.status === "pending").length);
    const animHigh = useAnimatedCount(highPriorityTasks);

    const recentTasks = tasks.slice(0, 6);

    // Calculate streak (consecutive days with at least 1 task completed)
    const streak = useMemo(() => {
        if (completedTasks === 0) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let days = 0;
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dayStr = checkDate.toISOString().split("T")[0];
            const hasCompleted = tasks.some(
                (t) => t.status === "completed" && t.created_at && t.created_at.startsWith(dayStr)
            );
            if (hasCompleted) days++;
            else if (i > 0) break;
        }
        return days;
    }, [tasks, completedTasks]);

    // Weekly overview data (last 7 days)
    const weeklyData = useMemo(() => {
        const data: { label: string; created: number; completed: number }[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dayStr = d.toISOString().split("T")[0];
            const label = d.toLocaleDateString(undefined, { weekday: "short" });
            const created = tasks.filter((t) => t.created_at?.startsWith(dayStr)).length;
            const completed = tasks.filter((t) => t.status === "completed" && t.created_at?.startsWith(dayStr)).length;
            data.push({ label, created, completed });
        }
        return data;
    }, [tasks]);

    const maxWeeklyVal = Math.max(1, ...weeklyData.map((d) => Math.max(d.created, d.completed)));

    if (isLoading && tasks.length === 0) {
        return <PageLoader />;
    }

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: "Good morning", emoji: "☀️" };
        if (hour < 17) return { text: "Good afternoon", emoji: "🌤️" };
        return { text: "Good evening", emoji: "🌙" };
    };

    const greet = greeting();
    const circleRadius = 52;
    const circumference = 2 * Math.PI * circleRadius;
    const progressOffset = circumference - (completionRate / 100) * circumference;

    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-fade-in relative z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                        {greet.text}, <span className="gradient-text">{user?.name?.split(" ")[0] || "there"}</span> <span className="inline-block animate-float">{greet.emoji}</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Here&apos;s a quick overview of your productivity today.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-3 self-start md:self-auto">
                    <Button variant="secondary" onClick={() => router.push('/ai-planning')} icon={<Sparkles className="h-4 w-4 text-accent" />}>AI Plan</Button>
                    <Button variant="primary" onClick={() => router.push('/tasks')} icon={<Plus className="h-4 w-4" />}>New Task</Button>
                </div>
            </div>

            {/* ─── Stat Cards with Animated Counters ─── */}
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Tasks" value={animTotal} icon={<ListTodo className="h-5 w-5" />} sparklineData={weeklyData.map(d => d.created)} />
                <StatCard title="Completed" value={animCompleted} icon={<CheckCircle2 className="h-5 w-5" />} trend={`${completionRate}% rate`} sparklineData={weeklyData.map(d => d.completed)} />
                <StatCard title="Pending" value={animPending} icon={<Clock className="h-5 w-5" />} />
                <StatCard title="High Priority" value={animHigh} icon={<Target className="h-5 w-5" />} />
            </div>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
                {/* ─── Activity Timeline ─── */}
                <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl p-4 sm:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Activity Timeline</h2>
                            <p className="text-sm text-muted-foreground mt-1">Your latest actions and progress.</p>
                        </div>
                        <Link href="/tasks" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 hover:border-primary/20">
                            View all <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {recentTasks.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50 animate-float">
                                <ListTodo className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">No tasks to show</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">Get started by creating your first task or using our AI planner.</p>
                            <Button className="mt-6" variant="primary" onClick={() => router.push('/tasks')}>Create Task</Button>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/30 via-border/50 to-transparent rounded-full" />

                            <div className="space-y-1">
                                {recentTasks.map((task, i) => (
                                    <div
                                        key={task.id}
                                        className={`group flex items-start gap-4 sm:gap-5 rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:bg-muted/40 animate-stagger-in relative ${STAGGER_DELAYS[i] || ""}`}
                                    >
                                        {/* Timeline node */}
                                        <div className={`relative z-10 flex shrink-0 h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 ${task.status === "completed"
                                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 shadow-sm shadow-emerald-500/10"
                                            : task.status === "in_progress"
                                            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50"
                                            : "bg-muted text-muted-foreground border border-border"
                                            }`}>
                                            {task.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : task.status === "in_progress" ? <Zap className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className={`text-sm sm:text-base font-semibold truncate transition-colors ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary"}`}>
                                                    {task.title}
                                                </p>
                                                {task.priority === "high" && task.status !== "completed" && (
                                                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 border border-red-500/20">Urgent</span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 mt-1.5 overflow-hidden">
                                                <span className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1.5">
                                                    <Target className="h-3.5 w-3.5 shrink-0" />
                                                    <span className="truncate">{task.category || 'General'}</span>
                                                </span>
                                                <div className="h-3 w-px bg-border/80 hidden sm:block" />
                                                <span className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1.5 truncate">
                                                    <Clock className="h-3.5 w-3.5 shrink-0" />
                                                    {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="shrink-0 mt-1">
                                            <span className={`inline-flex shrink-0 items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${task.priority === "high"
                                                ? "bg-red-50 text-red-600 ring-red-500/20 dark:bg-red-900/20 dark:text-red-400"
                                                : task.priority === "medium"
                                                    ? "bg-amber-50 text-amber-600 ring-amber-500/20 dark:bg-amber-900/20 dark:text-amber-400"
                                                    : "bg-blue-50 text-blue-600 ring-blue-500/20 dark:bg-blue-900/20 dark:text-blue-400"
                                                }`}>
                                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Right Column ─── */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Productivity Ring */}
                    <div className="rounded-2xl sm:rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl p-4 sm:p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-32 h-32" /></div>
                        <h3 className="text-lg font-bold tracking-tight mb-2 relative z-10">Productivity Rate</h3>
                        <p className="text-sm text-muted-foreground mb-6 relative z-10">Your completion goals</p>
                        <div className="flex justify-center relative z-10 mb-4">
                            <div className="relative">
                                {totalTasks === 0 ? (
                                    <>
                                        <svg className="w-32 h-32" viewBox="0 0 120 120">
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r={circleRadius}
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeDasharray="8 6"
                                                className="text-muted-foreground/30"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                                            <span className="text-sm font-bold text-muted-foreground">No tasks yet</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r={circleRadius} stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/50" />
                                            {/* 80% target marker */}
                                            <circle cx="60" cy="60" r={circleRadius} stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" className="text-primary/20" strokeDashoffset={circumference - (0.8 * circumference)} />
                                            <circle
                                                cx="60" cy="60" r={circleRadius}
                                                stroke="url(#progressGradient)"
                                                strokeWidth="8" fill="none" strokeLinecap="round"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={progressOffset}
                                                className="transition-all duration-1000 ease-out animate-draw-stroke"
                                            />
                                            <defs>
                                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="var(--primary)" />
                                                    <stop offset="100%" stopColor="var(--accent)" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black tabular-nums tracking-tighter">{completionRate}%</span>
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Complete</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {totalTasks === 0 ? (
                            <p className="text-xs text-muted-foreground text-center relative z-10">
                                Create your first task to track progress.
                            </p>
                        ) : (
                            <div className="flex items-center justify-between z-10 relative text-sm">
                                <span className="font-medium text-muted-foreground">{completedTasks} of {totalTasks} done</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{completionRate}% rate</span>
                            </div>
                        )}
                    </div>

                    {/* ─── Streak Counter ─── */}
                    <div className="rounded-2xl sm:rounded-3xl border border-border/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/5 backdrop-blur-xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                                    <Flame className="h-4 w-4 text-orange-500" /> Activity Streak
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Consecutive productive days</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-3xl font-black tabular-nums text-orange-600 dark:text-orange-400">{streak}</span>
                                <span className="text-xs font-bold text-muted-foreground uppercase">days</span>
                            </div>
                        </div>
                        <div className="flex gap-1 mt-4">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className={`flex-1 h-2 rounded-full transition-all ${i < streak ? "bg-gradient-to-r from-orange-400 to-amber-400 shadow-sm shadow-orange-500/20" : "bg-border/50"}`} />
                            ))}
                        </div>
                    </div>

                    {/* ─── Weekly Overview Chart ─── */}
                    <div className="rounded-2xl sm:rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl p-4 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-muted-foreground" /> Weekly Overview
                            </h3>
                            <div className="flex items-center gap-3 text-[10px] font-bold">
                                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" />Created</span>
                                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Done</span>
                            </div>
                        </div>
                        <div className="flex items-end gap-1.5 h-24">
                            {weeklyData.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="w-full flex gap-0.5 items-end h-16">
                                        <div
                                            className={`flex-1 bg-primary/20 rounded-t-sm transition-all duration-500 min-h-[2px] ${STAGGER_DELAYS[i] || ""}`}
                                            data-height={`${(day.created / maxWeeklyVal) * 100}%`}
                                            ref={(el) => { if (el) el.style.height = `${(day.created / maxWeeklyVal) * 100}%`; }}
                                        />
                                        <div
                                            className={`flex-1 bg-emerald-500/30 rounded-t-sm transition-all duration-500 min-h-[2px] ${STAGGER_DELAYS[i] || ""}`}
                                            data-height={`${(day.completed / maxWeeklyVal) * 100}%`}
                                            ref={(el) => { if (el) el.style.height = `${(day.completed / maxWeeklyVal) * 100}%`; }}
                                        />
                                    </div>
                                    <span className="text-[9px] font-bold text-muted-foreground/60">{day.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Quick Tools ─── */}
                    <div className="rounded-2xl sm:rounded-3xl border border-border/50 bg-gradient-to-b from-card to-background p-4 sm:p-6 shadow-sm">
                        <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" /> Quick Tools
                        </h3>
                        <div className="grid gap-2.5">
                            <Link
                              href={usageMaxed ? "/pricing" : "/ai-planning"}
                              className={`group flex items-center justify-between rounded-2xl border p-3.5 transition-all hover:-translate-y-0.5 ${usageMaxed ? "opacity-60 border-amber-200 bg-amber-50/30 dark:bg-amber-900/10 hover:bg-amber-50/50" : "border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110 ${usageMaxed ? "bg-amber-500/10 text-amber-500" : "bg-primary text-primary-foreground shadow-primary/20"}`}>
                                        {usageMaxed ? <Lock className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{usageMaxed ? "AI Limit Reached" : "AI Generation"}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            {usageMaxed ? "Upgrade to continue" : "Auto-build tasks"}
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link href="/analytics" className="group flex items-center justify-between rounded-2xl border border-border p-3.5 transition-all hover:bg-muted hover:-translate-y-0.5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition-transform group-hover:scale-110">
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Analytics</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">Dive into charts</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
