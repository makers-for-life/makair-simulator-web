var SocketManager  = require("./managers/socket");
var ExpressManager = require("./managers/express");
var PoolManager  = require("./managers/pool");

var __pool;

return Promise.resolve()
  .then(() => {
    return new PoolManager();
  })
  .then((pool) => {
    __pool = pool;

    return new ExpressManager();
  })
  .then((server) => {
    new SocketManager(server, __pool);
  });
