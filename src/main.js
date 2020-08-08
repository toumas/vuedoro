import "regenerator-runtime";
import Vue from "vue";
import "./main.css";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.filter("time", function(value, hours = false) {
  return new Date(value).toISOString().slice(hours ? 11 : 14, 19);
});

new Vue({
  render: (h) => h(App)
}).$mount("#app");
