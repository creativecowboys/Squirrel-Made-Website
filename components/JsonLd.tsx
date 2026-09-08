import React from 'react';

/** Renders a JSON-LD <script> block. `data` is a plain schema.org object (or an array of them). */
const JsonLd: React.FC<{ data: Record<string, unknown> | Record<string, unknown>[] }> = ({ data }) => (
  <script
    type="application/ld+json"
    // JSON-LD is data we produce ourselves (Shopify product fields + site constants); escape "<" so it can never close the tag.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
);

export default JsonLd;
