var httpserver = require('./lib/httpserver')
  ;

exports.create = function (server, store, host, port, publicDir) {
  var app = httpserver.create(store, { host: host, port: port, publicDir: publicDir })
    ;

  return app;
};
