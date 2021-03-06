# Stripi [![Build Status](https://travis-ci.org/funraiseme/stripi.png)](https://travis-ci.org/funraiseme/stripi)

Simpler Stripe API.
An alternative to [node-stripe](https://github.com/abh/node-stripe) where:

- Error responses matches Stripe's responses exactly
- Does not wrap around the API - you set the method, route, and request body yourself.
  Thus, you're not limited to this repo keeping up with Stripe's API (which seems to be half the issues in that repo).

In other words, [READ THE STRIPE API YOURSELF](https://stripe.com/docs/api).

## API

### new Stripe(key, version, versionDate)

```js
var stripe = Stripe(key, 1)
```

`key` is your secret API key.
`version` is the API version, by default `1`.
You don't need to set the `version`,
but this is in case Stripe upgrades their API version in the future - no updated to this repo would be necessary.
`versionDate` is an optional API version specified in the `Stripe-Version` header. It is a date formated as YYYY-MM-DD.

### Stripe#{method}(route [, request], callback(err, response))

```js
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
})
```

- `method` - the request method
- `route` - the route after the version. Leading `/` is optional. For example, for `https://api.stripe.com/v1/tokens`, you only need to put in `/tokens` or `tokens`.
- `request` (optional) - the request body. Should be an object or `null` (`GET` requests).
- `err` - the error if the response was not a 200 status code.
- `response` - the response body. Should be an object.

### Errors

Errors match [Stripe's errors](https://stripe.com/docs/api#errors) exactly.

- `err.message`
- `err.type`
- `err.code`
- `err.param`
- `err.status` - The status code, so you know whether its a `4xx` error or a `5xx` error.
