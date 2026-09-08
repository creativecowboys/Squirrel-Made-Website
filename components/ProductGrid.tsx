'use client';

// Homepage "Stock Your Pantry" grid. Collections are fetched on the server
// (app/page.tsx) and passed in, so the product names, prices and links are in
// the HTML Google sees; the category tabs and Add to Cart hydrate on the client.

import React, { useState } from 'react';
import Link from 'next/link';
import { CollectionGroup } from '@/lib/shopify';
import ProductCard from './ProductCard';
import { COLLECTION_COLORS, COLLECTION_ICONS, ALL_ICON } from './collection-styles';

// ─── Category Section ─────────────────────────────────────────────────────────

interface CategorySectionProps {
  collection: CollectionGroup;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ collection }) => {
  const colors = COLLECTION_COLORS[collection.handle] ?? { dot: 'bg-[#2c3a2e]' };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${colors.dot} flex-shrink-0`} />
        <h3 className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e]">
          <Link href={`/collections/${collection.handle}`}>{collection.title}</Link>
        </h3>
        <div className="flex-1 h-px bg-[#2c3a2e]/10 ml-2" />
        <span className="text-sm text-[#2c3a2e]/40 font-medium">{collection.products.length} products</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {collection.products.map((p) => (
          <ProductCard key={p.id} product={p} collectionHandle={collection.handle} />
        ))}
      </div>
    </div>
  );
};

// ─── ProductGrid ──────────────────────────────────────────────────────────────

interface ProductGridProps {
  collections: CollectionGroup[];
  error?: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ collections, error = null }) => {
  const [activeHandle, setActiveHandle] = useState<string>('all');

  const totalCount = collections.reduce((s, c) => s + c.products.length, 0);
  const activeCollections = activeHandle === 'all' ? collections : collections.filter((c) => c.handle === activeHandle);
  const filteredCount = activeCollections.reduce((s, c) => s + c.products.length, 0);

  return (
    <section className="py-24 px-6 bg-[#f5f2ed]">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#2c3a2e]/50">Full Collection</span>
          <h2 className="text-4xl md:text-6xl font-serif italic text-[#2c3a2e]">Stock Your Pantry</h2>
          <p className="text-base text-[#2c3a2e]/60 max-w-lg mx-auto font-light leading-relaxed">
            Every product is crafted with clean, natural ingredients — no fillers, no nonsense.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-[#2c3a2e]/60 text-sm">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2.5 bg-[#2c3a2e] text-[#f5f2ed] rounded-full text-sm font-semibold hover:bg-[#4a5d4e] transition-colors">Retry</button>
          </div>
        )}

        {/* Category Tabs */}
        {!error && collections.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveHandle('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${activeHandle === 'all' ? 'bg-[#2c3a2e] text-[#f5f2ed] border-[#2c3a2e] shadow-md' : 'bg-white text-[#2c3a2e] border-[#2c3a2e]/15 hover:border-[#2c3a2e]/40 hover:shadow-sm'}`}
            >
              {ALL_ICON} All Products
            </button>
            {collections.map((col) => (
              <button
                key={col.handle}
                onClick={() => setActiveHandle(col.handle)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${activeHandle === col.handle ? 'bg-[#2c3a2e] text-[#f5f2ed] border-[#2c3a2e] shadow-md' : 'bg-white text-[#2c3a2e] border-[#2c3a2e]/15 hover:border-[#2c3a2e]/40 hover:shadow-sm'}`}
              >
                {COLLECTION_ICONS[col.handle]}
                {col.title}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        {!error && (
          <div className="space-y-16">
            {activeCollections.map((col) => (
              <CategorySection key={col.handle} collection={col} />
            ))}
          </div>
        )}

        {/* Footer count */}
        {!error && (
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-[#2c3a2e]/40">
              {filteredCount} of {totalCount} products
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
