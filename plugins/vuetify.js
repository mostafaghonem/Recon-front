import Vue from "vue";
// import Vuetify from '../packages/vuetify/lib'
import Vuetify from "../packages/vuetify/lib";
import theme from "~/plugins/theme";
import "../packages/vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify, {
  iconfont: "mdi",
  theme
});
