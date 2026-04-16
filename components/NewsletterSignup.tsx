
import React, { useState } from 'react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const apiUrl = import.meta.env.VITE_SUBSCRIBE_API_URL || '/api/subscribe';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setMessage(data.message || "You're in! We'll keep you posted.");
      setEmail('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-24 px-6 bg-[#4a5d4e] text-[#f5f2ed] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f5f2ed]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#f5f2ed]/3 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

      <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-full border border-[#f5f2ed]/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-[#f5f2ed]/80">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-serif italic leading-tight">
            Stay in the Loop
          </h2>
          <p className="text-base md:text-lg font-light opacity-80 leading-relaxed max-w-lg mx-auto">
            Be the first to know about new products, seasonal recipes, and where to find us at local farmers' markets.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="flex-1 relative">
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="your@email.com"
              required
              disabled={status === 'loading'}
              className="w-full px-5 py-3.5 rounded-full bg-[#f5f2ed]/10 border border-[#f5f2ed]/20 text-[#f5f2ed] placeholder-[#f5f2ed]/40 text-sm focus:outline-none focus:border-[#f5f2ed]/50 focus:bg-[#f5f2ed]/15 transition-all disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            className="px-7 py-3.5 bg-[#f5f2ed] text-[#2c3a2e] rounded-full text-sm font-semibold hover:bg-white active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing up…
              </>
            ) : (
              <>
                Sign Up
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Status message */}
        {status === 'success' && (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#8aad6e]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {message}
          </div>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-300">{message}</p>
        )}

        {/* Privacy note */}
        <p className="text-[11px] text-[#f5f2ed]/30 tracking-wide">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;
