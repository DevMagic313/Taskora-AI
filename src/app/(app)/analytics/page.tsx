"use client";

import { useEffect } from "react";
import { BarChart3, CheckCircle2, Clock, ListTodo, TrendingUp, Activity } from "lucide-react";
import { useAnalyticsStore } from "@/features/analytics/store/useAnalyticsStore";
import { StatCard } from "@/components/ui/StatCard";
import { PageLoader } from "@/components/ui/LoadingSpinner";

export default function AnalyticsPage() {
    const { data, isLoading, error, fetchAnalytics } = useAnalyticsStore();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (isLoading && !data) return <PageLoader />;

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative z-10 w-full overflow-hidden">
            <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none mix-blend-overlay" />

            <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 shadow-sm mb-2">
                    <BarChart3 className="h-4 w-4 text-accent" />
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">Productivity Insights</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter">
                    Analytics <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Overview.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                    Track your progress, monitor completion rates, and understand your productivity patterns.
                </p>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400">
                    {error}
                </div>
            )}

            {data && (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Tasks" value={data.totalTasks} icon={<ListTodo className="h-5 w-5" />} />
                        <StatCard title="Completed" value={data.completedTasks} icon={<CheckCircle2 className="h-5 w-5" />} trend={`${data.completionRate}% rate`} />
                        <StatCard title="Pending" value={data.pendingTasks} icon={<Clock className="h-5 w-5" />} />
                        <StatCard title="Completion Rate" value={`${data.completionRate}%`} icon={<TrendingUp className="h-5 w-5" />} />
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Priority Breakdown */}
                        <div className="rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl p-8 shadow-sm">
                            <h3 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" /> Priority Distribution
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(data.priorityBreakdown).map(([priority, count]) => {
                                    const total = data.totalTasks || 1;
                                    const percent = Math.round((count / total) * 100);
                                    const colors: Record<string, string> = {
                                        high: "bg-red-500",
                                        medium: "bg-amber-500",
                                        low: "bg-blue-500",
                                    };
                                    return (
                                        <div key={priority}>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm font-bold capitalize">{priority}</span>
                                                <span className="text-sm font-bold text-muted-foreground">{count} ({percent}%)</span>
                                            </div>
                                            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-1000 ${colors[priority] || "bg-primary"}`} style={{ width: `${percent}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl p-8 shadow-sm">
                            <h3 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" /> Category Breakdown
                            </h3>
                            <div className="space-y-3">
                                {data.categoryBreakdown.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No categories yet.</p>
                                ) : (
                                    data.categoryBreakdown.map((cat) => (
                                        <div key={cat.category} className="flex items-center justify-between rounded-xl bg-muted/30 border border-border/40 px-4 py-3">
                                            <span className="text-sm font-bold">{cat.category}</span>
                                            <span className="text-sm font-black text-primary">{cat.count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" /> Recent Activity
                        </h3>
                        {data.recentActivity.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        ) : (
                            <div className="space-y-3">
                                {data.recentActivity.map((log) => (
                                    <div key={log._id} className="flex items-center gap-4 rounded-xl bg-muted/30 border border-border/40 px-4 py-3">
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${log.actionType === "completed" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                                                : log.actionType === "deleted" ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                                                    : "bg-primary/10 text-primary"
                                            }`}>
                                            {log.actionType === "completed" ? <CheckCircle2 className="h-4 w-4" /> : log.actionType === "created" ? "+" : "×"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{log.taskTitle}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{log.actionType} • {new Date(log.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
