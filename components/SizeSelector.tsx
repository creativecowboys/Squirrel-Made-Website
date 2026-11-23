'use client';

// Size picker shared by the product cards and the product detail page.
//
// Renders nothing at all unless Shopify actually gives the product more than one
// size, so the current single-size catalog looks exactly as it did before.
// Sold-out sizes stay visible but unselectable — a shopper should be able to see
// that the small bottle exists even on a day it isn't in stock.

import React from 'react';
import { ShopifyProduct, ShopifyVariant, getSizeLabel } from '@/lib/shopify';

interface SizeSelectorProps {
  product: ShopifyProduct;
  variants: ShopifyVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
  /** 'card' is the tighter grid version; 'detail' is the product page. */
  size?: 'card' | 'detail';
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  product,
  variants,
  selectedId,
  onSelect,
  size = 'detail',
}) => {
  if (variants.length < 2) return null;

  const pad = size === 'card' ? 'py-1.5 px-3 text-xs' : 'py-2 px-4 text-xs';
  const groupLabel = `Size, ${product.title}`;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-[#2c3a2e]/50">
        Size
      </span>
      <div role="radiogroup" aria-label={groupLabel} className="flex flex-wrap gap-1.5">
        {variants.map((variant) => {
          const label = getSizeLabel(product, variant);
          const isSelected = variant.id === selectedId;
          const soldOut = !variant.availableForSale;

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={soldOut}
              onClick={() => onSelect(variant.id)}
              className={`${pad} rounded-full font-semibold uppercase tracking-wider border transition-all duration-200 disabled:cursor-not-allowed ${
                isSelected
                  ? 'bg-[#2c3a2e] text-[#f5f2ed] border-[#2c3a2e] shadow-sm'
                  : soldOut
                    ? 'bg-transparent text-[#2c3a2e]/30 border-[#2c3a2e]/10 line-through'
                    : 'bg-white text-[#2c3a2e]/70 border-[#2c3a2e]/15 hover:border-[#2c3a2e]/40 hover:text-[#2c3a2e]'
              }`}
            >
              {label}
              {soldOut && <span className="sr-only"> (sold out)</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
