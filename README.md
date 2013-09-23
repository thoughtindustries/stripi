# Stripi [![Build Status](https://travis-ci.org/jonathanong/stripi.png)](https://travis-ci.org/jonathanong/stripi)

Simpler Stripe API.
An alternative to [node-stripe](https://github.com/abh/node-stripe) where:

- Error responses matches Stripe's responses exactly
- Does not wrap around the API - you set the method, route, and request body yourself.
  Thus, you're not limited to this repo keeping up with Stripe's API (which seems to be half the issues in that repo).

In other words, [READ THE STRIPE API YOURSELF](https://stripe.com/docs/api).

## API

### new Stripe(key, version)

```js
var stripe = Stripe(key, 1)
```

`key` is your secret API key.
`version` is the API version, by default `1`.
You don't need to set the `version`,
but this is in case Stripe upgrades their API version in the future - no updated to this repo would be necesasry.

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

## License

The MIT License (MIT)

Copyright (c) 2013 Jonathan Ong me@jongleberry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.