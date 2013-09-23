assert = require('assert')

var key = process.env.STRIPE_API_SECRET
  || process.env.STRIPE_API
  || process.env.STRIPE_SECRET

if (!key)
  throw new Error('Stripe API required.')

var stripe = require('./')(key)

describe('Stripe JSON', function () {
  describe('Token', function () {
    it('should create a token', function (done) {
      stripe.post('/tokens', {
        card: {
          number: 4242424242424242,
          exp_month: 12,
          exp_year: 2014,
          cvc: 123
        }
      }, function (err, card) {
        assert.ifError(err)
        assert.ok(card.id)

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
        assert.equal(err.code, 'invalid_number')
        assert.equal(err.param, 'number')
        assert.equal(err.status, 402)

        done()
      })
    })
  })
})