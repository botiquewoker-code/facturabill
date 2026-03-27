"use client";
import { useEffect, useState } from "react";

export default function Borradores() {
  const [borradores, setBorradores] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("borradores");
    if (data) {
      setBorradores(JSON.parse(data));
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Borradores</h1>

      {borradores.length === 0 ? (
        <p>No hay borradores</p>
      ) : (
        borradores.map((item, index) => (
          <div key={index} className="border p-2 mt-2">
            <p>{item.cliente?.nombre || "Sin nombre"}</p>

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
