
import React from 'react';

const Ticker: React.FC = () => {
  const items = [
    "SILKSTRAND OASIS", "DIVINEHAIR HAVEN", "LUXELOCKS SPA", 
    "SQUIRREL MADE", "ARTISAN QUALITY", "SMALL BATCH", "ALL NATURAL"
  ];

  return (
    <div className="py-8 bg-[#4a5d4e] border-y border-[#f5f2ed]/10 overflow-hidden text-[#f5f2ed]/80">
      <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
        {[...items, ...items].map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="text-xs tracking-[0.4em] font-medium uppercase">{item}</span>
            <span className="text-lg">✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
