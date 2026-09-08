import React from 'react';

// Visual config shared by the homepage grid, collection pages and product pages.

export const COLLECTION_COLORS: Record<string, { dot: string; badge: string; border: string; label: string }> = {
  'olive-oils': { dot: 'bg-[#8aad6e]', badge: 'bg-[#8aad6e]/15 text-[#4a7432]', border: 'border-[#8aad6e]/40', label: 'Olive Oil' },
  'balsamic':   { dot: 'bg-[#7b3f5e]', badge: 'bg-[#7b3f5e]/15 text-[#7b3f5e]', border: 'border-[#7b3f5e]/40', label: 'Balsamic' },
  'spice-blends': { dot: 'bg-[#b45309]', badge: 'bg-[#b45309]/15 text-[#b45309]', border: 'border-[#b45309]/40', label: 'Spice Blend' },
};

export const DEFAULT_COLLECTION_COLORS = {
  dot: 'bg-[#2c3a2e]', badge: 'bg-[#2c3a2e]/10 text-[#2c3a2e]', border: 'border-[#2c3a2e]/20', label: 'Product',
};

export const COLLECTION_ICONS: Record<string, React.ReactNode> = {
  'olive-oils': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7-5 11a5 5 0 0 0 10 0c0-4-3.8-5.6-5-11Z" />
    </svg>
  ),
  'balsamic': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3ZM7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8H7Z" />
    </svg>
  ),
  'spice-blends': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  ),
};

export const ALL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);
