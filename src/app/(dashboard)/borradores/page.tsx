"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Clock3, FileText, ReceiptText } from "lucide-react";
import {
  getInvoiceDocumentMeta,
  normalizeInvoiceDocumentType,
  type InvoiceDocumentType,
} from "@/features/invoices/document-types";
import {
  DRAFTS_UPDATED_EVENT,
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
      es: `Retoma cualquier documento pendiente. Los borradores caducan a los ${DRAFT_RETENTION_DAYS} dias.`,
      en: `Resume any pending document. Drafts expire after ${DRAFT_RETENTION_DAYS} days.`,
    }),
    create: t({ es: "Crear", en: "Create" }),
    emptyTitle: t({ es: "No hay borradores", en: "No drafts yet" }),
    emptyDescription: t({
      es: `Cuando guardes un documento, aparecera aqui hasta un maximo de ${DRAFT_RETENTION_DAYS} dias.`,
      en: `When you save a document, it will appear here for up to ${DRAFT_RETENTION_DAYS} days.`,
    }),
    createInvoice: t({ es: "Crear factura", en: "Create invoice" }),
    draftStatus: t({ es: "Borrador", en: "Draft" }),
    client: t({ es: "Cliente", en: "Client" }),
    noClient: t({ es: "Sin cliente", en: "No client" }),
    updated: t({ es: "Actualizado", en: "Updated" }),
    noDate: t({ es: "Sin fecha", en: "No date" }),
    restore: t({ es: "Restaurar borrador", en: "Restore draft" }),
  };

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
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <FileText className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {copy.eyebrow}
              </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              {copy.description}
              </p>
            </div>
          </div>
          <Link
            href="/crear-factura"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copy.create}
          </Link>
        </header>

        {borradores.length === 0 ? (
          <section className="mt-6 rounded-[34px] border border-white/70 bg-white/76 p-6 text-center shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
              {copy.emptyTitle}
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-slate-500">
              {copy.emptyDescription}
            </p>
            <Link
              href="/crear-factura"
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
            >
              {copy.createInvoice}
            </Link>
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {borradores.map((item, index) => {
              const documentType = normalizeInvoiceDocumentType(item.tipo);
              const documentMeta = getInvoiceDocumentMeta(documentType, language);
              const displayNumber =
                item.numero || item.id || `BORR-${String(index + 1).padStart(3, "0")}`;

              return (
                <article
                  key={`${displayNumber}-${index}`}
                  className="rounded-[34px] border border-white/70 bg-white/80 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                        {documentMeta.label}
                      </p>
                      <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                        {displayNumber}
                      </h2>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {copy.draftStatus}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,245,240,0.92))] p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">{copy.client}</span>
                      <span className="max-w-[60%] truncate text-right font-semibold text-slate-950">
                        {item.cliente?.nombre || copy.noClient}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm">
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
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
                  >
                    {documentType === "presupuesto" || documentType === "proforma" ? (
                      <ReceiptText className="h-4 w-4" strokeWidth={2.2} />
                    ) : (
                      <Clock3 className="h-4 w-4" strokeWidth={2.2} />
                    )}
                    {copy.restore}
                    <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
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
