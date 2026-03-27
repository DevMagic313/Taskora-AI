"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Sparkles, Send, Save, Trash2, CheckCircle2, ChevronRight, Lightbulb, AlertCircle,
    Type, RefreshCw, Clock, History, X, ChevronDown, ChevronUp, GripVertical,
} from "lucide-react";
import { aiApi } from "@/features/ai/services/aiApi";
import { ApiError } from "@/features/ai/services/aiApi";
import type { GeneratedTask, GenerationHistoryEntry } from "@/features/ai/services/aiApi";
import { useTaskStore } from "@/features/tasks/store/useTaskStore";
import { Button } from "@/components/ui/Button";
import { billingApi, type BillingUsageResponse } from "@/features/billing/api";
import { useBillingPlan } from "@/features/billing/hooks/useBillingPlan";

const EXAMPLE_PROMPTS = [
    "Build a full-stack e-commerce platform with React and Node.js",
    "Create a mobile-responsive portfolio website with dark mode",
    "Design and implement a REST API for a blog application",
    "Set up a CI/CD pipeline with GitHub Actions and Docker",
];

// Max chars logic handled by useBillingPlan hook


function SkeletonCard({ delay }: { delay: number }) {
    return (
        <div
            className={`flex items-start gap-4 rounded-2xl border border-border/40 bg-card/40 p-5 animate-fade-in [animation-delay:${delay}ms]`}
        >
            <div className="flex h-12 w-12 shrink-0 rounded-xl bg-muted animate-skeleton" />
            <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 rounded-lg bg-muted animate-skeleton [animation-delay:100ms]" />
                <div className="h-4 w-full rounded-lg bg-muted animate-skeleton [animation-delay:200ms]" />
                <div className="flex gap-3">
                    <div className="h-6 w-16 rounded-lg bg-muted animate-skeleton [animation-delay:300ms]" />
                    <div className="h-6 w-20 rounded-lg bg-muted animate-skeleton [animation-delay:400ms]" />
                </div>
            </div>
        </div>
    );
}

export function AIGeneratePanel() {
    const [prompt, setPrompt] = useState("");
    const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedTaskIds, setSavedTaskIds] = useState<Set<number>>(new Set());
    const [lastGoal, setLastGoal] = useState("");
    const [history, setHistory] = useState<GenerationHistoryEntry[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [usage, setUsage] = useState<BillingUsageResponse | null>(null);
    const [showUpgradePopup, setShowUpgradePopup] = useState(false);

    const { aiPlannerCharLimit } = useBillingPlan();
    const { createTask } = useTaskStore();

    const loadHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const data = await aiApi.getGenerationHistory();
            setHistory(data);
        } catch {
            // silently fail for history
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    useEffect(() => {
        billingApi.getUsage().then(setUsage).catch(() => {
            // silent fail
        });
    }, []);

    const handleGenerate = async (goalOverride?: string) => {
        const goal = goalOverride || prompt;
        if (!goal.trim()) return;
        setIsGenerating(true);
        setError(null);
        setGeneratedTasks([]);
        setSavedTaskIds(new Set());
        setLastGoal(goal);
        try {
            const tasks = await aiApi.generateTasks(goal);
            setGeneratedTasks(tasks);
            billingApi.getUsage().then(setUsage).catch(() => {
                // silent fail
            });
            // Save to history in background
            aiApi.saveGenerationHistory(goal, tasks).then(() => loadHistory()).catch(() => { /* silent */ });
        } catch (err: unknown) {
            if (err instanceof ApiError && err.status === 402) {
                setShowUpgradePopup(true);
                const usageFromError = err.details as BillingUsageResponse | undefined;
                if (usageFromError?.monthlyLimit !== undefined) setUsage(usageFromError);
            }
            setError(err instanceof Error ? err.message : "Failed to generate tasks.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerate = () => {
        if (lastGoal) handleGenerate(lastGoal);
    };

    const handleUpdateTask = (index: number, field: keyof GeneratedTask, value: string) => {
        setGeneratedTasks((prev) => {
            const updated = [...prev];
            if (field === "title" || field === "description") {
                updated[index] = { ...updated[index], [field]: value };
            } else if (field === "priority") {
                updated[index] = { ...updated[index], priority: value as GeneratedTask["priority"] };
            }
            return updated;
        });
    };

    const handleRemoveTask = (index: number) => {
        setGeneratedTasks((prev) => prev.filter((_, i) => i !== index));
        setSavedTaskIds((prev) => {
            const updated = new Set<number>();
            prev.forEach((id) => {
                if (id < index) updated.add(id);
                else if (id > index) updated.add(id - 1);
            });
            return updated;
        });
    };

    const handleSaveTask = async (task: GeneratedTask, index: number) => {
        try {
            await createTask({
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: "pending",
                checked: false,
            });
            setSavedTaskIds((prev) => new Set(prev).add(index));
        } catch (err) {
            console.error("Failed to save task:", err);
        }
    };

    const handleSaveAll = async () => {
        for (let i = 0; i < generatedTasks.length; i++) {
            if (!savedTaskIds.has(i)) {
                await handleSaveTask(generatedTasks[i], i);
            }
        }
    };

    const handleClear = () => {
        setGeneratedTasks([]);
        setPrompt("");
        setError(null);
        setSavedTaskIds(new Set());
        setLastGoal("");
    };

    const loadFromHistory = (entry: GenerationHistoryEntry) => {
        setPrompt(entry.goal);
        setGeneratedTasks(entry.result);
        setSavedTaskIds(new Set());
        setLastGoal(entry.goal);
        setShowHistory(false);
    };

    const priorityColor = (p: string) => {
        switch (p) {
            case "high": return "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400";
            case "medium": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
            default: return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400";
        }
    };

    return (
        <div className="relative z-10 space-y-8">
            {/* Input Section */}
            <div className="rounded-[2rem] border border-border/60 bg-background/60 backdrop-blur-xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Describe your goal or project</label>
                </div>
                <div className="relative group">
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value.slice(0, aiPlannerCharLimit))} placeholder="E.g., Build a real-time chat application with WebSocket support and user authentication..." className="w-full min-h-[140px] rounded-2xl border-2 border-input bg-card/50 px-6 py-5 text-base font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary transition-all duration-300 resize-y shadow-sm" disabled={isGenerating} />
                    <div className="absolute bottom-4 right-4 text-xs font-bold text-muted-foreground/40 tabular-nums">{prompt.length}/{aiPlannerCharLimit}</div>
                </div>
                <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Quick Start Templates</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {EXAMPLE_PROMPTS.map((example) => (
                            <button key={example} onClick={() => setPrompt(example)} disabled={isGenerating} className="group inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/40 px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary/10 hover:border-primary/20 hover:text-primary disabled:opacity-50 shadow-sm">
                                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                <span className="line-clamp-1">{example}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground/50 font-medium hidden sm:block">
                            Powered by Groq LLM inference
                            {usage ? ` • ${usage.remaining}/${usage.monthlyLimit} AI generations left` : ""}
                        </span>
                        {/* History Toggle */}
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                        >
                            <History className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">History</span>
                            {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                    </div>
                    <Button onClick={() => handleGenerate()} disabled={!prompt.trim()} isLoading={isGenerating} icon={!isGenerating ? <Send className="h-4 w-4" /> : undefined} size="lg" className="shadow-xl shadow-primary/20 hover:shadow-primary/30 w-full sm:w-auto">
                        {isGenerating ? "Generating blueprint..." : "Generate Task Blueprint"}
                    </Button>
                </div>
            </div>

            {/* History Panel */}
            {showHistory && (
                <div className="rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl p-6 shadow-sm animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Generations</h3>
                        <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground transition-colors" title="Close history">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    {isLoadingHistory ? (
                        <div className="space-y-2">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className={`h-12 rounded-xl bg-muted animate-skeleton [animation-delay:${i * 100}ms]`} />
                            ))}
                        </div>
                    ) : history.length === 0 ? (
                        <p className="text-sm text-muted-foreground/60 text-center py-4">No generation history yet.</p>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {history.map((entry) => (
                                <button
                                    key={entry.id}
                                    onClick={() => loadFromHistory(entry)}
                                    className="w-full flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 p-3 text-left transition-all hover:bg-primary/5 hover:border-primary/20 group"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <History className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{entry.goal}</p>
                                        <p className="text-xs text-muted-foreground/60">
                                            {entry.result.length} tasks • {new Date(entry.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Skeleton Loader */}
            {isGenerating && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-3 px-2">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                        </div>
                        <span className="text-sm font-bold text-primary">AI is analyzing your prompt and building the task tree...</span>
                    </div>
                    {[0, 1, 2, 3].map((i) => (
                        <SkeletonCard key={i} delay={i * 150} />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-center gap-4 dark:border-red-900/50 dark:bg-red-900/10 animate-shake shadow-sm">
                    <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
                        <p className="text-xs text-red-500/70 mt-1">Try rephrasing your prompt or check your connection.</p>
                    </div>
                    {lastGoal && (
                        <Button variant="outline" size="sm" onClick={handleRegenerate} icon={<RefreshCw className="h-3.5 w-3.5" />}>Retry</Button>
                    )}
                </div>
            )}

            {/* Generated Tasks (Editable Preview) */}
            {generatedTasks.length > 0 && (
                <div className="rounded-[2rem] border border-border/60 bg-background/60 backdrop-blur-xl p-8 shadow-sm animate-slide-up">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/40">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-sm shadow-primary/20">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold tracking-tight">Generated Blueprint</h3>
                                <p className="text-sm font-medium text-muted-foreground">{generatedTasks.length} nodes • {savedTaskIds.size} saved</p>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {lastGoal && (
                                <Button variant="outline" size="sm" onClick={handleRegenerate} isLoading={isGenerating} icon={<RefreshCw className="h-4 w-4" />}>Regenerate</Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={handleClear} icon={<Trash2 className="h-4 w-4" />}>Discard</Button>
                            <Button size="sm" onClick={handleSaveAll} disabled={savedTaskIds.size === generatedTasks.length} icon={<Save className="h-4 w-4" />} className="shadow-lg shadow-primary/20">
                                Save All ({generatedTasks.length - savedTaskIds.size})
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-4 relative">
                        <div className="absolute left-7 top-6 bottom-6 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent pointer-events-none hidden sm:block" />
                        {generatedTasks.map((task, index) => {
                            const isSaved = savedTaskIds.has(index);
                            return (
                                <div key={index} className={`group relative flex items-start gap-4 rounded-2xl border p-5 transition-all duration-300 animate-stagger-in [animation-delay:${index * 80}ms] ${isSaved ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/40" : "bg-card/60 border-border/50 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"}`}>
                                    <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-colors sm:h-12 sm:w-12 sm:text-base shadow-sm ${isSaved ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-muted border border-border/80 text-muted-foreground"}`}>
                                        {isSaved ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        {/* Editable Title */}
                                        {isSaved ? (
                                            <h4 className="text-base font-bold text-muted-foreground line-through decoration-2">{task.title}</h4>
                                        ) : (
                                            <input
                                                type="text"
                                                value={task.title}
                                                onChange={(e) => handleUpdateTask(index, "title", e.target.value)}
                                                className="w-full text-base font-bold text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors pb-0.5"
                                                title="Task title"
                                                placeholder="Task title"
                                            />
                                        )}
                                        <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium line-clamp-2">{task.description}</p>
                                        <div className="flex items-center gap-3 flex-wrap pt-1">
                                            {/* Priority dropdown */}
                                            {!isSaved ? (
                                                <select
                                                    value={task.priority}
                                                    onChange={(e) => handleUpdateTask(index, "priority", e.target.value)}
                                                    className={`appearance-none cursor-pointer rounded-lg border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${priorityColor(task.priority)} bg-transparent focus:outline-none focus:ring-1 focus:ring-primary`}
                                                    title="Change task priority"
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${priorityColor(task.priority)}`}>{task.priority}</span>
                                            )}
                                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 font-medium">
                                                <Clock className="h-3 w-3" />
                                                {task.estimatedHours}h
                                            </span>
                                            {task.dependencies.length > 0 && (
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 font-medium">
                                                    <GripVertical className="h-3 w-3" />
                                                    {task.dependencies.length} dep{task.dependencies.length > 1 ? "s" : ""}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground/50 font-medium">Step {index + 1} of {generatedTasks.length}</span>
                                        </div>
                                        {/* Dependencies tooltip */}
                                        {task.dependencies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {task.dependencies.map((dep, di) => (
                                                    <span key={di} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/60 border border-border/50 text-muted-foreground truncate max-w-[200px]">
                                                        ← {dep}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 self-center">
                                        {!isSaved && (
                                            <>
                                                <button onClick={() => handleRemoveTask(index)} className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Remove">
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <Button variant="secondary" size="sm" onClick={() => handleSaveTask(task, index)} icon={<Save className="h-3.5 w-3.5" />}>Save</Button>
                                            </>
                                        )}
                                        {isSaved && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {showUpgradePopup && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
                        <h3 className="text-lg font-bold">AI limit reached</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            You used all {usage?.monthlyLimit ?? 0} AI generations in your current plan. Upgrade to continue generating AI blueprints.
                        </p>
                        <div className="mt-5 flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowUpgradePopup(false)}>Maybe later</Button>
                            <Button onClick={() => { window.location.href = "/pricing"; }}>Upgrade plan</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
