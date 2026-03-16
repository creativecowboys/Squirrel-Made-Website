
import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartOpen }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#4a5d4e]/90 backdrop-blur-md text-[#f5f2ed] px-6 py-2 border-b border-[#f5f2ed]/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <a href="/" className="hover:opacity-70 transition-opacity">Shop</a>
          <Link to="/our-story" className="hover:opacity-70 transition-opacity">Our Story</Link>
          <Link to="/our-promise" className="hover:opacity-70 transition-opacity">Our Promise</Link>
        </div>

        <Link to="/" className="flex items-center justify-center">
          <img
            src="/squirrel made white stacked.png"
            alt="Squirrel Made"
            className="h-28 w-auto hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link to="/contact" className="hover:opacity-70 transition-opacity">Contact</Link>

          {/* Cart button */}
          <button
            id="cart-open-button"
            onClick={onCartOpen}
            aria-label={`Open cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
            className="relative flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group"
          >
            <span className="hidden md:block">Your Pantry</span>
            <div className="relative w-9 h-9 rounded-full border border-[#f5f2ed]/30 flex items-center justify-center group-hover:border-[#f5f2ed]/60 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {/* Count badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[#8aad6e] text-white text-[10px] font-bold rounded-full leading-none shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
