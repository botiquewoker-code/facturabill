"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Fingerprint, ListChecks, ShieldCheck } from "lucide-react";
import {
  ensureVerifactuInstallationId,
  readVerifactuEvents,
  readVerifactuRecords,
} from "@/features/verifactu/storage";
import type {
  VerifactuEvent,
  VerifactuRecord,
  VerifactuRecordStatus,
} from "@/features/verifactu/types";

const statusLabel: Record<VerifactuRecordStatus, string> = {
  prepared: "Preparado",
  queued: "En cola",
  sent: "Enviado",
  accepted: "Aceptado",
  rejected: "Rechazado",
  error: "Error",
};

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
    installationId: ensureVerifactuInstallationId(),
    records: readVerifactuRecords(),
    events: readVerifactuEvents(),
  };
}

function formatDate(value: string | undefined) {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);
}

export default function AjustesVerifactuPage() {
  const [installationId, setInstallationId] = useState("");
  const [records, setRecords] = useState<VerifactuRecord[]>([]);
  const [events, setEvents] = useState<VerifactuEvent[]>([]);

  useEffect(() => {
    const refresh = () => {
      const snapshot = readVerifactuSnapshot();
      setInstallationId(snapshot.installationId);
      setRecords(snapshot.records);
      setEvents(snapshot.events);
    };

    refresh();
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const preparedCount = records.filter((record) => record.status === "prepared").length;
  const errorCount = records.filter((record) => record.status === "error").length;
  const lastRecord = records[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#f2f4f6_52%,#eef1f4_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_transparent_72%)]" />
      <div className="pointer-events-none absolute -left-8 top-16 h-24 w-24 rounded-full bg-[#efe2d3]/42 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-24 h-24 w-24 rounded-full bg-[#dde6f1]/65 blur-3xl" />

      <main className="relative mx-auto min-h-screen w-full max-w-[430px] px-4 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
        <header className="px-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/ajustes"
              aria-label="Back to settings"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </Link>

            <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
              PREPARACION LOCAL
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Cumplimiento
            </p>
            <h1 className="mt-2 text-[2.05rem] font-semibold tracking-[-0.055em] text-slate-950">
              VeriFactu
            </h1>
            <p className="mt-3 max-w-[19rem] text-[14px] leading-6 text-slate-500">
              Esta pantalla prepara y audita los registros de factura en este
              dispositivo. La remision real a AEAT y la persistencia en base de
              datos se conectaran despues.
            </p>
          </div>
        </header>

        <section className="mt-6 rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Estado de preparacion
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                Encadenado local, huella SHA-256, borrador XML y vista previa QR.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Registros
              </p>
              <p className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                {records.length}
              </p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Preparados
              </p>
              <p className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                {preparedCount}
              </p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Errores
              </p>
              <p className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                {errorCount}
              </p>
            </article>
          </div>

          <div className="mt-5 rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,0.96))] p-4">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              <Fingerprint className="h-4 w-4" strokeWidth={2.2} />
              Instalacion local
            </div>
            <p className="mt-2 break-all text-[13px] leading-6 text-slate-600">
              {installationId || "Pendiente"}
            </p>
            {lastRecord ? (
              <p className="mt-3 text-[13px] leading-6 text-slate-500">
                Ultima factura preparada: {lastRecord.invoiceNumber} el{" "}
                {formatDate(lastRecord.generatedAt)}.
              </p>
            ) : (
              <p className="mt-3 text-[13px] leading-6 text-slate-500">
                Todavia no hay facturas emitidas con preparacion local.
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff] text-slate-700">
              <ListChecks className="h-[17px] w-[17px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Cola local de registros
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                Cada factura se prepara una vez y conserva su encadenado local.
              </p>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/75 p-5 text-[14px] leading-6 text-slate-500">
              Cuando descargues o envies una factura desde el editor, aparecera
              aqui con su huella, QR preliminar y XML de preparacion.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {records.map((record) => (
                <article
                  key={record.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/75 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Factura
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
                      <span>Emitida</span>
                      <span className="font-semibold text-slate-950">
                        {record.issueDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Total</span>
                      <span className="font-semibold text-slate-950">
                        {formatAmount(record.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Origen</span>
                      <span className="font-semibold text-slate-950">
                        {record.sourceAction === "emailed"
                          ? "Envio"
                          : record.sourceAction === "downloaded"
                            ? "Descarga"
                            : "Guardado"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[20px] border border-slate-200 bg-white px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Huella local
                    </p>
                    <p className="mt-2 break-all text-[12px] leading-5 text-slate-600">
                      {record.fingerprint}
                    </p>
                    <p className="mt-2 text-[12px] leading-5 text-slate-500">
                      {record.qr.previewText}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <p className="text-sm font-semibold text-slate-950">Actividad reciente</p>
          <p className="mt-1 text-[13px] leading-5 text-slate-500">
            Trazabilidad local de la preparacion antes de moverla a backend real.
          </p>

          {events.length === 0 ? (
            <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/75 p-5 text-[14px] leading-6 text-slate-500">
              Todavia no hay eventos registrados.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {events.slice(0, 8).map((event) => (
                <article
                  key={event.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/75 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">
                      {event.detail}
                    </p>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {event.type.replace(/_/g, " ")}
                    </span>
                  </div>
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
