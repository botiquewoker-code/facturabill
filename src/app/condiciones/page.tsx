import Link from "next/link";

export default function Condiciones() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          Condiciones generales de Facturabill.net
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed text-lg">
          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              1. Objeto del servicio
            </h2>
            <p>
              Facturabill.net es una plataforma web profesional diseñada para
              facilitar la creación, gestión y envío de facturas de forma rápida
              y eficiente.
            </p>
            <p className="mt-4">
              El servicio incluye la generación de facturas personalizadas,
              selección de plantillas profesionales, cálculo automático de
              subtotales, impuestos y totales, descarga en PDF de alta calidad y
              envío directo por correo electrónico.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              2. Acceso y utilización
            </h2>
            <p>
              El acceso a Facturabill.net requiere el cumplimiento de las
              presentes condiciones. El uso de la plataforma implica la
              aceptación plena y sin reservas de todas las disposiciones
              incluidas en este documento.
            </p>
            <p className="mt-4">
              El servicio está disponible las 24 horas del día, 7 días a la
              semana, salvo interrupciones programadas por mantenimiento o
              causas técnicas fuera de nuestro control.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              3. Funcionalidades técnicas
            </h2>
            <ul className="list-disc pl-8 mt-4 space-y-3">
              <li>
                Generación de facturas con numeración automática y
                personalizable.
              </li>
              <li>
                Plantillas profesionales con diseño responsive y optimizado para
                impresión.
              </li>
              <li>
                Cálculos precisos con soporte para diferentes tipos de IVA e
                impuestos.
              </li>
              <li>
                Envío de facturas por email con adjunto PDF personalizado.
              </li>
              <li>Compatibilidad con todos los navegadores modernos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              4. Obligaciones del usuario
            </h2>
            <p>El usuario se compromete a:</p>
            <ul className="list-disc pl-8 mt-4 space-y-3">
              <li>
                Utilizar el servicio conforme a la legislación vigente
                aplicable.
              </li>
              <li>
                Introducir datos veraces y exactos en las facturas generadas.
              </li>
              <li>
                No emplear la plataforma para crear documentos falsos o con
                fines fraudulentos.
              </li>
              <li>
                Respetar los derechos de propiedad intelectual y de terceros.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              5. Limitación de responsabilidad
            </h2>
            <p>
              Facturabill.net se proporciona con la máxima diligencia, pero no
              ofrecemos garantías explícitas sobre la disponibilidad continua o
              la ausencia de errores.
            </p>
            <p className="mt-4">
              No nos responsabilizamos de daños derivados del uso incorrecto del
              servicio, errores en los datos introducidos por el usuario o
              interrupciones por causas externas.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              6. Propiedad intelectual
            </h2>
            <p>
              Todo el contenido, diseño, código y marcas de Facturabill.net son
              propiedad exclusiva de sus titulares. Queda prohibida su
              reproducción, distribución o modificación sin autorización
              expresa.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              7. Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho a modificar las funcionalidades, diseño
              o condiciones del servicio en cualquier momento. Las
              actualizaciones serán publicadas en esta página.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              8. Contacto
            </h2>
            <p>
              Para cualquier consulta relacionada con estas condiciones
              generales, contacta con nosotros en:
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
