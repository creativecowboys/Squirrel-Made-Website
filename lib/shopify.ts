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
}

export interface ShopifyProduct {
  id: string;          // gid://shopify/Product/...
  handle: string;
  title: string;
  productType: string;
  description: string;
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
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
  variants(first: 1) {
    edges {
      node {
        id
        title
        sku
        price { amount currencyCode }
        availableForSale
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

/** Price / subscription facts a card or product page needs, derived once. */
export function getPurchaseInfo(product: ShopifyProduct) {
  const variant = product.variants.edges[0]?.node;
  const regularPrice = variant ? parseFloat(variant.price.amount) : 0;
  const available = variant?.availableForSale ?? false;

  const sellingPlanGroup = product.sellingPlanGroups?.edges[0]?.node;
  const sellingPlan = sellingPlanGroup?.sellingPlans.edges[0]?.node;
  const sellingPlanId = sellingPlan?.id;
  const discountPercentage = sellingPlan?.priceAdjustments?.[0]?.adjustmentValue?.adjustmentPercentage ?? 0;
  const hasSubscription = !!sellingPlanId;
  const subDiscount = discountPercentage > 0 ? discountPercentage : (hasSubscription ? 15 : 0);
  const subscriptionPrice = regularPrice * (1 - subDiscount / 100);

  return { variant, regularPrice, available, sellingPlanId, hasSubscription, subDiscount, subscriptionPrice };
}
