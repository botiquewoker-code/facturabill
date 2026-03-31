"use client";

import Link from "next/link";
import {
  ArrowRight,
  CircleHelp,
  FileText,
  Mail,
  ReceiptText,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { AccountActionShell } from "@/features/support/AccountActionShell";
import { useAppI18n } from "@/features/i18n/runtime";

export default function AyudaPage() {
  const { t } = useAppI18n();
  const faqItems = [
    {
      title: t({ es: "Como crear una factura", en: "How to create an invoice" }),
      icon: ReceiptText,
      content: [
        t({ es: "Rellena los datos de tu empresa y del cliente.", en: "Fill in your company and client details." }),
        t({ es: "Anade los conceptos con cantidad y precio unitario.", en: "Add line items with quantity and unit price." }),
        t({ es: "Selecciona el tipo de IVA aplicable.", en: "Select the applicable VAT type." }),
        t({ es: "Revisa totales, fecha y vencimiento si corresponde.", en: "Review totals, date, and due date if applicable." }),
        t({ es: 'Pulsa "Descargar PDF" o "Enviar email" para finalizar.', en: 'Press "Download PDF" or "Send email" to finish.' }),
      ],
    },
    {
      title: t({ es: "Que puedes personalizar", en: "What you can customise" }),
      icon: Sparkles,
      content: [
        t({ es: "Elegir entre diferentes plantillas.", en: "Choose between different templates." }),
        t({ es: "Anadir notas predeterminadas desde el perfil de empresa.", en: "Add default notes from the company profile." }),
        t({ es: "Configurar logo, datos de empresa y estilo base.", en: "Configure logo, company data, and base style." }),
      ],
    },
    {
      title: t({ es: "Compatibilidad y dispositivos", en: "Compatibility and devices" }),
      icon: Smartphone,
      content: [
        t({ es: "Facturabill esta pensado para movil, tablet y escritorio.", en: "Facturabill is designed for mobile, tablet, and desktop." }),
        t({ es: "Antes de enviar documentos importantes, revisa siempre el PDF final.", en: "Before sending important documents, always review the final PDF." }),
      ],
    },
    {
      title: t({ es: "Disponibilidad de tu informacion", en: "Availability of your information" }),
      icon: CircleHelp,
      content: [
        t({ es: "Antes de seguir trabajando, confirma que ves tus documentos y clientes habituales.", en: "Before continuing, confirm that you can see your usual documents and clients." }),
        t({ es: "Si vas a cambiar de equipo o navegador, exporta una copia desde ajustes para conservar tu informacion.", en: "If you are changing device or browser, export a copy from settings to preserve your information." }),
        t({ es: "Revisa siempre que tus datos esten disponibles antes de enviar o descargar documentos importantes.", en: "Always check that your data is available before sending or downloading important documents." }),
      ],
    },
    {
      title: t({ es: "Edicion de documentos anteriores", en: "Editing previous documents" }),
      icon: FileText,
      content: [
        t({ es: "Puedes recuperar borradores y reutilizar presupuestos desde el historial.", en: "You can recover drafts and reuse quotes from history." }),
        t({ es: "Para documentos ya enviados, recomendamos conservar el PDF y generar una nueva version si necesitas cambios.", en: "For already sent documents, we recommend keeping the PDF and generating a new version if you need changes." }),
      ],
    },
  ];

  const copy = {
    backLabel: t({ es: "Volver a ajustes", en: "Back to settings" }),
    badge: t({ es: "Ayuda", en: "Help" }),
    eyebrow: t({ es: "Centro de ayuda", en: "Help centre" }),
    title: t({ es: "Preguntas frecuentes", en: "Frequently asked questions" }),
    description: t({
      es: "Una guia rapida para resolver dudas comunes sobre facturas, PDF, borradores y uso diario.",
      en: "A quick guide to solve common questions about invoices, PDFs, drafts, and daily use.",
    }),
    contact: t({ es: "Contacto", en: "Contact" }),
    needMoreHelp: t({ es: "Necesitas ayuda adicional", en: "Need extra help" }),
    needMoreHelpDescription: t({
      es: "Si tu caso no aparece aqui, abre una consulta desde soporte o comparte el problema con detalle para que podamos revisarlo.",
      en: "If your case does not appear here, open a support request or share the problem in detail so we can review it.",
    }),
    goToSupport: t({ es: "Ir a soporte", en: "Go to support" }),
    sendFeedback: t({ es: "Enviar feedback", en: "Send feedback" }),
  };

  return (
    <AccountActionShell
      badge={copy.badge}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      icon={CircleHelp}
      backLabel={copy.backLabel}
    >
      <section className="mt-6 space-y-4">
        {faqItems.map(({ title, icon: Icon, content }) => (
          <article
            key={title}
            className="rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_16px_26px_-18px_rgba(15,23,42,0.82)]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
              <div className="min-w-0">
                <h2 className="text-[1.1rem] font-semibold tracking-[-0.03em] text-slate-950">
                  {title}
                </h2>
                <ul className="mt-3 space-y-2 text-[14px] leading-6 text-slate-600">
                  {content.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#8a5a33] text-white shadow-[0_16px_26px_-18px_rgba(138,90,51,0.78)]">
            <Mail className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              {copy.contact}
            </p>
            <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950">
              {copy.needMoreHelp}
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-slate-500">
              {copy.needMoreHelpDescription}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href="/soporte"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
          >
            {copy.goToSupport}
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
          <Link
            href="/feedback"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copy.sendFeedback}
          </Link>
        </div>
      </section>
    </AccountActionShell>
  );
}
