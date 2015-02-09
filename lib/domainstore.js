/**
 * @module domainstore
 */

var PromiseA = require('bluebird').Promise
  , fs = PromiseA.promisifyAll(require('fs'))
  , path = require('path')
  ;

/**
 * Domain Store.
 * @constructor
 */
function DomainStore() {
  var self = this;

  self.answers = [];
  self.additionals = [];

  self._spacer = '  ';
  self._replacer = null;
  self._filename = path.join(__dirname, 'dns.db.json');
  self._load();
}
exports.DomainStore = DomainStore;

DomainStore.prototype._save = function (cb) {
  var self = this
    , data = JSON.stringify({ answers: self.answers, additionals: self.additionals }, self._replacer, self._spacer)
    ;

  return fs.writeFileAsync(self._filename, data, 'utf8').then(function () {
    if (cb) { cb(); }
  });
};
DomainStore.prototype._load = function (cb) {
  var self = this
    ;

  return fs.readFileAsync(self._filename, 'utf8').then(function (str) {
    var data = JSON.parse(str);

    self.answers = data.answers;
    self.additionals = data.additionals;

    if (cb) { cb(); }
  });
};

/**
 * Register a  answer.
 */
DomainStore.prototype.registerAnswer = function(answer, cb) {
  var self = this;
  
  self.answers.push(answer);
  return self.save(cb);
};

/**
 * Unregister a  answer.
 */
DomainStore.prototype.unregisterAnswer = function(answer, cb) {
  var self = this
    , i
    ;

  for (i = 0; i < self.answers.length; i++) {
    if (self.answers[i].name === answer.name &&
        self.answers[i].address === answer.address) {
      break;
    }
  }

  if (i < self.answers.length) {
    self.answers.splice(i, 1);
  }
  
  return self.save(cb);
};

/*
DomainStore.prototype.clear = function(cb) {
  var self = this;
  
  self.answers = [];
  self.additionals = [];

  return self.save(cb);
};
*/

/**
 * Obtain  Answer list.
 */
DomainStore.prototype.getAnswerList = function(questions, cb) {
  var self = this,
      answer = [];

  function isInRequest(domain) {
    return questions.some(function (question) {
      if (domain.name === question.name && domain.type === question.type) {
        return true;
      }
    });
  }
  
  self.answers.forEach(function(domain) {
    if (!questions || isInRequest(domain)) {
      answer.push(domain);
    }
  });
  
  return PromiseA.resolve(answer).then(function () {
    if (cb) { cb(null, answer); }

    return answer;
  });
};

/**
 * Obtain  Additional list.
 */
DomainStore.prototype.getAdditionalList = function(request, cb) {
  var self = this;
  
  return PromiseA.resolve(self.additionals).then(function () {
    if (cb) { cb(null, self.additionals); }

    return self.additionals;
  });
};
