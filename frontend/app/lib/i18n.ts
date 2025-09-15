import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import de from "../locales/de.json";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: "de",
    supportedLngs: ["de", "fr", "en"],

    resources: {
      en: {
        translation: en,
      },
      de: {
        translation: de,
      },
      fr: {
        translation: fr,
      },
    },

    detection: {
      order: ["cookie", "navigator"],
      caches: ["cookie"],
      lookupCookie: "lang",
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
