const socket_io = require("socket.io");

class Socket {
  constructor(server) {
    this.io = socket_io({
	  path: "/socket",
	  serveClient: false,
	});

	io.attach(server, {
	  pingInterval: 10000,
	  pingTimeout: 5000,
	  cookie: false
	});
  }
}

module.exports = Socket;
