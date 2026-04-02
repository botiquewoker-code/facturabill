import {
  awsCatalogRepository,
  awsClientRepository,
  awsCompanyRepository,
  awsDraftRepository,
  awsDocumentRepository,
  awsHistoryRepository,
  awsPaymentRepository,
  awsPreferenceRepository,
  awsUserRepository,
  awsVerifactuRepository,
} from "./aws";
import { localCatalogRepository } from "./catalog";
import { localClientRepository } from "./clients";
import { localCompanyRepository } from "./company";
import { localDraftRepository } from "./drafts";
import { localDocumentRepository } from "./documents";
import { localHistoryRepository } from "./history";
import { localPaymentRepository } from "./payments";
import { localPreferenceRepository } from "./preferences";
import { ACTIVE_REPOSITORY_TARGET } from "./targets";
import { localUserRepository } from "./user";
import { localVerifactuRepository } from "./verifactu";

const useAwsRepositories = ACTIVE_REPOSITORY_TARGET === "aws";

export const activeCompanyRepository = useAwsRepositories
  ? awsCompanyRepository
  : localCompanyRepository;

export const activeHistoryRepository = useAwsRepositories
  ? awsHistoryRepository
  : localHistoryRepository;

export const activeUserRepository = useAwsRepositories
  ? awsUserRepository
  : localUserRepository;

export const activeClientRepository = useAwsRepositories
  ? awsClientRepository
  : localClientRepository;

export const activeCatalogRepository = useAwsRepositories
  ? awsCatalogRepository
  : localCatalogRepository;

export const activeDocumentRepository = useAwsRepositories
  ? awsDocumentRepository
  : localDocumentRepository;

export const activeDraftRepository = useAwsRepositories
  ? awsDraftRepository
  : localDraftRepository;

export const activePaymentRepository = useAwsRepositories
  ? awsPaymentRepository
  : localPaymentRepository;

export const activePreferenceRepository = useAwsRepositories
  ? awsPreferenceRepository
  : localPreferenceRepository;

export const activeVerifactuRepository = useAwsRepositories
  ? awsVerifactuRepository
  : localVerifactuRepository;
