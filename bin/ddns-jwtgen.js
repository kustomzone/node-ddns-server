#!/usr/bin/env node

'use strict';

var PromiseA = require('bluebird');
var fs = PromiseA.promisifyAll(require('fs'));
var jwt = require('jsonwebtoken');
var privkey = process.argv[2];
var domainname = process.argv[3];
var devname = process.argv[4];

if (!privkey || !domainname || !devname) {
  console.error("Usage: node ./bin/sign-jwt 'path/to/privkey.pem' 'example.com' 'device-name'");
  return;
}

var jwtgen = require('../jwtgen.js');
var tok = jwtgen({
  keypair: { privateKeyPem: fs.readFileSync(privkey, 'ascii') }
, cn: domainname
, device: devname
, groupIdx: 1
, registered: true
});

console.warn(jwt.decode(tok));
console.info(tok);
process.exit(0);
