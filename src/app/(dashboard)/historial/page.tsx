"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, FileText, ReceiptText } from "lucide-react";

type HistoryDocument = {
  id?: string;
  numero?: string;
  tipo?: "factura" | "presupuesto";
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

function money(value: number | undefined) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value) || 0);
}

export default function HistorialPage() {
  const router = useRouter();
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
            <Clock3 className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Historial
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Documentos guardados
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              Revisa facturas y presupuestos recientes y retoma cualquier
              presupuesto para convertirlo en factura.
            </p>
          </div>
        </header>

        {documentos.length === 0 ? (
          <section className="mt-6 rounded-[34px] border border-white/70 bg-white/76 p-6 text-center shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
              Aun no hay documentos
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-slate-500">
              Cuando descargues o envies una factura o un presupuesto, aparecera
              aqui para que puedas consultarlo mas tarde.
            </p>
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {documentos.map((doc, index) => {
              const typeLabel =
                doc.tipo === "presupuesto" ? "Presupuesto" : "Factura";
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
                        {typeLabel}
                      </p>
                      <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                        {displayNumber}
                      </h2>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        doc.tipo === "presupuesto"
                          ? "border border-[#e7c39a] bg-[#fff4e5] text-[#8a5a33]"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {doc.estado || "Guardado"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,245,240,0.92))] p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Cliente</span>
                      <span className="max-w-[60%] truncate text-right font-semibold text-slate-950">
                        {doc.cliente?.nombre || "Sin cliente"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Fecha</span>
                      <span className="font-semibold text-slate-950">
                        {doc.fecha || "Sin fecha"}
                      </span>
                    </div>
                    {doc.tipo === "factura" && doc.fechaVencimiento ? (
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-500">Vencimiento</span>
                        <span className="font-semibold text-slate-950">
                          {doc.fechaVencimiento}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Total</span>
                      <span className="font-semibold text-slate-950">
                        {money(doc.total)}
                      </span>
                    </div>
                    {doc.tipo === "factura" ? (
                      <div className="rounded-[18px] border border-slate-200/80 bg-slate-50/85 px-3 py-3">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-500">VeriFactu</span>
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
                              ? "Preparado"
                              : doc.verifactu?.status === "error"
                                ? "Pendiente"
                                : "Sin preparar"}
                          </span>
                        </div>
                        {doc.verifactu?.fingerprint ? (
                          <p className="mt-2 text-[12px] leading-5 text-slate-500">
                            Esta factura ya tiene su seguimiento actualizado.
                          </p>
                        ) : doc.verifactu?.lastError ? (
                          <p className="mt-2 text-[12px] leading-5 text-red-600">
                            Hay una incidencia pendiente de revisar en esta factura.
                          </p>
                        ) : (
                          <p className="mt-2 text-[12px] leading-5 text-slate-500">
                            El seguimiento se activara cuando emitas la factura.
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {doc.tipo === "presupuesto" ? (
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
                      Convertir en factura
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push("/crear-factura")}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <FileText className="h-4 w-4" strokeWidth={2.2} />
                      Crear otra factura
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
