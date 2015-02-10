/**
 * @module routes/nic
 */

var dns = require('native-dns')
  , url = require('url')
  ;

exports.create = function (store) {
  var api = {}
    ;

  /**
   * Update a domain.
   * 
   * Request query should have `hostname` and `myip`. Those values are stored into DomainStore.
   * If these values are invalid, it returns `nochg`.
   * 
   * @param req {Request} HTTP request
   * @param res {Response} HTTP request
   */
  api.update = function (req, res) {
    var query
      , domain
      ;

    query = url.parse(req.url, true).query;
    if (!(query.key || query.name || query.hostname)) {
      query = req.body || {};
    }

    query.key = query.key || query.name || query.hostname;
    query.name = query.key;
    query.value = query.value || query.address || query.ip || query.myip;
    query.ttl = query.ttl && parseInt(query.ttl, 10) || 300;
    if (!query.type) {
      query.type = 'A';
    }
    if (!dns.consts.NAME_TO_QTYPE[query.type.toString().toUpperCase()]) {
      res.send({ error: { message: "unrecognized type '" + query.type + "'" } });
      return;
    }

    if (!query.key || !query.value) {
      res.send({ error: { message: "missing key (hostname) and or value (ip)" } });
      return;
    }

    domain = {
      name : query.key || query.name || query.hostname
    , type: query.type || 'A' //dns.consts.NAME_TO_QTYPE[query.type || 'A'],
    , values : [ query.value || query.myip ]
    , ttl : 300
    };

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
        res.end('good ' + query.value);
      }
    });
  };

  return api;
  //return PromiseA.resolve(api);
};
