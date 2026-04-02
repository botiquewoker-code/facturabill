"use client";

import { startTransition } from "react";
import {
  activeCatalogRepository,
  activeClientRepository,
  activeCompanyRepository,
  activeDocumentRepository,
  activeDraftRepository,
  activeHistoryRepository,
  activeUserRepository,
} from "@/features/repositories";
import { readFiscalSettings, type FiscalSettings } from "./fiscal-settings";
import { useClientLayoutEffect } from "@/features/ui/useClientLayoutEffect";
import {
  addDays,
  draftId,
  hydrateFromEditableDocument,
  isPlantilla,
  normalizeCliente,
  normalizeConceptos,
  normalizeEditorDate,
  normalizeEmpresa,
  num,
  persistStoredDraft,
  s,
  toEditableDocumentRecord,
  today,
  type Cliente,
  type Concepto,
  type DraftInvoice,
  type Empresa,
  type HistoryDocument,
  type Plantilla,
} from "./editor-helpers";
import {
  EMPTY_DELIVERY_DETAILS,
  normalizeDeliveryDetails,
  type DeliveryDetails,
} from "./delivery-details";
import {
  getInvoiceDocumentMeta,
  normalizeInvoiceDocumentNumber,
  normalizeInvoiceDocumentType,
  type InvoiceDocumentType,
} from "./document-types";
import type { CatalogItem } from "@/features/catalog/storage";
import type { ClientRecord } from "@/features/clients/storage";
import { findClientById } from "@/features/clients/storage";
import {
  DEFAULT_INVOICE_TEMPLATE,
} from "@/features/storage/company";
import { getUserFirstName } from "@/features/account/profile";

type UseInvoiceHydrationOptions = {
  latestDraftRef: React.MutableRefObject<DraftInvoice | null>;
  draftIdRef: React.MutableRefObject<string | null>;
  editableDocumentIdRef: React.MutableRefObject<string | null>;
  setClientesGuardados: (value: ClientRecord[]) => void;
  setCatalogItems: (value: CatalogItem[]) => void;
  setFiscalSettings: (value: FiscalSettings) => void;
  setTipoIVA: (value: number) => void;
  setHasRegisteredUser: (value: boolean) => void;
  setHasLoadedAccount: (value: boolean) => void;
  setIsPageReady: (value: boolean) => void;
  setEmpresa: (value: Empresa) => void;
  setLogo: (value: string) => void;
  setNotas: (value: string) => void;
  setPlantilla: (value: Plantilla) => void;
  setDocumentType: (value: InvoiceDocumentType) => void;
  setFecha: (value: string) => void;
  setFechaVencimiento: (value: string) => void;
  setNumeroFactura: (value: string) => void;
  setLinkedClientId: (value: string) => void;
  setCliente: (value: Cliente) => void;
  setConceptos: (value: Concepto[]) => void;
  setDeliveryDetails: (value: DeliveryDetails) => void;
};

export function useInvoiceHydration(options: UseInvoiceHydrationOptions) {
  const {
    latestDraftRef,
    draftIdRef,
    editableDocumentIdRef,
    setClientesGuardados,
    setCatalogItems,
    setFiscalSettings,
    setTipoIVA,
    setHasRegisteredUser,
    setHasLoadedAccount,
    setIsPageReady,
    setEmpresa,
    setLogo,
    setNotas,
    setPlantilla,
    setDocumentType,
    setFecha,
    setFechaVencimiento,
    setNumeroFactura,
    setLinkedClientId,
    setCliente,
    setConceptos,
    setDeliveryDetails,
  } = options;

  useClientLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hydratePage = () => {
      const finishHydration = () => {
        startTransition(() => {
          setHasLoadedAccount(true);
          setIsPageReady(true);
        });
      };

      const params = new URLSearchParams(window.location.search);
      const initialDocumentType = normalizeInvoiceDocumentType(params.get("tipo"));
      const requestedDocumentId = params.get("documentId") || "";
      const storedClients = activeClientRepository.readAll();
      const routeClientId = params.get("clienteId") || "";
      const storedFiscalSettings = readFiscalSettings();
      const storedProfile = activeUserRepository.readProfile();

      startTransition(() => {
        setClientesGuardados(storedClients);
        setCatalogItems(activeCatalogRepository.readAll());
        setFiscalSettings(storedFiscalSettings);
        setTipoIVA(storedFiscalSettings.defaultTaxRate);
        setHasRegisteredUser(getUserFirstName(storedProfile).length > 0);
      });

      const workspace = activeCompanyRepository.readWorkspace();
      const seededCompany = normalizeEmpresa(workspace.company);
      const rawLogo = workspace.logo;
      const rawNotes = workspace.notes;
      const rawTemplate = workspace.template;

      startTransition(() => {
        setEmpresa(seededCompany);
        setLogo(rawLogo);
        setNotas(rawNotes);
        if (isPlantilla(rawTemplate)) {
          setPlantilla(rawTemplate);
        }
      });

      if (requestedDocumentId) {
        const editableDocument =
          activeDocumentRepository.readById(requestedDocumentId);

        if (editableDocument) {
          editableDocumentIdRef.current = editableDocument.id;
          draftIdRef.current = editableDocument.id;
          latestDraftRef.current = {
            id: editableDocument.id,
            tipo: editableDocument.tipo,
            numero: editableDocument.numero,
            fecha: editableDocument.fecha,
            fechaVencimiento: editableDocument.fechaVencimiento,
            linkedClientId: editableDocument.linkedClientId,
            cliente: normalizeCliente(editableDocument.cliente),
            empresa: normalizeEmpresa(editableDocument.empresa),
            conceptos: normalizeConceptos(editableDocument.conceptos),
            deliveryDetails: normalizeDeliveryDetails(
              editableDocument.deliveryDetails,
            ),
            logo: editableDocument.logo,
            notas: editableDocument.notas,
            tipoIVA: editableDocument.tipoIVA,
            ivaPorc: editableDocument.ivaPorc,
            plantilla: editableDocument.plantilla,
            updatedAt: editableDocument.updatedAt,
          };

          startTransition(() => {
            hydrateFromEditableDocument(editableDocument, {
              setDocumentType,
              setFecha,
              setFechaVencimiento,
              setNumeroFactura,
              setLinkedClientId,
              setCliente,
              setEmpresa,
              setConceptos,
              setDeliveryDetails,
              setLogo,
              setNotas,
              setTipoIVA,
              setPlantilla,
            });
          });
          finishHydration();
          return;
        }

        const historyDocument = activeHistoryRepository
          .readDocuments<HistoryDocument>()
          .find(
            (item) =>
              item.editableDocumentId === requestedDocumentId ||
              item.id === requestedDocumentId ||
              item.numero === requestedDocumentId,
          );

        if (historyDocument) {
          const fallbackDocument = toEditableDocumentRecord(
            {
              id: requestedDocumentId,
              tipo: normalizeInvoiceDocumentType(historyDocument.tipo),
              numero: normalizeInvoiceDocumentNumber(
                historyDocument.numero || historyDocument.id,
              ),
              fecha: normalizeEditorDate(historyDocument.fecha, today()),
              fechaVencimiento: normalizeEditorDate(
                historyDocument.fechaVencimiento,
                "",
              ),
              linkedClientId: "",
              cliente: normalizeCliente(historyDocument.cliente),
              empresa: seededCompany,
              conceptos: normalizeConceptos(historyDocument.conceptos),
              deliveryDetails: normalizeDeliveryDetails(
                historyDocument.deliveryDetails,
              ),
              logo: rawLogo,
              notas: rawNotes,
              tipoIVA: storedFiscalSettings.defaultTaxRate,
              ivaPorc: storedFiscalSettings.defaultTaxRate,
              plantilla:
                rawTemplate && isPlantilla(rawTemplate)
                  ? rawTemplate
                  : DEFAULT_INVOICE_TEMPLATE,
              updatedAt: new Date().toISOString(),
            },
            {
              documentId: requestedDocumentId,
              total: num(historyDocument.total, 0),
              estado: s(historyDocument.estado) || "Guardado",
              sourceAction: "saved",
            },
          );

          activeDocumentRepository.upsert(fallbackDocument);
          editableDocumentIdRef.current = fallbackDocument.id;
          draftIdRef.current = fallbackDocument.id;
          startTransition(() => {
            hydrateFromEditableDocument(fallbackDocument, {
              setDocumentType,
              setFecha,
              setFechaVencimiento,
              setNumeroFactura,
              setLinkedClientId,
              setCliente,
              setEmpresa,
              setConceptos,
              setDeliveryDetails,
              setLogo,
              setNotas,
              setTipoIVA,
              setPlantilla,
            });
          });
          finishHydration();
          return;
        }
      }

      const activeDraft = activeDraftRepository.readActive<Partial<DraftInvoice>>();
      if (activeDraft) {
        try {
          const draft = activeDraft;
          draftIdRef.current = s(draft.id) || draftId();
          startTransition(() => {
            setDocumentType(normalizeInvoiceDocumentType(draft.tipo));
            setFecha(s(draft.fecha) || today());
            setFechaVencimiento(
              s(draft.fechaVencimiento) || addDays(s(draft.fecha) || today(), 30),
            );
            setNumeroFactura(normalizeInvoiceDocumentNumber(draft.numero));
            setLinkedClientId(s(draft.linkedClientId));
            setCliente(normalizeCliente(draft.cliente));
            setEmpresa(normalizeEmpresa(draft.empresa));
            setConceptos(normalizeConceptos(draft.conceptos));
            setDeliveryDetails(normalizeDeliveryDetails(draft.deliveryDetails));
            setLogo(s(draft.logo));
            setNotas(s(draft.notas) || rawNotes || "");
            setTipoIVA(num(draft.tipoIVA, storedFiscalSettings.defaultTaxRate));
            const nextTemplate = s(draft.plantilla);
            if (isPlantilla(nextTemplate)) {
              setPlantilla(nextTemplate);
            }
          });
        } catch {}

        activeDraftRepository.clearActive();
        finishHydration();
        return;
      }

      const convertDraft =
        activeHistoryRepository.readConversionDraft<Record<string, unknown>>();
      if (convertDraft) {
        try {
          const parsed = convertDraft;
          startTransition(() => {
            if (parsed.cliente) {
              setCliente(normalizeCliente(parsed.cliente));
            }
            if (parsed.conceptos || parsed.items) {
              setConceptos(normalizeConceptos(parsed.conceptos || parsed.items));
            }
            if (parsed.fechaVencimiento) {
              setFechaVencimiento(s(parsed.fechaVencimiento));
            }
            if (parsed.tipoIVA) {
              setTipoIVA(num(parsed.tipoIVA, storedFiscalSettings.defaultTaxRate));
            }
            setNumeroFactura(
              normalizeInvoiceDocumentNumber(parsed.numero || parsed.id),
            );
          });
        } catch {}
        activeHistoryRepository.clearConversionDraft();
      }

      if (routeClientId) {
        const { client } = findClientById(storedClients, routeClientId);
        if (client) {
          const seededDraftId = draftIdRef.current || draftId();
          const seededDraft: DraftInvoice = {
            id: seededDraftId,
            tipo: initialDocumentType,
            numero: "001",
            fecha: today(),
            fechaVencimiento:
              getInvoiceDocumentMeta(initialDocumentType).supportsSecondaryDate
                ? addDays(today(), 30)
                : "",
            linkedClientId: client.id,
            cliente: normalizeCliente(client),
            empresa: seededCompany,
            conceptos: [],
            deliveryDetails: EMPTY_DELIVERY_DETAILS,
            logo: rawLogo || "",
            notas: rawNotes || "",
            tipoIVA: storedFiscalSettings.defaultTaxRate,
            ivaPorc: storedFiscalSettings.defaultTaxRate,
            plantilla:
              rawTemplate && isPlantilla(rawTemplate)
                ? rawTemplate
                : "InvoicePDF",
            updatedAt: new Date().toISOString(),
          };

          draftIdRef.current = seededDraftId;
          latestDraftRef.current = seededDraft;
          startTransition(() => {
            setLinkedClientId(client.id);
            setCliente(normalizeCliente(client));
          });
          persistStoredDraft(seededDraft);
        }
      }

      startTransition(() => {
        setDocumentType(initialDocumentType);
      });
      finishHydration();
    };

    hydratePage();
  }, []);
}
