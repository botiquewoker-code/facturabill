"use client";

export const DRAFTS_STORAGE_KEY = "borradores";
export const ACTIVE_DRAFT_STORAGE_KEY = "borradorActivo";
export const DRAFT_RETENTION_DAYS = 15;
export const MAX_DRAFTS = 2;
export const DRAFTS_UPDATED_EVENT = "facturabill:drafts-updated";

const DRAFT_RETENTION_MS = DRAFT_RETENTION_DAYS * 24 * 60 * 60 * 1000;

type DraftRecord = {
  id?: string;
  updatedAt?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseUpdatedAt(value: unknown): number {
  if (typeof value !== "string") {
    return Number.NaN;
  }

  return Date.parse(value);
}

function compareDraftsByUpdatedAt(
  left: DraftRecord,
  right: DraftRecord,
): number {
  const leftUpdatedAt = parseUpdatedAt(left.updatedAt);
  const rightUpdatedAt = parseUpdatedAt(right.updatedAt);

  return rightUpdatedAt - leftUpdatedAt;
}

function sanitizeDrafts<T extends DraftRecord>(drafts: unknown[]): T[] {
  return drafts
    .filter((item) => !isDraftExpired(item))
    .sort((left, right) =>
      compareDraftsByUpdatedAt(left as DraftRecord, right as DraftRecord),
    )
    .slice(0, MAX_DRAFTS) as T[];
}

export function isDraftExpired(value: unknown): boolean {
  if (!isRecord(value)) {
    return true;
  }

  const updatedAt = parseUpdatedAt(value.updatedAt);

  if (!Number.isFinite(updatedAt)) {
    return true;
  }

  return Date.now() - updatedAt >= DRAFT_RETENTION_MS;
}

export function writeDrafts<T extends DraftRecord>(drafts: T[]) {
  if (typeof window === "undefined") {
    return;
  }

  const sanitized = sanitizeDrafts<T>(drafts);

  window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(sanitized));
  window.dispatchEvent(new CustomEvent(DRAFTS_UPDATED_EVENT));
}

export function readDrafts<T extends DraftRecord>(): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DRAFTS_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const filtered = sanitizeDrafts<T>(parsed);

    if (JSON.stringify(filtered) !== JSON.stringify(parsed)) {
      writeDrafts(filtered);
    }

    return filtered;
  } catch {
    return [];
  }
}

export function upsertDraft<T extends DraftRecord>(draft: T, drafts: T[]): T[] {
  const rest = drafts.filter((item) => item.id !== draft.id);
  return sanitizeDrafts<T>([draft, ...rest]);
}

export function writeActiveDraft<T extends DraftRecord>(draft: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ACTIVE_DRAFT_STORAGE_KEY,
    JSON.stringify(draft),
  );
}

export function clearActiveDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACTIVE_DRAFT_STORAGE_KEY);
}

export function readActiveDraft<T extends DraftRecord>(): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ACTIVE_DRAFT_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (isDraftExpired(parsed)) {
      clearActiveDraft();
      return null;
    }

    return parsed as T;
  } catch {
    clearActiveDraft();
    return null;
  }
}
