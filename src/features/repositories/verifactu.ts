import {
  appendVerifactuEvent,
  createVerifactuLocalId,
  ensureVerifactuInstallationId,
  findLatestChainedRecord,
  readVerifactuEvents,
  readVerifactuRecords,
  readVerifactuSettings,
  upsertVerifactuRecord,
  writeVerifactuSettings,
} from "@/features/verifactu/storage";
import type {
  VerifactuEvent,
  VerifactuRecord,
  VerifactuSettings,
} from "@/features/verifactu/types";

export type VerifactuRepository = {
  readSettings(): VerifactuSettings;
  saveSettings(settings: VerifactuSettings): void;
  readRecords(): VerifactuRecord[];
  upsertRecord(record: VerifactuRecord): VerifactuRecord;
  readEvents(): VerifactuEvent[];
  appendEvent(event: VerifactuEvent): VerifactuEvent[];
  createLocalId(prefix: string): string;
  ensureInstallationId(): string;
  findLatestChainedRecord(
    issuerTaxId: string,
    excludeRecordId?: string | null,
  ): VerifactuRecord | null;
};

export const localVerifactuRepository: VerifactuRepository = {
  readSettings: readVerifactuSettings,
  saveSettings: writeVerifactuSettings,
  readRecords: readVerifactuRecords,
  upsertRecord: upsertVerifactuRecord,
  readEvents: readVerifactuEvents,
  appendEvent: appendVerifactuEvent,
  createLocalId: createVerifactuLocalId,
  ensureInstallationId: ensureVerifactuInstallationId,
  findLatestChainedRecord,
};
