import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-50 px-4 py-10 sm:px-6">
      <div className="max-w-2xl rounded-[24px] bg-white/80 p-5 text-center shadow-[0_20px_40px_-24px_rgba(113,63,18,0.18)] backdrop-blur sm:rounded-[30px] sm:p-8">
        <h1 className="mb-4 text-2xl font-bold text-slate-900 sm:mb-6 sm:text-3xl">
          Software de facturacion adaptado a VeriFactu
        </h1>

        <p className="mb-3 text-[15px] leading-6 text-slate-700 sm:mb-4 sm:text-lg">
          Nuestra plataforma se esta preparando para cumplir con la nueva
          normativa de facturacion digital impulsada por la Agencia Tributaria.
        </p>

        <p className="mb-6 text-[15px] leading-6 text-slate-700 sm:mb-8 sm:text-lg">
          Disenado para autonomos que buscan una solucion sencilla, profesional
          y preparada para el futuro.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-5 py-2.5 font-semibold text-black transition hover:bg-yellow-500 sm:px-6 sm:py-3"
        >
          Crear factura ahora
        </Link>
      </div>
    </div>
  );
}
