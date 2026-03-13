
import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import ProductGrid from './components/ProductGrid';
import TrustBar from './components/TrustBar';
import BrandStatement from './components/BrandStatement';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { CartItem, getCart, addToCart, getCartCount } from './src/cart';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(getCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    const updated = addToCart(item);
    setCart(updated);
    // Briefly open the cart drawer to confirm the add
    setIsCartOpen(true);
  }, []);

  const handleCartChange = useCallback((updated: CartItem[]) => {
    setCart(updated);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar cartCount={getCartCount(cart)} onCartOpen={() => setIsCartOpen(true)} />
      <main className="flex-grow">
        <Hero />
        <Ticker />
        <div id="products">
          <ProductGrid onAddToCart={handleAddToCart} />
        </div>
        <BrandStatement />
        <TrustBar />
        <Ticker />
      </main>
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onCartChange={handleCartChange}
      />
    </div>
  );
};

export default App;
