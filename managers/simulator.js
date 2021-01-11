var CONFIG     = require("../config");
var spawn      = require("child_process").spawn;

class Simulator {
  constructor() {
    this.child_simulator = null;

    this.resistance = CONFIG.SIMULATOR.RESISTANCE;
    this.compliance = CONFIG.SIMULATOR.COMPLIANCE;
    this.started    = false;

    this.reboot();

    process.on("exit", () => {
      this.kill();
    });

    return Promise.resolve(this);
  }

  reboot() {
    this.kill()
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      })
      .then(() => {
        return this.start();
      });
  }

  kill() {
    return new Promise((resolve) => {
      if (this.child_simulator === null) {
        return resolve();
      }

      this.child_simulator.kill();

      setTimeout(() => {
        this.started = false;

        return resolve();
      }, 1000);
    })
  }

  start() {
    return new Promise((resolve) => {
      if (this.started == true) {
        return resolve();
      } 
      this.child_simulator  = spawn(CONFIG.SIMULATOR.PATH, [
        "-r", this.resistance,
        "-c", this.compliance,
        "-p", CONFIG.SIMULATOR.SERIAL
      ]);

      this.started = true;

      return resolve();
    });
  }
}

module.exports = Simulator;
