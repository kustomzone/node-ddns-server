/**
 * @module dyndns
 */

var dnsserver = require('./dnsserver'),
    httpserver = require('./httpserver'),
    domainstore = require('./domainstore'),
    store, httpd, dnsd;

/**
 * Start Dynamic DNS Server.
 */
function start(option, clbk) {
  var httpopt,
      dnsopt;
  
  if (!option) {
    option = {};
  }
  
  httpopt = {
      host : option.http_host,
      port : option.http_port
  };
  
  dnsopt = {
      port : option.dns_port
  };
  
  store = new domainstore.DomainStore();
  
  httpd = new httpserver.DynHttpServer(store, httpopt);
  dnsd = new dnsserver.DynDnsServer(store, dnsopt);

  httpd.start(function(err) {
    if (err) {
      clbk(err);
      return;
    }
    
    dnsd.start(function(err) {
      if (err) {
        clbk(err);
        return;
      }

      if (clbk) {
        clbk();
      }
    });
  });
  
}
exports.start = start;


/**
 * Stop Dynamic DNS Server.
 */
function stop(option, clbk) {

  httpd.stop(function(err) {
    dnsd.stop(function(err) {
      if (clbk) {
        clbk();
      }
    });
  });

}
exports.stop = stop;

