// Meta (Facebook) Pixel event helpers.
//
// The base pixel + PageView live in index.html. This module adds the commerce
// funnel events so Events Manager can show more than raw traffic.
//
// NOTE ON `Purchase`: checkout is handed off to Shopify's hosted checkout on a
// different domain, so the completed sale cannot be tracked from this codebase.
// Purchase must be enabled Shopify-side (Facebook & Instagram sales channel, or
// a Customer Event pixel in Shopify admin) using the same pixel ID.

const PIXEL_ID = '704248896104665';

type Fbq = (command: string, event: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/** Fire a standard Meta pixel event. Never throws — tracking must not break the store. */
function track(event: string, params?: Record<string, unknown>): void {
  try {
    window.fbq?.('track', event, params);
  } catch (err) {
    // Pixel blocked by an ad blocker, or script failed to load. Non-fatal.
    if (import.meta.env.DEV) console.warn('[pixel] failed to send', event, err);
  }
}

export interface AddToCartPayload {
  productId: string;
  productTitle: string;
  value: number;
  isSubscription: boolean;
}

export function trackAddToCart({ productId, productTitle, value, isSubscription }: AddToCartPayload): void {
  track('AddToCart', {
    content_ids: [productId],
    content_name: productTitle,
    content_type: 'product',
    value: Number(value.toFixed(2)),
    currency: 'USD',
    // Custom: lets us split one-time vs Subscribe & Save in Events Manager.
    purchase_type: isSubscription ? 'subscription' : 'one-time',
  });
}

export function trackInitiateCheckout(value: number, numItems: number): void {
  track('InitiateCheckout', {
    value: Number(value.toFixed(2)),
    currency: 'USD',
    num_items: numItems,
  });
}

export { PIXEL_ID };
