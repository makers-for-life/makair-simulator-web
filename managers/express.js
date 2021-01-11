var CONFIG     = require("../config");
var express    = require("express");

class Express {
  constructor() {
    return this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      this.app = express();

      this.app.use(express.static("public"));

      let server = require("http").createServer(this.app);

      server.listen(CONFIG.PORT, () => {
        console.log(`Listening on ${CONFIG.PORT}`);

        return resolve(server);
      });
    })
  }
}

module.exports = Express;
