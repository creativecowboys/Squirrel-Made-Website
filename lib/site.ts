// Site-wide constants used by metadata, JSON-LD, robots and sitemap.

export const SITE_URL = 'https://www.squirrelmadeproducts.com';
export const SITE_NAME = 'Squirrel Made Products';
export const DEFAULT_TITLE = 'Squirrel Made Products | Real Ingredients. Nothing Hidden.';
// Verbatim from the homepage hero paragraph.
export const DEFAULT_DESCRIPTION =
  'Small-batch olive oils, balsamic vinegars, and spice blends — made the way food should be. Clean, natural, and crafted with care.';
export const DEFAULT_OG_IMAGE = '/hero-ingredients.png';

export const CONTACT = {
  email: 'squirrelmadeproducts@gmail.com',
  phone: '+1-404-312-6810',
  phoneDisplay: '(404) 312-6810',
  city: 'Marietta',
  region: 'GA',
  instagram: 'https://www.instagram.com/squirrelmadeproducts',
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
