assert = require('assert')
co = require('co')

var key = process.env.STRIPE_API_SECRET
  || process.env.STRIPE_API
  || process.env.STRIPE_SECRET

if (!key)
  throw new Error('Stripe API required.')

var stripe = require('./')(key)

describe('Stripe JSON', function () {
  describe('Token', function () {
    var token

    it('should create a token', function (done) {
      stripe.post('/tokens', {
        card: {
          number: 4242424242424242,
          exp_month: 12,
          exp_year: 2014,
          cvc: 123
        }
      }, function (err, _token) {
        assert.ifError(err)
        assert.ok(_token.id)

        token = _token

        done()
      })
    })

    it('should work as a yieldable', function (done) {
      co(function*() {
        var token = yield stripe.post('/tokens', {
          card: {
            number: 4242424242424242,
            exp_month: 12,
            exp_year: 2014,
            cvc: 123
          }
        })
        assert.ok(token)
        assert.ok(token.id)
      })(done)
    })

    it('should not require a request body', function (done) {
      stripe.get('/tokens/' + token.id, function (err, token2) {
        assert.ifError(err)
        assert.equal(token.id, token2.id)

        done()
      })
    })

    it('should return a card number error', function (done) {
      stripe.post('/tokens', {
        card: {
          number: 123,
          exp_month: 12,
          exp_year: 2014,
          cvc: 123
        }
      }, function (err, card) {
        assert.ok(err)
        assert.equal(err.type, 'card_error')
        assert.equal(err.name, 'card_error')
        assert.equal(err.code, 'invalid_number')
        assert.equal(err.param, 'number')
        assert.equal(err.status, 402)

        done()
      })
    })
  })
})