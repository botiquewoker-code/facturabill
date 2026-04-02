import {
  readStoredHomeVisibility,
  writeStoredHomeVisibility,
  type HomeVisibility,
} from "@/features/home/preferences";
import { readStoredLanguage, writeStoredLanguage } from "@/features/storage/language";
import type { AppLanguage } from "@/features/i18n/config";

export type PreferenceRepository = {
  readHomeVisibility(): HomeVisibility;
  saveHomeVisibility(value: HomeVisibility): void;
  readLanguage(): AppLanguage;
  saveLanguage(language: AppLanguage): void;
};

export const localPreferenceRepository: PreferenceRepository = {
  readHomeVisibility: readStoredHomeVisibility,
  saveHomeVisibility: writeStoredHomeVisibility,
  readLanguage: readStoredLanguage,
  saveLanguage: writeStoredLanguage,
};
