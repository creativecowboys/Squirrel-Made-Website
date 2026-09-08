import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import ProductGrid from '@/components/ProductGrid';
import TrustBar from '@/components/TrustBar';
import BrandStatement from '@/components/BrandStatement';
import NewsletterSignup from '@/components/NewsletterSignup';
import Footer from '@/components/Footer';
import { fetchCollections, CollectionGroup } from '@/lib/shopify';
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '@/lib/site';

// Must be a literal (Next requirement) — keep in sync with CATALOG_REVALIDATE_SECONDS in lib/shopify.ts.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, url: '/' },
};

export default async function HomePage() {
  let collections: CollectionGroup[] = [];
  let error: string | null = null;
  try {
    collections = await fetchCollections();
  } catch (err) {
    console.error('[home] Shopify fetch failed:', err);
    error = 'Unable to load products. Please refresh and try again.';
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Ticker />
        <div id="products">
          <ProductGrid collections={collections} error={error} />
        </div>
        <BrandStatement />
        <TrustBar />
        <NewsletterSignup />
        <Ticker />
      </main>
      <Footer />
    </div>
  );
}
