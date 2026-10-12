import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, absoluteUrl } from '@/lib/site';

// WHAT THIS PAGE MAY AND MAY NOT SAY
//
// The descriptions of clean eating and the Mediterranean pattern below come from the
// reference sheet Jeremy sent ("Diets Supported By Squirrel Made Products", Oct 7, 2026),
// which in turn cites Cleveland Clinic. Those links are kept so the nutrition information
// is attributed to its source rather than asserted by us.
//
// Hard limits, do not relax them without Dave:
//   - No claim that any Squirrel Made product is certified, approved or qualified for any diet.
//   - No health outcome claims of any kind — nothing about hearts, weight, blood sugar or disease.
//   - Everything said about a product is either its catalog description or a plain
//     culinary fact (what it is made from, what you can put it on).
//   - The newsletter recipes are chicken and steak. They are NOT Mediterranean-diet recipes
//     and are not presented as such anywhere on this page.

const description =
  'How we cook at Squirrel Made: whole ingredients, vegetables and beans, whole grains, and good olive oil — with simple ways to put a Mediterranean-inspired plate together.';

export const metadata: Metadata = {
  title: 'Clean Eating & Mediterranean-Inspired Cooking',
  description,
  alternates: { canonical: '/clean-eating' },
  openGraph: {
    type: 'website',
    title: 'Clean Eating & Mediterranean-Inspired Cooking',
    description,
    url: '/clean-eating',
    images: [{ url: '/hero-ingredients.png' }],
  },
};

const CLEAN_EATING_RULES: { title: string; body: string }[] = [
  {
    title: 'Start with whole foods',
    body: 'Build meals around vegetables, fruit, beans, whole grains and other fresh or minimally processed ingredients.',
  },
  {
    title: 'Watch added sugar and sodium',
    body: 'Compare labels for added sugar and sodium, and choose amounts that fit the meal you are making.',
  },
  {
    title: 'Read the ingredient label',
    body: 'Look at what is in the product, including allergens and seasonings, so you can choose ingredients that suit your cooking.',
  },
  {
    title: 'Cook at home',
    body: 'Preparing meals at home lets you choose the ingredients and adjust the seasoning to your taste.',
  },
  {
    title: 'Drink water',
    body: 'Plenty of it, in place of sugary sodas and sweetened drinks.',
  },
];

const MEDITERRANEAN_PATTERN: string[] = [
  'Lots of vegetables, fruit, beans, lentils and nuts.',
  'A good amount of whole grains, like whole-wheat bread and brown rice.',
  'Plenty of extra virgin olive oil as a source of healthy fat.',
  'A good amount of fish, especially fish rich in omega-3 fatty acids.',
  'A moderate amount of natural cheese and yogurt.',
  'Little or no red meat — poultry, fish or beans instead.',
  'Little or no sweets, sugary drinks or butter.',
];

const KITCHEN_IDEAS: { heading: string; body: string; product?: { handle: string; label: string } }[] = [
  {
    heading: 'Roast the vegetables, season them properly',
    body:
      'Whatever is good that week — broccoli, cauliflower, carrots, potatoes, squash. Toss with extra virgin olive oil and Mediterranean Squirrel, which is rosemary, garlic, onion and lemon peel, and roast until the edges catch. It is the blend we reach for on roasted veggies and fish.',
    product: { handle: 'mediterranean-squirrel', label: 'Mediterranean Squirrel' },
  },
  {
    heading: 'Make the dressing instead of buying it',
    body:
      'Three parts olive oil to one part balsamic, a pinch of salt, whisk. That is the whole recipe, and it is the easiest bottle on the shelf to stop buying. Our 25 Star White Balsamic is the neutral starting point; the blood orange, peach and Meyer lemon infusions each take it somewhere.',
    product: { handle: '25-star-white-balsamic-vinegar', label: '25 Star White Balsamic Vinegar' },
  },
  {
    heading: 'Let olive oil be the fat',
    body:
      'Ours is a single varietal extra virgin olive oil from Spain — for cooking, and for finishing a bowl of beans, a piece of fish or a slice of good bread. The garlic and basil infusions do the same job with the seasoning already in them.',
    product: { handle: 'extra-virgin-olive-oil-spanish', label: 'Extra Virgin Olive Oil' },
  },
  {
    heading: 'Build the plate around beans and grains',
    body:
      'Brown rice, farro, lentils, chickpeas, white beans. They do the filling up, so the fish or the chicken can be the smaller part of the plate instead of the centre of it. A little olive oil and a good spice blend is usually the whole seasoning.',
    product: { handle: 'chef-squirrels-blend', label: "Chef Squirrel's Blend" },
  },
];

const FURTHER_READING: { label: string; href: string }[] = [
  {
    label: 'How to get started on the Mediterranean diet',
    href: 'https://health.clevelandclinic.org/how-to-get-started-on-the-mediterranean-diet-aka-the-healthiest-diet-for-your-heart',
  },
  { label: 'Omega-3 fatty acids', href: 'https://my.clevelandclinic.org/health/articles/17290-omega-3-fatty-acids' },
  { label: 'Is brown rice healthy?', href: 'https://health.clevelandclinic.org/is-brown-rice-healthy' },
];

const Divider = () => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-px bg-[#2c3a2e]/10" />
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#8aad6e] flex-shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7-5 11a5 5 0 0 0 10 0c0-4-3.8-5.6-5-11Z" />
    </svg>
    <div className="flex-1 h-px bg-[#2c3a2e]/10" />
  </div>
);

export default function CleanEatingPage() {
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl('/clean-eating')}#webpage`,
    name: 'Clean Eating & Mediterranean-Inspired Cooking',
    description,
    url: absoluteUrl('/clean-eating'),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Recipes', item: absoluteUrl('/recipes') },
      { '@type': 'ListItem', position: 3, name: 'Clean Eating', item: absoluteUrl('/clean-eating') },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />
      <JsonLd data={[pageJsonLd, breadcrumbJsonLd]} />

      {/* Hero */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-center pt-36 pb-14 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-ingredients.png"
            alt="Fresh basil, garlic, tomatoes and olives on a rustic cutting board"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2c3a2e]/70" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center text-[#f5f2ed] space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#f5f2ed]/50">In the Kitchen</span>
          <h1 className="text-4xl md:text-6xl font-serif italic">Clean Eating &amp; Mediterranean-Inspired Cooking</h1>
          <p className="text-[#f5f2ed]/75 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Real ingredients, cooked at home. Here is what that looks like on a weeknight.
          </p>
          <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
        </div>
      </section>

      <main className="flex-grow">
        <article className="max-w-3xl mx-auto px-6 py-20 space-y-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#2c3a2e]/50">
            <Link href="/" className="hover:text-[#2c3a2e] transition-colors">Home</Link>
            <span className="text-[#2c3a2e]/30">/</span>
            <Link href="/recipes" className="hover:text-[#2c3a2e] transition-colors">Recipes</Link>
            <span className="text-[#2c3a2e]/30">/</span>
            <span className="text-[#2c3a2e]">Clean Eating</span>
          </nav>

          <section className="space-y-6">
            <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
              Squirrel Made exists because Jeremy wanted to keep selling real oil and real vinegar after the company he
              bought from closed its doors. That is still the whole idea: inspiring healthy eating, and making it
              simple, convenient and delicious.
            </p>
            <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
              Clean eating and Mediterranean-inspired cooking offer ways to build everyday meals around whole
              ingredients. Start with the vegetables, beans and grains you enjoy, then add olive oil, balsamic vinegar
              and seasoning for flavor. Here are a few ways to put that into practice.
            </p>
          </section>

          <Divider />

          {/* Clean eating */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-[#8aad6e] flex-shrink-0" />
              <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c3a2e]">What Clean Eating Means</h2>
            </div>
            <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
              It is less a diet than a habit: choose food that is close to how it grew, and cook it yourself. Five
              basics cover nearly all of it.
            </p>
            <ol className="space-y-4">
              {CLEAN_EATING_RULES.map((rule, i) => (
                <li key={rule.title} className="flex gap-4 bg-white border border-[#2c3a2e]/8 rounded-2xl px-6 py-5">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#8aad6e] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-serif italic text-xl text-[#2c3a2e]">{rule.title}</h3>
                    <p className="text-[#2c3a2e]/70 font-light leading-relaxed">{rule.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <Divider />

          {/* Mediterranean */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-[#7b3f5e] flex-shrink-0" />
              <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c3a2e]">The Mediterranean Way</h2>
            </div>
            <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">
              It is a pattern, not a formula — no counting, no calculating. As Cleveland Clinic describes it, a
              Mediterranean way of eating leans on plant foods and good fats:
            </p>
            <ul className="space-y-3 bg-white border border-[#2c3a2e]/8 rounded-2xl px-7 py-6">
              {MEDITERRANEAN_PATTERN.map((line) => (
                <li key={line} className="flex gap-3 text-[#2c3a2e]/80 font-light leading-relaxed">
                  <span className="mt-[0.6em] w-1.5 h-1.5 rounded-full bg-[#7b3f5e] flex-shrink-0" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-[#2c3a2e]/55 font-light leading-relaxed">
              Source: Cleveland Clinic. Further reading —{' '}
              {FURTHER_READING.map((link, i) => (
                <React.Fragment key={link.href}>
                  {i > 0 && ' · '}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-[#2c3a2e] transition-colors"
                  >
                    {link.label}
                  </a>
                </React.Fragment>
              ))}
              .
            </p>
          </section>

          <Divider />

          {/* Kitchen ideas */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-[#b45309] flex-shrink-0" />
              <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c3a2e]">Four Ways to Build a Plate</h2>
            </div>
            <p className="text-[#2c3a2e]/60 font-light leading-relaxed text-sm">
              Ideas from our kitchen — not recipes from the newsletter. The written-out newsletter recipes live on the{' '}
              <Link href="/recipes" className="underline underline-offset-2 hover:text-[#2c3a2e]">recipes page</Link>.
            </p>
            <div className="space-y-4">
              {KITCHEN_IDEAS.map((idea) => (
                <div key={idea.heading} className="bg-white border border-[#2c3a2e]/8 rounded-2xl px-7 py-6 space-y-3">
                  <h3 className="font-serif italic text-xl md:text-2xl text-[#2c3a2e]">{idea.heading}</h3>
                  <p className="text-[#2c3a2e]/75 font-light leading-relaxed">{idea.body}</p>
                  {idea.product && (
                    <Link
                      href={`/products/${idea.product.handle}`}
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#4a7432] hover:gap-3 transition-all"
                    >
                      {idea.product.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-[#2c3a2e]/[0.04] border border-[#2c3a2e]/10 rounded-2xl px-7 py-6 space-y-2">
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#2c3a2e]/60">Make It Your Own</h2>
            <p className="text-sm text-[#2c3a2e]/70 font-light leading-relaxed">
              Adapt these cooking ideas to your tastes and dietary needs. Check each product&apos;s ingredient list
              when choosing oils, vinegars and spice blends for your kitchen.
            </p>
          </section>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 px-7 py-3 border border-[#2c3a2e]/20 rounded-full text-sm font-semibold tracking-wide text-[#2c3a2e] hover:bg-[#2c3a2e] hover:text-[#f5f2ed] active:scale-95 transition-all duration-200"
            >
              Our Recipes
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#2c3a2e] text-[#f5f2ed] rounded-full font-semibold text-sm tracking-wide hover:bg-[#4a5d4e] active:scale-95 transition-all duration-200"
            >
              Shop the Pantry
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
