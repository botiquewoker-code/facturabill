"use client";

import Link from "next/link";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Palette,
  Plus,
  Search,
  Send,
  Trash2,
  UsersRound,
  Wallet,
} from "lucide-react";
import InvoiceEditorHeader from "@/features/invoices/components/InvoiceEditorHeader";
import InvoiceEditorSummary from "@/features/invoices/components/InvoiceEditorSummary";
import {
  CLIENTS_STORAGE_KEY,
  type ClientRecord,
} from "@/features/clients/storage";
import {
  CATALOG_STORAGE_KEY,
  type CatalogItem,
} from "@/features/catalog/storage";
import {
  DEFAULT_FISCAL_SETTINGS,
  type FiscalSettings,
} from "@/features/invoices/fiscal-settings";
import {
  EMPTY_DELIVERY_DETAILS,
  type DeliveryDetails,
} from "@/features/invoices/delivery-details";
import {
  getInvoiceDocumentMeta,
  normalizeInvoiceDocumentNumber,
  stripInvoiceDocumentPrefix,
  type InvoiceDocumentType,
} from "@/features/invoices/document-types";
import {
  showSuccessToast,
} from "@/features/notifications/toast";
import {
  getUserFirstName,
  USER_PROFILE_STORAGE_KEY,
} from "@/features/account/profile";
import { getLanguageLocale } from "@/features/i18n/core";
import { useAppI18n } from "@/features/i18n/runtime";
import {
  DEFAULT_INVOICE_TEMPLATE,
} from "@/features/storage/company";
import {
  activeCatalogRepository,
  activeHistoryRepository,
  activeUserRepository,
} from "@/features/repositories";
import { getStorageEventName } from "@/features/storage/local";
import {
  addDays,
  clientMatchesSearch,
  draftId,
  EMPTY_CLIENTE,
  EMPTY_CONCEPTO,
  EMPTY_EMPRESA,
  isEmptyConcept,
  money,
  normalizeCliente,
  num,
  persistStoredDraft,
  readLastSavedNumber,
  today,
  type Cliente,
  type Concepto,
  type DraftInvoice,
  type Empresa,
  type Plantilla,
} from "@/features/invoices/editor-helpers";
import { useInvoicePersistence } from "@/features/invoices/useInvoicePersistence";
import { useInvoiceDocumentActions } from "@/features/invoices/useInvoiceDocumentActions";
import { useInvoiceHydration } from "@/features/invoices/useInvoiceHydration";
import AppScreenLoader from "@/features/ui/AppScreenLoader";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params: Record<string, string | number>,
    ) => void;
  }
}
const inputClass =
  "h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]";

export default function CrearFacturaPage() {
  const { language } = useAppI18n();
  const isSpanish = language === "es";

  const [cliente, setCliente] = useState<Cliente>(EMPTY_CLIENTE);
  const [clientesGuardados, setClientesGuardados] = useState<ClientRecord[]>([]);
  const [empresa, setEmpresa] = useState<Empresa>(EMPTY_EMPRESA);
  const [conceptos, setConceptos] = useState<Concepto[]>([EMPTY_CONCEPTO]);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>(
    EMPTY_DELIVERY_DETAILS,
  );
  const [documentType, setDocumentType] =
    useState<InvoiceDocumentType>("factura");
  const [fecha, setFecha] = useState(today());
  const [fechaVencimiento, setFechaVencimiento] = useState(addDays(today(), 30));
  const [numeroFactura, setNumeroFactura] = useState("001");
  const [ultimoNumeroGuardado, setUltimoNumeroGuardado] = useState("");
  const [logo, setLogo] = useState("");
  const [notas, setNotas] = useState("");
  const [tipoIVA, setTipoIVA] = useState(21);
  const [fiscalSettings, setFiscalSettings] = useState<FiscalSettings>(
    DEFAULT_FISCAL_SETTINGS,
  );
  const [hasRegisteredUser, setHasRegisteredUser] = useState(false);
  const [hasLoadedAccount, setHasLoadedAccount] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const [plantilla, setPlantilla] = useState<Plantilla>(DEFAULT_INVOICE_TEMPLATE);
  const [linkedClientId, setLinkedClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const deferredClientSearch = useDeferredValue(clientSearch);
  const deferredCatalogSearch = useDeferredValue(catalogSearch);
  const documentMeta = getInvoiceDocumentMeta(documentType, language);
  const isBudgetDocument = documentType === "presupuesto";
  const isProformaDocument = documentType === "proforma";
  const isDeliveryNoteDocument = documentType === "albaran";
  const activeConceptos = useMemo(
    () => conceptos.filter((concept) => !isEmptyConcept(concept)),
    [conceptos],
  );
  const subtotal = activeConceptos.reduce(
    (acc, item) => acc + item.cant * item.precio,
    0,
  );
  const iva = subtotal * (tipoIVA / 100);
  const total = subtotal + iva;
  const clientesFiltrados = useMemo(() => {
    const query = deferredClientSearch.trim().toLowerCase();
    const base = query
      ? clientesGuardados.filter((item) => clientMatchesSearch(item, query))
      : [];

    return base.filter((item) => item.id !== linkedClientId).slice(0, 6);
  }, [deferredClientSearch, clientesGuardados, linkedClientId]);
  const catalogoFiltrado = useMemo(() => {
    if (!(hasLoadedAccount && hasRegisteredUser)) {
      return [] as CatalogItem[];
    }

    const query = deferredCatalogSearch.trim().toLowerCase();

    if (!query) {
      return [] as CatalogItem[];
    }

    return catalogItems
      .filter((item) => item.status === "active")
      .filter((item) => item.supportedDocuments.includes(documentType))
      .filter((item) =>
        [item.name, item.description, item.sku, item.category]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 6);
  }, [
    catalogItems,
    deferredCatalogSearch,
    documentType,
    hasLoadedAccount,
    hasRegisteredUser,
  ]);
  const pdfData = useMemo(
    () => ({
      documentType,
      esPresupuesto: isBudgetDocument,
      numero: normalizeInvoiceDocumentNumber(numeroFactura),
      fecha,
      fechaVencimiento: documentMeta.supportsSecondaryDate ? fechaVencimiento : "",
      empresa,
      cliente: { ...cliente, cp: cliente.codigoPostal },
      conceptos: activeConceptos,
      deliveryDetails,
      logo,
      plantilla,
      subtotal,
      iva,
      ivaPct: tipoIVA,
      tipiIVA: tipoIVA,
      tipoIVA,
      taxLabel: fiscalSettings.taxLabel,
      taxNote: fiscalSettings.fiscalNote,
      total,
      notas,
    }),
    [
      activeConceptos,
      cliente,
      deliveryDetails,
      documentMeta.supportsSecondaryDate,
      documentType,
      empresa,
      fecha,
      fechaVencimiento,
      fiscalSettings.fiscalNote,
      fiscalSettings.taxLabel,
      iva,
      isBudgetDocument,
      logo,
      notas,
      numeroFactura,
      plantilla,
      subtotal,
      tipoIVA,
      total,
    ],
  );
  const documentPrefix = documentMeta.prefix;
  const formattedDueDate = useMemo(
    () =>
      fechaVencimiento
        ? new Date(fechaVencimiento).toLocaleDateString(
            getLanguageLocale(language),
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            },
          )
        : "",
    [fechaVencimiento, language],
  );
  const modeCopy = useMemo(
    () =>
      language === "es"
        ? documentType === "presupuesto"
      ? {
          workspace: "Propuestas",
          title: "Crear presupuesto",
          subtitle: "Prepara un presupuesto claro y profesional.",
          selectedClientLabel: "Cliente para el presupuesto",
          conceptsTitle: "Lineas del presupuesto",
          conceptLineLabel: "Linea de propuesta",
          conceptPlaceholder:
            "Describe el alcance, el entregable o el servicio propuesto",
          conceptAdd: "Anadir linea",
          conceptTotal: "Importe estimado",
          summaryEyebrow: "Propuesta",
          summaryTitle: "Valor estimado y acciones",
          totalLabel: "Total estimado",
          downloadLabel: "Descargar presupuesto",
          sendLabel: "Enviar presupuesto",
          sendHint: (email: string) => `Se enviara el presupuesto a ${email}`,
          emptyEmailHint: "Anade un email para poder enviarlo al cliente.",
          documentNumberLabel: "Numero de presupuesto",
          dateSectionTitle: "Fecha y validez",
          dateSectionDescription:
            "Define hasta cuando mantienes vigente esta propuesta.",
        }
      : documentType === "proforma"
        ? {
            workspace: "Preventa",
            title: "Crear factura proforma",
            subtitle:
              "Prepara una proforma clara antes de emitir la factura definitiva.",
            selectedClientLabel: "Cliente para la proforma",
            conceptsTitle: "Lineas de la proforma",
            conceptLineLabel: "Linea de proforma",
            conceptPlaceholder: "Descripcion provisional del servicio o producto",
            conceptAdd: "Anadir linea",
            conceptTotal: "Importe provisional",
            summaryEyebrow: "Proforma",
            summaryTitle: "Importes y acciones",
            totalLabel: "Total provisional",
            downloadLabel: "Descargar proforma",
            sendLabel: "Enviar proforma",
            sendHint: (email: string) => `Se enviara la proforma a ${email}`,
            emptyEmailHint: "Anade un email para poder enviar la proforma.",
            documentNumberLabel: "Numero de proforma",
            dateSectionTitle: "Fecha y validez",
            dateSectionDescription:
              "Marca la vigencia de esta proforma antes de facturar.",
          }
        : documentType === "albaran"
          ? {
              workspace: "Entregas",
              title: "Crear albaran",
              subtitle:
                "Registra la entrega y deja constancia del material o servicio entregado.",
              selectedClientLabel: "Cliente del albaran",
              conceptsTitle: "Lineas del albaran",
              conceptLineLabel: "Linea de entrega",
              conceptPlaceholder:
                "Detalle del material, servicio o unidad entregada",
              conceptAdd: "Anadir linea",
              conceptTotal: "Importe informativo",
              summaryEyebrow: "Entrega",
              summaryTitle: "Resumen y acciones",
              totalLabel: "Total de referencia",
              downloadLabel: "Descargar albaran",
              sendLabel: "Enviar albaran",
              sendHint: (email: string) => `Se enviara el albaran a ${email}`,
              emptyEmailHint: "Anade un email para poder enviar el albaran.",
              documentNumberLabel: "Numero de albaran",
              dateSectionTitle: "Fecha de entrega",
              dateSectionDescription:
                "Deja registrada la fecha principal del albaran.",
            }
          : {
              workspace: "Facturacion",
              title: "Crear factura",
              subtitle: "Prepara la factura y revisa los importes.",
              selectedClientLabel: "Cliente seleccionado",
              conceptsTitle: "Lineas de factura",
              conceptLineLabel: "Linea de factura",
              conceptPlaceholder: "Descripcion del servicio o producto",
              conceptAdd: "Anadir concepto",
              conceptTotal: "Total linea",
              summaryEyebrow: "Resumen",
              summaryTitle: "Totales y acciones",
              totalLabel: "Total final",
              downloadLabel: "Descargar PDF",
              sendLabel: "Enviar al cliente",
              sendHint: (email: string) => `Se enviara a ${email}`,
              emptyEmailHint: "Anade un email para poder enviarlo al cliente.",
              documentNumberLabel: "Numero de factura",
              dateSectionTitle: "Fecha y vencimiento",
              dateSectionDescription: "Se mostrara tambien en el PDF.",
            }
      : documentType === "presupuesto"
        ? {
            workspace: "Proposals",
            title: "Create quote",
            subtitle: "Prepare a clear and professional quote.",
            selectedClientLabel: "Client for the quote",
            conceptsTitle: "Quote lines",
            conceptLineLabel: "Proposal line",
            conceptPlaceholder:
              "Describe the scope, deliverable, or proposed service",
            conceptAdd: "Add line",
            conceptTotal: "Estimated amount",
            summaryEyebrow: "Proposal",
            summaryTitle: "Estimated value and actions",
            totalLabel: "Estimated total",
            downloadLabel: "Download quote",
            sendLabel: "Send quote",
            sendHint: (email: string) => `The quote will be sent to ${email}`,
            emptyEmailHint: "Add an email to send the quote to the client.",
            documentNumberLabel: "Quote number",
            dateSectionTitle: "Date and validity",
            dateSectionDescription:
              "Define how long this proposal remains valid.",
          }
        : documentType === "proforma"
          ? {
              workspace: "Pre-sales",
              title: "Create proforma invoice",
              subtitle:
                "Prepare a clear proforma before issuing the final invoice.",
              selectedClientLabel: "Client for the proforma",
              conceptsTitle: "Proforma lines",
              conceptLineLabel: "Proforma line",
              conceptPlaceholder: "Temporary description of the service or product",
              conceptAdd: "Add line",
              conceptTotal: "Temporary amount",
              summaryEyebrow: "Proforma",
              summaryTitle: "Amounts and actions",
              totalLabel: "Temporary total",
              downloadLabel: "Download proforma",
              sendLabel: "Send proforma",
              sendHint: (email: string) => `The proforma will be sent to ${email}`,
              emptyEmailHint: "Add an email to send the proforma.",
              documentNumberLabel: "Proforma number",
              dateSectionTitle: "Date and validity",
              dateSectionDescription:
                "Set the validity of this proforma before invoicing.",
            }
          : documentType === "albaran"
            ? {
                workspace: "Deliveries",
                title: "Create delivery note",
                subtitle:
                  "Register the delivery and keep evidence of the delivered material or service.",
                selectedClientLabel: "Client for the delivery note",
                conceptsTitle: "Delivery note lines",
                conceptLineLabel: "Delivery line",
                conceptPlaceholder:
                  "Detail of the material, service, or delivered unit",
                conceptAdd: "Add line",
                conceptTotal: "Informational amount",
                summaryEyebrow: "Delivery",
                summaryTitle: "Summary and actions",
                totalLabel: "Reference total",
                downloadLabel: "Download delivery note",
                sendLabel: "Send delivery note",
                sendHint: (email: string) =>
                  `The delivery note will be sent to ${email}`,
                emptyEmailHint: "Add an email to send the delivery note.",
                documentNumberLabel: "Delivery note number",
                dateSectionTitle: "Delivery date",
                dateSectionDescription:
                  "Record the main date of this delivery note.",
              }
            : {
                workspace: "Billing",
                title: "Create invoice",
                subtitle: "Prepare the invoice and review the amounts.",
                selectedClientLabel: "Selected client",
                conceptsTitle: "Invoice lines",
                conceptLineLabel: "Invoice line",
                conceptPlaceholder: "Description of the service or product",
                conceptAdd: "Add item",
                conceptTotal: "Line total",
                summaryEyebrow: "Summary",
                summaryTitle: "Totals and actions",
                totalLabel: "Final total",
                downloadLabel: "Download PDF",
                sendLabel: "Send to client",
                sendHint: (email: string) => `It will be sent to ${email}`,
                emptyEmailHint: "Add an email to send it to the client.",
                documentNumberLabel: "Invoice number",
                dateSectionTitle: "Date and due date",
                dateSectionDescription: "It will also be shown on the PDF.",
              },
    [documentType, language],
  );
  const guestModeCopy = useMemo(
    () =>
      language === "es"
        ? {
          eyebrow: "Acceso",
          title:
            documentType === "presupuesto"
              ? "Presupuesto basico"
              : documentType === "proforma"
                ? "Proforma basica"
                : documentType === "albaran"
                  ? "Albaran basico"
                  : "Factura basica",
          description:
            documentType === "presupuesto"
              ? "Muestra solo lo esencial para preparar el presupuesto y descargarlo."
              : documentType === "proforma"
                ? "Muestra solo lo esencial para preparar la proforma y descargarla."
                : documentType === "albaran"
                  ? "Muestra solo lo esencial para preparar el albaran y descargarlo."
                  : "Muestra solo lo esencial para preparar la factura y descargarla.",
          accessDescription:
            "Crea una cuenta o inicia sesion para usar clientes guardados, borradores y envio por correo.",
          registerAction: "Crear cuenta",
          loginAction: "Iniciar sesion",
          clientDescription:
            "Completa los datos del cliente directamente en este formulario.",
          companyHint:
            "Completa los datos de empresa antes de descargar el documento.",
          companyAction: "Datos de empresa",
        }
      : {
          eyebrow: "Access",
          title:
            documentType === "presupuesto"
              ? "Basic quote"
              : documentType === "proforma"
                ? "Basic proforma"
                : documentType === "albaran"
                  ? "Basic delivery note"
                  : "Basic invoice",
          description:
            documentType === "presupuesto"
              ? "Shows only the essentials to prepare the quote and download it."
              : documentType === "proforma"
                ? "Shows only the essentials to prepare the proforma and download it."
                : documentType === "albaran"
                  ? "Shows only the essentials to prepare the delivery note and download it."
                  : "Shows only the essentials to prepare the invoice and download it.",
          accessDescription:
            "Create an account or sign in to use saved clients, drafts, and email sending.",
          registerAction: "Create account",
          loginAction: "Sign in",
          clientDescription:
            "Complete the client details directly in this form.",
          companyHint:
            "Complete the company details before downloading the document.",
          companyAction: "Company details",
        },
    [documentType, language],
  );
  const currentTaxLabel = fiscalSettings.taxLabel.trim() || "IVA";
  const uiCopy = useMemo(
    () =>
      language === "es"
        ? {
          document: "Documento",
          lastSaved: "Ultimo guardado",
          noneSaved: "Todavia no hay ninguno",
          noDate: "Sin fecha",
          client: "Cliente",
          clientData: "Datos del cliente",
          searchClient:
            "Buscar cliente por nombre, NIF, email o telefono",
          noSavedClients: "No hay clientes guardados todavia",
          clients: "Clientes",
          unnamedClient: "Cliente sin nombre",
          lowerDataLoaded: "Datos cargados en el formulario inferior.",
          detach: "Desvincular",
          noContactData: "Sin datos de contacto",
          use: "Usar",
          noMatchesSearch: "No hay coincidencias para esa busqueda.",
          namePlaceholder: "Nombre o razon social",
          taxIdPlaceholder: "NIF / DNI",
          addressPlaceholder: "Direccion",
          cityPlaceholder: "Ciudad",
          postalCodePlaceholder: "Codigo postal",
          phonePlaceholder: "Telefono",
          emailPlaceholder: "Email",
          concepts: "Conceptos",
          catalog: "Catalogo",
          catalogDescription:
            "Busca productos o servicios y anadelos directamente al documento.",
          manage: "Gestionar",
          add: "Anadir",
          noCatalogMatches: "No hay referencias para esa busqueda.",
          conceptPrefix: "Concepto",
          unitPricePlaceholder: "Precio unitario",
          delivery: "Entrega",
          deliveryTitle: "Ficha de entrega y conformidad",
          deliveryDescription:
            "Completa los datos de recepcion para que el albaran deje constancia clara de quien entrega y quien firma la conformidad.",
          deliveryPlace: "Lugar de entrega",
          deliveryPlacePlaceholder:
            "Direccion, obra, almacen o punto de entrega",
          deliveredBy: "Entregado por",
          deliveredByPlaceholder: "Persona o equipo de entrega",
          receivedBy: "Recibido por",
          receivedByPlaceholder: "Nombre del receptor",
          receivedById: "DNI/NIF del receptor",
          receivedByIdPlaceholder:
            "Documento identificativo de quien recibe",
          deliveryNotes: "Observaciones de entrega",
          deliveryNotesPlaceholder:
            "Horario, referencia de obra, incidencias o condiciones de recepcion",
          taxableBase: "Base imponible",
          fiscal: "Fiscal",
          fiscalApplied: `${currentTaxLabel} por defecto aplicado al documento`,
          fiscalEmpty:
            "Sin nota fiscal adicional. Puedes cambiarlo desde Configuracion fiscal.",
        }
      : {
          document: "Document",
          lastSaved: "Last saved",
          noneSaved: "None saved yet",
          noDate: "No date",
          client: "Client",
          clientData: "Client details",
          searchClient:
            "Search client by name, tax ID, email, or phone",
          noSavedClients: "There are no saved clients yet",
          clients: "Clients",
          unnamedClient: "Unnamed client",
          lowerDataLoaded: "Data loaded into the form below.",
          detach: "Detach",
          noContactData: "No contact data",
          use: "Use",
          noMatchesSearch: "No matches for that search.",
          namePlaceholder: "Name or company name",
          taxIdPlaceholder: "Tax ID",
          addressPlaceholder: "Address",
          cityPlaceholder: "City",
          postalCodePlaceholder: "Postal code",
          phonePlaceholder: "Phone",
          emailPlaceholder: "Email",
          concepts: "Items",
          catalog: "Catalog",
          catalogDescription:
            "Search products or services and add them directly to the document.",
          manage: "Manage",
          add: "Add",
          noCatalogMatches: "No references for that search.",
          conceptPrefix: "Item",
          unitPricePlaceholder: "Unit price",
          delivery: "Delivery",
          deliveryTitle: "Delivery and acknowledgement sheet",
          deliveryDescription:
            "Complete the receipt details so the delivery note clearly records who delivers and who signs acceptance.",
          deliveryPlace: "Delivery location",
          deliveryPlacePlaceholder:
            "Address, site, warehouse, or delivery point",
          deliveredBy: "Delivered by",
          deliveredByPlaceholder: "Person or delivery team",
          receivedBy: "Received by",
          receivedByPlaceholder: "Receiver name",
          receivedById: "Receiver ID/Tax ID",
          receivedByIdPlaceholder:
            "Identification document of the receiver",
          deliveryNotes: "Delivery notes",
          deliveryNotesPlaceholder:
            "Schedule, site reference, incidents, or receipt conditions",
          taxableBase: "Taxable base",
          fiscal: "Fiscal",
          fiscalApplied: `${currentTaxLabel} default applied to the document`,
          fiscalEmpty:
            "No additional tax note. You can change it from Tax settings.",
        },
    [currentTaxLabel, language],
  );
  const showAdvancedTools = useMemo(
    () => hasLoadedAccount && hasRegisteredUser,
    [hasLoadedAccount, hasRegisteredUser],
  );
  const primaryActionClass = isBudgetDocument
    ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8a5a33] px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(138,90,51,0.9)] transition hover:bg-[#754a28]"
    : isProformaDocument
      ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1d4d7f] px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(29,77,127,0.9)] transition hover:bg-[#163c62]"
      : isDeliveryNoteDocument
        ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f766e] px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,118,110,0.9)] transition hover:bg-[#115e59]"
        : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800";
  const totalCardClass = isBudgetDocument
    ? "mt-3 rounded-[24px] bg-[linear-gradient(135deg,#8a5a33,#b97a45)] px-4 py-4 text-white shadow-[0_22px_38px_-26px_rgba(138,90,51,0.82)]"
    : isProformaDocument
      ? "mt-3 rounded-[24px] bg-[linear-gradient(135deg,#1d4d7f,#3e7db2)] px-4 py-4 text-white shadow-[0_22px_38px_-26px_rgba(29,77,127,0.82)]"
      : isDeliveryNoteDocument
        ? "mt-3 rounded-[24px] bg-[linear-gradient(135deg,#0f766e,#14b8a6)] px-4 py-4 text-white shadow-[0_22px_38px_-26px_rgba(15,118,110,0.82)]"
        : "mt-3 rounded-[24px] bg-slate-950 px-4 py-4 text-white shadow-[0_22px_38px_-26px_rgba(15,23,42,0.92)]";
  const selectedClientCardClass = isBudgetDocument
    ? "mt-4 rounded-[26px] border border-[#edcfab] bg-[#fff5e9] p-4 shadow-[0_16px_30px_-24px_rgba(185,122,69,0.35)]"
    : isProformaDocument
      ? "mt-4 rounded-[26px] border border-sky-200 bg-sky-50/85 p-4 shadow-[0_16px_30px_-24px_rgba(14,116,144,0.35)]"
      : isDeliveryNoteDocument
        ? "mt-4 rounded-[26px] border border-teal-200 bg-teal-50/85 p-4 shadow-[0_16px_30px_-24px_rgba(13,148,136,0.35)]"
        : "mt-4 rounded-[26px] border border-emerald-200 bg-emerald-50/85 p-4 shadow-[0_16px_30px_-24px_rgba(16,185,129,0.45)]";
  const selectedClientEyebrowClass = isBudgetDocument
    ? "text-[#9a6338]"
    : isProformaDocument
      ? "text-sky-700"
      : isDeliveryNoteDocument
        ? "text-teal-700"
        : "text-emerald-700";
  const detachButtonClass = isBudgetDocument
    ? "shrink-0 rounded-full border border-[#e7c39a] bg-white px-4 py-2 text-sm font-semibold text-[#8a5a33] transition hover:bg-[#fff4e5]"
    : isProformaDocument
      ? "shrink-0 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
      : isDeliveryNoteDocument
        ? "shrink-0 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
        : "shrink-0 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50";
  const numeroFacturaActual = normalizeInvoiceDocumentNumber(numeroFactura);
  const currentTaxNote = fiscalSettings.fiscalNote.trim();
  const saveLastNumber = (
    value: string,
    nextDocumentType: InvoiceDocumentType = documentType,
  ) => {
    const normalizedValue = normalizeInvoiceDocumentNumber(value);
    activeHistoryRepository.saveLastNumber(
      getInvoiceDocumentMeta(nextDocumentType).lastNumberStorageKey,
      normalizedValue,
    );

    if (nextDocumentType === documentType) {
      setUltimoNumeroGuardado(normalizedValue);
    }
  };
  const {
    buildDraft,
    draftIdRef,
    editableDocumentIdRef,
    latestDraftRef,
    saveDraftNow,
  } = useInvoicePersistence({
    documentType,
    numeroFacturaActual,
    fecha,
    fechaVencimiento,
    supportsSecondaryDate: documentMeta.supportsSecondaryDate,
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
    documentLabel: documentMeta.label,
    saveLastNumber,
  });
  const { descargar, enviar, isDocumentActionPending } = useInvoiceDocumentActions({
    activeConceptos,
    buildDraft,
    cliente,
    currentTaxLabel,
    deliveryDetails,
    documentArticle: documentMeta.article,
    documentLabel: documentMeta.label,
    documentMetaLabel: documentMeta.label,
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
    supportsSecondaryDate: documentMeta.supportsSecondaryDate,
    supportsVerifactu: documentMeta.supportsVerifactu,
    tipoIVA,
    total,
  });
  const handleNumeroFacturaChange = (value: string) => {
    setNumeroFactura(stripInvoiceDocumentPrefix(value).toUpperCase());
  };

  useInvoiceHydration({
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
  });

  useEffect(() => {
    setUltimoNumeroGuardado(readLastSavedNumber(documentType));
  }, [documentType]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedAccount) {
      return;
    }

    const syncCatalog = () => {
      const storedProfile = activeUserRepository.readProfile();

      startTransition(() => {
        setHasRegisteredUser(getUserFirstName(storedProfile).length > 0);
        setCatalogItems(activeCatalogRepository.readAll());
      });
    };
    const events = [
      getStorageEventName(USER_PROFILE_STORAGE_KEY),
      getStorageEventName(CATALOG_STORAGE_KEY),
      getStorageEventName(CLIENTS_STORAGE_KEY),
    ];

    events.forEach((eventName) => window.addEventListener(eventName, syncCatalog));
    return () =>
      events.forEach((eventName) =>
        window.removeEventListener(eventName, syncCatalog),
      );
  }, [hasLoadedAccount]);

  const updateConcept = (index: number, field: keyof Concepto, value: string | number) =>
    setConceptos((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]:
                field === "desc"
                  ? String(value)
                  : field === "cant"
                    ? String(value).trim() === ""
                      ? 0
                      : Math.max(1, num(value, 1))
                    : Math.max(0, num(value, 0)),
            }
          : item,
      ),
    );
  const removeConcept = (index: number) =>
    setConceptos((current) => (current.length === 1 ? [EMPTY_CONCEPTO] : current.filter((_, itemIndex) => itemIndex !== index)));
  const insertCatalogItem = (item: CatalogItem) => {
    const nextDescription = item.description.trim()
      ? `${item.name} - ${item.description}`.trim()
      : item.name.trim();
    const nextConcept = {
      desc: nextDescription || item.name || uiCopy.conceptPrefix,
      cant: 1,
      precio: item.basePrice,
    };

    if (!activeConceptos.length) {
      setTipoIVA(item.taxRate);
    }

    setConceptos((current) => {
      const emptyIndex = current.findIndex(
        (currentItem) => isEmptyConcept(currentItem),
      );

      if (emptyIndex === -1) {
        return [...current, nextConcept];
      }

      return current.map((currentItem, itemIndex) =>
        itemIndex === emptyIndex ? nextConcept : currentItem,
      );
    });
    setCatalogSearch("");
    showSuccessToast(
      isSpanish
        ? "Referencia anadida al documento"
        : "Reference added to the document",
    );
  };
  const selectClient = (selectedClient: ClientRecord) => {
    const nextClient = normalizeCliente(selectedClient);
    const nextDraft: DraftInvoice = {
      id: draftIdRef.current || draftId(),
      tipo: documentType,
      numero: numeroFacturaActual,
      fecha,
      fechaVencimiento: documentMeta.supportsSecondaryDate
        ? fechaVencimiento
        : "",
      linkedClientId: selectedClient.id,
      cliente: nextClient,
      empresa,
      conceptos: activeConceptos,
      deliveryDetails,
      logo,
      notas,
      tipoIVA,
      ivaPorc: tipoIVA,
      plantilla,
      updatedAt: new Date().toISOString(),
    };

    draftIdRef.current = nextDraft.id;
    latestDraftRef.current = nextDraft;
    setLinkedClientId(selectedClient.id);
    setCliente(nextClient);
    setClientSearch("");

    try {
      persistStoredDraft(nextDraft);
    } catch {}
  };
  const detachClient = () => {
    setLinkedClientId("");
    setClientSearch("");
  };
  const updateCliente = (field: keyof Cliente, value: string) => {
    setCliente((current) => ({ ...current, [field]: value }));
    if (linkedClientId) {
      setLinkedClientId("");
    }
  };
  const updateDeliveryDetails = (
    field: keyof DeliveryDetails,
    value: string,
  ) => {
    setDeliveryDetails((current) => ({ ...current, [field]: value }));
  };
  if (!isPageReady) {
    return (
      <AppScreenLoader
        eyebrow={uiCopy.document}
        title={isSpanish ? "Preparando editor" : "Preparing editor"}
        description={
          isSpanish
            ? "Estamos recuperando tus datos y el estado real de esta vista."
            : "We are restoring your data and the real state of this view."
        }
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[410px] flex-col px-4 pt-4 font-sans sm:max-w-[430px] sm:px-5 sm:pt-6"
        style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        <InvoiceEditorHeader
          documentMeta={documentMeta}
          documentPrefix={documentPrefix}
          formattedDueDate={formattedDueDate}
          handleNumeroFacturaChange={handleNumeroFacturaChange}
          inputClass={inputClass}
          modeCopy={modeCopy}
          numeroFactura={numeroFactura}
          numeroFacturaActual={numeroFacturaActual}
          saveDraftNow={saveDraftNow}
          setFecha={setFecha}
          setFechaVencimiento={setFechaVencimiento}
          setNumeroFactura={setNumeroFactura}
          showAdvancedTools={showAdvancedTools}
          uiCopy={uiCopy}
          ultimoNumeroGuardado={ultimoNumeroGuardado}
          fecha={fecha}
          fechaVencimiento={fechaVencimiento}
        />

        {!showAdvancedTools ? (
          <section className="mt-5 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.32)] backdrop-blur-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              {guestModeCopy.eyebrow}
            </p>
            <h2 className="mt-2 text-[1.18rem] sm:text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
              {guestModeCopy.title}
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-slate-500">
              {guestModeCopy.description}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {guestModeCopy.accessDescription}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/registro"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_32px_-22px_rgba(15,23,42,0.88)] transition hover:bg-slate-800"
              >
                {guestModeCopy.registerAction}
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {guestModeCopy.loginAction}
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mt-5 rounded-[26px] border border-white/70 bg-white/76 p-4 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:rounded-[34px] sm:p-6 sm:shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)]">

          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <UsersRound className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {uiCopy.client}
              </p>
              <h3 className="mt-2 text-[1.18rem] sm:text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                {uiCopy.clientData}
              </h3>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {showAdvancedTools ? (
              <>
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />
                    <input
                      value={clientSearch}
                      onChange={(event) => {
                        setClientSearch(event.target.value);
                        if (linkedClientId) {
                          setLinkedClientId("");
                        }
                      }}
                      placeholder={
                        clientesGuardados.length
                          ? uiCopy.searchClient
                          : uiCopy.noSavedClients
                      }
                      disabled={!clientesGuardados.length}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                  <Link
                    href="/clientes"
                    className="inline-flex min-h-12 sm:min-h-14 items-center justify-center rounded-[22px] border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {uiCopy.clients}
                  </Link>
                </div>

                {linkedClientId ? (
                  <div className={selectedClientCardClass}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={`text-[11px] font-medium uppercase tracking-[0.16em] ${selectedClientEyebrowClass}`}>
                          {modeCopy.selectedClientLabel}
                        </p>
                        <p className="mt-2 truncate text-sm font-semibold text-slate-950">
                          {cliente.nombre.trim() || uiCopy.unnamedClient}
                        </p>
                        <p className="mt-1 text-[13px] leading-5 text-slate-600">
                          {[cliente.nif, cliente.email, cliente.telefono]
                            .filter((value) => value.trim())
                            .join(" / ") || uiCopy.lowerDataLoaded}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={detachClient}
                        className={detachButtonClass}
                      >
                        {uiCopy.detach}
                      </button>
                    </div>
                  </div>
                ) : null}

                {!linkedClientId && clientSearch.trim() ? (
                  <div className="space-y-2">
                    {clientesFiltrados.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectClient(item)}
                        className="flex w-full items-start justify-between gap-3 rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 text-left shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)] transition hover:border-slate-200 hover:bg-white"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {item.nombre || uiCopy.unnamedClient}
                          </p>
                          <p className="mt-1 text-[13px] leading-5 text-slate-500">
                            {[item.nif, item.email, item.telefono]
                              .filter((value) => value.trim())
                              .join(" / ") || uiCopy.noContactData}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {uiCopy.use}
                        </span>
                      </button>
                    ))}
                    {!clientesFiltrados.length ? (
                      <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-500">
                        {uiCopy.noMatchesSearch}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-sm leading-6 text-slate-500">
                {guestModeCopy.clientDescription}
              </p>
            )}

            <input placeholder={uiCopy.namePlaceholder} value={cliente.nombre} onChange={(e) => updateCliente("nombre", e.target.value)} className={inputClass} />
            <input placeholder={uiCopy.taxIdPlaceholder} value={cliente.nif} onChange={(e) => updateCliente("nif", e.target.value)} className={inputClass} />
            <input placeholder={uiCopy.addressPlaceholder} value={cliente.direccion} onChange={(e) => updateCliente("direccion", e.target.value)} className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder={uiCopy.cityPlaceholder} value={cliente.ciudad} onChange={(e) => updateCliente("ciudad", e.target.value)} className={inputClass} />
              <input placeholder={uiCopy.postalCodePlaceholder} value={cliente.codigoPostal} onChange={(e) => updateCliente("codigoPostal", e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder={uiCopy.phonePlaceholder} value={cliente.telefono} onChange={(e) => updateCliente("telefono", e.target.value)} className={inputClass} />
              <input placeholder={uiCopy.emailPlaceholder} value={cliente.email} onChange={(e) => updateCliente("email", e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[26px] border border-white/70 bg-white/76 p-4 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:rounded-[34px] sm:p-6 sm:shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)]">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <Palette className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {uiCopy.concepts}
              </p>
              <h3 className="mt-2 text-[1.18rem] sm:text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                {modeCopy.conceptsTitle}
              </h3>
            </div>
          </div>
          {showAdvancedTools ? (
            <div className="mt-6 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,245,240,0.92))] p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    {uiCopy.catalog}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {uiCopy.catalogDescription}
                  </p>
                </div>
                <Link
                  href="/catalogo"
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {uiCopy.manage}
                </Link>
              </div>

              <label className="mt-4 flex items-center gap-3 rounded-[24px] border border-white/70 bg-white/85 px-4 py-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.25)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Search className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <input
                  type="search"
                  value={catalogSearch}
                  onChange={(event) => setCatalogSearch(event.target.value)}
                  placeholder={
                    isSpanish
                      ? `Buscar referencia para ${
                          documentMeta.label === "Albaran"
                            ? "este albaran"
                            : documentMeta.label === "Proforma"
                              ? "esta proforma"
                              : documentMeta.label === "Presupuesto"
                                ? "este presupuesto"
                                : "esta factura"
                        }`
                      : `Search reference for ${
                          documentType === "albaran"
                            ? "this delivery note"
                            : documentType === "proforma"
                              ? "this proforma"
                              : documentType === "presupuesto"
                                ? "this quote"
                                : "this invoice"
                        }`
                  }
                  className="h-10 w-full border-0 bg-transparent text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              {catalogSearch.trim() ? (
                <div className="mt-4 space-y-2">
                  {catalogoFiltrado.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => insertCatalogItem(item)}
                      className="flex w-full items-start justify-between gap-3 rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 text-left shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)] transition hover:border-slate-200 hover:bg-white"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[13px] leading-5 text-slate-500">
                          {[item.category, item.sku, `${money(item.basePrice)} / ${item.unit}`]
                            .filter((value) => value.trim())
                            .join(" / ")}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {uiCopy.add}
                      </span>
                    </button>
                  ))}
                  {!catalogoFiltrado.length ? (
                    <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-500">
                      {uiCopy.noCatalogMatches}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="mt-6 space-y-4">
            {conceptos.map((item, index) => (
              <div key={index} className="rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                      {uiCopy.conceptPrefix} {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {modeCopy.conceptLineLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeConcept(index)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.1} />
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder={modeCopy.conceptPlaceholder}
                  value={item.desc}
                  onChange={(e) => updateConcept(index, "desc", e.target.value)}
                  className="mt-4 min-h-[96px] w-full rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.cant === 0 ? "" : item.cant}
                    onChange={(e) =>
                      updateConcept(index, "cant", e.target.value)
                    }
                    placeholder={isSpanish ? "Cantidad" : "Qty"}
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.precio === 0 ? "" : item.precio}
                    onChange={(e) =>
                      updateConcept(index, "precio", Math.max(0, num(e.target.value, 0)))
                    }
                    placeholder={uiCopy.unitPricePlaceholder}
                    className={inputClass}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between rounded-[22px] bg-[#f7f6f3] px-4 py-3">
                  <p className="text-sm font-medium text-slate-500">{modeCopy.conceptTotal}</p>
                  <p className="text-base font-semibold text-slate-950">
                    {money(item.cant * item.precio)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setConceptos([...conceptos, EMPTY_CONCEPTO])}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            {modeCopy.conceptAdd}
          </button>
        </section>

        {isDeliveryNoteDocument ? (
          <section className="mt-5 rounded-[26px] border border-white/70 bg-white/76 p-4 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:rounded-[34px] sm:p-6 sm:shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)]">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f766e] text-white shadow-[0_18px_28px_-18px_rgba(15,118,110,0.82)]">
                <Send className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                  {uiCopy.delivery}
                </p>
                <h3 className="mt-2 text-[1.18rem] sm:text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                  {uiCopy.deliveryTitle}
                </h3>
                <p className="mt-2 max-w-sm text-[14px] leading-6 text-slate-500">
                  {uiCopy.deliveryDescription}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  {uiCopy.deliveryPlace}
                </span>
                <input
                  type="text"
                  value={deliveryDetails.location}
                  onChange={(event) =>
                    updateDeliveryDetails("location", event.target.value)
                  }
                  placeholder={uiCopy.deliveryPlacePlaceholder}
                  className={inputClass}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    {uiCopy.deliveredBy}
                  </span>
                  <input
                    type="text"
                    value={deliveryDetails.deliveredBy}
                    onChange={(event) =>
                      updateDeliveryDetails("deliveredBy", event.target.value)
                    }
                    placeholder={empresa.nombre || uiCopy.deliveredByPlaceholder}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    {uiCopy.receivedBy}
                  </span>
                  <input
                    type="text"
                    value={deliveryDetails.receivedBy}
                    onChange={(event) =>
                      updateDeliveryDetails("receivedBy", event.target.value)
                    }
                    placeholder={cliente.nombre || uiCopy.receivedByPlaceholder}
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  {uiCopy.receivedById}
                </span>
                <input
                  type="text"
                  value={deliveryDetails.receivedById}
                  onChange={(event) =>
                    updateDeliveryDetails("receivedById", event.target.value)
                  }
                  placeholder={uiCopy.receivedByIdPlaceholder}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  {uiCopy.deliveryNotes}
                </span>
                <textarea
                  rows={4}
                  value={deliveryDetails.deliveryNotes}
                  onChange={(event) =>
                    updateDeliveryDetails("deliveryNotes", event.target.value)
                  }
                  placeholder={uiCopy.deliveryNotesPlaceholder}
                  className="min-h-[112px] w-full rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
              </label>
            </div>
          </section>
        ) : null}

        <section className="mt-5 rounded-[26px] border border-white/70 bg-white/76 p-4 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:rounded-[34px] sm:p-6 sm:shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)]">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <Wallet className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {modeCopy.summaryEyebrow}
              </p>
              <h3 className="mt-2 text-[1.18rem] sm:text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                {modeCopy.summaryTitle}
              </h3>
            </div>
          </div>
          <InvoiceEditorSummary
            clienteEmail={cliente.email}
            currentTaxLabel={currentTaxLabel}
            currentTaxNote={currentTaxNote}
            descargar={descargar}
            enviar={enviar}
            guestModeCopy={guestModeCopy}
            iva={iva}
            isDocumentActionPending={isDocumentActionPending}
            modeCopy={modeCopy}
            money={money}
            primaryActionClass={primaryActionClass}
            showAdvancedTools={showAdvancedTools}
            subtotal={subtotal}
            tipoIVA={tipoIVA}
            total={total}
            totalCardClass={totalCardClass}
            uiCopy={uiCopy}
          />
        </section>
      </main>
    </div>
  );
}
