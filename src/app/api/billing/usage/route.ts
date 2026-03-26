import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBillingUsage } from "@/features/billing/server";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const usage = await getBillingUsage(supabase, user.id);
        return NextResponse.json({ status: "success", data: usage });
    } catch (error) {
        console.error("Billing usage error:", error);
        return NextResponse.json({ status: "error", message: "Failed to load billing usage" }, { status: 500 });
    }
}
