"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SoportePage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [urgente, setUrgente] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const router = useRouter();

  const enviarConsulta = async (e:any) => {
    e.preventDefault();

    await fetch("/api/soporte", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, mensaje, urgente }),
    });

    setEnviado(true);

    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Soporte
      </h1>

      {/* Preguntas frecuentes */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">
          Preguntas frecuentes
        </h2>

        <div className="space-y-4 text-sm text-gray-700">

          <div>
            <p className="font-medium">
              ¿Cómo creo mi primera factura?
            </p>
            <p className="text-gray-600">
              Primero añade un cliente y después crea una factura desde el panel principal.
            </p>
          </div>

          <div>
            <p className="font-medium">
              ¿Puedo descargar la factura en PDF?
            </p>
            <p className="text-gray-600">
              Sí, puedes descargar la factura en PDF o enviarla directamente.
            </p>
          </div>

          <div>
            <p className="font-medium">
              ¿La herramienta es gratuita?
            </p>
            <p className="text-gray-600">
              Sí, Facturabill es una herramienta gratuita y sin publicidad.
            </p>
          </div>

        </div>
      </div>

      {/* Formulario soporte */}
      {!enviado ? (

        <form onSubmit={enviarConsulta} className="space-y-4">

          <h2 className="text-lg font-semibold">
            Contactar con soporte
          </h2>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />

          <textarea
            rows={4}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Describe tu problema o consulta"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={urgente}
              onChange={() => setUrgente(!urgente)}
            />
            La consulta es urgente
          </label>

          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium"
          >
            Enviar consulta
          </button>

        </form>

      ) : (

        <div className="bg-green-100 border border-green-300 p-4 rounded-lg">
          <p className="text-green-800 font-medium">
            Consulta enviada correctamente
          </p>

          <p className="text-green-700 text-sm">
            Volviendo al inicio...
          </p>
        </div>

      )}

    </div>
  );
}
