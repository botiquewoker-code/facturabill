import type { VerifactuQrPayload } from "./types";
import { formatVerifactuAmount } from "./hash";

type BuildVerifactuQrPayloadInput = {
  issuerTaxId: string;
  invoiceNumber: string;
  issueDate: string;
  totalAmount: number;
  fingerprint: string;
};

export function buildVerifactuQrPayload({
  issuerTaxId,
  invoiceNumber,
  issueDate,
  totalAmount,
  fingerprint,
}: BuildVerifactuQrPayloadInput): VerifactuQrPayload {
  const totalAmountText = formatVerifactuAmount(totalAmount);
  const qrBaseUrl = process.env.NEXT_PUBLIC_VERIFACTU_QR_BASE_URL?.trim() || "";
  const params = new URLSearchParams({
    nif: issuerTaxId,
    invoice: invoiceNumber,
    date: issueDate,
    total: totalAmountText,
    fingerprint,
  });

  return {
    issuerTaxId,
    invoiceNumber,
    issueDate,
    totalAmount: totalAmountText,
    url: qrBaseUrl ? `${qrBaseUrl}?${params.toString()}` : null,
    previewText: `NIF ${issuerTaxId} | Factura ${invoiceNumber} | Fecha ${issueDate} | Total ${totalAmountText} | Huella ${fingerprint.slice(0, 12)}`,
  };
}
