import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import socketPlugin from "./plugins/socketplugin";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(socketPlugin, {
  connection: "http://localhost:3000",
  options: {},
});

app.mount("#app");
