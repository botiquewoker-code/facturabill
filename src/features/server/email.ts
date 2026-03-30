import { SESClient } from "@aws-sdk/client-ses";

export class EmailConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigError";
  }
}

function readEnv(names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
  }

  return undefined;
}

function requireEnv(...names: string[]): string {
  const value = readEnv(names);

  if (!value) {
    throw new EmailConfigError(
      `Missing required email configuration: ${names.join(" or ")}`,
    );
  }

  return value;
}

export function getSesClient() {
  const region = requireEnv("SES_REGION");
  const accessKeyId = readEnv(["SES_ACCESS_KEY_ID", "SES_ACCESS_KEY"]);
  const secretAccessKey = readEnv([
    "SES_SECRET_ACCESS_KEY",
    "SES_SECRET_KEY",
  ]);

  return new SESClient({
    region,
    ...(accessKeyId && secretAccessKey
      ? {
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        }
      : {}),
  });
}

export function getEmailFrom() {
  return requireEnv("EMAIL_FROM");
}

export function getEmailInbox() {
  return readEnv(["EMAIL_TO"]) || getEmailFrom();
}
