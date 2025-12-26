import Link from "next/link";

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          Política de privacidad de Facturabill.net
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed text-lg">
          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              1. Responsable del tratamiento
            </h2>
            <p>
              El responsable del tratamiento de los datos recabados a través de
              la plataforma Facturabill.net es el titular del dominio.
            </p>
            <p className="mt-4">
              Correo de contacto:{" "}
              <a
                href="mailto:facturabill.net@gmail.com"
                className="text-blue-600 hover:underline"
              >
                facturabill.net@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              2. Principios generales
            </h2>
            <p>
              En Facturabill.net nos comprometemos a proteger tu privacidad y a
              tratar tus datos de forma transparente, lícita y segura,
              cumpliendo con la normativa vigente en materia de protección de
              datos (RGPD y LOPDGDD).
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              3. Datos que recopilamos
            </h2>
            <p>
              Facturabill.net recopila únicamente los datos estrictamente
              necesarios para prestar el servicio:
            </p>
            <ul className="list-disc pl-8 mt-4 space-y-3">
              <li>
                Datos introducidos por el usuario en el formulario de factura
                (nombre de empresa, cliente, dirección, email, items, etc.).
              </li>
              <li>
                Datos técnicos básicos del navegador (tipo de dispositivo,
                resolución de pantalla) para optimizar la experiencia de
                usuario.
              </li>
              <li>
                En caso de suscripción o pago: datos de facturación necesarios
                para la gestión del servicio.
              </li>
            </ul>
            <p className="mt-4">
              <strong>Importante:</strong> Las facturas se generan
              exclusivamente en tu dispositivo. No se transmiten ni almacenan en
              nuestros servidores los contenidos de las facturas creadas.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              4. Finalidad del tratamiento
            </h2>
            <p>Los datos se utilizan únicamente para:</p>
            <ul className="list-disc pl-8 mt-4 space-y-3">
              <li>Prestar el servicio de generación y envío de facturas.</li>
              <li>Gestionar suscripciones y pagos cuando corresponda.</li>
              <li>Mejorar la funcionalidad y usabilidad de la plataforma.</li>
              <li>
                Enviar comunicaciones relacionadas con el servicio
                (actualizaciones, avisos importantes).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              5. Base legal del tratamiento
            </h2>
            <p>El tratamiento de datos se basa en:</p>
            <ul className="list-disc pl-8 mt-4 space-y-3">
              <li>
                La ejecución del contrato de prestación de servicios (uso de la
                plataforma).
              </li>
              <li>El consentimiento del usuario al aceptar esta política.</li>
              <li>
                El interés legítimo para mejorar el servicio y garantizar su
                seguridad.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              6. Conservación de datos
            </h2>
            <p>
              Los datos introducidos en las facturas no se conservan en nuestros
              servidores, ya que el procesamiento es local.
            </p>
            <p className="mt-4">
              Los datos de suscripción o facturación se conservarán durante el
              tiempo necesario para cumplir con las obligaciones legales (máximo
              5 años tras la finalización del servicio).
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              7. Derechos de los usuarios
            </h2>
            <p>Puedes ejercer tus derechos de:</p>
            <ul className="list-disc pl-8 mt-4 space-y-3">
              <li>Acceso, rectificación y supresión de datos.</li>
              <li>Limitación del tratamiento y oposición.</li>
              <li>Portabilidad de los datos.</li>
            </ul>
            <p className="mt-4">
              Envía tu solicitud a{" "}
              <a
                href="mailto:facturabill.net@gmail.com"
                className="text-blue-600 hover:underline"
              >
                facturabill.net@gmail.com
              </a>
              . Responderemos en el plazo máximo de un mes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              8. Seguridad
            </h2>
            <p>
              Aplicamos medidas técnicas y organizativas adecuadas para proteger
              tus datos contra acceso no autorizado, pérdida o alteración.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              9. Modificaciones
            </h2>
            <p>
              Podemos actualizar esta política de privacidad. Los cambios serán
              publicados en esta página con la fecha de actualización
              correspondiente.
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
