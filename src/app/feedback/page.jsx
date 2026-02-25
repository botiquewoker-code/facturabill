"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const router = useRouter();

  const enviarSugerencia = async (e) => {
    e.preventDefault();

    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, mensaje }),
    });

    setEnviado(true);
    setNombre("");
    setEmail("");
    setMensaje("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {!enviado ? (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sugerencias o problemas
            </h2>

            <form onSubmit={enviarSugerencia} className="space-y-4">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre (opcional)"
                className="w-full rounded-xl border border-gray-300 px-4 py-2"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email (opcional)"
                className="w-full rounded-xl border border-gray-300 px-4 py-2"
              />

              <textarea
                rows="4"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Cuéntanos qué está mal en la web"
                className="w-full rounded-xl border border-gray-300 px-4 py-2"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-xl hover:bg-yellow-500 transition"
              >
                Enviar sugerencia
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-100 border border-green-300 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              ¡Sugerencia enviada!
            </h2>

            <p className="text-green-700 mb-4">
              {nombre
                ? `${nombre}, hemos recibido tu mensaje y lo revisaremos.`
                : "Hemos recibido tu mensaje y lo revisaremos para mejorar Facturabill."}
            </p>

            <button
              onClick={() => router.push("/")}
              className="bg-green-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-green-700 transition"
            >
              Volver a inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
