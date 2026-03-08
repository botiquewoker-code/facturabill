"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Historial() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem("historial") || "[]");
    setDocumentos(datos);
  }, []);

  const convertirAFactura = (index: number) => {
    const copia = [...documentos];

    copia[index].tipo = "factura";
    copia[index].estado = "Factura emitida";

    localStorage.setItem("historial", JSON.stringify(copia));
    setDocumentos(copia);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Historial de envíos</h1>

        {documentos.length === 0 && (
          <p className="text-gray-500">No hay documentos todavía.</p>
        )}

        {documentos.map((doc, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow mb-4">
            <p className="font-bold text-lg">
              {doc.tipo === "presupuesto" ? "Presupuesto" : "Factura"} #{doc.id}
            </p>

            <p>Cliente: {doc.cliente?.nombre || "Sin cliente"}</p>
            <p>Fecha: {doc.fecha}</p>
            <p className="text-black font-bold">Total: {doc.total} €</p>

            <p className="mt-2">
              Estado: <span className="font-semibold">{doc.estado}</span>
            </p>

            {doc.tipo === "presupuesto" && (
              <button
                onClick={() => {
                  console.log(doc);
                  localStorage.setItem(
                    "presupuestoConvertir",
                    JSON.stringify(doc),
                  );

                  router.push("/crear-factura");
                }}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
              >
                Convertir a factura
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
