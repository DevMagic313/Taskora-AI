import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const supabase = createAdminClient();
        
        // Fetch the security question for this email
        const { data: profile, error } = await supabase
            .from("profiles")
            .select("security_question")
            .eq("email", email)
            .single();

        if (error || !profile) {
            return NextResponse.json({ message: "User not found or no security question set" }, { status: 404 });
        }

        return NextResponse.json({ question: profile.security_question });
    } catch (error: unknown) {
        return NextResponse.json({ message: (error as Error).message || "Internal server error" }, { status: 500 });
    }
}
