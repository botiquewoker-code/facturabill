export const LOCAL_ACCOUNT_CREDENTIALS_STORAGE_KEY =
  "facturabill-local-account-credentials";

export type LocalAccountCredentials = {
  displayName: string;
  email: string;
  passwordHash: string;
  registeredAt: string;
  updatedAt: string;
};

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

export function readLocalAccountCredentials() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_ACCOUNT_CREDENTIALS_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return normalizeLocalAccountCredentials(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeLocalAccountCredentials(
  credentials: LocalAccountCredentials,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    LOCAL_ACCOUNT_CREDENTIALS_STORAGE_KEY,
    JSON.stringify({
      displayName: credentials.displayName.trim(),
      email: credentials.email.trim().toLowerCase(),
      passwordHash: credentials.passwordHash,
      registeredAt: credentials.registeredAt,
      updatedAt: credentials.updatedAt,
    }),
  );
}

export async function hashLocalAccountPassword(password: string) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure password hashing is not available");
  }

  const bytes = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyLocalAccountPassword(
  password: string,
  credentials: LocalAccountCredentials | null,
) {
  if (!credentials) {
    return false;
  }

  const passwordHash = await hashLocalAccountPassword(password);
  return passwordHash === credentials.passwordHash;
}
