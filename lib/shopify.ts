// Shopify Storefront API client.
//
// Used in two places:
//   - Server (build time / ISR): product + collection reads for pages, sitemap, JSON-LD.
//   - Browser: cart create / add / update / remove (the cart lives in Shopify).
//
// The Storefront token is a *public* token (safe in the browser). It is read from
// NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN / NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN — see
// next.config.ts for the VITE_* fallback and README.md for where to set them.

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN as string;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN as string;
const API_VERSION = '2025-01';
const ENDPOINT = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

/** How long (seconds) server-rendered catalog data may be cached before Next re-fetches it. */
export const CATALOG_REVALIDATE_SECONDS = 3600;

/** Shopify collection handles that are real storefront categories (the "frontpage" collection is Shopify's default and is not shown). */
export const STOREFRONT_COLLECTION_HANDLES = ['olive-oils', 'balsamic', 'spice-blends'] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ShopifyVariant {
  id: string;          // gid://shopify/ProductVariant/...
  title: string;
  sku?: string | null;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  /** Absent on products fetched before size options existed; Shopify sends [{name:'Title',value:'Default Title'}] for optionless products. */
  selectedOptions?: { name: string; value: string }[];
}

export interface ShopifyProductOption {
  name: string;
  values: string[];
}

export interface ShopifyProduct {
  id: string;          // gid://shopify/Product/...
  handle: string;
  title: string;
  productType: string;
  description: string;
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  options?: ShopifyProductOption[];
  variants: { edges: { node: ShopifyVariant }[] };
  sellingPlanGroups?: {
    edges: {
      node: {
        name: string;
        sellingPlans: {
          edges: {
            node: {
              id: string;
              name: string;
              description: string | null;
              priceAdjustments: {
                adjustmentValue: {
                  adjustmentPercentage?: number;
                };
              }[];
            };
          }[];
        };
      };
    }[];
  };
}

export interface CartLine {
  id: string;          // gid://shopify/CartLine/...
  quantity: number;
  merchandise: {
    id: string;        // variant id
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      featuredImage: ShopifyImage | null;
    };
  };
  sellingPlanAllocation?: {
    sellingPlan: {
      id: string;
      name: string;
      description: string | null;
    };
  } | null;
}

export interface ShopifyCart {
  id: string;           // gid://shopify/Cart/...
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: { edges: { node: CartLine }[] };
}

export interface CollectionGroup {
  handle: string;
  title: string;
  description: string;
  products: ShopifyProduct[];
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

type FetchMode = 'catalog' | 'cart';

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  mode: FetchMode = 'cart'
): Promise<T> {
  if (!STORE_DOMAIN || !STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront API is not configured (NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN / NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN).');
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    // Catalog reads are cached by Next and revalidated on a timer; cart calls are never cached.
    ...(mode === 'catalog'
      ? { next: { revalidate: CATALOG_REVALIDATE_SECONDS } }
      : { cache: 'no-store' as const }),
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join(', '));
  }

  return json.data as T;
}

// ─── Products ─────────────────────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  id
  handle
  title
  productType
  description
  featuredImage { url altText width height }
  images(first: 5) { edges { node { url altText width height } } }
  options { name values }
  variants(first: 25) {
    edges {
      node {
        id
        title
        sku
        price { amount currencyCode }
        availableForSale
        selectedOptions { name value }
      }
    }
  }
  sellingPlanGroups(first: 1) {
    edges {
      node {
        name
        sellingPlans(first: 1) {
          edges {
            node {
              id
              name
              description
              priceAdjustments {
                adjustmentValue {
                  ... on SellingPlanPercentagePriceAdjustment {
                    adjustmentPercentage
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const COLLECTION_FIELDS = `
  title
  handle
  description
  products(first: 50, sortKey: TITLE) { edges { node { ${PRODUCT_FIELDS} } } }
`;

const COLLECTIONS_QUERY = `
  query GetCollections {
    olive: collection(handle: "olive-oils") { ${COLLECTION_FIELDS} }
    balsamic: collection(handle: "balsamic") { ${COLLECTION_FIELDS} }
    spice: collection(handle: "spice-blends") { ${COLLECTION_FIELDS} }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  query GetCollection($handle: String!) {
    collection(handle: $handle) { ${COLLECTION_FIELDS} }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
      collections(first: 5) { edges { node { handle title } } }
    }
  }
`;

const PRODUCT_HANDLES_QUERY = `
  query GetProductHandles {
    products(first: 100, sortKey: TITLE) { edges { node { handle updatedAt } } }
  }
`;

type RawCollection = { title: string; handle: string; description: string; products: { edges: { node: ShopifyProduct }[] } } | null;

function toGroup(col: NonNullable<RawCollection>): CollectionGroup {
  return {
    handle: col.handle,
    title: col.title,
    description: col.description ?? '',
    products: col.products.edges.map((e) => e.node),
  };
}

/** The three storefront collections, in display order. Server-cached. */
export async function fetchCollections(): Promise<CollectionGroup[]> {
  const data = await storefrontFetch<{ olive: RawCollection; balsamic: RawCollection; spice: RawCollection }>(
    COLLECTIONS_QUERY,
    {},
    'catalog'
  );

  return (['olive', 'balsamic', 'spice'] as const)
    .map((key) => data[key])
    .filter((col): col is NonNullable<RawCollection> => col !== null)
    .map(toGroup);
}

/** One collection by handle, or null if Shopify has no such collection. Server-cached. */
export async function fetchCollectionByHandle(handle: string): Promise<CollectionGroup | null> {
  const data = await storefrontFetch<{ collection: RawCollection }>(COLLECTION_BY_HANDLE_QUERY, { handle }, 'catalog');
  return data.collection ? toGroup(data.collection) : null;
}

export interface ShopifyProductDetail extends ShopifyProduct {
  collections: { edges: { node: { handle: string; title: string } }[] };
}

/** One product by handle, or null if Shopify has no such product. Server-cached. */
export async function fetchProductByHandle(handle: string): Promise<ShopifyProductDetail | null> {
  const data = await storefrontFetch<{ product: ShopifyProductDetail | null }>(PRODUCT_BY_HANDLE_QUERY, { handle }, 'catalog');
  return data.product;
}

/** Every product handle (for generateStaticParams and the sitemap). Server-cached. */
export async function fetchProductHandles(): Promise<{ handle: string; updatedAt: string }[]> {
  const data = await storefrontFetch<{ products: { edges: { node: { handle: string; updatedAt: string } }[] } }>(
    PRODUCT_HANDLES_QUERY,
    {},
    'catalog'
  );
  return data.products.edges.map((e) => e.node);
}

/** Flat, de-duplicated product list across the three collections. */
export async function fetchProducts(): Promise<ShopifyProduct[]> {
  const cols = await fetchCollections();
  const seen = new Set<string>();
  const all: ShopifyProduct[] = [];
  for (const col of cols) {
    for (const p of col.products) {
      if (!seen.has(p.id)) { seen.add(p.id); all.push(p); }
    }
  }
  return all;
}

/** Which storefront collection a product belongs to (first match), for badge colours and breadcrumbs. */
export function storefrontCollectionOf(product: ShopifyProductDetail): { handle: string; title: string } | null {
  const match = product.collections.edges
    .map((e) => e.node)
    .find((c) => (STOREFRONT_COLLECTION_HANDLES as readonly string[]).includes(c.handle));
  return match ?? null;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                title
                featuredImage { url altText }
              }
            }
          }
          sellingPlanAllocation {
            sellingPlan {
              id
              name
              description
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

// LocalStorage key for cart ID persistence
const CART_ID_KEY = 'squirrel_made_shopify_cart_id';

function getSavedCartId(): string | null {
  try {
    return localStorage.getItem(CART_ID_KEY);
  } catch {
    return null;
  }
}

function saveCartId(id: string): void {
  try {
    localStorage.setItem(CART_ID_KEY, id);
  } catch {
    // ignore
  }
}

export function clearSavedCartId(): void {
  try {
    localStorage.removeItem(CART_ID_KEY);
  } catch {
    // ignore
  }
}

/** Load the cart saved in this browser, if any (used on first render so the badge survives a reload). */
export async function getSavedCart(): Promise<ShopifyCart | null> {
  const savedId = getSavedCartId();
  if (!savedId) return null;
  try {
    const data = await storefrontFetch<{ cart: ShopifyCart | null }>(CART_QUERY, { cartId: savedId });
    return data.cart;
  } catch {
    return null;
  }
}

export async function getOrCreateCart(): Promise<ShopifyCart> {
  const saved = await getSavedCart();
  if (saved) return saved;

  // Create a fresh empty cart
  const data = await storefrontFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: { message: string }[] };
  }>(CART_CREATE_MUTATION, { lines: [] });

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(', '));
  }

  saveCartId(data.cartCreate.cart.id);
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1,
  sellingPlanId?: string
): Promise<ShopifyCart> {
  const lineInput: { merchandiseId: string; quantity: number; sellingPlanId?: string } = {
    merchandiseId: variantId,
    quantity,
  };
  if (sellingPlanId) {
    lineInput.sellingPlanId = sellingPlanId;
  }
  const data = await storefrontFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: { message: string }[] };
  }>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [lineInput],
  });

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: { message: string }[] };
  }>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartLinesUpdate.cart;
}

export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: { message: string }[] };
  }>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartLinesRemove.cart;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(amount: string, currencyCode = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export function getCartLines(cart: ShopifyCart): CartLine[] {
  return cart.lines.edges.map((e) => e.node);
}

export function getCartSubtotal(cart: ShopifyCart): number {
  return parseFloat(cart.cost.subtotalAmount.amount);
}

// ─── Size variants ────────────────────────────────────────────────────────────
//
// Shopify gives an optionless product one synthetic variant: option "Title" with
// the single value "Default Title". Every Squirrel Made product looks like that
// today, so everything below is inert until a real option (e.g. "Size" with
// "Large" / "Small") is added in the Shopify admin. The moment it is, the size
// picker appears on the cards and the product pages with no code change.

/** Option names we treat as a size axis, lowercased. */
const SIZE_OPTION_NAMES = ['size', 'bottle size', 'volume'];

/** The synthetic option Shopify invents for products with no real options. */
const SYNTHETIC_OPTION_NAME = 'title';

export function getVariants(product: ShopifyProduct): ShopifyVariant[] {
  return product.variants.edges.map((e) => e.node);
}

/**
 * The product's size option, or null when it has none (every product today).
 * Only a real, multi-value option counts — never Shopify's synthetic "Title".
 */
export function getSizeOption(product: ShopifyProduct): ShopifyProductOption | null {
  const options = product.options ?? [];
  const named = options.find(
    (o) => SIZE_OPTION_NAMES.includes(o.name.trim().toLowerCase()) && o.values.length > 1
  );
  if (named) return named;

  // Fall back to the sole real option when it has more than one value, so a
  // differently-named size axis still renders instead of being silently dropped.
  const real = options.filter(
    (o) => o.name.trim().toLowerCase() !== SYNTHETIC_OPTION_NAME && o.values.length > 1
  );
  return real.length === 1 ? real[0] : null;
}

/**
 * Variants ordered the way the size option is ordered in Shopify, or null when
 * the product has no size axis. Returning null is the signal to render exactly
 * what the site rendered before size variants existed.
 */
export function getSizeVariants(product: ShopifyProduct): ShopifyVariant[] | null {
  const option = getSizeOption(product);
  if (!option) return null;

  const variants = getVariants(product);
  if (variants.length < 2) return null;

  const valueOf = (v: ShopifyVariant) =>
    v.selectedOptions?.find((o) => o.name === option.name)?.value ?? v.title;

  const ordered = option.values
    .map((value) => variants.find((v) => valueOf(v) === value))
    .filter((v): v is ShopifyVariant => !!v);

  // Any mismatch between the option's values and the variants means we don't
  // understand this product's shape — fall back rather than guess.
  return ordered.length === variants.length ? ordered : null;
}

/** The size label to show on a pill, e.g. "Small". Falls back to the variant title. */
export function getSizeLabel(product: ShopifyProduct, variant: ShopifyVariant): string {
  const option = getSizeOption(product);
  if (!option) return variant.title;
  return variant.selectedOptions?.find((o) => o.name === option.name)?.value ?? variant.title;
}

/** Lowest price across a product's purchasable sizes — for "from $X" copy. */
export function getLowestPrice(product: ShopifyProduct): number {
  const prices = getVariants(product).map((v) => parseFloat(v.price.amount));
  return prices.length ? Math.min(...prices) : 0;
}

/**
 * Whether Subscribe & Save may be offered for this particular variant.
 *
 * Subscribe & Save was set up for the original (large) bottle and nothing else.
 * Shopify's selling plan group hangs off the *product*, not the variant, so a
 * naive read would happily hand a newly added size the large bottle's selling
 * plan id and enrol a shopper in a subscription nobody priced. That is the one
 * thing this must never do (Dave, Nov 23 2026: small bottles are one-time only,
 * no new subscription enrolment or discount program).
 *
 * So: a product with no size axis behaves exactly as it always has, and a
 * product with sizes offers the subscription on the FIRST size only — the
 * original large bottle, which is the size the plan was actually created for.
 * Any other size is one-time purchase only.
 */
export function isSubscribableVariant(
  product: ShopifyProduct,
  variant: ShopifyVariant | undefined
): boolean {
  if (!variant) return false;
  const sizes = getSizeVariants(product);
  if (!sizes) return true; // single-size product — unchanged behaviour
  return sizes[0]?.id === variant.id;
}

/** Price / subscription facts a card or product page needs, derived once. */
export function getPurchaseInfo(product: ShopifyProduct, selectedVariantId?: string) {
  const variants = getVariants(product);
  const variant =
    (selectedVariantId ? variants.find((v) => v.id === selectedVariantId) : undefined) ?? variants[0];
  const regularPrice = variant ? parseFloat(variant.price.amount) : 0;
  const available = variant?.availableForSale ?? false;

  const sellingPlanGroup = product.sellingPlanGroups?.edges[0]?.node;
  const sellingPlan = sellingPlanGroup?.sellingPlans.edges[0]?.node;
  // Withheld entirely for any size the plan was not created for, so no caller can
  // pass it to the cart even by accident.
  const subscribable = isSubscribableVariant(product, variant);
  const sellingPlanId = subscribable ? sellingPlan?.id : undefined;
  const discountPercentage = sellingPlan?.priceAdjustments?.[0]?.adjustmentValue?.adjustmentPercentage ?? 0;
  const hasSubscription = !!sellingPlanId;
  const subDiscount = discountPercentage > 0 ? discountPercentage : (hasSubscription ? 15 : 0);
  const subscriptionPrice = regularPrice * (1 - subDiscount / 100);

  return { variant, regularPrice, available, sellingPlanId, hasSubscription, subDiscount, subscriptionPrice };
}
