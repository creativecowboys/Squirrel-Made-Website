// Vercel serverless function — adds an email contact to a Resend audience.
// Requires two env vars:
//   RESEND_API_KEY     — your Resend API key
//   RESEND_AUDIENCE_ID — the audience/list ID from Resend dashboard

export default async function handler(req, res) {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, firstName } = req.body;

    // Basic validation
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const apiKey = (process.env.RESEND_API_KEY || '').trim();
    const audienceId = (process.env.RESEND_AUDIENCE_ID || '').trim();

    if (!apiKey || !audienceId) {
        console.error('[Subscribe] Missing RESEND_API_KEY or RESEND_AUDIENCE_ID env vars');
        return res.status(500).json({ error: 'Server configuration error.' });
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
                    first_name: firstName?.trim() || '',
                    unsubscribed: false,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('[Resend API Error]', JSON.stringify(data));
            // Resend returns 409 if contact already exists — treat as success
            if (response.status === 409) {
                return res.status(200).json({ success: true, message: "You're already subscribed!" });
            }
            const msg = data.message || 'Failed to subscribe. Please try again.';
            return res.status(502).json({ error: msg });
        }

        return res.status(200).json({ success: true, message: "You're in! We'll keep you posted." });
    } catch (err) {
        console.error('[Subscribe Error]', err);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
}
