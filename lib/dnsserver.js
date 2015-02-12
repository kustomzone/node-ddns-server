/**
 * @module dnsserver
 */

var PromiseA = require('bluebird').Promise
  , dns = require('native-dns')
  ;

/**
 * Dynamic DNS Server.
 * @constructor
 */
function DynDnsServer(store, option) {
  var self = this;

  if (!option) {
    option = {};
  }

  if (!option.port || option.port < 0) {
    option.port = 53;
  }

  if (!option.host) {
    option.host = '0.0.0.0';
  }

  this.store = store;
  this.option = option;

  this.tcpserver = dns.createTCPServer();
  this.server = dns.createServer();

  this.server.on('request', function (req, res) {
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

DynDnsServer.prototype.start = function(cb) {
  var self = this;

  return new PromiseA(function (resolve, reject) {
    var count = 0;

    function onListening(err) {
      console.log('dns listening', self.option.port, self.option.host);
      count += 1;
      if (count > 1) {
        if (cb) { cb(err); }
        if (err) { reject(err); } else { resolve(); }
      }
    }

    self.server.on('listening', onListening);
    self.tcpserver.on('listening', onListening);

    self.server.serve(self.option.port, self.option.host);
    self.tcpserver.serve(self.option.port, self.option.host);
  });
};

DynDnsServer.prototype.stop = function(clbk) {
  var self = this
    , count = 0
    ;

  function onClose() {
    count += 1;
    if (count > 1) {
      clbk();
    }
  }

  self.server.on('close', onClose);
  self.tcpserver.on('close', onClose);
  
  self.server.close();
  self.tcpserver.close();
};

DynDnsServer.prototype.onMessage = function (request, response) {
  var self = this;
  
  self.store.getAnswerList(request && request.question.map(function (q) {
    return {
      name: q.name
    , type: dns.consts.QTYPE_TO_NAME[q.type]
    , class: dns.consts.QCLASS_TO_NAME[q.class]
    };
  })).then(function (answer) {
    response.answer = answer.map(function (a) {
      return dns[a.type]({
        name: a.name
      , address: a.values[0]
      , data: a.values
      , exchange: a.values[0]
      , priority: a.priority
      , ttl: a.ttl || 60
      });
    });

    response.send();
  });
};

DynDnsServer.prototype.onError = function (err, buff, req, res) {
  console.error(err.stack);
};

DynDnsServer.prototype.onSocketError = function (err, socket) {
  console.error(err);
};
