var CONFIG     = require("../config");
var SimulatorManager = require("./simulator");

class Pool {
  constructor() {
    this.size = CONFIG.POOL.SIZE;

    this.pool = [];

    this.init();
    this.healthcheck();

    this.__healthcheck_interval = 10000 // 10s;
    this.__dead_interval        = 60000 // 60s;
  }

  init() {
    for (let _i = 0; _i < this.size; _i++) {
      this.pool.push({
        instance: new SimulatorManager(_i),
        available: true,
        last_availability: null
      });
    }
  };

  getInstance(index) {
    if (this.pool[index]) {
      return this.pool[index].instance;
    }

    return null;
  }

  getAvailableIndex() {
    for (let _i = 0; _i < this.size; _i++) {
      if (this.pool[_i].available === true) {
        this.pool[_i].available = false;
        return _i;
      }
    }

    return -1;
  };

  heartbeat(index) {
    if (this.pool[index]) {
      this.pool[index].available = false;
      this.pool[index].last_availability = Date.now();
    }
  }

  free(index) {
    if (this.pool[index]) {
      this.pool[index].available = true;
      this.pool[index].last_availability = null;
    }
  }

  healthcheck() {
    setInterval(() => {
      for (let _i = 0; _i < this.size; _i++) {
        if (this.pool[_i].last_availability &&
          (Date.now - this.pool[_i].last_availability > this.__dead_interval)) {
          this.free(index);
        }
      }
    }, 10000);
  }
}

module.exports = Pool;
