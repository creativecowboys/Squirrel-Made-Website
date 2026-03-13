import { Client, Environment } from 'squareup';

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENVIRONMENT === 'production'
        ? Environment.Production
        : Environment.Sandbox,
});

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

    try {
        // Map cart items to Square line items
        const lineItems = items.map((item) => ({
            name: item.name,
            quantity: String(item.quantity),
            basePriceMoney: {
                amount: BigInt(Math.round(item.price * 100)),
                currency: 'USD',
            },
        }));

        const { result } = await client.checkoutApi.createPaymentLink({
            idempotencyKey: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            order: {
                locationId: process.env.SQUARE_LOCATION_ID,
                lineItems,
            },
            checkoutOptions: {
                redirectUrl: 'https://squirrelmadeproducts.com/?order=success',
                merchantSupportEmail: 'hello@squirrelmadeproducts.com',
                allowTipping: false,
                askForShippingAddress: true,
            },
        });

        return res.status(200).json({ checkoutUrl: result.paymentLink.url });
    } catch (err) {
        console.error('[Square Checkout Error]', err);
        return res.status(500).json({ error: 'Failed to create checkout. Please try again.' });
    }
}
