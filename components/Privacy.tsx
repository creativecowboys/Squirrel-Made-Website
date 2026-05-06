import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PrivacyProps {
  cartCount: number;
  onCartOpen: () => void;
}

const Privacy: React.FC<PrivacyProps> = ({ cartCount, onCartOpen }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />

      {/* Hero */}
      <section className="bg-[#4a5d4e] text-[#f5f2ed] min-h-[48vh] flex flex-col items-center justify-center pt-28 px-6 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#f5f2ed]/50">Legal</span>
        <h1 className="text-5xl md:text-6xl font-serif italic mt-2">Privacy Policy</h1>
        <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
        <p className="text-[#f5f2ed]/70 mt-4 text-sm font-light">Last updated: March 2026</p>
      </section>

      {/* Content */}
      <main className="flex-grow max-w-3xl mx-auto px-6 py-20 space-y-10 text-[#2c3a2e]">

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">1. Information We Collect</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            When you place an order or contact us, we collect personal information such as your name, email address, shipping address, and payment details. We also collect non-personal information such as browser type, pages visited, and time spent on our site through standard analytics tools.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">2. How We Use Your Information</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            We use the information we collect to process and fulfill your orders, send order confirmations and shipping updates, respond to customer service inquiries, and improve our website and product offerings. We do not sell, trade, or rent your personal information to third parties.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">3. Cookies</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            Our site uses cookies to enhance your browsing experience, remember your cart contents, and analyze site traffic. You can choose to disable cookies through your browser settings, though this may affect some functionality of the site.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">4. Third-Party Services</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            We use trusted third-party services to process payments and fulfill orders. These providers have their own privacy policies and only receive the information necessary to complete your transaction. We are not responsible for the privacy practices of these third parties.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">5. Data Security</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            We take reasonable precautions to protect your personal information from unauthorized access, disclosure, or misuse. All sensitive data is transmitted using SSL encryption. However, no method of transmission over the Internet is 100% secure.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">6. Your Rights</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            You have the right to access, correct, or delete the personal information we hold about you. To make a request, please contact us at <a href="mailto:hello@squirrelmade.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity">hello@squirrelmade.com</a>.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">7. Changes to This Policy</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date. Continued use of our site following any changes constitutes your acceptance of the revised policy.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif italic">8. Contact Us</h2>
          <p className="text-sm leading-relaxed text-[#2c3a2e]/70 font-light">
            If you have any questions about this Privacy Policy, please reach out to us at <a href="mailto:hello@squirrelmade.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity">hello@squirrelmade.com</a>.
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

export default Privacy;
