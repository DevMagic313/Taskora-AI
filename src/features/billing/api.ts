"use client";

import { BILLING_STORAGE_KEY, PLAN_CONFIG, type BillingPlan } from "./constants";

export interface BillingUsageResponse {
    plan: BillingPlan;
    renewsOn: string;
    tasksUsed: number;
    tasksLimit: number | null;
    aiUsed: number;
    aiLimit: number | null;
    workspaceCount: number;
    workspaceLimit: number | null;
}

type CheckoutPayload = {
    plan: BillingPlan;
    cardholderName: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
};

const RENEWAL_DAYS = 14;

const buildDefaultUsage = (): BillingUsageResponse => ({
    plan: "starter",
    renewsOn: new Date(Date.now() + RENEWAL_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    tasksUsed: 18,
    tasksLimit: PLAN_CONFIG.starter.limits.tasks,
    aiUsed: 6,
    aiLimit: PLAN_CONFIG.starter.limits.aiGenerations,
    workspaceCount: 1,
    workspaceLimit: PLAN_CONFIG.starter.limits.workspaces,
});

const clampToLimit = (value: number, limit: number | null) => {
    if (limit === null) return value;
    return Math.min(value, limit);
};

const applyPlanLimits = (plan: BillingPlan, usage: BillingUsageResponse) => {
    const limits = PLAN_CONFIG[plan].limits;

    return {
        ...usage,
        plan,
        tasksLimit: limits.tasks,
        aiLimit: limits.aiGenerations,
        workspaceLimit: limits.workspaces,
        workspaceCount: clampToLimit(usage.workspaceCount, limits.workspaces),
        tasksUsed: clampToLimit(usage.tasksUsed, limits.tasks),
        aiUsed: clampToLimit(usage.aiUsed, limits.aiGenerations),
    };
};

const readUsage = (): BillingUsageResponse => {
    if (typeof window === "undefined") {
        return buildDefaultUsage();
    }

    const stored = window.localStorage.getItem(BILLING_STORAGE_KEY);
    if (!stored) {
        const initial = buildDefaultUsage();
        window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(initial));
        return initial;
    }

    try {
        const parsed = JSON.parse(stored) as BillingUsageResponse;
        if (!PLAN_CONFIG[parsed.plan]) {
            return buildDefaultUsage();
        }
        return applyPlanLimits(parsed.plan, parsed);
    } catch {
        const fallback = buildDefaultUsage();
        window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(fallback));
        return fallback;
    }
};

const persistUsage = (usage: BillingUsageResponse) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(usage));
};

export const billingApi = {
    async getUsage(): Promise<BillingUsageResponse> {
        return readUsage();
    },

    async checkout(payload: CheckoutPayload): Promise<BillingUsageResponse> {
        if (!payload.plan) {
            throw new Error("Select a plan to continue.");
        }

        if (!payload.cardholderName || !payload.cardNumber || !payload.expiry || !payload.cvc) {
            throw new Error("Please fill out all payment details.");
        }

        const current = readUsage();
        const updated = applyPlanLimits(payload.plan, current);
        persistUsage(updated);

        await new Promise((resolve) => setTimeout(resolve, 450));
        return updated;
    },
};
