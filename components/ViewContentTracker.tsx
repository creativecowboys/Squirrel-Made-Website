'use client';

import { useEffect } from 'react';
import { trackViewContent, ViewContentPayload } from '@/lib/tracking';

/** Fires the Meta Pixel ViewContent event once when a product page mounts. */
const ViewContentTracker: React.FC<ViewContentPayload> = ({ productId, productTitle, value }) => {
  useEffect(() => {
    trackViewContent({ productId, productTitle, value });
  }, [productId, productTitle, value]);
  return null;
};

export default ViewContentTracker;
