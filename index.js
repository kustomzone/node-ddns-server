'use strict';

var PromiseA = require('bluebird');
var path = require('path');
var app = require('express')();
var RSA = PromiseA.promisifyAll(require('rsa-compat').RSA);
var ndns = require('native-dns');
var serveStatic = require('serve-static');

var privkeyPath = path.join(__dirname, 'privkey.pem');
var store = require('ddns-api/store').create({
  filepath: path.join(__dirname, 'db.sqlite3')
});

RSA.getKeypairAsync = function (filepath, bitlen, exp, options) {
	var PromiseA = require('bluebird');
	var fs = PromiseA.promisifyAll(require('fs'));

	return fs.readFileAsync(filepath, 'ascii').then(function (pem) {
		return RSA.import({ privateKeyPem: pem }, options);
	}, function (/*err*/) {
		return RSA.generateKeypairAsync(bitlen, exp, options, function (err, keypair) {
			return fs.writeFileAsync(filepath, keypair.privateKeyPem, 'ascii').then(function () {
				return keypair;
			});
		});
	});
};

var bitlen = 1024;
var exp = 65537;
var options = { public: true, pem: true, internal: true };
var port = 53;
var address4 = '0.0.0.0';

RSA.getKeypairAsync(privkeyPath, bitlen, exp, options).then(function (keypair) {
  console.log('hello');

	require('ddns-api').create({
		keypair: { publicKeyPem: RSA.exportPublicPem(keypair) }
	, store: store
	, prefix: '/api/com.daplie.ddns'
	, app: app
	});

	app.use('/', serveStatic(require('ddns-frontend').path));

	var plainPort = 80;
	require('http').createServer(app).listen(plainPort, function () {
		console.info('Daplie DDNS RESTful API listening on port', plainPort);
	});

  var getAnswerList = require('ddns-nameserver/query').create({
    store: store
  }).getAnswerList;

  var ns = require('ddns-nameserver').create({
    store: store
  , primaryNameserver: 'ns1.example.com'
  , nameservers: [
      { name: 'ns1.example.com', ipv4: '192.168.1.101' }
    , { name: 'ns2.example.com', ipv4: '192.168.1.102' }
    ]
  , getAnswerList: getAnswerList
  });

  var udpDns = ndns.createServer();
  var tcpDns = ndns.createTCPServer();

  udpDns.on('error', ns.onError);
  udpDns.on('socketError', ns.onSocketError);
  udpDns.on('request', ns.onRequest);
  udpDns.on('listening', function () {
    console.info('DNS Server running on udp port', port);
  });
  udpDns.serve(port, address4);

  tcpDns.on('error', ns.onError);
  tcpDns.on('socketError', ns.onSocketError);
  tcpDns.on('request', ns.onRequest);
  tcpDns.on('listening', function () {
    console.info('DNS Server running on tcp port', port);
  });
  tcpDns.serve(port, address4);
});
