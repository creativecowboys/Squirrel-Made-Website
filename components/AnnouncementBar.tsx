
import React, { useState, useEffect } from 'react';

const announcements = [
  {
    text: (
      <span>
        Free Shipping on Orders <span className="font-bold">$60+</span>
      </span>
    ),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    )
  },
  {
    text: (
      <span>
        Subscribe &amp; Save <span className="font-bold text-[#8aad6e]">15%</span> on All Monthly Deliveries!
      </span>
    ),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0 text-[#8aad6e]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    )
  }
];

const AnnouncementBar: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % announcements.length);
        setFade(true);
      }, 300); // Matches transition-out duration
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const current = announcements[index];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#2c3a2e] text-[#f5f2ed] h-8 flex items-center justify-center px-4">
      <div
        className={`flex items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 transform ${
          fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
        }`}
      >
        {current.icon}
        {current.text}
      </div>
    </div>
  );
};

export default AnnouncementBar;
