"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "ghost" | "outline" | "danger" | "secondary";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    icon,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";

    const variants: Record<string, string> = {
        primary:
            "bg-foreground text-background hover:opacity-90 shadow-md hover:shadow-lg",
        secondary:
            "bg-muted text-foreground border border-border hover:bg-muted/80",
        ghost:
            "text-muted-foreground hover:bg-muted hover:text-foreground",
        outline:
            "border border-border text-foreground hover:bg-muted",
        danger:
            "bg-red-500 text-white hover:bg-red-600 shadow-md",
    };

    const sizes: Record<string, string> = {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : null}
            {children}
            {icon && !isLoading ? icon : null}
        </button>
    );
}
