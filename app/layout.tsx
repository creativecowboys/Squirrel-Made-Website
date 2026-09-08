import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, CONTACT } from '@/lib/site';
import AnnouncementBar from '@/components/AnnouncementBar';
import CartDrawer from '@/components/CartDrawer';
import MetaPixel from '@/components/MetaPixel';
import JsonLd from '@/components/JsonLd';
import { PIXEL_ID } from '@/lib/tracking';

// Body font, self-hosted by Next (the old site loaded it from fonts.googleapis.com).
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

// FONT NOTE: the old site also loaded Playfair Display and set `.font-serif` to it, but the
// Tailwind play CDN injected its own `.font-serif` rule *after* that override, so headings
// actually rendered in the browser's default serif (Georgia on Mac/Windows). We match what
// visitors see today. To switch headings to Playfair Display:
//   1. import { Playfair_Display } from 'next/font/google' and create it like `inter` above
//      with variable: '--font-playfair', style: ['normal', 'italic'];
//   2. add its .variable to the <html> className below;
//   3. in tailwind.config.ts set fontFamily.serif to ['var(--font-playfair)', 'serif'].

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const GSC_TOKEN = process.env.NEXT_PUBLIC_GSC_TOKEN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: '/',
    images: [{ url: DEFAULT_OG_IMAGE, width: 640, height: 640, alt: 'Fresh organic ingredients - basil, garlic, tomatoes, and olives on rustic cutting board' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  // Google Search Console HTML-tag verification. Set NEXT_PUBLIC_GSC_TOKEN in Vercel
  // to the content="" value Search Console gives you; leave unset to omit the tag.
  verification: GSC_TOKEN ? { google: GSC_TOKEN } : undefined,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: CONTACT.city,
    addressRegion: CONTACT.region,
    addressCountry: 'US',
  },
  sameAs: [CONTACT.instagram],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }} className={inter.variable}>
      <body className="bg-[#f5f2ed] text-[#2c3a2e] selection:bg-[#4a5d4e] selection:text-white">
        {/* Facebook Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <CartProvider>
          {children}

          {/* Announcement Bar — persists across all routes */}
          <AnnouncementBar />

          {/* Cart Drawer — persists across all routes */}
          <CartDrawer />
        </CartProvider>

        {/* Site-wide structured data */}
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />

        {/* Meta Pixel (PageView on load + on every client-side route change) */}
        <MetaPixel />

        {/* Google Analytics (GA4) — INACTIVE until NEXT_PUBLIC_GA4_ID is set in Vercel.
            To turn on: create a GA4 property, add its Measurement ID (G-XXXXXXXXXX) as
            NEXT_PUBLIC_GA4_ID in the Vercel project's environment variables, redeploy. */}
        {GA4_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');
              `}
            </Script>
          </>
        )}
        {/* End Google Analytics */}

        {/* Vercel Web Analytics — tracks page views & visitors across all routes */}
        <Analytics />
      </body>
    </html>
  );
}
