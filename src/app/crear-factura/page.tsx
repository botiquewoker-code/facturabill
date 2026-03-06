"use client";

import Link from "next/link";
import Image from "next/image";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";
import React, { useState, useEffect } from "react";
import PlantillaNueva from "@/components/PlantillaNueva";
import { useRouter } from "next/navigation";

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
type Cliente = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefono: string;
  email: string;
};
type Empresa = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  email: string;
};

export default function CrearFacturaPage() {
  const convertirId = null;
  const clienteId = null;
  const [aviso, setAviso] = useState("");
  const router = useRouter();

  const [cliente, setCliente] = useState({
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
  const [esPresupuesto, setEsPresupuesto] = useState(true);
  useEffect(() => {
    if (!clienteId) return;

    const guardados = localStorage.getItem("clientes");
    if (!guardados) return;

    const lista = JSON.parse(guardados);

    const cliente = lista[clienteId];

    if (!cliente) return;

    setCliente(cliente);
  }, [clienteId]);

  useEffect(() => {
    if (convertirId) {
      const historial = JSON.parse(localStorage.getItem("historial") || "[]");

      const documento = historial.find((doc: any) => doc.id === convertirId);

      if (documento) {
        setCliente(documento.cliente);
        setconceptos(documento.conceptos);
      }
    }
  }, [convertirId]);

  const [editarIva, setEditarIva] = useState(false);
  const [fecha] = useState(new Date().toISOString().split("T")[0]);
  const [numero, setNumero] = useState(`PRES-${new Date().getFullYear()}-001`);
  const [numeroFactura, setNumeroFactura] = useState("001");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const guardado = localStorage.getItem("numeroFactura");
      if (guardado) setNumeroFactura(guardado);
    }
  }, []);

  const [empresa, setEmpresa] = useState<Empresa>({
    nombre: "",
    nif: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    email: "",
  });
  useEffect(() => {
    const guardado = localStorage.getItem("datosEmpresa");
    if (guardado) {
      const datos = JSON.parse(guardado);
      setEmpresa(datos);
    }
  }, []);

  const [logo, setLogo] = useState<string>("");

  const [tipoIVA, setTipoIVA] = useState(21);
  const [showIVASelector, setShowIVASelector] = useState(false);
  const [ivaPorc, setIvaPorc] = useState(21);

  const [plantilla, setPlantilla] = useState<"InvoicePDF" | "PlantillaNueva">(
    "InvoicePDF",
  );
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

  const subtotal = Array.isArray(conceptos)
    ? conceptos.reduce((acc, i) => acc + i.cant * i.precio, 0)
    : 0;
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
  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;

    const historial = JSON.parse(localStorage.getItem("historial") || "[]");

    const existe = historial.some((f: any) => f.numeroFactura === valor);

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
        const historial = JSON.parse(localStorage.getItem("historial") || "[]");
        const existe = historial.some(
          (f: any) => f.numeroFactura === numeroFactura,
        );

        const { pdf } = await import("@react-pdf/renderer");

        const Componente =
          plantilla === "InvoicePDF" ? InvoicePDF : PlantillaNueva;

        const blob = await pdf(
          <Componente
            datos={datos}
            conceptos={conceptos}
            numeroFactura={numeroFactura}
          />,
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `factura-${numeroFactura}.pdf`;
        link.click();

        URL.revokeObjectURL(url);

        historial.push({
          numeroFactura,
          cliente,
          empresa,
          conceptos,
        });

        localStorage.setItem("historial", JSON.stringify(historial));
      } catch (error) {
        console.error(error);
      }

      const blob = await pdf(
        <InvoicePDF
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
    };

    const enviar = async () => {
      if (!cliente.email) return toast.error("Falta email del cliente");

      const { pdf } = await import("@react-pdf/renderer");

      const Componente =
        plantilla === "InvoicePDF" ? InvoicePDF : PlantillaNueva;

      const blob = await pdf(
        <Componente
          datos={datos}
          numeroFactura={numero}
          conceptos={conceptos}
          empresa={empresa}
          cliente={cliente}
          esPresupuesto={esPresupuesto}
        />,
      ).toBlob();
      const nuevoDocumento = {
        id: numero,
        tipo: esPresupuesto ? "presupuesto" : "factura",
        cliente: cliente,
        conceptos: conceptos,
        total: total,
        fecha: new Date().toLocaleDateString(),
        estado: esPresupuesto ? "Presupuesto enviado" : "Factura emitida",
      };

      const historial = JSON.parse(localStorage.getItem("historial") || "[]");

      historial.unshift(nuevoDocumento);

      localStorage.setItem("historial", JSON.stringify(historial));

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

      toast[res.ok ? "success" : "error"](
        res.ok ? "Enviado con Exito" : "Error",
      );
    };
    return (
      <>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <div className="p-0 mt-8 mb-6">
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
                onChange={(e) => setCliente({ ...cliente, cp: e.target.value })}
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
          {/* CONCEPTOS */}
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
                className="bg-green-600 text-white py-1 px-2 rounded-xl font-bold flex flex-col items-center shadow-xl"
              >
                <span className="text-xlg">
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
                    if (typeof window !== "undefined" && (window as any).gtag) {
                      (window as any).gtag("event", "conversion", {
                        send_to: "AW-1791812185/PvpICL_mx_obENHy-BC",
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
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="bg-gray-800 text-white py-2 px-6 rounded-xl font-bold"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </>
    );
  };
}
