/**
 * @module domainstore
 */

var util = require('util'),
    dns = require('native-dns');

/**
 * Domain Store.
 * @constructor
 */
function DomainStore() {
  this.answers = [];
  this.additionals = [];
}
exports.DomainStore = DomainStore;

/**
 * Register a  answer.
 */
DomainStore.prototype.registerAnswer = function(answer, clbk) {
  var self = this;
  if (!clbk) {
    clbk = function(){};
  }
  
  self.answers.push(answer);
  clbk(undefined);
};

/**
 * Unregister a  answer.
 */
DomainStore.prototype.unregisterAnswer = function(answer, clbk) {
  var self = this;
  if (!clbk) {
    clbk = function() {};
  }

  var i;
  for (i = 0; i < self.answers.length; i++) {
    if (self.answers[i].name === answer.name &&
        self.answers[i].address === answer.address) {
      break;
    }
  }

  if (i < self.answers.length) {
    self.answers.splice(i, 1);
  }
  
  clbk(undefined);
};

DomainStore.prototype.clean = function(clbk) {
  var self = this;
  if (!clbk) {
    clbk = function(){};
  }
  
  self.answers = [];
  self.additionals = [];
  clbk(undefined);
};

/**
 * Obtain  Answer list.
 */
DomainStore.prototype.getAnswerList = function(request, clbk) {
  var self = this,
      answer = [];
  if (!clbk) {
    clbk = function(){};
  }

  function isInRequest(name) {
    return request.question.some(function (question) {
      if (name === question.name) {
        return true;
      }
    });
  }
  
  self.answers.forEach(function(domain) {
    if (request == undefined || isInRequest(domain.name)) {
      answer.push(domain);
    }
  });
  
  clbk(undefined, answer);
};

/**
 * Obtain  Additional list.
 */
DomainStore.prototype.getAdditionalList = function(request, clbk) {
  var self = this;
  if (!clbk) {
    clbk = function(){};
  }
  
  clbk(undefined, self.additionals);
};

/**
 * Redis  Store.
 * @constructor
 */
function RedisDomainStore() {
  try {
    this.redis = require('./redis').client();
  } catch (e) {
    return {};
  }
}
util.inherits(RedisDomainStore, DomainStore);
exports.RedisDomainStore = RedisDomainStore;

RedisDomainStore.prototype.registerAnswer = function(answer, clbk) {
  var self = this;
  if (!clbk) {
    clbk = function(){};
  }
  
  if (!answer) {
    clbk(new Error('answer is invlaid'));
    return;
  }

  self.redis.set('domain:' + answer.name + ':address', answer.address, function(reply, error) {
    if (error) {
      clbk(error);
      return;
    }

    self.redis.set('domain:' + answer.name + ':ttl', answer.ttl, function(reply, error) {
      if (error) {
        clbk(error);
        return;
      }

      clbk(undefined);
    });
  });
 
};

RedisDomainStore.prototype.unregisterAnswer = function(answer, clbk) {
  var self = this;
  if (!clbk) {
    clbk = function(){};
  }
  
  if (!answer) {
    clbk(new Error('answer is invlaid'));
    return;
  }

  self.redis.del('domain:' + answer.name + ':address', answer.address);
  self.redis.del('domain:' + answer.name + ':ttl', answer.ttl);

  clbk(undefined);

};

RedisDomainStore.prototype.getAnswerList = function(request, clbk) {
  return undefined;
};

RedisDomainStore.prototype.getAdditionalList = function(request, clbk) {
  return undefined;
};

RedisDomainStore.prototype.getAnswer = function(name, clbk) {
  var self = this;
  
  self.redis.get('domain:' + name + ':address', function(address, error) {
    if (error) {
      clbk(undefined, error);
      return;
    }

    self.redis.get('domain:' + name + ':ttl', function(ttl, error) {
      if (error) {
        clbk(undefined, error);
        return;
      }

      var answer = dns.A({
        name : name,
        address : address,
        ttl : ttl,
      });

      clbk(answer, undefined);
    });
  });

};


/**
 * SQLite Domain Store.
 * @constructor
 */
function SQLiteDomainStore() {
  // TODO: not implemented
  return {};
}
util.inherits(SQLiteDomainStore, DomainStore);
exports.SQLiteDomainStore = SQLiteDomainStore;
