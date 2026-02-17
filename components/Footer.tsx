
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2c3a2e] text-[#f5f2ed]/60 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex gap-8 text-xs font-medium uppercase tracking-widest">
          <a href="#" className="hover:text-[#f5f2ed] transition-colors">Dribbble</a>
          <a href="#" className="hover:text-[#f5f2ed] transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-[#f5f2ed] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[#f5f2ed] transition-colors">Behance</a>
        </div>
        
        <div className="text-[10px] uppercase tracking-widest opacity-40">
          © Squirrel Made Products - 2026
        </div>

        <div className="flex gap-8 text-xs font-medium uppercase tracking-widest">
          <a href="#" className="hover:text-[#f5f2ed] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#f5f2ed] transition-colors">Terms</a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-[#f5f2ed]/5 text-center">
         <p className="font-serif italic text-2xl text-[#f5f2ed]/40">
           "Real ingredients. Honest food. Made with care."
         </p>
      </div>
    </footer>
  );
};

export default Footer;
