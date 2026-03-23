const appName = "Taskora AI";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Standard Wrapper to keep styling DRY
const baseLayout = (content: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="background-color:#f4f4f5;padding:40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#8b5cf6);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">✦ ${appName}</h1>
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            ${content}
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f5;padding:24px 40px;text-align:center;border-top:1px solid #e4e4e7;">
            <p style="margin:0;font-size:12px;color:#a1a1aa;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
            <p style="margin:6px 0 0;font-size:12px;color:#a1a1aa;">
              <a href="${appUrl}" style="color:#4f46e5;text-decoration:none;">taskora.ai</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;

export const templates = {
  // 1. Welcome Email
  welcome: (name: string) => baseLayout(`
    <h2 style="margin:0 0 16px;color:#09090b;font-size:20px;font-weight:700;">Welcome to ${appName}! 🎉</h2>
    <p style="margin:0 0 24px;color:#71717a;font-size:16px;line-height:1.6;">
      Hi ${name},<br><br>
      We're thrilled to have you on board. ${appName} is designed to help you organize your work, collaborate with your team seamlessly, and get things done faster alongside AI.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${appUrl}/dashboard" style="display:inline-block;background:#09090b;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 32px;border-radius:8px;">
        Go to your Dashboard
      </a>
    </div>
    <p style="margin:0;color:#a1a1aa;font-size:14px;">Let's achieve great things together.</p>
  `),

  // 2. Password Reset
  passwordReset: (resetLink: string) => baseLayout(`
    <h2 style="margin:0 0 16px;color:#09090b;font-size:20px;font-weight:700;">Reset your password</h2>
    <p style="margin:0 0 24px;color:#71717a;font-size:16px;line-height:1.6;">
      We received a request to reset your password for your ${appName} account. If you didn't make this request, you can safely ignore this email.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetLink}" style="display:inline-block;background:#09090b;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 32px;border-radius:8px;">
        Reset Password
      </a>
    </div>
    <p style="margin:0;color:#a1a1aa;font-size:14px;">This link will expire in 24 hours.</p>
  `),

  // 3. Task Reminder
  taskReminder: (taskTitle: string, dueDate: string) => baseLayout(`
    <h2 style="margin:0 0 16px;color:#09090b;font-size:20px;font-weight:700;">Task Reminder ⏰</h2>
    <p style="margin:0 0 24px;color:#71717a;font-size:16px;line-height:1.6;">
      This is a quick reminder about an upcoming task on your list.
    </p>
    <div style="background:#f4f4f5;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:13px;color:#71717a;font-weight:500;">Task</p>
      <p style="margin:0 0 16px;font-size:16px;color:#09090b;font-weight:600;">${taskTitle}</p>
      <p style="margin:0 0 4px;font-size:13px;color:#71717a;font-weight:500;">Due Date</p>
      <p style="margin:0;font-size:15px;color:#ef4444;font-weight:600;">${dueDate}</p>
    </div>
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="${appUrl}/dashboard" style="display:inline-block;background:#09090b;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 32px;border-radius:8px;">
        View Task
      </a>
    </div>
  `),

  // 4. Workspace Invite
  workspaceInvite: (workspaceName: string, role: string, inviterName: string) => baseLayout(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#09090b;letter-spacing:-0.5px;">
      You're invited! 🎉
    </h1>
    <p style="margin:0 0 24px;font-size:16px;color:#71717a;line-height:1.6;">
      <strong style="color:#09090b;">${inviterName}</strong> has invited you to join the 
      <strong style="color:#4f46e5;">${workspaceName}</strong> workspace on ${appName} as a <strong style="color:#09090b;">${role}</strong>.
    </p>

    <!-- Info Box -->
    <div style="background:#f4f4f5;border-radius:12px;padding:20px 24px;margin:0 0 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;">
            <span style="font-size:13px;color:#71717a;font-weight:500;">Workspace</span>
            <span style="float:right;font-size:13px;color:#09090b;font-weight:700;">${workspaceName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;border-top:1px solid #e4e4e7;">
            <span style="font-size:13px;color:#71717a;font-weight:500;">Your Role</span>
            <span style="float:right;font-size:13px;color:#09090b;font-weight:700;text-transform:capitalize;">${role}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;border-top:1px solid #e4e4e7;">
            <span style="font-size:13px;color:#71717a;font-weight:500;">Invited by</span>
            <span style="float:right;font-size:13px;color:#09090b;font-weight:700;">${inviterName}</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA Button -->
    <div style="text-align:center;margin:0 0 32px;">
      <a href="${appUrl}/register" 
         style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 40px;border-radius:12px;letter-spacing:0.2px;box-shadow:0 4px 16px rgba(79,70,229,0.3);">
        Accept Invitation →
      </a>
    </div>

    <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;text-align:center;line-height:1.6;">
      If you already have an account, 
      <a href="${appUrl}/login" style="color:#4f46e5;text-decoration:none;font-weight:600;">sign in here</a>
      and you'll be added to the workspace automatically.
    </p>

    <p style="margin:0;font-size:12px;color:#d4d4d8;text-align:center;">
      If you weren't expecting this invitation, you can safely ignore this email.
    </p>
  `),
};
