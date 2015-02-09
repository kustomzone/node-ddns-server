
var dyndns = require('./lib/dyndns'),
    dnsserver = require('./lib/dnsserver'),
    httpserver = require('./lib/httpserver'),
    domainstore = require('./lib/domainstore');

/**
 * Starting Dynamic DNS Server and Update HTTP Server.
 * @param option option parameters
 * @param clbk callback function to notify started the server
 */
exports.start = dyndns.start;

/**
 * Stopping Dynamic DNS Server and Update HTTP Server.
 * @param clbk callback function to notify stopped the server
 */
exports.stop = dyndns.stop;

/**
 * Dynamic DNS Server.
 */
exports.DynDnsServer = dnsserver.DynDnsServer;

/**
 * Update HTTP Server.
 */
exports.DynHttpServer = httpserver.DynHttpServer;

/**
 * Domain Store.
 */
exports.DomainStore = domainstore.DomainStore;

/**
 * Redis Domain Store.
 */
exports.RedisDomainStore = domainstore.RedisDomainStore;

/**
 * SQLite Domain Store.
 */
exports.SQLiteDomainStore = domainstore.SQLiteDomainStore;

