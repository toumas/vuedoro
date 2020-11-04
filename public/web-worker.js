onmessage = function(e) {
  console.log("Message received from main script");
  console.log(self.navigator);
  console.log(e);
  postMessage("workerResult");
};
