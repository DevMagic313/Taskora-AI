const RESEND_API_KEY = process.env.RESEND_API_KEY;

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Email skipped.");
    return { success: false, error: "Missing API Key" };
  }

  // Resend API expects 'to' as an array or string
  const toArray = Array.isArray(to) ? to : [to];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Taskora AI <onboarding@resend.dev>",
        to: toArray,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Resend API Error:", errorData);
      return { success: false, error: errorData };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: (error as Error).message };
  }
}
