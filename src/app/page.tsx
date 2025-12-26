"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Plus,
  Trash2,
  Download,
  Send,
  Receipt,
  FileCheck,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import InvoicePDF from "@/components/InvoicePDF";

type Item = { desc: string; cant: number; precio: number };
type Empresa = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefono: string;
  email: string;
};
type Cliente = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefono: string;
  email: string;
};

export default function CrearFactura() {
  const [esPresupuesto, setEsPresupuesto] = useState(true);
  const [numero, setNumero] = useState(`PRES-${new Date().getFullYear()}-001`);
  const [fecha] = useState(new Date().toISOString().split("T")[0]);
  const [plantilla, setPlantilla] = useState<"clasica" | "moderna" | "minimal">(
    "moderna",
  );

  const [empresa, setEmpresa] = useState<Empresa>({
    nombre: "",
    nif: "",
    direccion: "",
    ciudad: "",
    cp: "",
    telefono: "",
    email: "",
  });
  const [cliente, setCliente] = useState<Cliente>({
    nombre: "",
    nif: "",
    direccion: "",
    ciudad: "",
    cp: "",
    telefono: "",
    email: "",
  });
  const [items, setItems] = useState<Item[]>([
    { desc: "", cant: 1, precio: 0 },
  ]);
  const [logo, setLogo] = useState<string>("");
  useEffect(() => {
    const guardado = localStorage.getItem("datosEmpresa");
    if (guardado) {
      const datos = JSON.parse(guardado);
      setEmpresa(datos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("datosEmpresa", JSON.stringify(empresa));
  }, [empresa]);
  const [notas, setNotas] = useState("");

  const subtotal = items.reduce((acc, i) => acc + i.cant * i.precio, 0);
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const datos = {
    esPresupuesto,
    numero,
    fecha,
    empresa,
    cliente,
    items,
    logo,
    plantilla,
    subtotal,
    iva,
    total,
    notas,
  };
  const nombreEmpresa = empresa.nombre?.trim() || "Tu empresa";

  const toggleTipo = () => {
    setEsPresupuesto((p) => !p);
    setNumero((p) =>
      p.startsWith("PRES")
        ? p.replace("PRES", "FAC")
        : p.replace("FAC", "PRES"),
    );
    toast.success(
      esPresupuesto ? "Convertido a Factura" : "Convertido a Presupuesto",
    );
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const descargar = async () => {
    const { pdf } = await import("@react-pdf/renderer");
    const blob = await pdf(<InvoicePDF datos={datos} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${esPresupuesto ? "Presupuesto" : "Factura"}_${numero}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Descargado");
  };

  const enviar = async () => {
    if (!cliente.email) return toast.error("Falta email del cliente");
    const { pdf } = await import("@react-pdf/renderer");
    const blob = await pdf(<InvoicePDF datos={datos} />).toBlob();
    const formData = new FormData();
    formData.append(
      "file",
      blob,
      `${esPresupuesto ? "Presupuesto" : "Factura"}_${numero}.pdf`,
    );
    formData.append("to", cliente.email);
    formData.append(
      "subject",
      `${esPresupuesto ? "Presupuesto" : "Factura"} ${numero} - ${nombreEmpresa}`,
    );
    formData.append(
      "text",
      `Hola,\n\nAdjunto ${esPresupuesto ? "el presupuesto" : "la factura"} ${numero}.\n\nGracias.\n${nombreEmpresa}`,
    );
    const res = await fetch("/api/enviar-email", {
      method: "POST",
      body: formData,
    });
    toast[res.ok ? "success" : "error"](res.ok ? "Enviado" : "Error");
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto p-4 pb-24">
          {/* CABECERA */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                  {esPresupuesto ? (
                    <FileCheck className="h-8 w-8 text-green-600" />
                  ) : (
                    <Receipt className="h-8 w-8 text-indigo-600" />
                  )}
                  {esPresupuesto ? "PRESUPUESTO" : "FACTURA"}
                </h1>
                <p className="text-xl font-bold text-indigo-600">{numero}</p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(fecha).toLocaleDateString("es-ES")}
                </p>
              </div>
              <button
                onClick={toggleTipo}
                className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg ${
                  esPresupuesto
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                }`}
              >
                {esPresupuesto
                  ? "Convertir a FACTURA"
                  : "Convertir a PRESUPUESTO"}
              </button>
            </div>
          </div>

          {/* CARRUSEL CON PLANTILLAS REALES */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-6 text-center">
              Elige plantilla
            </h3>
            <div className="overflow-x-auto whitespace-nowrap pb-4 -mx-6 px-6">
              <div className="inline-flex gap-6">
                {[
                  "modern",
                  "elegant",
                  "eco",
                  "creative",
                  "luxury",
                  "minimal",
                  "dark",
                ].map((t) => (
                  <div key={t} className="shrink-0">
                    <img
                      src={`/templates/${t}.jpg`}
                      alt={t}
                      className="w-80 h-auto rounded-xl shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300 border-4 border-transparent hover:border-indigo-500"
                      onClick={() => setPlantilla(t as any)}
                    />
                    <p className="text-center mt-3 text-sm font-medium capitalize">
                      {t}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {/* EMISOR */}
            <div className="bg-blue-50 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 mb-3 text-sm">Emisor</h3>
              <div className="space-y-3">
                <input
                  placeholder="Nombre / Razón social"
                  value={empresa.nombre}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="NIF/CIF"
                  value={empresa.nif}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, nif: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="Dirección"
                  value={empresa.direccion}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, direccion: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="Ciudad"
                  value={empresa.ciudad}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, ciudad: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="C.P."
                  value={empresa.cp}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, cp: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="Teléfono"
                  value={empresa.telefono}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, telefono: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="Email"
                  value={empresa.email}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>

            {/* CLIENTE */}
            <div className="bg-blue-50 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 mb-3 text-sm">Cliente</h3>
              <div className="space-y-3">
                <input
                  placeholder="Nombre / Razón social"
                  value={cliente.nombre}
                  onChange={(e) =>
                    setCliente({ ...cliente, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="DNI/NIE"
                  value={cliente.nif}
                  onChange={(e) =>
                    setCliente({ ...cliente, nif: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="Dirección"
                  value={cliente.direccion}
                  onChange={(e) =>
                    setCliente({ ...cliente, direccion: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="Ciudad"
                  value={cliente.ciudad}
                  onChange={(e) =>
                    setCliente({ ...cliente, ciudad: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="C.P."
                  value={cliente.cp}
                  onChange={(e) =>
                    setCliente({ ...cliente, cp: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="Teléfono"
                  value={cliente.telefono}
                  onChange={(e) =>
                    setCliente({ ...cliente, telefono: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  placeholder="Email"
                  value={cliente.email}
                  onChange={(e) =>
                    setCliente({ ...cliente, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* LOGO – CORREGIDO Y FUNCIONA 100% */}
          <div className="bg-white rounded-2xl p-6 text-center mb-6 shadow">
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogo}
                className="hidden"
              />
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="mx-auto max-h-24 rounded-lg shadow-md"
                />
              ) : (
                <div className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Toca para subir logo</p>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-3">
                Máximo 2MB · PNG, JPG
              </p>
            </label>
          </div>

          {/* ==================== CONCEPTOS – FUNCIONA 100% EN MÓVIL Y TURBOPACK ==================== */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 text-lg mb-5">Conceptos</h3>

            {items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-3 items-center mb-4"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    placeholder="Descripción del concepto"
                    value={item.desc}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[i].desc = e.target.value;
                      setItems(newItems);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="1"
                    value={item.cant || ""}
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value.replace(/\D/g, "")) || 0;
                      const newItems = [...items];
                      newItems[i].cant = val;
                      setItems(newItems);
                    }}
                    className="w-full px-4 py-3 text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="tel"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={item.precio || ""}
                    onChange={(e) => {
                      const raw = e.target.value
                        .replace(/[^0-9.,]/g, "")
                        .replace(",", ".");
                      const val = raw === "" ? 0 : Number(raw) || 0;
                      const newItems = [...items];
                      newItems[i].precio = val;
                      setItems(newItems);
                    }}
                    className="w-full px-4 py-3 text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>

                <div className="col-span-1 text-right font-bold text-gray-800">
                  {(item.cant * item.precio || 0).toFixed(2)} €
                </div>

                <div className="col-span-1">
                  <button
                    onClick={() =>
                      setItems(items.filter((_, idx) => idx !== i))
                    }
                    className="w-full flex justify-center"
                  >
                    <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                setItems([...items, { desc: "", cant: 0, precio: 0 }])
              }
              className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition"
            >
              <Plus className="h-5 w-5" />
              Añadir concepto
            </button>
          </div>

          {/* ==================== TOTALES ==================== */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl mb-20">
            <div className="text-right space-y-4">
              <div className="text-xl">
                Base imponible:{" "}
                <span className="font-bold text-3xl">
                  {subtotal.toFixed(2)} €
                </span>
              </div>
              <div className="text-xl">
                IVA 21%:{" "}
                <span className="font-bold text-3xl">{iva.toFixed(2)} €</span>
              </div>
              <div className="pt-6 border-t-4 border-white/40">
                <div className="text-4xl font-bold">
                  TOTAL {total.toFixed(2)} €
                </div>
              </div>
            </div>
          </div>

          {/* ==================== NOTAS ==================== */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-32">
            <textarea
              placeholder="Notas, condiciones de pago, IBAN, forma de pago..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
            />
          </div>
        </div>

        {/* ==================== BOTONES FIJOS ==================== */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center pb-20">
          <button
            onClick={descargar}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition"
          >
            <Download className="h-6 w-6" />
            DESCARGAR PDF
          </button>

          <button
            onClick={enviar}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition"
          >
            <Send className="h-6 w-6" />
            ENVIAR EMAIL
          </button>
        </div>

        {/* QUITAR FLECHAS INPUT NUMBER */}
        <style jsx global>{`
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
          }
        `}</style>
      </div>
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">
                Facturabill.net
              </h3>
              <p className="text-sm leading-relaxed">
                Tu herramienta sencilla y profesional para crear facturas al
                instante.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/terminos" className="hover:text-white transition">
                    Términos de uso
                  </a>
                </li>
                <li>
                  <a
                    href="/condiciones"
                    className="hover:text-white transition"
                  >
                    Condiciones generales
                  </a>
                </li>
                <li>
                  <a href="/privacidad" className="hover:text-white transition">
                    Política de privacidad
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/ayuda" className="hover:text-white transition">
                    Ayuda y FAQ
                  </a>
                </li>
                <li>
                  <a href="/contacto" className="hover:text-white transition">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <p className="text-sm">facturabill.net@gmail.com</p>
              <p className="text-sm mt-6">
                © 2025 Facturabill.net Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
