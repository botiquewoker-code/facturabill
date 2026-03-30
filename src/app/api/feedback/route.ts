import { NextResponse } from "next/server";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import {
  EmailConfigError,
  getEmailFrom,
  getEmailInbox,
  getSesClient,
} from "@/features/server/email";

export const runtime = "nodejs";

type FeedbackPayload = {
  email?: string;
  mensaje?: string;
  nombre?: string;
};

export async function POST(req: Request) {
  try {
    const { email, mensaje, nombre } = (await req.json()) as FeedbackPayload;
    const ses = getSesClient();
    const emailFrom = getEmailFrom();
    const emailInbox = getEmailInbox();

    await ses.send(
      new SendEmailCommand({
        Source: emailFrom,
        Destination: {
          ToAddresses: [emailInbox],
        },
        ReplyToAddresses:
          typeof email === "string" && email.trim() ? [email.trim()] : [],
        Message: {
          Subject: {
            Data: "Nueva sugerencia Facturabill",
          },
          Body: {
            Text: {
              Data: `Nombre: ${nombre || "No indicado"}\nEmail: ${email || "No indicado"}\n\nMensaje:\n${mensaje || "Sin mensaje"}`,
            },
          },
        },
      }),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando feedback:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof EmailConfigError
            ? "Feedback email service is not configured correctly"
            : "Unable to send feedback",
      },
      { status: 500 },
    );
  }
}
