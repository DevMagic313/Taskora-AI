"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    confirmVariant?: "danger" | "primary";
    isLoading?: boolean;
    /** If set, user must type this text to enable confirm */
    confirmText?: string;
    children?: React.ReactNode;
}

export function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    confirmVariant = "danger",
    isLoading = false,
    confirmText,
    children,
}: ConfirmModalProps) {
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setInputValue("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    // Close on escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    const canConfirm = confirmText ? inputValue === confirmText : true;

    const buttonStyles =
        confirmVariant === "danger"
            ? "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-500/50"
            : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 rounded-xl border border-border bg-card p-6 shadow-2xl animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>

                {children}

                {confirmText && (
                    <div className="mt-4">
                        <label className="text-sm font-medium text-muted-foreground">
                            Type <span className="font-bold text-foreground">{confirmText}</span> to confirm
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder={confirmText}
                        />
                    </div>
                )}

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!canConfirm || isLoading}
                        className={`h-10 rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed ${buttonStyles}`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
