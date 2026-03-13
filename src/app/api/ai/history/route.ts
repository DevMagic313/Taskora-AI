import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET: Fetch last 10 generation histories for authenticated user
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from("ai_generation_history")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) throw error;

        return NextResponse.json({ status: "success", data });
    } catch (error) {
        console.error("AI history fetch error:", error);
        return NextResponse.json({ status: "error", message: "Failed to fetch generation history" }, { status: 500 });
    }
}

// POST: Save a new generation history entry
export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { goal, result } = body;

        if (!goal || typeof goal !== "string" || goal.trim().length === 0) {
            return NextResponse.json({ status: "error", message: "Goal is required" }, { status: 400 });
        }

        if (!Array.isArray(result)) {
            return NextResponse.json({ status: "error", message: "Result must be an array" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("ai_generation_history")
            .insert({
                user_id: user.id,
                goal: goal.trim(),
                result,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ status: "success", data }, { status: 201 });
    } catch (error) {
        console.error("AI history save error:", error);
        return NextResponse.json({ status: "error", message: "Failed to save generation history" }, { status: 500 });
    }
}
