
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import ProductGrid from './components/ProductGrid';
import TrustBar from './components/TrustBar';
import BrandStatement from './components/BrandStatement';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Ticker />
        <ProductGrid />
        <BrandStatement />
        <TrustBar />
        <Ticker />
      </main>
      <Footer />
    </div>
  );
};

export default App;
