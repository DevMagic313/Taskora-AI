"use client";

interface SettingsHeaderProps {
    title: string;
    description: string;
}

export function SettingsHeader({ title, description }: SettingsHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
