import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return apiError("Unauthorized", 401);

    const body = await req.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return apiError("Missing required fields: to, subject, html");
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Cafe Lux <noreply@cafelux.com>",
      to,
      subject,
      html,
    });

    if (error) return apiError(error.message);

    return apiSuccess({ success: true, id: data?.id });
  } catch {
    return apiError("Failed to send email", 500);
  }
}
