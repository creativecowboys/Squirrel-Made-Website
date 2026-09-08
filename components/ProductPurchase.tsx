'use client';

// Price + One-Time / Subscribe toggle + Add to Cart for the product page.
// Same logic and copy as the homepage ProductCard, laid out for a detail page.

import React, { useState, useCallback } from 'react';
import { ShopifyProduct, getPurchaseInfo } from '@/lib/shopify';
import { trackAddToCart } from '@/lib/tracking';
import { useCart } from '@/lib/cart-context';

const ProductPurchase: React.FC<{ product: ShopifyProduct }> = ({ product }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');

  const { variant, regularPrice, available, sellingPlanId, hasSubscription, subDiscount, subscriptionPrice } = getPurchaseInfo(product);

  const handleAdd = useCallback(async () => {
    if (!variant || loading) return;
    setLoading(true);
    try {
      await addItem(
        variant.id,
        purchaseType === 'subscription' ? sellingPlanId : undefined
      );
      trackAddToCart({
        productId: product.id,
        productTitle: product.title,
        value: purchaseType === 'subscription' ? subscriptionPrice : regularPrice,
        isSubscription: purchaseType === 'subscription',
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setLoading(false);
    }
  }, [variant, addItem, loading, purchaseType, sellingPlanId, product, regularPrice, subscriptionPrice]);

  return (
    <div className="bg-white rounded-2xl border border-[#2c3a2e]/8 shadow-sm p-6 space-y-5">
      {/* Purchase option selector */}
      {hasSubscription && available && (
        <div className="flex flex-col gap-2">
          <div className="bg-[#f5f2ed]/70 rounded-xl p-1 border border-[#2c3a2e]/10 flex gap-1">
            <button
              type="button"
              onClick={() => setPurchaseType('one-time')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                purchaseType === 'one-time'
                  ? 'bg-[#2c3a2e] text-[#f5f2ed] shadow-sm'
                  : 'text-[#2c3a2e]/60 hover:text-[#2c3a2e] hover:bg-[#2c3a2e]/5'
              }`}
            >
              One-Time
            </button>
            <button
              type="button"
              onClick={() => setPurchaseType('subscription')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider relative flex items-center justify-center gap-1.5 transition-all duration-200 ${
                purchaseType === 'subscription'
                  ? 'bg-[#8aad6e] text-white shadow-sm'
                  : 'text-[#2c3a2e]/60 hover:text-[#2c3a2e] hover:bg-[#2c3a2e]/5'
              }`}
            >
              <span>Subscribe</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-normal ${
                purchaseType === 'subscription' ? 'bg-white text-[#8aad6e]' : 'bg-[#b45309]/15 text-[#b45309]'
              }`}>
                -{subDiscount}%
              </span>
            </button>
          </div>
          {purchaseType === 'subscription' && (
            <p className="text-[10px] text-[#2c3a2e]/50 italic text-center mt-0.5 flex items-center justify-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 flex-shrink-0 text-[#8aad6e]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Delivered monthly. Cancel or skip anytime.
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          {purchaseType === 'subscription' && hasSubscription ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-serif font-bold text-[#8aad6e]">${subscriptionPrice.toFixed(2)}</span>
              <span className="text-sm font-sans line-through text-[#2c3a2e]/40">${regularPrice.toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-3xl font-serif font-bold text-[#2c3a2e]">${regularPrice.toFixed(2)}</span>
          )}
          {purchaseType === 'subscription' && hasSubscription && (
            <span className="text-[9px] uppercase tracking-wider text-[#8aad6e] font-bold -mt-0.5">Monthly</span>
          )}
          {!available && (
            <span className="text-xs uppercase tracking-widest font-semibold text-[#2c3a2e]/50 mt-1">Out of Stock</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!available || loading}
          aria-label={`Add ${product.title} to cart`}
          className={`flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            added ? 'bg-[#8aad6e] text-white' : 'bg-[#2c3a2e] text-[#f5f2ed] hover:bg-[#4a5d4e]'
          }`}
        >
          {loading ? (
            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : added ? (
            <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>Added!</>
          ) : (
            <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>Add to Cart</>
          )}
        </button>
      </div>

      <p className="text-xs text-[#2c3a2e]/40">Taxes &amp; shipping calculated at checkout.</p>
    </div>
  );
};

export default ProductPurchase;
