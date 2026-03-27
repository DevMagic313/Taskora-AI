import { PLAN_CONFIG, PLAN_ORDER, type BillingPlan } from "@/features/billing/constants";

export interface BillingUsageResponse {
    plan: BillingPlan;
    planName: string;
    monthlyLimit: number;
    used: number;
    remaining: number;
    aiPlannerCharLimit: number;
    periodStart: string;
    periodEnd: string;
}

export interface CheckoutPayload {
    plan: BillingPlan;
    cardholderName: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
}

export const billingApi = {
    plans: PLAN_ORDER.map((key) => PLAN_CONFIG[key]),

    async getUsage(): Promise<BillingUsageResponse> {
        const res = await fetch("/api/billing/usage");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch usage");
        return data.data;
    },

    async checkout(payload: CheckoutPayload): Promise<{ plan: BillingPlan; aiMonthlyLimit: number }> {
        const res = await fetch("/api/billing/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to process payment");
        return data.data;
    },
};
