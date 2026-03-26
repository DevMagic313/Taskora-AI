"use client";

import { useEffect, useState } from "react";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { Button } from "@/components/ui/Button";
import { billingApi, type BillingUsageResponse } from "@/features/billing/api";

export const dynamic = "force-dynamic";

export default function BillingSettingsPage() {
    const [usage, setUsage] = useState<BillingUsageResponse | null>(null);

    useEffect(() => {
        billingApi.getUsage().then(setUsage).catch(() => {
            // silent
        });
    }, []);

    return (
        <div className="animate-fade-in space-y-6">
            <SettingsHeader
                title="Billing & Plan"
                description="Manage your active plan, AI usage limits, and upgrade options."
            />

            <SettingsCard>
                {!usage ? (
                    <p className="text-sm text-muted-foreground">Loading billing details...</p>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Current plan</p>
                            <h3 className="text-xl font-bold mt-1">{usage.planName}</h3>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">AI usage this cycle</p>
                            <p className="text-sm font-semibold mt-1">{usage.used} / {usage.monthlyLimit} generations used</p>
                            <p className="text-xs text-muted-foreground mt-1">Resets on {new Date(usage.periodEnd).toLocaleDateString()}</p>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${Math.min((usage.used / usage.monthlyLimit) * 100, 100)}%` }}
                            />
                        </div>
                        <Button onClick={() => { window.location.href = "/pricing"; }}>
                            View plans and upgrade
                        </Button>
                    </div>
                )}
            </SettingsCard>
        </div>
    );
}
