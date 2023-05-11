import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/bitcoin-hash",
      name: "BitcoinHash",
      component: () => import("../pages/BitcoinHash.vue"),
    },
  ],
});

export default router;
