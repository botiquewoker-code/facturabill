import {
  clearLegacyKeys,
  createJsonLocalStore,
  readLegacyJson,
  readLegacyString,
} from "./local";

export type CompanyProfile = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefono: string;
  email: string;
};

export type InvoiceTemplate = "InvoicePDF" | "PlantillaNueva" | "PlantillaStudio";

export type CompanyWorkspaceState = {
  company: CompanyProfile;
  template: InvoiceTemplate;
  logo: string;
  notes: string;
};

export const COMPANY_WORKSPACE_STORAGE_KEY = "facturabill-company-workspace";
export const COMPANY_PROFILE_STORAGE_KEY = "datosEmpresa";
export const COMPANY_CONFIG_STORAGE_KEY = "configEmpresa";
export const COMPANY_LOGO_STORAGE_KEY = "logoUsuario";
export const COMPANY_NOTES_STORAGE_KEY = "notasUsuario";
export const COMPANY_TEMPLATE_STORAGE_KEYS = [
  "plantillaSeleccionada",
  "plantillaUsuario",
  "plantillaElegida",
] as const;

export const EMPTY_COMPANY_PROFILE: CompanyProfile = {
  nombre: "",
  nif: "",
  direccion: "",
  ciudad: "",
  cp: "",
  telefono: "",
  email: "",
};

export const DEFAULT_INVOICE_TEMPLATE: InvoiceTemplate = "InvoicePDF";

export const EMPTY_COMPANY_WORKSPACE_STATE: CompanyWorkspaceState = {
  company: EMPTY_COMPANY_PROFILE,
  template: DEFAULT_INVOICE_TEMPLATE,
  logo: "",
  notes: "",
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeCompanyProfile(value: unknown): CompanyProfile {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    nombre: normalizeString(record.nombre),
    nif: normalizeString(record.nif),
    direccion: normalizeString(record.direccion),
    ciudad: normalizeString(record.ciudad),
    cp: normalizeString(record.cp ?? record.codigoPostal),
    telefono: normalizeString(record.telefono),
    email: normalizeString(record.email),
  };
}

export function isInvoiceTemplate(value: string): value is InvoiceTemplate {
  return (
    value === "InvoicePDF" ||
    value === "PlantillaNueva" ||
    value === "PlantillaStudio"
  );
}

function normalizeCompanyWorkspaceState(
  value: unknown,
): CompanyWorkspaceState {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const template = normalizeString(record.template);

  return {
    company: normalizeCompanyProfile(record.company),
    template: isInvoiceTemplate(template)
      ? template
      : DEFAULT_INVOICE_TEMPLATE,
    logo: normalizeString(record.logo),
    notes: normalizeString(record.notes),
  };
}

function migrateCompanyWorkspaceState(): CompanyWorkspaceState {
  const configRecord = readLegacyJson<Record<string, unknown> | null>(
    [COMPANY_CONFIG_STORAGE_KEY],
    null,
  );
  const configCompany =
    configRecord && typeof configRecord.empresa === "object"
      ? configRecord.empresa
      : null;
  const configTemplate =
    configRecord && typeof configRecord.plantilla === "string"
      ? configRecord.plantilla
      : "";
  const configNotes =
    configRecord && typeof configRecord.notas === "string"
      ? configRecord.notas
      : "";

  const legacyTemplate = readLegacyString(COMPANY_TEMPLATE_STORAGE_KEYS, "");
  const nextTemplate = isInvoiceTemplate(legacyTemplate)
    ? legacyTemplate
    : isInvoiceTemplate(configTemplate)
      ? configTemplate
      : DEFAULT_INVOICE_TEMPLATE;

  return {
    company: normalizeCompanyProfile(
      configCompany ?? readLegacyJson([COMPANY_PROFILE_STORAGE_KEY], EMPTY_COMPANY_PROFILE),
    ),
    template: nextTemplate,
    logo: readLegacyString([COMPANY_LOGO_STORAGE_KEY], ""),
    notes:
      readLegacyString([COMPANY_NOTES_STORAGE_KEY], "") ||
      normalizeString(configNotes),
  };
}

const companyWorkspaceStore = createJsonLocalStore<CompanyWorkspaceState>(
  COMPANY_WORKSPACE_STORAGE_KEY,
  {
    fallback: EMPTY_COMPANY_WORKSPACE_STATE,
    migrate(value) {
      const normalized = normalizeCompanyWorkspaceState(value);

      if (
        JSON.stringify(normalized) ===
        JSON.stringify(EMPTY_COMPANY_WORKSPACE_STATE)
      ) {
        return migrateCompanyWorkspaceState();
      }

      return normalized;
    },
  },
);

export function readCompanyWorkspaceState() {
  const current = companyWorkspaceStore.read();

  if (
    JSON.stringify(current) === JSON.stringify(EMPTY_COMPANY_WORKSPACE_STATE)
  ) {
    const migrated = migrateCompanyWorkspaceState();

    if (
      JSON.stringify(migrated) !== JSON.stringify(EMPTY_COMPANY_WORKSPACE_STATE)
    ) {
      companyWorkspaceStore.write(migrated);
      clearLegacyKeys([
        COMPANY_CONFIG_STORAGE_KEY,
        COMPANY_PROFILE_STORAGE_KEY,
        COMPANY_LOGO_STORAGE_KEY,
        COMPANY_NOTES_STORAGE_KEY,
        ...COMPANY_TEMPLATE_STORAGE_KEYS,
      ]);
      return migrated;
    }
  }

  return current;
}

export function writeCompanyWorkspaceState(value: CompanyWorkspaceState) {
  companyWorkspaceStore.write(normalizeCompanyWorkspaceState(value));
}

export function writeCompanyProfile(company: CompanyProfile) {
  const current = readCompanyWorkspaceState();
  writeCompanyWorkspaceState({ ...current, company: normalizeCompanyProfile(company) });
}

export function writeCompanyTemplate(template: InvoiceTemplate) {
  if (!isInvoiceTemplate(template)) {
    return;
  }

  const current = readCompanyWorkspaceState();
  writeCompanyWorkspaceState({ ...current, template });
}

export function writeCompanyLogo(logo: string) {
  const current = readCompanyWorkspaceState();
  writeCompanyWorkspaceState({ ...current, logo: normalizeString(logo) });
}

export function writeCompanyNotes(notes: string) {
  const current = readCompanyWorkspaceState();
  writeCompanyWorkspaceState({ ...current, notes: normalizeString(notes) });
}
