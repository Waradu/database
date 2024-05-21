// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/supabase",'@pinia/nuxt'],
  devtools: { enabled: false },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: ['/admin(/*)?'],
    },
  },
  css: ["prismjs/themes/prism-twilight.css"],
});
