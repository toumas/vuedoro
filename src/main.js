import "regenerator-runtime";
import Vue from "vue";
import "./main.css";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App)
}).$mount("#app");
