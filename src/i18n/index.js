import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./ar.json";
import en from "./en.json";

const savedLang = localStorage.getItem("lang") || "ar";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: savedLang,
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false,
    },
  });

// 👇 لما اللغة تتغير
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

// 👇 أول ما التطبيق يفتح
document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";

export default i18n;