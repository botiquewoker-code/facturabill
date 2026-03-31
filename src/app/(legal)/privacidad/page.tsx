import Link from "next/link";

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-12 text-center text-5xl font-bold text-gray-800">
          Politica de privacidad de Facturabill.net
        </h1>

        <div className="space-y-10 rounded-2xl bg-white p-8 text-lg leading-relaxed text-gray-700 shadow-lg md:p-12">
          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              1. Responsable del tratamiento
            </h2>
            <p>
              El responsable del tratamiento de los datos recabados a traves de
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
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              2. Principios generales
            </h2>
            <p>
              En Facturabill.net nos comprometemos a proteger tu privacidad y a
              tratar tus datos de forma transparente, licita y segura,
              cumpliendo con la normativa vigente en materia de proteccion de
              datos.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              3. Datos que recopilamos
            </h2>
            <p>
              Facturabill.net recopila unicamente los datos necesarios para
              prestar el servicio:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-8">
              <li>
                Datos introducidos por el usuario en formularios y documentos,
                como empresa, cliente, direccion, correo o conceptos.
              </li>
              <li>
                Informacion necesaria para adaptar la experiencia de uso y
                mantener la calidad del servicio.
              </li>
              <li>
                En caso de suscripcion o pago, los datos de facturacion
                necesarios para la gestion del servicio.
              </li>
            </ul>
            <p className="mt-4">
              <strong>Importante:</strong> El contenido de tus facturas se trata
              unicamente para ofrecerte las funciones de creacion, revision,
              descarga y envio de documentos.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              4. Finalidad del tratamiento
            </h2>
            <p>Los datos se utilizan unicamente para:</p>
            <ul className="mt-4 list-disc space-y-3 pl-8">
              <li>Prestar el servicio de generacion y envio de facturas.</li>
              <li>Gestionar suscripciones y pagos cuando corresponda.</li>
              <li>Mejorar la funcionalidad y usabilidad de la plataforma.</li>
              <li>
                Enviar comunicaciones relacionadas con el servicio, como avisos
                importantes o actualizaciones relevantes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              5. Base legal del tratamiento
            </h2>
            <p>El tratamiento de datos se basa en:</p>
            <ul className="mt-4 list-disc space-y-3 pl-8">
              <li>La ejecucion del servicio solicitado por el usuario.</li>
              <li>El consentimiento del usuario al aceptar esta politica.</li>
              <li>
                El interes legitimo para mejorar el servicio y garantizar su
                seguridad.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              6. Conservacion de datos
            </h2>
            <p>
              La informacion se conserva durante el tiempo necesario para
              prestar el servicio, atender obligaciones legales y gestionar
              incidencias o solicitudes relacionadas con la cuenta.
            </p>
            <p className="mt-4">
              Los datos de suscripcion o facturacion se conservaran durante el
              tiempo exigido por la normativa aplicable.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              7. Derechos de los usuarios
            </h2>
            <p>Puedes ejercer tus derechos de:</p>
            <ul className="mt-4 list-disc space-y-3 pl-8">
              <li>Acceso, rectificacion y supresion de datos.</li>
              <li>Limitacion del tratamiento y oposicion.</li>
              <li>Portabilidad de los datos.</li>
            </ul>
            <p className="mt-4">
              Envia tu solicitud a{" "}
              <a
                href="mailto:facturabill.net@gmail.com"
                className="text-blue-600 hover:underline"
              >
                facturabill.net@gmail.com
              </a>
              . Responderemos en el plazo maximo previsto por la normativa.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              8. Seguridad
            </h2>
            <p>
              Aplicamos medidas tecnicas y organizativas adecuadas para
              proteger tus datos frente a accesos no autorizados, perdida,
              alteracion o tratamiento indebido.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              9. Modificaciones
            </h2>
            <p>
              Podemos actualizar esta politica de privacidad. Los cambios se
              publicaran en esta pagina con la fecha de actualizacion
              correspondiente.
            </p>
          </section>

          <p className="mt-16 text-center text-base text-gray-500">
            Ultima actualizacion: 31 de marzo de 2026
          </p>

          <div className="mt-12 text-center">
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
