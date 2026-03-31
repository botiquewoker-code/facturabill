"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import {
  CalendarDays,
  Download,
  Palette,
  Plus,
  Search,
  Save,
  Send,
  Trash2,
  UsersRound,
  Wallet,
} from "lucide-react";
import InvoicePDF from "@/features/invoices/components/InvoicePDF";
import PlantillaNueva from "@/features/invoices/components/PlantillaNueva";
import PlantillaStudio from "@/features/invoices/components/PlantillaStudio";
import {
  findClientById,
  readClients,
  type ClientRecord,
} from "@/features/clients/storage";
import {
  readCatalogItems,
  type CatalogItem,
} from "@/features/catalog/storage";
import {
  clearActiveDraft,
  readActiveDraft,
  readDrafts,
  upsertDraft,
  writeDrafts,
} from "@/features/drafts/storage";
import {
  DEFAULT_FISCAL_SETTINGS,
  readFiscalSettings,
  type FiscalSettings,
} from "@/features/invoices/fiscal-settings";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import {
  getUserFirstName,
  readUserProfile,
} from "@/features/account/profile";
import { prepareVerifactuInvoiceRecord } from "@/features/verifactu/service";
import type { VerifactuSourceAction } from "@/features/verifactu/types";
import AppScreenLoader from "@/features/ui/AppScreenLoader";

type Cliente = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  email: string;
};

type Empresa = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefono: string;
  email: string;
};

type Concepto = { desc: string; cant: number; precio: number };
type Plantilla = "InvoicePDF" | "PlantillaNueva" | "PlantillaStudio";
type DraftInvoice = {
  id: string;
  tipo: "factura" | "presupuesto";
  numero: string;
  fecha: string;
  fechaVencimiento?: string;
  linkedClientId?: string;
  cliente: Cliente;
  empresa: Empresa;
  conceptos: Concepto[];
  logo: string;
  notas: string;
  tipoIVA: number;
  ivaPorc: number;
  plantilla: Plantilla;
  updatedAt: string;
};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params: Record<string, string | number>,
    ) => void;
  }
}

const HISTORY_KEY = "historial";
const LAST_INVOICE_NUMBER_KEY = "ultimoNumeroFactura";
const LAST_BUDGET_NUMBER_KEY = "ultimoNumeroPresupuesto";
const EMPTY_CLIENTE: Cliente = {
  nombre: "",
  nif: "",
  direccion: "",
  ciudad: "",
  codigoPostal: "",
  telefono: "",
  email: "",
};
const EMPTY_EMPRESA: Empresa = {
  nombre: "",
  nif: "",
  direccion: "",
  ciudad: "",
  cp: "",
  telefono: "",
  email: "",
};
const EMPTY_CONCEPTO: Concepto = { desc: "", cant: 1, precio: 0 };
const inputClass =
  "h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]";

const today = () => new Date().toISOString().split("T")[0];
const addDays = (baseDate: string, days: number) => {
  const [year, month, day] = baseDate.split("-").map((value) => Number(value));

  if (!year || !month || !day) {
    return today();
  }

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const s = (v: unknown) => (typeof v === "string" ? v : "");
const num = (v: unknown, fallback: number) => {
  const parsed = Number(v);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const draftId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const isPlantilla = (v: string): v is Plantilla =>
  v === "InvoicePDF" || v === "PlantillaNueva" || v === "PlantillaStudio";
const pdfTemplates: Record<
  Plantilla,
  typeof InvoicePDF | typeof PlantillaNueva | typeof PlantillaStudio
> = {
  InvoicePDF,
  PlantillaNueva,
  PlantillaStudio,
};
const stripDocumentPrefix = (v: unknown) =>
  s(v).trim().replace(/^PRES-?/i, "").replace(/^FACT?-?/i, "");
const normalizeNumero = (v: unknown) =>
  stripDocumentPrefix(v) || "001";
const lastNumberKey = (isBudget: boolean) =>
  isBudget ? LAST_BUDGET_NUMBER_KEY : LAST_INVOICE_NUMBER_KEY;
const readLastSavedNumber = (isBudget: boolean) => {
  if (typeof window === "undefined") {
    return "";
  }

  const storedNumber = stripDocumentPrefix(
    localStorage.getItem(lastNumberKey(isBudget)),
  );

  if (storedNumber) {
    return storedNumber;
  }

  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as Array<
      Record<string, unknown>
    >;
    const latestDocument = history.find((item) =>
      isBudget ? item.tipo === "presupuesto" : item.tipo === "factura",
    );

    return stripDocumentPrefix(latestDocument?.numero || latestDocument?.id);
  } catch {
    return "";
  }
};
const money = (v: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(v);
const clientMatchesSearch = (client: ClientRecord, query: string) =>
  [client.nombre, client.nif, client.email, client.telefono]
    .join(" ")
    .toLowerCase()
    .includes(query);
const normalizeCliente = (v: unknown): Cliente => {
  const x = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  return {
    nombre: s(x.nombre),
    nif: s(x.nif ?? x.dni),
    direccion: s(x.direccion),
    ciudad: s(x.ciudad),
    codigoPostal: s(x.codigoPostal ?? x.cp),
    telefono: s(x.telefono),
    email: s(x.email),
  };
};
const normalizeEmpresa = (v: unknown): Empresa => {
  const x = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  return {
    nombre: s(x.nombre),
    nif: s(x.nif),
    direccion: s(x.direccion),
    ciudad: s(x.ciudad),
    cp: s(x.cp ?? x.codigoPostal),
    telefono: s(x.telefono),
    email: s(x.email),
  };
};
const normalizeConceptos = (v: unknown): Concepto[] =>
  Array.isArray(v) && v.length
    ? v.map((item) => {
        const x =
          item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          desc: s(x.desc),
          cant: Math.max(1, num(x.cant, 1)),
          precio: Math.max(0, num(x.precio, 0)),
        };
      })
    : [EMPTY_CONCEPTO];

function hasContent(d: DraftInvoice) {
  return (
    Object.values(d.cliente).some((v) => v.trim()) ||
    Object.values(d.empresa).some((v) => v.trim()) ||
    d.conceptos.some((c) => c.desc.trim() || c.cant > 0 || c.precio > 0)
  );
}

export default function CrearFacturaPage() {
  const latestDraftRef = useRef<DraftInvoice | null>(null);
  const draftIdRef = useRef<string | null>(null);

  const [cliente, setCliente] = useState<Cliente>(EMPTY_CLIENTE);
  const [clientesGuardados, setClientesGuardados] = useState<ClientRecord[]>([]);
  const [empresa, setEmpresa] = useState<Empresa>(EMPTY_EMPRESA);
  const [conceptos, setConceptos] = useState<Concepto[]>([EMPTY_CONCEPTO]);
  const [esPresupuesto, setEsPresupuesto] = useState(false);
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
  const [plantilla, setPlantilla] = useState<Plantilla>("InvoicePDF");
  const [linkedClientId, setLinkedClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const subtotal = conceptos.reduce((acc, item) => acc + item.cant * item.precio, 0);
  const iva = subtotal * (tipoIVA / 100);
  const total = subtotal + iva;
  const clientesFiltrados = useMemo(() => {
    const query = clientSearch.trim().toLowerCase();
    const base = query
      ? clientesGuardados.filter((item) => clientMatchesSearch(item, query))
      : [];

    return base.filter((item) => item.id !== linkedClientId).slice(0, 6);
  }, [clientSearch, clientesGuardados, linkedClientId]);
  const catalogoFiltrado = useMemo(() => {
    if (!(hasLoadedAccount && hasRegisteredUser)) {
      return [] as CatalogItem[];
    }

    const query = catalogSearch.trim().toLowerCase();

    if (!query) {
      return [] as CatalogItem[];
    }

    const currentDocumentType = esPresupuesto ? "presupuesto" : "factura";

    return catalogItems
      .filter((item) => item.status === "active")
      .filter((item) => item.supportedDocuments.includes(currentDocumentType))
      .filter((item) =>
        [item.name, item.description, item.sku, item.category]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 6);
  }, [catalogItems, catalogSearch, esPresupuesto, hasLoadedAccount, hasRegisteredUser]);
  const pdfData = {
    esPresupuesto,
    numero: normalizeNumero(numeroFactura),
    fecha,
    fechaVencimiento: esPresupuesto ? "" : fechaVencimiento,
    empresa,
    cliente: { ...cliente, cp: cliente.codigoPostal },
    conceptos,
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
  };
  const documentPrefix = esPresupuesto ? "PRES" : "FACT";
  const formattedDueDate = fechaVencimiento
    ? new Date(fechaVencimiento).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
  const modeCopy = esPresupuesto
    ? {
        workspace: "Propuestas",
        title: "Crear presupuesto",
        subtitle: "Prepara un presupuesto claro y profesional.",
        clientSearchDescription: "Selecciona un cliente guardado.",
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
      }
    : {
        workspace: "Facturacion",
        title: "Crear factura",
        subtitle: "Prepara la factura y revisa los importes.",
        clientSearchDescription: "Selecciona un cliente guardado.",
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
      };
  const guestModeCopy = {
    eyebrow: "Acceso",
    title: esPresupuesto ? "Presupuesto basico" : "Factura basica",
    description: esPresupuesto
      ? "Muestra solo lo esencial para preparar el presupuesto y descargarlo."
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
  };
  const showAdvancedTools = hasLoadedAccount && hasRegisteredUser;
  const primaryActionClass = esPresupuesto
    ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8a5a33] px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(138,90,51,0.9)] transition hover:bg-[#754a28]"
    : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800";
  const totalCardClass = esPresupuesto
    ? "mt-3 rounded-[24px] bg-[linear-gradient(135deg,#8a5a33,#b97a45)] px-4 py-4 text-white shadow-[0_22px_38px_-26px_rgba(138,90,51,0.82)]"
    : "mt-3 rounded-[24px] bg-slate-950 px-4 py-4 text-white shadow-[0_22px_38px_-26px_rgba(15,23,42,0.92)]";
  const selectedClientCardClass = esPresupuesto
    ? "mt-4 rounded-[26px] border border-[#edcfab] bg-[#fff5e9] p-4 shadow-[0_16px_30px_-24px_rgba(185,122,69,0.35)]"
    : "mt-4 rounded-[26px] border border-emerald-200 bg-emerald-50/85 p-4 shadow-[0_16px_30px_-24px_rgba(16,185,129,0.45)]";
  const selectedClientEyebrowClass = esPresupuesto
    ? "text-[#9a6338]"
    : "text-emerald-700";
  const detachButtonClass = esPresupuesto
    ? "shrink-0 rounded-full border border-[#e7c39a] bg-white px-4 py-2 text-sm font-semibold text-[#8a5a33] transition hover:bg-[#fff4e5]"
    : "shrink-0 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50";
  const numeroFacturaActual = normalizeNumero(numeroFactura);
  const currentTaxLabel = fiscalSettings.taxLabel.trim() || "IVA";
  const currentTaxNote = fiscalSettings.fiscalNote.trim();
  const saveLastNumber = (value: string, isBudget = esPresupuesto) => {
    if (typeof window === "undefined") {
      return;
    }

    const normalizedValue = normalizeNumero(value);
    localStorage.setItem(lastNumberKey(isBudget), normalizedValue);

    if (isBudget === esPresupuesto) {
      setUltimoNumeroGuardado(normalizedValue);
    }
  };
  const handleNumeroFacturaChange = (value: string) => {
    setNumeroFactura(stripDocumentPrefix(value).toUpperCase());
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const frame = window.requestAnimationFrame(() => {
      const finishHydration = () => {
        setHasLoadedAccount(true);
        setIsPageReady(true);
      };
      const params = new URLSearchParams(window.location.search);
      const storedClients = readClients();
      const routeClientId = params.get("clienteId") || "";
      const storedFiscalSettings = readFiscalSettings();
      const storedProfile = readUserProfile();

      setClientesGuardados(storedClients);
      setCatalogItems(readCatalogItems());
      setFiscalSettings(storedFiscalSettings);
      setTipoIVA(storedFiscalSettings.defaultTaxRate);
      setHasRegisteredUser(getUserFirstName(storedProfile).length > 0);

      const rawCompany = localStorage.getItem("datosEmpresa");
      if (rawCompany) try { setEmpresa(normalizeEmpresa(JSON.parse(rawCompany))); } catch {}
      const rawLogo = localStorage.getItem("logoUsuario");
      if (rawLogo) setLogo(rawLogo);
      const rawNotes = localStorage.getItem("notasUsuario");
      if (rawNotes) setNotas(rawNotes);
      const rawTemplate =
        localStorage.getItem("plantillaSeleccionada") ||
        localStorage.getItem("plantillaUsuario") ||
        localStorage.getItem("plantillaElegida");
      if (rawTemplate && isPlantilla(rawTemplate)) setPlantilla(rawTemplate);

      const activeDraft = readActiveDraft<Partial<DraftInvoice>>();
      if (activeDraft) {
        try {
          const draft = activeDraft;
          draftIdRef.current = s(draft.id) || draftId();
          setEsPresupuesto(draft.tipo === "presupuesto");
          setFecha(s(draft.fecha) || today());
          setFechaVencimiento(
            s(draft.fechaVencimiento) || addDays(s(draft.fecha) || today(), 30),
          );
          setNumeroFactura(normalizeNumero(draft.numero));
          setLinkedClientId(s(draft.linkedClientId));
          setCliente(normalizeCliente(draft.cliente));
          setEmpresa(normalizeEmpresa(draft.empresa));
          setConceptos(normalizeConceptos(draft.conceptos));
          setLogo(s(draft.logo));
          setNotas(s(draft.notas) || rawNotes || "");
          setTipoIVA(num(draft.tipoIVA, storedFiscalSettings.defaultTaxRate));
          const nextTemplate = s(draft.plantilla);
          if (isPlantilla(nextTemplate)) setPlantilla(nextTemplate);
        } catch {}
        clearActiveDraft();
        finishHydration();
        return;
      }

      const convertDraft = localStorage.getItem("presupuestoConvertir");
      if (convertDraft) {
        try {
          const parsed = JSON.parse(convertDraft) as Record<string, unknown>;
          if (parsed.cliente) setCliente(normalizeCliente(parsed.cliente));
          if (parsed.conceptos || parsed.items) {
            setConceptos(normalizeConceptos(parsed.conceptos || parsed.items));
          }
          if (parsed.fechaVencimiento) {
            setFechaVencimiento(s(parsed.fechaVencimiento));
          }
          if (parsed.tipoIVA) {
            setTipoIVA(num(parsed.tipoIVA, storedFiscalSettings.defaultTaxRate));
          }
          setNumeroFactura(normalizeNumero(parsed.numero || parsed.id));
        } catch {}
        localStorage.removeItem("presupuestoConvertir");
      }

      if (routeClientId) {
        const { client } = findClientById(storedClients, routeClientId);
        if (client) {
          setLinkedClientId(client.id);
          setCliente(normalizeCliente(client));
        }
      }

      if (params.get("tipo") === "presupuesto") setEsPresupuesto(true);
      finishHydration();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setUltimoNumeroGuardado(readLastSavedNumber(esPresupuesto));
  }, [esPresupuesto]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedAccount) {
      return;
    }

    const syncCatalog = () => {
      const storedProfile = readUserProfile();

      setHasRegisteredUser(getUserFirstName(storedProfile).length > 0);
      setCatalogItems(readCatalogItems());
    };

    window.addEventListener("focus", syncCatalog);
    return () => window.removeEventListener("focus", syncCatalog);
  }, [hasLoadedAccount]);

  useEffect(() => {
    const nextDraft: DraftInvoice = {
      id: draftIdRef.current || draftId(),
      tipo: esPresupuesto ? "presupuesto" : "factura",
      numero: numeroFacturaActual,
      fecha,
      fechaVencimiento: esPresupuesto ? "" : fechaVencimiento,
      linkedClientId,
      cliente,
      empresa,
      conceptos,
      logo,
      notas,
      tipoIVA,
      ivaPorc: tipoIVA,
      plantilla,
      updatedAt: new Date().toISOString(),
    };
    draftIdRef.current = nextDraft.id;
    latestDraftRef.current = nextDraft;
  }, [cliente, conceptos, empresa, esPresupuesto, fecha, fechaVencimiento, linkedClientId, logo, notas, numeroFacturaActual, plantilla, tipoIVA]);

  useEffect(() => {
    const persist = () => {
      const draft = latestDraftRef.current;
      if (!draft || !hasContent(draft) || typeof window === "undefined") return;
      try {
        const saved = readDrafts<DraftInvoice>();
        writeDrafts(upsertDraft(draft, saved));
        localStorage.setItem(
          lastNumberKey(draft.tipo === "presupuesto"),
          normalizeNumero(draft.numero),
        );
      } catch {}
    };
    window.addEventListener("beforeunload", persist);
    window.addEventListener("pagehide", persist);
    return () => {
      persist();
      window.removeEventListener("beforeunload", persist);
      window.removeEventListener("pagehide", persist);
    };
  }, []);

  const updateConcept = (index: number, field: keyof Concepto, value: string | number) =>
    setConceptos((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: field === "desc" ? String(value) : Math.max(field === "cant" ? 1 : 0, num(value, field === "cant" ? 1 : 0)) }
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
      desc: nextDescription || item.name || "Concepto",
      cant: 1,
      precio: item.basePrice,
    };

    if (!conceptos.some((current) => current.desc.trim() || current.precio > 0)) {
      setTipoIVA(item.taxRate);
    }

    setConceptos((current) => {
      const emptyIndex = current.findIndex(
        (currentItem) =>
          !currentItem.desc.trim() && currentItem.cant === 1 && currentItem.precio === 0,
      );

      if (emptyIndex === -1) {
        return [...current, nextConcept];
      }

      return current.map((currentItem, itemIndex) =>
        itemIndex === emptyIndex ? nextConcept : currentItem,
      );
    });
    setCatalogSearch("");
    showSuccessToast("Referencia anadida al documento");
  };
  const selectClient = (selectedClient: ClientRecord) => {
    setLinkedClientId(selectedClient.id);
    setCliente(normalizeCliente(selectedClient));
    setClientSearch("");
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
  const saveDraftNow = () => {
    const draft = latestDraftRef.current;
    if (!draft) {
      return;
    }

    if (!hasContent(draft)) {
      saveLastNumber(draft.numero, draft.tipo === "presupuesto");
      showSuccessToast(
        esPresupuesto
          ? "Numero de presupuesto guardado"
          : "Numero de factura guardado",
      );
      return;
    }

    try {
      const saved = readDrafts<DraftInvoice>();
      writeDrafts(upsertDraft(draft, saved));
      saveLastNumber(draft.numero, draft.tipo === "presupuesto");
      showSuccessToast("Borrador guardado");
    } catch {
      showWarningToast("No se pudo guardar el borrador");
    }
  };
  const validate = (requireEmail?: boolean) => {
    const recommendations: string[] = [];

    if (!empresa.nombre.trim() || !empresa.nif.trim()) {
      recommendations.push("revisa los datos basicos de tu empresa");
    }

    if (!cliente.nombre.trim()) {
      recommendations.push("anade al menos el nombre del cliente");
    }

    if (!conceptos.some((item) => item.desc.trim() && item.cant > 0)) {
      recommendations.push(
        "incluye algun concepto para que el documento quede mas claro",
      );
    }

    if (recommendations.length > 0) {
      showWarningToast(`Antes de continuar, te recomendamos ${recommendations.join(", ")}.`);
    }

    if (requireEmail && !cliente.email.trim()) {
      return (
        showWarningToast(
          "Anade el email del cliente para poder enviar el documento.",
        ),
        false
      );
    }

    return true;
  };
  const updateHistory = async (
    estado: string,
    sourceAction: VerifactuSourceAction,
  ) => {
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

    if (!esPresupuesto) {
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
          lines: conceptos.map((item) => ({
            description: item.desc,
            quantity: item.cant,
            unitPrice: item.precio,
            lineTotal: item.cant * item.precio,
          })),
          subtotalAmount: subtotal,
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
          lastError: "No se pudo actualizar el seguimiento de esta factura.",
        };
      }
    }

    const item = {
      id: numeroFacturaActual,
      numero: numeroFacturaActual,
      tipo: esPresupuesto ? "presupuesto" : "factura",
      cliente,
      fecha: new Date(fecha).toLocaleDateString("es-ES"),
      fechaVencimiento:
        !esPresupuesto && fechaVencimiento
          ? new Date(fechaVencimiento).toLocaleDateString("es-ES")
          : "",
      conceptos,
      total,
      estado,
      verifactu: verifactuSummary,
    };
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as Array<Record<string, unknown>>;
    const index = history.findIndex(
      (doc) => s(doc.numero || doc.id) === numeroFacturaActual,
    );
    if (index >= 0) history[index] = { ...history[index], ...item };
    else history.unshift(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    saveLastNumber(numeroFacturaActual);
  };
  const descargar = async () => {
    if (!validate()) return;
    try {
      const Component = pdfTemplates[plantilla];
      const blob = await pdf(<Component datos={pdfData} numeroFactura={numeroFacturaActual} conceptos={conceptos} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${esPresupuesto ? "Presupuesto" : "Factura"}_${numeroFacturaActual}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      await updateHistory(
        esPresupuesto ? "Presupuesto descargado" : "Factura descargada",
        "downloaded",
      );
      showSuccessToast("PDF descargado");
    } catch {
      showWarningToast("No se pudo generar el PDF");
    }
  };
  const enviar = async () => {
    if (!validate(true)) return;
    try {
      const Component = pdfTemplates[plantilla];
      const blob = await pdf(<Component datos={pdfData} numeroFactura={numeroFacturaActual} conceptos={conceptos} />).toBlob();
      const formData = new FormData();
      formData.append("file", blob, `${esPresupuesto ? "Presupuesto" : "Factura"}_${numeroFacturaActual}.pdf`);
      formData.append("to", cliente.email);
      formData.append("subject", `${esPresupuesto ? "Presupuesto" : "Factura"} ${numeroFacturaActual}`);
      formData.append("text", `Hola,\n\nAdjunto ${esPresupuesto ? "el presupuesto" : "la factura"} ${numeroFacturaActual}.\n\nGracias.\n${empresa.nombre || "Tu empresa"}`);
      const res = await fetch("/api/enviar-email", { method: "POST", body: formData });
      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!res.ok) {
        throw new Error(payload?.error || "send failed");
      }
      if (window.gtag) window.gtag("event", "conversion", { send_to: "AW-1791812185/PvpICL_mx_obENHy-BC", value: total, currency: "EUR" });
      await updateHistory(
        esPresupuesto ? "Presupuesto enviado" : "Factura enviada",
        "emailed",
      );
      showSuccessToast("Documento enviado");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo enviar el documento";

      if (message === "Email service is not configured correctly") {
        showWarningToast("El envio por correo no esta disponible en este momento");
        return;
      }

      if (message === "Invalid email payload") {
        showWarningToast("Revisa el email del cliente antes de enviar");
        return;
      }

      if (message.toLowerCase().includes("not verified")) {
        showWarningToast("No se pudo completar el envio. Revisa los datos del correo y vuelve a intentarlo.");
        return;
      }

      showWarningToast("No se pudo enviar el documento. Intentalo de nuevo.");
    }
  };

  if (!isPageReady) {
    return (
      <AppScreenLoader
        eyebrow="Documento"
        title="Preparando editor"
        description="Estamos recuperando tus datos y el estado real de esta vista."
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              {modeCopy.workspace}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              {modeCopy.title}
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              {modeCopy.subtitle}
            </p>
          </div>
          {showAdvancedTools ? (
            <button
              type="button"
              onClick={saveDraftNow}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)] transition hover:bg-slate-800"
            >
              <Save className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </button>
          ) : null}
        </header>

        {!esPresupuesto ? (
          <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                <CalendarDays className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                  Documento
                </p>
                <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                  Fecha y vencimiento
                </h3>
                <p className="mt-2 max-w-xs text-[14px] leading-6 text-slate-500">
                  Se mostrara tambien en el PDF.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-slate-200 bg-white/85 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Numero de factura
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold tracking-[0.16em] text-slate-600">
                  {documentPrefix}-
                </span>
                <input
                  type="text"
                  value={numeroFactura}
                  onChange={(event) => handleNumeroFacturaChange(event.target.value)}
                  onBlur={() => setNumeroFactura(numeroFacturaActual)}
                  placeholder="001"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className={`${inputClass} h-12`}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-3 py-2 text-xs text-slate-500">
                <span>Ultimo guardado</span>
                <span className="font-semibold text-slate-900">
                  {ultimoNumeroGuardado
                    ? `${documentPrefix}-${ultimoNumeroGuardado}`
                    : "Todavia no hay ninguno"}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Fecha de emision
                </span>
                <input
                  type="date"
                  value={fecha}
                  onChange={(event) => setFecha(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Fecha de vencimiento
                </span>
                <input
                  type="date"
                  value={fechaVencimiento}
                  onChange={(event) => setFechaVencimiento(event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <span>Vencimiento actual</span>
              <span className="font-semibold text-slate-900">
                {formattedDueDate || "Sin fecha"}
              </span>
            </div>
          </section>
        ) : null}

        {!showAdvancedTools ? (
          <section className="mt-5 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.32)] backdrop-blur-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              {guestModeCopy.eyebrow}
            </p>
            <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
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

        <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">

          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <UsersRound className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Cliente
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                Datos del cliente
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
                          ? "Buscar cliente por nombre, NIF, email o telefono"
                          : "No hay clientes guardados todavia"
                      }
                      disabled={!clientesGuardados.length}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                  <Link
                    href="/clientes"
                    className="inline-flex min-h-14 items-center justify-center rounded-[22px] border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Clientes
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
                          {cliente.nombre.trim() || "Cliente sin nombre"}
                        </p>
                        <p className="mt-1 text-[13px] leading-5 text-slate-600">
                          {[cliente.nif, cliente.email, cliente.telefono]
                            .filter((value) => value.trim())
                            .join(" / ") || "Datos cargados en el formulario inferior."}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={detachClient}
                        className={detachButtonClass}
                      >
                        Desvincular
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
                            {item.nombre || "Cliente sin nombre"}
                          </p>
                          <p className="mt-1 text-[13px] leading-5 text-slate-500">
                            {[item.nif, item.email, item.telefono]
                              .filter((value) => value.trim())
                              .join(" / ") || "Sin datos de contacto"}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          Usar
                        </span>
                      </button>
                    ))}
                    {!clientesFiltrados.length ? (
                      <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-500">
                        No hay coincidencias para esa busqueda.
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

            <input placeholder="Nombre o razon social" value={cliente.nombre} onChange={(e) => updateCliente("nombre", e.target.value)} className={inputClass} />
            <input placeholder="NIF / DNI" value={cliente.nif} onChange={(e) => updateCliente("nif", e.target.value)} className={inputClass} />
            <input placeholder="Direccion" value={cliente.direccion} onChange={(e) => updateCliente("direccion", e.target.value)} className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Ciudad" value={cliente.ciudad} onChange={(e) => updateCliente("ciudad", e.target.value)} className={inputClass} />
              <input placeholder="Codigo postal" value={cliente.codigoPostal} onChange={(e) => updateCliente("codigoPostal", e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Telefono" value={cliente.telefono} onChange={(e) => updateCliente("telefono", e.target.value)} className={inputClass} />
              <input placeholder="Email" value={cliente.email} onChange={(e) => updateCliente("email", e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <Palette className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Conceptos
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                {modeCopy.conceptsTitle}
              </h3>
            </div>
          </div>
          {showAdvancedTools ? (
            <div className="mt-6 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,245,240,0.92))] p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Catalogo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Busca productos o servicios y anadelos directamente al documento.
                  </p>
                </div>
                <Link
                  href="/catalogo"
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Gestionar
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
                    esPresupuesto
                      ? "Buscar referencia para este presupuesto"
                      : "Buscar referencia para esta factura"
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
                        Anadir
                      </span>
                    </button>
                  ))}
                  {!catalogoFiltrado.length ? (
                    <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-500">
                      No hay referencias para esa busqueda.
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
                      Concepto {String(index + 1).padStart(2, "0")}
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
                    value={item.cant}
                    onChange={(e) =>
                      updateConcept(index, "cant", Math.max(1, num(e.target.value, 1)))
                    }
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
                    placeholder="Precio unitario"
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

        <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <Wallet className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {modeCopy.summaryEyebrow}
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                {modeCopy.summaryTitle}
              </h3>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,245,240,0.92))] p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between py-2 text-sm text-slate-600">
              <span>Base imponible</span>
              <span className="font-semibold text-slate-950">{money(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm text-slate-600">
              <span>{currentTaxLabel} ({tipoIVA}%)</span>
              <span className="font-semibold text-slate-950">{money(iva)}</span>
            </div>
            <div className={totalCardClass}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/70">{modeCopy.totalLabel}</p>
                <p className="text-[1.55rem] font-semibold tracking-[-0.04em]">
                  {money(total)}
                </p>
              </div>
            </div>
          </div>
          {showAdvancedTools ? (
            <div className="mt-4 rounded-[24px] border border-white/70 bg-white/84 px-4 py-4 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Fiscal
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    {currentTaxLabel} por defecto aplicado al documento
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {currentTaxNote ||
                      "Sin nota fiscal adicional. Puedes cambiarlo desde Configuracion fiscal."}
                  </p>
                </div>
                <Link
                  href="/ajustes/configuracion-fiscal"
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Fiscal
                </Link>
              </div>
            </div>
          ) : null}
          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={descargar}
              className={primaryActionClass}
            >
              <Download className="h-4 w-4" strokeWidth={2.2} />
              {modeCopy.downloadLabel}
            </button>
            {showAdvancedTools ? (
              <button
                type="button"
                onClick={enviar}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Send className="h-4 w-4" strokeWidth={2.2} />
                {modeCopy.sendLabel}
              </button>
            ) : null}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] border border-white/70 bg-white/82 px-4 py-3 text-sm text-slate-500 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
            <p>
              {showAdvancedTools
                ? cliente.email.trim()
                  ? modeCopy.sendHint(cliente.email)
                  : modeCopy.emptyEmailHint
                : guestModeCopy.companyHint}
            </p>
            <Link
              href="/empresa"
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {showAdvancedTools ? "Perfil" : guestModeCopy.companyAction}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
