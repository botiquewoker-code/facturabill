import { NextResponse } from "next/server";
import { SendRawEmailCommand } from "@aws-sdk/client-ses";
import {
  EmailConfigError,
  getEmailFrom,
  getSesClient,
} from "@/features/server/email";

export const runtime = "nodejs";

function sanitizeHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function wrapBase64(value: string) {
  return value.match(/.{1,76}/g)?.join("\r\n") ?? "";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const to = formData.get("to") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const file = formData.get("file");

    if (
      typeof to !== "string" ||
      !to.trim() ||
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof text !== "string" ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid email payload" },
        { status: 400 },
      );
    }

    const ses = getSesClient();
    const emailFrom = getEmailFrom();

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileBase64 = wrapBase64(fileBuffer.toString("base64"));

    const boundary = "NextPart_" + Date.now();
    const safeFrom = sanitizeHeader(emailFrom);
    const safeTo = sanitizeHeader(to);
    const safeSubject = sanitizeHeader(subject);
    const safeFilename = (file.name || "documento.pdf").replace(
      /[\r\n"]/g,
      "",
    );
    const rawEmail = [
      `From: ${safeFrom}`,
      `To: ${safeTo}`,
      `Subject: ${safeSubject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: 7bit",
      "",
      text,
      "",
      `--${boundary}`,
      `Content-Type: application/pdf; name="${safeFilename}"`,
      `Content-Disposition: attachment; filename="${safeFilename}"`,
      "Content-Transfer-Encoding: base64",
      "",
      fileBase64,
      "",
      `--${boundary}--`,
      "",
    ].join("\r\n");

    await ses.send(
      new SendRawEmailCommand({
        RawMessage: {
          Data: Buffer.from(rawEmail),
        },
      }),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof EmailConfigError
            ? "Email service is not configured correctly"
            : error instanceof Error && error.message
              ? error.message
              : "Unable to send email",
      },
      { status: 500 },
    );
  }
}
