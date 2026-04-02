import { createJsonLocalStore } from "@/features/storage/local";

export const USER_PROFILE_STORAGE_KEY = "facturabill-user-profile";

export type UserProfile = {
  displayName: string;
  email: string;
  companyName: string;
  registeredAt: string;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeUserProfile(value: unknown): UserProfile | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const displayName = normalizeString(record.displayName);

  if (!displayName) {
    return null;
  }

  return {
    displayName,
    email: normalizeString(record.email),
    companyName: normalizeString(record.companyName),
    registeredAt: normalizeString(record.registeredAt) || new Date().toISOString(),
  };
}

const userProfileStore = createJsonLocalStore<UserProfile | null>(
  USER_PROFILE_STORAGE_KEY,
  {
    fallback: null,
    migrate(value) {
      return normalizeUserProfile(value);
    },
  },
);

export function readUserProfile() {
  return userProfileStore.read();
}

export function writeUserProfile(profile: UserProfile) {
  userProfileStore.write({
    displayName: profile.displayName.trim(),
    email: profile.email.trim(),
    companyName: profile.companyName.trim(),
    registeredAt: profile.registeredAt,
  });
}

export function getUserFirstName(profile: UserProfile | null) {
  const displayName = profile?.displayName.trim() || "";

  if (!displayName) {
    return "";
  }

  return displayName.split(/\s+/)[0] || displayName;
}
