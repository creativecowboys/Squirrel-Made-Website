import type { NextConfig } from 'next';

// Shopify Storefront config. Preferred names are NEXT_PUBLIC_*; the VITE_* names
// are what the old Vite build used and are already set in the Vercel project, so
// we fall back to them until the NEXT_PUBLIC_* vars are added there.
const SHOPIFY_STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? process.env.VITE_SHOPIFY_STORE_DOMAIN ?? '';
const SHOPIFY_STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? process.env.VITE_SHOPIFY_STOREFRONT_TOKEN ?? '';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: SHOPIFY_STOREFRONT_TOKEN,
  },
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      // Old Square Online URL that still gets Search Console impressions.
      { source: '/contact-us', destination: '/contact', statusCode: 301 },
      // Other Square-era paths (Square's default shop/about/legal slugs). Best-effort
      // guesses; harmless if they were never used.
      { source: '/about', destination: '/our-story', statusCode: 301 },
      { source: '/about-us', destination: '/our-story', statusCode: 301 },
      { source: '/privacy-policy', destination: '/privacy', statusCode: 301 },
      { source: '/terms-of-service', destination: '/terms', statusCode: 301 },
      { source: '/shop', destination: '/', statusCode: 301 },
      { source: '/s/shop', destination: '/', statusCode: 301 },
      { source: '/s/order', destination: '/', statusCode: 301 },
      { source: '/product/:path*', destination: '/', statusCode: 301 },
    ];
  },
};

export default nextConfig;
