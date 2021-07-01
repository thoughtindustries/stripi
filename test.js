assert = require('assert');
co = require('co');

var key = process.env.STRIPE_API_SECRET || process.env.STRIPE_API || process.env.STRIPE_SECRET;

if (!key) throw new Error('Stripe API required.');

var stripe = require('./')(key);

describe('Stripe JSON', function () {
  describe('Token', function () {
    var token;

    it('should create a token', async function () {
      const _token = await stripe.post('/tokens', {
        'card[number]': '4242424242424242',
        'card[exp_month]': 6,
        'card[exp_year]': 2022,
        'card[cvc]': '314'
      });
      assert.ok(_token.id);
      token = _token;
    });

    it('should not require a request body', async function () {
      const token2 = await stripe.get('/tokens/' + token.id);
      assert.equal(token.id, token2.id);
    });

    it('should return a card number error', async function () {
      let err;
      try {
        await stripe.post('/tokens', {
          'card[number]': '123',
          'card[exp_month]': 6,
          'card[exp_year]': 2022,
          'card[cvc]': '314'
        });
      } catch (e) {
        err = e;
      }

      assert.ok(err);
      assert.equal(err.type, 'card_error');
      assert.equal(err.name, 'card_error');
      assert.equal(err.code, 'invalid_number');
      assert.equal(err.param, 'number');
      assert.equal(err.status, 402);
    });
  });
});
