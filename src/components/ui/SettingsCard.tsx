"use client";

import React from "react";

interface SettingsCardProps {
    children: React.ReactNode;
    className?: string;
    danger?: boolean;
}

export function SettingsCard({ children, className = "", danger = false }: SettingsCardProps) {
    return (
        <div
            className={`rounded-xl border ${
                danger
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-border bg-card"
            } p-6 ${className}`}
        >
            {children}
        </div>
    );
}
