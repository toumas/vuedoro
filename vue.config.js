const fs = require("fs");

let config = {};

if (process.env.NODE_ENV === "development") {
  config = {
    devServer: {
      https: {
        key: fs.readFileSync("./certs/localhost-key.pem"),
        cert: fs.readFileSync("./certs/localhost.pem")
      }
    }
  };
}

module.exports = config;
