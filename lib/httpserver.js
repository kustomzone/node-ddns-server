/**
 * @module httpserver
 */

//var PromiseA = require('bluebird').PromiseA;
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

//self.server.listen(self.option.port, self.option.host, 128, function() { clbk(); });
//self.server.close(function() { clbk(); });
exports.create = function (store, option) {
  if (!option) {
    option = {};
  }

  if (!option.port || option.port < 0) {
    option.port = 443;
  }

  if (!option.host) {
    option.host = '0.0.0.0';
  }

  var cnAuth = require('./cn-auth').create(option.keypath, option.tokenDbPath);

  return cnAuth.loadKey().then(function (key) {
    var pubPem = key.toPublicPem();
    var app = express();
    var routes = require('../routes');
    var routes_nic = require('../routes/nic').create(store);
    var expressJwt = require('express-jwt');
    var err;

    routes.setDomainStore(store);

    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    app.disable('x-powered-by');
    app.use(bodyParser.json());
    app.use(express.static(option.publicDir));

    app.get('/', routes.index);
    app.get('/domain', routes.domain);
    app.get('/nic/update', routes_nic.update);

    app.get('/api/ddns', routes_nic.update);
    app.post('/api/ddns', expressJwt({ secret: pubPem }), function (req, res, next) {
      console.log(req.url, req.method, req.body);
      if (!req.body.every(function (entry) {
        // TODO if token exists on entry, validate by that token
        if (!cnAuth.cnMatch(req.user.cn, entry.name)) {
          err = entry.name;
          return false;
        }
        return true;
      })) {
        res.send({ error: { message: "Not authenticated for '" + err + "'" } });
        return;
      }

      next();
    });
    app.post('/api/ddns', routes_nic.update);

    return app;
  });
};
