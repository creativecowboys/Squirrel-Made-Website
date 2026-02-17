
import React from 'react';

const BrandStatement: React.FC = () => {
  return (
    <section className="py-32 bg-[#4a5d4e] text-[#f5f2ed] px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f5f2ed]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <h2 className="text-4xl md:text-7xl font-serif italic leading-tight">
          Welcome Our Support
        </h2>
        <p className="text-lg md:text-xl font-light opacity-80 leading-relaxed max-w-2xl mx-auto">
          We provide high-quality beauty products with expert recommendations for a seamless shopping experience. We believe your pantry deserves better.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <div className="bg-[#f5f2ed]/5 border border-[#f5f2ed]/10 p-10 rounded-3xl flex flex-col items-center gap-6 group hover:bg-[#f5f2ed]/10 transition-colors">
            <div className="w-16 h-16 rounded-full border border-[#f5f2ed]/20 flex items-center justify-center text-[#f5f2ed] group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 className="text-xl font-serif italic">24/7 Support</h4>
          </div>

          <div className="bg-[#f5f2ed]/5 border border-[#f5f2ed]/10 p-10 rounded-3xl flex flex-col items-center gap-6 group hover:bg-[#f5f2ed]/10 transition-colors">
             <div className="w-16 h-16 rounded-full border border-[#f5f2ed]/20 flex items-center justify-center text-[#f5f2ed] group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 className="text-xl font-serif italic">Safe Payment</h4>
          </div>

          <div className="bg-[#f5f2ed]/5 border border-[#f5f2ed]/10 p-10 rounded-3xl flex flex-col items-center gap-6 group hover:bg-[#f5f2ed]/10 transition-colors">
            <div className="w-16 h-16 rounded-full border border-[#f5f2ed]/20 flex items-center justify-center text-[#f5f2ed] group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 3H15V16H1L1 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 8H20L23 11V16H15V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.5 21C6.88071 21 8 19.8807 8 18.5C8 17.1193 6.88071 16 5.5 16C4.11929 16 3 17.1193 3 18.5C3 19.8807 4.11929 21 5.5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 21C19.8807 21 21 19.8807 21 18.5C21 17.1193 19.8807 16 18.5 16C17.1193 16 16 17.1193 16 18.5C16 19.8807 17.1193 21 18.5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 className="text-xl font-serif italic">Quick Delivery</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
