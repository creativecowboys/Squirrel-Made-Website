import crypto from 'crypto';

// Disable Vercel's automatic body parsing so we can read the raw bytes
// and verify Square's HMAC-SHA256 signature correctly.
export const config = {
    api: {
        bodyParser: false,
    },
};

/** Read the raw request body as a Buffer */
function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const signature = req.headers['x-square-hmacsha256-signature'];
    const webhookKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

    if (!webhookKey || !signature) {
        console.warn('[Webhook] Missing webhook key or signature header.');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Read the raw body bytes — required for correct HMAC verification.
    // Square signs: notificationUrl + rawBody (exact bytes as received).
    const rawBody = await getRawBody(req);
    const notificationUrl = 'https://squirrelmadeproducts.com/api/webhooks/square';
    const hmacPayload = notificationUrl + rawBody.toString('utf8');

    const expectedSignature = crypto
        .createHmac('sha256', webhookKey)
        .update(hmacPayload)
        .digest('base64');

    if (signature !== expectedSignature) {
        console.warn('[Webhook] Invalid signature — request rejected.');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));

    // Handle payment.updated — fires when status changes, including → COMPLETED
    if (event.type === 'payment.updated') {
        const payment = event.data?.object?.payment;
        if (payment?.status === 'COMPLETED') {
            console.log('[Webhook] Payment completed:', {
                id: payment?.id,
                amount: payment?.amount_money,
                status: payment?.status,
                orderId: payment?.order_id,
            });
            // TODO: Add order fulfilment logic here (email confirmation, etc.)
        }
    }

    return res.status(200).json({ received: true });
}
