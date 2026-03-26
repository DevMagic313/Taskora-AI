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
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("billing_plan, billing_cycle_anchor")
        .eq("id", userId)
        .maybeSingle<BillingProfileRow>();

    if (profileError) throw profileError;

    const now = new Date();
    const storedPlan = profile?.billing_plan ?? null;
    const plan = storedPlan !== null && isValidPlan(storedPlan) ? storedPlan : "starter";

    const rawAnchor = profile?.billing_cycle_anchor ? new Date(profile.billing_cycle_anchor) : null;
    const anchorInvalid = rawAnchor === null || Number.isNaN(rawAnchor.getTime());
    let periodStart = anchorInvalid ? now : rawAnchor;
    let periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const needsReset = anchorInvalid || now >= periodEnd;
    const needsPlanFix = !profile || !isValidPlan(storedPlan);

    if (!profile) {
        const { error } = await supabase.from("profiles").insert({
            id: userId,
            billing_plan: plan,
            billing_status: "active",
            billing_cycle_anchor: now.toISOString(),
        });
        if (error) throw error;
        periodStart = now;
        periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else if (needsReset || needsPlanFix) {
        const nextAnchor = needsReset ? now : periodStart;
        const { error } = await supabase
            .from("profiles")
            .update({
                billing_plan: plan,
                billing_status: "active",
                billing_cycle_anchor: nextAnchor.toISOString(),
            })
            .eq("id", userId);
        if (error) throw error;
        periodStart = nextAnchor;
        periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    return { plan, periodStart, periodEnd };
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
