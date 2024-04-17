// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/supabase",'@pinia/nuxt'],
  devtools: { enabled: true },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: ['/admin(/*)?'],
    },
  },
});
