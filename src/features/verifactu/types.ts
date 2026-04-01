export type VerifactuRecordKind = "alta" | "anulacion";
export type VerifactuRecordStatus =
  | "prepared"
  | "queued"
  | "sent"
  | "accepted"
  | "rejected"
  | "error";
export type VerifactuSourceAction = "downloaded" | "emailed" | "saved";
export type VerifactuInvoiceType = "F1";

export type VerifactuParty = {
  name: string;
  taxId: string;
  email?: string;
  address?: string;
  postalCode?: string;
  city?: string;
};

export type VerifactuLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type VerifactuChainReference = {
  isFirst: boolean;
  previousRecordId: string | null;
  previousFingerprint: string | null;
};

export type VerifactuQrPayload = {
  issuerTaxId: string;
  invoiceNumber: string;
  issueDate: string;
  totalAmount: string;
  url: string | null;
  previewText: string;
};

export type VerifactuSystemInfo = {
  softwareName: string;
  softwareVersion: string;
  installationId: string;
  mode: "VERI*FACTU";
};

export type VerifactuRecord = {
  id: string;
  kind: VerifactuRecordKind;
  status: VerifactuRecordStatus;
  sourceDocumentId: string;
  sourceAction: VerifactuSourceAction;
  invoiceType: VerifactuInvoiceType;
  invoiceNumber: string;
  issueDate: string;
  generatedAt: string;
  issuer: VerifactuParty;
  recipient: VerifactuParty;
  lines: VerifactuLineItem[];
  subtotalAmount: number;
  taxLabel: string;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  hashAlgorithm: "SHA-256";
  fingerprintSource: string;
  fingerprint: string;
  chain: VerifactuChainReference;
  qr: VerifactuQrPayload;
  xmlDraft: string;
  system: VerifactuSystemInfo;
  createdAt: string;
  updatedAt: string;
  retryCount: number;
  lastError: string | null;
};

export type VerifactuEventType =
  | "record_prepared"
  | "record_status_changed"
  | "queue_exported";

export type VerifactuEvent = {
  id: string;
  type: VerifactuEventType;
  recordId: string | null;
  occurredAt: string;
  detail: string;
};

export type VerifactuSettings = {
  taxAgencyAutoSubmissionEnabled: boolean;
  updatedAt: string;
};

export type PrepareVerifactuRecordInput = {
  sourceDocumentId: string;
  sourceAction: VerifactuSourceAction;
  invoiceType: VerifactuInvoiceType;
  invoiceNumber: string;
  issueDate: string;
  issuer: VerifactuParty;
  recipient: VerifactuParty;
  lines: VerifactuLineItem[];
  subtotalAmount: number;
  taxLabel: string;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
};
