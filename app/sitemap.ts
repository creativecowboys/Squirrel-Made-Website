import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { fetchProductHandles, fetchCollections } from '@/lib/shopify';

// Must be a literal (Next requirement) — keep in sync with CATALOG_REVALIDATE_SECONDS in lib/shopify.ts.
export const revalidate = 3600;

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/our-story', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/our-promise', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/find-a-retailer', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/wholesale', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  let collectionEntries: MetadataRoute.Sitemap = [];
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const [collections, products] = await Promise.all([fetchCollections(), fetchProductHandles()]);
    collectionEntries = collections.map((c) => ({
      url: `${SITE_URL}/collections/${c.handle}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    productEntries = products.map((p) => ({
      url: `${SITE_URL}/products/${p.handle}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('[sitemap] Shopify fetch failed:', err);
  }

  return [...staticEntries, ...collectionEntries, ...productEntries];
}
