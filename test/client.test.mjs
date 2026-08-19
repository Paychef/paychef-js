import test from 'node:test';
import assert from 'node:assert/strict';
import { PayChef, PayChefError } from '../dist/esm/index.js';

function mockFetch(handler) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url: String(url), init });
    const result = handler(String(url), init);
    return {
      status: result.status ?? 200,
      json: async () => result.body,
    };
  };
  fn.calls = calls;
  return fn;
}

function client(handler) {
  const f = mockFetch(handler);
  const paychef = new PayChef({ instance: 'demo', apiSecret: 'secret', fetch: f });
  return { paychef, f };
}

test('gateway.create sends POST with x-api-key to api.paychef.com', async () => {
  const { paychef, f } = client(() => ({
    body: { status: 'success', data: [{ id: 42, link: 'https://demo.paychef.com/?payment=x' }] },
  }));
  const gw = await paychef.gateway.create({ amount: 1000, currency: 'CHF' });
  assert.equal(gw.id, 42);

  const call = f.calls[0];
  assert.match(call.url, /^https:\/\/api\.paychef\.com\/v1\.15\/Gateway\/0\/\?instance=demo$/);
  assert.equal(call.init.method, 'POST');
  assert.equal(call.init.headers['x-api-key'], 'secret');
  const body = JSON.parse(call.init.body);
  assert.equal(body.amount, 1000);
  assert.equal(body.model, 'Gateway');
  assert.equal(body.instance, undefined); // instance nur in der Query, nicht im Body
});

test('transaction.retrieve uses GET with params in query string', async () => {
  const { paychef, f } = client(() => ({
    body: { status: 'success', data: [{ id: 7, status: 'confirmed', amount: 500 }] },
  }));
  const tx = await paychef.transaction.retrieve(7);
  assert.equal(tx.status, 'confirmed');
  const call = f.calls[0];
  assert.match(call.url, /^https:\/\/api\.paychef\.com\/v1\.15\/Transaction\/7\/\?/);
  assert.match(call.url, /instance=demo/);
  assert.equal(call.init.method, 'GET');
  assert.equal(call.init.body, undefined);
});

test('list methods return arrays', async () => {
  const { paychef } = client(() => ({
    body: { status: 'success', data: [{ id: 1 }, { id: 2 }] },
  }));
  const txs = await paychef.transaction.list({ limit: 10 });
  assert.equal(txs.length, 2);
});

test('API errors throw PayChefError with reason', async () => {
  const { paychef } = client(() => ({
    status: 403,
    body: { status: 'error', message: 'Invalid secret', reason: 'invalid_auth' },
  }));
  await assert.rejects(
    () => paychef.gateway.retrieve(1),
    (err) => {
      assert.ok(err instanceof PayChefError);
      assert.equal(err.statusCode, 403);
      assert.equal(err.reason, 'invalid_auth');
      return true;
    },
  );
});

test('subscription.cancel uses DELETE', async () => {
  const { paychef, f } = client(() => ({
    body: { status: 'success', data: [{ id: 3, status: 'cancelled' }] },
  }));
  const sub = await paychef.subscription.cancel(3);
  assert.equal(sub.status, 'cancelled');
  assert.equal(f.calls[0].init.method, 'DELETE');
  assert.match(f.calls[0].url, /\/Subscription\/3\//);
});

test('design.update uses POST (API quirk)', async () => {
  const { paychef, f } = client(() => ({
    body: { status: 'success', data: [{ id: 9 }] },
  }));
  await paychef.design.update(9, { name: 'New' });
  assert.equal(f.calls[0].init.method, 'POST');
});

test('missing credentials throw immediately', () => {
  assert.throws(() => new PayChef({ instance: '', apiSecret: '' }), PayChefError);
});
