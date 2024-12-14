import naive from "naive-ui";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import { createPinia } from "pinia";
import App from "./App.vue";

const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach(async to => {
	if (to.path === "/stg-secret") return await checkAdminUser();
	console.log("to", to.path);
	return true;
});

const pinia = createPinia();
const app = createApp(App);
app.use(naive);
app.use(router);
app.use(pinia);
app.mount("#app");
