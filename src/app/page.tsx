"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import ConfigPanel from "@/components/ConfigPanel";
import PlantillaNueva from "@/components/PlantillaNueva";
import InvoicePDF from "@/components/InvoicePDF";
import Image from "next/image";

import {
  Upload,
  Plus,
  Trash2,
  Download,
  Send,
  Receipt,
  FileCheck,
  Settings,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

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
const mapaPlantillas: Record<string, "InvoicePDF" | "PlantillaNueva"> = {
  Clasica: "InvoicePDF",
  elegant: "PlantillaNueva",
  creative: "InvoicePDF",
  minimal: "PlantillaNueva",
};

export default function CrearFactura() {
  const [editarIva, setEditarIva] = useState(false);
  const [esPresupuesto, setEsPresupuesto] = useState(true);
  const [numero, setNumero] = useState(`PRES-${new Date().getFullYear()}-001`);
  const [fecha] = useState(new Date().toISOString().split("T")[0]);
  const [nuevoPrecio, setNuevoPrecio] = useState(0);
  const [numeroFactura, setNumeroFactura] = useState("001");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [plantilla, setPlantilla] = useState<"InvoicePDF" | "PlantillaNueva">(
    "InvoicePDF",
  );
  const datosUsuario = {
    nombre,
    direccion,
    telefono,
    email,
    fecha,
    numeroFactura,
    nuevoPrecio,
    esPresupuesto,
  };
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [nuevoDesc, setNuevoDesc] = useState("");
  const [nuevoCant, setNuevoCant] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const guardado = localStorage.getItem("numeroFactura");
      if (guardado) setNumeroFactura(guardado);
    }
  }, []);

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNumeroFactura(valor);
    if (typeof window !== "undefined") {
      localStorage.setItem("numeroFactura", valor);
    }
  };
  const añadirItem = () => {
    if (nuevoDesc.trim() && nuevoCant > 0 && nuevoPrecio >= 0) {
      setconceptos([
        ...conceptos,
        { desc: nuevoDesc, cant: nuevoCant, precio: nuevoPrecio },
      ]);
      setNuevoDesc("");
      setNuevoCant(1);
      setNuevoPrecio(0);
    }
  };

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
  const [conceptos, setconceptos] = useState([
    { desc: "", cant: 1, precio: 0 },
  ]);
  const [logo, setLogo] = useState<string>("");
  const [tipoIVA, setTipoIVA] = useState(21);
  const [showIVASelector, setShowIVASelector] = useState(false);
  const [ivaPorc, setIvaPorc] = useState(21);
  const [verifactuOpen, setVerifactuOpen] = useState(false);
  useEffect(() => {
    const guardado = localStorage.getItem("datosEmpresa");
    if (guardado) {
      const datos = JSON.parse(guardado);
      setEmpresa(datos);
    }
  }, []);

  useEffect(() => {
    if (empresa.nombre || empresa.nif || empresa.direccion) {
      localStorage.setItem("datosEmpresa", JSON.stringify(empresa));
    }
  }, [empresa]);

  const [notas, setNotas] = useState("");
  useEffect(() => {
    const guardadoLogo = localStorage.getItem("logoUsuario");
    if (guardadoLogo) {
      setLogo(guardadoLogo);
    }

    const guardadasNotas = localStorage.getItem("notasUsuario");
    if (guardadasNotas) {
      setNotas(guardadasNotas);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("logoUsuario", logo);
  }, [logo]);

  useEffect(() => {
    localStorage.setItem("notasUsuario", notas);
  }, [notas]);

  const subtotal = conceptos.reduce((acc, i) => acc + i.cant * i.precio, 0);
  const iva = subtotal * (tipoIVA / 100);
  const total = subtotal + iva;

  const datos = {
    esPresupuesto,
    numero,
    fecha,
    empresa,
    cliente,
    conceptos,
    logo,
    plantilla,
    subtotal,
    iva,
    total,
    ivaPorc,
    notas,
  };

  const nombreEmpresa = empresa.nombre?.trim() || "Tu empresa";
  const toggleTipo = () => {
    setEsPresupuesto((p) => !p);
    setNumero((p) =>
      p.startsWith("PRES")
        ? p.replace("PRES", "FACT")
        : p.replace("FACT", "PRES"),
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
    try {
      const { pdf } = await import("@react-pdf/renderer");

      const Componente =
        plantilla === "InvoicePDF" ? InvoicePDF : PlantillaNueva;
      console.log("InvoicePDF:", InvoicePDF);

      const blob = await pdf(
        <Componente
          datos={datos}
          numeroFactura={numeroFactura}
          conceptos={conceptos}
          empresa={empresa}
          cliente={cliente}
          esPresupuesto={esPresupuesto}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${esPresupuesto ? "Presupuesto" : "Factura"}_${numeroFactura}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const enviar = async () => {
    if (!cliente.email) return toast.error("Falta email del cliente");

    const { pdf } = await import("@react-pdf/renderer");

    const Componente = plantilla === "InvoicePDF" ? InvoicePDF : PlantillaNueva;

    const blob = await pdf(
      <Componente
        datos={datosUsuario}
        numeroFactura={numeroFactura}
        conceptos={conceptos}
        empresa={empresa}
        cliente={cliente}
        esPresupuesto={esPresupuesto}
      />,
    ).toBlob();

    const formData = new FormData();
    formData.append(
      "file",
      blob,
      `\( {esPresupuesto ? "Presupuesto" : "Factura"}_ \){numeroFactura}.pdf`,
    );
    formData.append("to", cliente.email);
    formData.append(
      "subject",
      `${esPresupuesto ? "Presupuesto" : "Factura"} ${numeroFactura} - ${nombreEmpresa}`,
    );
    formData.append(
      "text",
      `Hola,

Adjunto ${esPresupuesto ? "el presupuesto" : "la factura"} ${numeroFactura}.

Gracias.
${nombreEmpresa}`,
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
          {/* Cabecera clásica - tu diseño actual corregido */}
          <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">
              {/* Logo Facturabill.net a la izquierda */}
              <img src="/logo.svg" alt="Facturabill.net" className="h-12" />

              {/* Botón menú hamburguesa */}
              <button
                onClick={() => setMenuOpen(true)}
                className="text-2xl text-gray-800 hover:text-gray-900"
              >
                ☰
              </button>
            </div>
          </header>
          {/* Menú hamburguesa lateral - blanco puro, logo Veri*Factu */}
          {menuOpen && (
            <div
              className="fixed inset-0 z-50"
              onClick={() => setMenuOpen(false)}
            >
              <div
                className="absolute right-3 top-16 w-64 rounded-2xl bg-blue-50 shadow-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* MENÚ */}
                <ul className="space-y-4 text-[17px] font-semibold">
                  <li>
                    <Link href="/" className="block">
                      Historial de facturas
                    </Link>
                  </li>

                  <li>
                    <Link href="/" className="block">
                      Clientes
                    </Link>
                  </li>

                  <li>
                    <Link href="/como-funciona" className="block">
                      Cómo funciona
                    </Link>
                  </li>

                  <li>
                    <Link href="/verifactu" className="block">
                      VeriFactu
                    </Link>
                  </li>

                  <li>
                    <Link href="/" className="block">
                      Precios
                    </Link>
                  </li>
                </ul>

                {/* SEPARADOR */}
                <div className="my-6 h-px bg-gray-200" />

                {/* BOTONES */}
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full rounded-xl bg-grren-100 py-3 font-semibold text-gray-900 cursor-not-allowed"
                  >
                    Registro en desarrollo
                  </button>

                  <button className="w-full rounded-xl bg-amber-400 py-3 font-semibold text-white hover:bg-black-">
                    Iniciar sesión
                  </button>
                </div>
              </div>
            </div>
          )}
          /* CARRUSEL CON PLANTILLAS REALES */
          <div className="p-0 mt-8 mb-6">
            <h3 className="text-lg font-bold mb-6 text-center">
              Elige plantilla
            </h3>
            <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-6 px-6">
              <div className="inline-flex gap-6">
                {["Clasica", "elegant", "creative", "minimal"].map((t) => (
                  <div key={t} className="shrink-0">
                    <img
                      src={`/previews/${t}.jpg`}
                      alt={t}
                      className={`w-40 h-auto rounded-xl shadow-2xl cursor-pointer hover:scale-105 transition border-4
                                                                                                                   ${plantilla === mapaPlantillas[t] ? "border-blue-500" : "border-transparent"}
`}
                      onClick={() => setPlantilla(mapaPlantillas[t])}
                    />
                    <p className="text-center mt-3 text-sm font-medium capitalize">
                      {t}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-3 py-2 shadow-sm">
              <span className="text-sm font-semibold text-blue-700">
                Nº factura
              </span>

              <input
                type="text"
                value={numeroFactura}
                onChange={handleNumeroChange}
                placeholder="001"
                className="w-20 text-center rounded-xl border border-blue-300 bg-white font-bold text-blue-800 focus:ring-2 focus:ring-blue-400 outline-none py-1"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {/* EMISOR */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
              <h3 className="text-sm font-semibold text-blue-700 mb-5">
                Datos de su empresa
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Nombre / Razón social"
                  value={empresa.nombre}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="NIF/CIF"
                  value={empresa.nif}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, nif: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="Dirección"
                  value={empresa.direccion}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, direccion: e.target.value })
                  }
                  className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="Ciudad"
                  value={empresa.ciudad}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, ciudad: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="C.P."
                  value={empresa.cp}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, cp: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="Teléfono"
                  value={empresa.telefono}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, telefono: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="Email"
                  value={empresa.email}
                  onChange={(e) =>
                    setEmpresa({ ...empresa, email: e.target.value })
                  }
                  className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
            {/* CLIENTE */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
              <h3 className="text-sm font-semibold text-blue-700 mb-5">
                Datos de Cliente
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Nombre / Razón social"
                  value={cliente.nombre}
                  onChange={(e) =>
                    setCliente({ ...cliente, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="DNI / NIE"
                  value={cliente.nif}
                  onChange={(e) =>
                    setCliente({ ...cliente, nif: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="Dirección"
                  value={cliente.direccion}
                  onChange={(e) =>
                    setCliente({ ...cliente, direccion: e.target.value })
                  }
                  className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="Ciudad"
                  value={cliente.ciudad}
                  onChange={(e) =>
                    setCliente({ ...cliente, ciudad: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="C.P."
                  value={cliente.cp}
                  onChange={(e) =>
                    setCliente({ ...cliente, cp: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="Teléfono"
                  value={cliente.telefono}
                  onChange={(e) =>
                    setCliente({ ...cliente, telefono: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  placeholder="Email"
                  value={cliente.email}
                  onChange={(e) =>
                    setCliente({ ...cliente, email: e.target.value })
                  }
                  className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </div>
          {/* LOGO – CORREGIDO Y FUNCIONA 100% */}
          <div className="bg-blue-50 rounded-2xl p-6 text-center mb-6 shadow">
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
                <div className="h-32 border-2 border-dashed border-green-500 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Toca para subir logo</p>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-3">
                Máximo 2MB · PNG, JPG
              </p>
            </label>
          </div>
          {/* ==================== CONCEPTOS – FUNCIONA 100% EN MÓVIL Y TURBOPACK ==================== */}
          <div className="bg-blue-50 rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-6">
              Conceptos
            </h3>

            {conceptos.map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-3 items-center mb-3"
              >
                {/* Descripción */}
                <input
                  placeholder="Descripción"
                  value={c.desc}
                  onChange={(e) => {
                    const copia = [...conceptos];
                    copia[i].desc = e.target.value;
                    setconceptos(copia);
                  }}
                  className="col-span-5 px-4 py-2 rounded-xl border border-blue-200 text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                />

                {/* Cantidad */}
                <input
                  type="number"
                  min="1"
                  value={c.cant}
                  onChange={(e) => {
                    const copia = [...conceptos];
                    copia[i].cant = Number(e.target.value);
                    setconceptos(copia);
                  }}
                  className="col-span-2 px-3 py-2 rounded-xl border border-blue-200 text-sm text-center bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                />

                {/* Precio */}
                <input
                  type="number"
                  step="0.01"
                  value={c.precio}
                  onChange={(e) => {
                    const copia = [...conceptos];
                    copia[i].precio = Number(e.target.value);
                    setconceptos(copia);
                  }}
                  className="col-span-2 px-3 py-2 rounded-xl border border-blue-200 text-sm text-right bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                />

                {/* Total */}
                <div className="col-span-2 px-3 py-2 rounded-xl bg-blue-100 text-sm text-right font-semibold text-blue-700">
                  {(c.cant * c.precio).toFixed(2)} €
                </div>

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() =>
                    setconceptos(conceptos.filter((_, index) => index !== i))
                  }
                  className="col-span-1 text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Añadir */}
            <button
              type="button"
              onClick={() =>
                setconceptos([...conceptos, { desc: "", cant: 1, precio: 0 }])
              }
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              + Añadir concepto
            </button>
          </div>
          {/* Cuadro de totales compacto y bonito */}
          <div className="bg-orange-50 rounded-2xl p-4 shadow-md mb-6">
            <div className="mb-3">
              <p className="text-base font-bold">Base imponible</p>
              <p className="text-xl font-bold">{subtotal.toFixed(2)} €</p>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-base">IVA ({ivaPorc}%):</p>
                <button className="text-blue-600 text-xs underline">
                  cambiar
                </button>
              </div>
              <p className="text-xl font-bold">{iva.toFixed(2)} €</p>
            </div>

            <div className="bg-orange-500 text-white rounded-xl p-3 text-center mb-3">
              <p className="text-2xl font-bold">{total.toFixed(2)} €</p>
            </div>

            <p className="text-center text-gray-600 text-sm mb-4">
              Importe final a pagar por el cliente
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={toggleTipo}
                className="bg-green-600 text-white py-1 px-3 rounded-xl font-bold flex flex-col items-center shadow-xl"
              >
                <span className="text-xl">
                  {esPresupuesto
                    ? "Convertir a factura"
                    : "Convertir a presupuesto"}
                </span>
                <span className="text-sm mt-1 opacity-90">
                  {esPresupuesto ? "PRES" : "FACT"}-{numeroFactura} ·{" "}
                  {new Date(datos.fecha).toLocaleDateString("es-ES")}
                </span>
              </button>
              <div className="flex flex-col gap-2">
                <button
                  onClick={descargar}
                  className="bg-white border border-gray-300 text-gray-800 py-1.5 px-5 rounded-xl font-bold text-sm"
                >
                  Descargar PDF
                </button>
                <button
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag("event", "conversion", {
                        send_to: "AW-1791812185/PvplCL_mx_obENHy-BC",
                        value: 1.0,
                        currency: "EUR",
                      });
                    }
                    enviar();
                  }}
                  className="bg-white border border-gray-300 text-gray-800 py-1.5 px-5 rounded-xl font-bold text-sm"
                >
                  Enviar al cliente
                </button>
              </div>
            </div>
          </div>
          {/* ==================== NOTAS ==================== */}
          <div className="bg-blue-50 rounded-2xl shadow-lg p-6 mb-8">
            <textarea
              placeholder="Notas, condiciones de pago, IBAN, forma de pago..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
            />
          </div>
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
      <footer className="bg-gray-900 text-gray-300 py-12 mt-0">
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
