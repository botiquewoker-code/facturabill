"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ListChecks, ShieldCheck } from "lucide-react";
import {
  readVerifactuEvents,
  readVerifactuRecords,
  readVerifactuSettings,
  writeVerifactuSettings,
} from "@/features/verifactu/storage";
import {
  formatCurrencyByLanguage,
  formatDateTimeByLanguage,
} from "@/features/i18n/core";
import { useAppI18n } from "@/features/i18n/runtime";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import type {
  VerifactuEvent,
  VerifactuRecord,
  VerifactuRecordStatus,
  VerifactuSettings,
} from "@/features/verifactu/types";

const statusClass: Record<VerifactuRecordStatus, string> = {
  prepared: "border border-sky-200 bg-sky-50 text-sky-700",
  queued: "border border-amber-200 bg-amber-50 text-amber-700",
  sent: "border border-indigo-200 bg-indigo-50 text-indigo-700",
  accepted: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border border-red-200 bg-red-50 text-red-700",
  error: "border border-red-200 bg-red-50 text-red-700",
};

function readVerifactuSnapshot() {
  return {
    records: readVerifactuRecords(),
    events: readVerifactuEvents(),
  };
}


export default function AjustesVerifactuPage() {
  const searchParams = useSearchParams();
  const { language, t } = useAppI18n();
  const [records, setRecords] = useState<VerifactuRecord[]>([]);
  const [events, setEvents] = useState<VerifactuEvent[]>([]);
  const [settings, setSettings] = useState<VerifactuSettings>(() =>
    readVerifactuSettings(),
  );
  const focusedRecordId = searchParams.get("focus") || "";

  const statusLabel: Record<VerifactuRecordStatus, string> = {
    prepared: t({ es: "Lista", en: "Ready" }),
    queued: t({ es: "En proceso", en: "In progress" }),
    sent: t({ es: "Enviada", en: "Sent" }),
    accepted: t({ es: "Aceptada", en: "Accepted" }),
    rejected: t({ es: "Por revisar", en: "Needs review" }),
    error: t({ es: "Incidencia", en: "Issue" }),
  };
  const copy = {
    noDate: t({ es: "Sin fecha", en: "No date" }),
    sentToClient: t({ es: "Enviada al cliente", en: "Sent to client" }),
    downloaded: t({ es: "Descargada", en: "Downloaded" }),
    saved: t({ es: "Guardada", en: "Saved" }),
    activityPrepared: t({ es: "lista para su seguimiento.", en: "ready for tracking." }),
    activityStatusChanged: t({ es: "Se ha actualizado el estado de la factura", en: "The status of invoice has been updated" }),
    activityPreparedGeneric: t({ es: "Factura lista para su seguimiento.", en: "Invoice ready for tracking." }),
    activityStatusChangedGeneric: t({ es: "Se ha actualizado el estado de una factura.", en: "The status of an invoice has been updated." }),
    activityGeneric: t({ es: "Se ha registrado una nueva actividad en VeriFactu.", en: "A new VeriFactu activity has been recorded." }),
    backToSettings: t({ es: "Volver a ajustes", en: "Back to settings" }),
    badge: t({ es: "VERIFACTU", en: "VERIFACTU" }),
    eyebrow: t({ es: "Cumplimiento", en: "Compliance" }),
    title: t({ es: "Seguimiento VeriFactu", en: "VeriFactu tracking" }),
    description: t({
      es: "Consulta el estado de tus facturas y revisa rapidamente cualquier incidencia pendiente.",
      en: "Check the status of your invoices and quickly review any pending issue.",
    }),
    submissionTitle: t({
      es: "Envio a Hacienda",
      en: "Submission to the tax agency",
    }),
    submissionDescription: t({
      es: "Activa el envio automatico para que las nuevas facturas se tramiten directamente.",
      en: "Enable automatic submission so new invoices are processed directly.",
    }),
    submissionEnabled: t({ es: "Activo", en: "Enabled" }),
    submissionDisabled: t({ es: "Desactivado", en: "Disabled" }),
    submissionToggle: t({
      es: "Activar envio a Hacienda",
      en: "Enable submission to the tax agency",
    }),
    submissionHint: t({
      es: "Las nuevas facturas VeriFactu pasaran automaticamente a envio en proceso.",
      en: "New VeriFactu invoices will automatically move into sending in progress.",
    }),
    submissionComplianceNote: t({
      es: "Podras revisar aqui el estado de envio de cada factura en todo momento.",
      en: "You will be able to review the submission status of each invoice here at any time.",
    }),
    submissionSavedOn: t({ es: "Ultima actualizacion", en: "Last update" }),
    submissionEnabledToast: t({
      es: "Envio a Hacienda activado",
      en: "Submission to the tax agency enabled",
    }),
    submissionDisabledToast: t({
      es: "Envio a Hacienda desactivado",
      en: "Submission to the tax agency disabled",
    }),
    submissionSaveError: t({
      es: "No se pudo actualizar la configuracion de envio VeriFactu",
      en: "Unable to update the VeriFactu submission settings",
    }),
    summaryTitle: t({ es: "Resumen de seguimiento", en: "Tracking summary" }),
    summaryDescription: t({
      es: "Mira de un vistazo cuantas facturas estan listas y cuales necesitan atencion.",
      en: "See at a glance how many invoices are ready and which ones need attention.",
    }),
    invoices: t({ es: "Facturas", en: "Invoices" }),
    ready: t({ es: "Listas", en: "Ready" }),
    inQueue: t({ es: "En proceso", en: "In progress" }),
    issues: t({ es: "Incidencias", en: "Issues" }),
    latestInvoiceUpdated: t({ es: "Ultima factura actualizada:", en: "Last updated invoice:" }),
    onDate: t({ es: "el", en: "on" }),
    noTrackedInvoices: t({ es: "Todavia no hay facturas con seguimiento disponible.", en: "There are no invoices with available tracking yet." }),
    recentInvoices: t({ es: "Facturas recientes", en: "Recent invoices" }),
    recentInvoicesDescription: t({
      es: "Cada factura aparecera aqui con su estado y la fecha de la ultima actualizacion.",
      en: "Each invoice appears here with its status and the date of the latest update.",
    }),
    emptyRecentInvoices: t({
      es: "Cuando descargues o envies una factura, podras verla aqui con su estado de seguimiento.",
      en: "When you download or send an invoice, you will see it here with its tracking status.",
    }),
    invoice: t({ es: "Factura", en: "Invoice" }),
    issued: t({ es: "Emitida", en: "Issued" }),
    total: t({ es: "Total", en: "Total" }),
    lastAction: t({ es: "Ultima accion", en: "Last action" }),
    updatedAt: t({ es: "Actualizada", en: "Updated" }),
    issuePending: t({ es: "Hay una incidencia pendiente de revisar en esta factura.", en: "There is a pending issue to review on this invoice." }),
    trackingUpdated: t({ es: "El seguimiento de esta factura esta actualizado.", en: "The tracking for this invoice is up to date." }),
    recentActivity: t({ es: "Actividad reciente", en: "Recent activity" }),
    recentActivityDescription: t({
      es: "Revisa los ultimos movimientos relacionados con tus facturas.",
      en: "Review the latest movements related to your invoices.",
    }),
    emptyActivity: t({ es: "Todavia no hay actividad registrada.", en: "There is no recorded activity yet." }),
  };

  function formatDate(value: string | undefined) {
    return formatDateTimeByLanguage(language, value, copy.noDate);
  }

  function formatAmount(value: number) {
    return formatCurrencyByLanguage(language, value || 0);
  }

  function describeSourceAction(sourceAction: VerifactuRecord["sourceAction"]) {
    if (sourceAction === "emailed") {
      return copy.sentToClient;
    }

    if (sourceAction === "downloaded") {
      return copy.downloaded;
    }

    return copy.saved;
  }

  function describeEvent(event: VerifactuEvent) {
    const invoiceMatch = event.detail.match(/factura\s+([A-Z0-9-]+)/i);
    const invoiceNumber = invoiceMatch?.[1];

    if (event.type === "record_prepared") {
      return invoiceNumber
        ? `${copy.invoice} ${invoiceNumber} ${copy.activityPrepared}`
        : copy.activityPreparedGeneric;
    }

    if (event.type === "record_status_changed") {
      return invoiceNumber
        ? `${copy.activityStatusChanged} ${invoiceNumber}.`
        : copy.activityStatusChangedGeneric;
    }

    if (event.type === "queue_exported") {
      return invoiceNumber
        ? `${copy.invoice} ${invoiceNumber} ${t({
            es: "programada para su envio a Hacienda.",
            en: "scheduled for submission to the tax agency.",
          })}`
        : t({
            es: "Se ha programado una factura para su envio a Hacienda.",
            en: "An invoice has been scheduled for submission to the tax agency.",
          });
    }

    return copy.activityGeneric;
  }

  useEffect(() => {
    const refresh = () => {
      const snapshot = readVerifactuSnapshot();
      setRecords(snapshot.records);
      setEvents(snapshot.events);
      setSettings(readVerifactuSettings());
    };

    refresh();
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    if (!focusedRecordId) {
      return;
    }

    const element = document.getElementById(
      `verifactu-focus-${encodeURIComponent(focusedRecordId)}`,
    );

    if (!element) {
      return;
    }

    window.requestAnimationFrame(() => {
      element.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, [focusedRecordId, records]);

  const readyCount = records.filter((record) => record.status === "prepared").length;
  const queuedCount = records.filter((record) =>
    ["queued", "sent"].includes(record.status),
  ).length;
  const issueCount = records.filter(
    (record) => record.status === "error" || Boolean(record.lastError),
  ).length;
  const lastRecord = records[0];

  function handleToggleSubmission() {
    try {
      const nextSettings: VerifactuSettings = {
        taxAgencyAutoSubmissionEnabled:
          !settings.taxAgencyAutoSubmissionEnabled,
        updatedAt: new Date().toISOString(),
      };

      writeVerifactuSettings(nextSettings);
      setSettings(nextSettings);
      showSuccessToast(
        nextSettings.taxAgencyAutoSubmissionEnabled
          ? copy.submissionEnabledToast
          : copy.submissionDisabledToast,
      );
    } catch (error) {
      console.error("Error saving VeriFactu submission settings", error);
      showWarningToast(copy.submissionSaveError);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#f2f4f6_52%,#eef1f4_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_transparent_72%)]" />
      <div className="pointer-events-none absolute -left-8 top-16 h-24 w-24 rounded-full bg-[#efe2d3]/42 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-24 h-24 w-24 rounded-full bg-[#dde6f1]/65 blur-3xl" />

      <main className="relative mx-auto min-h-screen w-full max-w-[410px] px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-[calc(0.875rem+env(safe-area-inset-top))] sm:max-w-[430px] sm:pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pt-[calc(1rem+env(safe-area-inset-top))]">
        <header className="px-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/ajustes"
              aria-label={copy.backToSettings}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </Link>

            <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
              {copy.badge}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 text-[1.85rem] sm:text-[2.05rem] font-semibold tracking-[-0.055em] text-slate-950">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-[19rem] text-[14px] leading-6 text-slate-500">
              {copy.description}
            </p>
          </div>
        </header>

        <section className="mt-6 rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 sm:shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-950">
                {copy.submissionTitle}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                {copy.submissionDescription}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                settings.taxAgencyAutoSubmissionEnabled
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {settings.taxAgencyAutoSubmissionEnabled
                ? copy.submissionEnabled
                : copy.submissionDisabled}
            </span>
          </div>

          <button
            type="button"
            aria-pressed={settings.taxAgencyAutoSubmissionEnabled}
            onClick={handleToggleSubmission}
            className="mt-5 flex w-full items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,0.96))] px-4 py-4 text-left transition hover:bg-white"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-950">
                {copy.submissionToggle}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                {copy.submissionHint}
              </p>
            </div>
            <span
              className={`relative flex h-8 w-14 shrink-0 items-center rounded-full border transition ${
                settings.taxAgencyAutoSubmissionEnabled
                  ? "border-slate-950 bg-slate-950"
                  : "border-slate-200 bg-slate-100"
              }`}
            >
              <span
                className={`absolute h-6 w-6 rounded-full bg-white shadow-[0_10px_24px_-16px_rgba(15,23,42,0.5)] transition ${
                  settings.taxAgencyAutoSubmissionEnabled
                    ? "left-[1.4rem]"
                    : "left-1"
                }`}
              />
            </span>
          </button>

          <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4">
            <p className="text-[13px] leading-6 text-slate-500">
              {copy.submissionComplianceNote}
            </p>
            {settings.updatedAt ? (
              <p className="mt-2 text-[12px] leading-5 text-slate-400">
                {copy.submissionSavedOn}: {formatDate(settings.updatedAt)}
              </p>
            ) : null}
          </div>
        </section>

        <section className="mt-6 rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 sm:shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)]">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {copy.summaryTitle}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                {copy.summaryDescription}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.invoices}
              </p>
              <p className="mt-2 text-[1.25rem] sm:text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                {records.length}
              </p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.ready}
              </p>
              <p className="mt-2 text-[1.25rem] sm:text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                {readyCount}
              </p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.inQueue}
              </p>
              <p className="mt-2 text-[1.25rem] sm:text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                {queuedCount}
              </p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.issues}
              </p>
              <p className="mt-2 text-[1.25rem] sm:text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                {issueCount}
              </p>
            </article>
          </div>

          <div className="mt-5 rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,0.96))] p-4">
            {lastRecord ? (
              <p className="text-[13px] leading-6 text-slate-500">
                {copy.latestInvoiceUpdated}{" "}
                <span className="font-semibold text-slate-950">
                  {lastRecord.invoiceNumber}
                </span>{" "}
                {copy.onDate} {formatDate(lastRecord.generatedAt)}.
              </p>
            ) : (
              <p className="text-[13px] leading-6 text-slate-500">
                {copy.noTrackedInvoices}
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 sm:shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff] text-slate-700">
              <ListChecks className="h-[17px] w-[17px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {copy.recentInvoices}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                {copy.recentInvoicesDescription}
              </p>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/75 p-5 text-[14px] leading-6 text-slate-500">
              {copy.emptyRecentInvoices}
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {records.map((record) => (
                <article
                  key={record.id}
                  id={`verifactu-focus-${encodeURIComponent(record.id)}`}
                  className={`rounded-[24px] border bg-slate-50/75 p-4 transition ${
                    focusedRecordId && focusedRecordId === record.id
                      ? "border-rose-300 ring-2 ring-rose-200/80"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.invoice}
                      </p>
                      <h2 className="mt-1 text-[1.1rem] font-semibold tracking-[-0.04em] text-slate-950">
                        {record.invoiceNumber}
                      </h2>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass[record.status]}`}
                    >
                      {statusLabel[record.status]}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-[13px] leading-6 text-slate-500">
                    <div className="flex items-center justify-between gap-3">
                      <span>{copy.issued}</span>
                      <span className="font-semibold text-slate-950">
                        {record.issueDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>{copy.total}</span>
                      <span className="font-semibold text-slate-950">
                        {formatAmount(record.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>{copy.lastAction}</span>
                      <span className="font-semibold text-slate-950">
                        {describeSourceAction(record.sourceAction)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>{copy.updatedAt}</span>
                      <span className="font-semibold text-slate-950">
                        {formatDate(record.generatedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[20px] border border-slate-200 bg-white px-3 py-3 text-[12px] leading-5 text-slate-500">
                    {record.status === "error" || record.lastError
                      ? copy.issuePending
                      : copy.trackingUpdated}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 sm:shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)]">
          <p className="text-sm font-semibold text-slate-950">{copy.recentActivity}</p>
          <p className="mt-1 text-[13px] leading-5 text-slate-500">
            {copy.recentActivityDescription}
          </p>

          {events.length === 0 ? (
            <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/75 p-5 text-[14px] leading-6 text-slate-500">
              {copy.emptyActivity}
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {events.slice(0, 8).map((event) => (
                <article
                  key={event.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/75 p-4"
                >
                  <p className="text-sm font-semibold text-slate-950">
                    {describeEvent(event)}
                  </p>
                  <p className="mt-2 text-[12px] leading-5 text-slate-500">
                    {formatDate(event.occurredAt)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
