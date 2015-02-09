/**
 * @module httpserver
 */

var http = require('http'),
    path = require('path'),
    express = require('express');

/**
 * Dynamic HTTP Server.
 * @constructor
 */
function DynHttpServer(store, option) {
  if (!option) {
    option = {};
  }

  if (!option.port || option.port < 0) {
    option.port = 80;
  }

  if (!option.host) {
    option.host = '127.0.0.1';
  }

  this.option = option;

  var express_app = this.initExpress(store);
  this.server = http.createServer(express_app);

}
exports.DynHttpServer = DynHttpServer;

DynHttpServer.prototype.start = function(clbk) {
  var self = this;
  if (!clbk) {
    clbk = function() {};
  }
  
  self.server.listen(self.option.port, self.option.host, 128, function() {
    clbk();
  });
};

DynHttpServer.prototype.stop = function(clbk) {
  var self = this;
  if (!clbk) {
    clbk = function() {};
  }

  self.server.close(function() {
    clbk();
  });
};

DynHttpServer.prototype.initExpress = function(store) {

  var app = express(),
      routes = require('../routes'),
      routes_nic = require('../routes/nic');

  routes.setDomainStore(store);
  routes_nic.setDomainStore(store);

  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

  app.disable('x-powered-by');
  app.use(express.static(path.join(__dirname, '../public')));

  app.get('/', routes.index);
  app.get('/domain', routes.domain);
  app.get('/nic/update', routes_nic.update);

  return app;

}

