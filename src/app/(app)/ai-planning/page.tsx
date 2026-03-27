"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Brain, Wand2, Lock } from "lucide-react";
import { AIGeneratePanel } from "@/features/ai/components/AIGeneratePanel";
import { billingApi, type BillingUsageResponse } from "@/features/billing/api";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";

export const dynamic = "force-dynamic";

export default function AITaskGeneratorPage() {
    const [usage, setUsage] = useState<BillingUsageResponse | null>(null);
    const [usageLoading, setUsageLoading] = useState(true);

    useEffect(() => {
        billingApi.getUsage().then((u) => {
            setUsage(u);
            setUsageLoading(false);
        }).catch(() => setUsageLoading(false));
    }, []);

    if (usageLoading) {
        return <PageLoader />;
    }

    const isLimitReached = usage ? usage.used >= usage.monthlyLimit : false;

    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-fade-in relative z-10 w-full overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            {isLimitReached ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="h-20 w-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
                        <Lock className="h-10 w-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-3">AI Generation Limit Reached</h2>
                    <p className="text-muted-foreground font-medium max-w-md mb-8">
                        You have used all {usage?.monthlyLimit} AI generations on your {usage?.planName} plan this month. 
                        Upgrade to continue generating task blueprints.
                    </p>
                    <Link href="/pricing">
                        <Button size="lg" className="shadow-xl shadow-primary/20">
                            Upgrade Plan
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
}
