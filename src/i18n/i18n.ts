import { createI18n } from "vue-i18n";
import { watch } from "vue";

import en from "./langs/en.json";
import hi from "./langs/hi.json";
import te from "./langs/te.json";
import ru from "./langs/ru.json";
import hy from "./langs/hy.json";
import es from "./langs/es.json";
import fr from "./langs/fr.json";
import de from "./langs/de.json";
import zh from "./langs/zh.json";

const saved = localStorage.getItem("lang") || "en";

export const i18n = createI18n({
  legacy: false,
  locale: saved,
  fallbackLocale: "en",
  messages: {
    en,
    hi,
    te,
    ru,
    hy,
    es,
    fr,
    de,
    zh
  }
});

// Save new language automatically
watch(
  () => i18n.global.locale.value,
  newVal => {
    localStorage.setItem("lang", newVal);
  }
);