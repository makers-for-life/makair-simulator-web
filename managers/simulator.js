var CONFIG     = require("../config");
var spawn      = require("child_process").spawn;
var fs         = require("fs");

class Simulator {
  constructor(index) {
    this.child_simulator = null;

    this.resistance = CONFIG.SIMULATOR.RESISTANCE;
    this.compliance = CONFIG.SIMULATOR.COMPLIANCE;
    this.spontaneousBreathRate = CONFIG.SIMULATOR.SPONTANEOUS_BREATH_RATE;
    this.spontaneousBreathEffort = CONFIG.SIMULATOR.SPONTANEOUS_BREATH_EFFORT;
    this.spontaneousBreathDuration = CONFIG.SIMULATOR.SPONTANEOUS_BREATH_DURATION;
    this.started    = false;
    this.index      = index;

    this.reboot();

    process.on("exit", () => {
      this.kill();
    });

    return this;
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
        "--spontaneousBreathRate", this.spontaneousBreathRate,
        "--spontaneousBreathEffort", this.spontaneousBreathEffort,
        "--spontaneousBreathDuration", this.spontaneousBreathDuration,
        "-p", `${CONFIG.SIMULATOR.SERIAL}/tty${this.index + 1}_0`
      ]);

      this.appendLogs("stdout", `=========${Date.now()}========`);
      this.appendLogs("stderr", `=========${Date.now()}========`);

      this.child_simulator.stdout.on("data", (data) => {
        this.appendLogs("stdout", data);
      });

      this.child_simulator.stderr.on("data", (data) => {
        this.appendLogs("stderr", data);
      });

      this.child_simulator.on("close", (data) => {
        this.appendLogs("stderr", data);
      });

      this.started = true;

      return resolve();
    });
  }

  getVNCUrl(index) {
    return CONFIG.VNC.URL.replace("[PORT]", 5901 + this.index);
  }

  appendLogs(type, data) {
    if (CONFIG.SIMULATOR.DEBUG === true) {
      fs.appendFile(`${CONFIG.SIMULATOR.LOGS}/${this.index + 1}_${type}.txt`, data, function() {});
    }
  }
}

module.exports = Simulator;
