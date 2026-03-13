"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Pencil, Flag, AlignLeft, Type, User, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ClientTask } from "@/features/tasks/services/taskApi";

interface TaskEditModalProps {
    task: ClientTask | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, updates: Partial<Pick<ClientTask, "title" | "description" | "priority" | "status" | "checked" | "category" | "assigned_to" | "pending_reason" | "start_date" | "due_date" | "comments" | "notes" | "remarks">>) => Promise<void>;
}

export function TaskEditModal({ task, isOpen, onClose, onSubmit }: TaskEditModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [status, setStatus] = useState<"pending" | "in_progress" | "completed">("pending");
    const [assignedTo, setAssignedTo] = useState("");
    const [pendingReason, setPendingReason] = useState("");
    const [checked, setChecked] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [comments, setComments] = useState("");
    const [notes, setNotes] = useState("");
    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (task && isOpen) {
            setTitle(task.title);
            setDescription(task.description || "");
            setPriority(task.priority);
            setStatus(task.status);
            setAssignedTo(task.assigned_to || "");
            setPendingReason(task.pending_reason || "");
            setChecked(task.checked || false);
            setStartDate(task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : "");
            setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "");
            setComments(task.comments || "");
            setNotes(task.notes || "");
            setRemarks(task.remarks || "");
        }
    }, [task, isOpen]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && title.trim() && !isSubmitting) {
            e.preventDefault();
            document.getElementById('task-edit-submit-btn')?.click();
        }
    }, [onClose, title, isSubmitting]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen || !task) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setIsSubmitting(true);
        try {
            await onSubmit(task.id, {
                title,
                description,
                priority,
                status,
                assigned_to: assignedTo.trim() || undefined,
                pending_reason: pendingReason.trim() || undefined,
                checked,
                start_date: startDate ? new Date(startDate).toISOString() : undefined,
                due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
                comments: comments.trim() || undefined,
                notes: notes.trim() || undefined,
                remarks: remarks.trim() || undefined,
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const priorities = [
        { value: "low", label: "Backlog", color: "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:border-blue-400/30" },
        { value: "medium", label: "Standard", color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400/30" },
        { value: "high", label: "Critical", color: "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400 dark:border-red-400/30" },
    ] as const;

    const isPending = task.status === "pending";

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
            <div className="relative w-full sm:max-w-[500px] rounded-t-[2rem] sm:rounded-[2rem] border border-border/60 bg-card p-1 shadow-2xl animate-scale-in overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
                <div className="bg-background/95 backdrop-blur-2xl rounded-t-[1.85rem] sm:rounded-[1.85rem] p-5 sm:p-6 md:p-8 relative z-10 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="mb-6 sm:mb-8 flex items-start justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 text-white">
                                <Pencil className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div>
                                <h2 id="edit-modal-title" className="text-xl sm:text-2xl font-black tracking-tight">Edit Task</h2>
                                <p className="text-sm font-medium text-muted-foreground mt-0.5">Update task details.</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Close modal">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="edit-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                <Type className="h-3.5 w-3.5" /> Action Title <span className="text-red-500">*</span>
                            </label>
                            <input id="edit-title" autoFocus required value={title} onChange={(e) => setTitle(e.target.value)} className="flex h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border-2 border-input bg-card/50 px-4 sm:px-5 text-base font-medium transition-all duration-300 placeholder:text-muted-foreground/50 hover:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50 shadow-sm" disabled={isSubmitting} />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                <AlignLeft className="h-3.5 w-3.5" /> Additional Context
                            </label>
                            <textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add any relevant links, notes, or details..." className="flex min-h-[80px] sm:min-h-[100px] w-full rounded-xl sm:rounded-2xl border-2 border-input bg-card/50 px-4 sm:px-5 py-3 sm:py-4 text-sm font-medium transition-all duration-300 placeholder:text-muted-foreground/50 hover:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50 resize-y shadow-sm" disabled={isSubmitting} />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-assigned" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                <User className="h-3.5 w-3.5" /> Assigned To
                            </label>
                            <input id="edit-assigned" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="E.g., Frontend Developer, John, Design Team..." className="flex h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border-2 border-input bg-card/50 px-4 sm:px-5 text-base font-medium transition-all duration-300 placeholder:text-muted-foreground/50 hover:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50 shadow-sm" disabled={isSubmitting} />
                        </div>

                        {isPending && (
                            <div className="space-y-2">
                                <label htmlFor="edit-pending-reason" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Why is this pending?
                                </label>
                                <textarea id="edit-pending-reason" value={pendingReason} onChange={(e) => setPendingReason(e.target.value)} placeholder="E.g., Waiting for frontend code, Need API keys, Blocked by design review..." className="flex min-h-[70px] sm:min-h-[80px] w-full rounded-xl sm:rounded-2xl border-2 border-amber-300/50 bg-amber-50/30 dark:bg-amber-900/10 dark:border-amber-700/30 px-4 sm:px-5 py-3 sm:py-4 text-sm font-medium transition-all duration-300 placeholder:text-muted-foreground/50 hover:border-amber-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-amber-500 disabled:opacity-50 resize-y shadow-sm" disabled={isSubmitting} />
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                            <div className="space-y-2 relative group">
                                <label htmlFor="edit-status" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                    <Sparkles className="h-3.5 w-3.5" /> Status
                                </label>
                                <select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value as any)} className="flex h-12 sm:h-14 w-full px-4 rounded-xl border-2 border-input bg-card/50 text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_12px_center] bg-no-repeat shadow-sm" disabled={isSubmitting}>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="space-y-2 relative group flex flex-col justify-center mt-2 sm:mt-0">
                                <label className="flex items-center gap-3 cursor-pointer mt-4 sm:mt-6">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-input bg-card/50 checked:border-primary checked:bg-primary transition-all disabled:opacity-50" disabled={isSubmitting} />
                                        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-primary-foreground stroke-white stroke-2 fill-none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-foreground">Mark as Checked</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                            <div className="space-y-2 relative group">
                                <label htmlFor="edit-start-date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                    Start Date
                                </label>
                                <input id="edit-start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="flex h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border-2 border-input bg-card/50 px-4 sm:px-5 text-base font-medium transition-all duration-300 hover:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50 shadow-sm" disabled={isSubmitting} />
                            </div>
                            <div className="space-y-2 relative group">
                                <label htmlFor="edit-due-date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 mb-2 ml-1">
                                    Deadline
                                </label>
                                <input id="edit-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="flex h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border-2 border-input bg-card/50 px-4 sm:px-5 text-base font-medium transition-all duration-300 hover:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50 shadow-sm" disabled={isSubmitting} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 ml-1">
                                <Flag className="h-3.5 w-3.5" /> Priority Level
                            </label>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {priorities.map((p) => (
                                    <button key={p.value} type="button" onClick={() => setPriority(p.value)} disabled={isSubmitting} aria-pressed={priority === p.value}
                                        className={`relative flex h-11 sm:h-12 flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${priority === p.value ? p.color + " shadow-md scale-[1.04]" : "border-input bg-card/50 text-muted-foreground hover:bg-muted hover:border-border"} disabled:opacity-50`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 relative group">
                            <label htmlFor="edit-comments" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 gap-2 mb-2 ml-1 block">
                                Comments
                            </label>
                            <textarea id="edit-comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Add any comments..." className="flex min-h-[60px] w-full rounded-xl sm:rounded-2xl border-2 border-input bg-card/50 px-4 py-3 text-sm font-medium transition-all duration-300 hover:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50 resize-vertical shadow-sm" disabled={isSubmitting} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                            <div className="space-y-2 relative group">
                                <label htmlFor="edit-notes" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 block mb-2 ml-1">
                                    Notes
                                </label>
                                <textarea id="edit-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Personal notes..." className="flex min-h-[60px] w-full rounded-xl sm:rounded-2xl border-2 border-input bg-card/50 px-4 py-3 text-sm font-medium transition-all duration-300 hover:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50 resize-vertical shadow-sm" disabled={isSubmitting} />
                            </div>
                            <div className="space-y-2 relative group">
                                <label htmlFor="edit-remarks" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 block mb-2 ml-1">
                                    Remarks
                                </label>
                                <textarea id="edit-remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Extra remarks..." className="flex min-h-[60px] w-full rounded-xl sm:rounded-2xl border-2 border-input bg-card/50 px-4 py-3 text-sm font-medium transition-all duration-300 hover:border-border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50 resize-vertical shadow-sm" disabled={isSubmitting} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-border/40 mt-6 sm:mt-8">
                            <span className="text-xs text-muted-foreground/60 font-medium hidden sm:block">
                                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold border border-border/50">⌘</kbd>
                                {" + "}
                                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold border border-border/50">↵</kbd>
                                {" to submit"}
                            </span>
                            <div className="flex gap-3 ml-auto">
                                <Button type="button" variant="ghost" size="lg" onClick={onClose} disabled={isSubmitting} className="font-bold">Cancel</Button>
                                <Button id="task-edit-submit-btn" type="submit" size="lg" isLoading={isSubmitting} disabled={!title.trim()} className="px-6 sm:px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30">
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
