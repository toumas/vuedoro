/* eslint-disable no-undef */
self.importScripts("worker-action-types.js");

let interval;

onmessage = function(e) {
  // console.log(e.data.type);
  switch (e.data.type) {
    case workerActionTypes.start:
      if (typeof interval === "undefined") {
        interval = setInterval(() => {
          postMessage({ type: "tick" });
        }, 1000);
      }
      break;
    case workerActionTypes.stop:
      clearInterval(interval);
      interval = undefined;
      break;
    default:
      throw Error("unknown worker action type");
  }
};
