import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Facturas & Presupuestos</h1>
        <p className="text-lg text-gray-600 mb-12">Crea documentos profesionales en segundos, con plantillas modernas y envíos automáticos</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
          <Link href="/factura">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="text-3xl mb-3">📄</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Crear Factura</h2>
              <p className="text-gray-500 text-sm">IVA automático, PDF profesional</p>
            </div>
          </Link>
          <Link href="/presupuesto">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="text-3xl mb-3">📝</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Crear Presupuesto</h2>
              <p className="text-gray-500 text-sm">Convierte a factura en 1 clic</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
