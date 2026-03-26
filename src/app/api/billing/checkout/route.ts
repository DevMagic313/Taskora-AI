import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLAN_CONFIG, type BillingPlan } from "@/features/billing/constants";

interface CheckoutBody {
    plan: BillingPlan;
    cardholderName: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
}

function isPaidPlan(plan: BillingPlan) {
    return plan === "pro" || plan === "team";
}

function maskCard(cardNumber: string) {
    const digits = cardNumber.replace(/\D/g, "");
    return `**** **** **** ${digits.slice(-4) || "0000"}`;
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = (await request.json()) as CheckoutBody;

        if (!body.plan || !(body.plan in PLAN_CONFIG)) {
            return NextResponse.json({ status: "error", message: "Invalid plan selected." }, { status: 400 });
        }

        if (!isPaidPlan(body.plan)) {
            return NextResponse.json({ status: "error", message: "Starter plan does not require checkout." }, { status: 400 });
        }

        const isValidCardInput =
            body.cardholderName?.trim().length > 1 &&
            body.cardNumber?.replace(/\D/g, "").length >= 12 &&
            body.expiry?.trim().length >= 4 &&
            body.cvc?.replace(/\D/g, "").length >= 3;

        if (!isValidCardInput) {
            return NextResponse.json({ status: "error", message: "Enter valid payment details." }, { status: 400 });
        }

        const now = new Date().toISOString();

        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                billing_plan: body.plan,
                billing_status: "active",
                billing_cycle_anchor: now,
            })
            .eq("id", user.id);

        if (profileError) throw profileError;

        const { error: txError } = await supabase.from("billing_transactions").insert({
            user_id: user.id,
            plan: body.plan,
            amount_cents: PLAN_CONFIG[body.plan].monthlyPriceCents,
            status: "succeeded",
            card_last4: maskCard(body.cardNumber),
            payment_method: "dummy_card",
            metadata: {
                cardholderName: body.cardholderName.trim(),
                expiry: body.expiry.trim(),
            },
        });

        if (txError) throw txError;

        return NextResponse.json({
            status: "success",
            message: `Payment accepted. ${PLAN_CONFIG[body.plan].name} is now active.`,
            data: {
                plan: body.plan,
                aiMonthlyLimit: PLAN_CONFIG[body.plan].aiMonthlyLimit,
            },
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ status: "error", message: "Payment could not be processed." }, { status: 500 });
    }
}
