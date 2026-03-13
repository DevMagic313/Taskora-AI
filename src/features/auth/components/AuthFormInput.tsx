"use client";

import React from "react";

interface AuthFormInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
}

export function AuthFormInput({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    autoComplete,
}: AuthFormInputProps) {
    return (
        <div className="space-y-1.5">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-foreground/80"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-muted-foreground/50"
            />
        </div>
    );
}
