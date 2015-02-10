/**
 * @module dyndns
 */

var dnsserver = require('./dnsserver')
  , httpserver = require('./httpserver')
  , httpd
  , dnsd
  ;

/**
 * Start Dynamic DNS Server.
 */
function start(option, clbk) {
  var httpopt
    , dnsopt
    , store = option.store
    ;
  
  if (!option) {
    option = {};
  }
  
  httpopt = {
    host : option.http_host,
    port : option.http_port
  };
  
  dnsopt = {
    host : option.dns_host,
    port : option.dns_port
  };
  
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

      if (clbk) { clbk(); }
    });
  });
  
}
exports.start = start;


/**
 * Stop Dynamic DNS Server.
 */
function stop(option, clbk) {

  httpd.stop(function(err) {
    dnsd.stop(function(err2) {
      if (clbk) { clbk(err || err2); }
    });
  });

}
exports.stop = stop;

