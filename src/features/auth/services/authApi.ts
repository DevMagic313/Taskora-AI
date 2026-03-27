"use client";

import { createClient } from "@/lib/supabase/client";

export interface AuthResponse {
    status: "success" | "error";
    message: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    /** True when the user must verify their email before they can sign in. */
    emailConfirmationRequired?: boolean;
}

// Maps Supabase error messages to user-friendly strings
const AUTH_ERROR_MESSAGES: Record<string, string> = {
    "Invalid login credentials":
        "Incorrect email or password. Please try again.",
    "Email not confirmed":
        "Please verify your email address before logging in. Check your inbox for a confirmation link.",
    "Invalid email or password":
        "Incorrect email or password. Please try again.",
    "User already registered":
        "An account with this email already exists. Please sign in instead.",
    "Signup requires a valid password":
        "Password does not meet the minimum requirements (at least 6 characters).",
};

function mapAuthError(message: string): string {
    return AUTH_ERROR_MESSAGES[message] || message || "An unexpected authentication error occurred.";
}

export async function loginApi(
    email: string,
    password: string
): Promise<AuthResponse> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(mapAuthError(error.message));
    }

    return {
        status: "success",
        message: "Login successful",
        user: {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "User",
            email: data.user.email || "",
        },
    };
}

export async function registerApi(
    name: string,
    email: string,
    password: string
): Promise<AuthResponse> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    if (error) {
        throw new Error(mapAuthError(error.message));
    }

    // When Supabase has "Confirm email" ON, data.user is set but data.session
    // is null. The user must click the verification link before they can log in.
    if (data.user && !data.session) {
        return {
            status: "success",
            message:
                "Registration successful. Please check your email and confirm your account before logging in.",
            emailConfirmationRequired: true,
        };
    }

    return {
        status: "success",
        message: "Account created successfully",
        user: {
            id: data.user?.id || "",
            name,
            email: data.user?.email || email,
        },
    };
}
