/**
 * @module routes/nic
 */

var dns = require('native-dns'),
    url = require('url'),
    store;

/**
 * Set domain store.
 * @param domainstore {DomainStore} domain store to store the domain by update function
 */
function setDomainStore(domainstore) {
  store = domainstore;
}
exports.setDomainStore = setDomainStore;

/**
 * Update a domain.
 * 
 * Request query should have `hostname` and `myip`. Those values are stored into DomainStore.
 * If these values are invalid, it returns `nochg`.
 * 
 * @param req {Request} HTTP request
 * @param res {Response} HTTP request
 */
exports.update = function(req, res) {
  var query;

  query = url.parse(req.url, true).query;

  if (!query.hostname || !query.myip) {
    res.writeHead(200);
    res.end('nochg');
    return;
  }

  var domain = dns.A({
    name : query.hostname,
    address : query.myip,
    ttl : 600,
  });

  store.registerAnswer(domain, function(err) {

    if (err) {
      res.writeHead(500, {
        'Content-Type' : 'text/plain'
      });
      res.end(err);
    } else {
      res.writeHead(200, {
        'Content-Type' : 'text/plain'
      });
      res.end('good ' + query.myip);
    }
  });
}

