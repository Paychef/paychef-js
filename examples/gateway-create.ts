import { PayChef, PayChefError } from 'paychef';

const paychef = new PayChef({
  instance: process.env.PAYCHEF_INSTANCE ?? 'YOUR_INSTANCE_NAME',
  apiSecret: process.env.PAYCHEF_API_SECRET ?? 'YOUR_API_SECRET',
});

try {
  const gateway = await paychef.gateway.create({
    amount: 1000, // 10.00 CHF
    currency: 'CHF',
    purpose: 'Test order',
    successRedirectUrl: 'https://example.com/success',
    failedRedirectUrl: 'https://example.com/failed',
  });
  console.log('Gateway created:', gateway.id);
  console.log('Redirect your customer to:', gateway.link);
} catch (err) {
  if (err instanceof PayChefError) {
    console.error(`PayChef error ${err.statusCode}: ${err.message}`);
  } else {
    throw err;
  }
}
