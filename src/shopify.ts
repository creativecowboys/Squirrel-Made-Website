// Shopify Storefront API client
// Replaces the old Square-based cart.ts

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string;
const API_VERSION = '2025-01';
const ENDPOINT = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyVariant {
  id: string;          // gid://shopify/ProductVariant/...
  title: string;
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

// ─── Core fetch ───────────────────────────────────────────────────────────────

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
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
  featuredImage { url altText }
  images(first: 1) { edges { node { url altText } } }
  variants(first: 1) {
    edges {
      node {
        id
        title
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

const COLLECTIONS_QUERY = `
  query GetCollections {
    olive: collection(handle: "olive-oils") {
      title
      handle
      products(first: 50, sortKey: TITLE) { edges { node { ${PRODUCT_FIELDS} } } }
    }
    balsamic: collection(handle: "balsamic") {
      title
      handle
      products(first: 50, sortKey: TITLE) { edges { node { ${PRODUCT_FIELDS} } } }
    }
    spice: collection(handle: "spice-blends") {
      title
      handle
      products(first: 50, sortKey: TITLE) { edges { node { ${PRODUCT_FIELDS} } } }
    }
  }
`;

export interface CollectionGroup {
  handle: string;
  title: string;
  products: ShopifyProduct[];
}

export async function fetchCollections(): Promise<CollectionGroup[]> {
  const data = await storefrontFetch<{
    olive: { title: string; handle: string; products: { edges: { node: ShopifyProduct }[] } } | null;
    balsamic: { title: string; handle: string; products: { edges: { node: ShopifyProduct }[] } } | null;
    spice: { title: string; handle: string; products: { edges: { node: ShopifyProduct }[] } } | null;
  }>(COLLECTIONS_QUERY, {});

  return (['olive', 'balsamic', 'spice'] as const)
    .map((key) => data[key])
    .filter((col): col is NonNullable<typeof col> => col !== null)
    .map((col) => ({
      handle: col.handle,
      title: col.title,
      products: col.products.edges.map((e) => e.node),
    }));
}

// Keep a flat fetch for backwards compat
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

export async function getOrCreateCart(): Promise<ShopifyCart> {
  const savedId = getSavedCartId();
  if (savedId) {
    try {
      const data = await storefrontFetch<{ cart: ShopifyCart | null }>(
        CART_QUERY,
        { cartId: savedId }
      );
      if (data.cart) return data.cart;
    } catch {
      // Cart may have expired — create a new one below
    }
  }
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
