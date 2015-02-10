/**
 * @module httpserver
 */

var path = require('path')
  , express = require('express')
  , bodyParser = require('body-parser')
  ;

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

  var app = express()
    , routes = require('../routes')
    , routes_nic = require('../routes/nic').create(store)
    ;

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
  app.post('/api/ddns', routes_nic.update);

  return app;
};
