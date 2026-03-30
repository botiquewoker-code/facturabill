export type AppLanguage = "es" | "en" | "ar" | "fr" | "it" | "nl" | "pt";

export const LANGUAGE_STORAGE_KEY = "facturabill-language";
export const DEFAULT_LANGUAGE: AppLanguage = "es";

export const languageOptions: Array<{
  value: AppLanguage;
  label: string;
  nativeLabel: string;
  flagSrc: string;
  dir: "ltr" | "rtl";
}> = [
  {
    value: "es",
    label: "Spanish",
    nativeLabel: "Espa\u00f1ol (Espa\u00f1a)",
    flagSrc: "/flags/es.svg",
    dir: "ltr",
  },
  {
    value: "en",
    label: "English",
    nativeLabel: "English",
    flagSrc: "/flags/gb.svg",
    dir: "ltr",
  },
  {
    value: "ar",
    label: "Arabic",
    nativeLabel: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    flagSrc: "/flags/sa.svg",
    dir: "rtl",
  },
  {
    value: "fr",
    label: "French",
    nativeLabel: "Fran\u00e7ais",
    flagSrc: "/flags/fr.svg",
    dir: "ltr",
  },
  {
    value: "it",
    label: "Italian",
    nativeLabel: "Italiano",
    flagSrc: "/flags/it.svg",
    dir: "ltr",
  },
  {
    value: "nl",
    label: "Dutch",
    nativeLabel: "Nederlands",
    flagSrc: "/flags/nl.svg",
    dir: "ltr",
  },
  {
    value: "pt",
    label: "Portuguese",
    nativeLabel: "Portugu\u00eas (Portugal)",
    flagSrc: "/flags/pt.svg",
    dir: "ltr",
  },
];

export function isSupportedLanguage(value: string): value is AppLanguage {
  return languageOptions.some((option) => option.value === value);
}

export function getLanguageDirection(language: AppLanguage): "ltr" | "rtl" {
  return languageOptions.find((option) => option.value === language)?.dir || "ltr";
}

export function detectPreferredLanguage(input?: string | null): AppLanguage {
  if (!input) {
    return DEFAULT_LANGUAGE;
  }

  const normalized = input.toLowerCase();

  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("ar")) return "ar";
  if (normalized.startsWith("fr")) return "fr";
  if (normalized.startsWith("it")) return "it";
  if (normalized.startsWith("nl")) return "nl";
  if (normalized.startsWith("pt")) return "pt";

  return DEFAULT_LANGUAGE;
}
