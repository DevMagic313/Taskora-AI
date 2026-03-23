import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { templates } from "@/lib/email/templates";

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

    const inviterName = user.user_metadata?.name || user.email || "A teammate";

    const result = await sendEmail({
      to: email,
      subject: `${inviterName} invited you to join ${workspaceName} on Taskora AI`,
      html: templates.workspaceInvite(workspaceName, role, inviterName),
    });

    if (!result.success) {
      if (result.error === "Missing API Key") {
        return NextResponse.json({ success: true, warning: "Email not sent: no API key" });
      }
      return NextResponse.json({
        success: true,
        warning: "Invite saved but email delivery failed"
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