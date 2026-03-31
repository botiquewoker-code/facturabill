import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-800 sm:text-5xl">
          Terminos de uso de Facturabill.net
        </h1>

        <div className="space-y-10 rounded-2xl bg-white p-8 text-lg leading-relaxed text-gray-700 shadow-lg md:p-12">
          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              1. Introduccion
            </h2>
            <p>
              Bienvenido a Facturabill.net, una herramienta online gratuita
              pensada para facilitar la creacion de facturas y presupuestos de
              forma rapida y sencilla.
            </p>
            <p className="mt-4">
              Estos terminos regulan el acceso y el uso del sitio web
              <strong> facturabill.net</strong> y de sus servicios. Al utilizar
              la plataforma aceptas estas condiciones en su version vigente.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              2. Uso del servicio
            </h2>
            <p>Facturabill.net permite:</p>
            <ul className="mt-4 list-disc space-y-3 pl-8">
              <li>Crear facturas personalizadas con datos de empresa y cliente.</li>
              <li>Seleccionar entre diferentes plantillas de diseno.</li>
              <li>Descargar documentos en formato PDF.</li>
              <li>Enviar documentos por correo electronico desde la plataforma.</li>
            </ul>
            <p className="mt-4">
              El servicio es gratuito y actualmente no requiere registro para su
              uso principal.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              3. Privacidad y datos
            </h2>
            <p>
              La informacion necesaria para prestar el servicio se gestiona de
              acuerdo con la configuracion de la cuenta, el navegador y el
              entorno de uso de cada usuario.
            </p>
            <p className="mt-4">
              Algunas funciones, como el envio por correo o las solicitudes de
              soporte, pueden requerir el tratamiento de los datos necesarios
              para completar ese servicio concreto.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              4. Responsabilidad del usuario
            </h2>
            <p>El usuario se compromete a:</p>
            <ul className="mt-4 list-disc space-y-3 pl-8">
              <li>Usar la plataforma de forma licita y conforme a la normativa aplicable.</li>
              <li>Revisar los datos del documento antes de su envio o uso oficial.</li>
              <li>Asumir la responsabilidad sobre la exactitud del contenido generado.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              5. Limitacion de responsabilidad
            </h2>
            <p>
              Facturabill.net se ofrece &quot;tal cual&quot; y puede cambiar con el
              tiempo. No garantizamos ausencia total de errores ni asumimos
              responsabilidad por danos derivados del uso del servicio o de los
              documentos generados.
            </p>
            <p className="mt-4">
              Recomendamos revisar siempre las facturas y presupuestos antes de
              compartirlos con terceros.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              6. Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho a modificar, suspender o mejorar el
              servicio en cualquier momento, asi como a actualizar estos
              terminos cuando sea necesario.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold text-gray-800">
              7. Contacto
            </h2>
            <p>
              Para cualquier consulta relacionada con estos terminos puedes
              escribir a:
              <br />
              <a
                href="mailto:facturabill.net@gmail.com"
                className="text-blue-600 hover:underline"
              >
                facturabill.net@gmail.com
              </a>
            </p>
          </section>

          <p className="mt-16 text-center text-base text-gray-500">
            Ultima actualizacion: 30 de marzo de 2026
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
