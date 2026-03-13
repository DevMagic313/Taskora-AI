import React from "react";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
            {icon && (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-5">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mb-1.5">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
