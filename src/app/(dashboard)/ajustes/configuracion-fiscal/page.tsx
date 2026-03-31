"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgePercent,
  CircleCheckBig,
  FileText,
  Save,
  Scale,
} from "lucide-react";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";
import {
  DEFAULT_FISCAL_SETTINGS,
  FISCAL_RATE_OPTIONS,
  FISCAL_SETTINGS_STORAGE_KEY,
  normalizeFiscalSettings,
  type FiscalSettings,
} from "@/features/invoices/fiscal-settings";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import { useClientLayoutEffect } from "@/features/ui/useClientLayoutEffect";

function SectionCard({
  eyebrow,
  title,
  children,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  icon: typeof Scale;
}) {
  return (
    <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
            {title}
          </h3>
        </div>
      </div>

      {children}
    </section>
  );
}

export default function ConfiguracionFiscalPage() {
  const { language } = useAppLanguage();
  const copy = dashboardCopy[language];
  const companyCopy = dashboardCopy[language].company;
  const [settings, setSettings] = useState<FiscalSettings>(
    DEFAULT_FISCAL_SETTINGS,
  );
  const [isReady, setIsReady] = useState(false);

  const pageCopy =
    language === "es"
      ? {
          badge: "Fiscal",
          intro:
            "Define el impuesto por defecto y la nota legal que debe aplicarse a futuras facturas y presupuestos.",
          summaryEyebrow: "Configuracion fiscal",
          summaryTitle: "Impuesto y criterio por defecto",
          taxLabelTitle: "Impuesto principal",
          taxLabelDescription:
            "Nombre que se mostrara en el resumen y en el PDF del documento.",
          defaultRateTitle: "Tipo por defecto",
          defaultRateDescription:
            "Porcentaje aplicado por defecto al crear facturas y presupuestos.",
          fiscalNoteTitle: "Nota fiscal",
          fiscalNoteDescription:
            "Texto legal o aclaracion para operaciones exentas, intracomunitarias o casos especiales.",
          taxLabelPlaceholder: "IVA",
          notePlaceholder:
            "Ejemplo: Operacion exenta de IVA segun el articulo aplicable o inversion del sujeto pasivo.",
          appliedInDocuments: "Se aplica en facturas y presupuestos",
          noNote: "Sin nota fiscal adicional",
          save: "Guardar configuracion fiscal",
          back: "Volver a ajustes",
          saved: "Configuracion fiscal guardada",
          saveError: "No se pudo guardar la configuracion fiscal",
        }
      : {
          badge: "Tax",
          intro:
            "Set the default tax and legal note for future invoices and estimates.",
          summaryEyebrow: "Tax settings",
          summaryTitle: "Default tax behavior",
          taxLabelTitle: "Primary tax",
          taxLabelDescription:
            "Name shown in the summary and on the document PDF.",
          defaultRateTitle: "Default rate",
          defaultRateDescription:
            "Percentage applied by default when creating invoices and estimates.",
          fiscalNoteTitle: "Tax note",
          fiscalNoteDescription:
            "Legal text or clarification for exempt, intra-community, or special cases.",
          taxLabelPlaceholder: "VAT",
          notePlaceholder:
            "Example: VAT exempt operation under the applicable article or reverse charge.",
          appliedInDocuments: "Applied to invoices and estimates",
          noNote: "No additional tax note",
          save: "Save tax settings",
          back: "Back to settings",
          saved: "Tax settings saved",
          saveError: "Could not save tax settings",
        };

  useClientLayoutEffect(() => {
    const stored = window.localStorage.getItem(FISCAL_SETTINGS_STORAGE_KEY);

    if (stored) {
      try {
        setSettings(normalizeFiscalSettings(JSON.parse(stored)));
      } catch (error) {
        console.error("Error loading fiscal settings", error);
      }
    }

    setIsReady(true);
  }, []);

  function persistSettings(nextSettings: FiscalSettings) {
    window.localStorage.setItem(
      FISCAL_SETTINGS_STORAGE_KEY,
      JSON.stringify(nextSettings),
    );
  }

  useEffect(() => {
    if (!isReady) {
      return;
    }

    persistSettings(settings);
  }, [isReady, settings]);

  function handleSave() {
    try {
      persistSettings(settings);
      showSuccessToast(pageCopy.saved);
    } catch (error) {
      console.error("Error saving fiscal settings", error);
      showWarningToast(pageCopy.saveError);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/ajustes"
                aria-label={pageCopy.back}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
              >
                <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
              </Link>

              <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
                {pageCopy.badge}
              </div>
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              {copy.settings.eyebrow}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              {copy.settings.taxSettings}
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              {pageCopy.intro}
            </p>
          </div>

          <button
            type="button"
            aria-label={pageCopy.save}
            onClick={handleSave}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)] transition hover:bg-slate-800"
          >
            <Save className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </button>
        </header>

        {!isReady ? (
          <section className="mt-6 space-y-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="rounded-[34px] border border-white/70 bg-white/72 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl"
              >
                <div className="flex animate-pulse items-start gap-4">
                  <div className="h-16 w-16 rounded-[24px] bg-slate-200/70" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-32 rounded-full bg-slate-200/70" />
                    <div className="h-4 w-20 rounded-full bg-slate-200/60" />
                    <div className="h-4 w-44 rounded-full bg-slate-200/50" />
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <>
            <section className="mt-6 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-slate-950 text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.78)]">
                  <Scale className="h-7 w-7" strokeWidth={2.1} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                        {pageCopy.summaryEyebrow}
                      </p>
                      <h2 className="mt-2 truncate text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                        {pageCopy.summaryTitle}
                      </h2>
                    </div>

                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      {pageCopy.appliedInDocuments}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                        Impuesto
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {settings.taxLabel || "IVA"}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                        Tipo
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {settings.defaultTaxRate}%
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                        Nota
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {settings.fiscalNote ? companyCopy.added : companyCopy.empty}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <SectionCard
              eyebrow="Impuesto"
              title={pageCopy.taxLabelTitle}
              icon={BadgePercent}
            >
              <div className="mt-6 space-y-3">
                <p className="text-sm leading-6 text-slate-500">
                  {pageCopy.taxLabelDescription}
                </p>
                <input
                  placeholder={pageCopy.taxLabelPlaceholder}
                  value={settings.taxLabel}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      taxLabel: event.target.value,
                    }))
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Tipo"
              title={pageCopy.defaultRateTitle}
              icon={Scale}
            >
              <div className="mt-6 space-y-3">
                <p className="text-sm leading-6 text-slate-500">
                  {pageCopy.defaultRateDescription}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {FISCAL_RATE_OPTIONS.map((rate) => {
                    const active = rate === settings.defaultTaxRate;

                    return (
                      <button
                        key={rate}
                        type="button"
                        onClick={() =>
                          setSettings((current) => ({
                            ...current,
                            defaultTaxRate: rate,
                          }))
                        }
                        className={`rounded-[24px] border px-4 py-4 text-center shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)] transition ${
                          active
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-white/70 bg-white/82 text-slate-700 hover:border-slate-200"
                        }`}
                      >
                        <span className="text-lg font-semibold">{rate}%</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Legal"
              title={pageCopy.fiscalNoteTitle}
              icon={FileText}
            >
              <div className="mt-6 space-y-3">
                <p className="text-sm leading-6 text-slate-500">
                  {pageCopy.fiscalNoteDescription}
                </p>
                <textarea
                  rows={6}
                  placeholder={pageCopy.notePlaceholder}
                  value={settings.fiscalNote}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      fiscalNote: event.target.value,
                    }))
                  }
                  className="w-full rounded-[24px] border border-white/70 bg-white/80 px-4 py-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
                {!settings.fiscalNote ? (
                  <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-500">
                    {pageCopy.noNote}
                  </div>
                ) : null}
              </div>
            </SectionCard>

            <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                  <CircleCheckBig className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {companyCopy.actions}
                  </p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                    Guardar y continuar
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
                >
                  <CircleCheckBig className="h-4 w-4" strokeWidth={2.2} />
                  {pageCopy.save}
                </button>
                <Link
                  href="/ajustes"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {pageCopy.back}
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
