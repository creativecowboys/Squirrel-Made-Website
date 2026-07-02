
import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import ProductGrid from './components/ProductGrid';
import TrustBar from './components/TrustBar';
import BrandStatement from './components/BrandStatement';
import NewsletterSignup from './components/NewsletterSignup';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import OurStory from './components/OurStory';
import Contact from './components/Contact';
import OurPromise from './components/OurPromise';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import FindARetailer from './components/FindARetailer';
import Wholesale from './components/Wholesale';
import ScrollToTop from './components/ScrollToTop';
import { ShopifyCart } from './src/shopify';

// Home page layout
const HomePage: React.FC<{
  cart: ShopifyCart | null;
  onCartUpdate: (cart: ShopifyCart) => void;
  onCartOpen: () => void;
}> = ({ cart, onCartUpdate, onCartOpen }) => (
  <div className="min-h-screen flex flex-col overflow-x-hidden">
    <Navbar cartCount={cart?.totalQuantity ?? 0} onCartOpen={onCartOpen} />
    <main className="flex-grow">
      <Hero />
      <Ticker />
      <div id="products">
        <ProductGrid
          cart={cart}
          onCartUpdate={onCartUpdate}
          onCartOpen={onCartOpen}
        />
      </div>
      <BrandStatement />
      <TrustBar />
      <NewsletterSignup />
      <Ticker />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartUpdate = useCallback((updated: ShopifyCart) => {
    setCart(updated);
  }, []);

  const cartCount = cart?.totalQuantity ?? 0;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              cart={cart}
              onCartUpdate={handleCartUpdate}
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
        <Route
          path="/privacy"
          element={
            <Privacy
              cartCount={cartCount}
              onCartOpen={() => setIsCartOpen(true)}
            />
          }
        />
        <Route
          path="/terms"
          element={
            <Terms
              cartCount={cartCount}
              onCartOpen={() => setIsCartOpen(true)}
            />
          }
        />
        <Route
          path="/find-a-retailer"
          element={
            <FindARetailer
              cartCount={cartCount}
              onCartOpen={() => setIsCartOpen(true)}
            />
          }
        />
        <Route
          path="/wholesale"
          element={
            <Wholesale
              cartCount={cartCount}
              onCartOpen={() => setIsCartOpen(true)}
            />
          }
        />
      </Routes>

      {/* Announcement Bar — persists across all routes */}
      <AnnouncementBar />

      {/* Cart Drawer — persists across all routes */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onCartChange={handleCartUpdate}
      />
    </BrowserRouter>
  );
};

export default App;
