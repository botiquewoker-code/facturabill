import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tuemail@gmail.com', // ← TU EMAIL REAL
    pass: 'abcd efgh ijkl mnop', // ← Contraseña de aplicación (16 caracteres, sin espacios)
  },
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob;
  const to = formData.get('to') as string;
  const subject = formData.get('subject') as string;
  const text = formData.get('text') as string;

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = subject.includes('Presupuesto') 
    ? `Presupuesto_${subject.split(' ')[1] || '000'}.pdf`
    : `Factura_${subject.split(' ')[1] || '000'}.pdf`;

  await transporter.sendMail({
    from: '"Tu Empresa" <tuemail@gmail.com>',
    to,
    subject,
    text,
    attachments: [{ filename, content: buffer }],
  });

  return NextResponse.json({ success: true });
}
