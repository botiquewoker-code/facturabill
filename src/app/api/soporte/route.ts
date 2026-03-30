import { NextResponse } from "next/server";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import {
  EmailConfigError,
  getEmailFrom,
  getEmailInbox,
  getSesClient,
} from "@/features/server/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { nombre, email, mensaje, urgente } = await req.json();
    const ses = getSesClient();
    const emailFrom = getEmailFrom();
    const emailInbox = getEmailInbox();

    const params = {
      Source: emailFrom,
      Destination: {
        ToAddresses: [emailInbox],
      },

      ReplyToAddresses:
        typeof email === "string" && email.trim() ? [email.trim()] : [],
      Message: {
        Subject: {
          Data: urgente
            ? "🚨 Consulta URGENTE de soporte"
            : "Nueva consulta de soporte",
        },
        Body: {
          Text: {
            Data: `
Nombre: ${nombre || "No indicado"}
Email: ${email || "No indicado"}
Urgente: ${urgente ? "Sí" : "No"}

Mensaje:
${mensaje}
            `,
          },
        },
      },
    };

    await ses.send(new SendEmailCommand(params));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando soporte:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof EmailConfigError
            ? "Support email service is not configured correctly"
            : "Unable to send support request",
      },
      { status: 500 },
    );
  }
}
