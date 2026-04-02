"use client";
import { createJsonLocalStore } from "@/features/storage/local";

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

const draftsStore = createJsonLocalStore<unknown[]>(DRAFTS_STORAGE_KEY, {
  fallback: [],
  migrate(value) {
    return Array.isArray(value) ? sanitizeDrafts(value) : [];
  },
});

const activeDraftStore = createJsonLocalStore<unknown | null>(
  ACTIVE_DRAFT_STORAGE_KEY,
  {
    fallback: null,
  },
);

export function writeDrafts<T extends DraftRecord>(drafts: T[]) {
  const sanitized = sanitizeDrafts<T>(drafts);
  draftsStore.write(sanitized);
  window.dispatchEvent(new CustomEvent(DRAFTS_UPDATED_EVENT));
}

export function readDrafts<T extends DraftRecord>(): T[] {
  return sanitizeDrafts<T>(draftsStore.read());
}

export function upsertDraft<T extends DraftRecord>(draft: T, drafts: T[]): T[] {
  const rest = drafts.filter((item) => item.id !== draft.id);
  return sanitizeDrafts<T>([draft, ...rest]);
}

export function writeActiveDraft<T extends DraftRecord>(draft: T) {
  activeDraftStore.write(draft);
}

export function clearActiveDraft() {
  activeDraftStore.clear();
}

export function readActiveDraft<T extends DraftRecord>(): T | null {
  const parsed = activeDraftStore.read();

  if (!parsed || isDraftExpired(parsed)) {
    clearActiveDraft();
    return null;
  }

  return parsed as T;
}
