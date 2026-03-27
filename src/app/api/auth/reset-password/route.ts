import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, answer, newPassword } = await request.json();

        if (!email || !answer || !newPassword) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Fetch the user's stored answer
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id, security_answer_hash")
            .eq("email", email)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 2. Verify the answer
        // We'll normalize the answer to be case-insensitive and trimmed
        const normalizedInput = answer.toLowerCase().trim();
        const storedAnswer = profile.security_answer_hash?.toLowerCase().trim();

        if (normalizedInput !== storedAnswer) {
            return NextResponse.json({ message: "Incorrect security answer" }, { status: 401 });
        }

        // 3. Reset the password for the user
        const { error: resetError } = await supabase.auth.admin.updateUserById(
            profile.id,
            { password: newPassword }
        );

        if (resetError) {
            throw resetError;
        }

        return NextResponse.json({ 
            status: "success", 
            message: "Password reset successfully. You can now login with your new password." 
        });
    } catch (error: unknown) {
        console.error("Password reset error:", error);
        return NextResponse.json({ message: (error as Error).message || "Internal server error" }, { status: 500 });
    }
}
