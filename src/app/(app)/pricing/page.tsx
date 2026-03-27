"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Check, Sparkles, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { billingApi, type BillingUsageResponse } from "@/features/billing/api";
import { PLAN_CONFIG, PLAN_ORDER, type BillingPlan } from "@/features/billing/constants";

export const dynamic = "force-dynamic";

export default function PricingPage() {
    const { user } = useAuth();
    const [usage, setUsage] = useState<BillingUsageResponse | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);
    const [checkoutForm, setCheckoutForm] = useState({ cardholderName: "", cardNumber: "", expiry: "", cvc: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const plans = useMemo(
        () =>
            PLAN_ORDER.map((key) => {
                const plan = PLAN_CONFIG[key];
                return {
                    ...plan,
                    priceLabel: plan.monthlyPriceCents === 0 ? "Free" : `$${plan.monthlyPriceCents / 100}`,
                    cta: key === "starter" ? "Current plan" : `Upgrade to ${plan.name}`,
                    featured: key === "pro",
                };
            }),
        []
    );

    const getButtonText = (planKey: string, planCta: string) => {
        if (!usage) return planCta;
        if (usage.plan === planKey) return "Current Plan";
        const planLevels = { starter: 0, pro: 1, team: 2 };
        const currentLevel = planLevels[usage.plan as keyof typeof planLevels] ?? 0;
        const targetLevel = planLevels[planKey as keyof typeof planLevels] ?? 0;
        if (targetLevel < currentLevel) return "Downgrade";
        return `Upgrade to ${PLAN_CONFIG[planKey as BillingPlan]?.name ?? planKey}`;
    };

    useEffect(() => {
        billingApi.getUsage().then(setUsage).catch(() => {
            // silent
        });
    }, []);

    const handleCheckout = async () => {
        if (!selectedPlan) return;
        setIsSubmitting(true);
        try {
            await billingApi.checkout({ plan: selectedPlan, ...checkoutForm });
            toast.success(`${PLAN_CONFIG[selectedPlan].name} plan activated successfully.`);
            setSelectedPlan(null);
            setCheckoutForm({ cardholderName: "", cardNumber: "", expiry: "", cvc: "" });
            const latest = await billingApi.getUsage();
            setUsage(latest);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Checkout failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative z-10 w-full overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-overlay" />

            <div className="text-center space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 shadow-sm mx-auto">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple Pricing</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
                    Plans that <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">scale with you.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                    Start free. Upgrade anytime. AI usage is enforced per plan to protect platform quality.
                </p>
                {usage && (
                    <p className="text-sm font-semibold text-primary">
                        Current plan: {usage.planName} • {usage.used}/{usage.monthlyLimit} AI generations used this cycle
                    </p>
                )}
            </div>

            {usage && usage.plan !== "starter" && (
                <div className="relative z-10 max-w-2xl mx-auto mb-8 animate-fade-in">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800/40 dark:bg-emerald-900/10 px-6 py-4 flex items-center gap-4 shadow-sm">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                You are on the {usage.planName} plan
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
                                {usage.remaining} AI generations remaining this month
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                {plans.map((plan) => {
                    const isCurrent = usage?.plan === plan.key;
                    return (
                        <div
                            key={plan.name}
                            className={`relative group rounded-3xl border p-1 transition-all duration-300 hover:-translate-y-1 ${plan.featured
                                ? "border-primary/40 shadow-xl shadow-primary/10 scale-[1.02]"
                                : "border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20"
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/30 uppercase tracking-wider">
                                        <Star className="h-3 w-3 fill-current" /> Most Popular
                                    </span>
                                </div>
                            )}

                            <div className={`h-full rounded-[1.35rem] p-6 sm:p-8 flex flex-col ${plan.featured ? "bg-gradient-to-b from-primary/5 to-background" : "bg-background"}`}>
                                <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium mt-1">{plan.key === "starter" ? "Perfect for individuals getting started." : plan.key === "pro" ? "For power users and small teams." : "For organizations that need full control."}</p>

                                <div className="mt-6 mb-6">
                                    <span className="text-4xl sm:text-5xl font-black tracking-tighter">{plan.priceLabel}</span>
                                    {plan.monthlyPriceCents > 0 && <span className="text-muted-foreground font-medium text-sm">/month</span>}
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground">
                                            <div className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.featured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                                <Check className="h-3 w-3" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {isCurrent && usage?.plan !== "starter" ? (
                                    <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span className="text-sm font-bold">Active Plan</span>
                                    </div>
                                ) : (
                                    <Button
                                        variant={isCurrent ? "secondary" : plan.featured ? "primary" : "outline"}
                                        className={`w-full ${plan.featured ? "shadow-lg shadow-primary/20" : ""} ${getButtonText(plan.key, plan.cta) === "Downgrade" || isCurrent ? "opacity-60 grayscale" : ""}`}
                                        disabled={getButtonText(plan.key, plan.cta) === "Downgrade" || isCurrent}
                                        onClick={() => {
                                            if (isCurrent) return;
                                            if (plan.key === "starter") {
                                                toast.success("You are already on the free Starter plan.");
                                                return;
                                            }
                                            setSelectedPlan(plan.key);
                                        }}
                                    >
                                        {getButtonText(plan.key, plan.cta)}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedPlan && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl space-y-5">
                        <div>
                            <h2 className="text-xl font-bold">Complete checkout for {PLAN_CONFIG[selectedPlan].name}</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Demo mode: any syntactically-valid card details are accepted. No personal credentials are required.
                            </p>
                        </div>

                        <div className="grid gap-3">
                            <input className="h-11 rounded-xl border border-input bg-background px-4 text-sm" placeholder="Cardholder name" value={checkoutForm.cardholderName} onChange={(e) => setCheckoutForm((prev) => ({ ...prev, cardholderName: e.target.value }))} />
                            <input className="h-11 rounded-xl border border-input bg-background px-4 text-sm" placeholder="Card number" value={checkoutForm.cardNumber} onChange={(e) => setCheckoutForm((prev) => ({ ...prev, cardNumber: e.target.value }))} />
                            <div className="grid grid-cols-2 gap-3">
                                <input className="h-11 rounded-xl border border-input bg-background px-4 text-sm" placeholder="MM/YY" value={checkoutForm.expiry} onChange={(e) => setCheckoutForm((prev) => ({ ...prev, expiry: e.target.value }))} />
                                <input className="h-11 rounded-xl border border-input bg-background px-4 text-sm" placeholder="CVC" value={checkoutForm.cvc} onChange={(e) => setCheckoutForm((prev) => ({ ...prev, cvc: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <Button variant="outline" onClick={() => setSelectedPlan(null)}>Cancel</Button>
                            <Button isLoading={isSubmitting} onClick={handleCheckout} icon={<Sparkles className="h-4 w-4" />}>
                                Activate {PLAN_CONFIG[selectedPlan].name}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground/80">
                            Signed in as {user?.email || "your account"}. This will immediately apply your plan and AI limits.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
