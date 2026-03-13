"use client";

import { Sparkles, Brain, Wand2 } from "lucide-react";
import { AIGeneratePanel } from "@/features/ai/components/AIGeneratePanel";

export default function AITaskGeneratorPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-fade-in relative z-10 w-full overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 shadow-sm mb-2">
                    <Brain className="h-4 w-4 text-accent" />
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">Intelligence Engine</span>
                </div>

                <h1 className="text-4xl font-black tracking-tighter">
                    AI Task <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Generator.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-3xl leading-relaxed">
                    Describe your project or goal and Taskora AI will break it down into well-structured, actionable sub-tasks using the Groq LLM. Each generated node is immediately saveable to your active workspace.
                </p>

                <div className="flex flex-wrap gap-3 pt-4">
                    {[
                        { icon: <Sparkles className="h-3.5 w-3.5" />, label: "Groq Powered" },
                        { icon: <Wand2 className="h-3.5 w-3.5" />, label: "One-click save" },
                        { icon: <Brain className="h-3.5 w-3.5" />, label: "Smart breakdown" },
                    ].map((pill) => (
                        <span key={pill.label} className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 border border-border/50 px-3 py-1.5 text-xs font-bold text-muted-foreground shadow-sm">
                            {pill.icon} {pill.label}
                        </span>
                    ))}
                </div>
            </div>

            <AIGeneratePanel />
        </div>
    );
}
