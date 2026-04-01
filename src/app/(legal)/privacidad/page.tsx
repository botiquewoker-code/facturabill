import { ShieldCheck } from "lucide-react";
import { LegalDocumentPage } from "@/features/legal/LegalDocumentPage";

export default function PrivacidadPage() {
  return (
    <LegalDocumentPage
      badge="Privacidad"
      eyebrow="RGPD"
      title="Politica de privacidad"
      description="Como se tratan los datos de cuenta, clientes y documentos dentro de Facturabill."
      icon={ShieldCheck}
      updatedAt="1 de abril de 2026"
      sections={[
        {
          title: "Responsable del tratamiento",
          paragraphs: [
            "El responsable del tratamiento de los datos recabados a traves de Facturabill.net es el titular del servicio.",
            "Contacto para privacidad y derechos: soporte@facturabill.net.",
          ],
        },
        {
          title: "Datos tratados",
          paragraphs: [
            "Se tratan los datos necesarios para prestar el servicio: informacion de cuenta, empresa, clientes, documentos, ajustes y comunicaciones de soporte o feedback cuando correspondan.",
          ],
          bullets: [
            "Datos introducidos en formularios y documentos.",
            "Informacion necesaria para mantener la experiencia de uso y el funcionamiento del servicio.",
            "Datos de facturacion y suscripcion cuando procedan.",
          ],
        },
        {
          title: "Finalidades",
          bullets: [
            "Prestar el servicio de creacion, gestion, descarga y envio de documentos.",
            "Atender soporte, incidencias y comunicaciones relacionadas con la cuenta.",
            "Gestionar suscripciones, pagos o datos administrativos cuando proceda.",
            "Mantener la seguridad, continuidad y mejora del servicio.",
          ],
        },
        {
          title: "Base juridica",
          bullets: [
            "La ejecucion del servicio solicitado por el usuario.",
            "El cumplimiento de obligaciones legales aplicables.",
            "El interes legitimo para garantizar seguridad, calidad y continuidad del servicio.",
            "El consentimiento cuando resulte necesario para una funcionalidad concreta.",
          ],
        },
        {
          title: "Conservacion",
          paragraphs: [
            "Los datos se conservan durante el tiempo necesario para prestar el servicio, atender incidencias, cumplir obligaciones legales y defender posibles reclamaciones.",
            "Los datos de naturaleza fiscal o de facturacion se conservaran durante el plazo exigido por la normativa aplicable.",
          ],
        },
        {
          title: "Derechos de los usuarios",
          bullets: [
            "Acceso, rectificacion y supresion.",
            "Oposicion y limitacion del tratamiento.",
            "Portabilidad.",
            "No ser objeto de decisiones exclusivamente automatizadas cuando proceda.",
          ],
          paragraphs: [
            "Puedes ejercer estos derechos escribiendo a soporte@facturabill.net.",
          ],
        },
        {
          title: "Seguridad",
          paragraphs: [
            "Se aplican medidas tecnicas y organizativas adecuadas para proteger los datos frente a accesos no autorizados, perdida, alteracion o tratamiento indebido.",
          ],
        },
      ]}
    />
  );
}
