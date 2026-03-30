import Link from "next/link";
import {
  ArrowRight,
  CircleHelp,
  Database,
  FileText,
  Mail,
  ReceiptText,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { AccountActionShell } from "@/features/support/AccountActionShell";

const faqItems = [
  {
    title: "Como crear una factura",
    icon: ReceiptText,
    content: [
      "Rellena los datos de tu empresa y del cliente.",
      "Anade los conceptos con cantidad y precio unitario.",
      "Selecciona el tipo de IVA aplicable.",
      "Revisa totales, fecha y vencimiento si corresponde.",
      'Pulsa "Descargar PDF" o "Enviar email" para finalizar.',
    ],
  },
  {
    title: "Que puedes personalizar",
    icon: Sparkles,
    content: [
      "Elegir entre diferentes plantillas.",
      "Anadir notas predeterminadas desde el perfil de empresa.",
      "Configurar logo, datos de empresa y estilo base.",
    ],
  },
  {
    title: "Compatibilidad y dispositivos",
    icon: Smartphone,
    content: [
      "Facturabill esta pensado para movil, tablet y escritorio.",
      "Antes de enviar documentos importantes, revisa siempre el PDF final.",
    ],
  },
  {
    title: "Donde se guardan los datos",
    icon: Database,
    content: [
      "Muchas funciones usan almacenamiento local del navegador.",
      "Eso implica que tus datos pueden no aparecer en otro dispositivo.",
      "Tambien pueden perderse si borras el almacenamiento del navegador.",
    ],
  },
  {
    title: "Edicion de documentos anteriores",
    icon: FileText,
    content: [
      "Puedes recuperar borradores y reutilizar presupuestos desde el historial.",
      "Para documentos ya enviados, recomendamos conservar el PDF y generar una nueva version si necesitas cambios.",
    ],
  },
];

export default function AyudaPage() {
  return (
    <AccountActionShell
      badge="Ayuda"
      eyebrow="Centro de ayuda"
      title="Preguntas frecuentes"
      description="Una guia rapida para resolver dudas comunes sobre facturas, PDFs, borradores y almacenamiento."
      icon={CircleHelp}
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
              Contacto
            </p>
            <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950">
              Necesitas ayuda adicional
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-slate-500">
              Si tu caso no aparece aqui, abre una consulta desde soporte o
              comparte el problema con detalle para que podamos revisarlo.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href="/soporte"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
          >
            Ir a soporte
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
          <Link
            href="/feedback"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Enviar feedback
          </Link>
        </div>
      </section>
    </AccountActionShell>
  );
}
