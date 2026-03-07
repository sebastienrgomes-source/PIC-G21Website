import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "heatspot_lang";
const DEFAULT_LANGUAGE = "pt";
const AVAILABLE_LANGUAGES = ["pt", "en", "fr", "es"];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LANGUAGE;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return AVAILABLE_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languageOptions: [
        { code: "pt", label: "PT" },
        { code: "en", label: "EN" },
        { code: "fr", label: "FR" },
        { code: "es", label: "ES" },
      ],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
