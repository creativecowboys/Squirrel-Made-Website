
import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import ProductGrid from './components/ProductGrid';
import TrustBar from './components/TrustBar';
import BrandStatement from './components/BrandStatement';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import OurStory from './components/OurStory';
import Contact from './components/Contact';
import OurPromise from './components/OurPromise';
import { CartItem, getCart, addToCart, getCartCount } from './src/cart';

// Home page layout
const HomePage: React.FC<{
  cart: CartItem[];
  onAddToCart: (item: Omit<CartItem, 'quantity'>) => void;
  onCartOpen: () => void;
}> = ({ cart, onAddToCart, onCartOpen }) => (
  <div className="min-h-screen flex flex-col overflow-x-hidden">
    <Navbar cartCount={getCartCount(cart)} onCartOpen={onCartOpen} />
    <main className="flex-grow">
      <Hero />
      <Ticker />
      <div id="products">
        <ProductGrid onAddToCart={onAddToCart} />
      </div>
      <BrandStatement />
      <TrustBar />
      <Ticker />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(getCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    const updated = addToCart(item);
    setCart(updated);
    setIsCartOpen(true);
  }, []);

  const handleCartChange = useCallback((updated: CartItem[]) => {
    setCart(updated);
  }, []);

  const cartCount = getCartCount(cart);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              cart={cart}
              onAddToCart={handleAddToCart}
              onCartOpen={() => setIsCartOpen(true)}
            />
          }
        />
        <Route
          path="/our-story"
          element={
            <OurStory
              cartCount={cartCount}
              onCartOpen={() => setIsCartOpen(true)}
            />
          }
        />
        <Route
          path="/contact"
          element={
            <Contact
              cartCount={cartCount}
              onCartOpen={() => setIsCartOpen(true)}
            />
          }
        />
        <Route
          path="/our-promise"
          element={
            <OurPromise
              cartCount={cartCount}
              onCartOpen={() => setIsCartOpen(true)}
            />
          }
        />
      </Routes>

      {/* Cart Drawer — persists across all routes */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onCartChange={handleCartChange}
      />
    </BrowserRouter>
  );
};

export default App;
