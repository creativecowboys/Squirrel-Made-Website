import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface WholesaleProps {
  cartCount: number;
  onCartOpen: () => void;
}

const FAIRE_DIRECT_URL = 'https://squirrelmadeproducts.faire.com';

const benefits = [
  {
    title: '60-Day Payment Terms',
    body: 'Order now and pay later on qualifying first orders — stock your shelves without the upfront cash.',
  },
  {
    title: 'Free Returns on First Orders',
    body: "Try Squirrel Made risk-free. If your first order isn't the right fit, returns are on us.",
  },
  {
    title: 'Simple, One-Place Reordering',
    body: 'Browse the full line, track orders, and reorder in a few clicks — all through Faire.',
  },
  {
    title: 'Trusted by 100,000+ Retailers',
    body: 'Wholesale ordering is powered by Faire, the platform independent shops already know and love.',
  },
];

const Wholesale: React.FC<WholesaleProps> = ({ cartCount, onCartOpen }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />

      {/* Hero */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-center pt-28 px-6 overflow-hidden bg-[#2c3a2e]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f5f2ed' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-[#f5f2ed] space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8aad6e]">For Retailers</span>
          <h1 className="text-5xl md:text-7xl font-serif italic">Carry Squirrel Made</h1>
          <p className="text-[#f5f2ed]/70 text-lg font-light max-w-xl mx-auto leading-relaxed">
            Bring small-batch olive oils, balsamic vinegars, and spice blends to your shelves — with wholesale ordering made simple through Faire.
          </p>
          <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
        </div>
      </section>

      <main className="flex-grow">
        {/* Benefits */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="flex flex-col gap-2">
                <h2 className="text-xl font-serif italic text-[#2c3a2e]">{b.title}</h2>
                <p className="text-[#2c3a2e]/70 leading-relaxed font-light">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#f0ede8] border-t border-[#2c3a2e]/8 py-16 px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-[#8aad6e] mb-3">Ready to Stock Up?</p>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c3a2e] mb-4">Order Wholesale on Faire</h2>
          <p className="text-[#2c3a2e]/60 font-light max-w-md mx-auto mb-8 leading-relaxed">
            Browse the full Squirrel Made collection and place your wholesale order — all with the benefits of Faire.
          </p>
          <a
            href={FAIRE_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2c3a2e] text-[#f5f2ed] rounded-full font-semibold text-sm tracking-wide hover:bg-[#4a5d4e] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Order Wholesale on Faire
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <p className="text-[#2c3a2e]/50 text-sm font-light mt-8">
            Questions? <Link to="/contact" className="text-[#4a7432] underline underline-offset-2 hover:opacity-70 transition-opacity">Get in touch</Link>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Wholesale;
