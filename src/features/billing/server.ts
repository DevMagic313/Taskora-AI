import type { SupabaseClient } from "@supabase/supabase-js";
import { PLAN_CONFIG, type BillingPlan } from "@/features/billing/constants";

interface BillingProfileRow {
    billing_plan: BillingPlan | null;
    billing_cycle_anchor: string | null;
}

export interface BillingUsage {
    plan: BillingPlan;
    planName: string;
    monthlyLimit: number;
    used: number;
    remaining: number;
    periodStart: string;
    periodEnd: string;
}

function isValidPlan(value: string | null): value is BillingPlan {
    return value === "starter" || value === "pro" || value === "team";
}

export async function ensureBillingProfile(
    supabase: SupabaseClient,
    userId: string
): Promise<{ plan: BillingPlan; periodStart: Date; periodEnd: Date }> {
    const { data: profile } = await supabase
        .from("profiles")
        .select("billing_plan, billing_cycle_anchor")
        .eq("id", userId)
        .single<BillingProfileRow>();

    const now = new Date();
    const plan = isValidPlan(profile?.billing_plan ?? null) ? profile!.billing_plan : "starter";
    const anchor = profile?.billing_cycle_anchor ? new Date(profile.billing_cycle_anchor) : now;

    const isInvalidDate = Number.isNaN(anchor.getTime());
    const safeAnchor = isInvalidDate ? now : anchor;
    const periodEnd = new Date(safeAnchor);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const needsReset = now >= periodEnd;

    if (!profile || needsReset || isInvalidDate || !isValidPlan(profile.billing_plan ?? null)) {
        await supabase
            .from("profiles")
            .update({
                billing_plan: plan,
                billing_status: "active",
                billing_cycle_anchor: needsReset || isInvalidDate ? now.toISOString() : safeAnchor.toISOString(),
            })
            .eq("id", userId);
    }

    const normalizedStart = needsReset ? now : safeAnchor;
    const normalizedEnd = new Date(normalizedStart);
    normalizedEnd.setMonth(normalizedEnd.getMonth() + 1);

    return { plan, periodStart: normalizedStart, periodEnd: normalizedEnd };
}

export async function getBillingUsage(
    supabase: SupabaseClient,
    userId: string
): Promise<BillingUsage> {
    const { plan, periodStart, periodEnd } = await ensureBillingProfile(supabase, userId);

    const { count, error } = await supabase
        .from("ai_usage_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", periodStart.toISOString())
        .lt("created_at", periodEnd.toISOString());

    if (error) throw error;

    const used = count ?? 0;
    const monthlyLimit = PLAN_CONFIG[plan].aiMonthlyLimit;

    return {
        plan,
        planName: PLAN_CONFIG[plan].name,
        monthlyLimit,
        used,
        remaining: Math.max(monthlyLimit - used, 0),
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
    };
}
