import Vue from "vue";
import VueRouter from "vue-router";
import { App, Login } from "@/pages";

Vue.use(VueRouter);

const routes = [
  {
    path: "/signin",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "App",
    component: App,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
