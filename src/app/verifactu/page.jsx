import Link from "next/link";
export default function VeriFactuPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">VeriFactu</h1>

      <p className="text-gray-700 mb-4">
        <strong>VeriFactu</strong> es un sistema impulsado por la Agencia
        Tributaria (AEAT) que garantiza que las facturas emitidas no puedan ser
        modificadas y que queden registradas de forma segura.
      </p>

      <p className="text-gray-700 mb-4">
        Su objetivo es combatir el fraude fiscal mediante la
        <strong> trazabilidad, integridad e inalterabilidad </strong>
        de las facturas.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
        ¿Cuándo será obligatorio?
      </h2>

      <p className="text-gray-700 mb-4">
        La implantación de VeriFactu será <strong>obligatoria en España</strong>
        de forma progresiva:
      </p>

      <ul className="list-disc pl-6 text-gray-700 mb-6">
        <li>
          <strong>Empresas:</strong> a partir de 1 de enero 2027
        </li>
        <li>
          <strong>Autónomos:</strong> a partir de 1 de julio 2027
        </li>
      </ul>

      <p className="text-gray-700 mb-6">
        Estas fechas pueden ajustarse según el calendario definitivo de la
        Agencia Tributaria.
      </p>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="text-indigo-900 font-semibold">
          FacturaBill se está preparando para cumplir con VeriFactu
          automáticamente.
        </p>

        <p className="text-indigo-800 text-sm mt-1">
          Esta funcionalidad estará disponible próximamente.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition"
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
}
