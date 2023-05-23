import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/bitcoin-glyphs",
      name: "BitcoinGlyphs",
      component: () => import("../pages/BitcoinGlyphs.vue"),
    },
  ],
});

export default router;
