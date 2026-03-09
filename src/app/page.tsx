"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import ConfigPanel from "@/components/ConfigPanel";
import PlantillaNueva from "@/components/PlantillaNueva";
import InvoicePDF from "@/components/InvoicePDF";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

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
  const [openEmpresa, setOpenEmpresa] = useState(false);
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
  const [logo, setLogo] = useState("");

  useEffect(() => {
    const guardado = localStorage.getItem("logoUsuario");
    if (guardado) {
      setLogo(guardado);
    }
  }, []);

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
        datos={datos}
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

    toast[res.ok ? "success" : "error"](res.ok ? "Enviado con Exito" : "Error");
  };
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto p-4 pb-24">
          {/* Cabecera clásica - tu diseño actual corregido */}
          <header className="bg-gray-200 border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-0 py-1 flex items-center justify-end">
              {/* Logo Facturabill.net a la izquierda */}
              {/* Botón menú hamburguesa */}
              <button
                onClick={() => setMenuOpen(true)}
                className="text-2xl text-gray-800 hover:text-gray-900 mr-3"
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
                <ul className="space-y-4 text-[17px] font-semibold list-none p-0 m-0">
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
                    <Link href="/feedback" className="block">
                      Sugerencias
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
            <div className="flex justify-center">
              <div className="flex items-center bg-blue-300 rounded-2xl shadow-md px-4 py-2 gap-4">
                <button
                  onClick={() => (window.location.href = "/informes")}
                  className="text-sm font-medium text-black hover:text-blue-600 transition whitespace-nowrap"
                >
                  Informes
                </button>

                <div className="h-5 w-px bg-gray-300" />

                <Link
                  href="/empresa"
                  className="flex items-center gap-2 text-black hover:text-black transition"
                >
                  Configuración
                </Link>
                <div className="h-5 w-px bg-gray-300" />

                <button className="text-sm font-medium text-black hover:text-blue-600 transition whitespace-nowrap">
                  Soporte
                </button>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              <Link
                href="/crear-factura"
                className="flex w-full items-center gap-4 p-4 text-left rounded-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-900">
                    Crear Factura
                  </p>
                  <p className="text-sm text-gray-500">
                    Generar una nueva factura
                  </p>
                </div>
              </Link>
            </div>
            <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              <Link
                href="/crear-factura?tipo=presupuesto"
                className="flex w-full items-center gap-4 p-4 text-left rounded-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <DocumentDuplicateIcon className="h-6 w-6 text-purple-600" />
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-900">
                    Crear Presupuesto
                  </p>
                  <p className="text-sm text-gray-500">
                    Generar un nuevo presupuesto
                  </p>
                </div>
              </Link>
            </div>
            <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              <Link
                href="/historial"
                className="flex w-full items-center gap-4 p-4 text-left rounded-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <PaperAirplaneIcon className="h-6 w-6 text-green-600" />
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-900">
                    Historial de envíos
                  </p>
                  <p className="text-sm text-gray-500">
                    Facturas y presupuestos enviados
                  </p>
                </div>
              </Link>
            </div>
            <div className="mb-4 w-full rounded-xl border border-gray-200 bg-white shadow-sm">
              <Link
                href="/clientes"
                className="flex w-full items-center gap-4 p-4 text-left rounded-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-900">
                    Clientes
                  </p>
                  <p className="text-sm text-gray-500">
                    Añadir y gestionar clientes
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
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
                  <a
                    href="/aviso-legal"
                    className="hover:text-white transition"
                  >
                    Aviso legal
                  </a>
                </li>

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
