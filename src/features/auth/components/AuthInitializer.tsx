"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Client component that initializes the Supabase auth session on app load.
 * Cleans up the auth state listener on unmount to prevent memory leaks.
 */
export function AuthInitializer() {
    const initialize = useAuthStore((s) => s.initialize);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        initialize().then((handle) => {
            unsubscribe = handle.unsubscribe;
        });

        return () => {
            unsubscribe?.();
        };
    }, [initialize]);

    return null;
}
