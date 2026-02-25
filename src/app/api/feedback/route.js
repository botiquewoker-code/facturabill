import nodemailer from "nodemailer";

export async function POST(req) {
  const { email, mensaje } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Nueva sugerencia Facturabill",
    text: `Email del usuario: ${email || "No indicado"}\n\nMensaje:\n${mensaje}`,
  });

  return Response.json({ ok: true });
}
