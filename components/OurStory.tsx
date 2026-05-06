import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { CartItem } from '../src/cart';

interface OurStoryProps {
    cartCount: number;
    onCartOpen: () => void;
}

const OurStory: React.FC<OurStoryProps> = ({ cartCount, onCartOpen }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#faf8f5]">
            <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />

            {/* Hero banner */}
            <section className="relative min-h-[55vh] flex flex-col items-center justify-center pt-28 px-6 overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/our-story-hero.png"
                        alt="Jeremy and Bobbie at the Marietta Square Farmers Market"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#2c3a2e]/65" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-3xl mx-auto text-center text-[#f5f2ed] space-y-4">
                    <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#f5f2ed]/50">The People Behind the Bottle</span>
                    <h1 className="text-5xl md:text-7xl font-serif italic">Our Story</h1>
                    <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
                </div>
            </section>

            {/* Content */}
            <main className="flex-grow">
                <article className="max-w-3xl mx-auto px-6 py-20 space-y-16">

                    {/* Opening story */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-3 h-3 rounded-full bg-[#8aad6e] flex-shrink-0" />
                            <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c3a2e]">How It All Started</h2>
                        </div>
                        <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
                            Over the past 15 years, Jeremy Johnson has worked part-time in the balsamic vinegar and oil business.
                            Many of those years he spent every Saturday at the farmers market on Marietta Square. He quickly fell
                            in love with the farmers market, the customers, and all the visiting canines.
                        </p>
                        <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
                            In 2022 the company that he was purchasing his product from suddenly closed its doors. Jeremy began
                            talking to his wife, Bobbie, about potentially starting their own company, similar to the one he had
                            worked at before. Together, they decided that they would move forward with a business plan, and make
                            Jeremy's dream come true. So off we went with creating Squirrel Made.
                        </p>
                    </section>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-[#2c3a2e]/10" />
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#8aad6e] flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <div className="flex-1 h-px bg-[#2c3a2e]/10" />
                    </div>

                    {/* The name */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-3 h-3 rounded-full bg-[#c4a46b] flex-shrink-0" />
                            <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c3a2e]">Why "Squirrel Made"?</h2>
                        </div>
                        <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
                            Lots of customers ask about our name — how and why did we choose "Squirrel Made"? For years, Jeremy
                            and Bobbie have had a running joke about squirrels, their love of squirrels, and how they feel that
                            squirrels are their spirit animals and represent their love of one another.
                        </p>
                        <div className="bg-white border border-[#2c3a2e]/8 rounded-2xl px-8 py-6 shadow-sm">
                            <p className="text-xl font-serif italic text-[#2c3a2e] text-center leading-relaxed">
                                "Also, Jeremy and his ADHD resembles that of a squirrel — all over the place, all of the time."
                            </p>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-[#2c3a2e]/10" />
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#8aad6e] flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <div className="flex-1 h-px bg-[#2c3a2e]/10" />
                    </div>

                    {/* Craft & Quality */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-3 h-3 rounded-full bg-[#7b3f5e] flex-shrink-0" />
                            <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c3a2e]">Our Craft & Quality</h2>
                        </div>
                        <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
                            Squirrel Made prides itself in sourcing the highest quality balsamic vinegars and olive oils. Currently
                            we are sourcing our balsamic vinegar from Modena, Italy, and our olive oil is a single varietal extra
                            virgin olive oil from Spain. Squirrel Made bottles and infuses their products with love, in Marietta, Georgia.
                        </p>

                        {/* Origin cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <div className="bg-white border border-[#7b3f5e]/20 rounded-2xl p-6 space-y-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-[#7b3f5e]/10 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[#7b3f5e]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3ZM7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8H7Z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs uppercase tracking-widest font-semibold text-[#7b3f5e]">Balsamic Vinegar</span>
                                </div>
                                <p className="font-serif italic text-[#2c3a2e] text-lg">Modena, Italy</p>
                                <p className="text-sm text-[#2c3a2e]/60 font-light">Sourced from the home of true traditional balsamic</p>
                            </div>
                            <div className="bg-white border border-[#8aad6e]/30 rounded-2xl p-6 space-y-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-[#8aad6e]/10 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[#8aad6e]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7-5 11a5 5 0 0 0 10 0c0-4-3.8-5.6-5-11Z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs uppercase tracking-widest font-semibold text-[#4a7432]">Olive Oil</span>
                                </div>
                                <p className="font-serif italic text-[#2c3a2e] text-lg">Spain</p>
                                <p className="text-sm text-[#2c3a2e]/60 font-light">Single varietal extra virgin olive oil</p>
                            </div>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-[#2c3a2e]/10" />
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#8aad6e] flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <div className="flex-1 h-px bg-[#2c3a2e]/10" />
                    </div>

                    {/* Mission */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-3 h-3 rounded-full bg-[#b45309] flex-shrink-0" />
                            <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c3a2e]">Our Mission</h2>
                        </div>
                        <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
                            With lots of hard work and dedication, Squirrel Made hopes to serve this local community for years to
                            come. We believe in inspiring healthy eating, making it simple, convenient, and delicious.
                        </p>
                        <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
                            Spreading this ability to our customers and helping them to become more creative in their kitchens is
                            a big part of our mission. We also hope to bring many people's palates joy, with all of our
                            "Squirrelly" infusions.
                        </p>
                    </section>

                    {/* CTA */}
                    <div className="text-center pt-8">
                        <a
                            href="/#products"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2c3a2e] text-[#f5f2ed] rounded-full font-semibold text-sm tracking-wide hover:bg-[#4a5d4e] active:scale-95 transition-all duration-200"
                        >
                            Shop Our Products
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </a>
                    </div>

                </article>
            </main>
            <Footer />
        </div>
    );
};

export default OurStory;
