"use client";

import { useEffect, useState } from "react";
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

export default function Informes() {
  const [facturado, setFacturado] = useState(0);
  const [facturas, setFacturas] = useState(0);
  const [presupuestos, setPresupuestos] = useState(0);
  const [dataMes, setDataMes] = useState<any[]>([]);
  const [dataEstado, setDataEstado] = useState<any[]>([]);

  useEffect(() => {
    const historial = JSON.parse(localStorage.getItem("historial") || "[]");

    const meses = [
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

    let totalFacturas = 0;
    let totalPres = 0;
    let total = 0;

    historial.forEach((doc: any) => {
      if (doc.tipo === "factura") {
        totalFacturas++;
        total += Number(doc.total || 0);

        const fecha = new Date(doc.fecha);
        const mes = fecha.getMonth();

        meses[mes].total += Number(doc.total || 0);
      }

      if (doc.tipo === "presupuesto") {
        totalPres++;
      }
    });

    setFacturado(total);
    setFacturas(totalFacturas);
    setPresupuestos(totalPres);
    setDataMes(meses);

    setDataEstado([
      { name: "Facturas", value: totalFacturas },
      { name: "Presupuestos", value: totalPres },
    ]);
  }, []);

  const colors = ["#4f46e5", "#22c55e"];

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tablero de informes</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <p>Total facturado</p>
            <p className="text-2xl font-bold">{facturado.toFixed(2)} €</p>
          </div>

          <div className="bg-green-100 p-4 rounded shadow text-center">
            <p>Facturas</p>
            <p className="text-2xl font-bold">{facturas}</p>
          </div>

          <div className="bg-yellow-100 p-4 rounded shadow text-center">
            <p>Presupuestos</p>
            <p className="text-2xl font-bold">{presupuestos}</p>
          </div>

          <div className="bg-purple-100 p-4 rounded shadow text-center">
            <p>Media factura</p>
            <p className="text-2xl font-bold">
              {(facturado / (facturas || 1)).toFixed(2)} €
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="mb-4 font-semibold">Facturación mensual</h2>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dataMes}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="mb-4 font-semibold">Facturas por tipo</h2>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dataEstado} dataKey="value" outerRadius={80}>
                  {dataEstado.map((entry, index) => (
                    <Cell key={index} fill={colors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
