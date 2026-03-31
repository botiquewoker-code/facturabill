"use client";

export const DRAFTS_STORAGE_KEY = "borradores";
export const ACTIVE_DRAFT_STORAGE_KEY = "borradorActivo";
export const DRAFT_RETENTION_DAYS = 7;
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

  window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
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

    const filtered = parsed.filter((item) => !isDraftExpired(item)) as T[];

    if (filtered.length !== parsed.length) {
      writeDrafts(filtered);
    }

    return filtered;
  } catch {
    return [];
  }
}

export function upsertDraft<T extends DraftRecord>(draft: T, drafts: T[]): T[] {
  const rest = drafts.filter((item) => item.id !== draft.id);
  return [draft, ...rest];
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
