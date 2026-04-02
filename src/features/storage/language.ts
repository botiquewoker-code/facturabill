import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_KEY,
  LANGUAGE_STORAGE_KEY,
  resolveAppLanguage,
  type AppLanguage,
} from "@/features/i18n/config";
import { createStringLocalStore } from "./local";

const languageStore = createStringLocalStore(
  LANGUAGE_STORAGE_KEY,
  DEFAULT_LANGUAGE,
);

export function readStoredLanguage() {
  return resolveAppLanguage(languageStore.read());
}

export function writeStoredLanguage(language: AppLanguage) {
  languageStore.write(language);
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${language}; path=/; max-age=31536000; samesite=lax`;
}
