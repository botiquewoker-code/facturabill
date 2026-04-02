"use client";

import InvoicePDF from "@/features/invoices/components/InvoicePDF";
import PlantillaNueva from "@/features/invoices/components/PlantillaNueva";
import PlantillaStudio from "@/features/invoices/components/PlantillaStudio";
import { type ClientRecord } from "@/features/clients/storage";
import {
  hasDeliveryDetailsContent,
  normalizeDeliveryDetails,
  type DeliveryDetails,
} from "@/features/invoices/delivery-details";
import {
  getInvoiceDocumentMeta,
  normalizeInvoiceDocumentNumber,
  normalizeInvoiceDocumentType,
  stripInvoiceDocumentPrefix,
  type InvoiceDocumentType,
} from "@/features/invoices/document-types";
import { type InvoiceTemplate } from "@/features/storage/company";
import type { EditableDocumentRecord } from "@/features/documents/storage";
import { activeDraftRepository, activeHistoryRepository } from "@/features/repositories";

export type Cliente = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  email: string;
};

export type Empresa = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefono: string;
  email: string;
};

export type Concepto = { desc: string; cant: number; precio: number };
export type Plantilla = InvoiceTemplate;

export type DraftInvoice = {
  id: string;
  tipo: InvoiceDocumentType;
  numero: string;
  fecha: string;
  fechaVencimiento?: string;
  linkedClientId?: string;
  cliente: Cliente;
  empresa: Empresa;
  conceptos: Concepto[];
  deliveryDetails: DeliveryDetails;
  logo: string;
  notas: string;
  tipoIVA: number;
  ivaPorc: number;
  plantilla: Plantilla;
  updatedAt: string;
};

export type HistoryDocument = {
  id?: string;
  editableDocumentId?: string;
  numero?: string;
  tipo?: InvoiceDocumentType;
  fecha?: string;
  fechaVencimiento?: string;
  total?: number;
  estado?: string;
  cliente?: {
    nombre?: string;
    nif?: string;
    email?: string;
  };
  conceptos?: Concepto[];
  deliveryDetails?: DeliveryDetails;
};

export const EMPTY_CLIENTE: Cliente = {
  nombre: "",
  nif: "",
  direccion: "",
  ciudad: "",
  codigoPostal: "",
  telefono: "",
  email: "",
};

export const EMPTY_EMPRESA: Empresa = {
  nombre: "",
  nif: "",
  direccion: "",
  ciudad: "",
  cp: "",
  telefono: "",
  email: "",
};

export const EMPTY_CONCEPTO: Concepto = { desc: "", cant: 0, precio: 0 };

export const today = () => new Date().toISOString().split("T")[0];

export const addDays = (baseDate: string, days: number) => {
  const [year, month, day] = baseDate.split("-").map((value) => Number(value));

  if (!year || !month || !day) {
    return today();
  }

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const s = (v: unknown) => (typeof v === "string" ? v : "");

export const num = (v: unknown, fallback: number) => {
  const parsed = Number(v);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const draftId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const isPlantilla = (v: string): v is Plantilla =>
  v === "InvoicePDF" || v === "PlantillaNueva" || v === "PlantillaStudio";

export const pdfTemplates: Record<
  Plantilla,
  typeof InvoicePDF | typeof PlantillaNueva | typeof PlantillaStudio
> = {
  InvoicePDF,
  PlantillaNueva,
  PlantillaStudio,
};

export const readLastSavedNumber = (documentType: InvoiceDocumentType) => {
  if (typeof window === "undefined") {
    return "";
  }

  const storedNumber = stripInvoiceDocumentPrefix(
    activeHistoryRepository.readLastNumber(
      getInvoiceDocumentMeta(documentType).lastNumberStorageKey,
    ),
  );

  if (storedNumber) {
    return storedNumber;
  }

  try {
    const history = activeHistoryRepository.readDocuments<Record<string, unknown>>();
    const latestDocument = history.find((item) =>
      normalizeInvoiceDocumentType(item.tipo) === documentType,
    );

    return stripInvoiceDocumentPrefix(latestDocument?.numero || latestDocument?.id);
  } catch {
    return "";
  }
};

export const money = (v: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(v);

export const clientMatchesSearch = (client: ClientRecord, query: string) =>
  [client.nombre, client.nif, client.email, client.telefono]
    .join(" ")
    .toLowerCase()
    .includes(query);

export const normalizeCliente = (v: unknown): Cliente => {
  const x = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  return {
    nombre: s(x.nombre),
    nif: s(x.nif ?? x.dni),
    direccion: s(x.direccion),
    ciudad: s(x.ciudad),
    codigoPostal: s(x.codigoPostal ?? x.cp),
    telefono: s(x.telefono),
    email: s(x.email),
  };
};

export const normalizeEmpresa = (v: unknown): Empresa => {
  const x = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  return {
    nombre: s(x.nombre),
    nif: s(x.nif),
    direccion: s(x.direccion),
    ciudad: s(x.ciudad),
    cp: s(x.cp ?? x.codigoPostal),
    telefono: s(x.telefono),
    email: s(x.email),
  };
};

export const normalizeConceptos = (v: unknown): Concepto[] =>
  Array.isArray(v) && v.length
    ? v.map((item) => {
        const x =
          item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        const desc = s(x.desc);
        const precio = Math.max(0, num(x.precio, 0));
        const cant = Math.max(0, num(x.cant, 0));
        const isLegacyEmptyConcept = !desc.trim() && precio === 0 && cant <= 1;

        return {
          desc,
          cant: isLegacyEmptyConcept ? 0 : Math.max(1, cant || 1),
          precio,
        };
      })
    : [EMPTY_CONCEPTO];

export const isEmptyConcept = (concept: Concepto) =>
  !concept.desc.trim() && concept.cant === 0 && concept.precio === 0;

export function normalizeEditorDate(value: unknown, fallback: string) {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const localDateMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (localDateMatch) {
    const [, day, month, year] = localDateMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toISOString().slice(0, 10);
}

export function hasContent(d: DraftInvoice) {
  const normalizedNumber = normalizeInvoiceDocumentNumber(d.numero);
  const defaultIssueDate = today();
  const baseIssueDate = d.fecha || defaultIssueDate;
  const defaultSecondaryDate = addDays(baseIssueDate, 30);

  return (
    normalizedNumber !== "001" ||
    (d.fecha ? d.fecha !== defaultIssueDate : false) ||
    (d.fechaVencimiento ? d.fechaVencimiento !== defaultSecondaryDate : false) ||
    Boolean(d.linkedClientId?.trim()) ||
    Object.values(d.cliente).some((v) => v.trim()) ||
    hasDeliveryDetailsContent(d.deliveryDetails) ||
    d.notas.trim().length > 0 ||
    d.conceptos.some((concept) => !isEmptyConcept(concept))
  );
}

export function persistStoredDraft(draft: DraftInvoice) {
  if (typeof window === "undefined") {
    return;
  }

  const saved = activeDraftRepository.readAll<DraftInvoice>();

  activeDraftRepository.saveAll(activeDraftRepository.upsert(draft, saved));
  activeHistoryRepository.saveLastNumber(
    getInvoiceDocumentMeta(draft.tipo).lastNumberStorageKey,
    normalizeInvoiceDocumentNumber(draft.numero),
  );
}

export function toEditableDocumentRecord(
  draft: DraftInvoice,
  options?: {
    documentId?: string;
    total?: number;
    estado?: string;
    sourceAction?: "saved" | "downloaded" | "emailed";
    createdAt?: string;
  },
): EditableDocumentRecord {
  const now = new Date().toISOString();

  return {
    id: options?.documentId || draft.id,
    tipo: draft.tipo,
    numero: normalizeInvoiceDocumentNumber(draft.numero),
    fecha: draft.fecha,
    fechaVencimiento: draft.fechaVencimiento || "",
    linkedClientId: draft.linkedClientId || "",
    cliente: draft.cliente,
    empresa: draft.empresa,
    conceptos: draft.conceptos,
    deliveryDetails: draft.deliveryDetails,
    logo: draft.logo,
    notas: draft.notas,
    tipoIVA: draft.tipoIVA,
    ivaPorc: draft.ivaPorc,
    plantilla: draft.plantilla,
    total: options?.total ?? 0,
    estado: options?.estado || "Guardado",
    sourceAction: options?.sourceAction || "saved",
    createdAt: options?.createdAt || now,
    updatedAt: now,
  };
}

export function hydrateFromEditableDocument(
  document: EditableDocumentRecord,
  apply: {
    setDocumentType: (value: InvoiceDocumentType) => void;
    setFecha: (value: string) => void;
    setFechaVencimiento: (value: string) => void;
    setNumeroFactura: (value: string) => void;
    setLinkedClientId: (value: string) => void;
    setCliente: (value: Cliente) => void;
    setEmpresa: (value: Empresa) => void;
    setConceptos: (value: Concepto[]) => void;
    setDeliveryDetails: (value: DeliveryDetails) => void;
    setLogo: (value: string) => void;
    setNotas: (value: string) => void;
    setTipoIVA: (value: number) => void;
    setPlantilla: (value: Plantilla) => void;
  },
) {
  apply.setDocumentType(document.tipo);
  apply.setFecha(document.fecha || today());
  apply.setFechaVencimiento(
    document.fechaVencimiento || addDays(document.fecha || today(), 30),
  );
  apply.setNumeroFactura(normalizeInvoiceDocumentNumber(document.numero));
  apply.setLinkedClientId(document.linkedClientId || "");
  apply.setCliente(normalizeCliente(document.cliente));
  apply.setEmpresa(normalizeEmpresa(document.empresa));
  apply.setConceptos(normalizeConceptos(document.conceptos));
  apply.setDeliveryDetails(normalizeDeliveryDetails(document.deliveryDetails));
  apply.setLogo(s(document.logo));
  apply.setNotas(s(document.notas));
  apply.setTipoIVA(num(document.tipoIVA, 21));
  if (isPlantilla(document.plantilla)) {
    apply.setPlantilla(document.plantilla);
  }
}

export function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    window.requestAnimationFrame(() => resolve());
  });
}
