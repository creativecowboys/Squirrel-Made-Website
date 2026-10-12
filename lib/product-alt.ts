import { SITE_NAME } from '@/lib/site';

/** Prefer Shopify's alt text. Otherwise describe the product, not an imagined scene. */
export function productImageAlt(
  title: string,
  altText: string | null | undefined,
  collectionHandle?: string | null,
): string {
  const provided = altText?.replace(/\s+/g, ' ').trim();
  if (provided) return provided;
  if (collectionHandle === 'olive-oils') {
    return `${title}, small-batch extra virgin olive oil from ${SITE_NAME}`;
  }
  if (collectionHandle === 'balsamic') {
    return `${title}, balsamic vinegar from ${SITE_NAME}`;
  }
  if (collectionHandle === 'spice-blends') {
    return `${title}, handcrafted spice blend from ${SITE_NAME}`;
  }
  return `${title} from ${SITE_NAME}`;
}
