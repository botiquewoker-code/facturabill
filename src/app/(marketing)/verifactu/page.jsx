import Link from "next/link";

export default function VeriFactuPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <h1 className="mb-5 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl">
        VeriFactu
      </h1>

      <p className="mb-4 text-[15px] leading-6 text-gray-700 sm:text-base">
        <strong>VeriFactu</strong> es un sistema impulsado por la Agencia
        Tributaria (AEAT) que garantiza que las facturas emitidas no puedan ser
        modificadas y que queden registradas de forma segura.
      </p>

      <p className="mb-4 text-[15px] leading-6 text-gray-700 sm:text-base">
        Su objetivo es combatir el fraude fiscal mediante la
        <strong> trazabilidad, integridad e inalterabilidad </strong>
        de las facturas.
      </p>

      <h2 className="mb-3 mt-7 text-lg font-semibold text-gray-900 sm:mt-8 sm:text-xl">
        Cuando sera obligatorio?
      </h2>

      <p className="mb-4 text-[15px] leading-6 text-gray-700 sm:text-base">
        La implantacion de VeriFactu sera <strong>obligatoria en Espana</strong>
        de forma progresiva:
      </p>

      <ul className="mb-6 list-disc pl-5 text-[15px] leading-6 text-gray-700 sm:pl-6 sm:text-base">
        <li>
          <strong>Empresas:</strong> a partir de 1 de enero 2027
        </li>
        <li>
          <strong>Autonomos:</strong> a partir de 1 de julio 2027
        </li>
      </ul>

      <p className="mb-6 text-[15px] leading-6 text-gray-700 sm:text-base">
        Estas fechas pueden ajustarse segun el calendario definitivo de la
        Agencia Tributaria.
      </p>

      <div className="rounded-[18px] border border-indigo-200 bg-indigo-50 p-4 sm:rounded-xl">
        <p className="font-semibold text-indigo-900">
          FacturaBill se esta preparando para cumplir con VeriFactu
          automaticamente.
        </p>

        <p className="mt-1 text-sm text-indigo-800">
          Esta funcionalidad estara disponible proximamente.
        </p>
      </div>

      <div className="mt-8 flex justify-center sm:mt-10">
        <Link
          href="/"
          className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:px-6 sm:py-3"
        >
          Volver a la pagina principal
        </Link>
      </div>
    </div>
  );
}
