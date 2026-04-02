"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import {
  languageOptions,
  type AppLanguage,
} from "@/features/i18n/config";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import { EXPORTABLE_STORAGE_KEYS } from "@/features/storage/export";

type AccountActionsCopy = {
  exportData: string;
  exportDataDescription: string;
  helpCenter: string;
  helpCenterDescription: string;
  support: string;
  supportDescription: string;
  feedback: string;
  feedbackDescription: string;
  deleteAccount: string;
  deleteAccountDescription: string;
  exportSuccess: string;
  exportEmpty: string;
  exportError: string;
};

const accountActionsCopy: Record<AppLanguage, AccountActionsCopy> = {
  es: {
    exportData: "Exportar datos",
    exportDataDescription:
      "Descarga una copia de tu informacion de empresa, clientes, historial, borradores y ajustes.",
    helpCenter: "Centro de ayuda",
    helpCenterDescription:
      "Guia rapida con dudas frecuentes sobre facturas, PDF y uso basico.",
    support: "Contactar con soporte",
    supportDescription:
      "Abre una consulta cuando tengas un bloqueo real o necesites ayuda directa.",
    feedback: "Enviar feedback",
    feedbackDescription:
      "Comparte errores, mejoras o ideas de producto para futuras versiones.",
    deleteAccount: "Eliminar cuenta",
    deleteAccountDescription:
      "Gestiona la solicitud de eliminacion y revisa el proceso antes de confirmarlo.",
    exportSuccess: "Datos exportados correctamente",
    exportEmpty: "Todavia no hay informacion para exportar",
    exportError: "No se pudieron exportar los datos",
  },
  en: {
    exportData: "Export data",
    exportDataDescription:
      "Download a copy of your company, clients, history, drafts, and settings.",
    helpCenter: "Help center",
    helpCenterDescription:
      "Quick guidance for invoices, PDFs, and everyday usage questions.",
    support: "Contact support",
    supportDescription:
      "Open a support request when you are blocked or need direct assistance.",
    feedback: "Send feedback",
    feedbackDescription:
      "Share bugs, improvements, or product ideas for future releases.",
    deleteAccount: "Delete account",
    deleteAccountDescription:
      "Review the deletion flow and manage the request before confirming it.",
    exportSuccess: "Data exported successfully",
    exportEmpty: "There is no information to export yet",
    exportError: "Unable to export data",
  },
  ar: {
    exportData: "\u062a\u0635\u062f\u064a\u0631 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a",
    exportDataDescription:
      "\u0646\u0632\u0651\u0644 \u0646\u0633\u062e\u0629 \u0645\u0646 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0634\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0648\u0627\u0644\u0633\u062c\u0644 \u0648\u0627\u0644\u0645\u0633\u0648\u062f\u0627\u062a \u0648\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a.",
    helpCenter: "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629",
    helpCenterDescription:
      "\u062f\u0644\u064a\u0644 \u0633\u0631\u064a\u0639 \u0644\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629 \u062d\u0648\u0644 \u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631 \u0648\u0645\u0644\u0641\u0627\u062a PDF \u0648\u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u064a\u0648\u0645\u064a.",
    support: "\u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062f\u0639\u0645",
    supportDescription:
      "\u0627\u0641\u062a\u062d \u0637\u0644\u0628 \u062f\u0639\u0645 \u0639\u0646\u062f\u0645\u0627 \u062a\u0648\u0627\u062c\u0647 \u0639\u0627\u0626\u0642\u0627\u064b \u062d\u0642\u064a\u0642\u064a\u0627\u064b \u0623\u0648 \u062a\u062d\u062a\u0627\u062c \u0625\u0644\u0649 \u0645\u0633\u0627\u0639\u062f\u0629 \u0645\u0628\u0627\u0634\u0631\u0629.",
    feedback: "\u0625\u0631\u0633\u0627\u0644 \u0645\u0644\u0627\u062d\u0638\u0627\u062a",
    feedbackDescription:
      "\u0634\u0627\u0631\u0643 \u0627\u0644\u0623\u062e\u0637\u0627\u0621 \u0623\u0648 \u0627\u0644\u062a\u062d\u0633\u064a\u0646\u0627\u062a \u0623\u0648 \u0623\u0641\u0643\u0627\u0631 \u0627\u0644\u0645\u0646\u062a\u062c \u0644\u0644\u0625\u0635\u062f\u0627\u0631\u0627\u062a \u0627\u0644\u0642\u0627\u062f\u0645\u0629.",
    deleteAccount: "\u062d\u0630\u0641 \u0627\u0644\u062d\u0633\u0627\u0628",
    deleteAccountDescription:
      "\u0631\u0627\u062c\u0639 \u0645\u0633\u0627\u0631 \u062d\u0630\u0641 \u0627\u0644\u062d\u0633\u0627\u0628 \u0648\u0623\u062f\u0631 \u0627\u0644\u0637\u0644\u0628 \u0642\u0628\u0644 \u062a\u0623\u0643\u064a\u062f\u0647.",
    exportSuccess: "\u062a\u0645 \u062a\u0635\u062f\u064a\u0631 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0628\u0646\u062c\u0627\u062d",
    exportEmpty: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u062a\u0635\u062f\u064a\u0631 \u0628\u0639\u062f",
    exportError: "\u062a\u0639\u0630\u0631 \u062a\u0635\u062f\u064a\u0631 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a",
  },
  fr: {
    exportData: "Exporter les donnees",
    exportDataDescription:
      "Telechargez une copie des donnees de l'entreprise, des clients, de l'historique, des brouillons et des reglages.",
    helpCenter: "Centre d'aide",
    helpCenterDescription:
      "Guide rapide pour les questions frequentes sur les factures, les PDF et l'usage quotidien.",
    support: "Contacter le support",
    supportDescription:
      "Ouvrez une demande lorsque vous etes bloque ou avez besoin d'une aide directe.",
    feedback: "Envoyer un retour",
    feedbackDescription:
      "Partagez bugs, ameliorations ou idees produit pour les prochaines versions.",
    deleteAccount: "Supprimer le compte",
    deleteAccountDescription:
      "Consultez le processus de suppression avant de confirmer la demande.",
    exportSuccess: "Donnees exportees avec succes",
    exportEmpty: "Aucune information a exporter pour le moment",
    exportError: "Impossible d'exporter les donnees",
  },
  it: {
    exportData: "Esporta dati",
    exportDataDescription:
      "Scarica una copia di azienda, clienti, storico, bozze e impostazioni.",
    helpCenter: "Centro assistenza",
    helpCenterDescription:
      "Guida rapida per dubbi comuni su fatture, PDF e utilizzo quotidiano.",
    support: "Contatta il supporto",
    supportDescription:
      "Apri una richiesta quando hai un blocco reale o ti serve aiuto diretto.",
    feedback: "Invia feedback",
    feedbackDescription:
      "Condividi bug, miglioramenti o idee di prodotto per le prossime versioni.",
    deleteAccount: "Elimina account",
    deleteAccountDescription:
      "Consulta il flusso di eliminazione e gestisci la richiesta prima di confermarla.",
    exportSuccess: "Dati esportati correttamente",
    exportEmpty: "Non ci sono ancora informazioni da esportare",
    exportError: "Impossibile esportare i dati",
  },
  nl: {
    exportData: "Gegevens exporteren",
    exportDataDescription:
      "Download een kopie van bedrijf, klanten, geschiedenis, concepten en instellingen.",
    helpCenter: "Helpcentrum",
    helpCenterDescription:
      "Snelle gids voor veelgestelde vragen over facturen, pdf's en dagelijks gebruik.",
    support: "Contact opnemen met support",
    supportDescription:
      "Open een supportverzoek wanneer je vastloopt of directe hulp nodig hebt.",
    feedback: "Feedback sturen",
    feedbackDescription:
      "Deel bugs, verbeteringen of productidee\u00ebn voor volgende versies.",
    deleteAccount: "Account verwijderen",
    deleteAccountDescription:
      "Bekijk het verwijderproces en beheer het verzoek voordat je bevestigt.",
    exportSuccess: "Gegevens succesvol geexporteerd",
    exportEmpty: "Er is nog geen informatie om te exporteren",
    exportError: "Gegevens konden niet worden geexporteerd",
  },
  pt: {
    exportData: "Exportar dados",
    exportDataDescription:
      "Transfere uma copia da empresa, clientes, historico, rascunhos e definicoes.",
    helpCenter: "Centro de ajuda",
    helpCenterDescription:
      "Guia rapido para duvidas frequentes sobre faturas, PDF e uso diario.",
    support: "Contactar suporte",
    supportDescription:
      "Abre um pedido quando estiveres bloqueado ou precisares de ajuda direta.",
    feedback: "Enviar feedback",
    feedbackDescription:
      "Partilha erros, melhorias ou ideias de produto para futuras versoes.",
    deleteAccount: "Eliminar conta",
    deleteAccountDescription:
      "Reve o processo de eliminacao e gere o pedido antes de o confirmares.",
    exportSuccess: "Dados exportados com sucesso",
    exportEmpty: "Ainda nao ha informacao para exportar",
    exportError: "Nao foi possivel exportar os dados",
  },
};

const verifactuSettingsCopy: Record<
  AppLanguage,
  { title: string; description: string }
> = {
  es: {
    title: "VeriFactu y envio",
    description:
      "Revisa el seguimiento y activa el envio automatico para nuevas facturas.",
  },
  en: {
    title: "VeriFactu and submission",
    description:
      "Review tracking and enable automatic submission for new invoices.",
  },
  ar: {
    title: "VeriFactu",
    description:
      "\u0631\u0627\u062c\u0639 \u062d\u0627\u0644\u0629 \u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631 \u0648\u0645\u062a\u0627\u0628\u0639\u0629 VeriFactu.",
  },
  fr: {
    title: "VeriFactu et envoi",
    description:
      "Consultez le suivi et activez l'envoi automatique pour les nouvelles factures.",
  },
  it: {
    title: "VeriFactu e invio",
    description:
      "Controlla il monitoraggio e attiva l'invio automatico per le nuove fatture.",
  },
  nl: {
    title: "VeriFactu en verzending",
    description:
      "Bekijk tracking en activeer automatische verzending voor nieuwe facturen.",
  },
  pt: {
    title: "VeriFactu e envio",
    description:
      "Reve o acompanhamento e ativa o envio automatico para novas faturas.",
  },
};

const accessProfileCopy: Record<
  AppLanguage,
  { title: string; description: string }
> = {
  es: {
    title: "Datos de acceso",
    description:
      "Actualiza nombre, correo y contrasena del usuario o gerente.",
  },
  en: {
    title: "Access details",
    description: "Update the user or manager name, email, and password.",
  },
  ar: {
    title: "Access details",
    description: "Update the user or manager name, email, and password.",
  },
  fr: {
    title: "Donnees d'acces",
    description:
      "Mettez a jour le nom, l'email et le mot de passe de l'utilisateur ou du gerant.",
  },
  it: {
    title: "Dati di accesso",
    description: "Aggiorna nome, email e password dell'utente o del gerente.",
  },
  nl: {
    title: "Toegangsgegevens",
    description: "Werk naam, e-mail en wachtwoord van gebruiker of manager bij.",
  },
  pt: {
    title: "Dados de acesso",
    description: "Atualiza nome, email e palavra-passe do utilizador ou gerente.",
  },
};

const legalComplianceCopy: Record<
  AppLanguage,
  {
    title: string;
    description: string;
    legalNotice: string;
    legalNoticeDescription: string;
    privacy: string;
    privacyDescription: string;
    terms: string;
    termsDescription: string;
    serviceConditions: string;
    serviceConditionsDescription: string;
    invoiceRetention: string;
    invoiceRetentionDescription: string;
    verifactuTimeline: string;
    verifactuTimelineDescription: string;
  }
> = {
  es: {
    title: "Cumplimiento y legal",
    description:
      "Transparencia, privacidad, conservacion documental y marco regulatorio para operar con criterio profesional.",
    legalNotice: "Aviso legal",
    legalNoticeDescription:
      "Datos del titular, contacto e informacion general del servicio exigida por la LSSI.",
    privacy: "Privacidad y proteccion de datos",
    privacyDescription:
      "Tratamiento, base legal, derechos RGPD/LOPDGDD y uso de datos de cuenta y clientes.",
    terms: "Terminos de uso",
    termsDescription:
      "Reglas de acceso, responsabilidades del usuario y alcance del servicio.",
    serviceConditions: "Condiciones del servicio",
    serviceConditionsDescription:
      "Marco operativo, disponibilidad, cambios del servicio y relacion contractual.",
    invoiceRetention: "Conservacion de facturas",
    invoiceRetentionDescription:
      "Manten facturas y copias durante el plazo tributario y asegurate de que sigan siendo accesibles, integras y legibles.",
    verifactuTimeline: "Calendario VeriFactu",
    verifactuTimelineDescription:
      "Si te aplica esta obligacion en Espana, revisa la adaptacion antes del 1 de enero de 2026 para Impuesto sobre Sociedades y antes del 1 de julio de 2026 para el resto.",
  },
  en: {
    title: "Compliance and legal",
    description:
      "Transparency, privacy, document retention, and regulatory essentials for professional operation.",
    legalNotice: "Legal notice",
    legalNoticeDescription:
      "Owner details, contact information, and general service disclosures required under Spanish law.",
    privacy: "Privacy and data protection",
    privacyDescription:
      "Processing, legal basis, GDPR rights, and the use of account and client data.",
    terms: "Terms of use",
    termsDescription:
      "Access rules, user responsibilities, and the scope of the service.",
    serviceConditions: "Service conditions",
    serviceConditionsDescription:
      "Operating framework, availability, service changes, and contractual terms.",
    invoiceRetention: "Invoice retention",
    invoiceRetentionDescription:
      "Keep invoices and copies for the tax retention period and ensure they remain accessible, intact, and legible.",
    verifactuTimeline: "VeriFactu timeline",
    verifactuTimelineDescription:
      "If this obligation applies to you in Spain, review system readiness before January 1, 2026 for corporate taxpayers and before July 1, 2026 for the rest.",
  },
  ar: {
    title: "Compliance and legal",
    description:
      "Transparency, privacy, document retention, and regulatory essentials for professional operation.",
    legalNotice: "Legal notice",
    legalNoticeDescription:
      "Owner details, contact information, and general service disclosures required under Spanish law.",
    privacy: "Privacy and data protection",
    privacyDescription:
      "Processing, legal basis, GDPR rights, and the use of account and client data.",
    terms: "Terms of use",
    termsDescription:
      "Access rules, user responsibilities, and the scope of the service.",
    serviceConditions: "Service conditions",
    serviceConditionsDescription:
      "Operating framework, availability, service changes, and contractual terms.",
    invoiceRetention: "Invoice retention",
    invoiceRetentionDescription:
      "Keep invoices and copies for the tax retention period and ensure they remain accessible, intact, and legible.",
    verifactuTimeline: "VeriFactu timeline",
    verifactuTimelineDescription:
      "If this obligation applies to you in Spain, review system readiness before January 1, 2026 for corporate taxpayers and before July 1, 2026 for the rest.",
  },
  fr: {
    title: "Conformite et legal",
    description:
      "Transparence, confidentialite, conservation des documents et cadre reglementaire pour un usage professionnel.",
    legalNotice: "Mentions legales",
    legalNoticeDescription:
      "Identite du titulaire, contact et informations generales du service requises par la LSSI.",
    privacy: "Confidentialite et protection des donnees",
    privacyDescription:
      "Traitement, base legale, droits RGPD et usage des donnees du compte et des clients.",
    terms: "Conditions d'utilisation",
    termsDescription:
      "Regles d'acces, responsabilites de l'utilisateur et perimetre du service.",
    serviceConditions: "Conditions du service",
    serviceConditionsDescription:
      "Cadre operationnel, disponibilite, evolutions du service et relation contractuelle.",
    invoiceRetention: "Conservation des factures",
    invoiceRetentionDescription:
      "Conservez les factures et leurs copies pendant le delai fiscal applicable et gardez-les accessibles, intgres et lisibles.",
    verifactuTimeline: "Calendrier VeriFactu",
    verifactuTimelineDescription:
      "Si cette obligation vous concerne en Espagne, verifiez l'adaptation avant le 1 janvier 2026 pour l'impot sur les societes et avant le 1 juillet 2026 pour les autres cas.",
  },
  it: {
    title: "Compliance e legale",
    description:
      "Trasparenza, privacy, conservazione documentale e riferimenti normativi per lavorare in modo professionale.",
    legalNotice: "Informativa legale",
    legalNoticeDescription:
      "Dati del titolare, contatto e informazioni generali del servizio richieste dalla normativa spagnola.",
    privacy: "Privacy e protezione dati",
    privacyDescription:
      "Trattamento, base giuridica, diritti GDPR e uso dei dati di account e clienti.",
    terms: "Termini di utilizzo",
    termsDescription:
      "Regole di accesso, responsabilita dell'utente e ambito del servizio.",
    serviceConditions: "Condizioni del servizio",
    serviceConditionsDescription:
      "Quadro operativo, disponibilita, modifiche del servizio e rapporto contrattuale.",
    invoiceRetention: "Conservazione fatture",
    invoiceRetentionDescription:
      "Conserva fatture e copie per il periodo fiscale richiesto e mantienile accessibili, integre e leggibili.",
    verifactuTimeline: "Scadenze VeriFactu",
    verifactuTimelineDescription:
      "Se l'obbligo ti riguarda in Spagna, verifica l'adeguamento entro il 1 gennaio 2026 per l'imposta sulle societa e entro il 1 luglio 2026 negli altri casi.",
  },
  nl: {
    title: "Compliance en juridisch",
    description:
      "Transparantie, privacy, documentbewaring en wettelijke basis voor professioneel gebruik.",
    legalNotice: "Juridische kennisgeving",
    legalNoticeDescription:
      "Gegevens van de eigenaar, contactinformatie en algemene dienstinformatie volgens de Spaanse wet.",
    privacy: "Privacy en gegevensbescherming",
    privacyDescription:
      "Verwerking, rechtsgrond, AVG-rechten en gebruik van account- en klantgegevens.",
    terms: "Gebruiksvoorwaarden",
    termsDescription:
      "Toegangsregels, verantwoordelijkheden van de gebruiker en reikwijdte van de dienst.",
    serviceConditions: "Dienstvoorwaarden",
    serviceConditionsDescription:
      "Operationeel kader, beschikbaarheid, wijzigingen in de dienst en contractuele relatie.",
    invoiceRetention: "Bewaren van facturen",
    invoiceRetentionDescription:
      "Bewaar facturen en kopieen gedurende de fiscale termijn en zorg dat ze toegankelijk, intact en leesbaar blijven.",
    verifactuTimeline: "VeriFactu planning",
    verifactuTimelineDescription:
      "Als deze verplichting op jou van toepassing is in Spanje, controleer dan de aanpassing voor 1 januari 2026 voor vennootschapsbelasting en voor 1 juli 2026 in de overige gevallen.",
  },
  pt: {
    title: "Compliance e legal",
    description:
      "Transparencia, privacidade, conservacao documental e enquadramento regulatorio para uso profissional.",
    legalNotice: "Aviso legal",
    legalNoticeDescription:
      "Dados do titular, contacto e informacao geral do servico exigida pela legislacao espanhola.",
    privacy: "Privacidade e protecao de dados",
    privacyDescription:
      "Tratamento, base legal, direitos RGPD e uso dos dados da conta e dos clientes.",
    terms: "Termos de utilizacao",
    termsDescription:
      "Regras de acesso, responsabilidades do utilizador e ambito do servico.",
    serviceConditions: "Condicoes do servico",
    serviceConditionsDescription:
      "Enquadramento operacional, disponibilidade, alteracoes do servico e relacao contratual.",
    invoiceRetention: "Conservacao de faturas",
    invoiceRetentionDescription:
      "Guarda faturas e copias durante o prazo fiscal aplicavel e garante que permanecem acessiveis, integras e legiveis.",
    verifactuTimeline: "Calendario VeriFactu",
    verifactuTimelineDescription:
      "Se esta obrigacao se aplicar em Espanha, verifica a adaptacao antes de 1 de janeiro de 2026 para imposto sobre sociedades e antes de 1 de julho de 2026 nos restantes casos.",
  },
};

type SettingsItem = {
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  tone?: "default" | "danger";
};

type SettingsGroup = {
  id: string;
  title: string;
  description: string;
  items: SettingsItem[];
};

function SettingsRow({
  item,
  isFirst,
}: {
  item: SettingsItem;
  isFirst: boolean;
}) {
  const isActionable = Boolean(item.href || item.onClick);
  const isDanger = item.tone === "danger";
  const content = (
    <div className={`group relative ${isActionable ? "" : "cursor-default"}`}>
      {!isFirst ? (
        <div className="absolute left-5 right-5 top-0 border-t border-[#ece8e1]" />
      ) : null}

      <div className="flex items-center gap-4 px-5 py-4">
        <div className="min-w-0 flex-1">
          <h3
            className={`text-[15px] font-medium tracking-[-0.02em] ${
              isDanger ? "text-red-700" : "text-slate-900"
            }`}
          >
            {item.title}
          </h3>
          <p className="mt-1 text-[13px] leading-5 text-slate-500">
            {item.description}
          </p>
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
            isDanger
              ? "bg-red-50 text-red-300 group-hover:bg-red-100 group-hover:text-red-500"
              : "bg-[#f7f6f3] text-slate-300 group-hover:bg-[#f1f0ec] group-hover:text-slate-500"
          } ${isActionable ? "" : "opacity-45"}`}
        >
          <ChevronRight className="h-[16px] w-[16px]" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={`block transition ${
          isDanger ? "hover:bg-red-50/70" : "hover:bg-white/70"
        }`}
      >
        {content}
      </Link>
    );
  }

  if (item.onClick) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className={`block w-full text-left transition ${
          isDanger ? "hover:bg-red-50/70" : "hover:bg-white/70"
        }`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="block w-full text-left">
      {content}
    </div>
  );
}

function SettingsSection({
  group,
}: {
  group: SettingsGroup;
}) {
  return (
    <section className="mt-8">
      <div className="px-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            {group.id}
          </span>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(148,163,184,0.22),transparent)]" />
        </div>

        <h2 className="mt-3 text-[1.12rem] font-semibold tracking-[-0.04em] text-slate-950">
          {group.title}
        </h2>
        <p className="mt-1.5 max-w-[18rem] text-[13px] leading-6 text-slate-500">
          {group.description}
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-[28px] border border-[#ebe7e0] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,248,245,0.96))] shadow-[0_16px_34px_-30px_rgba(15,23,42,0.18)]">
        {group.items.map((item, index) => (
          <SettingsRow
            key={item.title}
            item={item}
            isFirst={index === 0}
          />
        ))}
      </div>
    </section>
  );
}

export default function AjustesPage() {
  const { language } = useAppLanguage();
  const copy = dashboardCopy[language];
  const actionsCopy = accountActionsCopy[language];
  const verifactuCopy = verifactuSettingsCopy[language];
  const accessCopy = accessProfileCopy[language];
  const legalCopy = legalComplianceCopy[language];
  const selectedLanguage =
    languageOptions.find((option) => option.value === language)?.nativeLabel || "";

  function handleExportAccountData() {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const data = EXPORTABLE_STORAGE_KEYS.reduce<Record<string, unknown>>(
        (acc, key) => {
          const raw = window.localStorage.getItem(key);

          if (!raw) {
            return acc;
          }

          try {
            acc[key] = JSON.parse(raw);
          } catch {
            acc[key] = raw;
          }

          return acc;
        },
        {},
      );

      if (Object.keys(data).length === 0) {
        showWarningToast(actionsCopy.exportEmpty);
        return;
      }

      const payload = {
        app: "Facturabill",
        exportedAt: new Date().toISOString(),
        data,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `facturabill-backup-${date}.json`;
      link.click();
      window.URL.revokeObjectURL(url);

      showSuccessToast(actionsCopy.exportSuccess);
    } catch (error) {
      console.error("Error exporting account data", error);
      showWarningToast(actionsCopy.exportError);
    }
  }

  const settingsGroups: SettingsGroup[] = [
    {
      id: "01",
      title: copy.settings.companyTitle,
      description: copy.settings.companyDescription,
      items: [
        {
          title: copy.settings.businessData,
          description: copy.settings.businessDataDescription,
          href: "/empresa",
        },
        {
          title: copy.settings.templates,
          description: copy.settings.templatesDescription,
        },
        {
          title: copy.settings.taxSettings,
          description: copy.settings.taxSettingsDescription,
          href: "/ajustes/configuracion-fiscal",
        },
        {
          title: verifactuCopy.title,
          description: verifactuCopy.description,
          href: "/ajustes/verifactu",
        },
        {
          title: copy.settings.paymentMethods,
          description: copy.settings.paymentMethodsDescription,
          href: "/ajustes/metodos-cobro",
        },
      ],
    },
    {
      id: "02",
      title: copy.settings.accountTitle,
      description: copy.settings.accountDescription,
      items: [
        {
          title: accessCopy.title,
          description: accessCopy.description,
          href: "/ajustes/datos-acceso",
        },
        {
          title: copy.settings.clientCommunication,
          description: copy.settings.clientCommunicationDescription,
        },
        {
          title: copy.settings.subscription,
          description: copy.settings.subscriptionDescription,
        },
        {
          title: copy.settings.languageRegion,
          description: `${copy.settings.languageRegionDescription} - ${selectedLanguage}`,
          href: "/ajustes/idioma",
        },
      ],
    },
    {
      id: "03",
      title: legalCopy.title,
      description: legalCopy.description,
      items: [
        {
          title: legalCopy.legalNotice,
          description: legalCopy.legalNoticeDescription,
          href: "/aviso-legal",
        },
        {
          title: legalCopy.privacy,
          description: legalCopy.privacyDescription,
          href: "/privacidad",
        },
        {
          title: legalCopy.terms,
          description: legalCopy.termsDescription,
          href: "/terminos",
        },
        {
          title: legalCopy.serviceConditions,
          description: legalCopy.serviceConditionsDescription,
          href: "/condiciones",
        },
        {
          title: legalCopy.invoiceRetention,
          description: legalCopy.invoiceRetentionDescription,
        },
        {
          title: legalCopy.verifactuTimeline,
          description: legalCopy.verifactuTimelineDescription,
          href: "/ajustes/verifactu",
        },
      ],
    },
    {
      id: "04",
      title: copy.settings.accountActions,
      description: copy.settings.accountActionsDescription,
      items: [
        {
          title: actionsCopy.exportData,
          description: actionsCopy.exportDataDescription,
          onClick: handleExportAccountData,
        },
        {
          title: actionsCopy.helpCenter,
          description: actionsCopy.helpCenterDescription,
          href: "/ayuda",
        },
        {
          title: actionsCopy.support,
          description: actionsCopy.supportDescription,
          href: "/soporte",
        },
        {
          title: actionsCopy.feedback,
          description: actionsCopy.feedbackDescription,
          href: "/feedback",
        },
        {
          title: actionsCopy.deleteAccount,
          description: actionsCopy.deleteAccountDescription,
          href: "/eliminar-cuenta",
          tone: "danger",
        },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#f2f4f6_52%,#eef1f4_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_transparent_72%)]" />
      <div className="pointer-events-none absolute -left-8 top-16 h-24 w-24 rounded-full bg-[#efe2d3]/42 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-24 h-24 w-24 rounded-full bg-[#dde6f1]/65 blur-3xl" />

      <main className="relative mx-auto min-h-screen w-full max-w-[410px] px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-[calc(0.875rem+env(safe-area-inset-top))] sm:max-w-[430px] sm:pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pt-[calc(1rem+env(safe-area-inset-top))]">
        <header className="px-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              aria-label="Back to dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </Link>

            <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
              {copy.settings.badge}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {copy.settings.eyebrow}
            </p>
            <h1 className="mt-2 text-[1.85rem] sm:text-[2.05rem] font-semibold tracking-[-0.055em] text-slate-950">
              {copy.settings.title}
            </h1>
            <p className="mt-3 max-w-[17rem] text-[14px] leading-6 text-slate-500">
              {copy.settings.intro}
            </p>
          </div>
        </header>

        {settingsGroups.map((group) => (
          <SettingsSection key={group.id} group={group} />
        ))}
      </main>
    </div>
  );
}
