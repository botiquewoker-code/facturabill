"use client";

import { useState, useEffect } from "react";

type Empresa = {
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

export default function ConfiguracionEmpresa() {
  const [empresa, setEmpresa] = useState<Empresa>({
    nombre: "",
    nif: "",
    direccion: "",
    ciudad: "",
    cp: "",
    telefono: "",
    email: "",
  });

  const [plantilla, setPlantilla] = useState<"InvoicePDF" | "PlantillaNueva">(
    "InvoicePDF",
  );
  type Plantilla = "InvoicePDF" | "PlantillaNueva";

  useEffect(() => {
    const guardada = localStorage.getItem("plantillaSeleccionada");
    if (guardada) {
      setPlantilla(guardada as Plantilla);
    }
  }, []);
  const seleccionarPlantilla = (valor: Plantilla) => {
    setPlantilla(valor);
    localStorage.setItem("plantillaSeleccionada", valor);
  };

  const [logo, setLogo] = useState<string>("");
  const [notas, setNotas] = useState("");
  const [mensajeGuardado, setMensajeGuardado] = useState(false);
  useEffect(() => {
    const guardado = localStorage.getItem("datosEmpresa");
    if (guardado) {
      const datos = JSON.parse(guardado);
      setEmpresa(datos);
    }

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

  useEffect(() => {
    localStorage.setItem("plantillaUsuario", plantilla);
  }, [plantilla]);

  useEffect(() => {
    if (empresa.nombre || empresa.nif || empresa.direccion) {
      localStorage.setItem("datosEmpresa", JSON.stringify(empresa));
    }
  }, [empresa]);

  // ===== SUBIR LOGO =====
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imagen = reader.result as string;
      setLogo(imagen);
      localStorage.setItem("logoUsuario", imagen);
    };
    reader.readAsDataURL(file);
  };
  const handleGuardarEmpresa = () => {
    try {
      localStorage.setItem("datosEmpresa", JSON.stringify(empresa));
      localStorage.setItem("plantillaElegida", plantilla);
      localStorage.setItem("logoUsuario", logo || "");
      localStorage.setItem("notasUsuario", notas || "");

      // 📳 vibración suave (si el dispositivo lo soporta)
      if (navigator.vibrate) {
        navigator.vibrate(40);
      }

      // ✅ mostrar mensaje verde
      setMensajeGuardado(true);

      // ⏱ volver a home
      setTimeout(() => {
        window.location.href = "/";
      }, 900);
    } catch (error) {
      console.error("Error guardando datos de empresa", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* PLANTILLAS */}
      <div className="p-0 mt-8 mb-6">
        <h3 className="text-lg font-bold mb-6 text-center text-black">
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
                  onClick={() => seleccionarPlantilla(mapaPlantillas[t])}
                />
                <p className="text-center mt-3 text-sm font-medium capitalize text-black">
                  {t}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 2️⃣ LOGO */}
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
              <p className="text-black text-sm">Toca para subir logo</p>
            </div>
          )}
          <p className="text-xs text-gray-600 mt-3">Máximo 2MB · PNG, JPG</p>
        </label>
      </div>
      {/* 3️⃣ DATOS EMPRESA */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
        <h3 className="text-sm font-semibold text-black mb-5">
          Datos de su empresa
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Nombre / Razón social"
            value={empresa.nombre}
            onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm text-black placeholder-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            placeholder="NIF/CIF"
            value={empresa.nif}
            onChange={(e) => setEmpresa({ ...empresa, nif: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm text-black placeholder-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            placeholder="Dirección"
            value={empresa.direccion}
            onChange={(e) =>
              setEmpresa({ ...empresa, direccion: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm text-black placeholder-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            placeholder="Ciudad"
            value={empresa.ciudad}
            onChange={(e) => setEmpresa({ ...empresa, ciudad: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm text-black placeholder-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            placeholder="C.P."
            value={empresa.cp}
            onChange={(e) => setEmpresa({ ...empresa, cp: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm text-black placeholder-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            placeholder="Teléfono"
            value={empresa.telefono}
            onChange={(e) =>
              setEmpresa({ ...empresa, telefono: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm text-black placeholder-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            placeholder="Email"
            value={empresa.email}
            onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm text-black placeholder-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      </div>

      {/* ===================== NOTAS ===================== */}
      <div className="bg-blue-50 rounded-2xl shadow-lg p-6 mb-6">
        <textarea
          placeholder="Notas, condiciones de pago, IBAN, forma de pago..."
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-black placeholder-black bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
        />
      </div>

      {/* ================= BOTÓN GUARDAR ================= */}
      <button
        type="button"
        onClick={handleGuardarEmpresa}
        className="w-full mt-6 bg-green-100 hover:bg-green-200 text-black font-semibold py-3 px-4 rounded-xl shadow-sm transition duration-200 active:scale-95"
      >
        Guardar configuración
      </button>
    </div>
  );
}
{
  {
    /* ================= CONFIRMACIÓN ================= */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl px-12 py-14 text-center">
        {/* ICONO */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-500 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          Datos guardados correctamente
        </h2>

        <p className="text-gray-500">
          La información de la empresa se ha guardado con éxito.
        </p>
      </div>
    </div>;
  }
}
