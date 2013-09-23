var https = require('https')
var methods = require('methods')
var qs = require('qs')

module.exports = Stripe

function Stripe(key, version) {
  if (!key)
    throw new Error('You need a key!')

  if (!(this instanceof Stripe))
    return new Stripe(key, version)

  this._auth = 'Basic ' + new Buffer(key + ':').toString('base64')
  this._version = version || 1
}

Stripe.prototype._request = function (method, route, obj, callback) {
  if (route[0] !== '/')
    route = '/' + route

  var data = new Buffer(qs.stringify(obj))

  https.request({
    host: 'api.stripe.com',
    path: '/v' + this._version + route,
    method: method,
    headers: {
      'Authorization': this._auth,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length
    }
  })
  .once('error', callback)
  .once('response', function (res) {
    res.once('error', callback)

    var body = ''
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      body += chunk
    })
    res.once('end', function () {
      try {
        body = JSON.parse(body)
      } catch (err) {
        err.status = 400
        callback(err)
        return
      }

      if (res.statusCode === 200)
        return callback(null, body)

      var error = body.error
      var err = new Error(error.message)
      err.type = error.type
      err.code = error.code
      err.param = error.param
      err.status = res.statusCode
      callback(err)
    })
  })
  .end(data)
}

methods.forEach(function (method) {
  Stripe.prototype[method] = function (route, obj, callback) {
    return this._request(method.toUpperCase(), route, obj, callback)
  }
})