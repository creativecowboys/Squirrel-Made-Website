import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import PrintRecipeButton from '@/components/PrintRecipeButton';
import RecipeProductStrip from '@/components/RecipeProductStrip';
import { getRecipe, flatIngredients, RECIPE_SLUGS, type Recipe } from '@/lib/recipes';
import { SITE_URL, SITE_NAME, absoluteUrl } from '@/lib/site';

// Must be a literal (Next requirement) — keep in sync with CATALOG_REVALIDATE_SECONDS in lib/shopify.ts.
// The recipe text is static; the revalidate is for the product tiles that come from Shopify.
export const revalidate = 3600;
// Only the recipes we actually have a source for get pages; anything else is a 404.
export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return RECIPE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return { title: 'Page Not Found' };

  const path = `/recipes/${recipe.slug}`;
  return {
    title: recipe.title,
    description: recipe.summary,
    alternates: { canonical: path },
    openGraph: { type: 'article', title: recipe.title, description: recipe.summary, url: path },
    twitter: { card: 'summary_large_image', title: recipe.title, description: recipe.summary },
  };
}

/** schema.org Recipe. Only fields the source actually supports — no nutrition, no ratings. */
function recipeJsonLd(recipe: Recipe) {
  const url = absoluteUrl(`/recipes/${recipe.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    '@id': `${url}#recipe`,
    name: recipe.title,
    description: recipe.summary,
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    recipeCategory: recipe.course,
    recipeYield: recipe.servings,
    ...(recipe.times.prep ? { prepTime: recipe.times.prep.iso } : {}),
    ...(recipe.times.cook ? { cookTime: recipe.times.cook.iso } : {}),
    ...(recipe.times.total ? { totalTime: recipe.times.total.iso } : {}),
    recipeIngredient: flatIngredients(recipe),
    recipeInstructions: recipe.instructions.map((group) => ({
      '@type': 'HowToSection',
      ...(group.heading ? { name: group.heading } : {}),
      itemListElement: group.steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text: s.text,
      })),
    })),
  };
}

const SafetyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

export default async function RecipePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const url = absoluteUrl(`/recipes/${recipe.slug}`);
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Recipes', item: absoluteUrl('/recipes') },
      { '@type': 'ListItem', position: 3, name: recipe.title, item: url },
    ],
  };

  const timeEntries = [
    recipe.times.prep && { label: 'Prep', value: recipe.times.prep.label },
    recipe.times.marinate && { label: 'Marinate', value: recipe.times.marinate.label },
    recipe.times.cook && { label: 'Cook', value: recipe.times.cook.label },
    recipe.times.total && { label: 'Total', value: recipe.times.total.label },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />
      <JsonLd data={[recipeJsonLd(recipe), breadcrumbJsonLd]} />

      {/* Hero — typography only. We have no authorised photo of the finished dish and we
          will not substitute stock or generated food imagery for one. */}
      <section className="print-hide relative min-h-[50vh] flex flex-col items-center justify-center pt-36 pb-14 px-6 overflow-hidden bg-[#2c3a2e]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f5f2ed' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-[#f5f2ed] space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8aad6e]">{recipe.fromNewsletter}</span>
          <h1 className="text-4xl md:text-6xl font-serif italic">{recipe.title}</h1>
          <p className="text-[#f5f2ed]/70 text-lg font-light max-w-2xl mx-auto leading-relaxed">{recipe.summary}</p>
          <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
        </div>
      </section>

      <main className="flex-grow">
        <article className="recipe-sheet max-w-3xl mx-auto px-6 py-16 space-y-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="print-hide flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#2c3a2e]/50">
            <Link href="/" className="hover:text-[#2c3a2e] transition-colors">Home</Link>
            <span className="text-[#2c3a2e]/30">/</span>
            <Link href="/recipes" className="hover:text-[#2c3a2e] transition-colors">Recipes</Link>
            <span className="text-[#2c3a2e]/30">/</span>
            <span className="text-[#2c3a2e]">{recipe.title}</span>
          </nav>

          {/* Print-only title block (the hero is hidden on paper) */}
          <div className="print-only hidden">
            <h1 className="text-3xl font-serif italic text-[#2c3a2e]">{recipe.title}</h1>
            <p className="mt-2 text-[#2c3a2e]/70">{recipe.summary}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-[#2c3a2e]/50">
              {SITE_NAME} — squirrelmadeproducts.com
            </p>
          </div>

          {/* Times / course / servings */}
          <div className="bg-white border border-[#2c3a2e]/8 rounded-2xl px-6 py-5">
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-center">
              {timeEntries.map((t) => (
                <div key={t.label}>
                  <dt className="text-[10px] uppercase tracking-widest text-[#2c3a2e]/45 font-semibold">{t.label}</dt>
                  <dd className="mt-1 text-[#2c3a2e] font-medium">{t.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 pt-5 border-t border-[#2c3a2e]/8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-[#2c3a2e]/60 font-light">
              <span><span className="text-[#2c3a2e]/45">Course:</span> {recipe.course}</span>
              <span><span className="text-[#2c3a2e]/45">Servings:</span> {recipe.servings}</span>
            </div>
          </div>

          <p className="text-lg text-[#2c3a2e]/80 leading-relaxed font-light">{recipe.intro}</p>

          {/* Pantry */}
          <section className="print-hide space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#b45309] flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e]">From the Pantry</h2>
              <div className="flex-1 h-px bg-[#2c3a2e]/10 ml-2" />
            </div>
            <RecipeProductStrip products={recipe.products} />
          </section>

          {/* Ingredients */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#8aad6e] flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e]">Ingredients</h2>
              <div className="flex-1 h-px bg-[#2c3a2e]/10 ml-2" />
            </div>
            <div className="space-y-6">
              {recipe.ingredients.map((group, gi) => (
                <div key={gi} className="space-y-2">
                  {group.heading && (
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-[#4a7432]">{group.heading}</h3>
                  )}
                  <ul className="space-y-2">
                    {group.items.map((item, ii) => (
                      <li key={ii} className="flex gap-3 text-[#2c3a2e]/80 font-light leading-relaxed">
                        <span className="mt-[0.6em] w-1.5 h-1.5 rounded-full bg-[#8aad6e] flex-shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Safety */}
          <section className="bg-[#2c3a2e]/[0.04] border border-[#2c3a2e]/10 rounded-2xl px-6 py-5 space-y-3">
            <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#b45309]">
              <SafetyIcon />
              Before You Start
            </h2>
            <ul className="space-y-2">
              {recipe.safetyNotes.map((note, i) => (
                <li key={i} className="text-sm text-[#2c3a2e]/75 font-light leading-relaxed">{note}</li>
              ))}
            </ul>
            <p className="text-[11px] text-[#2c3a2e]/45 font-light leading-relaxed pt-1">
              Cooking temperatures follow USDA Food Safety and Inspection Service guidance.
            </p>
          </section>

          {/* Instructions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#7b3f5e] flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c3a2e]">Instructions</h2>
              <div className="flex-1 h-px bg-[#2c3a2e]/10 ml-2" />
            </div>
            <div className="space-y-8">
              {recipe.instructions.map((group, gi) => (
                <div key={gi} className="space-y-3">
                  {group.heading && (
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-[#7b3f5e]">{group.heading}</h3>
                  )}
                  <ol className="space-y-4">
                    {group.steps.map((step, si) => (
                      <li key={si} className="flex gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2c3a2e] text-[#f5f2ed] text-xs font-bold flex items-center justify-center mt-0.5">
                          {si + 1}
                        </span>
                        <span className={`leading-relaxed font-light ${step.safety ? 'text-[#2c3a2e]' : 'text-[#2c3a2e]/80'}`}>
                          {step.text}
                          {step.safety && (
                            <span className="ml-2 align-middle inline-block text-[9px] uppercase tracking-widest font-bold text-[#b45309] bg-[#b45309]/10 rounded-full px-2 py-0.5">
                              Food safety
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="print-hide flex flex-wrap items-center justify-center gap-4 pt-4">
            <PrintRecipeButton />
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2c3a2e] text-[#f5f2ed] rounded-full font-semibold text-sm tracking-wide hover:bg-[#4a5d4e] active:scale-95 transition-all duration-200"
            >
              Shop the Pantry
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="print-hide text-center pt-4">
            <Link href="/recipes" className="text-xs uppercase tracking-widest font-bold text-[#2c3a2e]/60 hover:text-[#2c3a2e] transition-colors">
              ← All Recipes
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
