import React from 'react';
import Link from 'next/link';
import { fetchProductByHandle } from '@/lib/shopify';
import type { RecipeProduct } from '@/lib/recipes';

/**
 * "What you'll need from the pantry" — the Squirrel Made products a recipe calls for,
 * with their real catalog image and a link to the product page.
 *
 * Images come from Shopify (established product photography). We do not use stock or
 * generated food photos anywhere on the recipe pages.
 *
 * If Shopify is unreachable, each tile degrades to a plain text link rather than
 * taking the page down.
 */
const RecipeProductStrip = async ({ products }: { products: RecipeProduct[] }) => {
  const resolved = await Promise.all(
    products.map(async (p) => {
      try {
        const product = await fetchProductByHandle(p.handle);
        return { ...p, title: product?.title ?? p.as, image: product?.featuredImage ?? null };
      } catch {
        return { ...p, title: p.as, image: null };
      }
    })
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {resolved.map((p) => (
        <Link
          key={p.handle}
          href={`/products/${p.handle}`}
          className="group bg-white border border-[#2c3a2e]/8 rounded-2xl p-5 flex items-center gap-4 hover:border-[#8aad6e]/50 hover:shadow-sm transition-all"
        >
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.image.url}
              alt={p.image.altText ?? p.title}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-[#f5f2ed] flex-shrink-0" aria-hidden="true" />
          )}
          <div className="min-w-0">
            <p className="font-serif italic text-lg text-[#2c3a2e] leading-tight">{p.as}</p>
            <span className="text-[11px] uppercase tracking-widest text-[#8aad6e] font-semibold group-hover:opacity-70 transition-opacity">
              Shop it
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecipeProductStrip;
