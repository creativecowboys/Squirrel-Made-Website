
import React, { useState, useCallback } from 'react';
import { CartItem, addToCart } from '../src/cart';

interface CatalogProduct {
  id: number;
  category: string;
  name: string;
  price: number; // stored as number now (was string)
  image: string;
  catalogObjectId: string; // Square Catalog Object ID
  type: 'bottle' | 'bag';  // for shipping tier logic
}

const CATALOG: CatalogProduct[] = [
  { id: 1,  category: 'Extra Virgin Olive Oils & Infusions',          name: 'Extra Virgin Olive Oil Spanish',                              price: 20.00, type: 'bottle', catalogObjectId: 'TRAAE3UBZXRLXBBJLODF3JCS', image: '/Product Images/banana-batch-c7bc77d3-beac-44d5-bf93-fad503224061.png' },
  { id: 2,  category: 'Extra Virgin Olive Oils & Infusions',          name: 'Basil Infused Extra Virgin Olive Oil',                        price: 21.00, type: 'bottle', catalogObjectId: '44XCIPW4VZSW3Z4AZBWAEUBD', image: '/Product Images/banana-batch-1d1e8870-be1a-4c47-a641-dc4d5ab8fa9c.png' },
  { id: 3,  category: 'Extra Virgin Olive Oils & Infusions',          name: 'Garlic Infused Extra Virgin Olive Oil',                       price: 21.00, type: 'bottle', catalogObjectId: 'FVV6UAIKSQQFIKIOR75VK5OE', image: '/Product Images/banana-batch-b136802e-75e9-49cc-b12b-7d87e1aa4b66.png' },
  { id: 4,  category: 'Extra Virgin Olive Oils & Infusions',          name: 'Black Truffle Extra Virgin Olive Oil',                        price: 26.00, type: 'bottle', catalogObjectId: '5S53TD6Q3TYZWQYOGFPQMRXK', image: '/Product Images/banana-batch-c0055bd5-940a-41c1-9d87-934f20374ad7.png' },
  { id: 5,  category: 'Extra Virgin Olive Oils & Infusions',          name: 'Hatch Green Chili Extra Virgin Olive Oil',                    price: 21.00, type: 'bottle', catalogObjectId: 'PXNFO7YLPBIZY66P3G5MBBOK', image: '/Product Images/banana-batch-4236deba-4640-47d0-b87a-1367cd2bff9f.png' },
  { id: 6,  category: 'Extra Virgin Olive Oils & Infusions',          name: 'Meyer Lemon Extra Virgin Olive Oil',                          price: 21.00, type: 'bottle', catalogObjectId: 'PJT7KFXFZEAWDR3NNNVEWEUX', image: '/Product Images/banana-batch-50f3fe7d-b4c9-4600-82cf-4779648bb356.png' },
  { id: 7,  category: 'Traditional Balsamic Vinegars & Infusions',    name: '25 Star Traditional Balsamic Vinegar',                        price: 20.00, type: 'bottle', catalogObjectId: 'ZSCN5QKGCBR72RSZROTUBJKS', image: '/Product Images/banana-batch-71089f9f-41c9-4d76-8b0c-41e91c1a90e9.png' },
  { id: 8,  category: 'Traditional Balsamic Vinegars & Infusions',    name: 'Cranberry Infused 25 Star Traditional Balsamic Vinegar',      price: 21.00, type: 'bottle', catalogObjectId: 'LYXOUL5PQKA7TODAUYFAJJI5', image: '/Product Images/banana-batch-16e351c3-8a1a-4d7a-9125-8044acfb6bbd.png' },
  { id: 9,  category: 'Traditional Balsamic Vinegars & Infusions',    name: 'Chocolate Infused 25 Star Traditional Balsamic Vinegar',      price: 21.00, type: 'bottle', catalogObjectId: 'VPXBM5J6MXCDAWA36BRZ4KNH', image: '/Product Images/banana-batch-fa0f28ed-793d-4d2d-8b2c-df5add805c23.png' },
  { id: 10, category: 'Traditional Balsamic Vinegars & Infusions',    name: 'Plum Infused 25 Star Traditional Balsamic Vinegar',           price: 21.00, type: 'bottle', catalogObjectId: '2SDEMFNJOPT6IB4Q7UQ3XHNS', image: '/Product Images/banana-batch-ed223ec6-9cf8-4c80-b49f-5d1c1472d3da.png' },
  { id: 11, category: 'Traditional Balsamic Vinegars & Infusions',    name: 'Raspberry Infused 25 Star Traditional Balsamic Vinegar',      price: 21.00, type: 'bottle', catalogObjectId: '4UEN4UGG6SGSJXOA7PRHQVCF', image: '/Product Images/banana-batch-0c48bcdd-2d47-4e86-8ae3-4fa893908358.png' },
  { id: 12, category: 'White Balsamic Vinegars & Infusions',          name: '25 Star White Balsamic Vinegar',                              price: 20.00, type: 'bottle', catalogObjectId: 'IFS5FTHQTPDFMNFKO72IJZZC', image: '/Product Images/banana-batch-2318a688-c720-4611-a952-e11b0e95595b.png' },
  { id: 13, category: 'White Balsamic Vinegars & Infusions',          name: 'Blood Orange Infused 25 Star White Balsamic Vinegar',         price: 21.00, type: 'bottle', catalogObjectId: 'UWKUGGEX3TP4UKYHJHHLH2U2', image: '/Product Images/banana-batch-9d43f6f6-6dfe-420c-87c9-7f0857184a71.png' },
  { id: 14, category: 'White Balsamic Vinegars & Infusions',          name: 'Chipotle Lime Infused 25 Star White Balsamic Vinegar',        price: 21.00, type: 'bottle', catalogObjectId: 'YHP5YBLEGLPGQOICMOLVRRQL', image: '/Product Images/banana-batch-8bf75ed6-cb01-4b95-a5b6-8d363efc84a8.png' },
  { id: 15, category: 'White Balsamic Vinegars & Infusions',          name: 'Meyer Lemon Infused 25 Star White Balsamic Vinegar',          price: 21.00, type: 'bottle', catalogObjectId: 'SASXTNY2VJH3VW6TGPILDHDD', image: '/Product Images/banana-batch-2fe90beb-b8b5-43fa-b16e-2ad3f030a19f.png' },
  { id: 19, category: 'White Balsamic Vinegars & Infusions',          name: 'Peach Infused 25 Star White Balsamic Vinegar',               price: 21.00, type: 'bottle', catalogObjectId: 'IVH23EW3G6SKXYWWYHTCUZER', image: '/Peach Balsamic Vinegar.png' },
  { id: 16, category: 'Squirrelly Spice Blends',                      name: "Chef Squirrel's Blend",                                      price: 12.00, type: 'bag',    catalogObjectId: 'ALS2OZUV46IJIFMDNO4V4QE4', image: '/Product Images/banana-batch-a3b69942-e753-4826-8fb9-53cf7775daeb.png' },
  { id: 17, category: 'Squirrelly Spice Blends',                      name: 'Mediterranean Squirrel',                                     price: 12.00, type: 'bag',    catalogObjectId: '3SQSN2B4AYL4N77P2H7463A7', image: '/Product Images/banana-batch-b1b838cb-afe7-4a3c-9734-48904b5f2efe.png' },
  { id: 18, category: 'Squirrelly Spice Blends',                      name: 'Squirrelly 4 Chile Fiesta',                                  price: 12.00, type: 'bag',    catalogObjectId: 'WLVG2G4I342NVOYLXAFKUUX6', image: '/Product Images/banana-batch-4f4e19c9-79bb-429a-aa51-ef6283d7031c.png' },
];

const CATEGORIES = ['All', ...Array.from(new Set(CATALOG.map(p => p.category)))];

// Category accent colors
const CATEGORY_COLORS: Record<string, { dot: string; badge: string; border: string }> = {
  'Extra Virgin Olive Oils & Infusions': { dot: 'bg-[#8aad6e]', badge: 'bg-[#8aad6e]/15 text-[#4a7432]', border: 'border-[#8aad6e]/40' },
  'Traditional Balsamic Vinegars & Infusions': { dot: 'bg-[#7b3f5e]', badge: 'bg-[#7b3f5e]/15 text-[#7b3f5e]', border: 'border-[#7b3f5e]/40' },
  'White Balsamic Vinegars & Infusions': { dot: 'bg-[#c4a46b]', badge: 'bg-[#c4a46b]/20 text-[#7a5c20]', border: 'border-[#c4a46b]/40' },
  'Squirrelly Spice Blends': { dot: 'bg-[#b45309]', badge: 'bg-[#b45309]/15 text-[#b45309]', border: 'border-[#b45309]/40' },
};

// Short display names for the category tabs
const CATEGORY_LABELS: Record<string, string> = {
  'All': 'All Products',
  'Extra Virgin Olive Oils & Infusions': 'Olive Oils',
  'Traditional Balsamic Vinegars & Infusions': 'Traditional Balsamic',
  'White Balsamic Vinegars & Infusions': 'White Balsamic',
  'Squirrelly Spice Blends': 'Spice Blends',
};

// Category icons (SVG paths)
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'All': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  ),
  'Extra Virgin Olive Oils & Infusions': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7-5 11a5 5 0 0 0 10 0c0-4-3.8-5.6-5-11Z" />
    </svg>
  ),
  'Traditional Balsamic Vinegars & Infusions': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3ZM7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8H7Z" />
    </svg>
  ),
  'White Balsamic Vinegars & Infusions': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3ZM7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8H7Z" />
      <path strokeLinecap="round" d="M10 13h4" />
    </svg>
  ),
  'Squirrelly Spice Blends': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  ),
};

interface ProductCardProps {
  product: CatalogProduct;
  onAddToCart: (item: Omit<CartItem, 'quantity'>) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const colors = CATEGORY_COLORS[product.category] ?? { dot: 'bg-[#2c3a2e]', badge: 'bg-[#2c3a2e]/10 text-[#2c3a2e]', border: 'border-[#2c3a2e]/20' };

  const handleAdd = useCallback(() => {
    onAddToCart({ id: product.id, name: product.name, price: product.price, image: product.image, catalogObjectId: product.catalogObjectId, type: product.type });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }, [product, onAddToCart]);

  return (
    <div className={`group relative flex flex-col bg-white rounded-2xl border ${colors.border} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      {/* Top accent stripe */}
      <div className={`h-1 w-full ${colors.dot}`} />

      {/* Product image */}
      <div className="relative w-full bg-[#f5f2ed] overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Category badge */}
        <span className={`self-start text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
          {product.category.split(' ')[0] === 'Extra' ? 'Olive Oil' :
            product.category.split(' ')[0] === 'Traditional' ? 'Traditional Balsamic' :
              product.category.split(' ')[0] === 'White' ? 'White Balsamic' :
                'Spice Blend'}
        </span>

        {/* Product name */}
        <h3 className="text-lg font-serif italic text-[#2c3a2e] leading-tight flex-1">
          {product.name}
        </h3>

        {/* Bottom row: price + button */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#2c3a2e]/8">
          <span className="text-2xl font-serif font-bold text-[#2c3a2e]">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider active:scale-95 transition-all duration-200 ${added
                ? 'bg-[#8aad6e] text-white'
                : 'bg-[#2c3a2e] text-[#f5f2ed] hover:bg-[#4a5d4e]'
              }`}
          >
            {added ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface CategorySectionProps {
  category: string;
  products: CatalogProduct[];
  onAddToCart: (item: Omit<CartItem, 'quantity'>) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, products, onAddToCart }) => {
  const colors = CATEGORY_COLORS[category] ?? { dot: 'bg-[#2c3a2e]', badge: '', border: '' };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${colors.dot} flex-shrink-0`} />
        <h3 className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e]">{category}</h3>
        <div className="flex-1 h-px bg-[#2c3a2e]/10 ml-2" />
        <span className="text-sm text-[#2c3a2e]/40 font-medium">{products.length} products</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
      </div>
    </div>
  );
};

interface ProductGridProps {
  onAddToCart: (item: Omit<CartItem, 'quantity'>) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? CATALOG
    : CATALOG.filter(p => p.category === activeCategory);

  // Group by category for "All" view
  const groupedCategories = activeCategory === 'All'
    ? CATEGORIES.filter(c => c !== 'All')
    : [activeCategory];

  return (
    <section className="py-24 px-6 bg-[#f5f2ed]">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#2c3a2e]/50">Full Collection</span>
          <h2 className="text-4xl md:text-6xl font-serif italic text-[#2c3a2e]">
            Stock Your Pantry
          </h2>
          <p className="text-base text-[#2c3a2e]/60 max-w-lg mx-auto font-light leading-relaxed">
            Every product is crafted with clean, natural ingredients — no fillers, no nonsense.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${activeCategory === cat
                ? 'bg-[#2c3a2e] text-[#f5f2ed] border-[#2c3a2e] shadow-md'
                : 'bg-white text-[#2c3a2e] border-[#2c3a2e]/15 hover:border-[#2c3a2e]/40 hover:shadow-sm'
                }`}
            >
              {CATEGORY_ICONS[cat]}
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        {/* Products — grouped by category when All is selected, flat grid otherwise */}
        {activeCategory === 'All' ? (
          <div className="space-y-16">
            {groupedCategories.map(cat => (
              <CategorySection
                key={cat}
                category={cat}
                products={filtered.filter(p => p.category === cat)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
          </div>
        )}

        {/* Footer count */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-[#2c3a2e]/40">
            {filtered.length} of {CATALOG.length} products
          </p>
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;
