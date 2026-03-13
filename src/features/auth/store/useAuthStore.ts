"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: AuthUser | null) => void;
    initialize: () => Promise<{ unsubscribe: () => void }>;
    logout: () => Promise<void>;
}

function mapSupabaseUser(user: User): AuthUser {
    return {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
    };
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) => {
        set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
        });
    },

    initialize: async () => {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            set({
                user: mapSupabaseUser(user),
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }

        // Listen for auth state changes and return unsubscribe handle
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                set({
                    user: mapSupabaseUser(session.user),
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        });

        return { unsubscribe: () => subscription.unsubscribe() };
    },

    logout: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        set({
            user: null,
            isAuthenticated: false,
        });
    },
}));
