// Newsletter signup — adds an email contact to a Resend audience.
// Requires two env vars (already set in the Vercel project):
//   RESEND_API_KEY     — Resend API key
//   RESEND_AUDIENCE_ID — the audience/list ID from the Resend dashboard

import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  let body: { email?: unknown; firstName?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  const { email, firstName } = body;

  // Basic validation
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const audienceId = (process.env.RESEND_AUDIENCE_ID || '').trim();

  if (!apiKey || !audienceId) {
    console.error('[Subscribe] Missing RESEND_API_KEY or RESEND_AUDIENCE_ID env vars');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  console.log('[Subscribe] Attempting to subscribe email:', email.trim().toLowerCase());

  try {
    const response = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          first_name: typeof firstName === 'string' ? firstName.trim() : '',
          unsubscribed: false,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('[Resend API Error]', JSON.stringify(data));
      // Resend returns 409 if contact already exists — treat as success
      if (response.status === 409) {
        return NextResponse.json({ success: true, message: "You're already subscribed!" });
      }
      const msg = data.message || 'Failed to subscribe. Please try again.';
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: "You're in! We'll keep you posted." });
  } catch (err) {
    console.error('[Subscribe Error]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
