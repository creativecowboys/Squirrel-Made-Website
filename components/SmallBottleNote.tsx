// The small-bottle note. Text only — no button, no picker, no cart or checkout path.
// See lib/small-bottles.ts for the facts and for why ordering is still held.

import React from 'react';
import {
  SMALL_BOTTLE_PRICE_LABEL,
  SMALL_BOTTLE_SIZE_LABEL,
  SMALL_BOTTLE_STATUS,
} from '@/lib/small-bottles';

interface SmallBottleNoteProps {
  /** `card` is the compact line on a product card; `detail` is the block on a product page. */
  placement: 'card' | 'detail';
}

const SmallBottleNote: React.FC<SmallBottleNoteProps> = ({ placement }) => {
  if (placement === 'card') {
    return (
      <div className="pt-3 border-t border-[#2c3a2e]/8">
        <p className="text-[11px] text-[#2c3a2e]/70 leading-snug">
          <span className="font-semibold text-[#2c3a2e]">Also in Small</span>
          {' '}&middot; {SMALL_BOTTLE_SIZE_LABEL} &middot; {SMALL_BOTTLE_PRICE_LABEL}
        </p>
        <p className="text-[10px] italic text-[#2c3a2e]/50 leading-snug mt-0.5">
          {SMALL_BOTTLE_STATUS}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f2ed] rounded-2xl border border-[#2c3a2e]/10 p-5 space-y-1.5">
      <span className="block text-[10px] uppercase tracking-widest font-semibold text-[#2c3a2e]/50">
        Also in a small bottle
      </span>
      <p className="text-base text-[#2c3a2e]">
        <span className="font-serif font-bold">Small</span>
        {' '}&middot; {SMALL_BOTTLE_SIZE_LABEL} &middot;{' '}
        <span className="font-serif font-bold">{SMALL_BOTTLE_PRICE_LABEL}</span>
      </p>
      <p className="text-xs text-[#2c3a2e]/60 leading-relaxed">
        Every flavour comes in a small bottle as well as the large one. {SMALL_BOTTLE_STATUS} —
        for now, the large bottle above is the size you can order online.
      </p>
    </div>
  );
};

export default SmallBottleNote;
