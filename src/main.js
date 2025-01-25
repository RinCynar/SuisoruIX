import { createApp } from "vue";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import SvgIcon from "@/components/SvgIcon.vue";

import App from "@/App.vue";

import "@/style/global.scss";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.component("SvgIcon", SvgIcon);
app.mount("#app");
