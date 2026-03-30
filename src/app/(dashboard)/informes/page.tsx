"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChartColumn } from "lucide-react";

type HistoryDocument = {
  tipo?: "factura" | "presupuesto";
  fecha?: string;
  total?: number;
};

type MonthlyPoint = {
  mes: string;
  total: number;
};

type StatusPoint = {
  name: string;
  value: number;
};

const HISTORY_KEY = "historial";
const MONTHS: MonthlyPoint[] = [
  { mes: "Ene", total: 0 },
  { mes: "Feb", total: 0 },
  { mes: "Mar", total: 0 },
  { mes: "Abr", total: 0 },
  { mes: "May", total: 0 },
  { mes: "Jun", total: 0 },
  { mes: "Jul", total: 0 },
  { mes: "Ago", total: 0 },
  { mes: "Sep", total: 0 },
  { mes: "Oct", total: 0 },
  { mes: "Nov", total: 0 },
  { mes: "Dic", total: 0 },
];

function readHistory(): HistoryDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryDocument[]) : [];
  } catch {
    return [];
  }
}

function money(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default function InformesPage() {
  const [historial, setHistorial] = useState<HistoryDocument[]>(() =>
    readHistory(),
  );
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    const refreshHistory = () => setHistorial(readHistory());
    const frame = window.requestAnimationFrame(() => setChartsReady(true));

    window.addEventListener("focus", refreshHistory);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("focus", refreshHistory);
    };
  }, []);

  const resumen = useMemo(() => {
    const meses = MONTHS.map((item) => ({ ...item }));
    let totalFacturas = 0;
    let totalPresupuestos = 0;
    let totalFacturado = 0;

    historial.forEach((doc) => {
      if (doc.tipo === "factura") {
        totalFacturas += 1;
        totalFacturado += Number(doc.total) || 0;

        if (doc.fecha) {
          const fecha = new Date(doc.fecha);
          const monthIndex = fecha.getMonth();

          if (!Number.isNaN(monthIndex) && meses[monthIndex]) {
            meses[monthIndex].total += Number(doc.total) || 0;
          }
        }
      }

      if (doc.tipo === "presupuesto") {
        totalPresupuestos += 1;
      }
    });

    const estado: StatusPoint[] = [
      { name: "Facturas", value: totalFacturas },
      { name: "Presupuestos", value: totalPresupuestos },
    ];

    return {
      totalFacturado,
      totalFacturas,
      totalPresupuestos,
      ticketMedio: totalFacturas ? totalFacturado / totalFacturas : 0,
      dataMes: meses,
      dataEstado: estado,
    };
  }, [historial]);

  const colors = ["#0f172a", "#b97a45"];

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
            <ChartColumn className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Informes
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Resumen rapido
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              Una vista clara del volumen facturado y del equilibrio entre
              facturas y presupuestos.
            </p>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Facturado
            </p>
            <p className="mt-3 text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950">
              {money(resumen.totalFacturado)}
            </p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Facturas
            </p>
            <p className="mt-3 text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950">
              {resumen.totalFacturas}
            </p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Presupuestos
            </p>
            <p className="mt-3 text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950">
              {resumen.totalPresupuestos}
            </p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Ticket medio
            </p>
            <p className="mt-3 text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950">
              {money(resumen.ticketMedio)}
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Evolucion
          </p>
          <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
            Facturacion mensual
          </h2>
          <div className="mt-5 h-[240px] w-full">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumen.dataMes}>
                  <XAxis dataKey="mes" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    formatter={(value) => money(Number(value ?? 0))}
                    cursor={{ fill: "rgba(15,23,42,0.05)" }}
                  />
                  <Bar dataKey="total" fill="#0f172a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-[24px] bg-slate-100" />
            )}
          </div>
        </section>

        <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Distribucion
          </p>
          <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
            Tipos de documento
          </h2>
          <div className="mt-5 h-[240px] w-full">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resumen.dataEstado}
                    dataKey="value"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {resumen.dataEstado.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Number(value ?? 0)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-[24px] bg-slate-100" />
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {resumen.dataEstado.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-[20px] border border-white/70 bg-white/80 px-4 py-3"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {item.name}
                  </p>
                  <p className="text-sm font-semibold text-slate-950">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
