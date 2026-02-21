import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-6">
          Software de facturación adaptado a VeriFactu
        </h1>

        <p className="text-lg mb-4">
          Nuestra plataforma se está preparando para cumplir con la nueva
          normativa de facturación digital impulsada por la Agencia Tributaria.
        </p>

        <p className="text-lg mb-8">
          Diseñado para autónomos que buscan una solución sencilla,
          profesional y preparada para el futuro.
        </p>

        <Link
          href="/"
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition"
        >
          Crear factura ahora
        </Link>
      </div>
    </div>
  );
}
