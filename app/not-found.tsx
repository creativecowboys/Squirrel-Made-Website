import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />

      <section className="bg-[#4a5d4e] text-[#f5f2ed] min-h-[48vh] flex flex-col items-center justify-center pt-28 px-6 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#f5f2ed]/50">404</span>
        <h1 className="text-5xl md:text-6xl font-serif italic mt-2">Page Not Found</h1>
        <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
        <p className="text-[#f5f2ed]/70 mt-4 text-sm font-light">We couldn&apos;t find that page.</p>
      </section>

      <main className="flex-grow max-w-3xl mx-auto px-6 py-20 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4a5d4e] hover:opacity-70 transition-opacity"
        >
          ← Back to Home
        </Link>
      </main>

      <Footer />
    </div>
  );
}
