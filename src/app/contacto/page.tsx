import Link from "next/link";

export default function Contacto() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          Contacto
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed text-lg">
          <section>
            <p className="text-center text-xl">
              ¿Tienes alguna duda, sugerencia o necesitas ayuda con
              Facturabill.net?
            </p>
            <p className="text-center text-xl mt-6">
              Estamos aquí para ayudarte.
            </p>
          </section>

          <section className="bg-gray-100 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Escríbenos
            </h2>
            <p className="text-2xl mb-8">
              <a
                href="mailto:facturabill.net@gmail.com"
                className="text-blue-600 hover:underline"
              >
                facturabill.net@gmail.com
              </a>
            </p>
            <p className="text-lg">
              Responderemos a tu mensaje en menos de 24 horas laborables.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Otros canales
            </h2>
            <ul className="space-y-4">
              <li>
                • Consulta primero la sección de{" "}
                <Link href="/ayuda" className="text-blue-600 hover:underline">
                  Ayuda y FAQ
                </Link>
              </li>
              <li>
                • Revisa los{" "}
                <Link
                  href="/terminos"
                  className="text-blue-600 hover:underline"
                >
                  Términos de uso
                </Link>{" "}
                y{" "}
                <Link
                  href="/condiciones"
                  className="text-blue-600 hover:underline"
                >
                  Condiciones generales
                </Link>
              </li>
              <li>
                • Para cuestiones de privacidad, lee nuestra{" "}
                <Link
                  href="/privacidad"
                  className="text-blue-600 hover:underline"
                >
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </section>

          <section className="text-center mt-12">
            <p className="text-lg">¡Gracias por confiar en Facturabill.net!</p>
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
