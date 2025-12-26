import Link from "next/link";

export default function Ayuda() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          Ayuda y Preguntas frecuentes (FAQ)
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-12 text-gray-700 leading-relaxed text-lg">
          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              ¿Cómo crear una factura?
            </h2>
            <ol className="list-decimal pl-8 space-y-4">
              <li>Rellena los datos de tu empresa y del cliente.</li>
              <li>
                Añade los conceptos/servicios con cantidad y precio unitario.
              </li>
              <li>Selecciona el tipo de IVA aplicable.</li>
              <li>
                El subtotal, impuestos y total se calculan automáticamente.
              </li>
              <li>
                Pulsa "Descargar PDF" o "Enviar email" para obtener tu factura.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              ¿Puedo personalizar la factura?
            </h2>
            <p>Sí. Puedes:</p>
            <ul className="list-disc pl-8 mt-4 space-y-3">
              <li>Elegir entre diferentes plantillas profesionales.</li>
              <li>Añadir notas, condiciones de pago, IBAN o forma de pago.</li>
              <li>Incluir numeración automática o personalizada.</li>
              <li>Próximamente: subir tu logo y colores corporativos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              ¿Es seguro usar Facturabill.net?
            </h2>
            <p>
              Totalmente. Toda la generación de facturas se realiza en tu
              navegador. Tus datos nunca se envían ni se almacenan en servidores
              externos.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              ¿Puedo guardar o editar facturas anteriores?
            </h2>
            <p>
              Actualmente las facturas se generan en tiempo real. Recomendamos
              guardar el PDF descargado.
              <br />
              Próximamente: historial de facturas y edición de borradores.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              ¿Funciona en móvil y tablet?
            </h2>
            <p>
              Sí, Facturabill.net es completamente responsive y funciona
              perfectamente en teléfonos, tablets y ordenadores.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              ¿Hay límite de facturas?
            </h2>
            <p>
              No. Puedes generar todas las facturas que necesites sin límites.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              ¿Puedo facturar con retención o recargo de equivalencia?
            </h2>
            <p>
              Sí. En la configuración avanzada puedes activar retenciones IRPF o
              recargo de equivalencia.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              ¿Necesito ayuda adicional?
            </h2>
            <p>
              Escribe a{" "}
              <a
                href="mailto:facturabill.net@gmail.com"
                className="text-blue-600 hover:underline"
              >
                facturabill.net@gmail.com
              </a>{" "}
              y te responderemos en menos de 24 horas.
            </p>
          </section>

          <div className="text-center mt-16">
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              ← Volver a Facturabill.net
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
