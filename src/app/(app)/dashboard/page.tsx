"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    CheckCircle2, Clock, TrendingUp, Sparkles, ArrowRight, ListTodo, Plus, Target,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { useTaskStore } from "@/features/tasks/store/useTaskStore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
    const { user } = useAuth();
    const { tasks, isLoading, fetchTasks } = useTaskStore();
    const router = useRouter();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const pendingTasks = tasks.filter((t) => t.status === "pending").length;
    const highPriorityTasks = tasks.filter((t) => t.priority === "high" && t.status === "pending").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const recentTasks = tasks.slice(0, 5);

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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Tasks" value={totalTasks} icon={<ListTodo className="h-5 w-5" />} />
                <StatCard title="Completed" value={completedTasks} icon={<CheckCircle2 className="h-5 w-5" />} trend={`${completionRate}% rate`} />
                <StatCard title="Pending" value={pendingTasks} icon={<Clock className="h-5 w-5" />} />
                <StatCard title="High Priority" value={highPriorityTasks} icon={<Target className="h-5 w-5" />} />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl p-4 sm:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
                            <p className="text-sm text-muted-foreground mt-1">Your latest added or modified actions.</p>
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
                        <div className="space-y-3">
                            {recentTasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className="group flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-5 rounded-2xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 sm:p-5 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-800/80 hover:shadow-md hover:-translate-y-0.5 animate-stagger-in"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    <div className={`flex shrink-0 h-10 w-10 items-center justify-center rounded-xl transition-colors ${task.status === "completed"
                                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                                        : "bg-muted text-muted-foreground border border-border"
                                        }`}>
                                        {task.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0 w-[calc(100%-3.5rem)] sm:w-auto pr-0 sm:pr-4">
                                        <p className={`text-base font-semibold truncate transition-colors ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary"}`}>
                                            {task.title}
                                        </p>
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
                                    <div className="w-full sm:w-auto mt-2 sm:mt-0 flex shrink-0">
                                        <span className={`inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset w-full sm:w-auto ${task.priority === "high"
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
                    )}
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="rounded-2xl sm:rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl p-4 sm:p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-32 h-32" /></div>
                        <h3 className="text-lg font-bold tracking-tight mb-2 relative z-10">Productivity Rate</h3>
                        <p className="text-sm text-muted-foreground mb-6 relative z-10">Your completion goals</p>
                        <div className="flex justify-center relative z-10 mb-4">
                            <div className="relative">
                                <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r={circleRadius} stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/50" />
                                    <circle cx="60" cy="60" r={circleRadius} stroke="url(#progressGradient)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={progressOffset} className="transition-all duration-1000 ease-out" />
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="var(--primary)" />
                                            <stop offset="100%" stopColor="var(--accent)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-black tabular-nums tracking-tighter">{completionRate}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between z-10 relative text-sm">
                            <span className="font-medium text-muted-foreground">{completedTasks} of {totalTasks} done</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{completionRate}% rate</span>
                        </div>
                    </div>

                    <div className="rounded-2xl sm:rounded-3xl border border-border/50 bg-gradient-to-b from-card to-background p-4 sm:p-8 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight mb-6">Quick Tools</h3>
                        <div className="grid gap-3">
                            <Link href="/ai-planning" className="group flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10 hover:border-primary/30 hover:-translate-y-0.5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">AI Generation</p>
                                        <p className="text-xs text-muted-foreground pr-2 font-medium">Auto-build tasks</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link href="/analytics" className="group flex items-center justify-between rounded-2xl border border-border p-4 transition-all hover:bg-muted hover:-translate-y-0.5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition-transform group-hover:scale-110">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Analytics</p>
                                        <p className="text-xs text-muted-foreground pr-2 font-medium">Dive into charts</p>
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
