var https = require('https');
var methods = require('methods');
var qs = require('query-string');

module.exports = Stripe;

function Stripe(key, version, versionDate) {
  if (!key)
    throw new Error('You need a key!');

  if (!(this instanceof Stripe))
    return new Stripe(key, version, versionDate);

  this.auth = 'Basic ' + new Buffer(key + ':').toString('base64');
  this.version = version || 1;
  this.versionDate = versionDate || null;
}

Stripe.prototype.request = function (method, route, obj, callback) {
  if (route[0] !== '/')
    route = '/' + route;

  if (typeof obj === 'function') {
    callback = obj;
    obj = null;
  }

  var data;
  var headers = {
    Authorization: this.auth,
    Accept: 'application/json'
  };

  if (this.versionDate) {
    headers['Stripe-Version'] = this.versionDate;
  }

  if (obj) {
    data = new Buffer(qs.stringify(obj));
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    headers['Content-Length'] = data.length;
  }

  var req = https.request({
    host: 'api.stripe.com',
    path: '/v' + this.version + route,
    method: method,
    headers: headers
  });

  req
  .once('response', function (res) {
    res.once('error', callback);

    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    })
    res.once('end', function () {
      try {
        body = JSON.parse(body);
      } catch (err) {
        err.status = 400;
        callback(err);
        return;
      }

      if (res.statusCode === 200)
        return callback(null, body);

      var error = body.error;
      var err = new Error(error.message);
      err.type = err.name = error.type;
      err.code = error.code;
      err.param = error.param;
      err.status = res.statusCode;
      err.expose = true;
      callback(err);
    });
  })
  .end(data);

  if (callback)
    req.on('error', callback);

  return function (fn) {
    req.on('error', callback = fn);
  };
};

methods.forEach(function (method) {
  Stripe.prototype[method] = function (route, obj, callback) {
    return this.request(method.toUpperCase(), route, obj, callback);
  };
});
