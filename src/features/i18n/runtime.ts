"use client";

import { useMemo } from "react";
import type { LocalizedValue } from "@/features/i18n/core";
import { getLanguageLocale, pickLocalizedValue } from "@/features/i18n/core";
import { useAppLanguage } from "@/features/i18n/provider";

export function useAppI18n() {
  const { language } = useAppLanguage();

  return useMemo(
    () => ({
      language,
      locale: getLanguageLocale(language),
      t: <T,>(values: LocalizedValue<T>) =>
        pickLocalizedValue(language, values),
    }),
    [language],
  );
}
