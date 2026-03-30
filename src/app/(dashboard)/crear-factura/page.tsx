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
  Sparkles,
  Trash2,
  UsersRound,
  Wallet,
} from "lucide-react";
import InvoicePDF from "@/features/invoices/components/InvoicePDF";
import PlantillaNueva from "@/features/invoices/components/PlantillaNueva";
import {
  findClientById,
  readClients,
  type ClientRecord,
} from "@/features/clients/storage";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";

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
  plantilla: "InvoicePDF" | "PlantillaNueva";
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

const DRAFTS_KEY = "borradores";
const ACTIVE_DRAFT_KEY = "borradorActivo";
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
const isPlantilla = (v: string): v is "InvoicePDF" | "PlantillaNueva" =>
  v === "InvoicePDF" || v === "PlantillaNueva";
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
  const [plantilla, setPlantilla] = useState<"InvoicePDF" | "PlantillaNueva">(
    "InvoicePDF",
  );
  const [linkedClientId, setLinkedClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const subtotal = conceptos.reduce((acc, item) => acc + item.cant * item.precio, 0);
  const iva = subtotal * (tipoIVA / 100);
  const total = subtotal + iva;
  const clientesFiltrados = useMemo(() => {
    const query = clientSearch.trim().toLowerCase();
    const base = query
      ? clientesGuardados.filter((item) => clientMatchesSearch(item, query))
      : clientesGuardados;

    return base.filter((item) => item.id !== linkedClientId).slice(0, 6);
  }, [clientSearch, clientesGuardados, linkedClientId]);
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
        emptyEmailHint: "Anade un email para enviarlo desde aqui.",
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
        emptyEmailHint: "Anade un email para enviarlo desde aqui.",
      };
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
      const params = new URLSearchParams(window.location.search);
      const storedClients = readClients();
      const routeClientId = params.get("clienteId") || "";

      setClientesGuardados(storedClients);

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

      const activeDraft = localStorage.getItem(ACTIVE_DRAFT_KEY);
      if (activeDraft) {
        try {
          const draft = JSON.parse(activeDraft) as Partial<DraftInvoice>;
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
          setTipoIVA(num(draft.tipoIVA, 21));
          const nextTemplate = s(draft.plantilla);
          if (isPlantilla(nextTemplate)) setPlantilla(nextTemplate);
        } catch {}
        localStorage.removeItem(ACTIVE_DRAFT_KEY);
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
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setUltimoNumeroGuardado(readLastSavedNumber(esPresupuesto));
  }, [esPresupuesto]);

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
        const saved = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]") as DraftInvoice[];
        const rest = saved.filter((item) => item.id !== draft.id);
        localStorage.setItem(DRAFTS_KEY, JSON.stringify([draft, ...rest]));
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
      const saved = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]") as DraftInvoice[];
      const rest = saved.filter((item) => item.id !== draft.id);
      localStorage.setItem(DRAFTS_KEY, JSON.stringify([draft, ...rest]));
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
      showWarningToast(`Recomendacion: ${recommendations.join(", ")}.`);
    }

    if (requireEmail && !cliente.email.trim()) {
      return (
        showWarningToast(
          "Advertencia: anade el email del cliente si quieres enviar el documento desde aqui.",
        ),
        false
      );
    }

    return true;
  };
  const updateHistory = (estado: string) => {
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
      const Component = plantilla === "InvoicePDF" ? InvoicePDF : PlantillaNueva;
      const blob = await pdf(<Component datos={pdfData} numeroFactura={numeroFacturaActual} conceptos={conceptos} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${esPresupuesto ? "Presupuesto" : "Factura"}_${numeroFacturaActual}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      updateHistory(esPresupuesto ? "Presupuesto descargado" : "Factura descargada");
      showSuccessToast("PDF descargado");
    } catch {
      showWarningToast("No se pudo generar el PDF");
    }
  };
  const enviar = async () => {
    if (!validate(true)) return;
    try {
      const Component = plantilla === "InvoicePDF" ? InvoicePDF : PlantillaNueva;
      const blob = await pdf(<Component datos={pdfData} numeroFactura={numeroFacturaActual} conceptos={conceptos} />).toBlob();
      const formData = new FormData();
      formData.append("file", blob, `${esPresupuesto ? "Presupuesto" : "Factura"}_${numeroFacturaActual}.pdf`);
      formData.append("to", cliente.email);
      formData.append("subject", `${esPresupuesto ? "Presupuesto" : "Factura"} ${numeroFacturaActual}`);
      formData.append("text", `Hola,\n\nAdjunto ${esPresupuesto ? "el presupuesto" : "la factura"} ${numeroFacturaActual}.\n\nGracias.\n${empresa.nombre || "Tu empresa"}`);
      const res = await fetch("/api/enviar-email", { method: "POST", body: formData });
      if (!res.ok) throw new Error("send failed");
      if (window.gtag) window.gtag("event", "conversion", { send_to: "AW-1791812185/PvpICL_mx_obENHy-BC", value: total, currency: "EUR" });
      updateHistory(esPresupuesto ? "Presupuesto enviado" : "Factura enviada");
      showSuccessToast("Documento enviado");
    } catch {
      showWarningToast("No se pudo enviar el documento");
    }
  };

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
          <button
            type="button"
            onClick={saveDraftNow}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)] transition hover:bg-slate-800"
          >
            <Save className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </button>
        </header>

        {esPresupuesto ? (
          <section className="mt-6 rounded-[28px] border border-[#ecd3ba] bg-[linear-gradient(180deg,rgba(255,248,240,0.98),rgba(255,255,255,0.94))] p-4 shadow-[0_24px_54px_-36px_rgba(185,122,69,0.34)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8a5a33] text-white shadow-[0_18px_28px_-18px_rgba(138,90,51,0.9)]">
                  <Sparkles className="h-4 w-4" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Presupuesto
                  </p>
                  <p className="text-[13px] text-slate-600">
                    Documento listo para revisar o enviar.
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-[#e6c4a0] bg-white px-3 py-1.5 text-xs font-semibold text-[#8a5a33]">
                {documentPrefix}-{numeroFacturaActual}
              </div>
            </div>
          </section>
        ) : null}

        <section className={`${esPresupuesto ? "mt-5" : "mt-6"} rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)] ${esPresupuesto ? "bg-[#8a5a33]" : "bg-slate-950"}`}>
                <Search className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                  Cliente
                </p>
                <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                  Buscar cliente existente
                </h2>
                <p className="mt-2 max-w-xs text-[14px] leading-6 text-slate-500">
                  {modeCopy.clientSearchDescription}
                </p>
              </div>
            </div>
            <Link
              href="/clientes"
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clientes
            </Link>
          </div>
          <div className="relative mt-6">
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
                  ? "Buscar por nombre, NIF, email o telefono"
                  : "No hay clientes guardados todavia"
              }
              disabled={!clientesGuardados.length}
              className={`${inputClass} pl-11`}
            />
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
          {!clientesGuardados.length ? (
            <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-500">
              No hay clientes guardados. Crea uno en la seccion de clientes y volvera a aparecer aqui.
            </div>
          ) : !linkedClientId ? (
            <div className="mt-4 space-y-2">
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
              {!clientesFiltrados.length && clientSearch.trim() ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-500">
                  No hay coincidencias para esa busqueda.
                </div>
              ) : null}
            </div>
          ) : null
          }
        </section>

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
              <span>IVA ({tipoIVA}%)</span>
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
          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={descargar}
              className={primaryActionClass}
            >
              <Download className="h-4 w-4" strokeWidth={2.2} />
              {modeCopy.downloadLabel}
            </button>
            <button
              type="button"
              onClick={enviar}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Send className="h-4 w-4" strokeWidth={2.2} />
              {modeCopy.sendLabel}
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] border border-white/70 bg-white/82 px-4 py-3 text-sm text-slate-500 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
            <p>
              {cliente.email.trim()
                ? modeCopy.sendHint(cliente.email)
                : modeCopy.emptyEmailHint}
            </p>
            <Link
              href="/empresa"
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Perfil
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
