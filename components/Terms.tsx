import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface TermsProps {
  cartCount: number;
  onCartOpen: () => void;
}

const Terms: React.FC<TermsProps> = ({ cartCount, onCartOpen }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />

      {/* Hero */}
      <section className="bg-[#4a5d4e] text-[#f5f2ed] min-h-[48vh] flex flex-col items-center justify-center pt-28 px-6 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#f5f2ed]/50">Legal</span>
        <h1 className="text-5xl md:text-6xl font-serif italic mt-2">Terms of Service</h1>
        <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
        <p className="text-[#f5f2ed]/70 mt-4 text-sm font-light">Last updated: March 2026</p>
      </section>

      {/* Content */}
      <main className="flex-grow max-w-3xl mx-auto px-6 py-20 space-y-10 text-[#2c3a2e]">

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            By accessing or using the Squirrel Made website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our site. We reserve the right to update these terms at any time, and your continued use of the site constitutes acceptance of any changes.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">2. Products & Orders</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            All products are subject to availability. We reserve the right to limit quantities, discontinue products, or decline orders at our discretion. Prices are listed in USD and are subject to change without notice. We are not responsible for typographical errors in pricing or product descriptions.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">3. Payments</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            We accept major credit cards and other payment methods as listed at checkout. By submitting your order, you represent that you are authorized to use the payment method provided. All payments are processed securely through trusted third-party processors.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">4. Shipping & Delivery</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            We ship within the United States. Shipping times are estimates and not guaranteed. Squirrel Made is not responsible for delays caused by carriers, weather, or other factors outside our control. Risk of loss and title for products pass to you upon delivery to the carrier.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">5. Returns & Refunds</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            If you are not satisfied with your order, please contact us within 14 days of delivery at <a href="mailto:hello@squirrelmade.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity">hello@squirrelmade.com</a>. Because our products are food items, we handle returns on a case-by-case basis. We stand behind our products and will do our best to make it right.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">6. Intellectual Property</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            All content on this site — including text, images, logos, and design — is the property of Squirrel Made and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or use our content without prior written permission.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">7. Limitation of Liability</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            To the fullest extent permitted by law, Squirrel Made shall not be liable for any indirect, incidental, or consequential damages arising from your use of our site or products. Our total liability to you for any claim shall not exceed the amount paid for the product in question.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">8. Governing Law</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            These Terms of Service are governed by the laws of the State of Georgia, without regard to conflict of law principles. Any disputes arising under these terms shall be resolved in the courts located in Cobb County, Georgia.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">9. Contact Us</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            Questions about these Terms? Reach us at <a href="mailto:hello@squirrelmade.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity">hello@squirrelmade.com</a>.
          </p>
        </div>

        <div className="pt-8 border-t border-[#2c3a2e]/10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#4a5d4e] hover:opacity-70 transition-opacity"
          >
            ← Back to Home
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
