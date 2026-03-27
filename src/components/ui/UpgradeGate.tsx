"use client";

import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UpgradeGateProps {
  feature: string;
  description: string;
  requiredPlan?: "pro" | "team";
  children?: React.ReactNode;
  compact?: boolean;
}

export function UpgradeGate({
  feature,
  description,
  requiredPlan = "pro",
  children,
  compact = false,
}: UpgradeGateProps) {
  if (compact) {
    return (
      <div className="relative rounded-2xl border border-amber-200/60 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-900/10 overflow-hidden">
        {/* Blurred preview */}
        {children && (
          <div className="pointer-events-none select-none blur-sm opacity-40 p-4">
            {children}
          </div>
        )}
        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-200 dark:border-amber-800/40">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{feature}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
          <Link href="/pricing">
            <button className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
              Upgrade to {requiredPlan === "pro" ? "Pro" : "Team"}
              <ArrowRight className="h-3 w-3" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center">
          <Lock className="h-10 w-10 text-amber-500" />
        </div>
        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-black tracking-tight mb-3">{feature}</h2>
      <p className="text-muted-foreground font-medium max-w-md leading-relaxed mb-8">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/pricing">
          <Button size="lg" className="shadow-xl shadow-primary/20 min-w-[160px]">
            Upgrade to {requiredPlan === "pro" ? "Pro" : "Team"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="outline" size="lg" className="min-w-[140px]">
            View Plans
          </Button>
        </Link>
      </div>
      <p className="text-xs text-muted-foreground/60 mt-6">
        Starting at $12/month · Cancel anytime
      </p>
    </div>
  );
}
