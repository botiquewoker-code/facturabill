import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

type AccountActionShellProps = {
  badge: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  backHref?: string;
};

export function AccountActionShell({
  badge,
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
  backHref = "/ajustes",
}: AccountActionShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-center justify-between gap-4">
          <Link
            href={backHref}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
          >
            <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </Link>

          <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
            {badge}
          </div>
        </header>

        <section className="mt-6 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <Icon className="h-5 w-5" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
                {title}
              </h1>
              <p className="mt-3 text-[15px] leading-6 text-slate-500">
                {description}
              </p>
            </div>
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}
