import {
  buildVerifactuFingerprintSource,
  sha256Hex,
} from "./hash";
import { buildVerifactuQrPayload } from "./qr";
import {
  appendVerifactuEvent,
  createVerifactuLocalId,
  ensureVerifactuInstallationId,
  findLatestChainedRecord,
  readVerifactuRecords,
  readVerifactuSettings,
  upsertVerifactuRecord,
} from "./storage";
import type {
  PrepareVerifactuRecordInput,
  VerifactuLineItem,
  VerifactuParty,
  VerifactuRecord,
} from "./types";
import { buildVerifactuXmlDraft } from "./xml";

const normalizeParty = (party: VerifactuParty): VerifactuParty => ({
  ...party,
  name: party.name.trim(),
  taxId: party.taxId.trim().toUpperCase(),
  email: party.email?.trim(),
  address: party.address?.trim(),
  postalCode: party.postalCode?.trim(),
  city: party.city?.trim(),
});

const normalizeLine = (line: VerifactuLineItem): VerifactuLineItem => ({
  description: line.description.trim() || "Concepto",
  quantity: Math.max(1, Number(line.quantity) || 1),
  unitPrice: Math.max(0, Number(line.unitPrice) || 0),
  lineTotal: Math.max(0, Number(line.lineTotal) || 0),
});

const softwareVersion =
  process.env.NEXT_PUBLIC_APP_VERSION?.trim() ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
  "local-prepared";

export async function prepareVerifactuInvoiceRecord(
  input: PrepareVerifactuRecordInput,
): Promise<VerifactuRecord> {
  const now = new Date().toISOString();
  const installationId = ensureVerifactuInstallationId();
  const verifactuSettings = readVerifactuSettings();
  const issuer = normalizeParty(input.issuer);
  const recipient = normalizeParty(input.recipient);
  const lines = input.lines.map(normalizeLine);
  const existingRecord =
    readVerifactuRecords().find(
      (record) =>
        record.kind === "alta" &&
        record.sourceDocumentId === input.sourceDocumentId,
    ) || null;
  const previousRecord = findLatestChainedRecord(issuer.taxId, existingRecord?.id);
  const fingerprintSource = buildVerifactuFingerprintSource({
    invoiceNumber: input.invoiceNumber,
    issueDate: input.issueDate,
    issuerTaxId: issuer.taxId,
    recipientTaxId: recipient.taxId,
    subtotalAmount: input.subtotalAmount,
    taxLabel: input.taxLabel,
    taxRate: input.taxRate,
    taxAmount: input.taxAmount,
    totalAmount: input.totalAmount,
    previousFingerprint: previousRecord?.fingerprint || null,
  });
  const fingerprint = await sha256Hex(fingerprintSource);
  const chain = {
    isFirst: !previousRecord,
    previousRecordId: previousRecord?.id || null,
    previousFingerprint: previousRecord?.fingerprint || null,
  };
  const qr = buildVerifactuQrPayload({
    issuerTaxId: issuer.taxId,
    invoiceNumber: input.invoiceNumber,
    issueDate: input.issueDate,
    totalAmount: input.totalAmount,
    fingerprint,
  });
  const system = {
    softwareName: "Facturabill",
    softwareVersion,
    installationId,
    mode: "VERI*FACTU" as const,
  };
  const normalizedInput = {
    ...input,
    issuer,
    recipient,
    lines,
  };
  const record: VerifactuRecord = {
    id: existingRecord?.id || createVerifactuLocalId("vf-record"),
    kind: "alta",
    status: verifactuSettings.taxAgencyAutoSubmissionEnabled
      ? "queued"
      : "prepared",
    sourceDocumentId: input.sourceDocumentId,
    sourceAction: input.sourceAction,
    invoiceType: input.invoiceType,
    invoiceNumber: input.invoiceNumber,
    issueDate: input.issueDate,
    generatedAt: now,
    issuer,
    recipient,
    lines,
    subtotalAmount: input.subtotalAmount,
    taxLabel: input.taxLabel,
    taxRate: input.taxRate,
    taxAmount: input.taxAmount,
    totalAmount: input.totalAmount,
    hashAlgorithm: "SHA-256",
    fingerprintSource,
    fingerprint,
    chain,
    qr,
    xmlDraft: buildVerifactuXmlDraft({
      input: normalizedInput,
      generatedAt: now,
      fingerprint,
      chain,
      qr,
      system,
    }),
    system,
    createdAt: existingRecord?.createdAt || now,
    updatedAt: now,
    retryCount: existingRecord?.retryCount || 0,
    lastError: null,
  };

  upsertVerifactuRecord(record);
  appendVerifactuEvent({
    id: createVerifactuLocalId("vf-event"),
    type: "record_prepared",
    recordId: record.id,
    occurredAt: now,
    detail: `Factura ${record.invoiceNumber} lista para su seguimiento.`,
  });

  if (verifactuSettings.taxAgencyAutoSubmissionEnabled) {
    appendVerifactuEvent({
      id: createVerifactuLocalId("vf-event"),
      type: "queue_exported",
      recordId: record.id,
      occurredAt: now,
      detail: `Factura ${record.invoiceNumber} programada para su envio a Hacienda.`,
    });
  }

  return record;
}
