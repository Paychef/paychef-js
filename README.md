# PayChef SDK for JavaScript / TypeScript

Official JavaScript/TypeScript client library for the [PayChef](https://www.paychef.com) payment API. Works in Node.js 18+, Bun, Deno, and any runtime with the Fetch API. Fully typed, zero dependencies.

## Installation

```bash
npm install paychef
```

## Quick Start

```ts
import { PayChef } from 'paychef';

const paychef = new PayChef({
  instance: 'your-instance-name', // e.g. 'demo' for https://demo.paychef.com
  apiSecret: 'your-api-secret',   // from your PayChef instance admin panel
});

// Create a payment gateway (checkout) and redirect your customer to `link`
const gateway = await paychef.gateway.create({
  amount: 1000, // in the smallest currency unit, e.g. 10.00 CHF
  currency: 'CHF',
  purpose: 'Order #1234',
  successRedirectUrl: 'https://shop.example.com/success',
  failedRedirectUrl: 'https://shop.example.com/failed',
  cancelRedirectUrl: 'https://shop.example.com/cancel',
});

console.log(gateway.link);
```

CommonJS is also supported:

```js
const { PayChef } = require('paychef');
```

## Verifying your credentials

```ts
await paychef.signatureCheck.retrieve(); // throws PayChefError if credentials are wrong
```

## Common operations

```ts
// Check payment status after the customer returns
const gw = await paychef.gateway.retrieve(gateway.id);
console.log(gw.status); // 'waiting' | 'confirmed' | ...

// Transactions
const tx = await paychef.transaction.retrieve(123);
const txs = await paychef.transaction.list({ limit: 50 });
await paychef.transaction.refund(123, { amount: 500 }); // partial refund
await paychef.transaction.capture(123);                 // capture a reservation

// Subscriptions
const sub = await paychef.subscription.retrieve(1);
await paychef.subscription.cancel(1);

// Invoices, paylinks, designs, payouts, QR codes, ...
const invoice = await paychef.invoice.create({
  title: 'Invoice 2026-001',
  amount: 2500,
  currency: 'CHF',
  purpose: 'Consulting',
});
const methods = await paychef.paymentMethod.list();
const payouts = await paychef.payout.list();
```

## Error handling

Every failed API call throws a `PayChefError` with `statusCode`, `message`, and an optional machine-readable `reason`:

```ts
import { PayChef, PayChefError } from 'paychef';

try {
  await paychef.gateway.create({ amount: 1000, currency: 'CHF' });
} catch (err) {
  if (err instanceof PayChefError) {
    console.error(err.statusCode, err.message, err.reason);
  }
}
```

## Advanced configuration

```ts
const paychef = new PayChef({
  instance: 'your-instance',
  apiSecret: 'your-secret',
  version: '1.8',        // pin a specific API version (default: '1.15')
  timeout: 10_000,       // request timeout in ms (default: 20000)
});
```

## API reference

| Resource | Methods |
| --- | --- |
| `paychef.gateway` | `create`, `retrieve`, `delete` |
| `paychef.transaction` | `retrieve`, `list`, `charge`, `refund`, `capture`, `receipt`, `preAuthorize`, `cancel` |
| `paychef.subscription` | `create`, `retrieve`, `list`, `update`, `cancel` |
| `paychef.invoice` | `create`, `retrieve`, `delete` |
| `paychef.page` | `create`, `retrieve`, `list`, `delete` |
| `paychef.design` | `create`, `retrieve`, `list`, `update`, `delete` |
| `paychef.payout` | `retrieve`, `list`, `details` |
| `paychef.paymentMethod` | `retrieve`, `list` |
| `paychef.paymentProvider` | `list` |
| `paychef.qrCode` | `create`, `retrieve`, `delete` |
| `paychef.bill` | `create`, `retrieve`, `list`, `update`, `delete` |
| `paychef.signatureCheck` | `retrieve` |
| `paychef.authToken` | `create` |
| `paychef.ecr` | `pair`, `unpair`, `payment`, `cancelPayment`, `voidPayment`, `getPayment`, `getPaymentMethods` |

Amounts are always given in the smallest currency unit (e.g. Rappen/Cents).

## License

MIT — see [LICENSE](LICENSE).
