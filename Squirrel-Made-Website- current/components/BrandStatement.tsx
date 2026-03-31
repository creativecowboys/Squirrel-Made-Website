
import React from 'react';

const BrandStatement: React.FC = () => {
  return (
    <section className="py-32 bg-[#4a5d4e] text-[#f5f2ed] px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f5f2ed]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

      <div className="max-w-4xl mx-auto text-center space-y-12">
        <h2 className="text-4xl md:text-7xl font-serif italic leading-tight">
          We believe your pantry deserves better.
        </h2>
        <p className="text-lg md:text-xl font-light opacity-80 leading-relaxed max-w-2xl mx-auto">
          Most of what's on supermarket shelves is made to last forever — because it was never really alive to begin with. Squirrel Made started with a simple idea: what if your olive oil actually tasted like olives? What if your spice blend was made from ingredients you'd recognise?
        </p>
        <p className="text-lg md:text-xl font-light opacity-80 leading-relaxed max-w-2xl mx-auto">
          Everything we make is small-batch, all-natural, and built from real ingredients — the kind you can pronounce and feel good about. No artificial additives. No shortcuts. Just honest food made for the way you actually cook.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {/* Pillar 1 */}
          <div className="bg-[#f5f2ed]/5 border border-[#f5f2ed]/10 p-10 rounded-3xl flex flex-col items-center gap-6 group hover:bg-[#f5f2ed]/10 transition-colors">
            <div className="w-16 h-16 rounded-full border border-[#f5f2ed]/20 flex items-center justify-center text-[#f5f2ed] group-hover:scale-110 transition-transform">
              {/* Leaf / natural icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 22c0 0 4-8 10-10S22 2 22 2s-2 8-8 10S2 22 2 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 22 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="text-xl font-serif italic">All-Natural Ingredients</h4>
            <p className="text-sm opacity-70 leading-relaxed text-center">No fillers. No artificial flavours. Just real food.</p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#f5f2ed]/5 border border-[#f5f2ed]/10 p-10 rounded-3xl flex flex-col items-center gap-6 group hover:bg-[#f5f2ed]/10 transition-colors">
            <div className="w-16 h-16 rounded-full border border-[#f5f2ed]/20 flex items-center justify-center text-[#f5f2ed] group-hover:scale-110 transition-transform">
              {/* Hands / handcrafted icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="text-xl font-serif italic">Small-Batch, Handcrafted</h4>
            <p className="text-sm opacity-70 leading-relaxed text-center">Every batch is made in small runs so nothing sits on a shelf too long.</p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#f5f2ed]/5 border border-[#f5f2ed]/10 p-10 rounded-3xl flex flex-col items-center gap-6 group hover:bg-[#f5f2ed]/10 transition-colors">
            <div className="w-16 h-16 rounded-full border border-[#f5f2ed]/20 flex items-center justify-center text-[#f5f2ed] group-hover:scale-110 transition-transform">
              {/* Location / local icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="text-xl font-serif italic">Made Locally with Care</h4>
            <p className="text-sm opacity-70 leading-relaxed text-center">Sourced and crafted close to home, supporting the way food should be made.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
