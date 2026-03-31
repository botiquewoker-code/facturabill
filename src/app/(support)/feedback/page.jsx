"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Lightbulb, Send, Sparkles } from "lucide-react";
import { AccountActionShell } from "@/features/support/AccountActionShell";
import { useAppI18n } from "@/features/i18n/runtime";

export default function FeedbackPage() {
  const { t } = useAppI18n();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const copy = {
    error: t({
      es: "No se pudo enviar el feedback. Intentalo de nuevo dentro de unos minutos.",
      en: "Unable to send the feedback. Try again in a few minutes.",
    }),
    backLabel: t({ es: "Volver a ajustes", en: "Back to settings" }),
    badge: t({ es: "Feedback", en: "Feedback" }),
    eyebrow: t({ es: "Producto", en: "Product" }),
    title: t({ es: "Sugerencias y mejoras", en: "Suggestions and improvements" }),
    description: t({
      es: "Este espacio sirve para reportar fricciones del producto, contar que te falta o proponer cambios concretos.",
      en: "Use this space to report product friction, say what is missing, or propose specific changes.",
    }),
    usefulApproach: t({ es: "Enfoque util", en: "Useful approach" }),
    usefulApproachDescription: t({
      es: "Cuanto mas concreto sea el comentario, mas facil sera priorizarlo: que esperabas hacer, que paso y que cambio te ayudaria.",
      en: "The more specific the comment, the easier it is to prioritise: what you expected to do, what happened, and what change would help.",
    }),
    form: t({ es: "Formulario", en: "Form" }),
    sendFeedback: t({ es: "Enviar feedback", en: "Send feedback" }),
    namePlaceholder: t({ es: "Tu nombre (opcional)", en: "Your name (optional)" }),
    emailPlaceholder: t({ es: "Tu email (opcional)", en: "Your email (optional)" }),
    messagePlaceholder: t({
      es: "Que mejorarias o que no ha funcionado como esperabas",
      en: "What would you improve or what did not work as expected",
    }),
    sending: t({ es: "Enviando...", en: "Sending..." }),
    sentEyebrow: t({ es: "Feedback enviado", en: "Feedback sent" }),
    sentTitle: t({ es: "Gracias por compartirlo", en: "Thanks for sharing it" }),
    sentDescriptionWithName: `${nombre}, ${t({ es: "hemos recibido tu mensaje y lo revisaremos.", en: "we have received your message and will review it." })}`,
    sentDescription: t({
      es: "Hemos recibido tu mensaje y lo revisaremos para mejorar Facturabill.",
      en: "We have received your message and will review it to improve Facturabill.",
    }),
    backToSettings: t({ es: "Volver a ajustes", en: "Back to settings" }),
    sendAnother: t({ es: "Enviar otro", en: "Send another" }),
    ifBlocking: t({ es: "Si es un bloqueo", en: "If it is a blocker" }),
    ifBlockingDescription: t({
      es: "Si el problema te impide facturar o enviar documentos, usa soporte en lugar de feedback para priorizar la incidencia.",
      en: "If the problem prevents invoicing or sending documents, use support instead of feedback so the issue can be prioritised.",
    }),
    goToSupport: t({ es: "Ir a soporte", en: "Go to support" }),
  };

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
      setError(copy.error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AccountActionShell
      badge={copy.badge}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      icon={Sparkles}
      backLabel={copy.backLabel}
    >
      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#8a5a33] text-white shadow-[0_16px_26px_-18px_rgba(138,90,51,0.78)]">
            <Lightbulb className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              {copy.usefulApproach}
            </p>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              {copy.usefulApproachDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        {!enviado ? (
          <form onSubmit={enviarSugerencia} className="space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {copy.form}
              </p>
              <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em] text-slate-950">
                {copy.sendFeedback}
              </h2>
            </div>

            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder={copy.namePlaceholder}
              className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-300"
            />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.emailPlaceholder}
              className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-300"
            />

            <textarea
              rows={5}
              value={mensaje}
              onChange={(event) => setMensaje(event.target.value)}
              placeholder={copy.messagePlaceholder}
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
              {isSending ? copy.sending : copy.sendFeedback}
            </button>
          </form>
        ) : (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
              {copy.sentEyebrow}
            </p>
            <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-emerald-900">
              {copy.sentTitle}
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-emerald-800">
              {nombre
                ? copy.sentDescriptionWithName
                : copy.sentDescription}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/ajustes"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {copy.backToSettings}
              </Link>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-200 bg-white px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                {copy.sendAnother}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-[30px] border border-[#edcfab] bg-[#fff5e9] p-5 shadow-[0_20px_40px_-30px_rgba(138,90,51,0.32)]">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#9a6338]">
          {copy.ifBlocking}
        </p>
        <p className="mt-2 text-[14px] leading-6 text-slate-600">
          {copy.ifBlockingDescription}
        </p>
        <Link
          href="/soporte"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8a5a33]"
        >
          {copy.goToSupport}
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </section>
    </AccountActionShell>
  );
}
