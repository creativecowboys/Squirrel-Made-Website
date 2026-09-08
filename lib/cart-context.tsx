'use client';

// Shared cart state for every route (the old SPA kept this in App.tsx and
// prop-drilled it). Any client component can call useCart().

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ShopifyCart, addToCart, getOrCreateCart, getSavedCart } from './shopify';

interface CartContextValue {
  cart: ShopifyCart | null;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setCart: (cart: ShopifyCart) => void;
  /** Add one unit of a variant (optionally on a selling plan), then open the drawer. */
  addItem: (variantId: string, sellingPlanId?: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCartState] = useState<ShopifyCart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Restore the cart saved in this browser so the badge survives a reload.
  useEffect(() => {
    let cancelled = false;
    getSavedCart().then((saved) => {
      if (!cancelled && saved) setCartState(saved);
    });
    return () => { cancelled = true; };
  }, []);

  const setCart = useCallback((updated: ShopifyCart) => {
    setCartState(updated);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback(async (variantId: string, sellingPlanId?: string) => {
    let currentCart = cart;
    if (!currentCart) {
      currentCart = await getOrCreateCart();
      setCartState(currentCart);
    }
    const updated = await addToCart(currentCart.id, variantId, 1, sellingPlanId);
    setCartState(updated);
    setIsCartOpen(true);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart?.totalQuantity ?? 0,
        isCartOpen,
        openCart,
        closeCart,
        setCart,
        addItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
