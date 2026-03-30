export const FISCAL_SETTINGS_STORAGE_KEY = "facturabill-fiscal-settings";

export type FiscalSettings = {
  taxLabel: string;
  defaultTaxRate: number;
  fiscalNote: string;
};

export const DEFAULT_FISCAL_SETTINGS: FiscalSettings = {
  taxLabel: "IVA",
  defaultTaxRate: 21,
  fiscalNote: "",
};

export const FISCAL_RATE_OPTIONS = [0, 4, 5, 7, 10, 21] as const;

export function normalizeFiscalSettings(
  value?: Partial<FiscalSettings> | null,
): FiscalSettings {
  const parsedRate = Number(value?.defaultTaxRate);

  return {
    taxLabel: (value?.taxLabel || DEFAULT_FISCAL_SETTINGS.taxLabel).trim(),
    defaultTaxRate: Number.isFinite(parsedRate)
      ? parsedRate
      : DEFAULT_FISCAL_SETTINGS.defaultTaxRate,
    fiscalNote: (value?.fiscalNote || "").trim(),
  };
}

export function readFiscalSettings(): FiscalSettings {
  if (typeof window === "undefined") {
    return DEFAULT_FISCAL_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(FISCAL_SETTINGS_STORAGE_KEY);

    if (!raw) {
      return DEFAULT_FISCAL_SETTINGS;
    }

    return normalizeFiscalSettings(JSON.parse(raw) as Partial<FiscalSettings>);
  } catch {
    return DEFAULT_FISCAL_SETTINGS;
  }
}
