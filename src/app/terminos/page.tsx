import Link from "next/link";

export default function Terminos() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          Términos de uso de Facturabill.net
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed text-lg">
          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              1. Introducción
            </h2>
            <p>
              Bienvenido a Facturabill.net, una herramienta online gratuita
              diseñada para facilitar la creación de facturas profesionales de
              manera rápida y sencilla.
            </p>
            <p className="mt-4">
              Estos Términos de uso regulan el acceso y utilización del sitio
              web <strong>facturabill.net</strong> y sus servicios. Al acceder o
              usar la plataforma, aceptas cumplir y estar vinculado por estos
              términos en su versión vigente.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              2. Uso del servicio
            </h2>
            <p>Facturabill.net permite:</p>
            <ul className="list-disc pl-8 mt-4 space-y-3">
              <li>
                Crear facturas personalizadas con datos de empresa, cliente,
                items y cálculos automáticos.
              </li>
              <li>Seleccionar entre diferentes plantillas de diseño.</li>
              <li>Descargar las facturas en formato PDF.</li>
              <li>
                Enviar facturas por correo electrónico directamente desde la
                plataforma.
              </li>
            </ul>
            <p className="mt-4">
              El servicio es completamente gratuito y no requiere registro ni
              suscripción.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              3. Privacidad y datos
            </h2>
            <p>
              Facturabill.net procesa toda la información exclusivamente en el
              navegador del usuario. No se transmiten ni almacenan datos en
              servidores externos.
            </p>
            <p className="mt-4">
              No recopilamos información personal, cookies de seguimiento ni
              datos de las facturas generadas. Tu privacidad está completamente
              protegida.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              4. Responsabilidades del usuario
            </h2>
            <p>El usuario se compromete a:</p>
            <ul className="list-disc pl-8 mt-4 space-y-3">
              <li>
                Utilizar el servicio de forma lícita y conforme a la normativa
                vigente.
              </li>
              <li>
                Ser el único responsable del contenido y exactitud de las
                facturas generadas.
              </li>
              <li>
                No utilizar la plataforma para fines fraudulentos o ilegales.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              5. Limitación de responsabilidad
            </h2>
            <p>
              Facturabill.net se proporciona "tal cual" sin garantías de ningún
              tipo. No nos hacemos responsables de errores, omisiones o daños
              derivados del uso de las facturas generadas.
            </p>
            <p className="mt-4">
              Recomendamos siempre revisar las facturas antes de su uso oficial.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              6. Modificaciones del servicio y términos
            </h2>
            <p>
              Nos reservamos el derecho a modificar, suspender o discontinuar el
              servicio en cualquier momento, así como a actualizar estos
              términos. El uso continuado tras cualquier cambio implica
              aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              7. Contacto
            </h2>
            <p>
              Para cualquier consulta relacionada con estos términos, puedes
              contactarnos en:
              <br />
              <a
                href="mailto:facturabill.net@gmail.com"
                className="text-blue-600 hover:underline"
              >
                facturabill.net@gmail.com
              </a>
            </p>
          </section>

          <p className="text-center text-gray-500 mt-16 text-base">
            Última actualización: 24 de diciembre de 2025
          </p>

          <div className="text-center mt-12">
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
