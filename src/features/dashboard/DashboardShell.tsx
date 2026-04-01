"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChartColumn,
  House,
  Package,
  Plus,
  Sparkles,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  getUserFirstName,
  readUserProfile,
} from "@/features/account/profile";
import {
  DRAFTS_UPDATED_EVENT,
  readDrafts,
  writeActiveDraft,
} from "@/features/drafts/storage";
import { formatDateTimeByLanguage } from "@/features/i18n/core";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";
import {
  getInvoiceDocumentMeta,
  normalizeInvoiceDocumentType,
  type InvoiceDocumentType,
} from "@/features/invoices/document-types";
import { useClientLayoutEffect } from "@/features/ui/useClientLayoutEffect";

type DashboardShellProps = {
  children: React.ReactNode;
};

type DraftItem = {
  id: string;
  tipo?: InvoiceDocumentType;
  numero?: string;
  updatedAt?: string;
  cliente?: {
    nombre?: string;
  };
};

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  active: boolean;
  expanded?: boolean;
};

type MoreMenuItem = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

function isPrimaryDraft(draft: DraftItem) {
  const documentType = normalizeInvoiceDocumentType(draft.tipo);
  return documentType === "factura" || documentType === "presupuesto";
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useAppLanguage();
  const copy = dashboardCopy[language];
  const [hasRegisteredUser, setHasRegisteredUser] = useState(false);
  const [hasHydratedShell, setHasHydratedShell] = useState(false);
  const [moreMenuPath, setMoreMenuPath] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const hydrateFrameRef = useRef<number | null>(null);
  const isMoreMenuOpen = moreMenuPath === pathname;

  const moreNavLabel = language === "es" ? "Mas" : "More";
  const moreMenuUi =
    language === "es"
      ? {
          title: "Mas opciones",
          description:
            "Accede a informes, documentos adicionales y borradores sin romper la navegacion principal.",
          draftsEyebrow: "Borradores",
          draftsTitle: "Borradores recientes",
          draftsDescription:
            "Recupera las ultimas facturas y presupuestos justo donde los dejaste.",
          draftsEmpty:
            "Todavia no hay facturas o presupuestos pendientes para recuperar.",
          restoreDraft: "Recuperar",
          updatedAt: "Actualizado",
          close: "Cerrar",
          noClient: "Sin cliente",
        }
      : {
          title: "More options",
          description:
            "Access reports, additional documents, and drafts without breaking the main navigation.",
          draftsEyebrow: "Drafts",
          draftsTitle: "Recent drafts",
          draftsDescription:
            "Resume your latest invoices and quotes exactly where you left them.",
          draftsEmpty:
            "There are no pending invoices or quotes to resume yet.",
          restoreDraft: "Resume",
          updatedAt: "Updated",
          close: "Close",
          noClient: "No client",
        };
  const moreMenuItems: MoreMenuItem[] = [
    {
      label: copy.nav.reports,
      description:
        language === "es"
          ? "Consulta el panel de control y el resumen ejecutivo del negocio."
          : "Open the business dashboard and executive summary.",
      href: "/informes",
      icon: ChartColumn,
    },
    {
      label: language === "es" ? "Crear proforma" : "Create proforma",
      description:
        language === "es"
          ? "Genera una proforma previa a la factura definitiva."
          : "Generate a proforma ahead of the final invoice.",
      href: "/crear-factura?tipo=proforma",
      icon: Sparkles,
    },
    {
      label: language === "es" ? "Crear albaran" : "Create delivery note",
      description:
        language === "es"
          ? "Deja constancia de una entrega o servicio realizado."
          : "Record a delivered order or completed service.",
      href: "/crear-factura?tipo=albaran",
      icon: Package,
    },
  ];

  useClientLayoutEffect(() => {
    const runHydration = () => {
      startTransition(() => {
        setHasRegisteredUser(getUserFirstName(readUserProfile()).length > 0);
        setDrafts(readDrafts<DraftItem>());
        setHasHydratedShell(true);
      });
    };
    const hydrateShellData = () => {
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }

      if (hydrateFrameRef.current !== null) {
        return;
      }

      hydrateFrameRef.current = window.requestAnimationFrame(() => {
        hydrateFrameRef.current = null;
        runHydration();
      });
    };

    runHydration();
    window.addEventListener("pageshow", hydrateShellData);
    document.addEventListener("visibilitychange", hydrateShellData);
    window.addEventListener("focus", hydrateShellData);
    window.addEventListener(DRAFTS_UPDATED_EVENT, hydrateShellData);

    return () => {
      if (hydrateFrameRef.current !== null) {
        window.cancelAnimationFrame(hydrateFrameRef.current);
      }

      window.removeEventListener("pageshow", hydrateShellData);
      document.removeEventListener("visibilitychange", hydrateShellData);
      window.removeEventListener("focus", hydrateShellData);
      window.removeEventListener(DRAFTS_UPDATED_EVENT, hydrateShellData);
    };
  }, []);

  useEffect(() => {
    [
      "/",
      "/catalogo",
      "/clientes",
      "/ajustes",
      "/informes",
      "/borradores",
      "/historial",
      "/crear-factura",
      "/crear-factura?tipo=proforma",
      "/crear-factura?tipo=albaran",
    ].forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  useEffect(() => {
    if (!isMoreMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMoreMenuPath(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMoreMenuOpen]);

  const recentPrimaryDrafts = useMemo(
    () =>
      drafts
        .filter(isPrimaryDraft)
        .sort((left, right) => {
          const leftTime = left.updatedAt ? Date.parse(left.updatedAt) : 0;
          const rightTime = right.updatedAt ? Date.parse(right.updatedAt) : 0;
          return rightTime - leftTime;
        })
        .slice(0, 4),
    [drafts],
  );

  const activeSection = useMemo(() => {
    if (isMoreMenuOpen) {
      return "more";
    }

    if (pathname === "/") {
      return "home";
    }

    if (
      pathname === "/borradores" ||
      pathname === "/historial" ||
      pathname.startsWith("/informes")
    ) {
      return "more";
    }

    if (pathname.startsWith("/catalogo")) {
      return "catalog";
    }

    if (pathname.startsWith("/clientes")) {
      return "clients";
    }

    if (pathname.startsWith("/ajustes") || pathname.startsWith("/empresa")) {
      return "profile";
    }

    return "";
  }, [isMoreMenuOpen, pathname]);

  const showBottomNav =
    hasHydratedShell && hasRegisteredUser && !pathname.startsWith("/crear-factura");

  const navItems: NavItem[] = [
    {
      key: "home",
      label: copy.nav.home,
      icon: House,
      href: "/",
      active: activeSection === "home",
    },
    {
      key: "more",
      label: moreNavLabel,
      icon: Plus,
      active: activeSection === "more",
      onClick: () => setMoreMenuPath(pathname),
      expanded: isMoreMenuOpen,
    },
    {
      key: "catalog",
      label: language === "es" ? "Catalogo" : "Catalog",
      icon: Package,
      href: "/catalogo",
      active: activeSection === "catalog",
    },
    {
      key: "clients",
      label: copy.nav.clients,
      icon: UsersRound,
      href: "/clientes",
      active: activeSection === "clients",
    },
    {
      key: "profile",
      label: copy.nav.profile,
      icon: UserRound,
      href: "/ajustes",
      active: activeSection === "profile",
    },
  ];

  function openMoreMenuItem(href: string) {
    setMoreMenuPath(null);
    startTransition(() => {
      router.push(href);
    });
  }

  function restoreDraft(draft: DraftItem) {
    setMoreMenuPath(null);
    writeActiveDraft(draft);
    startTransition(() => {
      router.push("/crear-factura");
    });
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none fixed -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none fixed -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <div className="relative">{children}</div>

      {showBottomNav ? (
        <nav
          className="fixed bottom-0 left-1/2 z-20 w-full max-w-[410px] -translate-x-1/2 px-3 sm:max-w-[430px] sm:px-4"
          style={{ paddingBottom: "max(0.2rem, env(safe-area-inset-bottom))" }}
        >
          <div
            className="grid rounded-[20px] border border-white/10 bg-slate-950/96 px-1 py-1.5 text-white shadow-[0_14px_28px_-18px_rgba(15,23,42,0.48)] backdrop-blur-xl sm:rounded-[30px] sm:px-2 sm:py-3 sm:shadow-[0_24px_60px_-26px_rgba(15,23,42,0.78)]"
            style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
          >
            {navItems.map(({ key, label, icon: Icon, active, href, onClick, expanded }) => {
              const className = `flex flex-col items-center justify-center gap-px rounded-[15px] px-0.5 py-1 text-center transition sm:gap-1 sm:rounded-2xl sm:px-1 sm:py-2 ${
                active
                  ? "bg-white text-slate-950 shadow-[0_12px_20px_-18px_rgba(255,255,255,0.95)] sm:shadow-[0_16px_30px_-24px_rgba(255,255,255,1)]"
                  : "text-white/58 hover:text-white/78"
              }`;

              if (href) {
                return (
                  <Link
                    key={key}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={className}
                  >
                    <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.1} />
                    <span className="text-[9px] font-medium tracking-[-0.01em] sm:text-[11px]">
                      {label}
                    </span>
                  </Link>
                );
              }

              return (
                <button
                  key={key}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  aria-expanded={expanded}
                  aria-haspopup="dialog"
                  onClick={onClick}
                  className={className}
                >
                  <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.1} />
                  <span className="text-[9px] font-medium tracking-[-0.01em] sm:text-[11px]">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      ) : null}

      {showBottomNav && isMoreMenuOpen ? (
        <>
          <button
            type="button"
            aria-label={moreMenuUi.close}
            onClick={() => setMoreMenuPath(null)}
            className="fixed inset-0 z-30 bg-slate-950/18 backdrop-blur-[2px]"
          />

          <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[410px] px-3 pb-2.5 sm:max-w-[430px] sm:px-4 sm:pb-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-label={moreMenuUi.title}
              className="max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,252,0.96))] p-4 shadow-[0_26px_52px_-30px_rgba(15,23,42,0.34)] backdrop-blur-xl sm:max-h-[calc(100dvh-1.5rem)] sm:rounded-[34px] sm:p-5 sm:shadow-[0_34px_80px_-38px_rgba(15,23,42,0.55)]"
            >
              <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-200 sm:mb-4 sm:h-1.5 sm:w-14" />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    {moreNavLabel}
                  </p>
                  <h3 className="mt-2 text-[1.25rem] sm:text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                    {moreMenuUi.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-5 text-slate-500 sm:text-sm sm:leading-6">
                    {moreMenuUi.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMoreMenuPath(null)}
                  aria-label={moreMenuUi.close}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700 sm:h-10 sm:w-10 sm:rounded-2xl"
                >
                  <X className="h-4 w-4" strokeWidth={2.3} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
                {moreMenuItems.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => openMoreMenuItem(item.href)}
                      className="flex min-h-[124px] flex-col items-start rounded-[22px] border border-white/70 bg-white/86 px-3.5 py-3.5 text-left shadow-[0_12px_24px_-20px_rgba(15,23,42,0.18)] transition hover:bg-white sm:min-h-[148px] sm:rounded-[26px] sm:px-4 sm:py-4 sm:shadow-[0_16px_30px_-24px_rgba(15,23,42,0.24)]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-slate-950 text-white shadow-[0_14px_22px_-16px_rgba(15,23,42,0.72)] sm:h-11 sm:w-11 sm:rounded-2xl sm:shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                        <ItemIcon className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" strokeWidth={2.1} />
                      </span>
                      <p className="mt-3 text-[13px] font-semibold text-slate-950 sm:mt-4 sm:text-sm">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-[12px] leading-5 text-slate-500 sm:mt-2 sm:text-[13px]">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[24px] border border-white/80 bg-white/78 p-3.5 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.18)] sm:mt-6 sm:rounded-[28px] sm:p-4 sm:shadow-[0_18px_36px_-28px_rgba(15,23,42,0.22)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                      {moreMenuUi.draftsEyebrow}
                    </p>
                    <h4 className="mt-2 text-[1.02rem] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[1.1rem]">
                      {moreMenuUi.draftsTitle}
                    </h4>
                    <p className="mt-2 text-[13px] leading-5 text-slate-500">
                      {moreMenuUi.draftsDescription}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:px-3 sm:py-1.5 sm:text-xs">
                    {String(recentPrimaryDrafts.length).padStart(2, "0")}
                  </span>
                </div>

                {recentPrimaryDrafts.length > 0 ? (
                  <div className="mt-4 space-y-2.5 sm:space-y-3">
                    {recentPrimaryDrafts.map((item, index) => {
                      const documentType = normalizeInvoiceDocumentType(item.tipo);
                      const documentLabel = getInvoiceDocumentMeta(
                        documentType,
                        language,
                      ).label;

                      return (
                        <button
                          key={`${item.id || item.numero || "more-draft"}-${index}`}
                          type="button"
                          onClick={() => restoreDraft(item)}
                          className="flex w-full items-start justify-between gap-3 rounded-[20px] border border-white/80 bg-white/88 px-3.5 py-3 text-left shadow-[0_12px_24px_-20px_rgba(15,23,42,0.18)] transition hover:bg-white sm:rounded-[24px] sm:px-4 sm:py-4 sm:shadow-[0_16px_30px_-24px_rgba(15,23,42,0.22)]"
                        >
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                              {documentLabel}
                            </p>
                            <p className="mt-2 truncate text-sm font-semibold text-slate-950">
                              {item.numero || item.id}
                            </p>
                            <p className="mt-1 text-[13px] leading-5 text-slate-500">
                              {item.cliente?.nombre || moreMenuUi.noClient}
                            </p>
                            <p className="mt-1 text-[12px] leading-5 text-slate-400">
                              {moreMenuUi.updatedAt}:{" "}
                              {formatDateTimeByLanguage(
                                language,
                                item.updatedAt,
                                "",
                              )}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 sm:px-3 sm:py-1.5 sm:text-xs">
                            {moreMenuUi.restoreDraft}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[18px] border border-dashed border-slate-200 bg-white/70 px-3.5 py-3 text-[13px] leading-5 text-slate-500 sm:rounded-[22px] sm:px-4 sm:py-4 sm:text-sm sm:leading-6">
                    {moreMenuUi.draftsEmpty}
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
