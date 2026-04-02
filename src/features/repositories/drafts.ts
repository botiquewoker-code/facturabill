import {
  clearActiveDraft,
  readActiveDraft,
  readDrafts,
  upsertDraft,
  writeActiveDraft,
  writeDrafts,
} from "@/features/drafts/storage";

type DraftRecord = {
  id?: string;
  updatedAt?: string;
};

export type DraftRepository = {
  readAll<T extends DraftRecord>(): T[];
  saveAll<T extends DraftRecord>(drafts: T[]): void;
  upsert<T extends DraftRecord>(draft: T, drafts: T[]): T[];
  readActive<T extends DraftRecord>(): T | null;
  saveActive<T extends DraftRecord>(draft: T): void;
  clearActive(): void;
};

export const localDraftRepository: DraftRepository = {
  readAll: readDrafts,
  saveAll: writeDrafts,
  upsert: upsertDraft,
  readActive: readActiveDraft,
  saveActive: writeActiveDraft,
  clearActive: clearActiveDraft,
};
