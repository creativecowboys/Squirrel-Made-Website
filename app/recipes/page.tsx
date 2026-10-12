import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { RECIPES } from '@/lib/recipes';
import { SITE_URL, absoluteUrl } from '@/lib/site';

const description =
  'Recipes from the Squirrel Made newsletter, written out in full — ingredients, every step, and the olive oils, balsamics and spice blends they call for.';

export const metadata: Metadata = {
  title: 'Recipes & Kitchen',
  description,
  alternates: { canonical: '/recipes' },
  openGraph: { type: 'website', title: 'Recipes & Kitchen', description, url: '/recipes' },
};

export default function RecipesHubPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/recipes')}#collection`,
    name: 'Recipes & Kitchen',
    description,
    url: absoluteUrl('/recipes'),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: RECIPES.length,
      itemListElement: RECIPES.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: r.title,
        url: absoluteUrl(`/recipes/${r.slug}`),
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Recipes', item: absoluteUrl('/recipes') },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />
      <JsonLd data={[itemListJsonLd, breadcrumbJsonLd]} />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center pt-28 px-6 overflow-hidden bg-[#2c3a2e]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f5f2ed' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-[#f5f2ed] space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8aad6e]">From Our Kitchen</span>
          <h1 className="text-5xl md:text-7xl font-serif italic">Recipes &amp; Kitchen</h1>
          <p className="text-[#f5f2ed]/70 text-lg font-light max-w-xl mx-auto leading-relaxed">
            The recipes we send out in the newsletter, written out in full and kept in one place.
          </p>
          <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
        </div>
      </section>

      <main className="flex-grow">
        <section className="py-20 px-6 bg-[#f5f2ed]">
          <div className="max-w-5xl mx-auto space-y-14">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#2c3a2e]/50">
              <Link href="/" className="hover:text-[#2c3a2e] transition-colors">Home</Link>
              <span className="text-[#2c3a2e]/30">/</span>
              <span className="text-[#2c3a2e]">Recipes</span>
            </nav>

            {/* Recipe cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {RECIPES.map((recipe) => (
                <Link
                  key={recipe.slug}
                  href={`/recipes/${recipe.slug}`}
                  className="group bg-white border border-[#2c3a2e]/8 rounded-2xl p-8 flex flex-col gap-4 hover:border-[#8aad6e]/50 hover:shadow-md transition-all"
                >
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8aad6e]">
                    {recipe.fromNewsletter}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e] leading-tight">{recipe.title}</h2>
                  <p className="text-[#2c3a2e]/70 font-light leading-relaxed flex-grow">{recipe.summary}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] uppercase tracking-widest text-[#2c3a2e]/40 font-semibold pt-2 border-t border-[#2c3a2e]/8">
                    <span>{recipe.servings}</span>
                    {recipe.times.prep && <span>Prep {recipe.times.prep.label}</span>}
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#2c3a2e] group-hover:gap-3 transition-all">
                    Read the recipe
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>

            {/* Clean eating cross-link */}
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/hero-ingredients.png"
                alt="Fresh vegetables, herbs and olives on a cutting board"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#2c3a2e]/80" />
              <div className="relative z-10 px-8 py-14 text-center text-[#f5f2ed] space-y-4 max-w-2xl mx-auto">
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#8aad6e]">In the Kitchen</span>
                <h2 className="text-3xl md:text-4xl font-serif italic">Clean Eating &amp; Mediterranean-Inspired Cooking</h2>
                <p className="text-[#f5f2ed]/70 font-light leading-relaxed">
                  Vegetables, beans, whole grains and good olive oil — how we build everyday meals around them, and
                  which bottles do the heavy lifting.
                </p>
                <Link
                  href="/clean-eating"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#f5f2ed] text-[#2c3a2e] rounded-full font-semibold text-sm tracking-wide hover:bg-white active:scale-95 transition-all duration-200 mt-2"
                >
                  How We Cook
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link href="/#products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#2c3a2e] hover:opacity-70 transition-opacity">
                Shop All Products
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
