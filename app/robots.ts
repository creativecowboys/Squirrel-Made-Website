import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Note: never disallow /_next/ — Google needs the JS/CSS to render the pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
