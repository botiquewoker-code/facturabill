import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { AccountActionShell } from "@/features/support/AccountActionShell";

type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalDocumentPageProps = {
  badge: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  sections: LegalSection[];
  updatedAt: string;
};

export function LegalDocumentPage({
  badge,
  eyebrow,
  title,
  description,
  icon,
  sections,
  updatedAt,
}: LegalDocumentPageProps) {
  return (
    <AccountActionShell
      badge={badge}
      eyebrow={eyebrow}
      title={title}
      description={description}
      icon={icon}
      backLabel="Volver a ajustes"
    >
      <section className="mt-6 space-y-4">
        {sections.map((section, index) => (
          <article
            key={section.title}
            className="rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_16px_26px_-18px_rgba(15,23,42,0.82)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h2 className="text-[1.08rem] font-semibold tracking-[-0.03em] text-slate-950">
                  {section.title}
                </h2>

                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 text-[14px] leading-6 text-slate-600"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets?.length ? (
                  <ul className="mt-3 space-y-2 text-[14px] leading-6 text-slate-600">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          Revision
        </p>
        <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950">
          Documento actualizado
        </h2>
        <p className="mt-3 text-[14px] leading-6 text-slate-500">
          Ultima actualizacion: {updatedAt}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href="/ajustes"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Volver a ajustes
          </Link>
          <Link
            href="/soporte"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
          >
            Soporte
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </section>
    </AccountActionShell>
  );
}
