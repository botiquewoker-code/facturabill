"use client";

import Link from "next/link";
import { Download, Send } from "lucide-react";

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
  enviar: () => void;
  guestModeCopy: GuestModeCopy;
  iva: number;
  isDocumentActionPending: boolean;
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
  enviar,
  guestModeCopy,
  iva,
  isDocumentActionPending,
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
