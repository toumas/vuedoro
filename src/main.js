import "regenerator-runtime";
import Vue from "vue";
import "./main.css";
import App from "./App.vue";

Vue.config.productionTip = false;

export function time(value, hours = false) {
  return new Date(value).toISOString().slice(hours ? 11 : 14, 19);
}

Vue.filter("time", time);

new Vue({
  render: (h) =>
    h(App, {
      props: {
        // worker
      }
    })
}).$mount("#root");
