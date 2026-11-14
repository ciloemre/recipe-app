import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tr from "./locales/tr.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

export const LOCALE_KEY = "app_locale";
export const SUPPORTED_LOCALES = ["tr", "en", "ar"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getStoredLocale(): AppLocale {
  const stored = localStorage.getItem(LOCALE_KEY);
  return isAppLocale(stored) ? stored : "tr";
}

export function applyDocumentDirection(locale: AppLocale) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
  return dir;
}

const initialLocale = getStoredLocale();
applyDocumentDirection(initialLocale);

void i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLocale,
  fallbackLng: "tr",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  if (isAppLocale(lng)) {
    localStorage.setItem(LOCALE_KEY, lng);
    applyDocumentDirection(lng);
  }
});

export default i18n;
