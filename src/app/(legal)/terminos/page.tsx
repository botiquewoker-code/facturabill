import { FileText } from "lucide-react";
import { LegalDocumentPage } from "@/features/legal/LegalDocumentPage";

export default function TerminosPage() {
  return (
    <LegalDocumentPage
      badge="Terminos"
      eyebrow="Uso"
      title="Terminos de uso"
      description="Reglas generales de acceso al servicio, uso permitido y responsabilidades del usuario."
      icon={FileText}
      updatedAt="1 de abril de 2026"
      sections={[
        {
          title: "Alcance del servicio",
          paragraphs: [
            "Facturabill es una herramienta para crear y gestionar documentos comerciales como facturas, presupuestos, proformas y albaranes.",
            "La plataforma puede incluir plantillas, PDF, historial, borradores, envio por correo y funciones de configuracion relacionadas con la actividad profesional del usuario.",
          ],
        },
        {
          title: "Uso permitido",
          bullets: [
            "Utilizar la plataforma de forma licita y conforme a la normativa aplicable.",
            "Revisar los datos del documento antes de descargarlo, enviarlo o emitirlo.",
            "Mantener actualizada la informacion necesaria para operar correctamente.",
          ],
        },
        {
          title: "Responsabilidad del usuario",
          paragraphs: [
            "El usuario asume la responsabilidad sobre la exactitud del contenido generado, la numeracion, los impuestos aplicados y la adecuacion legal o fiscal de cada documento emitido.",
          ],
        },
        {
          title: "Disponibilidad y cambios",
          paragraphs: [
            "El servicio puede evolucionar, modificarse o suspender funciones para mejorar el producto, corregir incidencias o adaptarse a cambios normativos.",
          ],
        },
        {
          title: "Limitacion de responsabilidad",
          paragraphs: [
            "Facturabill no garantiza ausencia total de errores ni sustituye el asesoramiento legal, fiscal o contable individualizado.",
            "Se recomienda revisar siempre los documentos antes de utilizarlos frente a terceros.",
          ],
        },
        {
          title: "Contacto",
          paragraphs: [
            "Para cualquier consulta relacionada con estos terminos puedes escribir a soporte@facturabill.net.",
          ],
        },
      ]}
    />
  );
}
