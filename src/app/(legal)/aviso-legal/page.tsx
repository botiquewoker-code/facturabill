import { Scale } from "lucide-react";
import { LegalDocumentPage } from "@/features/legal/LegalDocumentPage";

export default function AvisoLegalPage() {
  return (
    <LegalDocumentPage
      badge="Legal"
      eyebrow="Aviso legal"
      title="Informacion general del servicio"
      description="Datos identificativos, alcance del sitio y marco basico de uso de la plataforma."
      icon={Scale}
      updatedAt="1 de abril de 2026"
      sections={[
        {
          title: "Datos identificativos",
          paragraphs: [
            "Titular: Facturabill.",
            "Direccion: Paseo de la Castellana 189, 28046 Madrid, Espana.",
            "Contacto: soporte@facturabill.net.",
          ],
        },
        {
          title: "Objeto del sitio",
          paragraphs: [
            "Facturabill ofrece una aplicacion online para crear, guardar y gestionar facturas, presupuestos y otros documentos comerciales para profesionales y empresas.",
          ],
        },
        {
          title: "Uso de la plataforma",
          paragraphs: [
            "El acceso y uso del servicio implica la condicion de usuario y el compromiso de utilizarlo de forma licita, diligente y conforme a la normativa aplicable.",
          ],
        },
        {
          title: "Propiedad intelectual e industrial",
          paragraphs: [
            "Los contenidos, disenos, codigo, logotipos e interfaz de Facturabill pertenecen a sus titulares o se usan con la autorizacion necesaria. No pueden reproducirse, distribuirse o transformarse sin autorizacion expresa.",
          ],
        },
        {
          title: "Proteccion de datos",
          paragraphs: [
            "El tratamiento de datos personales se realiza conforme al RGPD y a la LOPDGDD. La informacion detallada sobre finalidades, bases juridicas, derechos y conservacion esta disponible en la politica de privacidad.",
          ],
        },
        {
          title: "Responsabilidad y ley aplicable",
          paragraphs: [
            "El usuario es responsable de los datos y documentos que introduzca en la plataforma. Facturabill no responde del uso indebido del servicio ni de errores en la informacion aportada por el usuario.",
            "La relacion con el usuario se rige por la normativa espanola y por los juzgados y tribunales competentes conforme a derecho.",
          ],
        },
      ]}
    />
  );
}
