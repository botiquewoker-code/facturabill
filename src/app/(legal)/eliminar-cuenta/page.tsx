"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Download, TriangleAlert, X } from "lucide-react";
import { AccountActionShell } from "@/features/support/AccountActionShell";

export default function EliminarCuenta() {
  const [modalOpen, setModalOpen] = useState(false);
  const [requestReady, setRequestReady] = useState(false);

  return (
    <AccountActionShell
      badge="Cuenta"
      eyebrow="Accion sensible"
      title="Eliminar cuenta"
      description="Antes de continuar, revisa el impacto de la eliminacion y exporta tus datos si necesitas conservar una copia."
      icon={TriangleAlert}
    >
      <section className="mt-6 rounded-[30px] border border-red-200 bg-red-50/90 p-5 shadow-[0_20px_40px_-30px_rgba(127,29,29,0.18)]">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-red-700">
          Importante
        </p>
        <ul className="mt-4 space-y-3 text-[14px] leading-6 text-red-800">
          <li>La eliminacion afecta a tu cuenta y a los datos asociados.</li>
          <li>Si necesitas una copia, exporta primero tus datos desde ajustes.</li>
          <li>La solicitud se revisa manualmente antes de completarse.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        {!requestReady ? (
          <>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Proceso
            </p>
            <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em] text-slate-950">
              Preparar solicitud
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-slate-600">
              Cuando confirmes, te llevaremos al canal de soporte para tramitar la eliminacion con contexto y verificar la solicitud.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/ajustes"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Volver a ajustes
              </Link>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(220,38,38,0.45)] transition hover:bg-red-700"
              >
                Solicitar eliminacion
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
              Solicitud preparada
            </p>
            <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em] text-slate-950">
              Siguiente paso: soporte
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-slate-600">
              Ya tienes clara la solicitud. Continua por soporte para completarla y dejar constancia del proceso.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/soporte"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ir a soporte
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <button
                type="button"
                onClick={() => setRequestReady(false)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </section>

      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Download className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div>
            <h2 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-slate-950">
              Antes de eliminar
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              Te recomendamos volver a ajustes y exportar tus datos locales antes
              de iniciar la solicitud.
            </p>
            <Link
              href="/ajustes"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
            >
              Volver a acciones de cuenta
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>

      {modalOpen ? (
        <>
          <button
            type="button"
            aria-label="Cerrar confirmacion"
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/18 backdrop-blur-[2px]"
          />

          <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] px-4 pb-4">
            <section className="rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,252,0.96))] p-5 shadow-[0_34px_80px_-38px_rgba(15,23,42,0.55)] backdrop-blur-xl">
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-200" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                    <TriangleAlert className="h-5 w-5" strokeWidth={2.1} />
                  </span>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                      Confirmacion
                    </p>
                    <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                      Confirmar solicitud
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      No ejecutaremos la eliminacion desde esta pantalla. Prepararemos el siguiente paso para gestionarlo por soporte.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Cerrar"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700"
                >
                  <X className="h-4 w-4" strokeWidth={2.3} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setRequestReady(true);
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Continuar
                </button>
              </div>
            </section>
          </div>
        </>
      ) : null}
    </AccountActionShell>
  );
}
