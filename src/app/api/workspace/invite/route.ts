import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, role, workspaceId, workspaceName } = await request.json();

    if (!email || !workspaceId) {
      return NextResponse.json(
        { error: "Email and workspaceId required" }, 
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Send invite email using Supabase admin
    // This sends a magic link / OTP to the invited email
    const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: {
        invited_to_workspace: workspaceId,
        invited_role: role,
        workspace_name: workspaceName || "a workspace",
        invited_by_name: user.user_metadata?.name || user.email,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    if (error) {
      // User might already exist — that's okay, invite is still in DB
      console.error("Email invite error:", error.message);
      // Don't throw — the DB invite record was already created
      return NextResponse.json({ 
        success: true, 
        warning: "User already exists, invite saved to database" 
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Invite API error:", err);
    return NextResponse.json(
      { error: "Failed to send invite email" }, 
      { status: 500 }
    );
  }
}
