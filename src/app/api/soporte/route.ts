import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.SES_REGION,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { nombre, email, mensaje, urgente } = await req.json();

    const params = {
      Source: process.env.EMAIL_FROM,
Destination: {
  ToAddresses: [process.env.EMAIL_TO!],
},

      ReplyToAddresses: email ? [email] : [],
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

    return Response.json({ ok: true });

  } catch (error) {
    console.error("Error enviando soporte:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
