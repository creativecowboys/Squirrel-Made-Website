'use client';

// Meta Pixel 704248896104665. The inline script below is Meta's standard snippet
// (init + PageView on full page load). Because Next navigates client-side after
// that, we also fire PageView on every route change.

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { PIXEL_ID, trackPageView } from '@/lib/tracking';

const MetaPixel: React.FC = () => {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // The inline snippet already sent PageView for the initial load.
      isFirstRender.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${PIXEL_ID}');
      fbq('track', 'PageView');
      `}
    </Script>
  );
};

export default MetaPixel;
