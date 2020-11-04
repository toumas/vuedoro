const fs = require("fs");

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync("./certs/localhost-key.pem"),
      cert: fs.readFileSync("./certs/localhost.pem")
    }
  }
};
