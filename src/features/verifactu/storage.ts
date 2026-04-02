import type {
  VerifactuEvent,
  VerifactuRecord,
  VerifactuSettings,
} from "./types";
import { createJsonLocalStore, createStringLocalStore } from "@/features/storage/local";

export const VERIFACTU_RECORDS_STORAGE_KEY = "facturabill-verifactu-records";
export const VERIFACTU_EVENTS_STORAGE_KEY = "facturabill-verifactu-events";
export const VERIFACTU_INSTALLATION_ID_STORAGE_KEY =
  "facturabill-verifactu-installation-id";
export const VERIFACTU_SETTINGS_STORAGE_KEY = "facturabill-verifactu-settings";

const isBrowser = () => typeof window !== "undefined";

function createLocalId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function sortRecords(records: VerifactuRecord[]) {
  return [...records].sort(
    (left, right) =>
      new Date(right.generatedAt).getTime() - new Date(left.generatedAt).getTime(),
  );
}

function sortEvents(events: VerifactuEvent[]) {
  return [...events].sort(
    (left, right) =>
      new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
  );
}

function normalizeVerifactuSettings(
  value: unknown,
): VerifactuSettings {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    taxAgencyAutoSubmissionEnabled:
      record.taxAgencyAutoSubmissionEnabled === true,
    updatedAt:
      typeof record.updatedAt === "string" && record.updatedAt.trim()
        ? record.updatedAt
        : "",
  };
}

const verifactuSettingsStore = createJsonLocalStore<VerifactuSettings>(
  VERIFACTU_SETTINGS_STORAGE_KEY,
  {
    fallback: {
      taxAgencyAutoSubmissionEnabled: false,
      updatedAt: "",
    },
    migrate(value) {
      return normalizeVerifactuSettings(value);
    },
  },
);

const verifactuRecordsStore = createJsonLocalStore<VerifactuRecord[]>(
  VERIFACTU_RECORDS_STORAGE_KEY,
  {
    fallback: [],
    migrate(value) {
      return Array.isArray(value) ? sortRecords(value as VerifactuRecord[]) : [];
    },
  },
);

const verifactuEventsStore = createJsonLocalStore<VerifactuEvent[]>(
  VERIFACTU_EVENTS_STORAGE_KEY,
  {
    fallback: [],
    migrate(value) {
      return Array.isArray(value) ? sortEvents(value as VerifactuEvent[]) : [];
    },
  },
);

const verifactuInstallationIdStore = createStringLocalStore(
  VERIFACTU_INSTALLATION_ID_STORAGE_KEY,
  "",
);

export function createVerifactuLocalId(prefix: string) {
  return createLocalId(prefix);
}

export function readVerifactuSettings(): VerifactuSettings {
  return verifactuSettingsStore.read();
}

export function writeVerifactuSettings(
  settings: VerifactuSettings,
) {
  verifactuSettingsStore.write(normalizeVerifactuSettings(settings));
}

export function readVerifactuRecords() {
  return verifactuRecordsStore.read();
}

export function writeVerifactuRecords(records: VerifactuRecord[]) {
  verifactuRecordsStore.write(sortRecords(records));
}

export function readVerifactuEvents() {
  return verifactuEventsStore.read();
}

export function writeVerifactuEvents(events: VerifactuEvent[]) {
  verifactuEventsStore.write(sortEvents(events));
}

export function appendVerifactuEvent(event: VerifactuEvent) {
  const events = readVerifactuEvents();
  events.unshift(event);
  writeVerifactuEvents(events);
  return sortEvents(events);
}

export function ensureVerifactuInstallationId() {
  if (!isBrowser()) {
    return "server-build";
  }

  const currentId = verifactuInstallationIdStore.read();

  if (currentId) {
    return currentId;
  }

  const nextId = createLocalId("vf-installation");
  verifactuInstallationIdStore.write(nextId);
  return nextId;
}

export function findLatestChainedRecord(
  issuerTaxId: string,
  excludeRecordId?: string | null,
) {
  const normalizedIssuerTaxId = issuerTaxId.trim().toUpperCase();

  return (
    readVerifactuRecords().find(
      (record) =>
        record.kind === "alta" &&
        record.issuer.taxId.trim().toUpperCase() === normalizedIssuerTaxId &&
        record.id !== excludeRecordId,
    ) || null
  );
}

export function upsertVerifactuRecord(record: VerifactuRecord) {
  const records = readVerifactuRecords();
  const existingIndex = records.findIndex((item) => item.id === record.id);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.unshift(record);
  }

  writeVerifactuRecords(records);
  return record;
}
