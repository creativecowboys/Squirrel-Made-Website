import crypto from 'crypto';

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

    // Verify Square's HMAC-SHA256 signature
    const body = JSON.stringify(req.body);
    const notificationUrl = `https://squirrelmadeproducts.com/api/webhooks/square`;
    const hmacPayload = notificationUrl + body;
    const expectedSignature = crypto
        .createHmac('sha256', webhookKey)
        .update(hmacPayload)
        .digest('base64');

    if (signature !== expectedSignature) {
        console.warn('[Webhook] Invalid signature — request rejected.');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;

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
