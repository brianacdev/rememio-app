// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
  ui: {
    colorMode: false,
  },
  css: ["~/assets/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2025-09-25",
});