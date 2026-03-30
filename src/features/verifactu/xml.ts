import { formatVerifactuAmount } from "./hash";
import type {
  PrepareVerifactuRecordInput,
  VerifactuChainReference,
  VerifactuQrPayload,
  VerifactuSystemInfo,
} from "./types";

type BuildVerifactuXmlDraftInput = {
  input: PrepareVerifactuRecordInput;
  generatedAt: string;
  fingerprint: string;
  chain: VerifactuChainReference;
  qr: VerifactuQrPayload;
  system: VerifactuSystemInfo;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function buildVerifactuXmlDraft({
  input,
  generatedAt,
  fingerprint,
  chain,
  qr,
  system,
}: BuildVerifactuXmlDraftInput) {
  const lineItems = input.lines
    .map(
      (line, index) => `    <Line index="${index + 1}">
      <Description>${escapeXml(line.description)}</Description>
      <Quantity>${formatVerifactuAmount(line.quantity)}</Quantity>
      <UnitPrice>${formatVerifactuAmount(line.unitPrice)}</UnitPrice>
      <LineTotal>${formatVerifactuAmount(line.lineTotal)}</LineTotal>
    </Line>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<VeriFactuDraft version="0.1">
  <Mode>${system.mode}</Mode>
  <GeneratedAt>${generatedAt}</GeneratedAt>
  <Invoice>
    <Kind>alta</Kind>
    <Type>${input.invoiceType}</Type>
    <Number>${escapeXml(input.invoiceNumber)}</Number>
    <IssueDate>${escapeXml(input.issueDate)}</IssueDate>
  </Invoice>
  <Issuer>
    <Name>${escapeXml(input.issuer.name)}</Name>
    <TaxId>${escapeXml(input.issuer.taxId)}</TaxId>
    <Email>${escapeXml(input.issuer.email || "")}</Email>
  </Issuer>
  <Recipient>
    <Name>${escapeXml(input.recipient.name)}</Name>
    <TaxId>${escapeXml(input.recipient.taxId)}</TaxId>
    <Email>${escapeXml(input.recipient.email || "")}</Email>
  </Recipient>
  <Totals>
    <Subtotal>${formatVerifactuAmount(input.subtotalAmount)}</Subtotal>
    <Tax label="${escapeXml(input.taxLabel)}" rate="${formatVerifactuAmount(input.taxRate)}">${formatVerifactuAmount(input.taxAmount)}</Tax>
    <Total>${formatVerifactuAmount(input.totalAmount)}</Total>
  </Totals>
  <Chain>
    <IsFirst>${chain.isFirst ? "true" : "false"}</IsFirst>
    <PreviousRecordId>${escapeXml(chain.previousRecordId || "")}</PreviousRecordId>
    <PreviousFingerprint>${escapeXml(chain.previousFingerprint || "")}</PreviousFingerprint>
  </Chain>
  <System>
    <SoftwareName>${escapeXml(system.softwareName)}</SoftwareName>
    <SoftwareVersion>${escapeXml(system.softwareVersion)}</SoftwareVersion>
    <InstallationId>${escapeXml(system.installationId)}</InstallationId>
  </System>
  <Fingerprint algorithm="SHA-256">${fingerprint}</Fingerprint>
  <Qr>
    <Url>${escapeXml(qr.url || "")}</Url>
    <Preview>${escapeXml(qr.previewText)}</Preview>
  </Qr>
  <Lines>
${lineItems}
  </Lines>
</VeriFactuDraft>`;
}
