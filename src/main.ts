import { createApp } from "vue";
import App from "./App.vue";
import { i18n } from "./i18n/i18n";
import "./styles/main.css";

import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
  registerType: 'autoUpdate',
  onNeedRefresh() {},
  onOfflineReady() {}
});

const app = createApp(App);

app.use(i18n).mount("#app");
