"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, FileText, ReceiptText } from "lucide-react";
import {
  getInvoiceDocumentMeta,
  normalizeInvoiceDocumentType,
  type InvoiceDocumentType,
} from "@/features/invoices/document-types";
import {
  DRAFTS_UPDATED_EVENT,
  MAX_DRAFTS,
  DRAFT_RETENTION_DAYS,
  readDrafts,
  writeActiveDraft,
} from "@/features/drafts/storage";
import { formatDateTimeByLanguage } from "@/features/i18n/core";
import { useAppI18n } from "@/features/i18n/runtime";

type DraftItem = {
  id: string;
  tipo?: InvoiceDocumentType;
  numero?: string;
  updatedAt?: string;
  cliente?: {
    nombre?: string;
  };
};

export default function BorradoresPage() {
  const router = useRouter();
  const { language, t } = useAppI18n();
  const [borradores, setBorradores] = useState<DraftItem[]>(() => readDrafts());

  useEffect(() => {
    const refreshDrafts = () => setBorradores(readDrafts());

    window.addEventListener("pageshow", refreshDrafts);
    document.addEventListener("visibilitychange", refreshDrafts);
    window.addEventListener("focus", refreshDrafts);
    window.addEventListener(DRAFTS_UPDATED_EVENT, refreshDrafts);

    return () => {
      window.removeEventListener("pageshow", refreshDrafts);
      document.removeEventListener("visibilitychange", refreshDrafts);
      window.removeEventListener("focus", refreshDrafts);
      window.removeEventListener(DRAFTS_UPDATED_EVENT, refreshDrafts);
    };
  }, []);

  const copy = {
    eyebrow: t({ es: "Documentos", en: "Documents" }),
    title: t({ es: "Borradores", en: "Drafts" }),
    description: t({
      es: `Retoma tus ${MAX_DRAFTS} borradores mas recientes. Todo se elimina automaticamente a los ${DRAFT_RETENTION_DAYS} dias.`,
      en: `Resume your ${MAX_DRAFTS} most recent drafts. Everything is removed automatically after ${DRAFT_RETENTION_DAYS} days.`,
    }),
    back: t({ es: "Salir de borradores", en: "Leave drafts" }),
    create: t({ es: "Crear", en: "Create" }),
    emptyTitle: t({ es: "No hay borradores", en: "No drafts yet" }),
    emptyDescription: t({
      es: `Cuando guardes un documento, apareceran aqui solo los ${MAX_DRAFTS} mas recientes durante un maximo de ${DRAFT_RETENTION_DAYS} dias.`,
      en: `When you save a document, only the ${MAX_DRAFTS} most recent ones will appear here for up to ${DRAFT_RETENTION_DAYS} days.`,
    }),
    createInvoice: t({ es: "Crear factura", en: "Create invoice" }),
    draftStatus: t({ es: "Borrador", en: "Draft" }),
    client: t({ es: "Cliente", en: "Client" }),
    noClient: t({ es: "Sin cliente", en: "No client" }),
    updated: t({ es: "Actualizado", en: "Updated" }),
    noDate: t({ es: "Sin fecha", en: "No date" }),
    restore: t({ es: "Restaurar borrador", en: "Restore draft" }),
  };

  function leavePage() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[380px] flex-col px-3.5 pt-3.5 font-sans sm:max-w-[430px] sm:px-5 sm:pt-6"
        style={{ paddingBottom: "calc(4.35rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={leavePage}
              aria-label={copy.back}
              className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_10px_20px_-20px_rgba(15,23,42,0.18)] backdrop-blur-xl transition hover:bg-white sm:h-10 sm:w-10 sm:shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)]"
            >
              <ArrowLeft className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.4} />
            </button>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_20px_-16px_rgba(15,23,42,0.72)] sm:h-11 sm:w-11 sm:rounded-2xl sm:shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <FileText className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500 sm:text-sm sm:tracking-[0.18em]">
                {copy.eyebrow}
              </p>
              <h1 className="mt-1 text-[1.38rem] font-semibold tracking-[-0.04em] text-slate-950 sm:mt-2 sm:text-[2rem]">
                {copy.title}
              </h1>
              <p className="mt-1.5 max-w-[13.5rem] text-[12px] leading-[1.35] text-slate-500 sm:mt-3 sm:max-w-xs sm:text-[15px] sm:leading-6">
                {copy.description}
              </p>
            </div>
          </div>
          <Link
            href="/crear-factura"
            className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-11 sm:px-4 sm:text-sm"
          >
            {copy.create}
          </Link>
        </header>

        {borradores.length === 0 ? (
          <section className="mt-4 rounded-[22px] border border-white/70 bg-white/76 p-4 text-center shadow-[0_18px_34px_-28px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:mt-6 sm:rounded-[34px] sm:p-6 sm:shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)]">
            <h2 className="text-[1rem] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[1.35rem]">
              {copy.emptyTitle}
            </h2>
            <p className="mt-2 text-[12px] leading-[1.45] text-slate-500 sm:mt-3 sm:text-[15px] sm:leading-6">
              {copy.emptyDescription}
            </p>
            <Link
              href="/crear-factura"
              className="mt-3.5 inline-flex min-h-10 items-center justify-center rounded-full bg-slate-950 px-3.5 text-[13px] font-semibold text-white shadow-[0_16px_24px_-20px_rgba(15,23,42,0.76)] transition hover:bg-slate-800 sm:mt-5 sm:min-h-12 sm:px-5 sm:text-sm sm:shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)]"
            >
              {copy.createInvoice}
            </Link>
          </section>
        ) : (
          <section className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-4">
            {borradores.map((item, index) => {
              const documentType = normalizeInvoiceDocumentType(item.tipo);
              const documentMeta = getInvoiceDocumentMeta(documentType, language);
              const displayNumber =
                item.numero || item.id || `BORR-${String(index + 1).padStart(3, "0")}`;

              return (
                <article
                  key={`${displayNumber}-${index}`}
                  className="rounded-[22px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:rounded-[34px] sm:p-6 sm:shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)]"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500 sm:text-sm sm:tracking-[0.18em]">
                        {documentMeta.label}
                      </p>
                      <h2 className="mt-1 text-[1rem] font-semibold tracking-[-0.04em] text-slate-950 sm:mt-2 sm:text-[1.35rem]">
                        {displayNumber}
                      </h2>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600 sm:px-3 sm:py-1.5 sm:text-xs">
                      {copy.draftStatus}
                    </span>
                  </div>

                  <div className="mt-3.5 grid gap-2 rounded-[18px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,245,240,0.92))] p-3 shadow-[0_14px_26px_-22px_rgba(15,23,42,0.2)] sm:mt-5 sm:gap-3 sm:rounded-[24px] sm:p-4 sm:shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
                    <div className="flex items-center justify-between gap-2.5 text-[12px] sm:text-sm">
                      <span className="text-slate-500">{copy.client}</span>
                      <span className="max-w-[56%] truncate text-right font-semibold text-slate-950">
                        {item.cliente?.nombre || copy.noClient}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2.5 text-[12px] sm:text-sm">
                      <span className="text-slate-500">{copy.updated}</span>
                      <span className="font-semibold text-slate-950">
                        {item.updatedAt
                          ? formatDateTimeByLanguage(language, item.updatedAt, copy.noDate)
                          : copy.noDate}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      writeActiveDraft(item);
                      router.push("/crear-factura");
                    }}
                    className="mt-3.5 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-full bg-slate-950 px-3.5 text-[13px] font-semibold text-white shadow-[0_16px_24px_-20px_rgba(15,23,42,0.76)] transition hover:bg-slate-800 sm:mt-5 sm:min-h-12 sm:px-5 sm:text-sm sm:shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)]"
                  >
                    {documentType === "presupuesto" || documentType === "proforma" ? (
                      <ReceiptText className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
                    ) : (
                      <Clock3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
                    )}
                    {copy.restore}
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
