"use client";

import { CreditCard, Check, Sparkles, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";

const plans = [
    {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for individuals getting started.",
        features: ["Up to 50 tasks", "Basic AI generation", "Email support", "1 workspace"],
        cta: "Current Plan",
        featured: false,
        comingSoon: false,
    },
    {
        name: "Pro",
        price: "$12",
        period: "/month",
        description: "For power users and small teams.",
        features: ["Unlimited tasks", "Advanced AI with GPT-4", "Priority support", "10 workspaces", "Analytics dashboard", "Custom categories"],
        cta: "Coming Soon",
        featured: true,
        comingSoon: true,
    },
    {
        name: "Team",
        price: "$49",
        period: "/month",
        description: "For organizations that need full control.",
        features: ["Everything in Pro", "Unlimited workspaces", "SSO & SAML", "Dedicated support", "Custom integrations", "SLA guarantee", "Admin controls"],
        cta: "Coming Soon",
        featured: false,
        comingSoon: true,
    },
];

export default function PricingPage() {
    const { user } = useAuth();

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
                    Start free. Upgrade when you need more power. No hidden fees, cancel anytime.
                </p>
            </div>

            <div className="relative z-10 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative group rounded-3xl border p-1 transition-all duration-300 hover:-translate-y-1 ${plan.featured
                            ? "border-primary/40 shadow-xl shadow-primary/10 scale-[1.02]"
                            : "border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20"
                            }`}
                    >
                        {plan.featured && !plan.comingSoon && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/30 uppercase tracking-wider">
                                    <Star className="h-3 w-3 fill-current" /> Most Popular
                                </span>
                            </div>
                        )}
                        {plan.comingSoon && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-4 py-1.5 text-xs font-bold text-muted-foreground shadow-sm uppercase tracking-wider">
                                    <Clock className="h-3 w-3" /> Coming Soon
                                </span>
                            </div>
                        )}

                        <div className={`h-full rounded-[1.35rem] p-6 sm:p-8 flex flex-col ${plan.featured && !plan.comingSoon ? "bg-gradient-to-b from-primary/5 to-background" : "bg-background"} ${plan.comingSoon ? "opacity-70" : ""}`}>
                            <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                            <p className="text-sm text-muted-foreground font-medium mt-1">{plan.description}</p>

                            <div className="mt-6 mb-6">
                                <span className="text-4xl sm:text-5xl font-black tracking-tighter">{plan.price}</span>
                                {plan.period && <span className="text-muted-foreground font-medium text-sm">{plan.period}</span>}
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground">
                                        <div className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.featured && !plan.comingSoon ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                            <Check className="h-3 w-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.comingSoon ? "secondary" : plan.featured ? "primary" : "outline"}
                                className={`w-full ${plan.featured && !plan.comingSoon ? "shadow-lg shadow-primary/20" : ""}`}
                                disabled={plan.comingSoon}
                            >
                                {plan.cta}
                            </Button>

                            {plan.comingSoon && (
                                <button
                                    onClick={() => toast.success(user?.email ? `We'll notify you at ${user.email} when this plan launches.` : "We'll notify you when this plan launches.")}
                                    className="mt-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-center w-full"
                                >
                                    Get notified when available →
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
