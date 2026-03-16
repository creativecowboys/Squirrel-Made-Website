
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#4a5d4e] text-[#f5f2ed] px-6 overflow-hidden">
      {/* Decorative floating circle element */}
      <a
        href="#products"
        className="absolute top-36 right-[5%] w-32 h-32 md:w-48 md:h-48 rounded-full border border-[#f5f2ed]/20 flex items-center justify-center animate-pulse hover:border-[#f5f2ed]/40 transition-colors cursor-pointer"
        style={{ scrollBehavior: 'smooth' }}
        onClick={(e) => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
      >
        <div className="text-[10px] uppercase tracking-widest text-center">
          Explore<br />Products<br />↓
        </div>
      </a>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 relative z-10">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-medium opacity-70">Artisan Kitchen Solutions</span>
            <h1 className="text-6xl md:text-8xl font-serif italic leading-[0.9]">
              Real Ingredients.<br />
              <span className="ml-12 md:ml-24">Nothing Hidden.</span>
            </h1>
          </div>

          <p className="max-w-md text-lg opacity-80 leading-relaxed font-light">
            Small-batch olive oils, balsamic vinegars, and spice blends — made the way food should be. Clean, natural, and crafted with care.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <a
              href="#products"
              onClick={(e) => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group flex items-center gap-4 text-xl font-serif italic hover:gap-6 transition-all underline underline-offset-8 cursor-pointer"
            >
              Shop the Collection
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <div className="flex -space-x-3 items-center">
              {[1, 2].map((i) => (
                <img
                  key={i}
                  src={`https://picsum.photos/seed/${i + 10}/100/100`}
                  alt="Customer"
                  className="w-10 h-10 rounded-full border-2 border-[#4a5d4e] object-cover"
                />
              ))}
              <div className="pl-6 text-xs font-light max-w-[140px]">
                Made for the home cook who cares.
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          {/* Main Visual Composition */}
          <div className="relative w-full max-w-md aspect-square">
            {/* Circular main image */}
            <div className="absolute top-0 right-0 w-full h-full rounded-full overflow-hidden border-8 border-[#f5f2ed]/10">
              <img
                src="/hero-ingredients.png"
                alt="Fresh organic ingredients - basil, garlic, tomatoes, and olives on rustic cutting board"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Secondary floating images */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full overflow-hidden border-4 border-[#4a5d4e]">
              <img src="/hero-balsamic.png" alt="Aged balsamic vinegar drizzled over fresh mozzarella and tomatoes" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-10 -left-16 w-32 h-32 rounded-full overflow-hidden border-4 border-[#4a5d4e]">
              <img src="/hero-basil.png" alt="Fresh basil leaves with water droplets" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
