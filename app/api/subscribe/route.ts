import { emailAddress, NewsletterSync, resendConfig } from '@/lib/newsletter-sync';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS_HEADERS }); }
export async function POST(req: Request) {
  let body: { email?: unknown; firstName?: unknown };
  try { body = await req.json(); } catch { return Response.json({ error: 'A valid email address is required.' }, { status: 400 }); }
  const email = emailAddress(body?.email);
  if (!email) return Response.json({ error: 'A valid email address is required.' }, { status: 400 });
  try {
    const config = resendConfig();
    const name = typeof body.firstName === 'string' ? body.firstName.trim().slice(0, 100) : undefined;
    await new NewsletterSync({ ...config, store: '' }).add(email, Date.now() + 12000, name);
    // Same response for suppressed and subscribed addresses; don't expose subscription state.
    return Response.json({ success: true, message: "Thanks! Your signup request has been received." });
  } catch {
    return Response.json({ error: 'Unable to save your signup. Please try again.' }, { status: 503 });
  }
}
