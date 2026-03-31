"use client";

type AppScreenLoaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  cards?: number;
};

export default function AppScreenLoader({
  eyebrow,
  title,
  description,
  cards = 3,
}: AppScreenLoaderProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
      >
        <header>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
            {title}
          </h1>
          <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
            {description}
          </p>
        </header>

        <section aria-busy="true" className="mt-6 space-y-4">
          {Array.from({ length: cards }, (_, index) => (
            <div
              key={index}
              className="rounded-[34px] border border-white/70 bg-white/72 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl"
            >
              <div className="flex animate-pulse items-start gap-4">
                <div className="h-16 w-16 rounded-[24px] bg-slate-200/70" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-32 rounded-full bg-slate-200/70" />
                  <div className="h-4 w-20 rounded-full bg-slate-200/60" />
                  <div className="h-4 w-44 rounded-full bg-slate-200/50" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
