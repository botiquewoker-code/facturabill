import { type AppLanguage } from "@/features/i18n/config";

export type LocalizedValue<T> = {
  es: T;
  en?: T;
  ar?: T;
  fr?: T;
  it?: T;
  nl?: T;
  pt?: T;
};

const LANGUAGE_LOCALES: Record<AppLanguage, string> = {
  es: "es-ES",
  en: "en-GB",
  ar: "ar-SA",
  fr: "fr-FR",
  it: "it-IT",
  nl: "nl-NL",
  pt: "pt-PT",
};

export function getLanguageLocale(language: AppLanguage) {
  return LANGUAGE_LOCALES[language] || LANGUAGE_LOCALES.es;
}

export function pickLocalizedValue<T>(
  language: AppLanguage,
  values: LocalizedValue<T>,
) {
  return values[language] ?? values.en ?? values.es;
}

export function formatCurrencyByLanguage(
  language: AppLanguage,
  value: number,
  currency = "EUR",
) {
  return new Intl.NumberFormat(getLanguageLocale(language), {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}

export function formatDateByLanguage(
  language: AppLanguage,
  value: string | number | Date | undefined,
  options?: Intl.DateTimeFormatOptions,
  fallback = "",
) {
  if (!value) {
    return fallback;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback || String(value);
  }

  return new Intl.DateTimeFormat(
    getLanguageLocale(language),
    options || { dateStyle: "medium" },
  ).format(date);
}

export function formatDateTimeByLanguage(
  language: AppLanguage,
  value: string | number | Date | undefined,
  fallback = "",
) {
  return formatDateByLanguage(
    language,
    value,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
    fallback,
  );
}
