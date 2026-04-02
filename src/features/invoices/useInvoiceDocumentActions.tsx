"use client";

import { pdf } from "@react-pdf/renderer";
import { useCallback, useState } from "react";
import { getLanguageLocale } from "@/features/i18n/core";
import type { AppLanguage } from "@/features/i18n/config";
import {
  activeDocumentRepository,
  activeHistoryRepository,
} from "@/features/repositories";
import { prepareVerifactuInvoiceRecord } from "@/features/verifactu/service";
import type { VerifactuSourceAction } from "@/features/verifactu/types";
import { showSuccessToast, showWarningToast } from "@/features/notifications/toast";
import {
  draftId,
  pdfTemplates,
  s,
  toEditableDocumentRecord,
  waitForNextFrame,
  type Cliente,
  type Concepto,
  type DraftInvoice,
  type Empresa,
  type Plantilla,
} from "./editor-helpers";
import type { DeliveryDetails } from "./delivery-details";
import type { InvoiceDocumentType } from "./document-types";

type UseInvoiceDocumentActionsOptions = {
  activeConceptos: Concepto[];
  buildDraft: () => DraftInvoice;
  cliente: Cliente;
  currentTaxLabel: string;
  deliveryDetails: DeliveryDetails;
  documentLabel: string;
  documentArticle: string;
  documentMetaLabel: string;
  documentType: InvoiceDocumentType;
  editableDocumentIdRef: React.MutableRefObject<string | null>;
  empresa: Empresa;
  fecha: string;
  fechaVencimiento: string;
  isSpanish: boolean;
  iva: number;
  language: AppLanguage;
  logo: string;
  notas: string;
  numeroFacturaActual: string;
  pdfData: Record<string, unknown>;
  plantilla: Plantilla;
  saveLastNumber: (value: string, nextDocumentType?: InvoiceDocumentType) => void;
  supportsSecondaryDate: boolean;
  supportsVerifactu: boolean;
  tipoIVA: number;
  total: number;
};

export function useInvoiceDocumentActions(
  options: UseInvoiceDocumentActionsOptions,
) {
  const {
    activeConceptos,
    buildDraft,
    cliente,
    currentTaxLabel,
    deliveryDetails,
    documentArticle,
    documentLabel,
    documentMetaLabel,
    documentType,
    editableDocumentIdRef,
    empresa,
    fecha,
    fechaVencimiento,
    isSpanish,
    iva,
    language,
    logo,
    notas,
    numeroFacturaActual,
    pdfData,
    plantilla,
    saveLastNumber,
    supportsSecondaryDate,
    supportsVerifactu,
    tipoIVA,
    total,
  } = options;

  const [isDocumentActionPending, setIsDocumentActionPending] = useState(false);

  const createPdfBlob = useCallback(async () => {
    await waitForNextFrame();

    const Component = pdfTemplates[plantilla];
    return pdf(
      <Component
        datos={pdfData as never}
        numeroFactura={numeroFacturaActual}
        conceptos={activeConceptos}
      />,
    ).toBlob();
  }, [activeConceptos, numeroFacturaActual, pdfData, plantilla]);

  const validate = useCallback(
    (requireEmail?: boolean) => {
      const recommendations: string[] = [];

      if (!empresa.nombre.trim() || !empresa.nif.trim()) {
        recommendations.push(
          isSpanish
            ? "revisa los datos basicos de tu empresa"
            : "review your company basic details",
        );
      }

      if (!cliente.nombre.trim()) {
        recommendations.push(
          isSpanish
            ? "anade al menos el nombre del cliente"
            : "add at least the client name",
        );
      }

      if (!activeConceptos.some((item) => item.desc.trim() && item.cant > 0)) {
        recommendations.push(
          isSpanish
            ? "incluye algun concepto para que el documento quede mas claro"
            : "include at least one line item so the document is clearer",
        );
      }

      if (recommendations.length > 0) {
        showWarningToast(
          isSpanish
            ? `Antes de continuar, te recomendamos ${recommendations.join(", ")}.`
            : `Before continuing, we recommend ${recommendations.join(", ")}.`,
        );
      }

      if (requireEmail && !cliente.email.trim()) {
        showWarningToast(
          isSpanish
            ? "Anade el email del cliente para poder enviar el documento."
            : "Add the client email to send the document.",
        );
        return false;
      }

      return true;
    },
    [activeConceptos, cliente, empresa, isSpanish],
  );

  const updateHistory = useCallback(
    async (estado: string, sourceAction: VerifactuSourceAction) => {
      const currentDraft = buildDraft();

      let verifactuSummary:
        | {
            recordId: string;
            status: string;
            fingerprint: string;
            generatedAt: string;
            qrPreview: string;
          }
        | {
            status: "error";
            lastError: string;
          }
        | undefined;

      if (supportsVerifactu) {
        try {
          const verifactuRecord = await prepareVerifactuInvoiceRecord({
            sourceDocumentId: numeroFacturaActual,
            sourceAction,
            invoiceType: "F1",
            invoiceNumber: numeroFacturaActual,
            issueDate: fecha,
            issuer: {
              name: empresa.nombre,
              taxId: empresa.nif,
              email: empresa.email,
              address: empresa.direccion,
              postalCode: empresa.cp,
              city: empresa.ciudad,
            },
            recipient: {
              name: cliente.nombre,
              taxId: cliente.nif,
              email: cliente.email,
              address: cliente.direccion,
              postalCode: cliente.codigoPostal,
              city: cliente.ciudad,
            },
            lines: activeConceptos.map((item) => ({
              description: item.desc,
              quantity: item.cant,
              unitPrice: item.precio,
              lineTotal: item.cant * item.precio,
            })),
            subtotalAmount: total - iva,
            taxLabel: currentTaxLabel,
            taxRate: tipoIVA,
            taxAmount: iva,
            totalAmount: total,
          });

          verifactuSummary = {
            recordId: verifactuRecord.id,
            status: verifactuRecord.status,
            fingerprint: verifactuRecord.fingerprint,
            generatedAt: verifactuRecord.generatedAt,
            qrPreview: verifactuRecord.qr.previewText,
          };
        } catch (error) {
          console.error("Error preparing local VeriFactu record", error);
          verifactuSummary = {
            status: "error",
            lastError: isSpanish
              ? "No se pudo actualizar el seguimiento de esta factura."
              : "Unable to update the tracking for this invoice.",
          };
        }
      }

      const editableDocumentId =
        editableDocumentIdRef.current || currentDraft.id || draftId();
      const existingEditableDocument = activeDocumentRepository.readById(
        editableDocumentId,
      );
      editableDocumentIdRef.current = editableDocumentId;

      activeDocumentRepository.upsert(
        toEditableDocumentRecord(currentDraft, {
          documentId: editableDocumentId,
          total,
          estado,
          sourceAction,
          createdAt: existingEditableDocument?.createdAt,
        }),
      );

      const item = {
        id: numeroFacturaActual,
        editableDocumentId,
        numero: numeroFacturaActual,
        tipo: documentType,
        cliente,
        empresa,
        deliveryDetails,
        fecha: new Date(fecha).toLocaleDateString(getLanguageLocale(language)),
        fechaVencimiento:
          supportsSecondaryDate && fechaVencimiento
            ? new Date(fechaVencimiento).toLocaleDateString(
                getLanguageLocale(language),
              )
            : "",
        conceptos: activeConceptos,
        logo,
        notas,
        tipoIVA,
        ivaPorc: tipoIVA,
        plantilla,
        total,
        estado,
        verifactu: verifactuSummary,
      };

      const history = activeHistoryRepository.readDocuments<Record<string, unknown>>();
      const index = history.findIndex(
        (doc) => s(doc.numero || doc.id) === numeroFacturaActual,
      );

      if (index >= 0) {
        history[index] = { ...history[index], ...item };
      } else {
        history.unshift(item);
      }

      activeHistoryRepository.saveDocuments(history);
      saveLastNumber(numeroFacturaActual, documentType);
    },
    [
      activeConceptos,
      buildDraft,
      cliente,
      currentTaxLabel,
      deliveryDetails,
      documentType,
      editableDocumentIdRef,
      empresa,
      fecha,
      fechaVencimiento,
      isSpanish,
      iva,
      language,
      logo,
      notas,
      numeroFacturaActual,
      plantilla,
      saveLastNumber,
      supportsSecondaryDate,
      supportsVerifactu,
      tipoIVA,
      total,
    ],
  );

  const descargar = useCallback(async () => {
    if (isDocumentActionPending || !validate()) {
      return;
    }

    setIsDocumentActionPending(true);

    try {
      const blob = await createPdfBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${documentMetaLabel}_${numeroFacturaActual}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      await updateHistory(
        `${documentLabel} descargad${documentArticle === "la" ? "a" : "o"}`,
        "downloaded",
      );
      showSuccessToast(isSpanish ? "PDF descargado" : "PDF downloaded");
    } catch {
      showWarningToast(
        isSpanish ? "No se pudo generar el PDF" : "Unable to generate the PDF",
      );
    } finally {
      setIsDocumentActionPending(false);
    }
  }, [
    createPdfBlob,
    documentArticle,
    documentLabel,
    documentMetaLabel,
    isDocumentActionPending,
    isSpanish,
    numeroFacturaActual,
    updateHistory,
    validate,
  ]);

  const enviar = useCallback(async () => {
    if (isDocumentActionPending || !validate(true)) {
      return;
    }

    setIsDocumentActionPending(true);

    try {
      const blob = await createPdfBlob();
      const formData = new FormData();
      formData.append("file", blob, `${documentMetaLabel}_${numeroFacturaActual}.pdf`);
      formData.append("to", cliente.email);
      formData.append("subject", `${documentMetaLabel} ${numeroFacturaActual}`);
      formData.append(
        "text",
        isSpanish
          ? `Hola,\n\nAdjunto ${documentArticle} ${documentMetaLabel.toLowerCase()} ${numeroFacturaActual}.\n\nGracias.\n${empresa.nombre || "Tu empresa"}`
          : `Hello,\n\nAttached is the ${documentMetaLabel.toLowerCase()} ${numeroFacturaActual}.\n\nThank you.\n${empresa.nombre || "Your company"}`,
      );

      const res = await fetch("/api/enviar-email", { method: "POST", body: formData });
      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok) {
        throw new Error(payload?.error || "send failed");
      }

      if (window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-1791812185/PvpICL_mx_obENHy-BC",
          value: total,
          currency: "EUR",
        });
      }

      await updateHistory(
        `${documentLabel} enviad${documentArticle === "la" ? "a" : "o"}`,
        "emailed",
      );
      showSuccessToast(isSpanish ? "Documento enviado" : "Document sent");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isSpanish
            ? "No se pudo enviar el documento"
            : "Unable to send the document";

      if (message === "Email service is not configured correctly") {
        showWarningToast(
          isSpanish
            ? "El envio por correo no esta disponible en este momento"
            : "Email sending is not available at the moment",
        );
        return;
      }

      if (message === "Invalid email payload") {
        showWarningToast(
          isSpanish
            ? "Revisa el email del cliente antes de enviar"
            : "Check the client email before sending",
        );
        return;
      }

      if (message.toLowerCase().includes("not verified")) {
        showWarningToast(
          isSpanish
            ? "No se pudo completar el envio. Revisa los datos del correo y vuelve a intentarlo."
            : "The send could not be completed. Check the email details and try again.",
        );
        return;
      }

      showWarningToast(
        isSpanish
          ? "No se pudo enviar el documento. Intentalo de nuevo."
          : "Unable to send the document. Try again.",
      );
    } finally {
      setIsDocumentActionPending(false);
    }
  }, [
    cliente.email,
    createPdfBlob,
    documentArticle,
    documentLabel,
    documentMetaLabel,
    empresa.nombre,
    isDocumentActionPending,
    isSpanish,
    numeroFacturaActual,
    total,
    updateHistory,
    validate,
  ]);

  return {
    descargar,
    enviar,
    isDocumentActionPending,
  };
}
