import Link from "next/link";

export default function Contacto() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 sm:mb-12 sm:text-5xl">
          Contacto
        </h1>

        <div className="space-y-8 rounded-[24px] bg-white p-5 text-[15px] leading-7 text-gray-700 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.16)] sm:space-y-10 sm:rounded-[32px] sm:p-8 sm:text-lg md:p-12">
          <section>
            <p className="text-center text-lg sm:text-xl">
              Tienes alguna duda, sugerencia o necesitas ayuda con Facturabill.net?
            </p>
            <p className="mt-4 text-center text-lg sm:mt-6 sm:text-xl">
              Estamos aqui para ayudarte.
            </p>
          </section>

          <section className="rounded-[20px] bg-gray-100 p-5 text-center sm:rounded-[24px] sm:p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 sm:mb-6 sm:text-3xl">
              Escribenos
            </h2>
            <p className="mb-6 text-xl sm:mb-8 sm:text-2xl">
              <a
                href="mailto:soporte@facturabill.net"
                className="text-blue-600 hover:underline"
              >
                soporte@facturabill.net
              </a>
            </p>
            <p className="text-[15px] sm:text-lg">
              Responderemos a tu mensaje en menos de 24 horas laborables.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 sm:mb-6 sm:text-3xl">
              Otros canales
            </h2>
            <ul className="space-y-4">
              <li>
                Consulta primero la seccion de{" "}
                <Link href="/ayuda" className="text-blue-600 hover:underline">
                  Ayuda y FAQ
                </Link>
              </li>
              <li>
                Revisa los{" "}
                <Link href="/terminos" className="text-blue-600 hover:underline">
                  Terminos de uso
                </Link>{" "}
                y{" "}
                <Link href="/condiciones" className="text-blue-600 hover:underline">
                  Condiciones generales
                </Link>
              </li>
              <li>
                Para cuestiones de privacidad, lee nuestra{" "}
                <Link href="/privacidad" className="text-blue-600 hover:underline">
                  Politica de privacidad
                </Link>
              </li>
            </ul>
          </section>

          <section className="mt-10 text-center sm:mt-12">
            <p className="text-[15px] sm:text-lg">Gracias por confiar en Facturabill.net.</p>
          </section>

          <div className="mt-12 text-center sm:mt-16">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 sm:px-8 sm:py-3"
            >
              Volver a Facturabill.net
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
