"use client";

import { LucideIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ComingSoonSettingsProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export function ComingSoonSettings({ title, description, icon: Icon }: ComingSoonSettingsProps) {
    const handleNotify = () => {
        toast.success("We'll let you know!");
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight mb-3">{title}</h2>

                <p className="text-muted-foreground mb-8 leading-relaxed">{description}</p>

                <button
                    onClick={handleNotify}
                    className="h-11 rounded-xl bg-primary text-primary-foreground px-6 text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                    Notify me when available
                </button>

                <p className="text-xs text-muted-foreground/60 mt-6">
                    This feature is coming soon. Stay tuned!
                </p>
            </div>
        </div>
    );
}
