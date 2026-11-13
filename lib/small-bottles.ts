// Small-bottle information — INFORMATIONAL ONLY.
//
// Every flavour is also made in a small bottle, and shoppers were asking, so the
// price and size are stated on the bottle products. Online ordering for the small
// bottle is NOT open: no Small variant exists in Shopify, nothing here creates one,
// and nothing here adds anything to the cart or to checkout. The large bottle is
// still the only thing that can be bought, exactly as before.
//
// Why ordering is held: the filled shipping weight of a small bottle is unknown, and
// the store's US market runs a USPS Ground Advantage carrier-calculated rate alongside
// the $6.85 / free-over-$60 flat option. A blank or guessed weight would mis-price real
// shipping, so the small bottle stays unbuyable until the weight is known.
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
