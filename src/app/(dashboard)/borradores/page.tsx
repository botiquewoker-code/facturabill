"use client";
import { useState } from "react";

type DraftItem = {
  id: string;
  tipo?: "factura" | "presupuesto";
  numero?: string;
  updatedAt?: string;
  cliente?: {
    nombre?: string;
  };
};

export default function Borradores() {
  const [borradores] = useState<DraftItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      return JSON.parse(localStorage.getItem("borradores") || "[]");
    } catch {
      return [];
    }
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Borradores</h1>

      {borradores.length === 0 ? (
        <p>No hay borradores</p>
      ) : (
        borradores.map((item, index) => (
          <div key={index} className="border p-2 mt-2">
            <p className="font-semibold">{item.cliente?.nombre || "Sin nombre"}</p>
            <p className="text-sm text-gray-600">
              {item.tipo === "presupuesto" ? "Presupuesto" : "Factura"}
              {item.numero ? ` ${item.numero}` : ""}
            </p>
            {item.updatedAt && (
              <p className="text-xs text-gray-500">
                Guardado: {new Date(item.updatedAt).toLocaleString("es-ES")}
              </p>
            )}

            <button
              onClick={() => {
                localStorage.setItem("borradorActivo", JSON.stringify(item));
                window.location.href = "/crear-factura";
              }}
              className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
            >
              Restaurar
            </button>
          </div>
        ))
      )}
    </div>
  );
}
