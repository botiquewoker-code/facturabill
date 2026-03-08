"use client";

import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";
import PlantillaNueva from "@/components/PlantillaNueva";
import { Toaster, toast } from "react-hot-toast";
import { Upload, Plus, Trash2, Download, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Cliente = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
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
  const router = useRouter();

  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );

  const tipo = params.get("tipo");
  const clienteId = params.get("clienteId");
  const [cliente, setCliente] = useState<Cliente>({
    nombre: "",
    nif: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    email: "",
  });
  useEffect(() => {
    if (!clienteId) return;

    const guardados = localStorage.getItem("clientes");
    if (!guardados) return;

    const lista = JSON.parse(guardados);

    const idNum = parseInt(clienteId || "0", 10);

    const clienteEncontrado = lista[idNum];
    if (clienteEncontrado) {
      setCliente(clienteEncontrado);
    }
  }, [clienteId]);

  const [conceptos, setconceptos] = useState([
    { desc: "", cant: 1, precio: 0 },
  ]);
  const [esPresupuesto, setEsPresupuesto] = useState(true);
  const [editarIva, setEditarIva] = useState(false);
  const [fecha] = useState(new Date().toISOString().split("T")[0]);
  const [numero, setNumero] = useState(`PRES-${new Date().getFullYear()}-001`);
  const [numeroFactura, setNumeroFactura] = useState("001");
  const [empresa, setEmpresa] = useState<Empresa>({
    nombre: "",
    nif: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    email: "",
  });
  const [logo, setLogo] = useState<string>("");
  const [ivaPorc, setIvaPorc] = useState(21);
  const [notas, setNotas] = useState("");
  const [tipoIVA, setTipoIVA] = useState(21);
  const [plantilla, setPlantilla] = useState<"InvoicePDF" | "PlantillaNueva">(
    "InvoicePDF",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const datosEmpresa = localStorage.getItem("datosEmpresa");
    if (datosEmpresa) setEmpresa(JSON.parse(datosEmpresa));

    const logoGuardado = localStorage.getItem("logoUsuario");
    if (logoGuardado) setLogo(logoGuardado);

    const notasGuardadas = localStorage.getItem("notasUsuario");
    if (notasGuardadas) setNotas(notasGuardadas);

    const presupuestoConvertir = localStorage.getItem("presupuestoConvertir");

    if (presupuestoConvertir) {
      const datos = JSON.parse(presupuestoConvertir);

      if (datos.cliente) setCliente(datos.cliente);
      if (datos.conceptos) setconceptos(datos.conceptos);
      if (datos.items) setconceptos(datos.items);

      if (datos.id) {
        const nuevoNumero = datos.id.replace("PRES", "FAC");
        setNumeroFactura(nuevoNumero);
      }

      localStorage.removeItem("presupuestoConvertir");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("numeroFactura", numeroFactura);
  }, [numeroFactura]);

  useEffect(() => {
    localStorage.setItem("logoUsuario", logo);
  }, [logo]);

  useEffect(() => {
    localStorage.setItem("notasUsuario", notas);
  }, [notas]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clienteParam = params.get("clienteId");
    if (clienteParam) {
      const guardados = localStorage.getItem("clientes");
      if (guardados) {
        try {
          const lista = JSON.parse(guardados);
          const clienteEncontrado = lista[parseInt(clienteParam)];
          if (clienteEncontrado) {
            setCliente(clienteEncontrado);
          }
        } catch (e) {
          console.error("Error al cargar cliente:", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const guardado = localStorage.getItem("datosEmpresa");
    if (guardado) {
      try {
        const datos = JSON.parse(guardado);
        setEmpresa(datos);
      } catch (e) {
        console.error("Error al cargar datosEmpresa:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (empresa.nombre || empresa.nif || empresa.direccion) {
      localStorage.setItem("datosEmpresa", JSON.stringify(empresa));
    }
  }, [empresa]);
  useEffect(() => {
    if (!clienteId || typeof window === "undefined") return;

    const guardados = localStorage.getItem("clientes");
    if (!guardados) return;

    const lista = JSON.parse(guardados);

    const idNum = parseInt(clienteId, 10);
    const clienteEncontrado = lista[idNum];

    if (clienteEncontrado) {
      setCliente(clienteEncontrado);
    }
  }, [clienteId]);

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
    notas,
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumeroFactura(e.target.value);
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleTipo = () => {
    setEsPresupuesto((prev) => !prev);
    setNumero((prev) =>
      prev.startsWith("PRES")
        ? prev.replace("PRES", "FACT")
        : prev.replace("FACT", "PRES"),
    );
    toast.success(
      esPresupuesto ? "Convertido a Factura" : "Convertido a Presupuesto",
    );
  };

  const descargar = async () => {
    try {
      const Componente =
        plantilla === "InvoicePDF" ? InvoicePDF : PlantillaNueva;
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

      toast.success("PDF descargado");
    } catch (error) {
      toast.error("Error al generar PDF");
      console.error(error);
    }
  };

  const enviar = async () => {
    if (!cliente.email) return toast.error("Falta email del cliente");
    const historial = JSON.parse(localStorage.getItem("historial") || "[]");

    const index = historial.findIndex((doc: any) => doc.id === numeroFactura);

    if (index !== -1) {
      historial[index].tipo = "factura";
      historial[index].estado = "Factura enviada";
    } else {
      historial.unshift({
        id: numeroFactura,
        tipo: esPresupuesto ? "presupuesto" : "factura",
        cliente: cliente,
        fecha: new Date().toLocaleDateString(),
        conceptos: conceptos,
        total: total,
        estado: esPresupuesto ? "Presupuesto enviado" : "Factura enviada",
      });
    }

    localStorage.setItem("historial", JSON.stringify(historial));

    try {
      const Componente =
        plantilla === "InvoicePDF" ? InvoicePDF : PlantillaNueva;
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
        `${esPresupuesto ? "Presupuesto" : "Factura"}_${numeroFactura}.pdf`,
      );
      formData.append("to", cliente.email);
      formData.append(
        "subject",
        `${esPresupuesto ? "Presupuesto" : "Factura"} ${numeroFactura}`,
      );
      formData.append(
        "text",
        `Hola,\n\nAdjunto ${esPresupuesto ? "el presupuesto" : "la factura"} \( {numeroFactura}.\n\nGracias.\n \){empresa.nombre || "Tu empresa"}`,
      );

      const res = await fetch("/api/enviar-email", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const historial = JSON.parse(localStorage.getItem("historial") || "[]");

        historial.push({
          id: numeroFactura,
          tipo: esPresupuesto ? "presupuesto" : "factura",

          cliente: cliente,
          fecha: new Date().toISOString(),
          total: total,
          estado: "Enviado",
        });

        localStorage.setItem("historial", JSON.stringify(historial));
      }

      toast[res.ok ? "success" : "error"](
        res.ok ? "Enviado con éxito" : "Error al enviar",
      );
    } catch (error) {
      toast.error("Error al enviar");
      console.error(error);
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="p-0 mt-8 mb-6">
        <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-3 py-2 shadow-sm">
          <span className="text-sm font-semibold text-blue-700">
            {tipo === "presupuesto" ? "PRES" : "FACT"}-{numeroFactura} ·{" "}
            {new Date(datos.fecha).toLocaleDateString("es-ES")}
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
              onChange={(e) => setCliente({ ...cliente, nif: e.target.value })}
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
              placeholder="Código postal"
              value={cliente?.codigoPostal || ""}
              onChange={(e) =>
                setCliente({ ...cliente, codigoPostal: e.target.value })
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
        {/* CONCEPTOS */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-6">
            Conceptos
          </h3>

          {conceptos.map((c, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-center mb-3">
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
}
