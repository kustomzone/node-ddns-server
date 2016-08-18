'use strict';

module.exports = function (opts) {
  var jwt = require('jsonwebtoken');
  var tok = jwt.sign({
    cn: opts.cn
  , device: opts.device
  , groupIdx: opts.groupIdx
  , registered: opts.registered
  }, opts.keypair.privateKeyPem, { algorithm: 'RS256' });
  return tok;
};
