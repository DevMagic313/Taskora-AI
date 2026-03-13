"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
    return (
        <HotToaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: "var(--card)",
                    color: "var(--card-foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    padding: "12px 16px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                },
                success: {
                    iconTheme: {
                        primary: "var(--primary)",
                        secondary: "var(--primary-foreground)",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#ffffff",
                    },
                },
            }}
        />
    );
}
