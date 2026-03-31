import {
  BriefcaseBusiness,
  Package,
  Tags,
} from "lucide-react";

const sections = [
  {
    title: "Productos",
    description:
      "Referencias para articulos, materiales y unidades que reutilizas con frecuencia.",
    icon: Package,
  },
  {
    title: "Servicios",
    description:
      "Conceptos para trabajos, horas, cuotas o servicios profesionales listos para usar.",
    icon: BriefcaseBusiness,
  },
];

export default function CatalogoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
            <Tags className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Catalogo
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Productos y servicios
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              Organiza las referencias que reutilizaras en facturas,
              presupuestos y albaranes.
            </p>
          </div>
        </header>

        <section className="mt-6 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Base reutilizable
          </p>
          <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
            Un solo catalogo para todo el flujo
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-slate-500">
            Aqui podras centralizar precios, descripciones y conceptos para
            trabajar con mas rapidez y mantener documentos coherentes.
          </p>
        </section>

        <section className="mt-5 grid gap-3">
          {sections.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.3)] backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {title}
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-[34px] border border-dashed border-slate-200 bg-white/72 p-6 text-center shadow-[0_24px_54px_-38px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <h2 className="text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950">
            Catalogo listo para crecer
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-slate-500">
            Cuando empieces a construirlo, esta seccion reunira tus referencias
            habituales para reutilizarlas con rapidez en cada documento.
          </p>
        </section>
      </main>
    </div>
  );
}
