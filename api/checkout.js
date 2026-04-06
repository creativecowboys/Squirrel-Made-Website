// Uses native fetch (Node 18+) to call Square REST API directly.
// Avoids squareup SDK BigInt serialization issues with Vercel's ESM/CJS handling.

// ─── Change 3: Shipping tier logic ───────────────────────────────────────────
// Bottles (oils & balsamics): 1–3 → $6.50 | 4+ → Free
// Bags   (spice blends):      1–2 → $3.00 | 3+ → Free
// Mixed:  bottle rate applies unless bottleCount >= 4 (then whole order is free)
function getShippingFee(items) {
    const bottleCount = items
        .filter((i) => i.type === 'bottle')
        .reduce((sum, i) => sum + i.quantity, 0);

    const bagCount = items
        .filter((i) => i.type === 'bag')
        .reduce((sum, i) => sum + i.quantity, 0);

    const hasBottles = bottleCount > 0;
    const hasBags = bagCount > 0;

    // Bottles only
    if (hasBottles && !hasBags) {
        if (bottleCount >= 4) return null; // free
        return { name: 'Standard Shipping', amount: 650 }; // $6.50
    }

    // Bags only
    if (hasBags && !hasBottles) {
        if (bagCount >= 3) return null; // free
        return { name: 'Standard Shipping', amount: 300 }; // $3.00
    }

    // Mixed order: bottle rate applies; free if bottles >= 4
    if (hasBottles && hasBags) {
        if (bottleCount >= 4) return null; // free
        return { name: 'Standard Shipping', amount: 650 }; // $6.50 (bottle rate)
    }

    return null; // no items — no shipping
}
// ─────────────────────────────────────────────────────────────────────────────

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

    const accessToken = (process.env.SQUARE_ACCESS_TOKEN || '').trim();
    const locationId = (process.env.SQUARE_LOCATION_ID || '').trim();
    const isProduction = (process.env.SQUARE_ENVIRONMENT || '').trim() === 'production';
    const squareBaseUrl = isProduction
        ? 'https://connect.squareup.com'
        : 'https://connect.squareupsandbox.com';

    // Debug: log first 10 chars of token and location ID presence
    console.log('[Checkout Debug] env check:', {
        tokenPrefix: accessToken ? accessToken.substring(0, 10) + '...' : 'MISSING',
        tokenLength: accessToken.length,
        locationId: locationId || 'MISSING',
        environment: (process.env.SQUARE_ENVIRONMENT || '').trim(),
        baseUrl: squareBaseUrl,
    });

    if (!accessToken || !locationId) {
        console.error('[Checkout] Missing SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID env vars');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        // ─── Change 1: Use catalog_object_id when available ───────────────────
        // When catalogObjectId is set, Square links the item to your catalog so
        // any taxes configured there apply automatically.
        // Falls back to plain-text name + price if catalogObjectId is missing.
        const lineItems = items.map((item) => {
            if (item.catalogObjectId) {
                return {
                    catalog_object_id: item.catalogObjectId,
                    quantity: String(item.quantity),
                };
            }
            // Fallback: plain-text line item (safe during catalog ID rollout)
            return {
                name: item.name,
                quantity: String(item.quantity),
                base_price_money: {
                    amount: Math.round(item.price * 100),
                    currency: 'USD',
                },
            };
        });

        // ─── Change 3: Calculate shipping ────────────────────────────────────
        const shipping = getShippingFee(items);
        console.log('[Checkout] Shipping fee:', shipping);

        const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        // ─── Change 4: 7% Sales Tax fallback ─────────────────────────────────
        // Included as a safety net. Once you confirm in the Square sandbox that
        // catalog-applied taxes are working (Change 1), you can remove this block.
        const taxes = [
            {
                name: 'Sales Tax',
                percentage: '7.0',
                scope: 'ORDER',
            },
        ];

        const body = {
            idempotency_key: idempotencyKey,
            order: {
                location_id: locationId,
                line_items: lineItems,
                taxes,
            },
            checkout_options: {
                redirect_url: 'https://squirrelmadeproducts.com/?order=success',
                merchant_support_email: 'squirrelmadeproducts@gmail.com',
                allow_tipping: false,
                ask_for_shipping_address: true,
                // ─── Change 3: Inject shipping fee when applicable ────────────
                ...(shipping && {
                    shipping_fee: {
                        name: shipping.name,
                        charge: {
                            amount: shipping.amount,
                            currency: 'USD',
                        },
                    },
                }),
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
