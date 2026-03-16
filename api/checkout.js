// Uses native fetch (Node 18+) to call Square REST API directly.
// Avoids squareup SDK BigInt serialization issues with Vercel's ESM/CJS handling.

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { items } = req.body;

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty or invalid.' });
    }

    for (const item of items) {
        if (!item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
            return res.status(400).json({ error: 'Invalid item format in cart.' });
        }
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;
    const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';
    const squareBaseUrl = isProduction
        ? 'https://connect.squareup.com'
        : 'https://connect.squareupsandbox.com';

    // Debug: log first 10 chars of token and location ID presence
    console.log('[Checkout Debug] env check:', {
        tokenPrefix: accessToken ? accessToken.trim().substring(0, 10) + '...' : 'MISSING',
        tokenLength: accessToken ? accessToken.length : 0,
        locationId: locationId || 'MISSING',
        environment: process.env.SQUARE_ENVIRONMENT || 'MISSING',
        baseUrl: squareBaseUrl,
    });

    if (!accessToken || !locationId) {
        console.error('[Checkout] Missing SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID env vars');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        // Map cart items — amounts in cents as plain integers (no BigInt)
        const lineItems = items.map((item) => ({
            name: item.name,
            quantity: String(item.quantity),
            base_price_money: {
                amount: Math.round(item.price * 100),
                currency: 'USD',
            },
        }));

        const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const body = {
            idempotency_key: idempotencyKey,
            order: {
                location_id: locationId,
                line_items: lineItems,
            },
            checkout_options: {
                redirect_url: 'https://squirrelmadeproducts.com/?order=success',
                merchant_support_email: 'squirrelmadeproducts@gmail.com',
                allow_tipping: false,
                ask_for_shipping_address: true,
            },
        };

        const response = await fetch(`${squareBaseUrl}/v2/online-checkout/payment-links`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Square-Version': '2024-01-18',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[Square API Error]', JSON.stringify(data.errors));
            const msg = data.errors?.[0]?.detail || 'Square API error';
            return res.status(502).json({ error: msg });
        }

        return res.status(200).json({ checkoutUrl: data.payment_link.url });
    } catch (err) {
        console.error('[Checkout Error]', err);
        return res.status(500).json({ error: 'Failed to create checkout. Please try again.' });
    }
}
