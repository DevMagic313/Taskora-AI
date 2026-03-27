"use client";

import { useState, useEffect } from "react";
import { billingApi, type BillingUsageResponse } from "@/features/billing/api";

interface UseBillingPlanReturn {
  usage: BillingUsageResponse | null;
  isLoading: boolean;
  plan: "starter" | "pro" | "team";
  isStarter: boolean;
  isPro: boolean;
  isTeam: boolean;
  isPaid: boolean;
  aiLimitReached: boolean;
  aiPlannerCharLimit: number;
  canUseAnalytics: boolean;
  canUseMembers: boolean;
  canUseAIReprioritize: boolean;
  canCreateMoreTasks: (currentCount: number) => boolean;
}

export function useBillingPlan(): UseBillingPlanReturn {
  const [usage, setUsage] = useState<BillingUsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    billingApi
      .getUsage()
      .then((u) => setUsage(u))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const plan = (usage?.plan ?? "starter") as "starter" | "pro" | "team";
  const isStarter = plan === "starter";
  const isPro = plan === "pro";
  const isTeam = plan === "team";
  const isPaid = isPro || isTeam;
  const aiLimitReached = usage ? usage.used >= usage.monthlyLimit : false;

  return {
    usage,
    isLoading,
    plan,
    isStarter,
    isPro,
    isTeam,
    isPaid,
    aiLimitReached,
    aiPlannerCharLimit: usage?.aiPlannerCharLimit ?? 500,
    canUseAnalytics: isPaid,
    canUseMembers: isPaid,
    canUseAIReprioritize: isPaid,
    canCreateMoreTasks: (currentCount: number) => {
      if (isPaid) return true;
      return currentCount < 50;
    },
  };
}
