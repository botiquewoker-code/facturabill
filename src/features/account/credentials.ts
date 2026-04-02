import { createJsonLocalStore } from "@/features/storage/local";

export const LOCAL_ACCOUNT_CREDENTIALS_STORAGE_KEY =
  "facturabill-local-account-credentials";

export type LocalAccountCredentials = {
  displayName: string;
  email: string;
  passwordHash: string;
  registeredAt: string;
  updatedAt: string;
};

const FALLBACK_HASH_PREFIX = "fallback:";

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeLocalAccountCredentials(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const displayName = normalizeString(record.displayName);
  const email = normalizeString(record.email);
  const passwordHash = normalizeString(record.passwordHash);

  if (!displayName || !email || !passwordHash) {
    return null;
  }

  return {
    displayName,
    email,
    passwordHash,
    registeredAt:
      normalizeString(record.registeredAt) || new Date().toISOString(),
    updatedAt: normalizeString(record.updatedAt) || new Date().toISOString(),
  } satisfies LocalAccountCredentials;
}

const localAccountCredentialsStore =
  createJsonLocalStore<LocalAccountCredentials | null>(
    LOCAL_ACCOUNT_CREDENTIALS_STORAGE_KEY,
    {
      fallback: null,
      migrate(value) {
        return normalizeLocalAccountCredentials(value);
      },
    },
  );

export function readLocalAccountCredentials() {
  return localAccountCredentialsStore.read();
}

export function writeLocalAccountCredentials(
  credentials: LocalAccountCredentials,
) {
  localAccountCredentialsStore.write({
    displayName: credentials.displayName.trim(),
    email: credentials.email.trim().toLowerCase(),
    passwordHash: credentials.passwordHash,
    registeredAt: credentials.registeredAt,
    updatedAt: credentials.updatedAt,
  });
}

function hashLocalAccountPasswordFallback(password: string) {
  let hash = 2166136261;

  for (const char of password) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return `${FALLBACK_HASH_PREFIX}${(hash >>> 0)
    .toString(16)
    .padStart(8, "0")}:${password.length.toString(16)}`;
}

export async function hashLocalAccountPassword(password: string) {
  if (!globalThis.crypto?.subtle) {
    return hashLocalAccountPasswordFallback(password);
  }

  try {
    const bytes = new TextEncoder().encode(password);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(digest))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return hashLocalAccountPasswordFallback(password);
  }
}

export async function verifyLocalAccountPassword(
  password: string,
  credentials: LocalAccountCredentials | null,
) {
  if (!credentials) {
    return false;
  }

  const passwordHash = credentials.passwordHash.startsWith(FALLBACK_HASH_PREFIX)
    ? hashLocalAccountPasswordFallback(password)
    : await hashLocalAccountPassword(password);

  return passwordHash === credentials.passwordHash;
}
