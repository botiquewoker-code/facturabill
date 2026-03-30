type VerifactuFingerprintSourceInput = {
  invoiceNumber: string;
  issueDate: string;
  issuerTaxId: string;
  recipientTaxId: string;
  subtotalAmount: number;
  taxLabel: string;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  previousFingerprint: string | null;
};

const sanitizeValue = (value: string) =>
  value.replace(/\|/g, " ").replace(/\s+/g, " ").trim();

export const formatVerifactuAmount = (value: number) =>
  Number(value || 0).toFixed(2);

export function buildVerifactuFingerprintSource(
  input: VerifactuFingerprintSourceInput,
) {
  // Local draft canonicalization. Replace this string with the official
  // AEAT canonical chain format when the real remittance layer is connected.
  return [
    ["invoiceNumber", input.invoiceNumber],
    ["issueDate", input.issueDate],
    ["issuerTaxId", input.issuerTaxId],
    ["recipientTaxId", input.recipientTaxId],
    ["subtotalAmount", formatVerifactuAmount(input.subtotalAmount)],
    ["taxLabel", input.taxLabel],
    ["taxRate", formatVerifactuAmount(input.taxRate)],
    ["taxAmount", formatVerifactuAmount(input.taxAmount)],
    ["totalAmount", formatVerifactuAmount(input.totalAmount)],
    ["previousFingerprint", input.previousFingerprint || ""],
  ]
    .map(([key, value]) => `${key}=${sanitizeValue(String(value))}`)
    .join("|");
}

export async function sha256Hex(input: string) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("SHA-256 is not available in this browser");
  }

  const bytes = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}
