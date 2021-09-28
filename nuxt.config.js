import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin";
import pkg from "./package";
import ar from "./locales/ar";
import en from "./locales/en";

export default {
  mode: "universal",

  /*
   ** Headers of the page
   */
  head: {
    title: "جهاز الاستطلاع",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: [
    "~/assets/style/index.scss",
    "~/node_modules/material-icons/iconfont/material-icons.css",
    "~/node_modules/@mdi/font/css/materialdesignicons.css"
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/vuetify", { src: "~/plugins/chartist", mode: "client" }],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://npmjs.com/package/cookie-universal-nuxt
    "cookie-universal-nuxt",
    "nuxt-vuex-localstorage",
    [
      "nuxt-i18n",
      {
        locales: ["ar"],
        defaultLocale: "ar",
        vueI18n: {
          fallbackLocale: "ar",
          messages: { ar }
        }
      }
    ],
    "dropzone-nuxt"
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: ["vuetify/lib"],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {},
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  publicRuntimeConfig: {
    Minio_URL: process.env.Minio_URL || "62.117.55.187"
  }
};
