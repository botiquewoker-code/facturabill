"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { USER_PROFILE_STORAGE_KEY } from "@/features/account/profile";
import { CLIENTS_STORAGE_KEY } from "@/features/clients/storage";
import {
  ACTIVE_DRAFT_STORAGE_KEY,
  DRAFTS_STORAGE_KEY,
} from "@/features/drafts/storage";
import {
  LANGUAGE_STORAGE_KEY,
  languageOptions,
  type AppLanguage,
} from "@/features/i18n/config";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import {
  VERIFACTU_EVENTS_STORAGE_KEY,
  VERIFACTU_INSTALLATION_ID_STORAGE_KEY,
  VERIFACTU_RECORDS_STORAGE_KEY,
} from "@/features/verifactu/storage";

const PAYMENT_METHODS_STORAGE_KEY = "facturabill-payment-methods";
const EXPORTABLE_STORAGE_KEYS = [
  LANGUAGE_STORAGE_KEY,
  USER_PROFILE_STORAGE_KEY,
  CLIENTS_STORAGE_KEY,
  DRAFTS_STORAGE_KEY,
  ACTIVE_DRAFT_STORAGE_KEY,
  PAYMENT_METHODS_STORAGE_KEY,
  VERIFACTU_RECORDS_STORAGE_KEY,
  VERIFACTU_EVENTS_STORAGE_KEY,
  VERIFACTU_INSTALLATION_ID_STORAGE_KEY,
  "historial",
  "datosEmpresa",
  "configEmpresa",
  "logoUsuario",
  "notasUsuario",
  "plantillaSeleccionada",
  "plantillaUsuario",
  "plantillaElegida",
  "ultimoNumeroFactura",
  "ultimoNumeroPresupuesto",
] as const;

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
    exportData: "تصدير البيانات",
    exportDataDescription:
      "نزّل نسخة من بيانات الشركة والعملاء والسجل والمسودات والإعدادات.",
    helpCenter: "مركز المساعدة",
    helpCenterDescription:
      "دليل سريع للأسئلة الشائعة حول الفواتير وملفات PDF والاستخدام اليومي.",
    support: "التواصل مع الدعم",
    supportDescription:
      "افتح طلب دعم عندما تواجه عائقاً حقيقياً أو تحتاج إلى مساعدة مباشرة.",
    feedback: "إرسال ملاحظات",
    feedbackDescription:
      "شارك الأخطاء أو التحسينات أو أفكار المنتج للإصدارات القادمة.",
    deleteAccount: "حذف الحساب",
    deleteAccountDescription:
      "راجع مسار حذف الحساب وأدر الطلب قبل تأكيده.",
    exportSuccess: "تم تصدير البيانات بنجاح",
    exportEmpty: "لا توجد بيانات جاهزة للتصدير بعد",
    exportError: "تعذر تصدير البيانات",
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
      "Deel bugs, verbeteringen of productideeën voor volgende versies.",
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
    title: "Preparacion VeriFactu",
    description:
      "Consulta el estado de tus facturas y el seguimiento de VeriFactu.",
  },
  en: {
    title: "VeriFactu setup",
    description:
      "Review your invoice status and VeriFactu follow-up.",
  },
  ar: {
    title: "VeriFactu",
    description:
      "راجع حالة الفواتير ومتابعة VeriFactu.",
  },
  fr: {
    title: "Preparation VeriFactu",
    description:
      "Consultez l'etat de vos factures et le suivi VeriFactu.",
  },
  it: {
    title: "Preparazione VeriFactu",
    description:
      "Controlla lo stato delle fatture e il monitoraggio VeriFactu.",
  },
  nl: {
    title: "VeriFactu voorbereiding",
    description:
      "Bekijk de status van je facturen en de VeriFactu-opvolging.",
  },
  pt: {
    title: "Preparacao VeriFactu",
    description:
      "Reve o estado das faturas e o acompanhamento VeriFactu.",
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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#f2f4f6_52%,#eef1f4_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_transparent_72%)]" />
      <div className="pointer-events-none absolute -left-8 top-16 h-24 w-24 rounded-full bg-[#efe2d3]/42 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-24 h-24 w-24 rounded-full bg-[#dde6f1]/65 blur-3xl" />

      <main className="relative mx-auto min-h-screen w-full max-w-[430px] px-4 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
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
            <h1 className="mt-2 text-[2.05rem] font-semibold tracking-[-0.055em] text-slate-950">
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
