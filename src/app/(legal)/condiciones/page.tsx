import { ScrollText } from "lucide-react";
import { LegalDocumentPage } from "@/features/legal/LegalDocumentPage";

export default function CondicionesPage() {
  return (
    <LegalDocumentPage
      badge="Servicio"
      eyebrow="Condiciones"
      title="Condiciones generales"
      description="Marco operativo del servicio, obligaciones del usuario y criterios basicos para un uso profesional."
      icon={ScrollText}
      updatedAt="1 de abril de 2026"
      sections={[
        {
          title: "Objeto del servicio",
          paragraphs: [
            "Facturabill.net esta orientado a la creacion, gestion, almacenamiento y envio de documentos comerciales en un entorno digital.",
          ],
        },
        {
          title: "Acceso y utilizacion",
          paragraphs: [
            "El uso de la plataforma exige aceptar estas condiciones y utilizar el servicio de forma responsable, profesional y conforme a derecho.",
            "El usuario debe revisar la informacion introducida antes de descargar, compartir o emitir un documento con efectos frente a terceros.",
          ],
        },
        {
          title: "Obligaciones del usuario",
          bullets: [
            "Introducir datos veraces, completos y actualizados.",
            "Usar una numeracion y una configuracion fiscal coherentes con su actividad.",
            "Conservar los documentos conforme a la normativa que le resulte aplicable.",
            "No utilizar la plataforma con fines fraudulentos o contrarios a la ley.",
          ],
        },
        {
          title: "Disponibilidad y evolucion",
          paragraphs: [
            "Facturabill.net puede actualizar sus funcionalidades, diseno o comportamiento para mejorar el servicio, corregir incidencias o adaptarse a cambios regulatorios.",
            "No se garantiza disponibilidad permanente ni ausencia total de interrupciones o errores.",
          ],
        },
        {
          title: "Responsabilidad",
          paragraphs: [
            "El usuario asume la responsabilidad sobre el contenido de los documentos generados y sobre su adecuacion legal, fiscal o contable.",
            "Facturabill.net no sustituye asesoramiento profesional individualizado.",
          ],
        },
        {
          title: "Propiedad intelectual y contacto",
          paragraphs: [
            "La marca, el codigo, las plantillas, la interfaz y el resto de elementos del servicio estan protegidos por la normativa de propiedad intelectual e industrial.",
            "Para cualquier consulta relacionada con estas condiciones puedes escribir a soporte@facturabill.net.",
          ],
        },
      ]}
    />
  );
}
