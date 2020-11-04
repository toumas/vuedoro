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
  render: (h) => h(App)
}).$mount("#root");

// if (window.Worker) {
//   const myWorker = new Worker("web-worker.js");
//   // const foo = navigator.serviceWorker;
//   myWorker.postMessage({
//     text: "hi to web worker from main.js"
//   });
// }

/* if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").then(
      function(registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function(err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
} */
