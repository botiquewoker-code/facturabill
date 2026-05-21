import {
  DEFAULT_APP_DOWNLOAD_URL,
  DOWNLOAD_LIMIT_MESSAGE_EN,
  DOWNLOAD_LIMIT_MESSAGE_ES,
} from "./config";

type DownloadLimitResponse = {
  ok?: boolean;
  blocked?: boolean;
  appDownloadUrl?: string;
  message?: string;
};

export type WebDownloadPermission =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      appDownloadUrl: string;
      message: string;
    };

export async function requestWebDownloadPermission(
  isSpanish: boolean,
): Promise<WebDownloadPermission> {
  try {
    const response = await fetch("/api/download-limit", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    const payload = (await response.json().catch(() => null)) as
      | DownloadLimitResponse
      | null;

    if (response.ok && payload?.ok !== false) {
      return { allowed: true };
    }

    if (response.status === 403 || payload?.blocked) {
      return {
        allowed: false,
        appDownloadUrl: payload?.appDownloadUrl || DEFAULT_APP_DOWNLOAD_URL,
        message:
          payload?.message ||
          (isSpanish ? DOWNLOAD_LIMIT_MESSAGE_ES : DOWNLOAD_LIMIT_MESSAGE_EN),
      };
    }
  } catch (error) {
    console.error("Unable to verify web download limit", error);
  }

  return {
    allowed: false,
    appDownloadUrl: DEFAULT_APP_DOWNLOAD_URL,
    message: isSpanish
      ? "No se pudo completar la descarga. Intentalo de nuevo."
      : "The download could not be completed. Try again.",
  };
}
