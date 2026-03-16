import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface ContactProps {
    cartCount: number;
    onCartOpen: () => void;
}

const Contact: React.FC<ContactProps> = ({ cartCount, onCartOpen }) => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailto = `mailto:squirrelmadeproducts@gmail.com?subject=${encodeURIComponent(form.subject || 'Website Inquiry')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
        window.location.href = mailto;
        setSubmitted(true);
    };

    const inputClasses = `w-full px-4 py-3 bg-white border border-[#2c3a2e]/15 rounded-xl text-[#2c3a2e] placeholder:text-[#2c3a2e]/35
    focus:outline-none focus:border-[#8aad6e] focus:ring-2 focus:ring-[#8aad6e]/20 transition-all duration-200 text-sm`;

    return (
        <div className="min-h-screen flex flex-col bg-[#faf8f5]">
            <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 bg-[#2c3a2e] text-[#f5f2ed] text-center">
                <div className="max-w-3xl mx-auto space-y-4">
                    <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#f5f2ed]/50">We'd love to hear from you</span>
                    <h1 className="text-5xl md:text-7xl font-serif italic">Get in Touch</h1>
                    <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
                </div>
            </section>

            {/* Main content */}
            <main className="flex-grow">
                <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Contact info panel */}
                    <aside className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-2xl font-serif italic text-[#2c3a2e] mb-6">Contact Info</h2>
                            <div className="space-y-4">

                                {/* Email */}
                                <a href="mailto:squirrelmadeproducts@gmail.com" className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#2c3a2e]/8 hover:border-[#8aad6e]/40 hover:shadow-sm transition-all duration-200 group">
                                    <div className="w-10 h-10 rounded-xl bg-[#8aad6e]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#8aad6e]/20 transition-colors">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#4a7432]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-semibold text-[#2c3a2e]/40 mb-1">Email</p>
                                        <p className="text-sm text-[#2c3a2e] font-medium">squirrelmadeproducts@gmail.com</p>
                                    </div>
                                </a>

                                {/* Phone */}
                                <a href="tel:+14043126810" className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#2c3a2e]/8 hover:border-[#8aad6e]/40 hover:shadow-sm transition-all duration-200 group">
                                    <div className="w-10 h-10 rounded-xl bg-[#c4a46b]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c4a46b]/20 transition-colors">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#b45309]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-semibold text-[#2c3a2e]/40 mb-1">Phone</p>
                                        <p className="text-sm text-[#2c3a2e] font-medium">(404) 312-6810</p>
                                    </div>
                                </a>

                                {/* Location */}
                                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#2c3a2e]/8">
                                    <div className="w-10 h-10 rounded-xl bg-[#7b3f5e]/10 flex items-center justify-center flex-shrink-0">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#7b3f5e]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-semibold text-[#2c3a2e]/40 mb-1">Based In</p>
                                        <p className="text-sm text-[#2c3a2e] font-medium">Marietta, Georgia</p>
                                        <p className="text-xs text-[#2c3a2e]/50 mt-0.5">Bottled & infused with love</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Farmers market note */}
                        <div className="bg-[#2c3a2e] rounded-2xl p-6 text-[#f5f2ed]">
                            <p className="text-xs uppercase tracking-widest font-semibold text-[#8aad6e] mb-3">Find Us</p>
                            <p className="font-serif italic text-lg mb-2">Marietta Square Farmers Market</p>
                            <p className="text-sm text-[#f5f2ed]/60 leading-relaxed">Stop by and say hello — we love meeting our customers and their dogs 🐾</p>
                        </div>
                    </aside>

                    {/* Contact form */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-serif italic text-[#2c3a2e] mb-6">Send a Message</h2>

                        {submitted ? (
                            <div className="bg-white border border-[#8aad6e]/30 rounded-2xl p-10 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-[#8aad6e]/10 flex items-center justify-center mx-auto">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-[#4a7432]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-serif italic text-[#2c3a2e]">Your email client should be opening!</h3>
                                <p className="text-sm text-[#2c3a2e]/60">We'll get back to you as soon as we can. Thanks for reaching out!</p>
                                <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-[#4a7432] font-medium hover:underline">
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white border border-[#2c3a2e]/8 rounded-2xl p-8 space-y-5 shadow-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs uppercase tracking-widest font-semibold text-[#2c3a2e]/50">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Jeremy & Bobbie"
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs uppercase tracking-widest font-semibold text-[#2c3a2e]/50">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="you@example.com"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs uppercase tracking-widest font-semibold text-[#2c3a2e]/50">Subject</label>
                                    <select name="subject" value={form.subject} onChange={handleChange} className={inputClasses}>
                                        <option value="">Select a topic…</option>
                                        <option value="Order Question">Order Question</option>
                                        <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                                        <option value="Gifting">Gifting</option>
                                        <option value="Farmers Market">Farmers Market Info</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs uppercase tracking-widest font-semibold text-[#2c3a2e]/50">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        placeholder="Tell us what's on your mind…"
                                        className={`${inputClasses} resize-none`}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#2c3a2e] text-[#f5f2ed] rounded-xl font-semibold text-sm tracking-wide hover:bg-[#4a5d4e] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    Send Message
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                    </svg>
                                </button>

                                <p className="text-center text-xs text-[#2c3a2e]/35">
                                    Or email us directly at{' '}
                                    <a href="mailto:squirrelmadeproducts@gmail.com" className="text-[#4a7432] hover:underline">
                                        squirrelmadeproducts@gmail.com
                                    </a>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
