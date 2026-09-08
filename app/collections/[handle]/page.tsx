import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import ProductCard from '@/components/ProductCard';
import { COLLECTION_COLORS, COLLECTION_ICONS, DEFAULT_COLLECTION_COLORS } from '@/components/collection-styles';
import { fetchCollectionByHandle, STOREFRONT_COLLECTION_HANDLES } from '@/lib/shopify';
import { SITE_URL, SITE_NAME, absoluteUrl } from '@/lib/site';

// Must be a literal (Next requirement) — keep in sync with CATALOG_REVALIDATE_SECONDS in lib/shopify.ts.
export const revalidate = 3600;
// Only the three storefront collections get pages; anything else is a 404.
export const dynamicParams = false;

type Params = { handle: string };

export function generateStaticParams(): Params[] {
  return STOREFRONT_COLLECTION_HANDLES.map((handle) => ({ handle }));
}

function describe(title: string, count: number): string {
  // Collections have no description in Shopify; this is the minimum factual line
  // (product count + the "small-batch" / "Marietta, Georgia" facts from the site copy).
  return `Shop ${SITE_NAME} ${title}: ${count} small-batch products, bottled and infused in Marietta, Georgia.`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { handle } = await params;
  const collection = await fetchCollectionByHandle(handle);
  if (!collection) return { title: 'Page Not Found' };

  const description = collection.description || describe(collection.title, collection.products.length);
  const image = collection.products[0]?.featuredImage?.url;
  const path = `/collections/${collection.handle}`;

  return {
    title: collection.title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', title: collection.title, description, url: path, images: image ? [{ url: image }] : undefined },
  };
}

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  if (!(STOREFRONT_COLLECTION_HANDLES as readonly string[]).includes(handle)) notFound();
  const collection = await fetchCollectionByHandle(handle);
  if (!collection) notFound();

  const colors = COLLECTION_COLORS[collection.handle] ?? DEFAULT_COLLECTION_COLORS;
  const collectionUrl = absoluteUrl(`/collections/${collection.handle}`);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${collectionUrl}#collection`,
    name: collection.title,
    url: collectionUrl,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: collection.products.length,
      itemListElement: collection.products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: absoluteUrl(`/products/${p.handle}`),
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: collection.title, item: collectionUrl },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />
      <JsonLd data={[collectionJsonLd, breadcrumbJsonLd]} />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center pt-28 px-6 overflow-hidden bg-[#2c3a2e]">
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f5f2ed' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-[#f5f2ed] space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8aad6e]">Full Collection</span>
          <h1 className="text-5xl md:text-7xl font-serif italic">{collection.title}</h1>
          <p className="text-[#f5f2ed]/70 text-lg font-light max-w-xl mx-auto leading-relaxed">
            Every product is crafted with clean, natural ingredients — no fillers, no nonsense.
          </p>
          <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
        </div>
      </section>

      <main className="flex-grow">
        <section className="py-24 px-6 bg-[#f5f2ed]">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#2c3a2e]/50">
              <Link href="/" className="hover:text-[#2c3a2e] transition-colors">Home</Link>
              <span className="text-[#2c3a2e]/30">/</span>
              <span className="text-[#2c3a2e]">{collection.title}</span>
            </nav>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${colors.dot} flex-shrink-0`} />
                <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e] flex items-center gap-3">
                  {COLLECTION_ICONS[collection.handle]}
                  {collection.title}
                </h2>
                <div className="flex-1 h-px bg-[#2c3a2e]/10 ml-2" />
                <span className="text-sm text-[#2c3a2e]/40 font-medium">{collection.products.length} products</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {collection.products.map((p) => (
                  <ProductCard key={p.id} product={p} collectionHandle={collection.handle} />
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link href="/#products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#2c3a2e] hover:opacity-70 transition-opacity">
                All Products
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
