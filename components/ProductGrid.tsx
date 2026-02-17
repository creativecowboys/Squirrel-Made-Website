
import React from 'react';
import { Product } from '../types';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Basil Infused EVOO',
    category: 'Extra Virgin Olive Oil',
    image: 'https://picsum.photos/seed/p1/400/600',
    rating: 5,
    reviews: '1.2k'
  },
  {
    id: '2',
    name: 'Aged Balsamic',
    category: 'Balsamic Vinegar',
    image: 'https://picsum.photos/seed/p2/400/600',
    rating: 5,
    reviews: '850',
    isSeasonal: true
  },
  {
    id: '3',
    name: 'Citrus Herb Blend',
    category: 'Artisan Spice Blend',
    image: 'https://picsum.photos/seed/p3/400/600',
    rating: 4,
    reviews: '1.5k'
  },
  {
    id: '4',
    name: 'Smoked Garlic Salt',
    category: 'Finishing Salt',
    image: 'https://picsum.photos/seed/p4/400/600',
    rating: 5,
    reviews: '920'
  }
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="flex flex-col items-center group">
    <div className="relative mb-6 overflow-hidden product-oval w-full max-w-[280px] bg-[#e6dfd5]">
      {product.isSeasonal && (
        <div className="absolute top-10 right-0 z-10 -rotate-12 bg-[#b45309] text-[#f5f2ed] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
          Seasonal Batch
        </div>
      )}
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700"
      />
    </div>
    <div className="text-center space-y-1">
      <h3 className="text-xl font-serif italic text-[#2c3a2e]">{product.name}</h3>
      <p className="text-xs uppercase tracking-widest text-[#2c3a2e]/60 font-medium">{product.category}</p>
      <div className="flex items-center justify-center gap-1 mt-2">
        <div className="flex text-[#b45309]">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-[#2c3a2e]/20'}`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-[10px] text-[#2c3a2e]/50">({product.reviews})</span>
      </div>
      <button className="mt-4 px-8 py-2 border border-[#2c3a2e]/20 rounded-full text-xs font-medium hover:bg-[#2c3a2e] hover:text-white transition-colors duration-300">
        Add to Pantry
      </button>
    </div>
  </div>
);

const ProductGrid: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-[#f5f2ed]">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-serif italic text-[#2c3a2e]">
            Choose Products that<br/>suits for your pantry
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <button className="px-10 py-3 bg-[#2c3a2e] text-[#f5f2ed] rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
            View all products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
