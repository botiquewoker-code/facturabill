import type { AppLanguage } from "@/features/i18n/config";
import { pickLocalizedValue, type LocalizedValue } from "@/features/i18n/core";

export type InvoiceDocumentType =
  | "factura"
  | "presupuesto"
  | "proforma"
  | "albaran";

type InvoiceDocumentMeta = {
  label: string;
  pluralLabel: string;
  uppercaseLabel: string;
  prefix: string;
  article: string;
  lastNumberStorageKey: string;
  primaryDateLabel: string;
  secondaryDateLabel: string;
  currentSecondaryDateLabel: string;
  supportsSecondaryDate: boolean;
  supportsVerifactu: boolean;
  canConvertToInvoice: boolean;
};

type InvoiceDocumentMetaBase = Omit<
  InvoiceDocumentMeta,
  | "label"
  | "pluralLabel"
  | "uppercaseLabel"
  | "article"
  | "primaryDateLabel"
  | "secondaryDateLabel"
  | "currentSecondaryDateLabel"
>;

type InvoiceDocumentLocalizedMeta = {
  label: LocalizedValue<string>;
  pluralLabel: LocalizedValue<string>;
  uppercaseLabel: LocalizedValue<string>;
  article: LocalizedValue<string>;
  primaryDateLabel: LocalizedValue<string>;
  secondaryDateLabel: LocalizedValue<string>;
  currentSecondaryDateLabel: LocalizedValue<string>;
};

const DOCUMENT_TYPE_META: Record<InvoiceDocumentType, InvoiceDocumentMetaBase> = {
  factura: {
    prefix: "FACT",
    lastNumberStorageKey: "ultimoNumeroFactura",
    supportsSecondaryDate: true,
    supportsVerifactu: true,
    canConvertToInvoice: false,
  },
  presupuesto: {
    prefix: "PRES",
    lastNumberStorageKey: "ultimoNumeroPresupuesto",
    supportsSecondaryDate: true,
    supportsVerifactu: false,
    canConvertToInvoice: true,
  },
  proforma: {
    prefix: "PROF",
    lastNumberStorageKey: "ultimoNumeroProforma",
    supportsSecondaryDate: true,
    supportsVerifactu: false,
    canConvertToInvoice: true,
  },
  albaran: {
    prefix: "ALB",
    lastNumberStorageKey: "ultimoNumeroAlbaran",
    supportsSecondaryDate: false,
    supportsVerifactu: false,
    canConvertToInvoice: false,
  },
};

const DOCUMENT_TYPE_COPY: Record<
  InvoiceDocumentType,
  InvoiceDocumentLocalizedMeta
> = {
  factura: {
    label: { es: "Factura", en: "Invoice" },
    pluralLabel: { es: "Facturas", en: "Invoices" },
    uppercaseLabel: { es: "FACTURA", en: "INVOICE" },
    article: { es: "la", en: "the" },
    primaryDateLabel: { es: "Fecha de emision", en: "Issue date" },
    secondaryDateLabel: { es: "Fecha de vencimiento", en: "Due date" },
    currentSecondaryDateLabel: { es: "Vencimiento actual", en: "Current due date" },
  },
  presupuesto: {
    label: { es: "Presupuesto", en: "Quote" },
    pluralLabel: { es: "Presupuestos", en: "Quotes" },
    uppercaseLabel: { es: "PRESUPUESTO", en: "QUOTE" },
    article: { es: "el", en: "the" },
    primaryDateLabel: { es: "Fecha de emision", en: "Issue date" },
    secondaryDateLabel: { es: "Validez hasta", en: "Valid until" },
    currentSecondaryDateLabel: { es: "Validez actual", en: "Current validity" },
  },
  proforma: {
    label: { es: "Proforma", en: "Proforma" },
    pluralLabel: { es: "Proformas", en: "Proformas" },
    uppercaseLabel: { es: "PROFORMA", en: "PROFORMA" },
    article: { es: "la", en: "the" },
    primaryDateLabel: { es: "Fecha de emision", en: "Issue date" },
    secondaryDateLabel: { es: "Validez hasta", en: "Valid until" },
    currentSecondaryDateLabel: { es: "Validez actual", en: "Current validity" },
  },
  albaran: {
    label: { es: "Albaran", en: "Delivery note" },
    pluralLabel: { es: "Albaranes", en: "Delivery notes" },
    uppercaseLabel: { es: "ALBARAN", en: "DELIVERY NOTE" },
    article: { es: "el", en: "the" },
    primaryDateLabel: { es: "Fecha de entrega", en: "Delivery date" },
    secondaryDateLabel: { es: "", en: "" },
    currentSecondaryDateLabel: { es: "", en: "" },
  },
};

export const ALL_INVOICE_DOCUMENT_TYPES = Object.keys(
  DOCUMENT_TYPE_META,
) as InvoiceDocumentType[];

export function normalizeInvoiceDocumentType(
  value: unknown,
): InvoiceDocumentType {
  return value === "presupuesto" ||
    value === "proforma" ||
    value === "albaran"
    ? value
    : "factura";
}

export function getInvoiceDocumentMeta(
  type: InvoiceDocumentType,
  language: AppLanguage = "es",
) {
  const base = DOCUMENT_TYPE_META[type];
  const copy = DOCUMENT_TYPE_COPY[type];

  return {
    ...base,
    label: pickLocalizedValue(language, copy.label),
    pluralLabel: pickLocalizedValue(language, copy.pluralLabel),
    uppercaseLabel: pickLocalizedValue(language, copy.uppercaseLabel),
    article: pickLocalizedValue(language, copy.article),
    primaryDateLabel: pickLocalizedValue(language, copy.primaryDateLabel),
    secondaryDateLabel: pickLocalizedValue(language, copy.secondaryDateLabel),
    currentSecondaryDateLabel: pickLocalizedValue(
      language,
      copy.currentSecondaryDateLabel,
    ),
  };
}

export function stripInvoiceDocumentPrefix(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/^(PRES|PROF|ALB|FACT?)-?/i, "");
}

export function normalizeInvoiceDocumentNumber(value: unknown) {
  return stripInvoiceDocumentPrefix(value) || "001";
}
