import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  DEFAULT_APP_DOWNLOAD_URL,
  DOWNLOAD_LIMIT_MESSAGE_ES,
  WEB_DOWNLOAD_LIMIT,
  WEB_DOWNLOAD_LIMIT_COOKIE,
} from "@/features/downloads/config";

export const runtime = "nodejs";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function parseDownloadCount(value: string | undefined) {
  const parsed = Number.parseInt(value || "0", 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function getAppDownloadUrl() {
  return (
    process.env.APP_DOWNLOAD_URL ||
    process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL ||
    DEFAULT_APP_DOWNLOAD_URL
  );
}

export async function POST() {
  const cookieStore = await cookies();
  const currentCount = parseDownloadCount(
    cookieStore.get(WEB_DOWNLOAD_LIMIT_COOKIE)?.value,
  );

  if (currentCount >= WEB_DOWNLOAD_LIMIT) {
    return NextResponse.json(
      {
        ok: false,
        blocked: true,
        limit: WEB_DOWNLOAD_LIMIT,
        remaining: 0,
        message: DOWNLOAD_LIMIT_MESSAGE_ES,
        appDownloadUrl: getAppDownloadUrl(),
      },
      { status: 403 },
    );
  }

  const nextCount = currentCount + 1;
  const response = NextResponse.json({
    ok: true,
    blocked: false,
    limit: WEB_DOWNLOAD_LIMIT,
    remaining: Math.max(WEB_DOWNLOAD_LIMIT - nextCount, 0),
  });

  response.cookies.set(WEB_DOWNLOAD_LIMIT_COOKIE, String(nextCount), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
