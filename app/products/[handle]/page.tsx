import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import ProductCard from '@/components/ProductCard';
import ProductPurchase from '@/components/ProductPurchase';
import ViewContentTracker from '@/components/ViewContentTracker';
import { COLLECTION_COLORS, DEFAULT_COLLECTION_COLORS } from '@/components/collection-styles';
import {
  fetchProductByHandle,
  fetchProductHandles,
  fetchCollectionByHandle,
  storefrontCollectionOf,
  getPurchaseInfo,
} from '@/lib/shopify';
import { SITE_URL, absoluteUrl } from '@/lib/site';
import {
  productSeoTitle,
  productSeoDescription,
  buildProductJsonLd,
  collectionAnchor,
  COLLECTION_NAV,
} from '@/lib/catalog-seo';
import ShopCategoryLinks from '@/components/ShopCategoryLinks';
import { productImageAlt } from '@/lib/product-alt';

// Must be a literal (Next requirement) — keep in sync with CATALOG_REVALIDATE_SECONDS in lib/shopify.ts.
export const revalidate = 3600;
// Products added to Shopify after the last build still get a page (rendered on first request).
export const dynamicParams = true;

type Params = { handle: string };

export async function generateStaticParams(): Promise<Params[]> {
  const products = await fetchProductHandles();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await fetchProductByHandle(handle);
  if (!product) return { title: 'Page Not Found', robots: { index: false, follow: false } };

  const collectionRef = storefrontCollectionOf(product);
  const title = productSeoTitle(product.handle, product.title);
  const description = productSeoDescription(product.description, product.title);
  const image = product.featuredImage?.url ?? product.images.edges[0]?.node.url;
  const imageAlt = productImageAlt(product.title, product.featuredImage?.altText, collectionRef?.handle);
  const path = `/products/${product.handle}`;

  return {
    title: { absolute: title },
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      title,
      description,
      url: path,
      images: image ? [{ url: image, alt: imageAlt }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  const product = await fetchProductByHandle(handle);
  if (!product) notFound();

  const collectionRef = storefrontCollectionOf(product);
  const collection = collectionRef ? await fetchCollectionByHandle(collectionRef.handle) : null;
  const colors = (collectionRef && COLLECTION_COLORS[collectionRef.handle]) ?? DEFAULT_COLLECTION_COLORS;

  const { variant, regularPrice, available } = getPurchaseInfo(product);
  const imageUrl = product.featuredImage?.url ?? product.images.edges[0]?.node.url;
  const imageAlt = productImageAlt(product.title, product.featuredImage?.altText, collectionRef?.handle);
  const productUrl = absoluteUrl(`/products/${product.handle}`);
  const related = collection ? collection.products.filter((p) => p.id !== product.id) : [];
  const anchor = collectionAnchor(collectionRef?.handle);
  const otherCategories = COLLECTION_NAV.filter((item) => item.handle !== collectionRef?.handle);

  const productJsonLd = buildProductJsonLd({
    title: product.title,
    description: product.description,
    url: productUrl,
    images: product.images.edges.map((edge) => edge.node.url),
    category: collectionRef?.title,
    offer: variant
      ? {
          priceAmount: variant.price.amount,
          priceCurrency: variant.price.currencyCode,
          available: variant.availableForSale,
          sku: variant.sku,
        }
      : null,
  });

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      ...(collectionRef
        ? [{ '@type': 'ListItem', position: 2, name: collectionRef.title, item: absoluteUrl(`/collections/${collectionRef.handle}`) }]
        : []),
      { '@type': 'ListItem', position: collectionRef ? 3 : 2, name: product.title, item: productUrl },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
      <ViewContentTracker productId={product.id} productTitle={product.title} value={regularPrice} />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-6 pt-36 md:pt-44 pb-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#2c3a2e]/50 mb-10">
            <Link href="/" className="hover:text-[#2c3a2e] transition-colors">Home</Link>
            {collectionRef && (
              <>
                <span className="text-[#2c3a2e]/30">/</span>
                <Link href={`/collections/${collectionRef.handle}`} className="hover:text-[#2c3a2e] transition-colors">{collectionRef.title}</Link>
              </>
            )}
            <span className="text-[#2c3a2e]/30">/</span>
            <span className="text-[#2c3a2e]">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Image */}
            <div className={`relative bg-white rounded-3xl border ${colors.border} overflow-hidden shadow-sm`}>
              <div className={`h-1 w-full ${colors.dot}`} />
              <div className="relative w-full bg-[#f5f2ed] overflow-hidden aspect-square">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={imageAlt ?? product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#2c3a2e]/20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                )}
                {!available && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <span className="text-xs uppercase tracking-widest font-semibold text-[#2c3a2e]/50">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className={`inline-block text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
                  {colors.label}
                </span>
                <h1 className="text-4xl md:text-5xl font-serif italic text-[#2c3a2e] leading-tight">{product.title}</h1>
                <div className="w-12 h-0.5 bg-[#8aad6e]" />
              </div>

              {product.description && (
                <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">{product.description}</p>
              )}

              <ProductPurchase product={product} />

              {collectionRef && anchor ? (
                <p className="text-sm text-[#2c3a2e]/70 font-light leading-relaxed">
                  Part of our{' '}
                  <Link href={`/collections/${collectionRef.handle}`} className="text-[#4a7432] hover:underline">
                    {anchor}
                  </Link>
                  .
                  {otherCategories.length > 0 ? (
                    <>
                      {' '}Also browse{' '}
                      {otherCategories.map((item, index) => (
                        <span key={item.handle}>
                          {index > 0 && index === otherCategories.length - 1 ? ' and ' : null}
                          {index > 0 && index < otherCategories.length - 1 ? ', ' : null}
                          <Link href={item.href} className="text-[#4a7432] hover:underline">
                            {item.anchor}
                          </Link>
                        </span>
                      ))}
                      .
                    </>
                  ) : null}
                </p>
              ) : (
                <ShopCategoryLinks
                  navClassName="flex flex-wrap gap-x-4 gap-y-2 text-sm"
                  linkClassName="text-[#4a7432] hover:underline"
                />
              )}

              <ul className="space-y-3">
                {[
                  "No artificial flavours or colours",
                  "Made in small batches for freshness",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-[#2c3a2e]">
                    <div className="w-5 h-5 rounded-full bg-[#4a5d4e] text-[#f5f2ed] flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* More from the same collection */}
        {collection && related.length > 0 && (
          <section className="py-24 px-6 bg-[#f5f2ed]">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${colors.dot} flex-shrink-0`} />
                <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e]">
                  <Link href={`/collections/${collection.handle}`}>{collection.title}</Link>
                </h2>
                <div className="flex-1 h-px bg-[#2c3a2e]/10 ml-2" />
                <span className="text-sm text-[#2c3a2e]/40 font-medium">{collection.products.length} products</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} collectionHandle={collection.handle} />
                ))}
              </div>
              <div className="text-center pt-6">
                <Link href="/#products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#2c3a2e] hover:opacity-70 transition-opacity">
                  All Products
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
