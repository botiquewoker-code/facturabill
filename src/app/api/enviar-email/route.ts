import { NextResponse } from "next/server";
import { SendRawEmailCommand } from "@aws-sdk/client-ses";
import {
  EmailConfigError,
  getEmailFrom,
  getSesClient,
} from "@/features/server/email";

export const runtime = "nodejs";

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
    const fileBase64 = fileBuffer.toString("base64");

    const boundary = "NextPart_" + Date.now();
    const safeSubject = subject.replace(/[\r\n]+/g, " ").trim();
    const safeFilename = (file.name || "documento.pdf").replace(
      /[\r\n"]/g,
      "",
    );

    const rawEmail = `From: ${emailFrom}
To: ${to.trim()}
Subject: ${safeSubject}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset="UTF-8"

${text}

--${boundary}
Content-Type: application/pdf; name="${safeFilename}"
Content-Disposition: attachment; filename="${safeFilename}"
Content-Transfer-Encoding: base64

${fileBase64}
--${boundary}--`;

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
            : "Unable to send email",
      },
      { status: 500 },
    );
  }
}
