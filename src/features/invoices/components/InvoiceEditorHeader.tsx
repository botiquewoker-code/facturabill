"use client";

import { CalendarDays, Save } from "lucide-react";

type DocumentMetaLike = {
  supportsSecondaryDate: boolean;
  primaryDateLabel: string;
  secondaryDateLabel: string;
  currentSecondaryDateLabel: string;
};

type HeaderCopy = {
  workspace: string;
  title: string;
  subtitle: string;
  dateSectionTitle: string;
  dateSectionDescription: string;
  documentNumberLabel: string;
};

type UiCopy = {
  document: string;
  lastSaved: string;
  noneSaved: string;
  noDate: string;
};

type Props = {
  documentMeta: DocumentMetaLike;
  documentPrefix: string;
  formattedDueDate: string;
  handleNumeroFacturaChange: (value: string) => void;
  inputClass: string;
  modeCopy: HeaderCopy;
  numeroFactura: string;
  numeroFacturaActual: string;
  saveDraftNow: () => void;
  setFecha: (value: string) => void;
  setFechaVencimiento: (value: string) => void;
  setNumeroFactura: (value: string) => void;
  showAdvancedTools: boolean;
  uiCopy: UiCopy;
  ultimoNumeroGuardado: string;
  fecha: string;
  fechaVencimiento: string;
};

export default function InvoiceEditorHeader({
  documentMeta,
  documentPrefix,
  formattedDueDate,
  handleNumeroFacturaChange,
  inputClass,
  modeCopy,
  numeroFactura,
  numeroFacturaActual,
  saveDraftNow,
  setFecha,
  setFechaVencimiento,
  setNumeroFactura,
  showAdvancedTools,
  uiCopy,
  ultimoNumeroGuardado,
  fecha,
  fechaVencimiento,
}: Props) {
  return (
    <>
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            {modeCopy.workspace}
          </p>
          <h1 className="mt-2 text-[1.78rem] sm:text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
            {modeCopy.title}
          </h1>
          <p className="mt-3 max-w-xs text-[14px] leading-5 sm:text-[15px] sm:leading-6 text-slate-500">
            {modeCopy.subtitle}
          </p>
        </div>
        {showAdvancedTools ? (
          <button
            type="button"
            onClick={saveDraftNow}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)] transition hover:bg-slate-800"
          >
            <Save className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </button>
        ) : null}
      </header>

      <section className="mt-5 rounded-[26px] border border-white/70 bg-white/76 p-4 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:rounded-[34px] sm:p-6 sm:shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)]">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
            <CalendarDays className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              {uiCopy.document}
            </p>
            <h3 className="mt-2 text-[1.18rem] sm:text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
              {modeCopy.dateSectionTitle}
            </h3>
            <p className="mt-2 max-w-xs text-[14px] leading-6 text-slate-500">
              {modeCopy.dateSectionDescription}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-slate-200 bg-white/85 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
            {modeCopy.documentNumberLabel}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold tracking-[0.16em] text-slate-600">
              {documentPrefix}-
            </span>
            <input
              type="text"
              value={numeroFactura}
              onChange={(event) => handleNumeroFacturaChange(event.target.value)}
              onBlur={() => setNumeroFactura(numeroFacturaActual)}
              placeholder="001"
              autoCapitalize="characters"
              spellCheck={false}
              className={`${inputClass} h-12`}
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <span>{uiCopy.lastSaved}</span>
            <span className="font-semibold text-slate-900">
              {ultimoNumeroGuardado
                ? `${documentPrefix}-${ultimoNumeroGuardado}`
                : uiCopy.noneSaved}
            </span>
          </div>
        </div>

        <div
          className={`mt-4 grid gap-3 ${
            documentMeta.supportsSecondaryDate ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              {documentMeta.primaryDateLabel}
            </span>
            <input
              type="date"
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
              className={inputClass}
            />
          </label>
          {documentMeta.supportsSecondaryDate ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600">
                {documentMeta.secondaryDateLabel}
              </span>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(event) => setFechaVencimiento(event.target.value)}
                className={inputClass}
              />
            </label>
          ) : null}
        </div>

        {documentMeta.supportsSecondaryDate ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <span>{documentMeta.currentSecondaryDateLabel}</span>
            <span className="font-semibold text-slate-900">
              {formattedDueDate || uiCopy.noDate}
            </span>
          </div>
        ) : null}
      </section>
    </>
  );
}
