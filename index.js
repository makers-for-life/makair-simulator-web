var SocketManager  = require("./managers/socket");
var ExpressManager = require("./managers/express");
var SimulatorManager = require("./managers/simulator");

var __simulator_instance;

return Promise.resolve()
  .then(() => {
    return new SimulatorManager();
  })
  .then((simulator) => {
    __simulator_instance = simulator;

    return new ExpressManager();
  })
  .then((server) => {
    new SocketManager(server, __simulator_instance);
  });
