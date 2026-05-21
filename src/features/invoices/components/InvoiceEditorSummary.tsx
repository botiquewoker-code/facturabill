"use client";

import Link from "next/link";
import { Download, ExternalLink, Send, Smartphone } from "lucide-react";
import type { DownloadLimitBlock } from "@/features/invoices/useInvoiceDocumentActions";

type ModeCopy = {
  totalLabel: string;
  downloadLabel: string;
  sendLabel: string;
  sendHint: (email: string) => string;
  emptyEmailHint: string;
};

type UiCopy = {
  taxableBase: string;
  fiscal: string;
  fiscalApplied: string;
  fiscalEmpty: string;
};

type GuestModeCopy = {
  companyHint: string;
  companyAction: string;
};

type Props = {
  clienteEmail: string;
  currentTaxLabel: string;
  currentTaxNote: string;
  descargar: () => void;
  downloadLimitBlock: DownloadLimitBlock | null;
  enviar: () => void;
  guestModeCopy: GuestModeCopy;
  iva: number;
  isDocumentActionPending: boolean;
  isSpanish: boolean;
  modeCopy: ModeCopy;
  money: (value: number) => string;
  primaryActionClass: string;
  showAdvancedTools: boolean;
  subtotal: number;
  tipoIVA: number;
  total: number;
  totalCardClass: string;
  uiCopy: UiCopy;
};

export default function InvoiceEditorSummary({
  clienteEmail,
  currentTaxLabel,
  currentTaxNote,
  descargar,
  downloadLimitBlock,
  enviar,
  guestModeCopy,
  iva,
  isDocumentActionPending,
  isSpanish,
  modeCopy,
  money,
  primaryActionClass,
  showAdvancedTools,
  subtotal,
  tipoIVA,
  total,
  totalCardClass,
  uiCopy,
}: Props) {
  return (
    <>
      <div className="mt-6 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,245,240,0.92))] p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between py-2 text-sm text-slate-600">
          <span>{uiCopy.taxableBase}</span>
          <span className="font-semibold text-slate-950">{money(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between py-2 text-sm text-slate-600">
          <span>
            {currentTaxLabel} ({tipoIVA}%)
          </span>
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
                {uiCopy.fiscal}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {uiCopy.fiscalApplied}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {currentTaxNote || uiCopy.fiscalEmpty}
              </p>
            </div>
            <Link
              href="/ajustes/configuracion-fiscal"
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {uiCopy.fiscal}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={descargar}
          disabled={isDocumentActionPending}
          className={`${primaryActionClass} ${isDocumentActionPending ? "cursor-wait opacity-80" : ""}`}
        >
          <Download className="h-4 w-4" strokeWidth={2.2} />
          {modeCopy.downloadLabel}
        </button>
        {showAdvancedTools ? (
          <button
            type="button"
            onClick={enviar}
            disabled={isDocumentActionPending}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 ${isDocumentActionPending ? "cursor-wait opacity-70" : ""}`}
          >
            <Send className="h-4 w-4" strokeWidth={2.2} />
            {modeCopy.sendLabel}
          </button>
        ) : null}
      </div>

      {downloadLimitBlock ? (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-[90] flex min-h-dvh items-center justify-center overflow-y-auto bg-[linear-gradient(135deg,#dbeafe_0%,#ffffff_46%,#e0f2fe_100%)] px-4 py-8"
        >
          <div className="flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl flex-col justify-center rounded-[38px] border border-white/80 bg-white/88 p-7 shadow-[0_38px_110px_-48px_rgba(30,64,175,0.75)] backdrop-blur-xl sm:p-12">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-col gap-6 sm:flex-row">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[30px] bg-blue-950 text-white shadow-[0_22px_44px_-22px_rgba(30,64,175,0.9)]">
                  <Smartphone className="h-9 w-9" strokeWidth={2.1} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                    {modeCopy.downloadLabel}
                  </p>
                  <h4 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-[3.2rem]">
                    {downloadLimitBlock.message}
                  </h4>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                    {isSpanish
                      ? "Ya has usado las descargas disponibles en la web. Continua desde la app para trabajar con una experiencia mas rapida y completa."
                      : "You have already used the available web downloads. Continue from the app to work with a faster and more complete experience."}
                  </p>
                </div>
              </div>
              <a
                href={downloadLimitBlock.appDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-blue-950 px-7 text-base font-semibold text-white shadow-[0_22px_44px_-24px_rgba(30,64,175,0.9)] transition hover:bg-blue-900"
              >
                {isSpanish ? "Descargar la app" : "Download the app"}
                <ExternalLink className="h-5 w-5" strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] border border-white/70 bg-white/82 px-4 py-3 text-sm text-slate-500 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
        <p>
          {showAdvancedTools
            ? clienteEmail.trim()
              ? modeCopy.sendHint(clienteEmail)
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
    </>
  );
}
