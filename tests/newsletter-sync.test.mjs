import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { NewsletterSync, CONSENT_TOPIC, SQUIRREL_SEGMENT, syncConfig, resendConfig, verifyShopify, customerIdFromWebhook, handleConsentWebhook, handleReconciliation } from '../lib/newsletter-sync.ts';

const env = {
  RESEND_API_KEY: 'fake-resend', RESEND_AUDIENCE_ID: SQUIRREL_SEGMENT,
  SHOPIFY_NEWSLETTER_SYNC_ENABLED: 'true', SHOPIFY_ADMIN_STORE_DOMAIN: 'squirrel-test.myshopify.com',
  SHOPIFY_ADMIN_API_TOKEN: 'fake-admin', SHOPIFY_NEWSLETTER_WEBHOOK_SECRET: 'fake-signing-secret', CRON_SECRET: 'fake-cron-secret',
};
const makeCustomer = (state = 'SUBSCRIBED', email = 'shopper@example.test', id = '123') => ({ id: `gid://shopify/Customer/${id}`, defaultEmailAddress: { emailAddress: email, marketingState: state, marketingUpdatedAt: '2026-11-26T12:00:00Z', validFormat: true } });
function world(options = {}) {
  const w = { customer: makeCustomer(), contacts: new Map(), members: new Set(), otherMembers: new Set(['shopper@example.test']), calls: [], creates: 0, reads: 0, adds: 0, removes: 0, time: 0, ...options };
  const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers });
  w.fetch = async (url, init = {}) => {
    w.calls.push([url, init.method || 'GET', init.body]);
    if (w.failure) return json({}, w.failure);
    if (url.endsWith('/admin/oauth/access_token')) return json({ access_token: 'fake-dynamic', scope: w.scopes || 'read_customers', expires_in: 86399 });
    if (url.includes('/graphql.json')) {
      const { query } = JSON.parse(init.body);
      if (w.graphError) return json({ errors: [{ extensions: { code: w.graphError } }] });
      if (query.includes('NewsletterCustomers')) return json({ data: { customers: { nodes: w.customers || [w.customer], pageInfo: { hasNextPage: false, endCursor: null } } } });
      w.reads++;
      return json({ data: { customer: structuredClone(w.customer) } });
    }
    const path = new URL(url).pathname;
    if (path === '/contacts' && init.method === 'GET') return json({ has_more: false, data: [...w.members].map(email => ({ id: email, email, unsubscribed: false })) });
    if (path === '/contacts' && init.method === 'POST') {
      const data = JSON.parse(init.body); w.creates++;
      assert.equal(Object.hasOwn(data, 'unsubscribed'), false, 'creation must not set a flag that could reset a raced existing record');
      if (w.createConflict) {
        w.contacts.set(data.email, { id: data.email, email: data.email, unsubscribed: true });
        return json({}, 409);
      }
      w.contacts.set(data.email, { id: data.email, email: data.email, unsubscribed: false });
      return json({ id: data.email });
    }
    const match = path.match(/^\/contacts\/([^/]+)(?:\/segments\/([^/]+))?$/);
    assert.ok(match, `Unexpected request ${url}`);
    const email = decodeURIComponent(match[1]);
    if (match[2]) {
      assert.equal(match[2], SQUIRREL_SEGMENT, 'only Squirrel segment may change');
      if (init.method === 'POST') { w.members.add(email); w.adds++; w.onAdd?.(w); }
      else if (init.method === 'DELETE') { w.members.delete(email); w.removes++; w.onRemove?.(w); }
      else assert.fail('Unexpected segment method');
      return json({ id: email });
    }
    assert.equal(init.method, 'GET', 'global contact must never be patched/deleted');
    return w.contacts.has(email) ? json(w.contacts.get(email)) : json({}, 404);
  };
  w.deps = { fetch: w.fetch, now: () => w.time, sleep: async ms => { w.time += ms; } };
  w.engine = () => new NewsletterSync(syncConfig(env), w.deps);
  return w;
}
const request = (raw = '{"customer_id":123}', overrides = {}) => new Request('https://example.test/api/shopify/marketing-consent', {
  method: 'POST', body: raw, headers: { 'x-shopify-shop-domain': env.SHOPIFY_ADMIN_STORE_DOMAIN, 'x-shopify-topic': CONSENT_TOPIC, 'x-shopify-hmac-sha256': createHmac('sha256', env.SHOPIFY_NEWSLETTER_WEBHOOK_SECRET).update(raw).digest('base64'), ...overrides },
});

test('configuration fails closed and pins the Squirrel segment', () => {
  assert.throws(() => syncConfig({ ...env, SHOPIFY_NEWSLETTER_SYNC_ENABLED: '' }));
  assert.throws(() => syncConfig({ ...env, SHOPIFY_ADMIN_STORE_DOMAIN: 'attacker.example' }));
  assert.throws(() => syncConfig({ ...env, SHOPIFY_ADMIN_API_TOKEN: '' }));
  assert.throws(() => resendConfig({ ...env, RESEND_AUDIENCE_ID: 'another-client' }));
});
test('valid HMAC succeeds, changed body/missing signature fail', () => {
  const raw = '{"customer_id":123}'; const signature = createHmac('sha256', 'secret').update(raw).digest('base64');
  assert.equal(verifyShopify(raw, signature, 'secret'), true);
  assert.equal(verifyShopify(raw + ' ', signature, 'secret'), false);
  assert.equal(verifyShopify(raw, null, 'secret'), false);
});
test('customer IDs preserve exact decimal values above JS safe integer range', () => {
  assert.equal(customerIdFromWebhook('{"customer_id":706405506930370084}'), 'gid://shopify/Customer/706405506930370084');
  assert.throws(() => customerIdFromWebhook('{"customer_id":"oops"}'));
});
test('a new opted-in customer is created, segment-added, then re-read from Shopify', async () => {
  const w = world(); const result = await w.engine().syncCustomer(w.customer.id, 100000);
  assert.equal(result, 'added'); assert.equal(w.creates, 1); assert.equal(w.members.size, 1); assert.equal(w.reads, 2);
});
test('duplicate deliveries preserve one contact and one membership', async () => {
  const w = world(); const engine = w.engine();
  await engine.syncCustomer(w.customer.id, 100000); await engine.syncCustomer(w.customer.id, 100000);
  assert.equal(w.creates, 1); assert.equal(w.contacts.size, 1); assert.equal(w.members.size, 1);
});
test('global Resend optout is never reversed', async () => {
  const w = world(); w.contacts.set('shopper@example.test', { id: 'shopper@example.test', email: 'shopper@example.test', unsubscribed: true });
  assert.equal(await w.engine().syncCustomer(w.customer.id, 100000), 'suppressed');
  assert.equal(w.adds, 0); assert.equal(w.contacts.get('shopper@example.test').unsubscribed, true);
});
test('create conflict re-reads and preserves a concurrently unsubscribed contact', async () => {
  const w = world({ createConflict: true });
  assert.equal(await w.engine().syncCustomer(w.customer.id, 100000), 'suppressed'); assert.equal(w.adds, 0);
});
test('explicit Shopify unsubscribe removes only Squirrel membership', async () => {
  const w = world({ customer: makeCustomer('UNSUBSCRIBED'), members: new Set(['shopper@example.test']) });
  assert.equal(await w.engine().syncCustomer(w.customer.id, 100000), 'removed');
  assert.equal(w.members.size, 0); assert.equal(w.otherMembers.size, 1); assert.equal(w.contacts.size, 0);
});
for (const state of ['NOT_SUBSCRIBED', 'PENDING', 'INVALID']) {
  test(`${state} does not erase an independent homepage signup`, async () => {
    const w = world({ customer: makeCustomer(state), members: new Set(['shopper@example.test']) });
    assert.equal(await w.engine().syncCustomer(w.customer.id, 100000), 'unchanged'); assert.equal(w.members.size, 1); assert.equal(w.removes, 0);
  });
}
test('stale webhook payload cannot resubscribe a currently-unsubscribed Shopify customer', async () => {
  const w = world({ customer: makeCustomer('UNSUBSCRIBED'), members: new Set(['shopper@example.test']) });
  const response = await handleConsentWebhook(request('{"customer_id":123,"email_marketing_consent":{"state":"subscribed"}}'), env, w.deps);
  assert.equal(response.status, 200); assert.equal(w.members.size, 0); assert.equal(w.adds, 0);
});
test('consent changing during segment addition is corrected on the subsequent read', async () => {
  const w = world({ onAdd: w => { w.customer = makeCustomer('UNSUBSCRIBED'); } });
  assert.equal(await w.engine().syncCustomer(w.customer.id, 100000), 'removed'); assert.equal(w.members.size, 0); assert.equal(w.removes, 1);
});
test('bounded recheck loops fail retryably if consent keeps changing', async () => {
  const w = world({ onAdd: w => { w.customer = makeCustomer('UNSUBSCRIBED'); }, onRemove: w => { w.customer = makeCustomer('SUBSCRIBED'); } });
  await assert.rejects(w.engine().syncCustomer(w.customer.id, 100000), /consent_changed_during_sync/); assert.equal(w.reads, 7);
});
test('no-email and deleted customers are harmless no-ops', async () => {
  for (const customer of [null, { id: 'gid://shopify/Customer/123', defaultEmailAddress: null }]) {
    const w = world({ customer }); assert.equal(await w.engine().syncCustomer('gid://shopify/Customer/123', 100000), 'no_email'); assert.equal(w.adds, 0);
  }
});
test('invalid signature/store/topic are rejected before provider calls', async () => {
  for (const headers of [{ 'x-shopify-hmac-sha256': 'bad' }, { 'x-shopify-shop-domain': 'other.myshopify.com' }, { 'x-shopify-topic': 'orders/paid' }]) {
    const w = world(); assert.equal((await handleConsentWebhook(request(undefined, headers), env, w.deps)).status, 401); assert.equal(w.calls.length, 0);
  }
});
test('oversized webhook is rejected before provider calls', async () => {
  const w = world(); assert.equal((await handleConsentWebhook(request(' '.repeat(65537)), env, w.deps)).status, 413); assert.equal(w.calls.length, 0);
});
test('provider errors are retryable without exposing payloads', async () => {
  const w = world({ failure: 503 }); const response = await handleConsentWebhook(request(), env, w.deps);
  assert.equal(response.status, 503); assert.deepEqual(await response.json(), { error: 'provider_unavailable' });
});
test('GraphQL 200 with errors fails closed', async () => {
  const w = world({ graphError: 'ACCESS_DENIED' });
  await assert.rejects(w.engine().syncCustomer(w.customer.id, 100000), /shopify_query_failed/); assert.equal(w.adds, 0);
});
test('cron requires its private bearer secret', async () => {
  const w = world(); const req = new Request('https://example.test/api/cron/shopify-newsletter');
  assert.equal((await handleReconciliation(req, env, w.deps)).status, 401); assert.equal(w.calls.length, 0);
});
test('reconciliation repairs missed opt-ins and withdrawals, preserving unrelated homepage members', async () => {
  const customers = [makeCustomer(), makeCustomer('UNSUBSCRIBED', 'withdrawn@example.test', '124'), makeCustomer('NOT_SUBSCRIBED', 'homepage@example.test', '125')];
  const w = world({ customers, members: new Set(['withdrawn@example.test', 'homepage@example.test']) });
  // Return the matching current customer for per-customer GraphQL reads.
  const original = w.fetch; w.deps.fetch = async (url, init) => {
    if (url.includes('/graphql.json')) {
      const data = JSON.parse(init.body);
      if (data.query.includes('NewsletterCustomer(')) w.customer = customers.find(c => c.id === data.variables.id);
    }
    return original(url, init);
  };
  const req = new Request('https://example.test/api/cron/shopify-newsletter', { headers: { authorization: `Bearer ${env.CRON_SECRET}` } });
  const response = await handleReconciliation(req, env, w.deps); assert.equal(response.status, 200);
  assert.deepEqual([...w.members].sort(), ['homepage@example.test', 'shopper@example.test']);
  const body = await response.json(); assert.equal(body.scanned, 3); assert.equal(body.added, 1); assert.equal(body.removed, 1); assert.equal(body.unchanged, 1);
});
test('steady-state reconciliation avoids rewriting existing subscribers', async () => {
  const w = world({ members: new Set(['shopper@example.test']) }); await w.engine().reconcile(100000);
  assert.equal(w.adds, 0); assert.equal(w.removes, 0); assert.equal(w.creates, 0);
});
test('new Dev Dashboard client credentials renew a strictly read_customers token', async () => {
  const w = world(); const config = syncConfig({ ...env, SHOPIFY_ADMIN_API_TOKEN: '', SHOPIFY_ADMIN_CLIENT_ID: 'fake-id', SHOPIFY_ADMIN_CLIENT_SECRET: 'fake-secret' });
  const engine = new NewsletterSync(config, w.deps); await engine.customer(w.customer.id, 100000); await engine.customer(w.customer.id, 100000);
  assert.equal(w.calls.filter(c => c[0].endsWith('/admin/oauth/access_token')).length, 1);
});
test('client-credential scope expansion is rejected', async () => {
  const w = world({ scopes: 'read_customers,write_customers' }); const config = syncConfig({ ...env, SHOPIFY_ADMIN_API_TOKEN: '', SHOPIFY_ADMIN_CLIENT_ID: 'fake-id', SHOPIFY_ADMIN_CLIENT_SECRET: 'fake-secret' });
  await assert.rejects(new NewsletterSync(config, w.deps).customer(w.customer.id, 100000), /shopify_token_scope/);
});
test('homepage add uses the same helper and does not touch Shopify', async () => {
  const w = world(); const engine = new NewsletterSync({ ...resendConfig(env), store: '' }, w.deps);
  await engine.add('homepage@example.test', 100000, 'Test'); assert.equal(w.members.has('homepage@example.test'), true); assert.equal(w.reads, 0);
});

test('a transient 429 respects Retry-After and then succeeds', async () => {
  const w = world(); const original = w.fetch; let throttled = false;
  w.deps.fetch = async (url, init) => {
    if (url.startsWith('https://api.resend.com') && !throttled) { throttled = true; return new Response('{}', { status: 429, headers: { 'retry-after': '1' } }); }
    return original(url, init);
  };
  assert.equal(await new NewsletterSync(syncConfig(env), w.deps).syncCustomer(w.customer.id, 100000), 'added'); assert.ok(w.time >= 1000);
});
test('retry budget longer than webhook deadline returns retryable status', async () => {
  const w = world(); w.deps.fetch = async () => new Response('{}', { status: 429, headers: { 'retry-after': '60' } });
  assert.equal((await handleConsentWebhook(request(), env, w.deps)).status, 503);
  assert.ok(w.time < 4200);
});
test('reconciliation exhausts both Resend and Shopify cursor pages', async () => {
  const w = world(); const original = w.fetch; let resendPages = 0; let shopifyPages = 0;
  w.deps.fetch = async (url, init) => {
    if (url.includes('/contacts?')) {
      resendPages++;
      const after = new URL(url).searchParams.get('after');
      return Response.json(after ? { has_more: false, data: [] } : { has_more: true, data: [{ id: 'cursor-resend', email: 'homepage@example.test', unsubscribed: false }] });
    }
    if (url.includes('/graphql.json') && JSON.parse(init.body).query.includes('NewsletterCustomers(')) {
      shopifyPages++;
      const after = JSON.parse(init.body).variables.after;
      return Response.json({ data: { customers: { nodes: [], pageInfo: { hasNextPage: !after, endCursor: after ? null : 'cursor-shopify' } } } });
    }
    return original(url, init);
  };
  const result = await new NewsletterSync(syncConfig(env), w.deps).reconcile(100000);
  assert.equal(resendPages, 2); assert.equal(shopifyPages, 2); assert.equal(result.scanned, 0);
});
test('malformed pagination cannot falsely report a complete scan', async () => {
  const w = world(); w.deps.fetch = async () => Response.json({ has_more: true, data: [] });
  await assert.rejects(new NewsletterSync(syncConfig(env), w.deps).reconcile(100000), /resend_pagination/);
});
test('one failed customer is counted and does not block later customers', async () => {
  const customers = [makeCustomer('SUBSCRIBED', 'bad@example.test', '1'), makeCustomer('SUBSCRIBED', 'good@example.test', '2')];
  const w = world({ customers }); const original = w.fetch;
  w.deps.fetch = async (url, init) => {
    if (url.includes('/graphql.json')) {
      const data = JSON.parse(init.body);
      if (data.query.includes('NewsletterCustomer(')) {
        if (data.variables.id.endsWith('/1')) return Response.json({ errors: [{ extensions: { code: 'ACCESS_DENIED' } }] });
        w.customer = customers[1];
      }
    }
    return original(url, init);
  };
  const response = await handleReconciliation(new Request('https://example.test', { headers: { authorization: `Bearer ${env.CRON_SECRET}` } }), env, w.deps);
  assert.equal(response.status, 503); const result = await response.json(); assert.equal(result.failed, 1); assert.equal(result.added, 1); assert.equal(w.members.has('good@example.test'), true);
});
test('webhook missing configuration is closed without provider access', async () => {
  const w = world(); assert.equal((await handleConsentWebhook(request(), { ...env, SHOPIFY_NEWSLETTER_WEBHOOK_SECRET: '' }, w.deps)).status, 503); assert.equal(w.calls.length, 0);
});
