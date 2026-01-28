import Link from "next/link";

export default function ComoFuncionaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Cómo funciona Facturabill
      </h1>

      <p className="text-gray-700 mb-4">
        Facturabill.net es un software sencillo diseñado para pequeños autónomos
        y empresas que quieren crear facturas y presupuestos sin dolor de
        cabeza. Crear una factura o presupuesto es muy fácil y seguro.
      </p>

      <p className="text-gray-700 mb-4">
        <strong>1.</strong> Elige una plantilla.
      </p>

      <p className="text-gray-700 mb-4">
        <strong>2.</strong> Asigna el número de factura según como las tienes
        organizadas este año Si es la Primera vez en crear una factura te
        recomendamos empezar por <strong>001</strong> e ir aumentando en cada
        factura para evitar errores o duplicados en tus declaraciones.
      </p>

      <p className="text-gray-700 mb-4">
        <strong>3.</strong> Introduce los datos de tu negocio. Los datos de la
        empresa, logotipo y notas se guardan y no se borran al reiniciar, por lo
        que no tendrás que escribirlos de nuevo.
      </p>

      <p className="text-gray-700 mb-4">
        <strong>4.</strong> Sube el logotipo de tu negocio sin fondo blanco para
        que la factura tenga un aspecto más profesional.
      </p>

      <p className="text-gray-700 mb-4">
        <strong>5.</strong> En el cuadro de conceptos añade los productos o
        servicios, cantidades y precios netos. El cuadro de totales calculará el
        IVA automáticamente.
      </p>

      <p className="text-gray-700 mb-4">
        <strong>6.</strong> En el apartado de totales puedes revisar el importe
        final a pagar Por el cliente, con los impuestos ya calculados. Desde
        aquí puedes descargar el documento como factura o como presupuesto. Si
        estás creando un presupuesto, recomendamos descargarlo también como
        factura en un solo clic. De esta forma, si el cliente acepta el
        presupuesto, ya tendrás la factura preparada y no será necesario crearla
        de nuevo.
      </p>

      <p className="text-gray-700 mb-6">
        <strong>7.</strong> Añade notas finales si deseas que aparezcan en la
        factura.
      </p>

      <p className="text-gray-700 mb-10">
        Así de simple. Muy fácil, directo y sin complicaciones.
      </p>

      <p className="text-indigo-900 font-semibold bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        Estamos trabajando continuamente para mejorar Facturabill e incorporar
        nuevas funciones inteligentes basadas en inteligencia artificial (IA).
        Próximamente añadiremos numeración automática de facturas y
        presupuestos, historial completo de documentos, gestión de clientes,
        envío por email y otras herramientas avanzadas que automatizarán tareas
        repetitivas y simplificarán la gestión diaria. Nuestro objetivo es
        ofrecer una plataforma cada vez más inteligente, eficiente y fácil de
        usar para autónomos y pequeñas empresas.
      </p>
      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition"
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
}
