"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Plus, ListTodo, SlidersHorizontal, Search, CheckCircle2, Sparkles, X, Flag, Clock } from "lucide-react";
import { useTaskStore } from "@/features/tasks/store/useTaskStore";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { TaskFormModal } from "@/features/tasks/components/TaskFormModal";
import { TaskEditModal } from "@/features/tasks/components/TaskEditModal";
import { ReprioritizeModal } from "@/features/ai/components/ReprioritizeModal";
import { aiApi } from "@/features/ai/services/aiApi";
import type { ReprioritizeSuggestion } from "@/features/ai/services/aiApi";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import type { ClientTask } from "@/features/tasks/services/taskApi";

type StatusFilter = "all" | "pending" | "completed";
type PriorityFilter = "all" | "low" | "medium" | "high";

export const dynamic = "force-dynamic";

export default function TasksPage() {
    const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<ClientTask | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    // Reprioritize state
    const [isReprioritizing, setIsReprioritizing] = useState(false);
    const [reprioritizeSuggestions, setReprioritizeSuggestions] = useState<ReprioritizeSuggestion[]>([]);
    const [isReprioritizeModalOpen, setIsReprioritizeModalOpen] = useState(false);
    const [reprioritizeError, setReprioritizeError] = useState<string | null>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Use useCallback for event handlers passed to child components to prevent re-renders
    const handleToggleStatus = useCallback((id: string, currentStatus: "pending" | "in_progress" | "completed") => {
        updateTask(id, { status: currentStatus === "completed" ? "pending" : "completed" });
    }, [updateTask]);

    const handleDelete = useCallback((id: string) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTask(id);
        }
    }, [deleteTask]);

    const handleEdit = useCallback((task: ClientTask) => {
        setEditingTask(task);
    }, []);

    const handleEditSubmit = useCallback(async (id: string, updates: Partial<Pick<ClientTask, "title" | "description" | "priority" | "assigned_to" | "pending_reason">>) => {
        await updateTask(id, updates);
    }, [updateTask]);

    const handleReprioritize = async () => {
        if (tasks.length === 0) return;
        setIsReprioritizing(true);
        setReprioritizeError(null);
        try {
            const taskData = tasks
                .filter((t) => t.status !== "completed")
                .map((t) => ({
                    id: t.id,
                    title: t.title,
                    description: t.description || "",
                    priority: t.priority,
                    status: t.status,
                }));
            const suggestions = await aiApi.reprioritizeTasks(taskData);
            setReprioritizeSuggestions(suggestions);
            setIsReprioritizeModalOpen(true);
        } catch (err: unknown) {
            setReprioritizeError(err instanceof Error ? err.message : "Failed to get AI suggestions");
        } finally {
            setIsReprioritizing(false);
        }
    };

    const handleApplyReprioritize = async (changes: Array<{ taskId: string; priority: string }>) => {
        for (const change of changes) {
            await updateTask(change.taskId, { priority: change.priority as "low" | "medium" | "high" });
        }
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesStatus = statusFilter === "all" || task.status === statusFilter;
            const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
            const matchesSearch = task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                (task.description?.toLowerCase() || "").includes(debouncedSearchQuery.toLowerCase());
            return matchesStatus && matchesPriority && matchesSearch;
        });
    }, [tasks, statusFilter, priorityFilter, debouncedSearchQuery]);

    const statusCounts = useMemo(() => ({
        all: tasks.length,
        pending: tasks.filter(t => t.status === "pending").length,
        completed: tasks.filter(t => t.status === "completed").length,
    }), [tasks]);

    const priorityCounts = useMemo(() => ({
        all: tasks.length,
        low: tasks.filter(t => t.priority === "low").length,
        medium: tasks.filter(t => t.priority === "medium").length,
        high: tasks.filter(t => t.priority === "high").length,
    }), [tasks]);

    if (isLoading && tasks.length === 0) {
        return <PageLoader />;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-fade-in relative z-10 w-full overflow-x-hidden">
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-overlay" />

            <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 shadow-sm mb-2">
                    <ListTodo className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Master Database</span>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-end justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tighter">
                            Active <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Workspaces.</span>
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed mt-2">
                            Manage your priorities, organize categories, and track progress all in one place.
                        </p>
                    </div>
                    <div className="flex gap-2 sm:gap-3 shrink-0 w-full md:w-auto min-w-0">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleReprioritize}
                            isLoading={isReprioritizing}
                            disabled={tasks.filter(t => t.status !== "completed").length === 0}
                            icon={!isReprioritizing ? <Sparkles className="h-4 w-4 text-accent shrink-0" /> : undefined}
                            className="flex-1 md:flex-none truncate text-sm px-2 sm:px-4"
                        >
                            <span className="truncate">AI Reprioritize</span>
                        </Button>
                        <Button size="lg" onClick={() => setIsModalOpen(true)} icon={<Plus className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />} className="shadow-xl shadow-primary/20 hover:shadow-primary/30 flex-1 md:flex-none truncate text-sm px-2 sm:px-4">
                            <span className="truncate">Create Action Item</span>
                        </Button>
                    </div>
                </div>

                {/* Reprioritize error toast */}
                {reprioritizeError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10 p-3 flex items-center gap-3 animate-slide-up">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400 flex-1">{reprioritizeError}</p>
                        <button onClick={() => setReprioritizeError(null)} className="text-xs font-bold text-red-500 hover:underline shrink-0">Dismiss</button>
                    </div>
                )}
            </div>

            {/* Controls Bar - Improved UI */}
            <div className="relative z-10 flex flex-col gap-3 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-sm">

                {/* Search Row */}
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                        type="search"
                        placeholder="Search tasks by title or context..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background/50 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3">

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Status</span>
                        <div className="flex items-center bg-muted/60 rounded-xl p-1 border border-border/50">
                            {(["all", "pending", "completed"] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${statusFilter === s
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {s === "all" && <SlidersHorizontal className="h-3 w-3" />}
                                    {s === "pending" && <Clock className="h-3 w-3" />}
                                    {s === "completed" && <CheckCircle2 className="h-3 w-3" />}
                                    <span className="capitalize">{s}</span>
                                    <span className={`text-[10px] font-bold rounded-full px-1 min-w-[16px] text-center ${statusFilter === s
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground/60"
                                        }`}>
                                        {statusCounts[s]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-6 w-px bg-border hidden sm:block" />

                    {/* Priority Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Priority</span>
                        <div className="flex items-center bg-muted/60 rounded-xl p-1 border border-border/50">
                            {(["all", "low", "medium", "high"] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPriorityFilter(p)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${priorityFilter === p
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {p === "high" && priorityFilter === p && <Flag className="h-3 w-3 text-red-500" />}
                                    {p === "medium" && priorityFilter === p && <Flag className="h-3 w-3 text-amber-500" />}
                                    {p === "low" && priorityFilter === p && <Flag className="h-3 w-3 text-blue-500" />}
                                    <span className="capitalize">{p}</span>
                                    <span className={`text-[10px] font-bold rounded-full px-1 min-w-[16px] text-center ${priorityFilter === p
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground/60"
                                        }`}>
                                        {priorityCounts[p]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active filters reset */}
                    {(statusFilter !== "all" || priorityFilter !== "all" || searchQuery) && (
                        <button
                            onClick={() => {
                                setStatusFilter("all");
                                setPriorityFilter("all");
                                setSearchQuery("");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                            <X className="h-3 w-3" />
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="relative z-10 rounded-2xl border border-red-200 bg-red-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 dark:border-red-900/50 dark:bg-red-900/10 animate-slide-up shadow-sm">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">Database synchronization issue: {error}</p>
                    <Button variant="outline" size="sm" onClick={() => fetchTasks()}>Force Sync Retry</Button>
                </div>
            )}

            <div className="relative z-10 flex items-center justify-between px-2 pt-2">
                <span className="text-sm font-bold tracking-tight text-muted-foreground uppercase">
                    Displaying <span className="text-foreground">{filteredTasks.length}</span> nodes
                </span>
                {statusFilter === 'all' && tasks.length > 0 && (
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 shadow-sm transition-transform hover:scale-105">
                        {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}% Execution Rate
                    </span>
                )}
            </div>

            {filteredTasks.length === 0 ? (
                <div className="relative z-10 flex flex-col items-center justify-center p-10 sm:p-20 rounded-2xl sm:rounded-[2rem] border border-dashed border-border/80 bg-background/50 backdrop-blur-md text-center animate-fade-in shadow-sm">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-8 ring-primary/5 transition-transform hover:scale-105 animate-float">
                        {statusFilter === 'completed' ? <CheckCircle2 className="h-12 w-12 text-primary" /> : <ListTodo className="h-12 w-12 text-primary text-opacity-80" />}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-3">No active nodes found</h3>
                    <p className="text-muted-foreground max-w-sm mb-10 font-medium">
                        {tasks.length === 0 ? "Your workspace is empty. Get started by initializing your first action item." : "No nodes match your current matrix filters."}
                    </p>
                    {tasks.length === 0 ? (
                        <Button size="lg" onClick={() => setIsModalOpen(true)} icon={<Plus className="h-5 w-5" />} className="shadow-lg shadow-primary/20">Initialize First Task</Button>
                    ) : (
                        <Button size="lg" variant="outline" onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); setSearchQuery(""); }}>Reset Matrix Filters</Button>
                    )}
                </div>
            ) : (
                <div className="relative z-10 grid gap-4 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 auto-rows-max items-start min-h-[400px]">
                    {filteredTasks.map((task, index) => (
                        <div key={task.id} className="animate-stagger-in">
                            <TaskCard task={task} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onEdit={handleEdit} />
                        </div>
                    ))}
                </div>
            )}

            <TaskFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={createTask} />
            <TaskEditModal task={editingTask} isOpen={editingTask !== null} onClose={() => setEditingTask(null)} onSubmit={handleEditSubmit} />
            <ReprioritizeModal
                isOpen={isReprioritizeModalOpen}
                onClose={() => setIsReprioritizeModalOpen(false)}
                suggestions={reprioritizeSuggestions}
                tasks={tasks}
                onApply={handleApplyReprioritize}
            />
        </div>
    );
}
