"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, X, Send, RotateCcw, MessageSquare, AlertCircle } from "lucide-react";
import { useTaskStore } from "@/features/tasks/store/useTaskStore";
import type { ChatMessage } from "@/features/ai/services/aiApi";

const QUICK_PROMPTS = [
    "What should I work on today?",
    "Which tasks are overdue?",
    "Help me prioritize my week",
];

export function AIChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamError, setStreamError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const { tasks } = useTaskStore();

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            return () => document.removeEventListener("keydown", handleEsc);
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            setTimeout(() => document.addEventListener("mousedown", handleClickOutside), 100);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const handleSend = async (text?: string) => {
        const content = text || input.trim();
        if (!content || isStreaming) return;

        setInput("");
        setStreamError(null);

        const userMessage: ChatMessage = { role: "user", content };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        setIsStreaming(true);
        const assistantMessage: ChatMessage = { role: "assistant", content: "" };
        setMessages([...updatedMessages, assistantMessage]);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const taskContext = tasks.slice(0, 30).map((t) => ({
                title: t.title,
                priority: t.priority,
                status: t.status,
                due_date: t.due_date || null,
            }));

            const res = await fetch("/api/ai/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages,
                    tasks: taskContext,
                }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Connection failed" }));
                throw new Error((errorData as { error: string }).error || "Connection failed");
            }

            if (!res.body) throw new Error("No response stream");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

                for (const line of lines) {
                    const data = line.slice(6);
                    if (data === "[DONE]") break;
                    try {
                        const parsed = JSON.parse(data) as { content: string };
                        if (parsed.content) {
                            accumulated += parsed.content;
                            setMessages((prev) => {
                                const updated = [...prev];
                                updated[updated.length - 1] = { role: "assistant", content: accumulated };
                                return updated;
                            });
                        }
                    } catch {
                        // skip
                    }
                }
            }
        } catch (err: unknown) {
            if ((err as Error).name === "AbortError") return;
            const errorMsg = err instanceof Error ? err.message : "Connection lost";
            setStreamError(errorMsg);
            setMessages((prev) => {
                const updated = [...prev];
                if (updated[updated.length - 1]?.role === "assistant" && updated[updated.length - 1].content === "") {
                    updated.pop();
                }
                return updated;
            });
        } finally {
            setIsStreaming(false);
            abortRef.current = null;
        }
    };

    const handleRetry = () => {
        setStreamError(null);
        const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
        if (lastUserIdx >= 0) {
            const lastMsg = messages[messages.length - 1 - lastUserIdx];
            // Remove the last failed attempt
            setMessages((prev) => prev.slice(0, prev.length - 1 - lastUserIdx));
            setTimeout(() => handleSend(lastMsg.content), 100);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Panel */}
            {isOpen && (
                <div ref={panelRef} className="fixed bottom-24 md:bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[60vh] sm:max-h-[500px] md:max-h-[500px] rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/10 flex flex-col animate-scale-in overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 shrink-0 bg-gradient-to-r from-primary/5 to-accent/5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-tight">AI Assistant</h3>
                                <p className="text-[10px] text-muted-foreground font-medium">Powered by Groq</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-6">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/10">
                                    <MessageSquare className="h-7 w-7 text-primary/60" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">How can I help?</p>
                                    <p className="text-xs text-muted-foreground mt-1">Ask anything about your tasks and productivity.</p>
                                </div>
                                <div className="space-y-2 w-full px-2">
                                    {QUICK_PROMPTS.map((qp) => (
                                        <button
                                            key={qp}
                                            onClick={() => handleSend(qp)}
                                            className="w-full text-left px-4 py-2.5 rounded-xl border border-border/50 bg-muted/30 text-xs font-medium text-muted-foreground hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all"
                                        >
                                            {qp}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed whitespace-pre-wrap ${msg.role === "user"
                                    ? "bg-foreground text-background rounded-br-md"
                                    : "bg-muted/80 text-foreground border border-border/40 rounded-bl-md"
                                    }`}>
                                    {msg.content}
                                    {isStreaming && i === messages.length - 1 && msg.role === "assistant" && (
                                        <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-full" />
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Error */}
                        {streamError && (
                            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10 p-3">
                                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                                <p className="text-xs font-medium text-red-600 dark:text-red-400 flex-1">{streamError}</p>
                                <button onClick={handleRetry} className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline shrink-0">
                                    <RotateCcw className="h-3 w-3" /> Retry
                                </button>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-border/40 p-3 shrink-0 bg-background/80">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about your tasks..."
                                rows={1}
                                className="flex-1 resize-none rounded-xl border border-input bg-muted/30 px-4 py-2.5 text-sm font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary transition-colors max-h-[80px]"
                                disabled={isStreaming}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isStreaming}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-all hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none active:scale-95 shadow-sm"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl shadow-2xl transition-all duration-300 active:scale-90 ${isOpen
                    ? "bg-muted text-foreground rotate-180 shadow-lg"
                    : "bg-gradient-to-br from-primary to-accent text-white animate-glow-pulse hover:scale-110"
                    }`}
                aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </button>
        </>
    );
}
