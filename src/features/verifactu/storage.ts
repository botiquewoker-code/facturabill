import type {
  VerifactuEvent,
  VerifactuRecord,
  VerifactuSettings,
} from "./types";

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

function readArrayFromStorage<T>(key: string): T[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
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

export function createVerifactuLocalId(prefix: string) {
  return createLocalId(prefix);
}

export function readVerifactuSettings(): VerifactuSettings {
  if (!isBrowser()) {
    return {
      taxAgencyAutoSubmissionEnabled: false,
      updatedAt: "",
    };
  }

  try {
    const raw = window.localStorage.getItem(VERIFACTU_SETTINGS_STORAGE_KEY);

    if (!raw) {
      return {
        taxAgencyAutoSubmissionEnabled: false,
        updatedAt: "",
      };
    }

    return normalizeVerifactuSettings(JSON.parse(raw));
  } catch {
    return {
      taxAgencyAutoSubmissionEnabled: false,
      updatedAt: "",
    };
  }
}

export function writeVerifactuSettings(
  settings: VerifactuSettings,
) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    VERIFACTU_SETTINGS_STORAGE_KEY,
    JSON.stringify(normalizeVerifactuSettings(settings)),
  );
}

export function readVerifactuRecords() {
  return sortRecords(readArrayFromStorage<VerifactuRecord>(VERIFACTU_RECORDS_STORAGE_KEY));
}

export function writeVerifactuRecords(records: VerifactuRecord[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    VERIFACTU_RECORDS_STORAGE_KEY,
    JSON.stringify(sortRecords(records)),
  );
}

export function readVerifactuEvents() {
  return sortEvents(readArrayFromStorage<VerifactuEvent>(VERIFACTU_EVENTS_STORAGE_KEY));
}

export function writeVerifactuEvents(events: VerifactuEvent[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    VERIFACTU_EVENTS_STORAGE_KEY,
    JSON.stringify(sortEvents(events)),
  );
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

  const currentId = window.localStorage.getItem(
    VERIFACTU_INSTALLATION_ID_STORAGE_KEY,
  );

  if (currentId) {
    return currentId;
  }

  const nextId = createLocalId("vf-installation");
  window.localStorage.setItem(VERIFACTU_INSTALLATION_ID_STORAGE_KEY, nextId);
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
