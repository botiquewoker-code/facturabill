"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Apoyar() {
  const [copiado, setCopiado] = useState(false);
  const router = useRouter();

  const copiarNumero = () => {
    navigator.clipboard.writeText("624662997");
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 text-center">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">
        Apoya este proyecto
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        Facturabill es una herramienta gratuita y sin publicidad para crear y
        gestionar facturas fácilmente. Mantener los servidores y el desarrollo
        tiene un coste. Si esta herramienta te resulta útil, puedes apoyar el
        proyecto con una pequeña donación para ayudar a mantener el servicio
        gratuito para todos.
      </p>

      <div className="flex items-center justify-center gap-2 mt-4">
        <Image
          src="/bizum.png"
          alt="Bizum"
          width={60}
          height={24}
          className="h-6 w-auto"
        />

        <span className="font-semibold">624662997</span>

        <button
          onClick={copiarNumero}
          className="text-blue-600 text-xs underline ml-2"
        >
          {copiado ? "Copiado ✓" : "Copiar"}
        </button>
      </div>

      <div className="mt-20 text-center">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="bg-gray-800 text-white py-2 px-6 rounded-xl font-bold"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
