"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANGUAGE,
  detectPreferredLanguage,
  getLanguageDirection,
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  type AppLanguage,
} from "@/features/i18n/config";

type AppLanguageContextValue = {
  direction: "ltr" | "rtl";
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
};

const AppLanguageContext = createContext<AppLanguageContextValue | null>(null);

export function AppLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LANGUAGE;
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage && isSupportedLanguage(storedLanguage)) {
      return storedLanguage;
    }

    return detectPreferredLanguage(window.navigator.language);
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getLanguageDirection(language);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      direction: getLanguageDirection(language),
      language,
      setLanguage: setLanguageState,
    }),
    [language],
  );

  return (
    <AppLanguageContext.Provider value={value}>
      {children}
    </AppLanguageContext.Provider>
  );
}

export function useAppLanguage() {
  const context = useContext(AppLanguageContext);

  if (!context) {
    throw new Error("useAppLanguage must be used within AppLanguageProvider");
  }

  return context;
}
