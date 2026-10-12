import React from 'react';
import Link from 'next/link';
import { RECIPES } from '@/lib/recipes';

/**
 * Homepage band pointing at the recipe hub and the clean-eating page.
 * Text only — no food photography, because we have no authorised shots of the dishes.
 */
const RecipesTeaser: React.FC = () => (
  <section className="py-24 px-6 bg-[#f5f2ed]">
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8aad6e]">From Our Kitchen</span>
        <h2 className="text-4xl md:text-5xl font-serif italic text-[#2c3a2e]">Recipes &amp; Kitchen</h2>
        <p className="text-[#2c3a2e]/70 font-light text-lg max-w-xl mx-auto leading-relaxed">
          The recipes we send out in the newsletter, written out in full — plus how we cook clean and
          Mediterranean-inspired the rest of the week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {RECIPES.map((recipe) => (
          <Link
            key={recipe.slug}
            href={`/recipes/${recipe.slug}`}
            className="group bg-white border border-[#2c3a2e]/8 rounded-2xl p-7 flex flex-col gap-3 hover:border-[#8aad6e]/50 hover:shadow-md transition-all"
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8aad6e]">Recipe</span>
            <h3 className="font-serif italic text-2xl text-[#2c3a2e] leading-tight flex-grow">{recipe.title}</h3>
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#2c3a2e] group-hover:gap-3 transition-all">
              Read it
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        ))}

        <Link
          href="/clean-eating"
          className="group bg-[#2c3a2e] text-[#f5f2ed] rounded-2xl p-7 flex flex-col gap-3 hover:bg-[#4a5d4e] transition-all"
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8aad6e]">In the Kitchen</span>
          <h3 className="font-serif italic text-2xl leading-tight flex-grow">Clean Eating &amp; Mediterranean-Inspired Cooking</h3>
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold group-hover:gap-3 transition-all">
            How we cook
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </Link>
      </div>

      <div className="text-center">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#2c3a2e] hover:opacity-70 transition-opacity"
        >
          All Recipes
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  </section>
);

export default RecipesTeaser;
