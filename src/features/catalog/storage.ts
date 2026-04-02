import type { InvoiceDocumentType } from "@/features/invoices/document-types";
import { createJsonLocalStore } from "@/features/storage/local";

export const CATALOG_STORAGE_KEY = "facturabill-catalog-items";

export type CatalogItemType = "producto" | "servicio";
export type CatalogItemStatus = "active" | "archived";
export type CatalogDocumentType = InvoiceDocumentType;

export type CatalogItemDraft = {
  type: CatalogItemType;
  name: string;
  description: string;
  sku: string;
  category: string;
  unit: string;
  basePrice: number;
  taxRate: number;
  internalNotes: string;
  supportedDocuments: CatalogDocumentType[];
};

export type CatalogItem = CatalogItemDraft & {
  id: string;
  status: CatalogItemStatus;
  createdAt: string;
  updatedAt: string;
};

export const DEFAULT_SUPPORTED_DOCUMENTS: CatalogDocumentType[] = [
  "factura",
  "presupuesto",
  "proforma",
  "albaran",
];

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function sanitizeType(value: unknown): CatalogItemType {
  return value === "producto" ? "producto" : "servicio";
}

function sanitizeStatus(value: unknown): CatalogItemStatus {
  return value === "archived" ? "archived" : "active";
}

function sanitizeSupportedDocuments(value: unknown): CatalogDocumentType[] {
  if (!Array.isArray(value)) {
    return [...DEFAULT_SUPPORTED_DOCUMENTS];
  }

  const normalized = value.filter(
    (item): item is CatalogDocumentType =>
      item === "factura" ||
      item === "presupuesto" ||
      item === "proforma" ||
      item === "albaran",
  );

  return normalized.length
    ? Array.from(new Set(normalized))
    : [...DEFAULT_SUPPORTED_DOCUMENTS];
}

function createCatalogId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `catalog-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function sortCatalogItems(items: CatalogItem[]) {
  return [...items].sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === "active" ? -1 : 1;
    }

    return (
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
  });
}

export function createEmptyCatalogItemDraft(): CatalogItemDraft {
  return {
    type: "servicio",
    name: "",
    description: "",
    sku: "",
    category: "",
    unit: "ud",
    basePrice: 0,
    taxRate: 21,
    internalNotes: "",
    supportedDocuments: [...DEFAULT_SUPPORTED_DOCUMENTS],
  };
}

export function createCatalogItem(
  value: Partial<CatalogItemDraft>,
  seed?: Partial<CatalogItem>,
  options?: {
    preserveUpdatedAt?: boolean;
    preserveStatus?: boolean;
  },
): CatalogItem {
  const now = new Date().toISOString();

  return {
    id: sanitizeString(seed?.id) || createCatalogId(),
    type: sanitizeType(value.type),
    name: sanitizeString(value.name),
    description: sanitizeString(value.description),
    sku: sanitizeString(value.sku).toUpperCase(),
    category: sanitizeString(value.category),
    unit: sanitizeString(value.unit) || "ud",
    basePrice: Math.max(0, sanitizeNumber(value.basePrice)),
    taxRate: Math.max(0, sanitizeNumber(value.taxRate, 21)),
    internalNotes: sanitizeString(value.internalNotes),
    supportedDocuments: sanitizeSupportedDocuments(value.supportedDocuments),
    status: options?.preserveStatus
      ? sanitizeStatus(seed?.status)
      : sanitizeStatus(seed?.status || "active"),
    createdAt: sanitizeString(seed?.createdAt) || now,
    updatedAt: options?.preserveUpdatedAt
      ? sanitizeString(seed?.updatedAt) || now
      : now,
  };
}

export function normalizeCatalogItem(value: unknown): CatalogItem {
  if (!value || typeof value !== "object") {
    return createCatalogItem(createEmptyCatalogItemDraft());
  }

  const record = value as Record<string, unknown>;

  return createCatalogItem(
    {
      type: record.type as CatalogItemType,
      name: record.name as string,
      description: record.description as string,
      sku: record.sku as string,
      category: record.category as string,
      unit: record.unit as string,
      basePrice: record.basePrice as number,
      taxRate: record.taxRate as number,
      internalNotes: record.internalNotes as string,
      supportedDocuments: record.supportedDocuments as CatalogDocumentType[],
    },
    {
      id: record.id as string,
      status: record.status as CatalogItemStatus,
      createdAt: record.createdAt as string,
      updatedAt: record.updatedAt as string,
    },
    {
      preserveUpdatedAt: true,
      preserveStatus: true,
    },
  );
}

const catalogItemsStore = createJsonLocalStore<CatalogItem[]>(
  CATALOG_STORAGE_KEY,
  {
    fallback: [],
    migrate(value) {
      return Array.isArray(value)
        ? sortCatalogItems(value.map(normalizeCatalogItem))
        : [];
    },
  },
);

export function readCatalogItems() {
  return catalogItemsStore.read();
}

export function writeCatalogItems(items: CatalogItem[]) {
  catalogItemsStore.write(sortCatalogItems(items));
}
