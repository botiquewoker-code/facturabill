import { createJsonLocalStore } from "@/features/storage/local";

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

const fiscalSettingsStore = createJsonLocalStore<FiscalSettings>(
  FISCAL_SETTINGS_STORAGE_KEY,
  {
    fallback: DEFAULT_FISCAL_SETTINGS,
    migrate(value) {
      return normalizeFiscalSettings(
        value && typeof value === "object"
          ? (value as Partial<FiscalSettings>)
          : null,
      );
    },
  },
);

export function readFiscalSettings(): FiscalSettings {
  return fiscalSettingsStore.read();
}

export function writeFiscalSettings(value: FiscalSettings) {
  fiscalSettingsStore.write(normalizeFiscalSettings(value));
}
