"use client";

import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: string;
    className?: string;
    sparklineData?: number[];
}

function MiniSparkline({ data }: { data: number[] }) {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data, 1);
    const width = 80;
    const height = 28;
    const padding = 2;

    const points = data.map((v, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - (v / max) * (height - padding * 2);
        return `${x},${y}`;
    }).join(" ");

    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill="url(#sparkGradient)" />
            <polyline
                points={points}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-60"
            />
        </svg>
    );
}

export function StatCard({ title, value, icon, trend, className = "", sparklineData }: StatCardProps) {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-border hover:-translate-y-0.5 ${className}`}
        >
            {/* Hover gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute -right-4 -top-4 opacity-5 blur-2xl w-20 h-20 bg-primary rounded-full pointer-events-none group-hover:opacity-10 transition-opacity" />

            <div className="relative z-10">
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

                <div className="flex items-end justify-between gap-2">
                    <div>
                        <p className="text-3xl font-bold tracking-tight tabular-nums animate-count-up">{value}</p>
                        {trend && (
                            <p className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                {trend}
                            </p>
                        )}
                    </div>
                    {sparklineData && sparklineData.length >= 2 && (
                        <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                            <MiniSparkline data={sparklineData} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
