"use client";

import type { ClientTask } from "@/features/tasks/services/taskApi";
import { CheckCircle2, Circle, Clock, Trash2, Flag, Pencil, User, AlertCircle, Zap } from "lucide-react";

interface TaskCardProps {
    task: ClientTask;
    onToggleStatus: (id: string, currentStatus: "pending" | "in_progress" | "completed") => void;
    onDelete: (id: string) => void;
    onEdit: (task: ClientTask) => void;
}

export function TaskCard({ task, onToggleStatus, onDelete, onEdit }: TaskCardProps) {
    const isCompleted = task.status === "completed";
    const isInProgress = task.status === "in_progress";
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const now = new Date();
    const isPastDue = dueDate ? dueDate.getTime() < now.getTime() : false;
    const isDueSoon = dueDate ? !isPastDue && (dueDate.getTime() - now.getTime()) <= 48 * 60 * 60 * 1000 : false;

    const priorityStyles = {
        low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        medium: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 ring-1 ring-red-500/30",
    };

    const priorityGlows = {
        low: "",
        medium: "",
        high: "animate-glow-pulse",
    };

    return (
        <div
            className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-[1.5rem] border p-1 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden pointer-events-auto ${isCompleted
                ? "opacity-60 grayscale-[0.5] border-border/30 hover:grayscale-0 hover:opacity-100"
                : `border-border/50 hover:border-primary/30 z-10 hover:z-20 ${task.priority === "high" ? priorityGlows.high : ""}`
                }`}
        >
            {/* Priority accent line at top */}
            {!isCompleted && (
                <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full ${
                    task.priority === "high" ? "bg-gradient-to-r from-red-500/80 to-red-400/40" :
                    task.priority === "medium" ? "bg-gradient-to-r from-emerald-500/60 to-emerald-400/20" :
                    "bg-gradient-to-r from-blue-500/40 to-blue-400/10"
                }`} />
            )}

            <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 rounded-2xl sm:rounded-[1.5rem] pointer-events-none ${isCompleted ? "opacity-0" : "from-card to-background opacity-100 group-hover:from-primary/5 group-hover:to-transparent"
                }`} />

            <div className={`relative h-full rounded-[1.1rem] sm:rounded-[1.35rem] p-4 sm:p-6 lg:p-8 flex flex-col ${isCompleted ? "bg-background/40 border border-transparent" : "bg-card/40 backdrop-blur-md border border-border/20"
                }`}>
                <div className={`absolute -top-12 -right-12 h-24 w-24 rotate-45 transform pointer-events-none blur-2xl opacity-50 ${task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-emerald-500" : "bg-blue-500"
                    }`} />

                <div className="flex items-start gap-3 sm:gap-5">
                    <button
                        onClick={() => onToggleStatus(task.id, task.status)}
                        className={`mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-full group/btn ${isCompleted ? 'animate-scale-in text-emerald-500 shadow-lg shadow-emerald-500/20' : 'text-muted-foreground'}`}
                        aria-label={isCompleted ? "Mark pending" : "Mark completed"}
                    >
                        {isCompleted ? (
                            <div className="relative">
                                <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 fill-emerald-100 dark:fill-emerald-900/30 stroke-[1.5]" />
                            </div>
                        ) : (
                            <Circle className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground/30 stroke-2 group-hover/btn:text-primary transition-colors" />
                        )}
                    </button>

                    <div className="flex-1 space-y-2 min-w-0 pr-2 sm:pr-4">
                        <h3 className="flex items-center gap-2 flex-wrap">
                            {task.priority === 'high' && !isCompleted && (
                                <span className="inline-flex items-center justify-center p-1 rounded-md bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 animate-pulse-slow" title="Critical Priority">
                                    <Flag className="h-3.5 w-3.5 fill-current" />
                                </span>
                            )}
                            {isInProgress && (
                                <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-md bg-purple-100/80 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 text-xs font-bold border border-purple-200/50 dark:border-purple-800/30">
                                    <Zap className="h-3 w-3" /> In Progress
                                </span>
                            )}
                            <span
                                className={`text-base lg:text-lg font-bold leading-tight tracking-tight transition-all duration-300 break-words ${isCompleted ? "line-through text-muted-foreground decoration-2 decoration-muted-foreground/30" : "text-foreground group-hover:text-primary"}`}
                            >
                                {task.title}
                            </span>
                        </h3>

                        {task.description && (
                            <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium mt-1 transition-colors ${isCompleted ? 'text-muted-foreground/50' : 'text-muted-foreground/90'}`}>
                                {task.description}
                            </p>
                        )}

                        {/* Assigned To */}
                        {task.assigned_to && task.assigned_to.trim() !== '' && (
                            <div className="flex items-center gap-1.5 mt-2">
                                <User className="h-3.5 w-3.5 text-primary/70" />
                                <span className="text-xs font-semibold text-primary/80 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-md">
                                    {task.assigned_to}
                                </span>
                            </div>
                        )}

                        {/* Pending Reason */}
                        {!isCompleted && task.pending_reason && task.pending_reason.trim() !== '' && (
                            <div className="flex items-start gap-1.5 mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
                                <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                <span className="text-xs font-medium text-amber-700 dark:text-amber-400 leading-relaxed">
                                    {task.pending_reason}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 flex items-center justify-between pt-4 sm:pt-5 border-t border-border/40 pb-1 mt-auto">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`inline-flex items-center rounded-lg border px-2.5 sm:px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-colors ${priorityStyles[task.priority as keyof typeof priorityStyles]}`}>
                            {task.priority}
                        </span>

                        {task.category && task.category !== "General" && (
                            <span className="inline-flex items-center rounded-lg bg-muted/60 border border-border/50 px-2.5 sm:px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground shadow-sm">
                                {task.category}
                            </span>
                        )}

                        {dueDate && !isCompleted && (
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                    isPastDue
                                        ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30"
                                        : isDueSoon
                                            ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30"
                                            : "bg-muted/60 text-muted-foreground border-border/50"
                                }`}
                            >
                                <Clock className="h-3.5 w-3.5" />
                                {`Due ${dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                            </span>
                        )}

                        <span className="flex items-center text-xs font-bold text-muted-foreground/60 transition-colors group-hover:text-muted-foreground/80">
                            <Clock className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
                            {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-x-4 sm:group-hover:translate-x-0">
                        <button
                            onClick={() => onEdit(task)}
                            className="p-2 sm:p-2.5 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary hover:shadow-sm transition-all active:scale-95"
                            aria-label="Edit task"
                            title="Edit task"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="p-2 sm:p-2.5 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:shadow-sm dark:hover:bg-red-900/20 dark:hover:text-red-400 focus:opacity-100 focus:ring-2 focus:ring-red-500 transition-all active:scale-95"
                            aria-label="Delete task"
                            title="Delete task"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
