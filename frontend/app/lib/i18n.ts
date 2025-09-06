import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "../locales/de.json";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

i18n.use(initReactI18next).init({
  fallbackLng: "de",
  debug: true,

  interpolation: {
    escapeValue: false,
  },

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
});

export default i18n;
