// Small-bottle information — the FALLBACK shown before a product has a Small variant.
//
// Every flavour is also made in a small bottle, and shoppers were asking, so the price
// and size are stated on the bottle products. This note is now only a stand-in: the
// moment a product gets a real Size option in Shopify, getSizeVariants() in lib/shopify
// returns its sizes, the site renders a working size picker and add-to-cart instead, and
// this note disappears for that product. Nothing here creates a variant or touches the
// cart — it is text.
//
// History: ordering was held Nov 13–23 2026 because the small bottle's filled shipping
// weight was unknown, and the store's US market runs a USPS Ground Advantage
// carrier-calculated rate alongside the $6.85 / free-over-$60 flat option, so a blank or
// guessed weight would mis-price real shipping. Dave released it Nov 23 2026 with the
// client's own rule: each Small ships at exactly half its own Large's weight.
//
// Source of the facts: the client's own words (Squirrel Made, Nov 12 2026) —
// "Small bottles are $11 each and are approximately 4 ounces in volume. All flavors
// are also in small bottles." No volume is stated for the large bottle, because he
// gave a 9–10 oz range rather than a label.

/** Small-bottle retail price, the client's own flat number for every flavour. */
export const SMALL_BOTTLE_PRICE_USD = 11;

/** Printed size. "approx." is deliberate — 4 oz is his approximation, not a measured fill. */
export const SMALL_BOTTLE_SIZE_LABEL = 'approx. 4 oz';

/** Said on every small-bottle note. No date is promised anywhere. */
export const SMALL_BOTTLE_STATUS = 'Online ordering coming soon';

/** Formatted price, e.g. "$11.00". */
export const SMALL_BOTTLE_PRICE_LABEL = `$${SMALL_BOTTLE_PRICE_USD.toFixed(2)}`;

/**
 * Storefront collections whose products are bottled oil or vinegar. The spice blends
 * (`spice-blends`) are dry seasonings, not bottles, and get no small-bottle note.
 */
const BOTTLE_COLLECTION_HANDLES: readonly string[] = ['olive-oils', 'balsamic'];

/** True when a product's storefront collection is one of the bottled ranges. */
export function isBottleCollection(handle: string | null | undefined): boolean {
  return !!handle && BOTTLE_COLLECTION_HANDLES.includes(handle);
}
