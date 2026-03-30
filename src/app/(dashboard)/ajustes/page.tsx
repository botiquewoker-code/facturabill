"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { languageOptions } from "@/features/i18n/config";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";

type SettingsItem = {
  title: string;
  description: string;
  href?: string;
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
  onClick,
}: {
  item: SettingsItem;
  isFirst: boolean;
  onClick?: () => void;
}) {
  const content = (
    <div className="group relative">
      {!isFirst ? (
        <div className="absolute left-5 right-5 top-0 border-t border-[#ece8e1]" />
      ) : null}

      <div className="flex items-center gap-4 px-5 py-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-medium tracking-[-0.02em] text-slate-900">
            {item.title}
          </h3>
          <p className="mt-1 text-[13px] leading-5 text-slate-500">
            {item.description}
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f6f3] text-slate-300 transition group-hover:bg-[#f1f0ec] group-hover:text-slate-500">
          <ChevronRight className="h-[16px] w-[16px]" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block transition hover:bg-white/70">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left transition hover:bg-white/70"
    >
      {content}
    </button>
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
  const selectedLanguage =
    languageOptions.find((option) => option.value === language)?.nativeLabel || "";

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
        {
          title: copy.settings.accountActions,
          description: copy.settings.accountActionsDescription,
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
