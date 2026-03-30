import Link from "next/link";

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-800 sm:text-5xl">
          Ayuda y preguntas frecuentes
        </h1>

        <div className="space-y-12 rounded-2xl bg-white p-8 text-lg leading-relaxed text-gray-700 shadow-lg md:p-12">
          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              Como crear una factura
            </h2>
            <ol className="list-decimal space-y-4 pl-8">
              <li>Rellena los datos de tu empresa y del cliente.</li>
              <li>Anade los conceptos con cantidad y precio unitario.</li>
              <li>Selecciona el tipo de IVA aplicable.</li>
              <li>Revisa totales, fecha y vencimiento si corresponde.</li>
              <li>
                Pulsa &quot;Descargar PDF&quot; o &quot;Enviar email&quot; para finalizar.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              Se puede personalizar la factura
            </h2>
            <p>Si. Puedes:</p>
            <ul className="mt-4 list-disc space-y-3 pl-8">
              <li>Elegir entre diferentes plantillas.</li>
              <li>Anadir notas predeterminadas desde el perfil de empresa.</li>
              <li>Configurar logo, datos de empresa y estilo base.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              Funciona en movil y tablet
            </h2>
            <p>
              Si. La aplicacion esta pensada para usarse desde movil, tablet y
              escritorio. Aun asi, antes de enviar documentos importantes,
              recomendamos revisar el PDF final.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              Donde se guardan los datos
            </h2>
            <p>
              Muchas funciones actuales utilizan almacenamiento local del
              navegador. Eso significa que los datos pueden no aparecer en otro
              dispositivo o si se borra el almacenamiento del navegador.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              Puedo editar documentos anteriores
            </h2>
            <p>
              Puedes recuperar borradores y reutilizar presupuestos desde el
              historial. Para documentos ya enviados, recomendamos conservar el
              PDF y generar una nueva version si necesitas cambios.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              Necesitas ayuda adicional
            </h2>
            <p>
              Escribe a{" "}
              <a
                href="mailto:facturabill.net@gmail.com"
                className="text-blue-600 hover:underline"
              >
                facturabill.net@gmail.com
              </a>{" "}
              y te responderemos lo antes posible.
            </p>
          </section>

          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Volver a Facturabill.net
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
