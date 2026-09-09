import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("[Contact API] RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email delivery service is currently not configured." },
        { status: 500 }
      );
    }

    const contactEmail = process.env.CONTACT_EMAIL;
    if (!contactEmail) {
      console.error("[Contact API] CONTACT_EMAIL is not configured");
      return NextResponse.json(
        { error: "Destination inbox address is not configured." },
        { status: 500 }
      );
    }

    const { name, email, subject, message } = await req.json();

    // Server-side validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    const resend = new Resend(resendApiKey);

    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "FitPilot AI <onboarding@resend.dev>";

    const emailSubject = subject?.trim()
      ? `[FitPilot Contact] ${subject.trim()} - ${name.trim()}`
      : `[FitPilot Contact] New message from ${name.trim()}`;

    const textContent = `New Inquiry from FitPilot AI Contact Form:
------------------------------------------
Name: ${name.trim()}
Email: ${email.trim()}
Topic: ${subject || "General Support"}

Message:
${message.trim()}
------------------------------------------
Reply directly to this email to contact ${name.trim()} at ${email.trim()}`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #334155; border-radius: 8px; background-color: #0b0f17; color: #e2e8f0;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #06b6d4; margin: 0; font-size: 20px; font-family: monospace;">FITPILOT AI // INQUIRY DISPATCH</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px; font-family: monospace;">New message received via fitpilot.ai contact form</p>
        </div>

        <div style="background-color: #111827; border: 1px solid #1e293b; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #06b6d4;">Sender Name:</strong> ${name.trim()}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #06b6d4;">Sender Email:</strong> <a href="mailto:${email.trim()}" style="color: #38bdf8; text-decoration: underline;">${email.trim()}</a></p>
          <p style="margin: 0; font-size: 14px;"><strong style="color: #06b6d4;">Inquiry Topic:</strong> ${subject || "General Support"}</p>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #cbd5e1; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; font-family: monospace;">Message Content:</h3>
          <div style="background-color: #111827; border-left: 3px solid #06b6d4; padding: 14px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap;">
${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </div>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #64748b; font-family: monospace;">
          Reply to this notification directly to respond to ${email.trim()}.
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [contactEmail],
      replyTo: email.trim(),
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error("[Contact API] Resend API response error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to dispatch email via Resend." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: "Email dispatched successfully.",
    });
  } catch (err: any) {
    console.error("[Contact API] Server handler exception:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
