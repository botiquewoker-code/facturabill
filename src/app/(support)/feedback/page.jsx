"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Lightbulb, Send, Sparkles } from "lucide-react";
import { AccountActionShell } from "@/features/support/AccountActionShell";

export default function FeedbackPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const enviarSugerencia = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      if (!response.ok) {
        throw new Error("feedback_request_failed");
      }

      setEnviado(true);
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch {
      setError(
        "No se pudo enviar el feedback. Intentalo de nuevo dentro de unos minutos.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AccountActionShell
      badge="Feedback"
      eyebrow="Producto"
      title="Sugerencias y mejoras"
      description="Este espacio sirve para reportar fricciones del producto, contar que te falta o proponer cambios concretos."
      icon={Sparkles}
    >
      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#8a5a33] text-white shadow-[0_16px_26px_-18px_rgba(138,90,51,0.78)]">
            <Lightbulb className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Enfoque util
            </p>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              Cuanto mas concreto sea el comentario, mas facil sera priorizarlo:
              que esperabas hacer, que paso y que cambio te ayudaria.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        {!enviado ? (
          <form onSubmit={enviarSugerencia} className="space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Formulario
              </p>
              <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em] text-slate-950">
                Enviar feedback
              </h2>
            </div>

            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Tu nombre (opcional)"
              className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-300"
            />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Tu email (opcional)"
              className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-300"
            />

            <textarea
              rows={5}
              value={mensaje}
              onChange={(event) => setMensaje(event.target.value)}
              placeholder="Que mejorarias o que no ha funcionado como esperabas"
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300"
              required
            />

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
              {isSending ? "Enviando..." : "Enviar sugerencia"}
            </button>
          </form>
        ) : (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
              Feedback enviado
            </p>
            <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-emerald-900">
              Gracias por compartirlo
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-emerald-800">
              {nombre
                ? `${nombre}, hemos recibido tu mensaje y lo revisaremos.`
                : "Hemos recibido tu mensaje y lo revisaremos para mejorar Facturabill."}
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
                Enviar otro
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-[30px] border border-[#edcfab] bg-[#fff5e9] p-5 shadow-[0_20px_40px_-30px_rgba(138,90,51,0.32)]">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#9a6338]">
          Si es un bloqueo
        </p>
        <p className="mt-2 text-[14px] leading-6 text-slate-600">
          Si el problema te impide facturar o enviar documentos, usa soporte en
          lugar de feedback para priorizar la incidencia.
        </p>
        <Link
          href="/soporte"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8a5a33]"
        >
          Ir a soporte
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </section>
    </AccountActionShell>
  );
}
