"use client";

export type BillingPlan = "starter" | "pro" | "team";

interface PlanLimits {
    tasks: number | null;
    aiGenerations: number | null;
    workspaces: number | null;
    collaborators: number | null;
}

interface PlanConfig {
    name: string;
    description: string;
    monthlyPriceCents: number;
    features: string[];
    limits: PlanLimits;
    badge?: string;
}

export const PLAN_CONFIG: Record<BillingPlan, PlanConfig> = {
    starter: {
        name: "Starter",
        description: "Perfect for individuals getting started.",
        monthlyPriceCents: 0,
        features: [
            "Up to 50 tasks",
            "Basic AI generation",
            "Email support",
            "1 workspace",
        ],
        limits: {
            tasks: 50,
            aiGenerations: 50,
            workspaces: 1,
            collaborators: 3,
        },
    },
    pro: {
        name: "Pro",
        description: "For power users and small teams.",
        monthlyPriceCents: 1200,
        features: [
            "Unlimited tasks",
            "Advanced AI with GPT-4",
            "Priority support",
            "10 workspaces",
            "Analytics dashboard",
            "Custom categories",
        ],
        badge: "Most popular",
        limits: {
            tasks: null,
            aiGenerations: 1000,
            workspaces: 10,
            collaborators: 25,
        },
    },
    team: {
        name: "Team",
        description: "For organizations that need full control.",
        monthlyPriceCents: 4900,
        features: [
            "Everything in Pro",
            "Unlimited workspaces",
            "SSO & SAML",
            "Dedicated support",
            "Custom integrations",
            "SLA guarantee",
            "Admin controls",
        ],
        limits: {
            tasks: null,
            aiGenerations: null,
            workspaces: null,
            collaborators: null,
        },
    },
};

export const PLAN_ORDER: BillingPlan[] = ["starter", "pro", "team"];

export const BILLING_STORAGE_KEY = "taskora.billing.usage";
