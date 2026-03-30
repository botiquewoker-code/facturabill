"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  ChartColumn,
  FileText,
  House,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  readClients,
  type ClientRecord,
} from "@/features/clients/storage";
import {
  readDrafts,
  writeActiveDraft,
} from "@/features/drafts/storage";
import {
  readStoredHomeVisibility,
  type HomeVisibility,
  type HomeVisibilityKey,
  writeStoredHomeVisibility,
} from "@/features/home/preferences";
import type { AppLanguage } from "@/features/i18n/config";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";
import {
  getUserFirstName,
  readUserProfile,
  type UserProfile,
} from "@/features/account/profile";
import { readVerifactuRecords } from "@/features/verifactu/storage";
import type { VerifactuRecord } from "@/features/verifactu/types";

type DraftItem = {
  id: string;
  tipo?: "factura" | "presupuesto";
  numero?: string;
  updatedAt?: string;
  cliente?: {
    nombre?: string;
    nif?: string;
    email?: string;
  };
};

type HistoryItem = {
  id?: string;
  numero?: string;
  tipo?: "factura" | "presupuesto";
  fecha?: string;
  fechaVencimiento?: string;
  total?: number;
  estado?: string;
  cliente?: {
    nombre?: string;
    nif?: string;
    email?: string;
  };
};

const HISTORY_KEY = "historial";
const CONVERT_KEY = "presupuestoConvertir";

type InsightCardId =
  | "billing"
  | "pending"
  | "alerts"
  | "clients"
  | "drafts"
  | "verifactu";

type InsightAction =
  | {
      type: "route";
      href: string;
    }
  | {
      type: "restore-draft";
      draft: DraftItem | null;
      fallbackHref: string;
    }
  | {
      type: "convert-budget";
      budget: HistoryItem | null;
      fallbackHref: string;
    };

type InsightMetric = {
  label: string;
  value: string;
};

type InsightHighlight = {
  title: string;
  subtitle: string;
};

type InsightCard = {
  id: InsightCardId;
  eyebrow: string;
  title: string;
  value: string;
  caption: string;
  description: string;
  actionLabel: string;
  href: string;
  icon: LucideIcon;
  accentClassName: string;
  metrics: InsightMetric[];
  highlights: InsightHighlight[];
  action: InsightAction;
};

const searchUi: Record<
  AppLanguage,
  {
    results: string;
    noResults: string;
    noResultsDescription: string;
    drafts: string;
    viewHistory: string;
    openClient: string;
    restoreDraft: string;
    invoice: string;
    budget: string;
    untitledClient: string;
    untitledDocument: string;
    untitledDraft: string;
  }
> = {
  es: {
    results: "Resultados",
    noResults: "No se ha encontrado nada",
    noResultsDescription:
      "Prueba con el nombre del cliente, el numero del documento o parte del email.",
    drafts: "Borradores",
    viewHistory: "Ver historial",
    openClient: "Abrir cliente",
    restoreDraft: "Restaurar",
    invoice: "Factura",
    budget: "Presupuesto",
    untitledClient: "Cliente sin nombre",
    untitledDocument: "Documento sin numero",
    untitledDraft: "Borrador sin numero",
  },
  en: {
    results: "Results",
    noResults: "Nothing found",
    noResultsDescription:
      "Try the client name, document number, or part of the email.",
    drafts: "Drafts",
    viewHistory: "View history",
    openClient: "Open client",
    restoreDraft: "Restore",
    invoice: "Invoice",
    budget: "Estimate",
    untitledClient: "Unnamed client",
    untitledDocument: "Untitled document",
    untitledDraft: "Untitled draft",
  },
  ar: {
    results: "النتائج",
    noResults: "لم يتم العثور على شيء",
    noResultsDescription: "جرّب اسم العميل أو رقم المستند أو جزءاً من البريد الإلكتروني.",
    drafts: "المسودات",
    viewHistory: "عرض السجل",
    openClient: "فتح العميل",
    restoreDraft: "استعادة",
    invoice: "فاتورة",
    budget: "عرض سعر",
    untitledClient: "عميل بدون اسم",
    untitledDocument: "مستند بدون رقم",
    untitledDraft: "مسودة بدون رقم",
  },
  fr: {
    results: "Resultats",
    noResults: "Aucun resultat",
    noResultsDescription:
      "Essayez le nom du client, le numero du document ou une partie de l'email.",
    drafts: "Brouillons",
    viewHistory: "Voir l'historique",
    openClient: "Ouvrir le client",
    restoreDraft: "Restaurer",
    invoice: "Facture",
    budget: "Devis",
    untitledClient: "Client sans nom",
    untitledDocument: "Document sans numero",
    untitledDraft: "Brouillon sans numero",
  },
  it: {
    results: "Risultati",
    noResults: "Nessun risultato",
    noResultsDescription:
      "Prova con il nome del cliente, il numero del documento o parte dell'email.",
    drafts: "Bozze",
    viewHistory: "Vedi storico",
    openClient: "Apri cliente",
    restoreDraft: "Ripristina",
    invoice: "Fattura",
    budget: "Preventivo",
    untitledClient: "Cliente senza nome",
    untitledDocument: "Documento senza numero",
    untitledDraft: "Bozza senza numero",
  },
  nl: {
    results: "Resultaten",
    noResults: "Niets gevonden",
    noResultsDescription:
      "Probeer de klantnaam, het documentnummer of een deel van het e-mailadres.",
    drafts: "Concepten",
    viewHistory: "Geschiedenis bekijken",
    openClient: "Klant openen",
    restoreDraft: "Herstellen",
    invoice: "Factuur",
    budget: "Offerte",
    untitledClient: "Naamloze klant",
    untitledDocument: "Document zonder nummer",
    untitledDraft: "Concept zonder nummer",
  },
  pt: {
    results: "Resultados",
    noResults: "Nada encontrado",
    noResultsDescription:
      "Experimente o nome do cliente, o numero do documento ou parte do email.",
    drafts: "Rascunhos",
    viewHistory: "Ver historico",
    openClient: "Abrir cliente",
    restoreDraft: "Restaurar",
    invoice: "Fatura",
    budget: "Orcamento",
    untitledClient: "Cliente sem nome",
    untitledDocument: "Documento sem numero",
    untitledDraft: "Rascunho sem numero",
  },
};

function safeReadArray<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesSearch(query: string, parts: Array<string | number | undefined>) {
  if (!query) {
    return false;
  }

  return normalizeSearchValue(parts.filter(Boolean).join(" ")).includes(query);
}

function parseStoredDate(value?: string): Date | null {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const localDateMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (localDateMatch) {
    const [, day, month, year] = localDateMatch;
    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      12,
      0,
      0,
    );

    if (
      parsed.getFullYear() === Number(year) &&
      parsed.getMonth() === Number(month) - 1 &&
      parsed.getDate() === Number(day)
    ) {
      return parsed;
    }
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatCurrency(value: number, language: AppLanguage) {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: "EUR",
  }).format(Number(value) || 0);
}

function formatShortDate(
  value: string | undefined,
  language: AppLanguage,
  fallback: string,
) {
  const parsed = parseStoredDate(value);

  if (!parsed) {
    return fallback;
  }

  return parsed.toLocaleDateString(language, {
    day: "2-digit",
    month: "short",
  });
}

function isPaidStatus(status?: string) {
  const normalized = normalizeSearchValue(status || "");

  return ["cobrad", "pagad", "paid", "settled"].some((token) =>
    normalized.includes(token),
  );
}

function findMatchingClient(
  clients: ClientRecord[],
  client?: {
    nombre?: string;
    nif?: string;
    email?: string;
  },
): ClientRecord | null {
  const nif = normalizeSearchValue(client?.nif || "");
  const email = normalizeSearchValue(client?.email || "");
  const name = normalizeSearchValue(client?.nombre || "");

  return (
    clients.find((item) => normalizeSearchValue(item.nif) === nif && nif) ||
    clients.find((item) => normalizeSearchValue(item.email) === email && email) ||
    clients.find((item) => normalizeSearchValue(item.nombre) === name && name) ||
    null
  );
}

type DashboardHomeClientProps = {
  initialHomeVisibility: HomeVisibility;
};

export default function DashboardHomeClient({
  initialHomeVisibility,
}: DashboardHomeClientProps) {
  const router = useRouter();
  const { language } = useAppLanguage();
  const copy = dashboardCopy[language];
  const labels = searchUi[language];
  const newInvoiceLabel = language === "es" ? "Crear factura" : "Create invoice";
  const newBudgetLabel =
    language === "es" ? "Nuevo presupuesto" : "New estimate";
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState<ClientRecord[]>([]);
  const [historial, setHistorial] = useState<HistoryItem[]>([]);
  const [borradores, setBorradores] = useState<DraftItem[]>([]);
  const [verifactuRecords, setVerifactuRecords] = useState<VerifactuRecord[]>(
    [],
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [homeVisibility, setHomeVisibility] = useState<HomeVisibility>(
    initialHomeVisibility,
  );
  const [draftHomeVisibility, setDraftHomeVisibility] =
    useState<HomeVisibility>(initialHomeVisibility);
  const [hasLoadedDashboardData, setHasLoadedDashboardData] = useState(false);
  const [selectedInsightId, setSelectedInsightId] =
    useState<InsightCardId | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const navItems = [
    { label: copy.nav.home, icon: House, active: true },
    { label: labels.budget, icon: ReceiptText, active: false, href: "/crear-factura?tipo=presupuesto" },
    { label: copy.nav.clients, icon: UsersRound, active: false, href: "/clientes" },
    { label: copy.nav.reports, icon: ChartColumn, active: false, href: "/informes" },
    { label: copy.nav.profile, icon: UserRound, active: false, href: "/ajustes" },
  ];
  const normalizedQuery = normalizeSearchValue(search);
  const filterUi =
    language === "es"
      ? {
          title: "Personaliza el inicio",
          description:
            "Oculta los bloques que no quieres ver en el home y pulsa Guardar. Se guardara solo en este dispositivo.",
          save: "Guardar",
          close: "Cerrar",
          search: {
            title: "Buscador",
            description: "Oculta la barra de busqueda del inicio.",
          },
          heroVisual: {
            title: "Ilustracion",
            description: "Oculta el bloque visual superior del panel.",
          },
          insights: {
            title: "Tarjetas de resumen",
            description: "Oculta las tarjetas deslizables con metricas.",
          },
          quickActions: {
            title: "Acciones rapidas",
            description: "Oculta los botones para crear factura y presupuesto.",
          },
        }
      : {
          title: "Customize home",
          description:
            "Hide the blocks you do not want on the home screen and press Save. This is saved only on this device.",
          save: "Save",
          close: "Close",
          search: {
            title: "Search",
            description: "Hide the search bar on the home screen.",
          },
          heroVisual: {
            title: "Illustration",
            description: "Hide the top visual block of the dashboard.",
          },
          insights: {
            title: "Summary cards",
            description: "Hide the horizontal cards with metrics.",
          },
          quickActions: {
            title: "Quick actions",
            description: "Hide the buttons for invoice and quote creation.",
          },
        };
  const hasHiddenSections = Object.values(homeVisibility).some(
    (value) => !value,
  );
  const filterSections: Array<{
    key: HomeVisibilityKey;
    title: string;
    description: string;
  }> = [
    {
      key: "search",
      title: filterUi.search.title,
      description: filterUi.search.description,
    },
    {
      key: "heroVisual",
      title: filterUi.heroVisual.title,
      description: filterUi.heroVisual.description,
    },
    {
      key: "insights",
      title: filterUi.insights.title,
      description: filterUi.insights.description,
    },
    {
      key: "quickActions",
      title: filterUi.quickActions.title,
      description: filterUi.quickActions.description,
    },
  ];
  const registrationUi =
    language === "es"
      ? {
          greeting: (name: string) => `Hola de nuevo, ${name}`,
          promptEyebrow: "Cuenta",
          promptTitle: "Completa tu registro",
          promptDescription:
            "Guarda tu nombre para personalizar el inicio y dejar lista tu cuenta desde este dispositivo.",
          promptAction: "Crear cuenta",
        }
      : {
          greeting: (name: string) => `Welcome back, ${name}`,
          promptEyebrow: "Account",
          promptTitle: "Complete your registration",
          promptDescription:
            "Save your name to personalize the home screen and finish setting up this device.",
          promptAction: "Create account",
        };

  useEffect(() => {
    const hydrateDashboardData = () => {
      const savedHomeVisibility = readStoredHomeVisibility();

      setClientes(readClients());
      setHistorial(safeReadArray<HistoryItem>(HISTORY_KEY));
      setBorradores(readDrafts<DraftItem>());
      setVerifactuRecords(readVerifactuRecords());
      setUserProfile(readUserProfile());
      setHomeVisibility(savedHomeVisibility);
      setDraftHomeVisibility(savedHomeVisibility);
      setHasLoadedDashboardData(true);
    };

    hydrateDashboardData();
    window.addEventListener("focus", hydrateDashboardData);

    return () => {
      window.removeEventListener("focus", hydrateDashboardData);
    };
  }, []);

  useEffect(() => {
    if (!selectedInsightId && !isFilterSheetOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (selectedInsightId) {
        setSelectedInsightId(null);
        return;
      }

      setDraftHomeVisibility(homeVisibility);
      setIsFilterSheetOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [homeVisibility, isFilterSheetOpen, selectedInsightId]);

  const clientResults = useMemo(
    () =>
      normalizedQuery
        ? clientes
            .filter((cliente) =>
              matchesSearch(normalizedQuery, [
                cliente.nombre,
                cliente.nif,
                cliente.email,
                cliente.telefono,
              ]),
            )
            .slice(0, 4)
        : [],
    [clientes, normalizedQuery],
  );

  const historyResults = useMemo(
    () =>
      normalizedQuery
        ? historial
            .filter((item) =>
              matchesSearch(normalizedQuery, [
                item.numero,
                item.id,
                item.tipo,
                item.estado,
                item.fecha,
                item.cliente?.nombre,
                item.cliente?.nif,
                item.cliente?.email,
              ]),
            )
            .slice(0, 4)
        : [],
    [historial, normalizedQuery],
  );

  const draftResults = useMemo(
    () =>
      normalizedQuery
        ? borradores
            .filter((item) =>
              matchesSearch(normalizedQuery, [
                item.numero,
                item.id,
                item.tipo,
                item.updatedAt,
                item.cliente?.nombre,
                item.cliente?.nif,
                item.cliente?.email,
              ]),
            )
            .slice(0, 4)
        : [],
    [borradores, normalizedQuery],
  );

  const noDateLabel = language === "es" ? "Sin fecha" : "No date";
  const noClientLabel = language === "es" ? "Sin cliente" : "No client";
  const noDocumentsLabel =
    language === "es" ? "Sin documentos" : "No documents";
  const noDraftsLabel = language === "es" ? "Sin borradores" : "No drafts";

  const insightCards = useMemo<InsightCard[]>(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const monthLabel = now.toLocaleDateString(language, { month: "long" });
    const padCount = (value: number) => String(value).padStart(2, "0");
    const invoices = historial.filter((item) => item.tipo !== "presupuesto");
    const budgets = historial.filter((item) => item.tipo === "presupuesto");
    const budgetDrafts = borradores.filter(
      (item) => item.tipo === "presupuesto",
    ).length;
    const invoicesThisMonth = invoices.filter((item) => {
      const parsed = parseStoredDate(item.fecha);

      if (!parsed) {
        return false;
      }

      return (
        parsed.getMonth() === now.getMonth() &&
        parsed.getFullYear() === now.getFullYear()
      );
    });
    const totalThisMonth = invoicesThisMonth.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0,
    );
    const averageTicketThisMonth = invoicesThisMonth.length
      ? totalThisMonth / invoicesThisMonth.length
      : 0;
    const billedClients = new Set(
      invoices
        .map((item) =>
          normalizeSearchValue(
            item.cliente?.nif || item.cliente?.email || item.cliente?.nombre || "",
          ),
        )
        .filter(Boolean),
    ).size;
    const pendingInvoices = invoices.filter((item) => !isPaidStatus(item.estado));
    const pendingTotal = pendingInvoices.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0,
    );
    const pendingSorted = [...pendingInvoices].sort((a, b) => {
      const aTime =
        parseStoredDate(a.fechaVencimiento)?.getTime() ?? Number.POSITIVE_INFINITY;
      const bTime =
        parseStoredDate(b.fechaVencimiento)?.getTime() ?? Number.POSITIVE_INFINITY;

      return aTime - bTime;
    });
    const nextDueInvoice = pendingSorted.find((item) =>
      Boolean(parseStoredDate(item.fechaVencimiento)),
    );
    const overdueInvoices = pendingInvoices.filter((item) => {
      const dueDate = parseStoredDate(item.fechaVencimiento);
      return dueDate ? dueDate < startOfToday : false;
    });
    const overdueTotal = overdueInvoices.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0,
    );
    const oldestBudget = [...budgets].sort((a, b) => {
      const aTime = parseStoredDate(a.fecha)?.getTime() ?? Number.POSITIVE_INFINITY;
      const bTime = parseStoredDate(b.fecha)?.getTime() ?? Number.POSITIVE_INFINITY;

      return aTime - bTime;
    })[0];
    const sortedClients = [...clientes].sort((a, b) => {
      const aTime = parseStoredDate(a.updatedAt)?.getTime() ?? 0;
      const bTime = parseStoredDate(b.updatedAt)?.getTime() ?? 0;

      return bTime - aTime;
    });
    const latestClient = sortedClients[0];
    const incompleteClients = clientes.filter(
      (client) => !client.nombre || !client.nif || !client.email,
    );
    const latestInvoice = invoices[0];
    const latestDraft = borradores[0];
    const latestVerifactuRecord = verifactuRecords[0];
    const preparedVerifactuRecords = verifactuRecords.filter(
      (record) => record.status === "prepared",
    );
    const queuedVerifactuRecords = verifactuRecords.filter((record) =>
      ["queued", "sent"].includes(record.status),
    );
    const verifactuErrorCount = verifactuRecords.filter(
      (record) => record.status === "error" || Boolean(record.lastError),
    ).length;
    const nextPendingClient = findMatchingClient(
      clientes,
      nextDueInvoice?.cliente || pendingInvoices[0]?.cliente,
    );
    const buildHistoryHighlight = (item: HistoryItem): InsightHighlight => ({
      title: item.numero || item.id || labels.untitledDocument,
      subtitle: [
        item.tipo === "presupuesto" ? labels.budget : labels.invoice,
        item.cliente?.nombre || noClientLabel,
        item.total ? formatCurrency(Number(item.total), language) : "",
        formatShortDate(item.fecha, language, noDateLabel),
      ]
        .filter(Boolean)
        .join(" / "),
    });
    const buildDraftHighlight = (item: DraftItem): InsightHighlight => ({
      title: item.numero || item.id || labels.untitledDraft,
      subtitle: [
        item.tipo === "presupuesto" ? labels.budget : labels.invoice,
        item.cliente?.nombre || noClientLabel,
        formatShortDate(item.updatedAt, language, noDateLabel),
      ]
        .filter(Boolean)
        .join(" / "),
    });
    const buildClientHighlight = (item: ClientRecord): InsightHighlight => ({
      title: item.nombre || labels.untitledClient,
      subtitle: [
        item.nif || "",
        item.email || "",
        formatShortDate(item.updatedAt, language, noDateLabel),
      ]
        .filter(Boolean)
        .join(" / "),
    });
    const buildVerifactuHighlight = (item: VerifactuRecord): InsightHighlight => ({
      title: item.invoiceNumber || noDocumentsLabel,
      subtitle: [
        item.status === "prepared"
          ? language === "es"
            ? "Preparado"
            : "Prepared"
          : item.status === "error"
            ? language === "es"
              ? "Incidencia"
              : "Issue"
            : item.status === "accepted"
              ? language === "es"
                ? "Aceptado"
                : "Accepted"
              : item.status === "queued"
                ? language === "es"
                  ? "En cola"
                  : "Queued"
                : item.status === "sent"
                  ? language === "es"
                    ? "Enviado"
                    : "Sent"
                  : language === "es"
                    ? "Rechazado"
                    : "Rejected",
        formatCurrency(item.totalAmount, language),
        formatShortDate(item.generatedAt, language, noDateLabel),
      ]
        .filter(Boolean)
        .join(" / "),
    });

    const cards: InsightCard[] = [
      {
        id: "billing",
        eyebrow: language === "es" ? "Mes actual" : "Current month",
        title: language === "es" ? "Facturado" : "Billed",
        value: formatCurrency(totalThisMonth, language),
        caption:
          invoicesThisMonth.length > 0
            ? language === "es"
              ? `${padCount(invoicesThisMonth.length)} facturas en ${monthLabel}`
              : `${padCount(invoicesThisMonth.length)} invoices in ${monthLabel}`
            : language === "es"
              ? `Sin facturas en ${monthLabel}`
              : `No invoices in ${monthLabel}`,
        description:
          language === "es"
            ? "Vista rapida del volumen emitido este mes y de tu ritmo medio por factura."
            : "Quick view of this month's output and your average ticket.",
        actionLabel: language === "es" ? "Abrir informes" : "Open reports",
        href: "/informes",
        icon: ChartColumn,
        accentClassName: "bg-slate-950 text-white",
        action: {
          type: "route",
          href: "/informes",
        },
        metrics: [
          {
            label: language === "es" ? "Facturas emitidas" : "Invoices issued",
            value: padCount(invoicesThisMonth.length),
          },
          {
            label: language === "es" ? "Ticket medio" : "Average ticket",
            value: formatCurrency(averageTicketThisMonth, language),
          },
          {
            label: language === "es" ? "Clientes facturados" : "Billed clients",
            value: padCount(billedClients),
          },
          {
            label: language === "es" ? "Ultima factura" : "Latest invoice",
            value:
              latestInvoice?.numero ||
              latestInvoice?.id ||
              noDocumentsLabel,
          },
        ],
        highlights: invoicesThisMonth.slice(0, 4).map(buildHistoryHighlight),
      },
      {
        id: "pending",
        eyebrow: language === "es" ? "Cobro" : "Collections",
        title: language === "es" ? "Pendiente" : "Outstanding",
        value: formatCurrency(pendingTotal, language),
        caption:
          pendingInvoices.length > 0
            ? language === "es"
              ? `${padCount(pendingInvoices.length)} facturas por cobrar`
              : `${padCount(pendingInvoices.length)} invoices awaiting payment`
            : language === "es"
              ? "Sin cobros pendientes"
              : "No outstanding invoices",
        description:
          language === "es"
            ? "Importe pendiente de facturas aun no marcadas como cobradas."
            : "Outstanding amount for invoices not yet marked as paid.",
        actionLabel:
          nextPendingClient && language === "es"
            ? "Abrir cliente"
            : nextPendingClient
              ? "Open client"
              : labels.viewHistory,
        href: nextPendingClient
          ? `/clientes/${nextPendingClient.id}`
          : "/historial",
        icon: ReceiptText,
        accentClassName: "bg-[#8a5a33] text-white",
        action: {
          type: "route",
          href: nextPendingClient
            ? `/clientes/${nextPendingClient.id}`
            : "/historial",
        },
        metrics: [
          {
            label: language === "es" ? "Facturas pendientes" : "Open invoices",
            value: padCount(pendingInvoices.length),
          },
          {
            label: language === "es" ? "Importe total" : "Total amount",
            value: formatCurrency(pendingTotal, language),
          },
          {
            label: language === "es" ? "Proximo vencimiento" : "Next due date",
            value: nextDueInvoice
              ? formatShortDate(
                  nextDueInvoice.fechaVencimiento,
                  language,
                  noDateLabel,
                )
              : noDateLabel,
          },
          {
            label: language === "es" ? "Ultima pendiente" : "Latest open invoice",
            value:
              pendingInvoices[0]?.numero ||
              pendingInvoices[0]?.id ||
              noDocumentsLabel,
          },
        ],
        highlights: pendingSorted.slice(0, 4).map(buildHistoryHighlight),
      },
      {
        id: "alerts",
        eyebrow: language === "es" ? "Seguimiento" : "Follow-up",
        title: language === "es" ? "Presupuestos" : "Quotes",
        value: padCount(budgets.length),
        caption:
          budgets.length > 0
            ? language === "es"
              ? `${padCount(budgets.length)} presupuestos por convertir`
              : `${padCount(budgets.length)} quotes ready to convert`
            : overdueInvoices.length > 0
              ? language === "es"
                ? `${formatCurrency(overdueTotal, language)} fuera de plazo`
                : `${formatCurrency(overdueTotal, language)} overdue`
              : language === "es"
                ? "Todo al dia"
                : "All clear",
        description:
          language === "es"
            ? "Seguimiento de presupuestos abiertos y documentos que conviene mover al siguiente paso."
            : "Track open quotes and documents that should move to the next step.",
        actionLabel:
          oldestBudget
            ? language === "es"
              ? "Convertir presupuesto"
              : "Convert quote"
            : overdueInvoices.length > 0
              ? language === "es"
                ? "Revisar vencidas"
                : "Review overdue"
              : language === "es"
                ? "Crear presupuesto"
                : "Create quote",
        href: oldestBudget
          ? "/crear-factura"
          : overdueInvoices.length > 0
            ? "/historial"
            : "/crear-factura?tipo=presupuesto",
        icon: Bell,
        accentClassName: "bg-rose-100 text-rose-700",
        action: oldestBudget
          ? {
              type: "convert-budget",
              budget: oldestBudget,
              fallbackHref: "/crear-factura?tipo=presupuesto",
            }
          : {
              type: "route",
              href:
                overdueInvoices.length > 0
                  ? "/historial"
                  : "/crear-factura?tipo=presupuesto",
            },
        metrics: [
          {
            label: language === "es" ? "Facturas vencidas" : "Overdue invoices",
            value: padCount(overdueInvoices.length),
          },
          {
            label: language === "es" ? "Importe vencido" : "Overdue amount",
            value: formatCurrency(overdueTotal, language),
          },
          {
            label: language === "es" ? "Presupuestos abiertos" : "Open quotes",
            value: padCount(budgets.length),
          },
          {
            label: language === "es" ? "Mas antiguo" : "Oldest open quote",
            value: oldestBudget?.numero || oldestBudget?.id || noDocumentsLabel,
          },
        ],
        highlights:
          overdueInvoices.length > 0
            ? overdueInvoices.slice(0, 4).map(buildHistoryHighlight)
            : budgets.slice(0, 4).map(buildHistoryHighlight),
      },
      {
        id: "clients",
        eyebrow: language === "es" ? "Clientes" : "Clients",
        title: language === "es" ? "Base clientes" : "Client base",
        value: padCount(clientes.length),
        caption:
          clientes.length > 0
            ? language === "es"
              ? `${padCount(incompleteClients.length)} fichas por completar`
              : `${padCount(incompleteClients.length)} profiles need completion`
            : language === "es"
              ? "Sin clientes guardados"
              : "No saved clients",
        description:
          language === "es"
            ? "Fichas disponibles para facturar rapido y detectar datos de contacto incompletos."
            : "Saved client records ready for invoicing, with incomplete contacts easy to spot.",
        actionLabel:
          latestClient && language === "es"
            ? "Abrir cliente"
            : latestClient
              ? "Open client"
              : language === "es"
                ? "Ir a clientes"
                : "Go to clients",
        href: latestClient ? `/clientes/${latestClient.id}` : "/clientes",
        icon: UsersRound,
        accentClassName: "bg-sky-100 text-sky-700",
        action: {
          type: "route",
          href: latestClient ? `/clientes/${latestClient.id}` : "/clientes",
        },
        metrics: [
          {
            label: language === "es" ? "Clientes guardados" : "Saved clients",
            value: padCount(clientes.length),
          },
          {
            label:
              language === "es" ? "Fichas incompletas" : "Incomplete profiles",
            value: padCount(incompleteClients.length),
          },
          {
            label: language === "es" ? "Con email" : "With email",
            value: padCount(clientes.filter((item) => Boolean(item.email)).length),
          },
          {
            label: language === "es" ? "Ultimo cliente" : "Latest client",
            value: latestClient?.nombre || labels.untitledClient,
          },
        ],
        highlights: sortedClients.slice(0, 4).map(buildClientHighlight),
      },
      {
        id: "drafts",
        eyebrow: labels.drafts,
        title: language === "es" ? "Por terminar" : "To finish",
        value: padCount(borradores.length),
        caption:
          borradores.length > 0
            ? language === "es"
              ? `Ultima edicion ${formatShortDate(
                  latestDraft?.updatedAt,
                  language,
                  noDateLabel,
                )}`
              : `Last edit ${formatShortDate(
                  latestDraft?.updatedAt,
                  language,
                  noDateLabel,
                )}`
            : noDraftsLabel,
        description:
          language === "es"
            ? "Documentos en curso listos para retomarlos sin volver a empezar."
            : "Work in progress documents ready to resume.",
        actionLabel:
          latestDraft
            ? language === "es"
              ? "Retomar borrador"
              : "Resume draft"
            : language === "es"
              ? "Crear documento"
              : "Create document",
        href: latestDraft ? "/crear-factura" : "/crear-factura",
        icon: FileText,
        accentClassName: "bg-amber-100 text-amber-700",
        action: {
          type: "restore-draft",
          draft: latestDraft || null,
          fallbackHref: "/crear-factura",
        },
        metrics: [
          {
            label: labels.drafts,
            value: padCount(borradores.length),
          },
          {
            label: language === "es" ? "Borradores presupuesto" : "Quote drafts",
            value: padCount(budgetDrafts),
          },
          {
            label: language === "es" ? "Ultimo borrador" : "Latest draft",
            value:
              latestDraft?.numero || latestDraft?.id || noDraftsLabel,
          },
          {
            label: language === "es" ? "Ultima edicion" : "Last edit",
            value: formatShortDate(latestDraft?.updatedAt, language, noDateLabel),
          },
        ],
        highlights: borradores.slice(0, 4).map(buildDraftHighlight),
      },
      {
        id: "verifactu",
        eyebrow: language === "es" ? "Cumplimiento" : "Compliance",
        title: "VERI*FACTU",
        value: padCount(verifactuRecords.length),
        caption:
          verifactuRecords.length > 0
            ? verifactuErrorCount > 0
              ? language === "es"
                ? `${padCount(verifactuErrorCount)} incidencias por revisar`
                : `${padCount(verifactuErrorCount)} issues to review`
              : language === "es"
                ? `${padCount(preparedVerifactuRecords.length)} registros preparados`
                : `${padCount(preparedVerifactuRecords.length)} records prepared`
            : language === "es"
              ? "Sin registros preparados todavia"
              : "No prepared records yet",
        description:
          language === "es"
            ? "Resumen local del estado VERI*FACTU antes de conectar la remision real y la base de datos."
            : "Local VERI*FACTU overview before connecting real remittance and database flows.",
        actionLabel:
          language === "es" ? "Abrir panel VeriFactu" : "Open VeriFactu panel",
        href: "/ajustes/verifactu",
        icon: ShieldCheck,
        accentClassName: "bg-emerald-100 text-emerald-700",
        action: {
          type: "route",
          href: "/ajustes/verifactu",
        },
        metrics: [
          {
            label: language === "es" ? "Registros locales" : "Local records",
            value: padCount(verifactuRecords.length),
          },
          {
            label: language === "es" ? "Preparados" : "Prepared",
            value: padCount(preparedVerifactuRecords.length),
          },
          {
            label: language === "es" ? "En cola" : "Queued",
            value: padCount(queuedVerifactuRecords.length),
          },
          {
            label: language === "es" ? "Ultima factura" : "Latest invoice",
            value:
              latestVerifactuRecord?.invoiceNumber ||
              latestVerifactuRecord?.sourceDocumentId ||
              noDocumentsLabel,
          },
        ],
        highlights: verifactuRecords.slice(0, 4).map(buildVerifactuHighlight),
      },
    ];

    return cards.map(
      (card): InsightCard => ({
        ...card,
        highlights:
          card.highlights.length > 0
            ? card.highlights
            : [
                {
                  title:
                    language === "es"
                      ? "Aun no hay datos"
                      : "No data yet",
                  subtitle:
                    language === "es"
                      ? "Empieza con una factura o un borrador para llenar esta tarjeta."
                      : "Start with an invoice or draft to populate this card.",
                },
              ],
      }),
    );
  }, [
    borradores,
    clientes,
    historial,
    labels.budget,
    labels.drafts,
    labels.invoice,
    labels.untitledClient,
    labels.untitledDocument,
    labels.untitledDraft,
    labels.viewHistory,
    language,
    noClientLabel,
    noDateLabel,
    noDocumentsLabel,
    noDraftsLabel,
    verifactuRecords,
  ]);

  const selectedInsight =
    insightCards.find((card) => card.id === selectedInsightId) ?? null;
  const SelectedInsightIcon = selectedInsight?.icon;

  function runInsightAction(action: InsightAction) {
    setSelectedInsightId(null);

    if (action.type === "restore-draft") {
      if (action.draft) {
        writeActiveDraft(action.draft);
      }

      router.push(action.fallbackHref);
      return;
    }

    if (action.type === "convert-budget") {
      if (action.budget) {
        window.localStorage.setItem(CONVERT_KEY, JSON.stringify(action.budget));
        router.push("/crear-factura");
        return;
      }

      router.push(action.fallbackHref);
      return;
    }

    router.push(action.href);
  }

  const totalResults =
    clientResults.length + historyResults.length + draftResults.length;
  const firstName = getUserFirstName(userProfile);
  const hasRegisteredUser = firstName.length > 0;
  const hasBusinessActivity =
    clientes.length > 0 ||
    historial.length > 0 ||
    borradores.length > 0 ||
    verifactuRecords.length > 0;
  const heroTitle =
    language === "es"
      ? hasBusinessActivity
        ? "Tu negocio en marcha"
        : copy.home.emptyTitle
      : hasBusinessActivity
        ? "Your business in motion"
        : copy.home.emptyTitle;
  const heroDescription =
    language === "es"
      ? hasBusinessActivity
        ? "Consulta la actividad y crea nuevos documentos desde un solo lugar."
        : copy.home.emptyDescription
      : hasBusinessActivity
        ? "Review activity and create documents from one place."
        : copy.home.emptyDescription;
  function openFirstResult() {
    if (clientResults[0]) {
      router.push(`/clientes/${clientResults[0].id}`);
      return;
    }

    if (historyResults[0]) {
      router.push("/historial");
      return;
    }

    if (draftResults[0]) {
      writeActiveDraft(draftResults[0]);
      router.push("/crear-factura");
    }
  }

  function openFilterSheet() {
    setDraftHomeVisibility(homeVisibility);
    setIsFilterSheetOpen(true);
  }

  function closeFilterSheet() {
    setDraftHomeVisibility(homeVisibility);
    setIsFilterSheetOpen(false);
  }

  function toggleHomeSection(section: HomeVisibilityKey) {
    setDraftHomeVisibility((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  function saveHomeVisibilityPreferences() {
    if (!draftHomeVisibility.search) {
      setSearch("");
    }

    setHomeVisibility(draftHomeVisibility);
    writeStoredHomeVisibility(draftHomeVisibility);

    setIsFilterSheetOpen(false);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(7.5rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            {hasLoadedDashboardData && hasRegisteredUser ? (
              <p className="text-sm font-medium tracking-[-0.02em] text-slate-500">
                {registrationUi.greeting(firstName)}
              </p>
            ) : null}
            <p className="mt-1 text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
              {copy.home.workspace}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              {copy.home.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl transition hover:bg-white"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </button>
            <button
              type="button"
              aria-label="Filters"
              onClick={openFilterSheet}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl transition hover:bg-white"
            >
              <SlidersHorizontal
                className="h-[18px] w-[18px]"
                strokeWidth={2.1}
              />
              {hasHiddenSections ? (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-slate-950" />
              ) : null}
            </button>
          </div>
        </header>

        {hasLoadedDashboardData && !hasRegisteredUser ? (
          <section className="mt-6 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.32)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  {registrationUi.promptEyebrow}
                </p>
                <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                  {registrationUi.promptTitle}
                </h2>
                <p className="mt-2 text-[14px] leading-6 text-slate-500">
                  {registrationUi.promptDescription}
                </p>
              </div>

              <Link
                href="/registro"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_32px_-22px_rgba(15,23,42,0.88)] transition hover:bg-slate-800"
              >
                {registrationUi.promptAction}
              </Link>
            </div>
          </section>
        ) : null}

        {homeVisibility.search ? (
          <div className="mt-6 rounded-[26px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.32)] backdrop-blur-xl">
            <label className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.8)]">
                <Search className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    openFirstResult();
                  }
                }}
                placeholder={copy.home.searchPlaceholder}
                autoComplete="off"
                className="h-11 w-full border-0 bg-transparent text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>
        ) : null}

        {normalizedQuery ? (
          <section className="flex-1 py-6">
            <div className="rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {labels.results}
                  </p>
                  <h2 className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                    {totalResults}
                  </h2>
                </div>
                {totalResults > 0 ? (
                  <button
                    type="button"
                    onClick={openFirstResult}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Enter
                  </button>
                ) : null}
              </div>

              {clientResults.length > 0 ? (
                <div className="mt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    {copy.nav.clients}
                  </p>
                  <div className="mt-3 space-y-2">
                    {clientResults.map((cliente) => (
                      <button
                        key={cliente.id}
                        type="button"
                        onClick={() => router.push(`/clientes/${cliente.id}`)}
                        className="flex w-full items-start justify-between gap-3 rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 text-left shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)] transition hover:border-slate-200 hover:bg-white"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {cliente.nombre || labels.untitledClient}
                          </p>
                          <p className="mt-1 text-[13px] leading-5 text-slate-500">
                            {[cliente.nif, cliente.email, cliente.telefono]
                              .filter((value) => value.trim())
                              .join(" · ") || cliente.direccion}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {labels.openClient}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {historyResults.length > 0 ? (
                <div className="mt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    {copy.nav.invoices}
                  </p>
                  <div className="mt-3 space-y-2">
                    {historyResults.map((item, index) => (
                      <button
                        key={`${item.numero || item.id || "history"}-${index}`}
                        type="button"
                        onClick={() => router.push("/historial")}
                        className="flex w-full items-start justify-between gap-3 rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 text-left shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)] transition hover:border-slate-200 hover:bg-white"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {item.numero || item.id || labels.untitledDocument}
                          </p>
                          <p className="mt-1 text-[13px] leading-5 text-slate-500">
                            {[
                              item.tipo === "presupuesto" ? labels.budget : labels.invoice,
                              item.cliente?.nombre,
                              item.estado,
                              item.fecha,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {labels.viewHistory}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {draftResults.length > 0 ? (
                <div className="mt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    {labels.drafts}
                  </p>
                  <div className="mt-3 space-y-2">
                    {draftResults.map((item, index) => (
                      <button
                        key={`${item.numero || item.id || "draft"}-${index}`}
                        type="button"
                        onClick={() => {
                          writeActiveDraft(item);
                          router.push("/crear-factura");
                        }}
                        className="flex w-full items-start justify-between gap-3 rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 text-left shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)] transition hover:border-slate-200 hover:bg-white"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {item.numero || item.id || labels.untitledDraft}
                          </p>
                          <p className="mt-1 text-[13px] leading-5 text-slate-500">
                            {[
                              item.tipo === "presupuesto" ? labels.budget : labels.invoice,
                              item.cliente?.nombre,
                              item.updatedAt
                                ? new Date(item.updatedAt).toLocaleDateString(language)
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {labels.restoreDraft}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {totalResults === 0 ? (
                <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-6 text-center">
                  <h3 className="text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950">
                    {labels.noResults}
                  </h3>
                  <p className="mt-3 text-[15px] leading-6 text-slate-500">
                    {labels.noResultsDescription}
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        ) : (
          <>
            <section className="mt-5 rounded-[36px] border border-white/70 bg-white/76 p-8 text-center shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              {homeVisibility.heroVisual ? (
                <div
                  aria-hidden="true"
                  className="relative mx-auto mb-8 h-44 w-44 select-none"
                >
                  <div className="absolute inset-0 rounded-full bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(229,238,250,0.92),rgba(249,234,216,0.95))] shadow-[0_28px_60px_-36px_rgba(15,23,42,0.38)]" />
                  <div className="absolute left-1/2 top-1/2 h-[106px] w-[88px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.35)]" />
                  <div className="absolute left-1/2 top-[52px] h-2 w-10 -translate-x-1/2 rounded-full bg-slate-200" />
                  <div className="absolute left-1/2 top-[68px] h-2 w-14 -translate-x-1/2 rounded-full bg-slate-200/90" />
                  <div className="absolute left-1/2 top-[84px] h-2 w-12 -translate-x-1/2 rounded-full bg-slate-100" />
                  <div className="absolute left-[18px] top-[46px] h-3 w-3 rounded-full bg-[#f2b07a]" />
                  <div className="absolute bottom-[22px] right-[20px] flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-16px_rgba(15,23,42,0.82)]">
                    <Plus className="h-[18px] w-[18px]" strokeWidth={2.4} />
                  </div>
                  <div className="absolute bottom-[28px] left-[18px] flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/90 text-amber-500 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.42)]">
                    <Sparkles className="h-[15px] w-[15px]" strokeWidth={2.2} />
                  </div>
                </div>
              ) : null}

              <div className="mx-auto max-w-sm">
                <h2 className="text-[1.85rem] font-semibold tracking-[-0.05em] text-slate-950">
                  {heroTitle}
                </h2>
                <p className="mt-3 text-[15px] leading-6 text-slate-500">
                  {heroDescription}
                </p>
              </div>

              {homeVisibility.insights && hasLoadedDashboardData ? (
                <>
                  <div className="mt-6 -mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-2 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {insightCards.map(
                      ({
                        id,
                        eyebrow,
                        title,
                        value,
                        caption,
                        icon: Icon,
                        accentClassName,
                      }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedInsightId(id)}
                          className="min-w-[196px] snap-start rounded-[28px] border border-white/80 bg-white/90 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.3)] transition hover:bg-white"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span
                              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accentClassName}`}
                            >
                              <Icon
                                className="h-[18px] w-[18px]"
                                strokeWidth={2.1}
                              />
                            </span>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                              {eyebrow}
                            </span>
                          </div>
                          <p className="mt-4 text-[1.4rem] font-semibold tracking-[-0.05em] text-slate-950">
                            {value}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {title}
                          </p>
                          <p className="mt-1 text-[13px] leading-5 text-slate-500">
                            {caption}
                          </p>
                        </button>
                      ),
                    )}
                  </div>

                  <p className="mt-3 text-center text-[12px] font-medium text-slate-400">
                    {language === "es"
                      ? "Toca una tarjeta para verla ampliada."
                      : "Tap a card to expand it."}
                  </p>
                </>
              ) : null}

              {homeVisibility.quickActions ? (
                <div className="mt-8 grid grid-cols-[1.35fr_1fr] gap-3">
                  <Link
                    href="/crear-factura"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[28px] bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_22px_38px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.2} />
                    {newInvoiceLabel}
                  </Link>
                  <Link
                    href="/crear-factura?tipo=presupuesto"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[28px] border border-slate-200 bg-white/82 px-5 text-sm font-semibold text-slate-700 shadow-[0_18px_35px_-28px_rgba(15,23,42,0.32)] transition hover:bg-white"
                  >
                    <ReceiptText className="h-4 w-4" strokeWidth={2.2} />
                    {newBudgetLabel}
                  </Link>
                </div>
              ) : null}
            </section>
          </>
        )}
      </main>

      <nav
        className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 px-4"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <div className="grid grid-cols-5 rounded-[30px] border border-white/10 bg-slate-950/95 px-2 py-3 text-white shadow-[0_24px_60px_-26px_rgba(15,23,42,0.78)] backdrop-blur-xl">
          {navItems.map(({ label, icon: Icon, active, href }) => {
            const className = `flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-center transition ${
              active
                ? "bg-white text-slate-950 shadow-[0_16px_30px_-24px_rgba(255,255,255,1)]"
                : "text-white/58 hover:text-white/78"
            }`;

            if (href) {
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={className}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                  <span className="text-[11px] font-medium tracking-[-0.01em]">
                    {label}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={label}
                type="button"
                aria-current={active ? "page" : undefined}
                className={className}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                <span className="text-[11px] font-medium tracking-[-0.01em]">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {selectedInsight ? (
        <>
          <button
            type="button"
            aria-label={language === "es" ? "Cerrar panel" : "Close panel"}
            onClick={() => setSelectedInsightId(null)}
            className="fixed inset-0 z-30 bg-slate-950/18 backdrop-blur-[2px]"
          />

          <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] px-4 pb-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-label={selectedInsight.title}
              className="rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,252,0.96))] p-5 shadow-[0_34px_80px_-38px_rgba(15,23,42,0.55)] backdrop-blur-xl"
            >
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-200" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selectedInsight.accentClassName}`}
                  >
                    {SelectedInsightIcon ? (
                      <SelectedInsightIcon
                        className="h-5 w-5"
                        strokeWidth={2.1}
                      />
                    ) : null}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                      {selectedInsight.eyebrow}
                    </p>
                    <h3 className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                      {selectedInsight.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {selectedInsight.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInsightId(null)}
                  aria-label={language === "es" ? "Cerrar" : "Close"}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700"
                >
                  <X className="h-4 w-4" strokeWidth={2.3} />
                </button>
              </div>

              <div className="mt-5 rounded-[28px] bg-slate-950 px-5 py-5 text-white shadow-[0_24px_48px_-30px_rgba(15,23,42,0.92)]">
                <p className="text-sm text-white/65">{selectedInsight.caption}</p>
                <p className="mt-2 text-[2rem] font-semibold tracking-[-0.05em]">
                  {selectedInsight.value}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {selectedInsight.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[24px] border border-white/70 bg-white/86 p-4 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.24)]"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-5 text-slate-950">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  {language === "es" ? "Detalle" : "Detail"}
                </p>
                <div className="mt-3 space-y-2">
                  {selectedInsight.highlights.map((item) => (
                    <div
                      key={`${selectedInsight.id}-${item.title}-${item.subtitle}`}
                      className="rounded-[22px] border border-white/70 bg-white/84 px-4 py-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.22)]"
                    >
                      <p className="text-sm font-semibold text-slate-950">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-5 text-slate-500">
                        {item.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => runInsightAction(selectedInsight.action)}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
              >
                {selectedInsight.actionLabel}
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </section>
          </div>
        </>
      ) : null}

      {isFilterSheetOpen ? (
        <>
          <button
            type="button"
            aria-label={filterUi.close}
            onClick={closeFilterSheet}
            className="fixed inset-0 z-30 bg-slate-950/18 backdrop-blur-[2px]"
          />

          <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] px-4 pb-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-label={filterUi.title}
              className="rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,252,0.96))] p-5 shadow-[0_34px_80px_-38px_rgba(15,23,42,0.55)] backdrop-blur-xl"
            >
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-200" />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    {language === "es" ? "Filtro del inicio" : "Home filter"}
                  </p>
                  <h3 className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                    {filterUi.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {filterUi.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeFilterSheet}
                  aria-label={filterUi.close}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700"
                >
                  <X className="h-4 w-4" strokeWidth={2.3} />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {filterSections.map((section) => {
                  const isVisible = draftHomeVisibility[section.key];

                  return (
                    <button
                      key={section.key}
                      type="button"
                      aria-pressed={isVisible}
                      onClick={() => toggleHomeSection(section.key)}
                      className="flex w-full items-center justify-between gap-4 rounded-[24px] border border-white/70 bg-white/86 px-4 py-4 text-left shadow-[0_16px_30px_-24px_rgba(15,23,42,0.24)] transition hover:bg-white"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-950">
                            {section.title}
                          </p>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {isVisible
                              ? "Visible"
                              : language === "es"
                                ? "Oculto"
                                : "Hidden"}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] leading-5 text-slate-500">
                          {section.description}
                        </p>
                      </div>

                      <span
                        className={`relative flex h-8 w-14 shrink-0 items-center rounded-full border transition ${
                          isVisible
                            ? "border-slate-950 bg-slate-950"
                            : "border-slate-200 bg-slate-100"
                        }`}
                      >
                        <span
                          className={`absolute h-6 w-6 rounded-full bg-white shadow-[0_10px_24px_-16px_rgba(15,23,42,0.5)] transition ${
                            isVisible ? "left-[1.4rem]" : "left-1"
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={saveHomeVisibilityPreferences}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
              >
                {filterUi.save}
              </button>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
