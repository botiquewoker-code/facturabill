"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChartColumn,
  House,
  Plus,
  ReceiptText,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  readClients,
  type ClientRecord,
} from "@/features/clients/storage";
import type { AppLanguage } from "@/features/i18n/config";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";

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
  total?: number;
  estado?: string;
  cliente?: {
    nombre?: string;
    nif?: string;
    email?: string;
  };
};

const DRAFTS_KEY = "borradores";
const HISTORY_KEY = "historial";

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

export default function DashboardHome() {
  const router = useRouter();
  const { language } = useAppLanguage();
  const copy = dashboardCopy[language];
  const labels = searchUi[language];
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState<ClientRecord[]>([]);
  const [historial, setHistorial] = useState<HistoryItem[]>([]);
  const [borradores, setBorradores] = useState<DraftItem[]>([]);

  const navItems = [
    { label: copy.nav.home, icon: House, active: true },
    { label: labels.budget, icon: ReceiptText, active: false, href: "/crear-factura?tipo=presupuesto" },
    { label: copy.nav.clients, icon: UsersRound, active: false, href: "/clientes" },
    { label: copy.nav.reports, icon: ChartColumn, active: false, href: "/informes" },
    { label: copy.nav.profile, icon: UserRound, active: false, href: "/ajustes" },
  ];
  const normalizedQuery = normalizeSearchValue(search);

  useEffect(() => {
    const hydrateSearchData = () => {
      setClientes(readClients());
      setHistorial(safeReadArray<HistoryItem>(HISTORY_KEY));
      setBorradores(safeReadArray<DraftItem>(DRAFTS_KEY));
    };

    const frame = window.requestAnimationFrame(hydrateSearchData);
    window.addEventListener("focus", hydrateSearchData);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("focus", hydrateSearchData);
    };
  }, []);

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

  const totalResults =
    clientResults.length + historyResults.length + draftResults.length;

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
      window.localStorage.setItem("borradorActivo", JSON.stringify(draftResults[0]));
      router.push("/crear-factura");
    }
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
            <p className="text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
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
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl transition hover:bg-white"
            >
              <SlidersHorizontal
                className="h-[18px] w-[18px]"
                strokeWidth={2.1}
              />
            </button>
          </div>
        </header>

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
                          window.localStorage.setItem(
                            "borradorActivo",
                            JSON.stringify(item),
                          );
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
          <section className="flex flex-1 items-center justify-center py-8">
          <div className="w-full rounded-[36px] border border-white/70 bg-white/72 p-8 text-center shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
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

            <div className="mx-auto max-w-xs">
              <h2 className="text-[1.85rem] font-semibold tracking-[-0.05em] text-slate-950">
                {copy.home.emptyTitle}
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-slate-500">
                {copy.home.emptyDescription}
              </p>
            </div>

            <Link
              href="/crear-factura"
              className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-slate-950 px-7 text-[15px] font-semibold text-white shadow-[0_22px_38px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
            >
              {copy.home.createFirstInvoice}
            </Link>
          </div>
          </section>
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
    </div>
  );
}
