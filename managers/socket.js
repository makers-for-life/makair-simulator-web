const socket_io = require("socket.io");

class Socket {
  constructor(server, simulator) {
    this.io = socket_io({
	  path: "/socket",
	  serveClient: false
	});

	this.io.attach(server);

	this.simulator = simulator;

	this.loop();
  }

  loop() {
  	this.io.on("connection", (socket) => {
	  socket.emit("get_params", { 
	  	resistance: this.simulator.resistance,
	  	compliance: this.simulator.compliance
	  });

	  socket.on("send_params", (params) => { 
	  	this.simulator.resistance = params.resistance;
	  	this.simulator.compliance = params.compliance;

	  	this.simulator.reboot();
	  });

	});

  }
}

module.exports = Socket;
