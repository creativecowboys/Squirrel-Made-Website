// On-page catalog copy. Every claim is taken from Shopify product titles/descriptions
// or from existing site copy (small-batch, handcrafted, artisan spice blends,
// bottled and infused in Marietta, Georgia). No gift-set page: the catalog has
// no gift products, and the site never names Atlanta.

import { SITE_NAME, SITE_URL } from '@/lib/site';

export interface CatalogProduct {
  handle: string;
  title: string;
  description: string;
}

export interface InlinePart {
  text: string;
  href?: string;
}

export interface CollectionSeo {
  handle: string;
  /** Full document title, including the brand. */
  title: string;
  h1: string;
  /** One-sentence hero line under the H1. */
  lede: string;
  description: string;
  /** Terms the visible copy and meta description actually use. */
  keywords: string[];
  intro: InlinePart[];
}

export const COLLECTION_NAV = [
  {
    handle: 'olive-oils',
    href: '/collections/olive-oils',
    label: 'Olive Oils',
    anchor: 'small-batch infused olive oils',
  },
  {
    handle: 'balsamic',
    href: '/collections/balsamic',
    label: 'Balsamic',
    anchor: 'aged balsamic vinegar',
  },
  {
    handle: 'spice-blends',
    href: '/collections/spice-blends',
    label: 'Spice Blends',
    anchor: 'handcrafted spice blends',
  },
] as const;

const META_LIMIT = 160;

const BRAND_SUFFIX = ` | ${SITE_NAME}`;

/** Product titles that do not already say what the item is. Words come from the product title or its description. */
const PRODUCT_TITLE_CORE: Record<string, string> = {
  'extra-virgin-olive-oil-spanish': 'Spanish Extra Virgin Olive Oil | Small-Batch',
  'chef-squirrels-blend': "Chef Squirrel's Blend | Handcrafted Spice Blend",
  'mediterranean-squirrel': 'Mediterranean Squirrel | Artisan Spice Blend',
  'squirrelly-4-chile-fiesta': 'Squirrelly 4 Chile Fiesta | Handcrafted Spice Blend',
  'pumpkin-spice-25-star-white-balsamic': 'Pumpkin Spice 25 Star White Balsamic | Aged Balsamic Vinegar',
};

const OLIVE_INFUSED: { handle: string; label: string }[] = [
  { handle: 'garlic-infused-extra-virgin-olive-oil', label: 'garlic' },
  { handle: 'basil-infused-extra-virgin-olive-oil', label: 'basil' },
  { handle: 'meyer-lemon-extra-virgin-olive-oil', label: 'Meyer lemon' },
  { handle: 'black-truffle-extra-virgin-olive-oil', label: 'black truffle' },
  { handle: 'hatch-green-chili-extra-virgin-olive-oil', label: 'Hatch green chili' },
];

const SPANISH_OLIVE = 'extra-virgin-olive-oil-spanish';

const BALSAMIC_AGED_FIRST = [
  '25-star-traditional-balsamic-vinegar',
  '25-star-white-balsamic-vinegar',
];

function has(products: CatalogProduct[], handle: string): boolean {
  return products.some((product) => product.handle === handle);
}

function findProduct(products: CatalogProduct[], handle: string): CatalogProduct | undefined {
  return products.find((product) => product.handle === handle);
}

function joinEnglish(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function productLink(product: CatalogProduct): InlinePart {
  return { text: product.title, href: `/products/${product.handle}` };
}

function linkList(products: CatalogProduct[]): InlinePart[] {
  const parts: InlinePart[] = [];
  products.forEach((product, index) => {
    if (index > 0) {
      const last = index === products.length - 1;
      parts.push({ text: products.length === 2 && last ? ' and ' : last ? ', and ' : ', ' });
    }
    parts.push(productLink(product));
  });
  return parts;
}

function withAlsoShop(parts: InlinePart[], current: string): InlinePart[] {
  const text = parts.map((part) => part.text).join('');
  if (text.length > 0 && !text.endsWith(' ')) parts.push({ text: ' ' });
  parts.push(...alsoShop(current));
  return parts;
}

function alsoShop(current: string): InlinePart[] {
  const others = COLLECTION_NAV.filter((item) => item.handle !== current);
  const parts: InlinePart[] = [{ text: 'Also shop ' }];
  others.forEach((item, index) => {
    if (index > 0 && index === others.length - 1) parts.push({ text: ' and ' });
    else if (index > 0) parts.push({ text: ', ' });
    parts.push({ text: item.anchor, href: item.href });
  });
  parts.push({ text: '.' });
  return parts;
}

function clipSentences(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= META_LIMIT) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+/g) ?? [];
  let out = '';
  for (const sentence of sentences) {
    const piece = sentence.trim();
    const next = out ? `${out} ${piece}` : piece;
    if (next.length > META_LIMIT) break;
    out = next;
  }
  if (out.length >= 50) return out;
  return clean.slice(0, META_LIMIT).replace(/\s+\S*$/, '').trim();
}

function productMetaDescription(description: string, title: string): string {
  const clean = description.replace(/\s+/g, ' ').trim();
  const location = 'Small-batch from Squirrel Made in Marietta, Georgia.';
  const base = clean ? clipSentences(clean) : title;
  if (!/Marietta/i.test(base) && base.length + 1 + location.length <= META_LIMIT) {
    return `${base} ${location}`;
  }
  return base;
}

export function productSeoTitle(handle: string, title: string): string {
  const core = PRODUCT_TITLE_CORE[handle] ?? title.trim();
  return `${core}${BRAND_SUFFIX}`;
}

export function productSeoDescription(description: string, title: string): string {
  return productMetaDescription(description, title);
}

export function collectionAnchor(handle: string | null | undefined): string | null {
  return COLLECTION_NAV.find((item) => item.handle === handle)?.anchor ?? null;
}

function oliveDescription(products: CatalogProduct[]): string {
  const infused = OLIVE_INFUSED.flatMap((item) => {
    const product = findProduct(products, item.handle);
    if (!product || !product.title.toLowerCase().includes(item.label.toLowerCase())) return [];
    return [item.label];
  });
  const spanish = has(products, SPANISH_OLIVE);
  const base = 'Shop infused extra virgin olive oil online from Squirrel Made in Marietta, Georgia';
  let text = base;
  if (infused.length) text += `: ${joinEnglish(infused)}`;
  const withSpanish = spanish ? `${text}, plus Spanish extra virgin olive oil` : text;
  if (`${withSpanish}.`.length <= META_LIMIT) return `${withSpanish}.`;
  if (`${text}.`.length <= META_LIMIT) return `${text}.`;
  return `${base}.`;
}

function oliveIntro(products: CatalogProduct[]): InlinePart[] {
  const infused = OLIVE_INFUSED.map((item) => findProduct(products, item.handle)).filter((product): product is CatalogProduct => Boolean(product));
  const spanish = findProduct(products, SPANISH_OLIVE);
  const parts: InlinePart[] = [
    { text: 'Squirrel Made bottles and infuses extra virgin olive oil in small batches in Marietta, Georgia. ' },
  ];
  if (infused.length) {
    parts.push({ text: 'Infused extra virgin olive oils in this collection include ' });
    parts.push(...linkList(infused));
    parts.push({ text: '.' });
  }
  if (spanish) {
    parts.push({ text: /signature/i.test(spanish.description) ? ' The signature bottle is ' : ' Also here: ' });
    parts.push(productLink(spanish));
    parts.push({ text: '.' });
  }
  return withAlsoShop(parts, 'olive-oils');
}

function balsamicDescription(products: CatalogProduct[]): string {
  const traditional = products.some((product) => /12 year aged/i.test(product.description));
  const white = products.some((product) => /10 year aged/i.test(product.description));
  const infused = products.some((product) => /infused/i.test(`${product.title} ${product.description}`));
  const parts: string[] = [];
  if (traditional) parts.push('12 year aged traditional balsamic');
  if (white) parts.push('10 year aged white balsamic');
  if (infused) parts.push('infused balsamic vinegars');
  let text = 'Aged balsamic vinegar from Squirrel Made in Marietta, Georgia';
  if (parts.length) text += `: ${joinEnglish(parts)}`;
  return clipSentences(`${text}.`);
}

function balsamicIntro(products: CatalogProduct[]): InlinePart[] {
  const bases = BALSAMIC_AGED_FIRST
    .map((handle) => findProduct(products, handle))
    .filter((product): product is CatalogProduct => Boolean(product));
  const infusions = products.filter((product) => !BALSAMIC_AGED_FIRST.includes(product.handle));
  const parts: InlinePart[] = [
    { text: 'Squirrel Made bottles and infuses balsamic vinegar in small batches in Marietta, Georgia. ' },
  ];
  if (bases.length) {
    parts.push({ text: 'Aged balsamic vinegar here includes ' });
    parts.push(...linkList(bases));
    parts.push({ text: '.' });
  }
  if (infusions.length) {
    parts.push({ text: ' Infused balsamic vinegars include ' });
    parts.push(...linkList(infusions));
    parts.push({ text: '.' });
  }
  return withAlsoShop(parts, 'balsamic');
}

function spiceDescription(products: CatalogProduct[]): string {
  const names = products.map((product) => product.title);
  let text = 'Handcrafted artisan spice blends from Squirrel Made in Marietta, Georgia';
  if (names.length) text += `: ${joinEnglish(names)}`;
  return clipSentences(`${text}.`);
}

function spiceSentence(product: CatalogProduct): InlinePart[] {
  if (product.handle === 'chef-squirrels-blend') {
    return [
      productLink(product),
      { text: ' is an all-purpose seasoning with no chemicals or preservatives. ' },
    ];
  }
  if (product.handle === 'mediterranean-squirrel') {
    return [
      productLink(product),
      { text: ' includes rosemary, garlic, onion, and lemon peel, and can be combined with our ' },
      { text: 'balsamic vinegars', href: '/collections/balsamic' },
      { text: ' and ' },
      { text: 'olive oils', href: '/collections/olive-oils' },
      { text: '. ' },
    ];
  }
  if (product.handle === 'squirrelly-4-chile-fiesta') {
    return [
      productLink(product),
      { text: ' features toasted cumin seed, southwestern peppers, and a toasted peppercorn blend. ' },
    ];
  }
  return [productLink(product), { text: '. ' }];
}

function spiceIntro(products: CatalogProduct[]): InlinePart[] {
  const parts: InlinePart[] = [
    { text: 'Handcrafted artisan spice blends, made in small batches in Marietta, Georgia. ' },
  ];
  for (const product of products) parts.push(...spiceSentence(product));
  return withAlsoShop(parts, 'spice-blends');
}

function oliveLede(products: CatalogProduct[]): string {
  const infused = products.some((product) => /infused/i.test(`${product.title} ${product.description}`));
  if (infused) return 'Small-batch extra virgin olive oil from Marietta, Georgia, including infused olive oils.';
  return 'Small-batch extra virgin olive oil from Marietta, Georgia.';
}

function balsamicLede(products: CatalogProduct[]): string {
  const traditional = products.some((product) => /12 year aged/i.test(product.description));
  const white = products.some((product) => /10 year aged/i.test(product.description));
  if (traditional && white) {
    return 'Balsamic vinegar bottled and infused in small batches in Marietta, Georgia, including 12 year and 10 year aged balsamic.';
  }
  return 'Balsamic vinegar bottled and infused in small batches in Marietta, Georgia.';
}

const COLLECTION_PAGE: Record<string, {
  h1: string;
  lede: (products: CatalogProduct[]) => string;
  keywords: string[];
  description: (products: CatalogProduct[]) => string;
  intro: (products: CatalogProduct[]) => InlinePart[];
}> = {
  'olive-oils': {
    h1: 'Small-Batch Infused Olive Oils',
    lede: oliveLede,
    keywords: [
      'infused olive oil',
      'infused extra virgin olive oil',
      'small batch olive oil',
      'garlic infused olive oil',
      'infused olive oil georgia',
    ],
    description: oliveDescription,
    intro: oliveIntro,
  },
  balsamic: {
    h1: 'Aged Balsamic Vinegar',
    lede: balsamicLede,
    keywords: ['aged balsamic vinegar'],
    description: balsamicDescription,
    intro: balsamicIntro,
  },
  'spice-blends': {
    h1: 'Handcrafted Spice Blends',
    lede: () => 'Handcrafted artisan spice blends, made in small batches in Marietta, Georgia.',
    keywords: ['handcrafted spice blends', 'artisan spice blends'],
    description: spiceDescription,
    intro: spiceIntro,
  },
};

export function buildCollectionSeo(handle: string, products: CatalogProduct[]): CollectionSeo | null {
  const page = COLLECTION_PAGE[handle];
  if (!page) return null;
  return {
    handle,
    title: `${page.h1}${BRAND_SUFFIX}`,
    h1: page.h1,
    lede: page.lede(products),
    description: page.description(products),
    keywords: page.keywords,
    intro: page.intro(products),
  };
}

export interface ProductOfferInput {
  priceAmount?: string | null;
  priceCurrency?: string | null;
  available?: boolean | null;
  sku?: string | null;
}

/** Product JSON-LD. Price and availability are included only when Shopify already has them. */
export function buildProductJsonLd(input: {
  title: string;
  description: string;
  url: string;
  images: string[];
  category?: string | null;
  offer?: ProductOfferInput | null;
}): Record<string, unknown> {
  const description = input.description.replace(/\s+/g, ' ').trim();
  const images = input.images.filter((url) => url.trim().length > 0);
  const amount = input.offer?.priceAmount?.trim() ?? '';
  const price = amount !== '' && Number.isFinite(Number(amount)) ? Number(amount).toFixed(2) : null;
  const currency = input.offer?.priceCurrency?.trim() || null;
  const offer = price && currency
    ? {
        '@type': 'Offer',
        url: input.url,
        price,
        priceCurrency: currency,
        ...(typeof input.offer?.available === 'boolean'
          ? { availability: input.offer.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
          : {}),
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@id': `${SITE_URL}/#organization` },
      }
    : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${input.url}#product`,
    name: input.title,
    ...(description ? { description } : {}),
    ...(images.length ? { image: images.length === 1 ? images[0] : images } : {}),
    url: input.url,
    ...(input.offer?.sku ? { sku: input.offer.sku } : {}),
    brand: { '@type': 'Brand', name: SITE_NAME },
    ...(input.category ? { category: input.category } : {}),
    ...(offer ? { offers: offer } : {}),
  };
}
