"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Check, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { billingApi, type BillingUsageResponse } from "@/features/billing/api";
import { PLAN_CONFIG, PLAN_ORDER, type BillingPlan } from "@/features/billing/constants";

export const dynamic = "force-dynamic";

const formatLimitLabel = (limit: number | null, noun: string) => {
    if (limit === null) return "Unlimited";
    return `${limit.toLocaleString()} ${noun}`;
};

const usagePercent = (used: number, limit: number | null) => {
    if (limit === null || limit === 0) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
};

const formatRenewalDate = (date?: string) => {
    if (!date) return "Not scheduled";
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
    }).format(new Date(date));
};

export default function PricingPage() {
    const { user } = useAuth();
    const [usage, setUsage] = useState<BillingUsageResponse | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);
    const [checkoutForm, setCheckoutForm] = useState({
        cardholderName: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const plans = useMemo(
        () =>
            PLAN_ORDER.map((key) => {
                const plan = PLAN_CONFIG[key];
                return {
                    ...plan,
                    key,
                    priceLabel: plan.monthlyPriceCents === 0 ? "Free" : `$${plan.monthlyPriceCents / 100}`,
                    cta: key === "starter" ? "Current plan" : `Upgrade to ${plan.name}`,
                    featured: key === "pro",
                };
            }),
        []
    );

    useEffect(() => {
        billingApi
            .getUsage()
            .then(setUsage)
            .catch(() => {
                // silent
            });
    }, []);

    const currentPlanKey: BillingPlan = usage?.plan ?? "starter";
    const currentPlan = PLAN_CONFIG[currentPlanKey];

    const handleCheckout = async () => {
        if (!selectedPlan) {
            toast.error("Please select a plan to continue.");
            return;
        }

        setIsSubmitting(true);
        try {
            const latest = await billingApi.checkout({ plan: selectedPlan, ...checkoutForm });
            setUsage(latest);
            toast.success(`${PLAN_CONFIG[selectedPlan].name} plan activated successfully.`);
            setSelectedPlan(null);
            setCheckoutForm({ cardholderName: "", cardNumber: "", expiry: "", cvc: "" });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Checkout failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFieldChange = (key: keyof typeof checkoutForm, value: string) => {
        setCheckoutForm((prev) => ({ ...prev, [key]: value }));
    };

    const renderUsageStat = (label: string, used: number, limit: number | null) => {
        const percent = usagePercent(used, limit);
        return (
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm">
                <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold text-foreground">
                        {limit === null ? `${used} used` : `${used} / ${limit}`}
                    </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                    {limit === null ? "Unlimited usage" : `${Math.min(100, percent)}% of monthly allowance`}
                </p>
            </div>
        );
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative z-10 w-full overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-overlay" />

            <div className="text-center space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 shadow-sm mx-auto">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Smart billing powered by AI</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
                    Plans that <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">scale with you.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                    Start free. Upgrade when you need more power. No hidden fees, cancel anytime.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 relative z-10">
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                                    Current plan
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">You are on</p>
                                    <h3 className="text-2xl font-black">{currentPlan.name}</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Renews on</p>
                                <p className="text-lg font-semibold">{formatRenewalDate(usage?.renewsOn)}</p>
                                <p className="text-sm text-muted-foreground">
                                    Billing to {user?.email ?? "your account email"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {renderUsageStat(
                                "Tasks",
                                usage?.tasksUsed ?? 0,
                                usage?.tasksLimit ?? PLAN_CONFIG[currentPlanKey].limits.tasks
                            )}
                            {renderUsageStat(
                                "AI generations",
                                usage?.aiUsed ?? 0,
                                usage?.aiLimit ?? PLAN_CONFIG[currentPlanKey].limits.aiGenerations
                            )}
                            {renderUsageStat(
                                "Workspaces",
                                usage?.workspaceCount ?? 0,
                                usage?.workspaceLimit ?? PLAN_CONFIG[currentPlanKey].limits.workspaces
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-border/60 bg-background/70 p-6 shadow-md space-y-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Secure checkout</p>
                            <h3 className="text-xl font-semibold">
                                {selectedPlan ? PLAN_CONFIG[selectedPlan].name : "Select a plan"}
                            </h3>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <label className="space-y-2 text-sm font-medium text-foreground">
                            Cardholder name
                            <input
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                                placeholder="Alex Carter"
                                value={checkoutForm.cardholderName}
                                onChange={(e) => handleFieldChange("cardholderName", e.target.value)}
                            />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-foreground">
                            Card number
                            <input
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                                placeholder="4242 4242 4242 4242"
                                value={checkoutForm.cardNumber}
                                onChange={(e) => handleFieldChange("cardNumber", e.target.value)}
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="space-y-2 text-sm font-medium text-foreground">
                                Expiry
                                <input
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                                    placeholder="MM/YY"
                                    value={checkoutForm.expiry}
                                    onChange={(e) => handleFieldChange("expiry", e.target.value)}
                                />
                            </label>
                            <label className="space-y-2 text-sm font-medium text-foreground">
                                CVC
                                <input
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                                    placeholder="123"
                                    value={checkoutForm.cvc}
                                    onChange={(e) => handleFieldChange("cvc", e.target.value)}
                                />
                            </label>
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        variant="primary"
                        isLoading={isSubmitting}
                        disabled={!selectedPlan}
                        onClick={handleCheckout}
                    >
                        {selectedPlan ? `Activate ${PLAN_CONFIG[selectedPlan].name}` : "Choose a plan to continue"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        Your payment details are encrypted. You can change or cancel your subscription anytime.
                    </p>
                </div>
            </div>

            <div className="relative z-10 grid gap-8 md:grid-cols-3">
                {plans.map((plan) => {
                    const isCurrent = plan.key === currentPlanKey;
                    const isSelected = plan.key === selectedPlan;

                    return (
                        <div
                            key={plan.key}
                            className={`relative group rounded-3xl border p-1 transition-all duration-300 hover:-translate-y-1 ${plan.featured
                                ? "border-primary/40 shadow-xl shadow-primary/10 scale-[1.01]"
                                : "border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20"
                                } ${isSelected ? "ring-2 ring-primary/60" : ""}`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/30 uppercase tracking-wider">
                                        <Star className="h-3 w-3 fill-current" /> {plan.badge ?? "Recommended"}
                                    </span>
                                </div>
                            )}

                            <div
                                className={`h-full rounded-[1.35rem] p-6 sm:p-8 flex flex-col ${plan.featured ? "bg-gradient-to-b from-primary/5 to-background" : "bg-background"}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground font-medium mt-1">{plan.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-4xl sm:text-5xl font-black tracking-tighter">{plan.priceLabel}</span>
                                        {plan.monthlyPriceCents > 0 && (
                                            <span className="block text-muted-foreground text-sm">per month</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                                    <div className="rounded-xl border border-border/60 px-3 py-2">
                                        Tasks: {formatLimitLabel(plan.limits.tasks, "tasks")}
                                    </div>
                                    <div className="rounded-xl border border-border/60 px-3 py-2">
                                        AI: {formatLimitLabel(plan.limits.aiGenerations, "generations")}
                                    </div>
                                    <div className="rounded-xl border border-border/60 px-3 py-2">
                                        Workspaces: {formatLimitLabel(plan.limits.workspaces, "spaces")}
                                    </div>
                                    <div className="rounded-xl border border-border/60 px-3 py-2">
                                        Collaborators: {formatLimitLabel(plan.limits.collaborators, "members")}
                                    </div>
                                </div>

                                <ul className="space-y-3 my-6 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground">
                                            <div
                                                className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.featured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                                            >
                                                <Check className="h-3 w-3" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={isCurrent ? "secondary" : plan.featured ? "primary" : "outline"}
                                    className={`w-full ${plan.featured ? "shadow-lg shadow-primary/20" : ""}`}
                                    onClick={() => setSelectedPlan(plan.key)}
                                    disabled={isCurrent}
                                >
                                    {isCurrent ? "Current plan" : isSelected ? "Selected" : plan.cta}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
