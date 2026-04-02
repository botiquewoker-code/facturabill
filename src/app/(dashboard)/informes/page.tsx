"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartColumn,
} from "lucide-react";
import { getLanguageLocale } from "@/features/i18n/core";
import {
  type UserProfile,
  USER_PROFILE_STORAGE_KEY,
} from "@/features/account/profile";
import {
  type ClientRecord,
  CLIENTS_STORAGE_KEY,
} from "@/features/clients/storage";
import {
  DRAFTS_STORAGE_KEY,
  DRAFTS_UPDATED_EVENT,
  readDrafts,
} from "@/features/drafts/storage";
import type { InvoiceDocumentType } from "@/features/invoices/document-types";
import { useAppI18n } from "@/features/i18n/runtime";
import {
  readVerifactuRecords,
  VERIFACTU_RECORDS_STORAGE_KEY,
} from "@/features/verifactu/storage";
import type { VerifactuRecord } from "@/features/verifactu/types";
import {
  type CompanyProfile,
  COMPANY_WORKSPACE_STORAGE_KEY,
} from "@/features/storage/company";
import {
  activeClientRepository,
  activeCompanyRepository,
  activeHistoryRepository,
  activeUserRepository,
} from "@/features/repositories";
import { getStorageEventName } from "@/features/storage/local";
import { HISTORY_STORAGE_KEY } from "@/features/storage/history";
import { useClientLayoutEffect } from "@/features/ui/useClientLayoutEffect";

type HistoryDocument = {
  id?: string;
  numero?: string;
  tipo?: InvoiceDocumentType;
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

type DraftItem = {
  id?: string;
  numero?: string;
  tipo?: InvoiceDocumentType;
  updatedAt?: string;
};

type ReportsSnapshot = {
  historial: HistoryDocument[];
  clientes: ClientRecord[];
  borradores: DraftItem[];
  verifactuRecords: VerifactuRecord[];
  company: CompanyProfile;
  userProfile: UserProfile | null;
};

type RevenuePoint = {
  key: string;
  mes: string;
  total: number;
};

type DistributionPoint = {
  name: string;
  value: number;
  color: string;
};

type HealthMetric = {
  label: string;
  value: number;
  caption: string;
  color: string;
};

type TopClient = {
  key: string;
  name: string;
  total: number;
  invoices: number;
  lastDate: string;
};

type AlertMetric = {
  label: string;
  value: string;
  detail: string;
  toneClassName: string;
};

const EMPTY_COMPANY: CompanyProfile = {
  nombre: "",
  nif: "",
  direccion: "",
  ciudad: "",
  cp: "",
  telefono: "",
  email: "",
};
const SECTION_CLASS =
  "rounded-[30px] border border-white/70 bg-white/76 p-5 shadow-[0_26px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur-xl";
const CHART_TOOLTIP_STYLE = {
  borderRadius: 18,
  border: "1px solid rgba(226,232,240,0.9)",
  backgroundColor: "rgba(255,255,255,0.95)",
  boxShadow: "0 18px 40px -26px rgba(15,23,42,0.35)",
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value) || 0;
}

function readCompanyProfile(): CompanyProfile {
  return activeCompanyRepository.readWorkspace().company || EMPTY_COMPANY;
}

function readReportsSnapshot(): ReportsSnapshot {
  return {
    historial: activeHistoryRepository.readDocuments<HistoryDocument>(),
    clientes: activeClientRepository.readAll(),
    borradores: readDrafts<DraftItem>(),
    verifactuRecords: readVerifactuRecords(),
    company: readCompanyProfile(),
    userProfile: activeUserRepository.readProfile(),
  };
}

function parseStoredDate(value?: string) {
  const trimmed = normalizeString(value);
  if (!trimmed) return null;

  const localDateMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (localDateMatch) {
    const [, day, month, year] = localDateMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day), 12);

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

function money(value: number, locale = "es-ES") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(Number(value) || 0);
}

function moneyCompact(value: number, locale = "es-ES", isSpanish = true) {
  const amount = Number(value) || 0;
  const absolute = Math.abs(amount);

  if (absolute >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString(locale, {
      maximumFractionDigits: 1,
    })} ${isSpanish ? "M EUR" : "M EUR"}`;
  }

  if (absolute >= 1_000) {
    return `${(amount / 1_000).toLocaleString(locale, {
      maximumFractionDigits: 1,
    })} ${isSpanish ? "k EUR" : "k EUR"}`;
  }

  return `${Math.round(amount).toLocaleString(locale)} EUR`;
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function formatDate(value?: string, locale = "es-ES", fallback = "Sin fecha") {
  const parsed = parseStoredDate(value);
  if (!parsed) return fallback;

  return parsed.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(
  value?: string,
  locale = "es-ES",
  fallback = "Sin fecha",
) {
  const parsed = parseStoredDate(value);
  if (!parsed) return fallback;

  return parsed.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
  });
}

function isPaidStatus(status?: string) {
  const normalized = normalizeString(status).toLowerCase();
  return ["cobrad", "pagad", "paid", "settled"].some((token) =>
    normalized.includes(token),
  );
}

function capitalizeMonthLabel(value: string) {
  const normalized = value.replace(".", "");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getClientKey(client?: {
  nombre?: string;
  nif?: string;
  email?: string;
}) {
  const nif = normalizeString(client?.nif).toLowerCase();
  const email = normalizeString(client?.email).toLowerCase();
  const name = normalizeString(client?.nombre).toLowerCase();
  return nif || email || name || "";
}

function buildRevenueTrend(invoices: HistoryDocument[], now: Date, locale: string) {
  const points: RevenuePoint[] = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: getMonthKey(date),
      mes: capitalizeMonthLabel(
        date.toLocaleDateString(locale, { month: "short" }),
      ),
      total: 0,
    };
  });

  invoices.forEach((invoice) => {
    const parsed = parseStoredDate(invoice.fecha);
    if (!parsed) return;
    const point = points.find((item) => item.key === getMonthKey(parsed));
    if (point) point.total += normalizeNumber(invoice.total);
  });

  return points;
}

function ChartPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-slate-100/85 text-sm font-medium text-slate-500">
      {label}
    </div>
  );
}

export default function InformesPage() {
  const { language } = useAppI18n();
  const isSpanish = language === "es";
  const locale = getLanguageLocale(language);
  const [snapshot, setSnapshot] = useState<ReportsSnapshot>(() =>
    readReportsSnapshot(),
  );
  const [chartsReady, setChartsReady] = useState(false);

  useClientLayoutEffect(() => {
    const refreshSnapshot = () => setSnapshot(readReportsSnapshot());
    const events = [
      DRAFTS_UPDATED_EVENT,
      getStorageEventName(HISTORY_STORAGE_KEY),
      getStorageEventName(CLIENTS_STORAGE_KEY),
      getStorageEventName(DRAFTS_STORAGE_KEY),
      getStorageEventName(VERIFACTU_RECORDS_STORAGE_KEY),
      getStorageEventName(USER_PROFILE_STORAGE_KEY),
      getStorageEventName(COMPANY_WORKSPACE_STORAGE_KEY),
    ];

    setChartsReady(true);
    events.forEach((eventName) =>
      window.addEventListener(eventName, refreshSnapshot),
    );

    return () => {
      events.forEach((eventName) =>
        window.removeEventListener(eventName, refreshSnapshot),
      );
    };
  }, []);

  const summary = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const ninetyDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 90,
    );
    const invoices = snapshot.historial.filter((item) => item.tipo === "factura");
    const budgets = snapshot.historial.filter(
      (item) => item.tipo === "presupuesto",
    );
    const proformas = snapshot.historial.filter(
      (item) => item.tipo === "proforma",
    );
    const deliveryNotes = snapshot.historial.filter(
      (item) => item.tipo === "albaran",
    );
    const paidInvoices = invoices.filter((item) => isPaidStatus(item.estado));
    const pendingInvoices = invoices.filter((item) => !isPaidStatus(item.estado));
    const overdueInvoices = pendingInvoices.filter((item) => {
      const dueDate = parseStoredDate(item.fechaVencimiento);
      return dueDate ? dueDate < startOfToday : false;
    });
    const totalFacturado = invoices.reduce(
      (sum, item) => sum + normalizeNumber(item.total),
      0,
    );
    const monthInvoices = invoices.filter((item) => {
      const parsed = parseStoredDate(item.fecha);

      return Boolean(
        parsed &&
          parsed.getMonth() === now.getMonth() &&
          parsed.getFullYear() === now.getFullYear(),
      );
    });
    const monthDocuments = snapshot.historial.filter((item) => {
      const parsed = parseStoredDate(item.fecha);

      return Boolean(
        parsed &&
          parsed.getMonth() === now.getMonth() &&
          parsed.getFullYear() === now.getFullYear(),
      );
    });
    const facturadoMesActual = monthInvoices.reduce(
      (sum, item) => sum + normalizeNumber(item.total),
      0,
    );
    const pendingTotal = pendingInvoices.reduce(
      (sum, item) => sum + normalizeNumber(item.total),
      0,
    );
    const overdueTotal = overdueInvoices.reduce(
      (sum, item) => sum + normalizeNumber(item.total),
      0,
    );
    const revenueTrend = buildRevenueTrend(invoices, now, locale);
    const bestMonth = [...revenueTrend].sort((left, right) => right.total - left.total)[0];
    const currentPoint = revenueTrend[revenueTrend.length - 1];
    const previousPoint = revenueTrend[revenueTrend.length - 2];
    const revenueGrowth =
      previousPoint && previousPoint.total > 0
        ? ((currentPoint.total - previousPoint.total) / previousPoint.total) * 100
        : null;
    const averageMonthlyRevenue =
      revenueTrend.reduce((sum, item) => sum + item.total, 0) /
      Math.max(revenueTrend.length, 1);

    const documentMixRaw: DistributionPoint[] = [
      {
        name: isSpanish ? "Facturas" : "Invoices",
        value: invoices.length,
        color: "#0f172a",
      },
      {
        name: isSpanish ? "Presupuestos" : "Quotes",
        value: budgets.length,
        color: "#b97a45",
      },
      { name: "Proformas", value: proformas.length, color: "#1d4d7f" },
      {
        name: isSpanish ? "Albaranes" : "Delivery notes",
        value: deliveryNotes.length,
        color: "#0f766e",
      },
    ];
    const totalDocuments = documentMixRaw.reduce(
      (sum, item) => sum + item.value,
      0,
    );
    const documentMixChartData =
      totalDocuments > 0
        ? documentMixRaw.filter((item) => item.value > 0)
        : [
            {
              name: isSpanish ? "Sin actividad" : "No activity",
              value: 1,
              color: "#cbd5e1",
            },
          ];
    const documentPipeline = [
      {
        label: isSpanish ? "Facturas" : "Invoices",
        total: invoices.length,
        color: "#0f172a",
      },
      {
        label: isSpanish ? "Presupuestos" : "Quotes",
        total: budgets.length,
        color: "#b97a45",
      },
      { label: "Proformas", total: proformas.length, color: "#1d4d7f" },
      {
        label: isSpanish ? "Albaranes" : "Delivery notes",
        total: deliveryNotes.length,
        color: "#0f766e",
      },
      {
        label: isSpanish ? "Borradores" : "Drafts",
        total: snapshot.borradores.length,
        color: "#475569",
      },
    ];

    const billedClients = new Map<string, TopClient>();
    const activeClientKeys = new Set<string>();

    invoices.forEach((invoice) => {
      const key = getClientKey(invoice.cliente);
      const parsedDate = parseStoredDate(invoice.fecha);

      if (!key) {
        return;
      }

      const current = billedClients.get(key);
      const total = normalizeNumber(invoice.total);

      billedClients.set(key, {
        key,
        name:
          normalizeString(invoice.cliente?.nombre) ||
          (isSpanish ? "Cliente sin nombre" : "Unnamed client"),
        total: (current?.total || 0) + total,
        invoices: (current?.invoices || 0) + 1,
        lastDate:
          parsedDate &&
          (!current?.lastDate ||
            parsedDate.getTime() >
              (parseStoredDate(current.lastDate)?.getTime() || 0))
            ? parsedDate.toISOString()
            : current?.lastDate || "",
      });

      if (parsedDate && parsedDate >= ninetyDaysAgo) {
        activeClientKeys.add(key);
      }
    });

    const topClients = [...billedClients.values()]
      .sort((left, right) => right.total - left.total)
      .slice(0, 3);
    const completeClients = snapshot.clientes.filter(
      (client) => client.nombre && client.nif && client.email && client.telefono,
    );
    const incompleteClients = snapshot.clientes.filter(
      (client) => !client.nombre || !client.nif || !client.email,
    );
    const clientsWithEmail = snapshot.clientes.filter((client) =>
      Boolean(client.email),
    ).length;
    const companyFields = [
      snapshot.company.nombre,
      snapshot.company.nif,
      snapshot.company.direccion,
      snapshot.company.ciudad,
      snapshot.company.cp,
      snapshot.company.telefono,
      snapshot.company.email,
    ];
    const companyCompletion =
      (companyFields.filter(Boolean).length / companyFields.length) * 100;
    const clientCoverage = snapshot.clientes.length
      ? (billedClients.size / snapshot.clientes.length) * 100
      : 0;
    const collectionRate = invoices.length
      ? (paidInvoices.length / invoices.length) * 100
      : 0;
    const verifactuErrors = snapshot.verifactuRecords.filter(
      (record) => record.status === "error" || Boolean(record.lastError),
    );
    const verifactuPrepared = snapshot.verifactuRecords.filter(
      (record) => record.status === "prepared",
    );
    const verifactuInFlight = snapshot.verifactuRecords.filter((record) =>
      ["queued", "sent"].includes(record.status),
    );
    const verifactuAccepted = snapshot.verifactuRecords.filter(
      (record) => record.status === "accepted",
    );
    const verifactuHealth = snapshot.verifactuRecords.length
      ? ((snapshot.verifactuRecords.length - verifactuErrors.length) /
          snapshot.verifactuRecords.length) *
        100
      : 0;
    const healthMetrics: HealthMetric[] = [
      {
        label: isSpanish ? "Perfil empresa" : "Company profile",
        value: companyCompletion,
        caption: isSpanish
          ? `${companyFields.filter(Boolean).length}/7 campos operativos completos`
          : `${companyFields.filter(Boolean).length}/7 operational fields completed`,
        color: "#0f172a",
      },
      {
        label: isSpanish ? "Cobertura clientes" : "Client coverage",
        value: clientCoverage,
        caption:
          snapshot.clientes.length > 0
            ? isSpanish
              ? `${billedClients.size}/${snapshot.clientes.length} clientes ya han facturado`
              : `${billedClients.size}/${snapshot.clientes.length} clients have already been billed`
            : isSpanish
              ? "Aun no hay clientes dados de alta"
              : "There are no registered clients yet",
        color: "#1d4d7f",
      },
      {
        label: isSpanish ? "Cobro registrado" : "Recorded collection",
        value: collectionRate,
        caption:
          invoices.length > 0
            ? isSpanish
              ? `${paidInvoices.length}/${invoices.length} facturas marcadas como cobradas`
              : `${paidInvoices.length}/${invoices.length} invoices marked as paid`
            : isSpanish
              ? "Todavia no hay facturas emitidas"
              : "There are no issued invoices yet",
        color: "#b97a45",
      },
      {
        label: "VeriFactu",
        value: verifactuHealth,
        caption:
          snapshot.verifactuRecords.length > 0
            ? isSpanish
              ? `${snapshot.verifactuRecords.length - verifactuErrors.length}/${snapshot.verifactuRecords.length} registros sin incidencias`
              : `${snapshot.verifactuRecords.length - verifactuErrors.length}/${snapshot.verifactuRecords.length} records without incidents`
            : isSpanish
              ? "Sin registros de seguimiento por ahora"
              : "No tracking records yet",
        color: "#0f766e",
      },
    ];
    const alerts: AlertMetric[] = [
      {
        label: isSpanish ? "Pendiente de cobro" : "Outstanding",
        value: money(pendingTotal, locale),
        detail:
          pendingInvoices.length > 0
            ? isSpanish
              ? `${pendingInvoices.length} facturas siguen abiertas`
              : `${pendingInvoices.length} invoices are still open`
            : isSpanish
              ? "No hay facturas pendientes ahora mismo"
              : "There are no pending invoices right now",
        toneClassName: "border-amber-200 bg-amber-50 text-amber-700",
      },
      {
        label: isSpanish ? "Fuera de plazo" : "Overdue",
        value: money(overdueTotal, locale),
        detail:
          overdueInvoices.length > 0
            ? isSpanish
              ? `${overdueInvoices.length} facturas vencidas requieren seguimiento`
              : `${overdueInvoices.length} overdue invoices need follow-up`
            : isSpanish
              ? "No hay vencimientos fuera de plazo"
              : "There are no overdue invoices",
        toneClassName: "border-rose-200 bg-rose-50 text-rose-700",
      },
      {
        label: isSpanish ? "Fichas de cliente" : "Client records",
        value: `${completeClients.length}/${snapshot.clientes.length || 0}`,
        detail:
          snapshot.clientes.length > 0
            ? isSpanish
              ? `${incompleteClients.length} perfiles deben completarse`
              : `${incompleteClients.length} profiles should be completed`
            : isSpanish
              ? "Empieza creando tu primer cliente"
              : "Start by creating your first client",
        toneClassName: "border-sky-200 bg-sky-50 text-sky-700",
      },
      {
        label: "VeriFactu",
        value: `${verifactuErrors.length}`,
        detail:
          snapshot.verifactuRecords.length > 0
            ? isSpanish
              ? `${verifactuPrepared.length} preparados, ${verifactuInFlight.length} en proceso, ${verifactuAccepted.length} aceptados`
              : `${verifactuPrepared.length} prepared, ${verifactuInFlight.length} in progress, ${verifactuAccepted.length} accepted`
            : isSpanish
              ? "Sin actividad de seguimiento todavia"
              : "There is no tracking activity yet",
        toneClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
    ];

    return {
      businessName:
        snapshot.company.nombre ||
        snapshot.userProfile?.companyName ||
        (isSpanish ? "Tu negocio" : "Your business"),
      ownerName:
        snapshot.userProfile?.displayName ||
        (isSpanish ? "Perfil sin completar" : "Incomplete profile"),
      businessStatus:
        companyCompletion >= 85
          ? isSpanish
            ? "Base operativa completa"
            : "Operational base complete"
          : companyCompletion >= 55
            ? isSpanish
              ? "Negocio en crecimiento"
              : "Business in growth"
            : isSpanish
              ? "Configura la ficha de empresa"
              : "Complete the company profile",
      companyCompletion,
      registeredAt: formatDate(
        snapshot.userProfile?.registeredAt,
        locale,
        isSpanish ? "Sin fecha" : "No date",
      ),
      cityLabel:
        [snapshot.company.ciudad, snapshot.company.cp].filter(Boolean).join(" / ") ||
        (isSpanish ? "Ubicacion pendiente" : "Location pending"),
      totalFacturado,
      facturadoMesActual,
      pendingTotal,
      ticketMedio: invoices.length ? totalFacturado / invoices.length : 0,
      totalFacturas: invoices.length,
      totalPropuestas: budgets.length + proformas.length,
      totalAlbaranes: deliveryNotes.length,
      totalDocuments,
      documentsThisMonth: monthDocuments.length,
      draftCount: snapshot.borradores.length,
      activeClients: activeClientKeys.size,
      billedClients: billedClients.size,
      clientsTotal: snapshot.clientes.length,
      clientsWithEmail,
      revenueTrend,
      bestMonth,
      averageMonthlyRevenue,
      revenueGrowth,
      documentMixRaw,
      documentMixChartData,
      documentPipeline,
      healthMetrics,
      topClients,
      maxClientRevenue: topClients[0]?.total || 0,
      verifactuPrepared: verifactuPrepared.length,
      verifactuInFlight: verifactuInFlight.length,
      company: snapshot.company,
      alerts,
      latestInvoiceLabel:
        invoices[0]?.numero ||
        invoices[0]?.id ||
        (isSpanish ? "Sin facturas emitidas" : "No issued invoices"),
      latestDraftLabel:
        snapshot.borradores[0]?.numero ||
        snapshot.borradores[0]?.id ||
        (isSpanish ? "Sin borradores" : "No drafts"),
    };
  }, [isSpanish, locale, snapshot]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[410px] flex-col px-4 pt-4 font-sans sm:max-w-[430px] sm:px-5 sm:pt-6"
        style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_16px_24px_-18px_rgba(15,23,42,0.82)]">
            <ChartColumn className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              {isSpanish ? "Panel ejecutivo" : "Executive dashboard"}
            </p>
            <h1 className="mt-1 text-[1.7rem] font-semibold tracking-[-0.04em] text-slate-950">
              {summary.businessName}
            </h1>
            <p className="mt-2 max-w-sm text-[14px] leading-6 text-slate-500">
              {isSpanish
                ? "Solo los datos clave del negocio: facturacion, caja, clientes y seguimiento."
                : "Only the core business data: billing, cash position, clients, and follow-up."}
            </p>
          </div>
        </header>

        <section className="relative mt-5 overflow-hidden rounded-[32px] border border-slate-900/10 bg-[linear-gradient(135deg,#0f172a_0%,#17304a_52%,#0f766e_100%)] p-5 text-white shadow-[0_28px_64px_-40px_rgba(15,23,42,0.86)]">
          <div className="pointer-events-none absolute -right-8 top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-[#b97a45]/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/65">
                  {isSpanish ? "Resumen del negocio" : "Business overview"}
                </p>
                <h2 className="mt-2 text-[1.6rem] sm:text-[1.85rem] font-semibold tracking-[-0.05em] text-white">
                  {money(summary.totalFacturado, locale)}
                </h2>
                <p className="mt-2 text-[13px] leading-6 text-white/72">
                  {isSpanish
                    ? `Facturacion acumulada con ${summary.totalFacturas} facturas emitidas y ${summary.activeClients} clientes activos.`
                    : `Accumulated billing with ${summary.totalFacturas} issued invoices and ${summary.activeClients} active clients.`}
                </p>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                {isSpanish ? "Perfil" : "Profile"}{" "}
                {formatPercent(summary.companyCompletion)}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">
                  {isSpanish ? "Mes actual" : "Current month"}
                </p>
                <p className="mt-1.5 text-base font-semibold text-white">
                  {money(summary.facturadoMesActual, locale)}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">
                  {isSpanish ? "Pendiente" : "Pending"}
                </p>
                <p className="mt-1.5 text-base font-semibold text-white">
                  {money(summary.pendingTotal, locale)}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">
                  {isSpanish ? "Ticket medio" : "Average ticket"}
                </p>
                <p className="mt-1.5 text-base font-semibold text-white">
                  {money(summary.ticketMedio, locale)}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">
                  {isSpanish ? "Clientes activos" : "Active clients"}
                </p>
                <p className="mt-1.5 text-base font-semibold text-white">
                  {summary.activeClients}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5 text-xs text-white/72">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">
                {summary.businessStatus}
              </span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">
                {summary.cityLabel}
              </span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">
                {isSpanish ? "Ultima factura" : "Latest invoice"}: {summary.latestInvoiceLabel}
              </span>
            </div>
          </div>
        </section>

        <section className={`mt-5 ${SECTION_CLASS}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {isSpanish ? "Rendimiento" : "Performance"}
              </p>
              <h2 className="mt-2 text-[1.08rem] sm:text-[1.2rem] font-semibold tracking-[-0.04em] text-slate-950">
                {isSpanish
                  ? "Facturacion de los ultimos seis meses"
                  : "Billing across the last six months"}
              </h2>
              <p className="mt-2 max-w-sm text-[13px] leading-6 text-slate-500">
                {isSpanish
                  ? "Tendencia de ingresos reales, sin repetir indicadores operativos."
                  : "Real revenue trend without repeating operational indicators."}
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              {isSpanish ? "Facturas" : "Invoices"}: {summary.totalFacturas}
            </span>
          </div>

          <div className="mt-5 h-[220px] w-full">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.revenueTrend}>
                  <defs>
                    <linearGradient id="reportsRevenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1d4d7f" stopOpacity={0.42} />
                      <stop offset="100%" stopColor="#1d4d7f" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.18)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="mes" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={52} tickFormatter={(value: number) => moneyCompact(value, locale, isSpanish)} />
                  <Tooltip
                    formatter={(value) => money(Number(Array.isArray(value) ? value[0] : value || 0), locale)}
                    labelFormatter={(label) =>
                      isSpanish ? `Mes ${label}` : `Month ${label}`
                    }
                    contentStyle={CHART_TOOLTIP_STYLE}
                    cursor={{ stroke: "#1d4d7f", strokeOpacity: 0.12 }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#1d4d7f" strokeWidth={3} fill="url(#reportsRevenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ChartPlaceholder label={isSpanish ? "Cargando tendencia" : "Loading trend"} />
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="rounded-[22px] border border-white/70 bg-slate-50/85 px-3.5 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">{isSpanish ? "Mejor mes" : "Best month"}</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">{summary.bestMonth?.mes || (isSpanish ? "Sin datos" : "No data")}</p>
              <p className="mt-1 text-[13px] text-slate-500">{money(summary.bestMonth?.total || 0, locale)}</p>
            </div>
            <div className="rounded-[22px] border border-white/70 bg-slate-50/85 px-3.5 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">{isSpanish ? "Variacion" : "Variation"}</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {summary.revenueGrowth === null
                  ? isSpanish
                    ? "Sin comparativa"
                    : "No comparison"
                  : `${summary.revenueGrowth >= 0 ? "+" : ""}${summary.revenueGrowth.toFixed(0)}%`}
              </p>
              <p className="mt-1 text-[13px] text-slate-500">{isSpanish ? "frente al mes anterior" : "versus the previous month"}</p>
            </div>
            <div className="rounded-[22px] border border-white/70 bg-slate-50/85 px-3.5 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">{isSpanish ? "Media mensual" : "Monthly average"}</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">{money(summary.averageMonthlyRevenue, locale)}</p>
              <p className="mt-1 text-[13px] text-slate-500">{isSpanish ? "en la ventana analizada" : "in the analysed window"}</p>
            </div>
          </div>
        </section>

        <section className={`mt-5 ${SECTION_CLASS}`}>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{isSpanish ? "Clientes clave" : "Key clients"}</p>
          <h2 className="mt-2 text-[1.08rem] sm:text-[1.2rem] font-semibold tracking-[-0.04em] text-slate-950">{isSpanish ? "Clientes con mayor facturacion" : "Highest-billing clients"}</h2>
          <div className="mt-4 space-y-2.5">
            {summary.topClients.length > 0 ? (
              summary.topClients.map((client, index) => (
                <div key={client.key} className="rounded-[24px] border border-white/70 bg-white/85 p-3.5 shadow-[0_14px_26px_-24px_rgba(15,23,42,0.32)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-950">{String(index + 1).padStart(2, "0")} {"\u00b7"} {client.name}</p>
                      <p className="mt-1 text-[13px] leading-5 text-slate-500">{isSpanish ? `${client.invoices} facturas \u00b7 Ultima actividad ${formatShortDate(client.lastDate, locale, "Sin fecha")}` : `${client.invoices} invoices \u00b7 Latest activity ${formatShortDate(client.lastDate, locale, "No date")}`}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-slate-950">{money(client.total, locale)}</p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-[linear-gradient(90deg,#1d4d7f,#0f766e)]" style={{ width: `${Math.max(10, summary.maxClientRevenue > 0 ? (client.total / summary.maxClientRevenue) * 100 : 0)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-sm leading-6 text-slate-500">
                {isSpanish
                  ? "Aun no hay suficiente historico de facturas para generar un ranking de clientes."
                  : "There is not enough invoice history yet to generate a client ranking."}
              </div>
            )}
          </div>
        </section>

        <section className={`mt-5 ${SECTION_CLASS}`}>
          <div className="flex items-start gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{isSpanish ? "Alertas y control" : "Alerts and control"}</p>
              <h2 className="mt-2 text-[1.08rem] sm:text-[1.2rem] font-semibold tracking-[-0.04em] text-slate-950">{isSpanish ? "Prioridades de seguimiento" : "Follow-up priorities"}</h2>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {summary.alerts.slice(0, 3).map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/70 bg-white/85 p-3.5 shadow-[0_14px_26px_-24px_rgba(15,23,42,0.32)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                    <p className="mt-1 text-[13px] leading-5 text-slate-500">{item.detail}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${item.toneClassName}`}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
