import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: string;
    className?: string;
}

export function StatCard({ title, value, icon, trend, className = "" }: StatCardProps) {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-border ${className}`}
        >
            <div className="absolute -right-4 -top-4 opacity-5 blur-2xl w-20 h-20 bg-primary rounded-full pointer-events-none group-hover:opacity-10 transition-opacity" />

            <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {title}
                </p>
                {icon && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        {icon}
                    </div>
                )}
            </div>

            <p className="text-3xl font-bold tracking-tight">{value}</p>

            {trend && (
                <p className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {trend}
                </p>
            )}
        </div>
    );
}
