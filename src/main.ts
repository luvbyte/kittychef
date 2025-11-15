import { createApp } from "vue";
// import { createPinia } from "pinia";
import App from "./App.vue";
import "./styles/main.css";

const app = createApp(App);

// not required for now
// app.use(createPinia())

app.mount("#app");
