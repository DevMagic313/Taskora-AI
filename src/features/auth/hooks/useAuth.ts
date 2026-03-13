"use client";

import { useAuthStore } from "../store/useAuthStore";

/**
 * Custom hook to abstract the Zustand auth store operations.
 * Components can reactively subscribe to auth state changes
 * and perform login/logout actions easily.
 */
export function useAuth() {
    const { user, isAuthenticated, isLoading, setUser, logout, initialize } =
        useAuthStore();

    const handleLogout = async () => {
        await logout();
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        setUser,
        handleLogout,
        initialize,
    };
}
