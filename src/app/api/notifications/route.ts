import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET: Check notification status
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("fcm_token")
            .eq("id", user.id)
            .single();

        return NextResponse.json({
            status: "success",
            data: { isSubscribed: !!profile?.fcm_token },
        });
    } catch (error) {
        console.error("Notifications error:", error);
        return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
    }
}

// POST: Save or update FCM token
export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { fcmToken } = body;

        if (!fcmToken || typeof fcmToken !== "string") {
            return NextResponse.json({ status: "error", message: "Valid FCM token is required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("profiles")
            .update({ fcm_token: fcmToken, updated_at: new Date().toISOString() })
            .eq("id", user.id);

        if (error) throw error;

        return NextResponse.json({ status: "success", message: "FCM token saved successfully" });
    } catch (error) {
        console.error("Notifications error:", error);
        return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
    }
}

// DELETE: Remove FCM token
export async function DELETE() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { error } = await supabase
            .from("profiles")
            .update({ fcm_token: null, updated_at: new Date().toISOString() })
            .eq("id", user.id);

        if (error) throw error;

        return NextResponse.json({ status: "success", message: "FCM token removed successfully" });
    } catch (error) {
        console.error("Notifications error:", error);
        return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
    }
}
