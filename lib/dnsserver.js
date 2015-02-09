/**
 * @module dnsserver
 */

var dns = require('native-dns');

/**
 * Dynamic DNS Server.
 * @constructor
 */
function DynDnsServer(store, option) {
  var self = this;

  this.server;
  if (!option) {
    option = {};
  }

  if (!option.port || option.port < 0) {
    option.port = 53;
  }

  if (!option.host) {
    option.host = '127.0.0.1';
  }

  this.store = store;
  this.option = option;

  this.tcpserver = dns.createTCPServer(), this.server = dns.createServer();

  this.server.on('request', function(req, res) {
    self.onMessage(req, res);
  });
  this.server.on('error', this.onError);
  this.server.on('socketError', this.onSocketError);

  this.tcpserver.on('request', function(req, res) {
    self.onMessage(req, res);
  });
  this.tcpserver.on('error', this.onError);
  this.tcpserver.on('socketError', this.onSocketError);

}
exports.DynDnsServer = DynDnsServer;

DynDnsServer.prototype.start = function(clbk) {
  var self = this;

  var count = 0;
  function onListening(err) {
    
    count++;
    if (count > 1) {
      clbk();
    }
  }

  this.server.on('listening', onListening);
  this.tcpserver.on('listening', onListening);

  this.server.serve(self.option.port, self.option.host);
  this.tcpserver.serve(self.option.port, self.option.host);
};

DynDnsServer.prototype.stop = function(clbk) {
  var self = this;

  var count = 0;
  function onClose() {
    console.log('server closed');
    
    count++;
    if (count > 1) {
      clbk();
    }
  }

  this.server.on('close', onClose);
  this.tcpserver.on('close', onClose);
  
  this.server.close();
  this.tcpserver.close();
};

DynDnsServer.prototype.onMessage = function (request, response) {
  var self = this;

  console.log('request from:', request.address);
  var i;
  
  self.store.getAnswerList(request, function(error, answer) {
    response.answer = answer;
    response.send();
  });

  response.send();
};

DynDnsServer.prototype.onError = function (err, buff, req, res) {
  console.log(err.stack);
};

DynDnsServer.prototype.onSocketError = function (err, socket) {
  console.log(err);
};
