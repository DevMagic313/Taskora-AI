export type BillingPlan = "starter" | "pro" | "team";

export interface PlanConfig {
    key: BillingPlan;
    name: string;
    monthlyPriceCents: number;
    aiMonthlyLimit: number;
    taskLimit: number;
    features: string[];
}

export const PLAN_CONFIG: Record<BillingPlan, PlanConfig> = {
    starter: {
        key: "starter",
        name: "Starter",
        monthlyPriceCents: 0,
        aiMonthlyLimit: 15,
        taskLimit: 50,
        features: ["Up to 50 tasks", "15 AI generations / month", "Email support", "1 workspace"],
    },
    pro: {
        key: "pro",
        name: "Pro",
        monthlyPriceCents: 1200,
        aiMonthlyLimit: 250,
        taskLimit: -1,
        features: ["Unlimited tasks", "250 AI generations / month", "Priority support", "10 workspaces", "Analytics dashboard", "Custom categories"],
    },
    team: {
        key: "team",
        name: "Team",
        monthlyPriceCents: 4900,
        aiMonthlyLimit: 1500,
        taskLimit: -1,
        features: ["Everything in Pro", "1,500 AI generations / month", "Unlimited workspaces", "Dedicated support", "Admin controls"],
    },
};

export const PLAN_ORDER: BillingPlan[] = ["starter", "pro", "team"];
