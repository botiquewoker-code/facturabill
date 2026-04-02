import type { CompanyRepository } from "./company";
import type { HistoryRepository } from "./history";
import type { UserRepository } from "./user";
import type { ClientRepository } from "./clients";
import type { CatalogRepository } from "./catalog";
import type { DocumentRepository } from "./documents";
import type { DraftRepository } from "./drafts";
import type { PaymentRepository } from "./payments";
import type { PreferenceRepository } from "./preferences";
import type { VerifactuRepository } from "./verifactu";

function notImplemented(name: string): never {
  throw new Error(`${name} is not implemented yet. Switch to local target or add AWS wiring.`);
}

export const awsCompanyRepository: CompanyRepository = {
  readWorkspace: () => notImplemented("awsCompanyRepository.readWorkspace"),
  saveWorkspace: () => notImplemented("awsCompanyRepository.saveWorkspace"),
  saveProfile: () => notImplemented("awsCompanyRepository.saveProfile"),
  saveTemplate: () => notImplemented("awsCompanyRepository.saveTemplate"),
  saveLogo: () => notImplemented("awsCompanyRepository.saveLogo"),
  saveNotes: () => notImplemented("awsCompanyRepository.saveNotes"),
};

export const awsHistoryRepository: HistoryRepository = {
  readDocuments: () => notImplemented("awsHistoryRepository.readDocuments"),
  saveDocuments: () => notImplemented("awsHistoryRepository.saveDocuments"),
  readConversionDraft: () => notImplemented("awsHistoryRepository.readConversionDraft"),
  saveConversionDraft: () => notImplemented("awsHistoryRepository.saveConversionDraft"),
  clearConversionDraft: () => notImplemented("awsHistoryRepository.clearConversionDraft"),
  readLastNumber: () => notImplemented("awsHistoryRepository.readLastNumber"),
  saveLastNumber: () => notImplemented("awsHistoryRepository.saveLastNumber"),
};

export const awsUserRepository: UserRepository = {
  readProfile: () => notImplemented("awsUserRepository.readProfile"),
  saveProfile: () => notImplemented("awsUserRepository.saveProfile"),
  readCredentials: () => notImplemented("awsUserRepository.readCredentials"),
  saveCredentials: () => notImplemented("awsUserRepository.saveCredentials"),
  hashPassword: () => notImplemented("awsUserRepository.hashPassword"),
};

export const awsClientRepository: ClientRepository = {
  readAll: () => notImplemented("awsClientRepository.readAll"),
  saveAll: () => notImplemented("awsClientRepository.saveAll"),
};

export const awsCatalogRepository: CatalogRepository = {
  readAll: () => notImplemented("awsCatalogRepository.readAll"),
  saveAll: () => notImplemented("awsCatalogRepository.saveAll"),
};

export const awsDocumentRepository: DocumentRepository = {
  readAll: () => notImplemented("awsDocumentRepository.readAll"),
  readById: () => notImplemented("awsDocumentRepository.readById"),
  saveAll: () => notImplemented("awsDocumentRepository.saveAll"),
  upsert: () => notImplemented("awsDocumentRepository.upsert"),
};

export const awsDraftRepository: DraftRepository = {
  readAll: () => notImplemented("awsDraftRepository.readAll"),
  saveAll: () => notImplemented("awsDraftRepository.saveAll"),
  upsert: () => notImplemented("awsDraftRepository.upsert"),
  readActive: () => notImplemented("awsDraftRepository.readActive"),
  saveActive: () => notImplemented("awsDraftRepository.saveActive"),
  clearActive: () => notImplemented("awsDraftRepository.clearActive"),
};

export const awsPaymentRepository: PaymentRepository = {
  readSettings: () => notImplemented("awsPaymentRepository.readSettings"),
  saveSettings: () => notImplemented("awsPaymentRepository.saveSettings"),
};

export const awsPreferenceRepository: PreferenceRepository = {
  readHomeVisibility: () => notImplemented("awsPreferenceRepository.readHomeVisibility"),
  saveHomeVisibility: () => notImplemented("awsPreferenceRepository.saveHomeVisibility"),
  readLanguage: () => notImplemented("awsPreferenceRepository.readLanguage"),
  saveLanguage: () => notImplemented("awsPreferenceRepository.saveLanguage"),
};

export const awsVerifactuRepository: VerifactuRepository = {
  readSettings: () => notImplemented("awsVerifactuRepository.readSettings"),
  saveSettings: () => notImplemented("awsVerifactuRepository.saveSettings"),
  readRecords: () => notImplemented("awsVerifactuRepository.readRecords"),
  upsertRecord: () => notImplemented("awsVerifactuRepository.upsertRecord"),
  readEvents: () => notImplemented("awsVerifactuRepository.readEvents"),
  appendEvent: () => notImplemented("awsVerifactuRepository.appendEvent"),
  createLocalId: () => notImplemented("awsVerifactuRepository.createLocalId"),
  ensureInstallationId: () => notImplemented("awsVerifactuRepository.ensureInstallationId"),
  findLatestChainedRecord: () => notImplemented("awsVerifactuRepository.findLatestChainedRecord"),
};
