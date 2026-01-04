"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [nif, setNif] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [iban, setIban] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [notas, setNotas] = useState(
    "Pago en 15 días desde la fecha de emisión.",
  );
  const [plantilla, setPlantilla] = useState(0);

  const plantillas = ["Moderna", "Clásica", "Minimalista"];

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const config = {
      empresa: { nombre, nif, email, telefono, direccion, ciudad, iban, logo },
      notas,
      plantilla: plantillas[plantilla],
      plan: "pro",
    };
    localStorage.setItem("configEmpresa", JSON.stringify(config));
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Regístrate en FacturaBill.net
          </h1>
          <p className="text-lg text-gray-600">
            Configura tu empresa y empieza a facturar{" "}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Datos empresa y notas */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Datos de tu empresa
            </h2>

            <div className="space-y-5">
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition"
                placeholder="Nombre de la empresa"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition"
                placeholder="NIF / CIF"
                value={nif}
                onChange={(e) => setNif(e.target.value)}
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition"
                placeholder="Dirección completa"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition"
                placeholder="Ciudad"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition"
                placeholder="IBAN"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de la empresa
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition"
                />
                {logo && (
                  <img
                    src={logo}
                    alt="Logo"
                    className="mt-4 w-40 h-40 object-contain rounded-xl border border-gray-300 shadow"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas predeterminadas en facturas
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plantilla por defecto
                </label>
                <div className="flex gap-3 flex-wrap">
                  {plantillas.map((p, idx) => (
                    <button
                      key={p}
                      onClick={() => setPlantilla(idx)}
                      className={`px-6 py-3 rounded-xl border-2 font-medium transition ${
                        plantilla === idx
                          ? "bg-orange-600 text-white border-orange-600 shadow"
                          : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Plan */}
          <div className="bg-white rounded-2xl border-2 border-yellow-400 p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-bold text-xs">
              PLAN ÚNICO
            </div>

            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                FacturaBill Pro
              </h2>
              <p className="text-sm text-gray-600">
                Todo incluido, sin límites
              </p>
            </div>

            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-gray-900">4,95€</span>
              <span className="text-sm text-gray-500"> / mes</span>
            </div>

            <ul className="space-y-2 mb-6 text-gray-700 text-sm">
              {[
                "Facturas y presupuestos ilimitados",
                "Descarga PDF y envío por email",
                "Datos y logo de empresa",
                "Plantillas profesionales",
                "Sin anuncios ni distracciones",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-yellow-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={handleSave}
              className="w-full bg-yellow-400 text-yellow-900 py-2 rounded-xl font-bold text-sm hover:bg-yellow-500 transition"
            >
              Crear cuenta y empezar
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Sin permanencia · Cancela cuando quieras
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-800">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
