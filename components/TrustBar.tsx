
import React from 'react';

const TrustBar: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-[#f5f2ed]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-serif italic text-[#2c3a2e] leading-tight">
              Read the Label.<br />We Want You To.
            </h2>
            <p className="text-lg opacity-80 leading-relaxed font-light">
              We put every ingredient on the label because we're proud of every ingredient. You won't find numbers, fillers, artificial preservatives, or anything that needs explaining.
            </p>

            <ul className="space-y-4">
              {[
                "No artificial flavours or colours",
                "No fillers or anti-caking agents",
                "No artificial preservatives",
                "Real, recognisable ingredients only",
                "Made in small batches for freshness"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-[#2c3a2e]">
                  <div className="w-6 h-6 rounded-full bg-[#4a5d4e] text-[#f5f2ed] flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <button className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#2c3a2e] pt-6">
              Our Full Promise
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-[100px] overflow-hidden">
              <img
                src="/trustbar-artisan.png"
                alt="Artisan hands preparing small-batch spice blends with fresh ingredients"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Circular badge */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#b45309] flex items-center justify-center p-8 text-center text-[#f5f2ed] shadow-2xl rotate-12">
              <span className="text-sm font-serif italic leading-tight">Handcrafted in small batches</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
