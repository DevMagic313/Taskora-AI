"use client";

import { useState, useEffect } from "react";
import { useTaskStore } from "@/features/tasks/store/useTaskStore";
import { type ClientTask } from "@/features/tasks/services/taskApi";
import {
    CheckCircle2, Clock, CalendarDays, AlignLeft, Flag, Type, AlertCircle,
    User, Target, Zap, Calendar, StickyNote, Activity, Circle, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: ClientTask | null;
}

const STEPS = [
    { id: 1, label: "Essentials", icon: Target },
    { id: 2, label: "Details", icon: Activity },
    { id: 3, label: "Schedule & Notes", icon: CalendarDays },
] as const;

export function TaskFormModal({ isOpen, onClose, task }: TaskFormModalProps) {
    const { createTask, updateTask } = useTaskStore();
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState<"forward" | "backward">("forward");

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [status, setStatus] = useState<"pending" | "in_progress" | "completed">("pending");
    const [assignedTo, setAssignedTo] = useState("");
    const [pendingReason, setPendingReason] = useState("");
    const [category, setCategory] = useState("General");
    const [dueDate, setDueDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [comments, setComments] = useState("");
    const [checked, setChecked] = useState(false);
    const [notes, setNotes] = useState("");
    const [remarks, setRemarks] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [animKey, setAnimKey] = useState(Math.random());

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setDirection("forward");
            if (task) {
                setTitle(task.title);
                setDescription(task.description || "");
                setPriority(task.priority);
                setStatus(task.status);
                setAssignedTo(task.assigned_to || "");
                setPendingReason(task.pending_reason || "");
                setCategory(task.category || "General");
                setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "");
                setStartDate(task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : "");
                setChecked(task.checked || false);
                setComments(task.comments || "");
                setNotes(task.notes || "");
                setRemarks(task.remarks || "");
            } else {
                setTitle("");
                setDescription("");
                setPriority("medium");
                setStatus("pending");
                setAssignedTo("");
                setPendingReason("");
                setCategory("General");
                setDueDate("");
                setStartDate("");
                setChecked(false);
                setComments("");
                setNotes("");
                setRemarks("");
            }
        }
    }, [isOpen, task]);


    // Simplified effect
    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                const form = document.getElementById("task-form") as HTMLFormElement;
                if (form) form.requestSubmit();
            }
        };
        window.addEventListener("keydown", keydown);
        return () => window.removeEventListener("keydown", keydown);
    }, [isOpen]);

    if (!isOpen) return null;

    const goToStep = (newStep: number) => {
        if (newStep === step) return;
        setDirection(newStep > step ? "forward" : "backward");
        setStep(newStep);
        setAnimKey(Math.random());
    };

    const priorities = [
        { value: "low" as const, label: "Routine", icon: Clock, color: "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:border-blue-400/30", glow: "shadow-blue-500/10", dotColor: "bg-blue-500" },
        { value: "medium" as const, label: "Important", icon: Target, color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400/30", glow: "shadow-emerald-500/15", dotColor: "bg-emerald-500" },
        { value: "high" as const, label: "Critical", icon: Flag, color: "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400 dark:border-red-400/30", glow: "shadow-red-500/20", dotColor: "bg-red-500" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                title,
                description,
                priority,
                status,
                checked,
                assigned_to: assignedTo,
                pending_reason: pendingReason,
                category,
                due_date: dueDate || undefined,
                start_date: startDate || undefined,
                comments,
                notes,
                remarks,
            };

            if (task) {
                await updateTask(task.id, payload);
            } else {
                await createTask(payload);
            }
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg animate-fade-in" onClick={onClose} />
            
            <div className="relative w-full sm:max-w-2xl bg-background rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slide-up sm:animate-scale-in overflow-hidden border border-border/50">
                <div className="flex flex-col min-h-0 h-full">
                    {/* Header */}
                    <div className="shrink-0 px-6 pt-6 pb-4 border-b border-border/40 bg-card/50 backdrop-blur-md relative z-20">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                {task ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <Target className="h-6 w-6 text-primary" />}
                                {task ? "Edit Task" : "New Task"}
                            </h2>
                            <button onClick={onClose} aria-label="Close modal" title="Close" className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Step Indicator */}
                        <div className="flex items-center gap-0 mt-6 mb-2 relative">
                            <div className="absolute top-5 left-[16.67%] right-[16.67%] h-0.5 bg-border/60 rounded-full" />
                            <div
                                className={`absolute top-5 left-[16.67%] h-0.5 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out ${step === 1 ? "step-progress-0" : step === 2 ? "step-progress-50" : "step-progress-100"}`}
                            />

                            {STEPS.map((s) => {
                                const Icon = s.icon;
                                const isActive = step === s.id;
                                const isCompleted = step > s.id;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => goToStep(s.id)}
                                        className="flex-1 flex flex-col items-center gap-1.5 relative z-10 group"
                                    >
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                                                : isCompleted
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                                : "bg-muted text-muted-foreground border border-border/50 group-hover:border-primary/30 group-hover:text-primary"
                                        }`}>
                                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                            isActive ? "text-primary" : isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/60"
                                        }`}>
                                            {s.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <form id="task-form" onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar custom-scrollbar">
                            <div key={animKey} className={direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"}>
                                
                                {/* Step 1: Essentials */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="task-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                                <Type className="h-3.5 w-3.5" /> Action Title <span className="text-red-500">*</span>
                                            </label>
                                            <input id="task-title" autoFocus required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g., Review Q3 marketing analytics..." className="flex h-14 w-full rounded-2xl border-2 border-input bg-card/50 px-5 text-base font-medium transition-all duration-300 placeholder:text-muted-foreground/50 hover:border-border focus-visible:outline-none focus-visible:border-primary focus-visible:ring-0" disabled={isSubmitting} />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="task-description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                                <AlignLeft className="h-3.5 w-3.5" /> Additional Context
                                            </label>
                                            <textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add any relevant links, notes, or details..." className="flex min-h-[100px] w-full rounded-2xl border-2 border-input bg-card/50 px-5 py-4 text-sm font-medium transition-all duration-300 placeholder:text-muted-foreground/50 hover:border-border focus-visible:outline-none focus-visible:border-primary focus-visible:ring-0 resize-y" disabled={isSubmitting} />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 ml-1">
                                                <Flag className="h-3.5 w-3.5" /> Priority Level
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {priorities.map((p) => {
                                                    const PIcon = p.icon;
                                                    return (
                                                        <button key={p.value} type="button" onClick={() => setPriority(p.value)} disabled={isSubmitting} data-selected={priority === p.value}
                                                            className={`relative flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${priority === p.value ? p.color + ` shadow-lg ${p.glow} scale-[1.03]` : "border-input bg-card/50 text-muted-foreground hover:bg-muted hover:border-border"} disabled:opacity-50`}
                                                        >
                                                            <div className={`h-3 w-3 rounded-full transition-all duration-300 ${priority === p.value ? p.dotColor + " scale-125 shadow-sm" : "bg-muted-foreground/30"}`} />
                                                            <PIcon className={`h-4 w-4 transition-all duration-300 ${priority === p.value ? "scale-110" : ""}`} />
                                                            <span className="text-xs">{p.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Details */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 ml-1">
                                                <Activity className="h-3.5 w-3.5" /> Task Status
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { value: "pending" as const, label: "Pending", icon: Clock },
                                                    { value: "in_progress" as const, label: "In Progress", icon: Zap },
                                                    { value: "completed" as const, label: "Completed", icon: CheckCircle2 },
                                                ].map((s) => (
                                                    <button key={s.value} type="button" onClick={() => setStatus(s.value)} className={`flex flex-col items-center justify-center gap-2 h-20 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ${status === s.value ? "border-primary bg-primary/10 text-primary scale-[1.02] shadow-md" : "border-input bg-card/50 text-muted-foreground hover:bg-muted"}`}>
                                                        <s.icon className="h-4 w-4" /> {s.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                                <User className="h-3.5 w-3.5" /> Assigned To
                                            </label>
                                            <input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Assignee name or email..." className="flex h-14 w-full rounded-2xl border-2 border-input bg-card/50 px-5 text-sm font-medium transition-all duration-300 hover:border-border focus-visible:outline-none focus-visible:border-primary" />
                                        </div>

                                        {status === "pending" && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Pending Reason
                                                </label>
                                                <textarea value={pendingReason} onChange={(e) => setPendingReason(e.target.value)} placeholder="Why is this blocked?" className="flex min-h-[80px] w-full rounded-2xl border-2 border-amber-300/50 bg-amber-50/30 px-5 py-4 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:border-amber-500 resize-y" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Schedule & Notes */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="task-start-date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 ml-1">
                                                    <Calendar className="h-3.5 w-3.5" /> Start Date
                                                </label>
                                                <input id="task-start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="flex h-14 w-full rounded-2xl border-2 border-input bg-card/50 px-5 text-sm font-medium transition-all hover:border-border focus-visible:outline-none focus-visible:border-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="task-due-date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 ml-1">
                                                    <CalendarDays className="h-3.5 w-3.5 text-primary" /> Due Date
                                                </label>
                                                <input id="task-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="flex h-14 w-full rounded-2xl border-2 border-primary/30 bg-primary/5 px-5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:border-primary" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 ml-1">
                                                <MessageSquare className="h-3.5 w-3.5" /> Comments
                                            </label>
                                            <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Add conversation or comments..." className="flex min-h-[80px] w-full rounded-2xl border-2 border-input bg-card/50 px-5 py-4 text-sm font-medium transition-all resize-y outline-none focus:border-primary" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 ml-1">
                                                <StickyNote className="h-3.5 w-3.5" /> Remarks / Notes
                                            </label>
                                            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Final notes or private remarks..." className="flex min-h-[80px] w-full rounded-2xl border-2 border-input bg-card/50 px-5 py-4 text-sm font-medium transition-all resize-y outline-none focus:border-primary" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer & Live Preview */}
                        <div className="shrink-0 border-t border-border/40 bg-card/50 backdrop-blur-md p-6">
                            {/* Live Preview Card */}
                            <div className="mb-6 p-4 rounded-2xl border border-border bg-background shadow-sm flex items-start gap-4 transition-all">
                                <div className={`flex shrink-0 h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                                    status === "completed" ? "bg-emerald-100 text-emerald-600 border border-emerald-200" :
                                    status === "in_progress" ? "bg-purple-100 text-purple-600 border border-purple-200" : "bg-muted text-muted-foreground"
                                }`}>
                                    {status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : status === "in_progress" ? <Zap className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold truncate text-foreground">{title || "Task pending title..."}</p>
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                            priority === "high" ? "bg-red-500/10 text-red-500" :
                                            priority === "medium" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                                        }`}>{priority}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 truncate">{description || "No description provided."}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Button type="button" variant="secondary" onClick={() => step > 1 ? goToStep(step - 1) : onClose()} className="px-6 h-12 rounded-xl">
                                    {step > 1 ? "Back" : "Cancel"}
                                </Button>
                                
                                {step < 3 ? (
                                    <Button type="button" onClick={() => { if (!title && step === 1) return; goToStep(step + 1); }} className="px-8 h-12 rounded-xl" disabled={step === 1 && !title}>
                                        Continue
                                    </Button>
                                ) : (
                                    <Button type="submit" className="px-8 h-12 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5" disabled={isSubmitting || !title}>
                                        {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"} <span className="ml-2 hidden sm:inline text-[9px] font-mono opacity-50 border border-current rounded px-1.5 py-0.5 leading-none">⌘ + Enter</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
