import React, { useState, useCallback, useEffect } from 'react';
import {
  fetchCollections,
  addToCart,
  getOrCreateCart,
  CollectionGroup,
  ShopifyProduct,
  ShopifyCart,
} from '../src/shopify';
import { trackAddToCart } from '../src/tracking';

// ─── Visual config ────────────────────────────────────────────────────────────

const COLLECTION_COLORS: Record<string, { dot: string; badge: string; border: string; label: string }> = {
  'olive-oils': { dot: 'bg-[#8aad6e]', badge: 'bg-[#8aad6e]/15 text-[#4a7432]', border: 'border-[#8aad6e]/40', label: 'Olive Oil' },
  'balsamic':   { dot: 'bg-[#7b3f5e]', badge: 'bg-[#7b3f5e]/15 text-[#7b3f5e]', border: 'border-[#7b3f5e]/40', label: 'Balsamic' },
  'spice-blends': { dot: 'bg-[#b45309]', badge: 'bg-[#b45309]/15 text-[#b45309]', border: 'border-[#b45309]/40', label: 'Spice Blend' },
};

const COLLECTION_ICONS: Record<string, React.ReactNode> = {
  'olive-oils': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7-5 11a5 5 0 0 0 10 0c0-4-3.8-5.6-5-11Z" />
    </svg>
  ),
  'balsamic': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3ZM7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8H7Z" />
    </svg>
  ),
  'spice-blends': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  ),
};

const ALL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const ProductSkeleton: React.FC = () => (
  <div className="flex flex-col bg-white rounded-2xl border border-[#2c3a2e]/10 overflow-hidden animate-pulse">
    <div className="h-1 w-full bg-[#2c3a2e]/10" />
    <div className="w-full bg-[#f5f2ed]" style={{ aspectRatio: '4/3' }} />
    <div className="flex flex-col flex-1 p-6 gap-4">
      <div className="h-5 w-20 rounded-full bg-[#2c3a2e]/10" />
      <div className="h-6 w-3/4 rounded-lg bg-[#2c3a2e]/10" />
      <div className="flex items-center justify-between pt-2 border-t border-[#2c3a2e]/8">
        <div className="h-8 w-16 rounded-lg bg-[#2c3a2e]/10" />
        <div className="h-8 w-28 rounded-full bg-[#2c3a2e]/10" />
      </div>
    </div>
  </div>
);

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: ShopifyProduct;
  collectionHandle: string;
  onAddToCart: (variantId: string, sellingPlanId?: string) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, collectionHandle, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');

  const colors = COLLECTION_COLORS[collectionHandle] ?? {
    dot: 'bg-[#2c3a2e]', badge: 'bg-[#2c3a2e]/10 text-[#2c3a2e]', border: 'border-[#2c3a2e]/20', label: 'Product',
  };

  const variant = product.variants.edges[0]?.node;
  const imageUrl = product.featuredImage?.url ?? product.images.edges[0]?.node.url;
  const imageAlt = product.featuredImage?.altText ?? product.title;
  const regularPrice = variant ? parseFloat(variant.price.amount) : 0;
  const available = variant?.availableForSale ?? false;

  // Subscription checking
  const sellingPlanGroup = product.sellingPlanGroups?.edges[0]?.node;
  const sellingPlan = sellingPlanGroup?.sellingPlans.edges[0]?.node;
  const sellingPlanId = sellingPlan?.id;
  const discountPercentage = sellingPlan?.priceAdjustments?.[0]?.adjustmentValue?.adjustmentPercentage ?? 0;
  const hasSubscription = !!sellingPlanId;
  const subDiscount = discountPercentage > 0 ? discountPercentage : (hasSubscription ? 15 : 0);
  const subscriptionPrice = regularPrice * (1 - subDiscount / 100);

  const handleAdd = useCallback(async () => {
    if (!variant || loading) return;
    setLoading(true);
    try {
      await onAddToCart(
        variant.id,
        purchaseType === 'subscription' ? sellingPlanId : undefined
      );
      trackAddToCart({
        productId: product.id,
        productTitle: product.title,
        value: purchaseType === 'subscription' ? subscriptionPrice : regularPrice,
        isSubscription: purchaseType === 'subscription',
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setLoading(false);
    }
  }, [variant, onAddToCart, loading, purchaseType, sellingPlanId, product, regularPrice, subscriptionPrice]);

  return (
    <div className={`group relative flex flex-col bg-white rounded-2xl border ${colors.border} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      <div className={`h-1 w-full ${colors.dot}`} />

      <div className="relative w-full bg-[#f5f2ed] overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt ?? product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
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

      <div className="flex flex-col flex-1 p-6 gap-4">
        <span className={`self-start text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
          {colors.label}
        </span>
        <h3 className="text-lg font-serif italic text-[#2c3a2e] leading-tight flex-1">
          {product.title}
        </h3>

        {/* Purchase option selector */}
        {hasSubscription && available && (
          <div className="flex flex-col gap-2 mt-1">
            <div className="bg-[#f5f2ed]/70 rounded-xl p-1 border border-[#2c3a2e]/10 flex gap-1">
              <button
                type="button"
                onClick={() => setPurchaseType('one-time')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  purchaseType === 'one-time'
                    ? 'bg-[#2c3a2e] text-[#f5f2ed] shadow-sm'
                    : 'text-[#2c3a2e]/60 hover:text-[#2c3a2e] hover:bg-[#2c3a2e]/5'
                }`}
              >
                One-Time
              </button>
              <button
                type="button"
                onClick={() => setPurchaseType('subscription')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider relative flex items-center justify-center gap-1.5 transition-all duration-200 ${
                  purchaseType === 'subscription'
                    ? 'bg-[#8aad6e] text-white shadow-sm'
                    : 'text-[#2c3a2e]/60 hover:text-[#2c3a2e] hover:bg-[#2c3a2e]/5'
                }`}
              >
                <span>Subscribe</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-normal ${
                  purchaseType === 'subscription' ? 'bg-white text-[#8aad6e]' : 'bg-[#b45309]/15 text-[#b45309]'
                }`}>
                  -{subDiscount}%
                </span>
              </button>
            </div>
            {purchaseType === 'subscription' && (
              <p className="text-[10px] text-[#2c3a2e]/50 italic text-center mt-0.5 flex items-center justify-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 flex-shrink-0 text-[#8aad6e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Delivered monthly. Cancel or skip anytime.
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#2c3a2e]/8">
          <div className="flex flex-col">
            {purchaseType === 'subscription' && hasSubscription ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-serif font-bold text-[#8aad6e]">${subscriptionPrice.toFixed(2)}</span>
                <span className="text-sm font-sans line-through text-[#2c3a2e]/40">${regularPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-2xl font-serif font-bold text-[#2c3a2e]">${regularPrice.toFixed(2)}</span>
            )}
            {purchaseType === 'subscription' && hasSubscription && (
              <span className="text-[9px] uppercase tracking-wider text-[#8aad6e] font-bold -mt-0.5">Monthly</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!available || loading}
            aria-label={`Add ${product.title} to cart`}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              added ? 'bg-[#8aad6e] text-white' : 'bg-[#2c3a2e] text-[#f5f2ed] hover:bg-[#4a5d4e]'
            }`}
          >
            {loading ? (
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : added ? (
              <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>Added!</>
            ) : (
              <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Category Section ─────────────────────────────────────────────────────────

interface CategorySectionProps {
  collection: CollectionGroup;
  onAddToCart: (variantId: string, sellingPlanId?: string) => Promise<void>;
}

const CategorySection: React.FC<CategorySectionProps> = ({ collection, onAddToCart }) => {
  const colors = COLLECTION_COLORS[collection.handle] ?? { dot: 'bg-[#2c3a2e]' };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${colors.dot} flex-shrink-0`} />
        <h3 className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e]">{collection.title}</h3>
        <div className="flex-1 h-px bg-[#2c3a2e]/10 ml-2" />
        <span className="text-sm text-[#2c3a2e]/40 font-medium">{collection.products.length} products</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {collection.products.map((p) => (
          <ProductCard key={p.id} product={p} collectionHandle={collection.handle} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

// ─── ProductGrid ──────────────────────────────────────────────────────────────

interface ProductGridProps {
  cart: ShopifyCart | null;
  onCartUpdate: (cart: ShopifyCart) => void;
  onCartOpen: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ cart, onCartUpdate, onCartOpen }) => {
  const [collections, setCollections] = useState<CollectionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHandle, setActiveHandle] = useState<string>('all');

  const load = () => {
    setLoading(true);
    setError(null);
    fetchCollections()
      .then(setCollections)
      .catch(() => setError('Unable to load products. Please refresh and try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const totalCount = collections.reduce((s, c) => s + c.products.length, 0);
  const activeCollections = activeHandle === 'all' ? collections : collections.filter((c) => c.handle === activeHandle);
  const filteredCount = activeCollections.reduce((s, c) => s + c.products.length, 0);

  const handleAddToCart = useCallback(async (variantId: string, sellingPlanId?: string) => {
    let currentCart = cart;
    if (!currentCart) {
      currentCart = await getOrCreateCart();
      onCartUpdate(currentCart);
    }
    const updated = await addToCart(currentCart.id, variantId, 1, sellingPlanId);
    onCartUpdate(updated);
    onCartOpen();
  }, [cart, onCartUpdate, onCartOpen]);

  return (
    <section id="products" className="py-24 px-6 bg-[#f5f2ed]">
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
            <button onClick={load} className="mt-4 px-6 py-2.5 bg-[#2c3a2e] text-[#f5f2ed] rounded-full text-sm font-semibold hover:bg-[#4a5d4e] transition-colors">Retry</button>
          </div>
        )}

        {/* Category Tabs */}
        {!error && !loading && collections.length > 0 && (
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

        {/* Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <div className="space-y-16">
            {activeCollections.map((col) => (
              <CategorySection key={col.handle} collection={col} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

        {/* Footer count */}
        {!loading && !error && (
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
