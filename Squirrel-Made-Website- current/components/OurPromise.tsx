import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface OurPromiseProps {
    cartCount: number;
    onCartOpen: () => void;
}

const promises = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
        color: '#8aad6e',
        title: 'Real Ingredients. Nothing Hidden.',
        body: 'Every bottle we make starts with an honest ingredient list. No fillers, no artificial flavors — just pure, traceable ingredients you can pronounce.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
            </svg>
        ),
        color: '#c4a46b',
        title: 'Sourced from the Best Places on Earth.',
        body: 'Our balsamic vinegar comes from Modena, Italy — the gold standard of the craft. Our olive oil is a single varietal extra virgin from Spain. We travel far so your kitchen doesn\'t have to.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
            </svg>
        ),
        color: '#7b3f5e',
        title: 'Made with Love in Marietta, Georgia.',
        body: 'Every bottle is hand-filled and infused right here in our home state. We take pride in what we make, because we believe you taste the care that goes into it.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
        ),
        color: '#4a7432',
        title: 'Inspiring Healthier, More Creative Kitchens.',
        body: 'We believe eating well shouldn\'t feel complicated. Our products make it easy to cook with confidence — and a little bit of joy — every single day.',
    },
];

const OurPromise: React.FC<OurPromiseProps> = ({ cartCount, onCartOpen }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#faf8f5]">
            <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />

            {/* Hero */}
            <section className="relative min-h-[55vh] flex items-center pt-28 pb-20 px-6 overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/our-promise-hero.png"
                        alt="Squirrel Made olive oil and balsamic vinegar with fresh herbs"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#2c3a2e]/70" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-3xl mx-auto text-center text-[#f5f2ed] space-y-4">
                    <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#f5f2ed]/50">What we stand for</span>
                    <h1 className="text-5xl md:text-7xl font-serif italic">Our Promise</h1>
                    <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto" />
                    <p className="text-lg text-[#f5f2ed]/80 font-light max-w-xl mx-auto pt-2 leading-relaxed">
                        From the fields of Italy and Spain to your kitchen table in Georgia — here's what we commit to with every bottle we make.
                    </p>
                </div>
            </section>

            {/* Promise cards */}
            <main className="flex-grow">
                <div className="max-w-4xl mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {promises.map((promise, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-8 border border-[#2c3a2e]/8 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${promise.color}18`, color: promise.color }}
                                >
                                    {promise.icon}
                                </div>
                                <h2 className="text-xl font-serif italic text-[#2c3a2e] leading-snug">{promise.title}</h2>
                                <p className="text-[#2c3a2e]/70 text-sm leading-relaxed font-light">{promise.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* Bottom statement */}
                    <div className="mt-16 text-center space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-[#2c3a2e]/10" />
                            <div className="w-2 h-2 rounded-full bg-[#8aad6e]" />
                            <div className="flex-1 h-px bg-[#2c3a2e]/10" />
                        </div>
                        <blockquote className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e]/60 max-w-2xl mx-auto leading-relaxed">
                            "Real ingredients. Honest food. Made with care."
                        </blockquote>
                        <p className="text-sm text-[#2c3a2e]/40 font-light">— Jeremy & Bobbie Johnson, Squirrel Made</p>

                        <a
                            href="/"
                            className="inline-flex items-center gap-2 mt-4 px-8 py-4 bg-[#2c3a2e] text-[#f5f2ed] rounded-full font-semibold text-sm tracking-wide hover:bg-[#4a5d4e] active:scale-95 transition-all duration-200"
                        >
                            Shop Our Products
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OurPromise;
