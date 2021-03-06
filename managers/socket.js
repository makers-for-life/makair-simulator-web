const socket_io = require("socket.io");

class Socket {
  constructor(server, pool) {
    this.io = socket_io({
      path: "/socket",
      serveClient: false
    });

    this.io.attach(server);

    this.pool = pool;

    this.loop();
  }

  loop() {
    this.io.on("connection", (socket) => {
      let _index = this.pool.getAvailableIndex();

      let _simulator = this.pool.getInstance(_index);

      // No simulator available
      if (_index === -1) {
        return
      }

      socket.emit("get_params", { 
        resistance: _simulator.resistance,
        compliance: _simulator.compliance
      });

      socket.emit("instance", { 
        vnc_url: _simulator.getVNCUrl(),
      });

      socket.on("send_params", (params) => { 
        _simulator.resistance = params.resistance;
        _simulator.compliance = params.compliance;

        _simulator.reboot();
      });

      socket.on("heartbeat", () => { 
         this.pool.heartbeat(_index);
      });

      socket.on("disconnect", () => {
        this.pool.free(_index);
      });

    });

  }
}

module.exports = Socket;
