import {
  createJsonLocalStore,
  createStringLocalStore,
  type LocalStoreAdapter,
} from "./local";

export const HISTORY_STORAGE_KEY = "historial";
export const CONVERSION_DRAFT_STORAGE_KEY = "presupuestoConvertir";

function createDocumentNumberKey(documentTypeKey: string) {
  return createStringLocalStore(documentTypeKey, "");
}

const documentNumberStores = new Map<string, LocalStoreAdapter<string>>();

function getDocumentNumberStore(key: string) {
  const existingStore = documentNumberStores.get(key);

  if (existingStore) {
    return existingStore;
  }

  const nextStore = createDocumentNumberKey(key);
  documentNumberStores.set(key, nextStore);
  return nextStore;
}

export function createHistoryStore<T>() {
  return createJsonLocalStore<T[]>(HISTORY_STORAGE_KEY, {
    fallback: [],
    migrate(value) {
      return Array.isArray(value) ? (value as T[]) : [];
    },
  });
}

export function readHistory<T>() {
  return createHistoryStore<T>().read();
}

export function writeHistory<T>(items: T[]) {
  createHistoryStore<T>().write(items);
}

export function readConversionDraft<T>() {
  return createJsonLocalStore<T | null>(CONVERSION_DRAFT_STORAGE_KEY, {
    fallback: null,
  }).read();
}

export function writeConversionDraft<T>(value: T) {
  createJsonLocalStore<T | null>(CONVERSION_DRAFT_STORAGE_KEY, {
    fallback: null,
  }).write(value);
}

export function clearConversionDraft() {
  createJsonLocalStore<null>(CONVERSION_DRAFT_STORAGE_KEY, {
    fallback: null,
  }).clear();
}

export function readLastDocumentNumber(key: string) {
  return getDocumentNumberStore(key).read();
}

export function writeLastDocumentNumber(key: string, value: string) {
  getDocumentNumberStore(key).write(value);
}
