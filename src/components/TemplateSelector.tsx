"use client";

import { useInvoice } from "@contexts/InvoiceContext";
import { Card, CardContent } from "@/components/ui/card"; // si usas shadcn, si no te digo alternativa

const templates = [
  {
    name: "Moderna",
    color: "blue",
    headerBg: "bg-blue-800",
    accent: "border-blue-500",
  },
  {
    name: "Clásica",
    color: "gray",
    headerBg: "bg-gray-700",
    accent: "border-gray-400",
  },
  {
    name: "Minimal",
    color: "light",
    headerBg: "bg-white",
    accent: "border-gray-300",
  },
];

export default function TemplateSelector() {
  const { plantilla, setPlantilla } = useInvoice();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-center mb-10">Elige plantilla</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {templates.map((template) => (
          <Card
            key={template.name}
            className={`cursor-pointer transition-all hover:scale-105 ${plantilla === template.name.toLowerCase() ? "ring-4 ring-blue-500" : ""} ${template.accent} border-4`}
            onClick={() => setPlantilla(template.name.toLowerCase())}
          >
            <CardContent className="p-6">
              <div
                className={`rounded-lg shadow-xl overflow-hidden ${template.headerBg} text-white p-4 mb-4`}
              >
                <div className="flex justify-between">
                  <div className="text-sm">Empresa</div>
                  <div className="text-2xl font-bold">FACTURA</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                <table className="w-full mt-4 border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2">Concepto</th>
                      <th className="text-right p-2">Cant.</th>
                      <th className="text-right p-2">Precio</th>
                      <th className="text-right p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 bg-gray-50">Servicio ejemplo</td>
                      <td className="text-right p-2">1</td>
                      <td className="text-right p-2">75€</td>
                      <td className="text-right p-2">75€</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-right mt-4 font-bold text-lg">
                  Total: 90.75 €
                </div>
              </div>
              <div className="text-center mt-6 text-xl font-semibold">
                {template.name}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
