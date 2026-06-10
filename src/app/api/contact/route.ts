import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
  honeypot: z.string().max(0).optional(),
});

// TODO: Add rate limiting middleware
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Spam trap - silently accept if honeypot is filled
    if (body.honeypot) {
      return NextResponse.json({ success: true, message: "Message sent" });
    }

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // Log for now - Resend integration can be added later
    console.log("📧 New contact form submission:", { name, email, subject, message });

    // TODO: Integrate with Resend for email delivery
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Contact Form <noreply@annam.id.vn>',
    //   to: 'annamnguyen204@gmail.com',
    //   subject: `[Portfolio] ${subject}`,
    //   html: `<p>From: ${name} (${email})</p><p>${message}</p>`,
    // });

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
