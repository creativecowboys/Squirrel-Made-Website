import React, { useState, useEffect } from 'react';
import {
  ShopifyCart,
  CartLine,
  updateCartLine,
  removeCartLine,
  getCartLines,
  getCartSubtotal,
  formatPrice,
} from '../src/shopify';
import { trackInitiateCheckout } from '../src/tracking';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: ShopifyCart | null;
  onCartChange: (cart: ShopifyCart) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onCartChange }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loadingLineId, setLoadingLineId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset spinner if user hits Back from Shopify checkout (bfcache restore)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setIsCheckingOut(false);
        setError(null);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const lines: CartLine[] = cart ? getCartLines(cart) : [];
  const subtotal = cart ? getCartSubtotal(cart) : 0;
  const totalQuantity = cart?.totalQuantity ?? 0;

  // Free shipping progress
  const FREE_SHIPPING_THRESHOLD = 60;
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountRemaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const handleQuantity = async (line: CartLine, newQty: number) => {
    if (!cart || loadingLineId) return;
    setLoadingLineId(line.id);
    setError(null);
    try {
      if (newQty <= 0) {
        const updated = await removeCartLine(cart.id, line.id);
        onCartChange(updated);
      } else {
        const updated = await updateCartLine(cart.id, line.id, newQty);
        onCartChange(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart.');
    } finally {
      setLoadingLineId(null);
    }
  };

  const handleRemove = async (line: CartLine) => {
    if (!cart || loadingLineId) return;
    setLoadingLineId(line.id);
    setError(null);
    try {
      const updated = await removeCartLine(cart.id, line.id);
      onCartChange(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item.');
    } finally {
      setLoadingLineId(null);
    }
  };

  const handleCheckout = () => {
    if (!cart?.checkoutUrl || lines.length === 0) return;
    setIsCheckingOut(true);
    setError(null);
    trackInitiateCheckout(subtotal, totalQuantity);
    // Redirect to Shopify's native hosted checkout
    window.location.href = cart.checkoutUrl;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-[#faf8f5] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2c3a2e]/10">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#2c3a2e]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <h2 className="text-lg font-serif italic text-[#2c3a2e]">Your Cart</h2>
            {totalQuantity > 0 && (
              <span className="text-xs font-semibold bg-[#2c3a2e] text-[#f5f2ed] rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2c3a2e]/8 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2c3a2e]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {lines.length > 0 && (
          <div className="px-6 py-3 border-b border-[#2c3a2e]/10 bg-[#faf8f5]">
            {hasFreeShipping ? (
              <div className="flex items-center gap-2 text-[#2c6e2e]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span className="text-xs font-semibold">You've unlocked free shipping!</span>
                <span className="text-xs">🎉</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 flex-shrink-0 text-[#2c3a2e]/50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <p className="text-xs text-[#2c3a2e]/70">
                    You're <span className="font-bold text-[#2c3a2e]">${amountRemaining.toFixed(2)}</span> away from free shipping!
                  </p>
                </div>
                <div className="w-full h-1.5 bg-[#2c3a2e]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8aad6e] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#2c3a2e]/8 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-[#2c3a2e]/40">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </div>
              <div>
                <p className="font-serif italic text-[#2c3a2e] text-lg">Your cart is empty</p>
                <p className="text-sm text-[#2c3a2e]/50 mt-1">Add some products to get started.</p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-[#2c3a2e] text-[#f5f2ed] rounded-full text-sm font-semibold hover:bg-[#4a5d4e] transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <ul className="space-y-4" role="list">
              {lines.map((line) => {
                const isUpdating = loadingLineId === line.id;
                const price = parseFloat(line.merchandise.price.amount);
                const lineTotal = price * line.quantity;

                return (
                  <li
                    key={line.id}
                    className={`flex gap-4 bg-white rounded-xl p-4 border border-[#2c3a2e]/8 shadow-sm transition-opacity duration-200 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
                  >
                    {/* Product image */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#f5f2ed]">
                      {line.merchandise.product.featuredImage?.url ? (
                        <img
                          src={line.merchandise.product.featuredImage.url}
                          alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#2c3a2e]/20">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2c3a2e] leading-tight truncate">
                        {line.merchandise.product.title}
                      </p>
                      <p className="text-sm text-[#2c3a2e]/60 mt-0.5">
                        {formatPrice(line.merchandise.price.amount)}
                      </p>
                      {line.sellingPlanAllocation?.sellingPlan && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-[#8aad6e] font-semibold bg-[#8aad6e]/10 px-2.5 py-0.5 rounded-full w-fit">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                          <span>{line.sellingPlanAllocation.sellingPlan.name}</span>
                        </div>
                      )}

                      {/* Quantity control */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          onClick={() => handleQuantity(line, line.quantity - 1)}
                          disabled={isUpdating}
                          aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                          className="w-7 h-7 rounded-full bg-[#f5f2ed] border border-[#2c3a2e]/15 flex items-center justify-center hover:bg-[#2c3a2e] hover:text-[#f5f2ed] hover:border-[#2c3a2e] transition-colors text-[#2c3a2e] font-bold text-sm disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-[#2c3a2e]">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantity(line, line.quantity + 1)}
                          disabled={isUpdating}
                          aria-label={`Increase quantity of ${line.merchandise.product.title}`}
                          className="w-7 h-7 rounded-full bg-[#f5f2ed] border border-[#2c3a2e]/15 flex items-center justify-center hover:bg-[#2c3a2e] hover:text-[#f5f2ed] hover:border-[#2c3a2e] transition-colors text-[#2c3a2e] font-bold text-sm disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line total + remove */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <p className="text-sm font-bold text-[#2c3a2e]">
                        {formatPrice(lineTotal.toFixed(2))}
                      </p>
                      <button
                        onClick={() => handleRemove(line)}
                        disabled={isUpdating}
                        aria-label={`Remove ${line.merchandise.product.title}`}
                        className="text-[#2c3a2e]/30 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer — only shown when cart has items */}
        {lines.length > 0 && (
          <div className="border-t border-[#2c3a2e]/10 px-6 py-5 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#2c3a2e]/60">Subtotal</span>
              <span className="text-xl font-serif font-bold text-[#2c3a2e]">
                {formatPrice(subtotal.toFixed(2))}
              </span>
            </div>

            {hasFreeShipping ? (
              <p className="text-xs text-[#2c6e2e] font-medium flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Free shipping · Taxes calculated at checkout.
              </p>
            ) : (
              <p className="text-xs text-[#2c3a2e]/40">Taxes &amp; shipping calculated at checkout.</p>
            )}

            {/* Error */}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Checkout button */}
            <button
              id="checkout-button"
              onClick={handleCheckout}
              disabled={isCheckingOut || lines.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2c3a2e] text-[#f5f2ed] rounded-full font-semibold text-sm tracking-wide hover:bg-[#4a5d4e] active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Redirecting to checkout…
                </>
              ) : (
                <>
                  Checkout
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>

            {isCheckingOut ? (
              <p className="text-center text-xs text-[#2c3a2e]/40">
                Taking you to Shopify checkout — please don't refresh.
              </p>
            ) : (
              <button
                onClick={onClose}
                className="w-full text-center text-xs text-[#2c3a2e]/50 hover:text-[#2c3a2e] underline underline-offset-2 transition-colors"
              >
                ← Continue shopping
              </button>
            )}

            {/* Shopify badge */}
            <p className="text-center text-xs text-[#2c3a2e]/30">
              Secure checkout powered by Shopify
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
