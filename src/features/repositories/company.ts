import {
  readCompanyWorkspaceState,
  writeCompanyLogo,
  writeCompanyNotes,
  writeCompanyProfile,
  writeCompanyTemplate,
  writeCompanyWorkspaceState,
  type CompanyProfile,
  type CompanyWorkspaceState,
  type InvoiceTemplate,
} from "@/features/storage/company";

export type CompanyRepository = {
  readWorkspace(): CompanyWorkspaceState;
  saveWorkspace(value: CompanyWorkspaceState): void;
  saveProfile(value: CompanyProfile): void;
  saveTemplate(value: InvoiceTemplate): void;
  saveLogo(value: string): void;
  saveNotes(value: string): void;
};

export const localCompanyRepository: CompanyRepository = {
  readWorkspace: readCompanyWorkspaceState,
  saveWorkspace: writeCompanyWorkspaceState,
  saveProfile: writeCompanyProfile,
  saveTemplate: writeCompanyTemplate,
  saveLogo: writeCompanyLogo,
  saveNotes: writeCompanyNotes,
};
