"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, CircleAlert, LifeBuoy, Send } from "lucide-react";
import { AccountActionShell } from "@/features/support/AccountActionShell";
import { useAppI18n } from "@/features/i18n/runtime";

export default function SoportePage() {
  const { t } = useAppI18n();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [urgente, setUrgente] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const copy = {
    error: t({
      es: "No se pudo enviar la consulta. Intentalo de nuevo en unos minutos.",
      en: "Unable to send the request. Try again in a few minutes.",
    }),
    backLabel: t({ es: "Volver a ajustes", en: "Back to settings" }),
    badge: t({ es: "Soporte", en: "Support" }),
    eyebrow: t({ es: "Ayuda directa", en: "Direct help" }),
    title: t({ es: "Contactar con soporte", en: "Contact support" }),
    description: t({
      es: "Usa este canal cuando tengas un bloqueo real, un error que te impida avanzar o una duda que no se resuelva desde la ayuda.",
      en: "Use this channel when you have a real blocker, an error that prevents progress, or a question that help does not solve.",
    }),
    beforeWriting: t({ es: "Antes de escribir", en: "Before you write" }),
    beforeItems: [
      t({ es: "Describe que estabas haciendo justo antes del problema.", en: "Describe what you were doing right before the issue." }),
      t({ es: "Indica si estabas creando una factura, enviando un email o editando un borrador.", en: "Mention whether you were creating an invoice, sending an email, or editing a draft." }),
      t({ es: "Si es urgente, marca la casilla para priorizar la revision.", en: "If it is urgent, tick the box to prioritise the review." }),
    ],
    form: t({ es: "Formulario", en: "Form" }),
    sendRequest: t({ es: "Enviar consulta", en: "Send request" }),
    namePlaceholder: t({ es: "Tu nombre", en: "Your name" }),
    emailPlaceholder: t({ es: "Tu email", en: "Your email" }),
    messagePlaceholder: t({ es: "Describe tu problema o consulta", en: "Describe your issue or question" }),
    urgentHint: t({
      es: "Marca esta opcion si el problema te impide facturar, enviar o recuperar un documento.",
      en: "Tick this option if the problem prevents you from invoicing, sending, or recovering a document.",
    }),
    sending: t({ es: "Enviando...", en: "Sending..." }),
    sentEyebrow: t({ es: "Consulta enviada", en: "Request sent" }),
    sentTitle: t({ es: "Hemos recibido tu mensaje", en: "We have received your message" }),
    sentDescription: t({
      es: "Revisaremos tu consulta y te responderemos lo antes posible.",
      en: "We will review your request and reply as soon as possible.",
    }),
    backToSettings: t({ es: "Volver a ajustes", en: "Back to settings" }),
    newRequest: t({ es: "Nueva consulta", en: "New request" }),
    selfHelpTitle: t({ es: "Si prefieres autoayuda", en: "If you prefer self-help" }),
    selfHelpDescription: t({
      es: "Antes de abrir una incidencia puedes revisar la guia de ayuda y las preguntas frecuentes.",
      en: "Before opening an issue, you can review the help guide and frequently asked questions.",
    }),
    openHelpCenter: t({ es: "Abrir centro de ayuda", en: "Open help centre" }),
  };

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
      icon={LifeBuoy}
      backLabel={copy.backLabel}
    >
      <section className="mt-6 rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_16px_32px_-24px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:rounded-[30px] sm:p-5 sm:shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          {copy.beforeWriting}
        </p>
        <div className="mt-4 space-y-3 text-[14px] leading-6 text-slate-600">
          {copy.beforeItems.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_16px_32px_-24px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:rounded-[30px] sm:p-5 sm:shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
        {!enviado ? (
          <form onSubmit={enviarConsulta} className="space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {copy.form}
              </p>
              <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em] text-slate-950">
                {copy.sendRequest}
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

            <label className="flex items-start gap-3 rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={urgente}
                onChange={() => setUrgente((current) => !current)}
                className="mt-1"
              />
              <span>
                {copy.urgentHint}
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
              {isSending ? copy.sending : copy.sendRequest}
            </button>
          </form>
        ) : (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
              {copy.sentEyebrow}
            </p>
            <h2 className="mt-2 text-[1.08rem] sm:text-[1.2rem] font-semibold tracking-[-0.03em] text-emerald-900">
              {copy.sentTitle}
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-emerald-800">
              {copy.sentDescription}
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
                {copy.newRequest}
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
              {copy.selfHelpTitle}
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              {copy.selfHelpDescription}
            </p>
            <Link
              href="/ayuda"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8a5a33]"
            >
              {copy.openHelpCenter}
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>
    </AccountActionShell>
  );
}
