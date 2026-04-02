import { createJsonLocalStore } from "@/features/storage/local";
import type { InvoiceDocumentType } from "@/features/invoices/document-types";
import type { VerifactuSourceAction } from "@/features/verifactu/types";

export const EDITABLE_DOCUMENTS_STORAGE_KEY = "facturabill-editable-documents";

export type EditableClient = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  email: string;
};

export type EditableCompany = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefono: string;
  email: string;
};

export type EditableConcept = {
  desc: string;
  cant: number;
  precio: number;
};

export type EditableDeliveryDetails = {
  location: string;
  deliveredBy: string;
  receivedBy: string;
  receivedById: string;
  deliveryNotes: string;
};

export type EditableTemplate =
  | "InvoicePDF"
  | "PlantillaNueva"
  | "PlantillaStudio";

export type EditableDocumentRecord = {
  id: string;
  tipo: InvoiceDocumentType;
  numero: string;
  fecha: string;
  fechaVencimiento: string;
  linkedClientId: string;
  cliente: EditableClient;
  empresa: EditableCompany;
  conceptos: EditableConcept[];
  deliveryDetails: EditableDeliveryDetails;
  logo: string;
  notas: string;
  tipoIVA: number;
  ivaPorc: number;
  plantilla: EditableTemplate;
  total: number;
  estado: string;
  sourceAction: VerifactuSourceAction | "saved";
  createdAt: string;
  updatedAt: string;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeClient(value: unknown): EditableClient {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    nombre: normalizeString(record.nombre),
    nif: normalizeString(record.nif),
    direccion: normalizeString(record.direccion),
    ciudad: normalizeString(record.ciudad),
    codigoPostal: normalizeString(record.codigoPostal),
    telefono: normalizeString(record.telefono),
    email: normalizeString(record.email),
  };
}

function normalizeCompany(value: unknown): EditableCompany {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    nombre: normalizeString(record.nombre),
    nif: normalizeString(record.nif),
    direccion: normalizeString(record.direccion),
    ciudad: normalizeString(record.ciudad),
    cp: normalizeString(record.cp),
    telefono: normalizeString(record.telefono),
    email: normalizeString(record.email),
  };
}

function normalizeConcepts(value: unknown): EditableConcept[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const record =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    return {
      desc: normalizeString(record.desc),
      cant: normalizeNumber(record.cant, 0),
      precio: normalizeNumber(record.precio, 0),
    };
  });
}

function normalizeDeliveryDetails(value: unknown): EditableDeliveryDetails {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    location: normalizeString(record.location),
    deliveredBy: normalizeString(record.deliveredBy),
    receivedBy: normalizeString(record.receivedBy),
    receivedById: normalizeString(record.receivedById),
    deliveryNotes: normalizeString(record.deliveryNotes),
  };
}

export function normalizeEditableDocumentRecord(
  value: unknown,
): EditableDocumentRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const id = normalizeString(record.id);
  const numero = normalizeString(record.numero);
  const fecha = normalizeString(record.fecha);
  const tipo = record.tipo;

  if (
    !id ||
    !numero ||
    !fecha ||
    (tipo !== "factura" &&
      tipo !== "presupuesto" &&
      tipo !== "proforma" &&
      tipo !== "albaran")
  ) {
    return null;
  }

  const plantilla = normalizeString(record.plantilla);

  return {
    id,
    tipo,
    numero,
    fecha,
    fechaVencimiento: normalizeString(record.fechaVencimiento),
    linkedClientId: normalizeString(record.linkedClientId),
    cliente: normalizeClient(record.cliente),
    empresa: normalizeCompany(record.empresa),
    conceptos: normalizeConcepts(record.conceptos),
    deliveryDetails: normalizeDeliveryDetails(record.deliveryDetails),
    logo: normalizeString(record.logo),
    notas: normalizeString(record.notas),
    tipoIVA: normalizeNumber(record.tipoIVA, 21),
    ivaPorc: normalizeNumber(record.ivaPorc, normalizeNumber(record.tipoIVA, 21)),
    plantilla:
      plantilla === "PlantillaNueva" || plantilla === "PlantillaStudio"
        ? plantilla
        : "InvoicePDF",
    total: normalizeNumber(record.total, 0),
    estado: normalizeString(record.estado) || "Guardado",
    sourceAction:
      record.sourceAction === "downloaded" || record.sourceAction === "emailed"
        ? record.sourceAction
        : "saved",
    createdAt:
      normalizeString(record.createdAt) || new Date().toISOString(),
    updatedAt:
      normalizeString(record.updatedAt) || new Date().toISOString(),
  };
}

function sortDocuments(records: EditableDocumentRecord[]) {
  return [...records].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

const editableDocumentsStore = createJsonLocalStore<EditableDocumentRecord[]>(
  EDITABLE_DOCUMENTS_STORAGE_KEY,
  {
    fallback: [],
    migrate(value) {
      if (!Array.isArray(value)) {
        return [];
      }

      return sortDocuments(
        value
          .map(normalizeEditableDocumentRecord)
          .filter((item): item is EditableDocumentRecord => item !== null),
      );
    },
  },
);

export function readEditableDocuments() {
  return editableDocumentsStore.read();
}

export function writeEditableDocuments(records: EditableDocumentRecord[]) {
  editableDocumentsStore.write(sortDocuments(records));
}

export function upsertEditableDocument(record: EditableDocumentRecord) {
  const records = readEditableDocuments();
  const index = records.findIndex((item) => item.id === record.id);

  if (index >= 0) {
    records[index] = record;
  } else {
    records.unshift(record);
  }

  writeEditableDocuments(records);
  return record;
}

export function findEditableDocumentById(documentId: string) {
  return readEditableDocuments().find((item) => item.id === documentId) || null;
}
