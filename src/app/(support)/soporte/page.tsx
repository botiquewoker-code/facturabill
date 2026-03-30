"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, CircleAlert, LifeBuoy, Send } from "lucide-react";
import { AccountActionShell } from "@/features/support/AccountActionShell";

export default function SoportePage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [urgente, setUrgente] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const enviarConsulta = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/soporte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, mensaje, urgente }),
      });

      if (!response.ok) {
        throw new Error("support_request_failed");
      }

      setEnviado(true);
      setNombre("");
      setEmail("");
      setMensaje("");
      setUrgente(false);
    } catch {
      setError(
        "No se pudo enviar la consulta. Intentalo de nuevo en unos minutos.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AccountActionShell
      badge="Soporte"
      eyebrow="Ayuda directa"
      title="Contactar con soporte"
      description="Usa este canal cuando tengas un bloqueo real, un error que te impida avanzar o una duda que no se resuelva desde la ayuda."
      icon={LifeBuoy}
    >
      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          Antes de escribir
        </p>
        <div className="mt-4 space-y-3 text-[14px] leading-6 text-slate-600">
          <p>Describe que estabas haciendo justo antes del problema.</p>
          <p>Indica si estabas creando una factura, enviando un email o editando un borrador.</p>
          <p>Si es urgente, marca la casilla para priorizar la revision.</p>
        </div>
      </section>

      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        {!enviado ? (
          <form onSubmit={enviarConsulta} className="space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Formulario
              </p>
              <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em] text-slate-950">
                Enviar consulta
              </h2>
            </div>

            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Tu nombre"
              className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-300"
            />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Tu email"
              className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-300"
            />

            <textarea
              rows={5}
              value={mensaje}
              onChange={(event) => setMensaje(event.target.value)}
              placeholder="Describe tu problema o consulta"
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300"
              required
            />

            <label className="flex items-start gap-3 rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={urgente}
                onChange={() => setUrgente((current) => !current)}
                className="mt-1"
              />
              <span>
                Marca esta opcion si el problema te impide facturar, enviar o recuperar un documento.
              </span>
            </label>

            {error ? (
              <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send className="h-4 w-4" strokeWidth={2.2} />
              {isSending ? "Enviando..." : "Enviar consulta"}
            </button>
          </form>
        ) : (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
              Consulta enviada
            </p>
            <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-emerald-900">
              Hemos recibido tu mensaje
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-emerald-800">
              Revisaremos tu consulta y te responderemos lo antes posible.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/ajustes"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Volver a ajustes
              </Link>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-200 bg-white px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Nueva consulta
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-[30px] border border-[#edcfab] bg-[#fff5e9] p-5 shadow-[0_20px_40px_-30px_rgba(138,90,51,0.32)]">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#8a5a33] text-white">
            <CircleAlert className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div>
            <h2 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-slate-950">
              Si prefieres autoayuda
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              Antes de abrir una incidencia puedes revisar la guia de ayuda y las preguntas frecuentes.
            </p>
            <Link
              href="/ayuda"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8a5a33]"
            >
              Abrir centro de ayuda
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>
    </AccountActionShell>
  );
}
