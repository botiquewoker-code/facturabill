"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  activeDocumentRepository,
  activeDraftRepository,
} from "@/features/repositories";
import {
  draftId,
  hasContent,
  toEditableDocumentRecord,
  type Cliente,
  type Concepto,
  type DraftInvoice,
  type Empresa,
  type Plantilla,
} from "./editor-helpers";
import type { DeliveryDetails } from "./delivery-details";
import type { InvoiceDocumentType } from "./document-types";
import { showSuccessToast, showWarningToast } from "@/features/notifications/toast";

type UseInvoicePersistenceOptions = {
  documentType: InvoiceDocumentType;
  numeroFacturaActual: string;
  fecha: string;
  fechaVencimiento: string;
  supportsSecondaryDate: boolean;
  linkedClientId: string;
  cliente: Cliente;
  empresa: Empresa;
  activeConceptos: Concepto[];
  deliveryDetails: DeliveryDetails;
  logo: string;
  notas: string;
  tipoIVA: number;
  plantilla: Plantilla;
  total: number;
  isPageReady: boolean;
  isSpanish: boolean;
  documentLabel: string;
  saveLastNumber: (value: string, nextDocumentType?: InvoiceDocumentType) => void;
};

export function useInvoicePersistence(options: UseInvoicePersistenceOptions) {
  const {
    documentType,
    numeroFacturaActual,
    fecha,
    fechaVencimiento,
    supportsSecondaryDate,
    linkedClientId,
    cliente,
    empresa,
    activeConceptos,
    deliveryDetails,
    logo,
    notas,
    tipoIVA,
    plantilla,
    total,
    isPageReady,
    isSpanish,
    documentLabel,
    saveLastNumber,
  } = options;

  const latestDraftRef = useRef<DraftInvoice | null>(null);
  const draftIdRef = useRef<string | null>(null);
  const editableDocumentIdRef = useRef<string | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildDraft = useCallback(
    (): DraftInvoice => ({
      id: draftIdRef.current || draftId(),
      tipo: documentType,
      numero: numeroFacturaActual,
      fecha,
      fechaVencimiento: supportsSecondaryDate ? fechaVencimiento : "",
      linkedClientId,
      cliente,
      empresa,
      conceptos: activeConceptos,
      deliveryDetails,
      logo,
      notas,
      tipoIVA,
      ivaPorc: tipoIVA,
      plantilla,
      updatedAt: new Date().toISOString(),
    }),
    [
      activeConceptos,
      cliente,
      deliveryDetails,
      documentType,
      empresa,
      fecha,
      fechaVencimiento,
      linkedClientId,
      logo,
      notas,
      numeroFacturaActual,
      plantilla,
      supportsSecondaryDate,
      tipoIVA,
    ],
  );

  const persistDraftSilently = useCallback(
    (draft: DraftInvoice) => {
      if (typeof window === "undefined") {
        return false;
      }

      const saved = activeDraftRepository.readAll<DraftInvoice>();

      if (!hasContent(draft)) {
        const nextSaved = saved.filter((item) => item.id !== draft.id);

        if (nextSaved.length !== saved.length) {
          activeDraftRepository.saveAll(nextSaved);
        }

        return false;
      }

      activeDraftRepository.saveAll(activeDraftRepository.upsert(draft, saved));
      saveLastNumber(draft.numero, draft.tipo);
      return true;
    },
    [saveLastNumber],
  );

  const saveDraftNow = useCallback(() => {
    const draft = latestDraftRef.current;

    if (!draft) {
      return;
    }

    if (!hasContent(draft)) {
      saveLastNumber(draft.numero, draft.tipo);
      showSuccessToast(
        isSpanish
          ? `Numero de ${documentLabel.toLowerCase()} guardado`
          : `${documentLabel} number saved`,
      );
      return;
    }

    try {
      persistDraftSilently(draft);
      saveLastNumber(draft.numero, draft.tipo);
      showSuccessToast(isSpanish ? "Borrador guardado" : "Draft saved");
    } catch {
      showWarningToast(
        isSpanish ? "No se pudo guardar el borrador" : "Unable to save the draft",
      );
    }
  }, [documentLabel, isSpanish, persistDraftSilently, saveLastNumber]);

  useEffect(() => {
    const nextDraft = buildDraft();

    draftIdRef.current = nextDraft.id;
    latestDraftRef.current = nextDraft;

    if (!isPageReady || typeof window === "undefined") {
      return;
    }

    if (autosaveTimerRef.current !== null) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      try {
        persistDraftSilently(nextDraft);

        if (editableDocumentIdRef.current) {
          activeDocumentRepository.upsert(
            toEditableDocumentRecord(nextDraft, {
              documentId: editableDocumentIdRef.current,
              total,
              estado: "Guardado",
              sourceAction: "saved",
            }),
          );
        }
      } catch {}
    }, 220);

    return () => {
      if (autosaveTimerRef.current !== null) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
    };
  }, [buildDraft, isPageReady, persistDraftSilently, total]);

  useEffect(() => {
    const persist = () => {
      const draft = latestDraftRef.current;

      if (!draft || typeof window === "undefined") {
        return;
      }

      try {
        persistDraftSilently(draft);

        if (editableDocumentIdRef.current) {
          activeDocumentRepository.upsert(
            toEditableDocumentRecord(draft, {
              documentId: editableDocumentIdRef.current,
              total,
              estado: "Guardado",
              sourceAction: "saved",
            }),
          );
        }
      } catch {}
    };

    window.addEventListener("beforeunload", persist);
    window.addEventListener("pagehide", persist);

    return () => {
      if (autosaveTimerRef.current !== null) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }

      persist();
      window.removeEventListener("beforeunload", persist);
      window.removeEventListener("pagehide", persist);
    };
  }, [persistDraftSilently, total]);

  return {
    autosaveTimerRef,
    buildDraft,
    draftIdRef,
    editableDocumentIdRef,
    latestDraftRef,
    persistDraftSilently,
    saveDraftNow,
  };
}
