"use client";

import { useState } from "react";
import { X, Check, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ReprioritizeSuggestion } from "@/features/ai/services/aiApi";
import type { ClientTask } from "@/features/tasks/services/taskApi";

interface ReprioritizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: ReprioritizeSuggestion[];
    tasks: ClientTask[];
    onApply: (changes: Array<{ taskId: string; priority: string }>) => Promise<void>;
}

const priorityLabel: Record<string, { text: string; color: string }> = {
    low: { text: "Low", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400" },
    medium: { text: "Medium", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400" },
    high: { text: "High", color: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400" },
};

function getPriorityLevel(p: string): number {
    return p === "high" ? 3 : p === "medium" ? 2 : 1;
}

export function ReprioritizeModal({ isOpen, onClose, suggestions, tasks, onApply }: ReprioritizeModalProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set(suggestions.map((s) => s.taskId)));
    const [isApplying, setIsApplying] = useState(false);

    if (!isOpen) return null;

    const toggleSelection = (taskId: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(taskId)) next.delete(taskId);
            else next.add(taskId);
            return next;
        });
    };

    const selectAll = () => setSelected(new Set(suggestions.map((s) => s.taskId)));
    const deselectAll = () => setSelected(new Set());

    const handleApply = async (applyAll: boolean) => {
        setIsApplying(true);
        try {
            const toApply = suggestions
                .filter((s) => applyAll || selected.has(s.taskId))
                .map((s) => ({ taskId: s.taskId, priority: s.suggestedPriority }));
            await onApply(toApply);
            onClose();
        } catch (err) {
            console.error("Failed to apply changes:", err);
        } finally {
            setIsApplying(false);
        }
    };

    const getTaskTitle = (taskId: string) => {
        const task = tasks.find((t) => t.id === taskId);
        return task?.title || "Unknown Task";
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-2xl max-h-[80vh] rounded-2xl sm:rounded-3xl border border-border/60 bg-background shadow-2xl flex flex-col animate-scale-in overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border/40 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-sm shadow-primary/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">AI Priority Suggestions</h2>
                            <p className="text-sm text-muted-foreground font-medium">{suggestions.length} change{suggestions.length !== 1 ? "s" : ""} recommended</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                {suggestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800/40">
                            <Check className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-bold">All priorities look good!</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm">AI analyzed your tasks and found no priority adjustments needed.</p>
                    </div>
                ) : (
                    <>
                        {/* Selection Controls */}
                        <div className="flex items-center justify-between px-6 py-3 border-b border-border/20 bg-muted/20 text-xs font-medium text-muted-foreground shrink-0">
                            <span>{selected.size} of {suggestions.length} selected</span>
                            <div className="flex gap-3">
                                <button onClick={selectAll} className="hover:text-primary transition-colors">Select all</button>
                                <button onClick={deselectAll} className="hover:text-primary transition-colors">Deselect all</button>
                            </div>
                        </div>

                        {/* Suggestion List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {suggestions.map((s) => {
                                const isUpgrade = getPriorityLevel(s.suggestedPriority) > getPriorityLevel(s.currentPriority);
                                const isChecked = selected.has(s.taskId);
                                const current = priorityLabel[s.currentPriority];
                                const suggested = priorityLabel[s.suggestedPriority];

                                return (
                                    <label
                                        key={s.taskId}
                                        className={`flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${isChecked
                                            ? isUpgrade
                                                ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/40"
                                                : "bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/40"
                                            : "bg-card/40 border-border/40 hover:bg-muted/30"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleSelection(s.taskId)}
                                            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <p className="text-sm font-bold truncate">{getTaskTitle(s.taskId)}</p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${current.color}`}>
                                                    {current.text}
                                                </span>
                                                <ArrowRight className={`h-3.5 w-3.5 shrink-0 ${isUpgrade ? "text-emerald-500" : "text-amber-500"}`} />
                                                <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${suggested.color}`}>
                                                    {suggested.text}
                                                </span>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isUpgrade
                                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                    }`}>
                                                    {isUpgrade ? "↑ Upgrade" : "↓ Downgrade"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{s.reason}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 shrink-0 bg-background/80 gap-3">
                    <Button variant="ghost" size="sm" onClick={onClose} disabled={isApplying}>Dismiss</Button>
                    {suggestions.length > 0 && (
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" onClick={() => handleApply(false)} disabled={selected.size === 0 || isApplying} isLoading={isApplying}>
                                Apply Selected ({selected.size})
                            </Button>
                            <Button size="sm" onClick={() => handleApply(true)} disabled={isApplying} isLoading={isApplying} className="shadow-lg shadow-primary/20">
                                Apply All ({suggestions.length})
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
