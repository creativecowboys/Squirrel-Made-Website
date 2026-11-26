import { createHmac, timingSafeEqual } from 'node:crypto';

export const CONSENT_TOPIC = 'customers_email_marketing_consent/update';
export const SQUIRREL_SEGMENT = 'b44ad25d-dec8-48bf-a0c3-ddad5b3c9e2b';
const CUSTOMER_FIELDS = 'id defaultEmailAddress { emailAddress marketingState marketingUpdatedAt validFormat }';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export type ConsentCustomer = { id: string; defaultEmailAddress: null | { emailAddress: string; marketingState: string; marketingUpdatedAt: string | null; validFormat: boolean } };
type Contact = { id: string; email: string; unsubscribed: boolean };
export type SyncConfig = { resendKey: string; segment: string; store: string; adminToken?: string; clientId?: string; clientSecret?: string };
type Dependencies = { fetch?: typeof fetch; now?: () => number; sleep?: (ms: number) => Promise<void> };
export class SyncError extends Error {
  code: string;
  status: number;
  constructor(code: string, status = 503) { super(code); this.code = code; this.status = status; }
}
const clean = (v: string | undefined) => (v || '').trim();
export function emailAddress(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL.test(email) ? email : null;
}
export function resendConfig(env: NodeJS.ProcessEnv = process.env) {
  const resendKey = clean(env.RESEND_API_KEY);
  const segment = clean(env.RESEND_AUDIENCE_ID);
  if (!resendKey || segment !== SQUIRREL_SEGMENT) throw new SyncError('newsletter_configuration');
  return { resendKey, segment };
}
export function syncConfig(env: NodeJS.ProcessEnv = process.env): SyncConfig {
  const base = resendConfig(env);
  const store = clean(env.SHOPIFY_ADMIN_STORE_DOMAIN).toLowerCase();
  const adminToken = clean(env.SHOPIFY_ADMIN_API_TOKEN);
  const clientId = clean(env.SHOPIFY_ADMIN_CLIENT_ID);
  const clientSecret = clean(env.SHOPIFY_ADMIN_CLIENT_SECRET);
  if (env.SHOPIFY_NEWSLETTER_SYNC_ENABLED !== 'true' || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(store) || (!adminToken && !(clientId && clientSecret))) {
    throw new SyncError('shopify_sync_configuration');
  }
  return { ...base, store, adminToken, clientId, clientSecret };
}
export function secureEqual(left: string, right: string): boolean {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function verifyShopify(raw: string, signature: string | null, secret: string): boolean {
  if (!secret || !signature || !/^[A-Za-z0-9+/]{43}=$/.test(signature)) return false;
  return secureEqual(createHmac('sha256', secret).update(raw).digest('base64'), signature);
}
export function customerIdFromWebhook(raw: string): string {
  // Shopify numeric IDs may exceed JS's safe integer range; preserve the decimal text.
  const value = JSON.parse(raw.replace(/("customer_id"\s*:\s*)(\d+)(?=\s*[,}])/g, '$1"$2"'));
  const id = value?.customer_id;
  if (typeof id !== 'string' || !/^\d{1,24}$/.test(id)) throw new SyncError('invalid_webhook', 400);
  return `gid://shopify/Customer/${id}`;
}
function fingerprint(customer: ConsentCustomer | null) {
  return JSON.stringify(customer?.defaultEmailAddress || null);
}

export class NewsletterSync {
  private fetcher: typeof fetch;
  private now: () => number;
  private sleep: (ms: number) => Promise<void>;
  private nextResendAt = 0;
  private token: { value: string; expires: number } | null = null;
  private config: SyncConfig;
  constructor(config: SyncConfig, dependencies: Dependencies = {}) {
    this.config = config;
    this.fetcher = dependencies.fetch || fetch;
    this.now = dependencies.now || Date.now;
    this.sleep = dependencies.sleep || (ms => new Promise(resolve => setTimeout(resolve, ms)));
  }
  private async wait(ms: number, deadline: number) {
    if (this.now() + ms >= deadline) throw new SyncError('sync_deadline');
    if (ms > 0) await this.sleep(ms);
  }
  private async request(url: string, init: RequestInit, deadline: number, resend = false, missingOK = false): Promise<any> {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (resend) {
        await this.wait(Math.max(0, this.nextResendAt - this.now()), deadline);
        this.nextResendAt = this.now() + 550;
      }
      if (this.now() >= deadline) throw new SyncError('sync_deadline');
      let response: Response;
      try {
        response = await this.fetcher(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(Math.max(1, Math.min(8000, deadline - this.now()))) });
      } catch {
        if (attempt === 2) throw new SyncError('provider_unavailable');
        await this.wait(150 * 2 ** attempt, deadline); continue;
      }
      if (missingOK && response.status === 404) return null;
      let body: any;
      try { body = await response.json(); } catch { throw new SyncError('provider_response'); }
      const throttled = body?.errors?.some?.((e: any) => e?.extensions?.code === 'THROTTLED');
      if (response.status === 429 || response.status >= 500 || throttled) {
        if (attempt === 2) throw new SyncError('provider_unavailable');
        const seconds = Number(response.headers.get('retry-after'));
        const cost = body?.extensions?.cost;
        const deficit = Number(cost?.requestedQueryCost || 0) - Number(cost?.throttleStatus?.currentlyAvailable || 0);
        const restore = Number(cost?.throttleStatus?.restoreRate || 0);
        const delay = Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : restore > 0 ? Math.max(200, deficit / restore * 1000 + 100) : 300 * 2 ** attempt;
        await this.wait(delay, deadline); continue;
      }
      if (!response.ok) throw new SyncError(response.status === 409 ? 'contact_conflict' : response.status === 401 || response.status === 403 ? 'provider_access' : 'provider_rejected');
      if (body?.errors?.length) throw new SyncError('shopify_query_failed');
      return body;
    }
    throw new SyncError('provider_unavailable');
  }
  private async accessToken(deadline: number): Promise<string> {
    if (this.config.adminToken) return this.config.adminToken;
    if (this.token && this.token.expires > this.now() + 60000) return this.token.value;
    const data = await this.request(`https://${this.config.store}/admin/oauth/access_token`, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: this.config.clientId || '', client_secret: this.config.clientSecret || '' }).toString(),
    }, deadline);
    const scopes = typeof data.scope === 'string' ? data.scope.split(',').map((s: string) => s.trim()) : [];
    if (!data.access_token || !scopes.includes('read_customers') || scopes.some((s: string) => s !== 'read_customers') || !Number.isFinite(data.expires_in) || data.expires_in <= 60) {
      throw new SyncError('shopify_token_scope');
    }
    this.token = { value: data.access_token, expires: this.now() + data.expires_in * 1000 };
    return this.token.value;
  }
  private async graphql(query: string, variables: object, deadline: number) {
    const token = await this.accessToken(deadline);
    const result = await this.request(`https://${this.config.store}/admin/api/2026-10/graphql.json`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token }, body: JSON.stringify({ query, variables }),
    }, deadline);
    if (!result?.data) throw new SyncError('shopify_query_failed');
    return result.data;
  }
  async customer(id: string, deadline: number): Promise<ConsentCustomer | null> {
    if (!/^gid:\/\/shopify\/Customer\/\d{1,24}$/.test(id)) throw new SyncError('invalid_customer', 400);
    const data = await this.graphql(`query NewsletterCustomer($id: ID!) { customer(id: $id) { ${CUSTOMER_FIELDS} } }`, { id }, deadline);
    if (data.customer === null) return null;
    if (!data.customer?.id || !Object.hasOwn(data.customer, 'defaultEmailAddress')) throw new SyncError('shopify_customer_response');
    return data.customer;
  }
  private resend(path: string, method: string, deadline: number, body?: object, missingOK = false) {
    return this.request(`https://api.resend.com${path}`, { method, headers: { Authorization: `Bearer ${this.config.resendKey}`, 'Content-Type': 'application/json', 'User-Agent': 'SquirrelMadeNewsletterSync/1.0' }, ...(body ? { body: JSON.stringify(body) } : {}) }, deadline, true, missingOK);
  }
  async contact(email: string, deadline: number): Promise<Contact | null> {
    const data = await this.resend(`/contacts/${encodeURIComponent(email)}`, 'GET', deadline, undefined, true);
    if (data === null) return null;
    if (!data?.id || typeof data.unsubscribed !== 'boolean') throw new SyncError('resend_contact_response');
    return data;
  }
  async add(email: string, deadline: number, firstName?: string): Promise<'added' | 'suppressed'> {
    let contact = await this.contact(email, deadline);
    if (!contact) {
      try {
        await this.resend('/contacts', 'POST', deadline, { email, ...(firstName ? { first_name: firstName } : {}) });
      } catch (error) {
        if (!(error instanceof SyncError) || error.code !== 'contact_conflict') throw error;
      }
      // Always re-read after creation/conflict. Never reset an existing unsubscribe flag.
      contact = await this.contact(email, deadline);
      if (!contact) throw new SyncError('resend_contact_missing');
    }
    if (contact.unsubscribed) return 'suppressed';
    await this.resend(`/contacts/${encodeURIComponent(contact.id)}/segments/${this.config.segment}`, 'POST', deadline);
    return 'added';
  }
  async remove(email: string, deadline: number): Promise<void> {
    await this.resend(`/contacts/${encodeURIComponent(email)}/segments/${this.config.segment}`, 'DELETE', deadline, undefined, true);
  }
  async syncCustomer(id: string, deadline: number): Promise<string> {
    let current = await this.customer(id, deadline);
    for (let pass = 0; pass < 6; pass++) {
      const address = current?.defaultEmailAddress;
      const email = address && address.validFormat !== false ? emailAddress(address.emailAddress) : null;
      if (!email || !address) return 'no_email';
      let result = 'unchanged';
      if (address.marketingState === 'SUBSCRIBED') result = await this.add(email, deadline);
      else if (address.marketingState === 'UNSUBSCRIBED') { await this.remove(email, deadline); result = 'removed'; }
      else return 'unchanged'; // Never infer withdrawal of an independent homepage signup.
      const latest = await this.customer(id, deadline);
      if (fingerprint(current) === fingerprint(latest)) return result;
      current = latest;
    }
    throw new SyncError('consent_changed_during_sync');
  }
  async reconcile(deadline: number) {
    // Snapshot membership makes steady-state daily scans cheap; only deltas cause contact writes.
    const members = new Set<string>();
    let after: string | undefined;
    for (let page = 0; page < 100; page++) {
      const qs = new URLSearchParams({ segment_id: this.config.segment, limit: '100', ...(after ? { after } : {}) });
      const data = await this.resend(`/contacts?${qs}`, 'GET', deadline);
      if (!Array.isArray(data?.data) || typeof data.has_more !== 'boolean') throw new SyncError('resend_list_response');
      for (const contact of data.data) { const email = emailAddress(contact.email); if (email) members.add(email); }
      if (!data.has_more) break;
      const next = data.data.at(-1)?.id;
      if (!next || next === after || page === 99) throw new SyncError('resend_pagination');
      after = next;
    }
    const counts = { scanned: 0, added: 0, removed: 0, suppressed: 0, unchanged: 0, no_email: 0, failed: 0 };
    after = undefined;
    for (let page = 0; page < 100; page++) {
      const data = await this.graphql(`query NewsletterCustomers($after: String) { customers(first: 50, after: $after, sortKey: ID) { nodes { ${CUSTOMER_FIELDS} } pageInfo { hasNextPage endCursor } } }`, { after: after || null }, deadline);
      const connection = data?.customers;
      if (!Array.isArray(connection?.nodes) || typeof connection?.pageInfo?.hasNextPage !== 'boolean') throw new SyncError('shopify_list_response');
      for (const customer of connection.nodes as ConsentCustomer[]) {
        counts.scanned++;
        const address = customer.defaultEmailAddress; const email = emailAddress(address?.emailAddress);
        const needsAdd = email && address?.marketingState === 'SUBSCRIBED' && !members.has(email);
        const needsRemove = email && address?.marketingState === 'UNSUBSCRIBED' && members.has(email);
        if (needsAdd || needsRemove) {
          try {
            const result = await this.syncCustomer(customer.id, deadline);
            if (result in counts && result !== 'scanned') counts[result as keyof typeof counts]++;
          } catch (error) {
            if (error instanceof SyncError && error.code === 'sync_deadline') throw error;
            counts.failed++; // One malformed/unavailable record must not block the whole list.
          }
          // Keep snapshot conservative; every changed customer is re-read by syncCustomer.
        } else counts.unchanged++;
      }
      if (!connection.pageInfo.hasNextPage) return counts;
      const next = connection.pageInfo.endCursor;
      if (!next || next === after) throw new SyncError('shopify_pagination');
      after = next;
    }
    throw new SyncError('shopify_scan_limit');
  }
}

export async function handleConsentWebhook(req: Request, env: NodeJS.ProcessEnv = process.env, dependencies: Dependencies = {}) {
  try {
    const config = syncConfig(env);
    const secret = clean(env.SHOPIFY_NEWSLETTER_WEBHOOK_SECRET);
    if (!secret) throw new SyncError('webhook_configuration');
    if (req.headers.get('x-shopify-shop-domain')?.toLowerCase() !== config.store || req.headers.get('x-shopify-topic') !== CONSENT_TOPIC) return Response.json({ error: 'Invalid source.' }, { status: 401 });
    if (Number(req.headers.get('content-length') || 0) > 65536) return Response.json({ error: 'Payload too large.' }, { status: 413 });
    const raw = await req.text();
    if (Buffer.byteLength(raw) > 65536) return Response.json({ error: 'Payload too large.' }, { status: 413 });
    if (!verifyShopify(raw, req.headers.get('x-shopify-hmac-sha256'), secret)) return Response.json({ error: 'Invalid signature.' }, { status: 401 });
    let id: string;
    try { id = customerIdFromWebhook(raw); } catch { return Response.json({ error: 'Invalid payload.' }, { status: 400 }); }
    const now = dependencies.now || Date.now;
    const outcome = await new NewsletterSync(config, dependencies).syncCustomer(id, now() + 4200);
    return Response.json({ success: true, outcome });
  } catch (error) {
    return Response.json({ error: error instanceof SyncError ? error.code : 'sync_unavailable' }, { status: 503 });
  }
}
export async function handleReconciliation(req: Request, env: NodeJS.ProcessEnv = process.env, dependencies: Dependencies = {}) {
  const secret = clean(env.CRON_SECRET);
  if (!secret || !secureEqual(req.headers.get('authorization') || '', `Bearer ${secret}`)) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const now = dependencies.now || Date.now;
    const counts = await new NewsletterSync(syncConfig(env), dependencies).reconcile(now() + 270000);
    return Response.json({ success: counts.failed === 0, ...counts }, { status: counts.failed ? 503 : 200 });
  } catch (error) {
    return Response.json({ error: error instanceof SyncError ? error.code : 'sync_unavailable' }, { status: 503 });
  }
}
