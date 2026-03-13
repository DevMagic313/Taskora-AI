"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AppError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6 ring-8 ring-red-50/50 dark:ring-red-900/10">
                <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Something went wrong</h2>
            <p className="text-muted-foreground font-medium max-w-md mb-8 leading-relaxed">
                {error.message || "An unexpected error occurred. Please try again."}
            </p>
            <Button
                onClick={reset}
                icon={<RefreshCw className="h-4 w-4" />}
                className="shadow-lg shadow-primary/20"
            >
                Try Again
            </Button>
        </div>
    );
}
