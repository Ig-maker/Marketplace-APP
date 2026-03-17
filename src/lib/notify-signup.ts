import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.SIGNUP_NOTIFICATION_EMAIL ?? "ushakov.iggor@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Shelvian <onboarding@resend.dev>";

export interface SignupNotificationPayload {
  email: string;
  fullName?: string;
  role: "brand" | "ambassador";
  authProvider?: "email" | "google";
  phone?: string;
}

/**
 * Sends an admin notification email when a new user signs up.
 * Fails silently (logs only) so signup flow is never blocked.
 */
export async function notifySignup(payload: SignupNotificationPayload): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[notify-signup] RESEND_API_KEY not set — skipping notification");
    return;
  }

  const { email, fullName, role, authProvider = "email", phone } = payload;
  const displayName = fullName || email || (phone ? `Ambassador ${phone.slice(-4)}` : "Unknown");

  const subject = `New ${role} signup: ${displayName}`;
  const html = `
    <h2>New ${role} sign-up</h2>
    <p><strong>Email:</strong> ${email || "—"}</p>
    <p><strong>Name:</strong> ${displayName}</p>
    <p><strong>Role:</strong> ${role}</p>
    <p><strong>Auth:</strong> ${authProvider}</p>
    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
    <p><em>Sent from Shelvian app</em></p>
  `;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [NOTIFICATION_EMAIL],
      subject,
      html,
    });

    if (error) {
      console.error("[notify-signup] Resend error:", error);
    }
  } catch (err) {
    console.error("[notify-signup] Failed to send:", err);
  }
}
