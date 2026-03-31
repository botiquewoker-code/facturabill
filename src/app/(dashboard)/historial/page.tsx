"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, FileText, ReceiptText } from "lucide-react";
import {
  getInvoiceDocumentMeta,
  normalizeInvoiceDocumentType,
  type InvoiceDocumentType,
} from "@/features/invoices/document-types";
import { formatCurrencyByLanguage } from "@/features/i18n/core";
import { useAppI18n } from "@/features/i18n/runtime";

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
  verifactu?: {
    recordId?: string;
    status?: string;
    fingerprint?: string;
    generatedAt?: string;
    qrPreview?: string;
    lastError?: string;
  };
};

const HISTORY_KEY = "historial";
const CONVERT_KEY = "presupuestoConvertir";

function readHistory(): HistoryDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryDocument[]) : [];
  } catch {
    return [];
  }
}

export default function HistorialPage() {
  const router = useRouter();
  const { language, t } = useAppI18n();
  const [documentos, setDocumentos] = useState<HistoryDocument[]>(() =>
    readHistory(),
  );

  useEffect(() => {
    const refreshHistory = () => setDocumentos(readHistory());

    window.addEventListener("focus", refreshHistory);

    return () => {
      window.removeEventListener("focus", refreshHistory);
    };
  }, []);

  const copy = {
    eyebrow: t({ es: "Historial", en: "History" }),
    title: t({ es: "Documentos guardados", en: "Saved documents" }),
    description: t({
      es: "Revisa facturas, presupuestos, proformas y albaranes recientes.",
      en: "Review recent invoices, quotes, proformas, and delivery notes.",
    }),
    emptyTitle: t({ es: "Aun no hay documentos", en: "No documents yet" }),
    emptyDescription: t({
      es: "Cuando descargues o envies un documento, aparecera aqui para que puedas consultarlo mas tarde.",
      en: "When you download or send a document, it will appear here so you can review it later.",
    }),
    saved: t({ es: "Guardado", en: "Saved" }),
    client: t({ es: "Cliente", en: "Client" }),
    noClient: t({ es: "Sin cliente", en: "No client" }),
    date: t({ es: "Fecha", en: "Date" }),
    noDate: t({ es: "Sin fecha", en: "No date" }),
    total: t({ es: "Total", en: "Total" }),
    verifactu: t({ es: "VeriFactu", en: "VeriFactu" }),
    prepared: t({ es: "Preparado", en: "Prepared" }),
    pending: t({ es: "Pendiente", en: "Pending" }),
    notPrepared: t({ es: "Sin preparar", en: "Not prepared" }),
    verifactuUpdated: t({
      es: "Esta factura ya tiene su seguimiento actualizado.",
      en: "This invoice tracking is already updated.",
    }),
    verifactuIssue: t({
      es: "Hay una incidencia pendiente de revisar en esta factura.",
      en: "There is a pending issue to review on this invoice.",
    }),
    verifactuPendingActivation: t({
      es: "El seguimiento se activara cuando emitas la factura.",
      en: "Tracking will activate when you issue the invoice.",
    }),
    convertToInvoice: t({ es: "Convertir en factura", en: "Convert to invoice" }),
    createAnother: t({ es: "Crear otra", en: "Create another" }),
    createOther: t({ es: "Crear otro", en: "Create another" }),
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
        <header className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
            <Clock3 className="h-[18px] w-[18px]" strokeWidth={2.1} />
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
        </header>

        {documentos.length === 0 ? (
          <section className="mt-6 rounded-[34px] border border-white/70 bg-white/76 p-6 text-center shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
              {copy.emptyTitle}
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-slate-500">
              {copy.emptyDescription}
            </p>
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {documentos.map((doc, index) => {
              const documentType = normalizeInvoiceDocumentType(doc.tipo);
              const documentMeta = getInvoiceDocumentMeta(documentType, language);
              const displayNumber =
                doc.numero || doc.id || `DOC-${String(index + 1).padStart(3, "0")}`;

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
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        documentType === "presupuesto"
                          ? "border border-[#e7c39a] bg-[#fff4e5] text-[#8a5a33]"
                          : documentType === "proforma"
                            ? "border border-sky-200 bg-sky-50 text-sky-700"
                            : documentType === "albaran"
                              ? "border border-teal-200 bg-teal-50 text-teal-700"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {doc.estado || copy.saved}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,245,240,0.92))] p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">{copy.client}</span>
                      <span className="max-w-[60%] truncate text-right font-semibold text-slate-950">
                        {doc.cliente?.nombre || copy.noClient}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">{copy.date}</span>
                      <span className="font-semibold text-slate-950">
                        {doc.fecha || copy.noDate}
                      </span>
                    </div>
                    {documentMeta.supportsSecondaryDate && doc.fechaVencimiento ? (
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-500">
                          {documentMeta.secondaryDateLabel}
                        </span>
                        <span className="font-semibold text-slate-950">
                          {doc.fechaVencimiento}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">{copy.total}</span>
                      <span className="font-semibold text-slate-950">
                        {formatCurrencyByLanguage(language, Number(doc.total) || 0)}
                      </span>
                    </div>
                    {documentType === "factura" ? (
                      <div className="rounded-[18px] border border-slate-200/80 bg-slate-50/85 px-3 py-3">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-500">{copy.verifactu}</span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              doc.verifactu?.status === "prepared"
                                ? "border border-sky-200 bg-sky-50 text-sky-700"
                                : doc.verifactu?.status === "error"
                                  ? "border border-red-200 bg-red-50 text-red-700"
                                  : "border border-slate-200 bg-white text-slate-500"
                            }`}
                          >
                            {doc.verifactu?.status === "prepared"
                              ? copy.prepared
                              : doc.verifactu?.status === "error"
                                ? copy.pending
                                : copy.notPrepared}
                          </span>
                        </div>
                        {doc.verifactu?.fingerprint ? (
                          <p className="mt-2 text-[12px] leading-5 text-slate-500">
                            {copy.verifactuUpdated}
                          </p>
                        ) : doc.verifactu?.lastError ? (
                          <p className="mt-2 text-[12px] leading-5 text-red-600">
                            {copy.verifactuIssue}
                          </p>
                        ) : (
                          <p className="mt-2 text-[12px] leading-5 text-slate-500">
                            {copy.verifactuPendingActivation}
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {documentMeta.canConvertToInvoice ? (
                    <button
                      type="button"
                      onClick={() => {
                        window.localStorage.setItem(
                          CONVERT_KEY,
                          JSON.stringify(doc),
                        );
                        router.push("/crear-factura");
                      }}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
                    >
                      <ReceiptText className="h-4 w-4" strokeWidth={2.2} />
                      {copy.convertToInvoice}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/crear-factura?tipo=${documentType}`)
                      }
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <FileText className="h-4 w-4" strokeWidth={2.2} />
                      {documentMeta.article === "la" ? copy.createAnother : copy.createOther}{" "}
                      {documentMeta.label.toLowerCase()}
                      <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                    </button>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
