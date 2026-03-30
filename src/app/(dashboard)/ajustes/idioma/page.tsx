"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { languageOptions, type AppLanguage } from "@/features/i18n/config";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";

export default function AjustesIdiomaPage() {
  const router = useRouter();
  const { language, setLanguage } = useAppLanguage();
  const copy = dashboardCopy[language];
  const currentOption = languageOptions.find((option) => option.value === language);

  function handleSelectLanguage(nextLanguage: AppLanguage) {
    setLanguage(nextLanguage);
    router.replace("/ajustes");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#f2f4f6_52%,#eef1f4_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_transparent_72%)]" />
      <div className="pointer-events-none absolute -left-8 top-16 h-24 w-24 rounded-full bg-[#efe2d3]/42 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-24 h-24 w-24 rounded-full bg-[#dde6f1]/65 blur-3xl" />

      <main className="relative mx-auto min-h-screen w-full max-w-[430px] px-4 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
        <header className="px-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/ajustes"
              aria-label="Back to settings"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </Link>

            <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
              {copy.settings.currentLanguage}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {copy.settings.badge}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.055em] text-slate-950">
              {copy.settings.languageSheetTitle}
            </h1>
            <p className="mt-3 max-w-[18rem] text-[14px] leading-6 text-slate-500">
              {copy.settings.languageSheetDescription}
            </p>
          </div>
        </header>

        <section className="mt-8">
          <div className="px-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                01
              </span>
              <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(148,163,184,0.22),transparent)]" />
            </div>

            <h2 className="mt-3 text-[1.12rem] font-semibold tracking-[-0.04em] text-slate-950">
              {copy.settings.languageRegion}
            </h2>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#ebe7e0] bg-white/80 px-3 py-1.5 text-[13px] text-slate-600">
              {currentOption ? (
                <span className="overflow-hidden rounded-[4px] border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                  <Image
                    src={currentOption.flagSrc}
                    alt=""
                    aria-hidden="true"
                    width={18}
                    height={12}
                    className="h-3 w-[18px] object-cover"
                  />
                </span>
              ) : null}
              <span>
                {copy.settings.currentLanguage}: {currentOption?.nativeLabel}
              </span>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[28px] border border-[#ebe7e0] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,248,245,0.96))] shadow-[0_16px_34px_-30px_rgba(15,23,42,0.18)]">
            {languageOptions.map((option, index) => {
              const isSelected = option.value === language;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectLanguage(option.value)}
                  className="block w-full text-left transition hover:bg-white/70"
                >
                  <div className="group relative">
                    {index > 0 ? (
                      <div className="absolute left-5 right-5 top-0 border-t border-[#ece8e1]" />
                    ) : null}

                    <div className="flex items-center gap-4 px-5 py-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f6f3] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)]">
                        <span className="overflow-hidden rounded-[6px] border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                          <Image
                            src={option.flagSrc}
                            alt=""
                            aria-hidden="true"
                            width={24}
                            height={16}
                            className="h-4 w-6 object-cover"
                          />
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-medium tracking-[-0.02em] text-slate-900">
                          {option.nativeLabel}
                        </h3>
                        <p className="mt-1 text-[13px] leading-5 text-slate-500">
                          {option.label}
                        </p>
                      </div>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                          isSelected
                            ? "bg-slate-950 text-white"
                            : "bg-[#f7f6f3] text-transparent"
                        }`}
                      >
                        <Check className="h-4 w-4" strokeWidth={2.4} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
