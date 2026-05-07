import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface FindARetailerProps {
  cartCount: number;
  onCartOpen: () => void;
}

interface Retailer {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  website?: string;
  mapsUrl: string;
}

const retailers: Retailer[] = [
  {
    id: 'agnellis-meat-market',
    name: "Agnelli's Meat Market",
    type: 'Butcher & Specialty Market',
    address: '5060 Sugar Pike Rd, Suite 201B',
    city: 'Canton',
    state: 'GA',
    zip: '30115',
    phone: '(770) 864-5460',
    hours: 'Mon 10am–4pm · Tue–Fri 10am–6pm · Sat 10am–4pm · Sun Closed',
    website: 'https://agnellismeatmarket.com',
    mapsUrl: 'https://maps.google.com/?q=Agnelli%27s+Meat+Market+5060+Sugar+Pike+Rd+Canton+GA',
  },
  {
    id: 'alons-bakery-morningside',
    name: "Alon's Bakery & Market",
    type: 'Artisan Bakery & Market',
    address: '1394 N Highland Ave NE',
    city: 'Atlanta',
    state: 'GA',
    zip: '30306',
    phone: '(404) 872-6000',
    hours: 'Mon–Sat 7am–8pm · Sun 9am–4pm',
    website: 'https://alons.com',
    mapsUrl: 'https://maps.google.com/?q=Alon%27s+Bakery+1394+N+Highland+Ave+NE+Atlanta+GA',
  },
  {
    id: 'alons-bakery-phipps',
    name: "Alon's Bakery & Market",
    type: 'Artisan Bakery & Market',
    address: '3500 Peachtree Rd, Suite 1095-D',
    city: 'Atlanta',
    state: 'GA',
    zip: '30326',
    phone: '(404) 978-2601',
    hours: 'Mon–Fri 7am–7pm · Sat 8am–7pm · Sun 9am–4pm',
    website: 'https://alons.com',
    mapsUrl: 'https://maps.google.com/?q=Alon%27s+Bakery+Phipps+Plaza+3500+Peachtree+Rd+Atlanta+GA',
  },
  {
    id: 'butchers-block-woodstock',
    name: "The Butchers Block",
    type: 'Full-Service Butcher Shop',
    address: '1025 Rose Creek Dr, Suite 140',
    city: 'Woodstock',
    state: 'GA',
    zip: '30189',
    phone: '(678) 540-5527',
    hours: 'Mon–Fri 11am–7pm · Sat 10am–7pm · Sun 11am–6pm',
    website: 'https://thebutchersblock.net',
    mapsUrl: 'https://maps.google.com/?q=The+Butchers+Block+1025+Rose+Creek+Dr+Woodstock+GA',
  },
  {
    id: 'butcher-on-whitlock',
    name: "The Butcher on Whitlock",
    type: 'Artisan Butcher Shop',
    address: '800 Whitlock Ave NW, Suite 126',
    city: 'Marietta',
    state: 'GA',
    zip: '30064',
    phone: '(770) 693-7440',
    hours: 'Tue–Fri 10am–7pm · Sat 10am–5pm · Sun–Mon Closed',
    website: 'https://butcheronwhitlock.com',
    mapsUrl: 'https://maps.google.com/?q=Butcher+on+Whitlock+800+Whitlock+Ave+NW+Marietta+GA',
  },
  {
    id: 'cleaver-and-cork',
    name: "Cleaver & Cork",
    type: 'Butcher & Wine Shop',
    address: '9 Lagrange St',
    city: 'Newnan',
    state: 'GA',
    zip: '30263',
    phone: '(470) 414-1291',
    hours: 'Tue–Fri 10am–6pm · Sat 10am–5pm · Sun–Mon Closed',
    website: 'https://cleaverandcork.net',
    mapsUrl: 'https://maps.google.com/?q=Cleaver+and+Cork+9+Lagrange+St+Newnan+GA',
  },
  {
    id: 'corner-butcher-shop',
    name: "The Corner Butcher Shop",
    type: 'Neighborhood Butcher',
    address: '10515 Bells Ferry Rd, Suite 300',
    city: 'Canton',
    state: 'GA',
    zip: '30114',
    phone: '(770) 720-8015',
    hours: 'Mon–Sat 10am–6:30pm · Sun 10am–5pm',
    website: 'https://thecornerbutchershop.com',
    mapsUrl: 'https://maps.google.com/?q=The+Corner+Butcher+Shop+10515+Bells+Ferry+Rd+Canton+GA',
  },
  {
    id: 'farm-to-family',
    name: "Farm to Family",
    type: 'Farm-Fresh Grocery',
    address: '605 Osborne St, Suite C',
    city: "St. Marys",
    state: 'GA',
    zip: '31558',
    phone: '(912) 540-0825',
    hours: 'Tue–Fri 10am–5pm · Sat 10am–4pm · Sun–Mon Closed',
    website: 'https://farmtofamilyga.com',
    mapsUrl: 'https://maps.google.com/?q=Farm+to+Family+605+Osborne+St+St+Marys+GA',
  },
  {
    id: 'key-farms',
    name: "Key Farms Meats & Mercantile",
    type: 'Farm Store & Butcher',
    address: '816 Maple St',
    city: 'Carrollton',
    state: 'GA',
    zip: '30117',
    phone: '(678) 890-1115',
    hours: 'Mon–Fri 9am–6pm · Sat 9am–4pm · Sun Closed',
    website: 'https://key-farms.com',
    mapsUrl: 'https://maps.google.com/?q=Key+Farms+816+Maple+St+Carrollton+GA',
  },
  {
    id: 'local-exchange',
    name: "The Local Exchange",
    type: 'Local Goods Market',
    address: '130 S Park Square NE',
    city: 'Marietta',
    state: 'GA',
    zip: '30060',
    phone: '(770) 794-3136',
    hours: 'Mon 10am–5pm · Tue–Thu 10am–6pm · Fri–Sat 9am–8pm · Sun 12pm–5pm',
    website: 'https://thelocalexchangemarietta.com',
    mapsUrl: 'https://maps.google.com/?q=The+Local+Exchange+130+S+Park+Square+NE+Marietta+GA',
  },
  {
    id: 'star-provisions',
    name: "Star Provisions",
    type: 'Gourmet Specialty Market',
    address: '1460 Ellsworth Industrial Blvd',
    city: 'Atlanta',
    state: 'GA',
    zip: '30318',
    phone: '(404) 365-0410',
    hours: 'Tue–Sat 8am–6pm · Sun 9am–3pm · Mon Closed',
    website: 'https://starprovisions.com',
    mapsUrl: 'https://maps.google.com/?q=Star+Provisions+1460+Ellsworth+Industrial+Blvd+Atlanta+GA',
  },
  {
    id: 'tyus-mercantile',
    name: "Tyus Mercantile",
    type: 'Farm & Artisan Goods Store',
    address: '2366 W Hwy 5',
    city: 'Bowdon',
    state: 'GA',
    zip: '30108',
    phone: '(770) 258-1387',
    hours: 'Call for current hours',
    website: 'https://tyusmercantile.com',
    mapsUrl: 'https://maps.google.com/?q=Tyus+Mercantile+2366+W+Hwy+5+Bowdon+GA',
  },
];

// SVG icons
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const DirectionsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="m3 11 19-9-9 19-2-8-8-2z" />
  </svg>
);

const FindARetailer: React.FC<FindARetailerProps> = ({ cartCount, onCartOpen }) => {
  const [filter, setFilter] = useState('');

  const filtered = retailers.filter(r =>
    filter === '' ||
    r.city.toLowerCase().includes(filter.toLowerCase()) ||
    r.name.toLowerCase().includes(filter.toLowerCase()) ||
    r.type.toLowerCase().includes(filter.toLowerCase())
  );

  // Unique cities for quick filter chips
  const cities = Array.from(new Set(retailers.map(r => r.city))).sort();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center pt-28 px-6 overflow-hidden bg-[#2c3a2e]">
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f5f2ed' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-[#f5f2ed] space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8aad6e]">Available Near You</span>
          <h1 className="text-5xl md:text-7xl font-serif italic">Find a Retailer</h1>
          <p className="text-[#f5f2ed]/70 text-lg font-light max-w-xl mx-auto leading-relaxed">
            Squirrel Made products are available at these trusted local shops across Georgia. Stop in and stock your pantry.
          </p>
          <div className="w-12 h-0.5 bg-[#8aad6e] mx-auto mt-6" />
        </div>
      </section>

      <main className="flex-grow">
        {/* Search + Filter */}
        <section className="max-w-6xl mx-auto px-6 pt-12 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            {/* Search input */}
            <div className="relative w-full sm:max-w-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2c3a2e]/40 pointer-events-none">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                id="retailer-search"
                type="search"
                placeholder="Search by name or city…"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#2c3a2e]/15 bg-white text-[#2c3a2e] text-sm placeholder:text-[#2c3a2e]/35 focus:outline-none focus:border-[#8aad6e] focus:ring-2 focus:ring-[#8aad6e]/20 transition-all"
              />
            </div>

            <p className="text-xs uppercase tracking-widest text-[#2c3a2e]/40 flex-shrink-0">
              {filtered.length} {filtered.length === 1 ? 'location' : 'locations'}
            </p>
          </div>

          {/* City filter chips */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                filter === '' ? 'bg-[#2c3a2e] text-[#f5f2ed] border-[#2c3a2e]' : 'bg-transparent text-[#2c3a2e]/60 border-[#2c3a2e]/20 hover:border-[#2c3a2e]/50 hover:text-[#2c3a2e]'
              }`}
            >
              All
            </button>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setFilter(city === filter ? '' : city)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                  filter === city ? 'bg-[#8aad6e] text-white border-[#8aad6e]' : 'bg-transparent text-[#2c3a2e]/60 border-[#2c3a2e]/20 hover:border-[#8aad6e]/50 hover:text-[#2c3a2e]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </section>

        {/* Retailer Grid */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#2c3a2e]/40">
              <p className="text-lg font-serif italic">No retailers found for "{filter}"</p>
              <button onClick={() => setFilter('')} className="mt-4 text-sm text-[#8aad6e] underline underline-offset-2 cursor-pointer hover:opacity-70 transition-opacity">
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((retailer) => (
                <article
                  key={retailer.id}
                  className="group bg-white rounded-2xl border border-[#2c3a2e]/8 shadow-sm hover:shadow-md hover:border-[#8aad6e]/30 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Card top accent */}
                  <div className="h-1 bg-[#8aad6e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-6 flex flex-col gap-4 flex-grow">
                    {/* Store type badge */}
                    <span className="inline-flex items-center self-start px-3 py-1 rounded-full bg-[#8aad6e]/10 text-[#4a7432] text-[10px] font-semibold uppercase tracking-widest">
                      {retailer.type}
                    </span>

                    {/* Name */}
                    <h2 className="text-xl font-serif italic text-[#2c3a2e] leading-tight">
                      {retailer.name}
                    </h2>

                    {/* Info rows */}
                    <div className="space-y-2.5 flex-grow">
                      <div className="flex items-start gap-2.5 text-sm text-[#2c3a2e]/70">
                        <MapPinIcon />
                        <span>
                          {retailer.address}<br />
                          {retailer.city}, {retailer.state} {retailer.zip}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-[#2c3a2e]/70">
                        <PhoneIcon />
                        <a href={`tel:${retailer.phone.replace(/\D/g,'')}`} className="hover:text-[#2c3a2e] transition-colors">
                          {retailer.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm text-[#2c3a2e]/60">
                        <ClockIcon />
                        <span className="leading-relaxed">{retailer.hours}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2 border-t border-[#2c3a2e]/6">
                      <a
                        href={retailer.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#2c3a2e] text-[#f5f2ed] text-xs font-semibold uppercase tracking-wide hover:bg-[#4a5d4e] transition-colors duration-200 cursor-pointer"
                        aria-label={`Get directions to ${retailer.name}`}
                      >
                        <DirectionsIcon />
                        Directions
                      </a>
                      {retailer.website && (
                        <a
                          href={retailer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#2c3a2e]/15 text-[#2c3a2e]/70 text-xs font-semibold uppercase tracking-wide hover:border-[#2c3a2e]/40 hover:text-[#2c3a2e] transition-all duration-200 cursor-pointer"
                          aria-label={`Visit ${retailer.name} website`}
                        >
                          <ExternalLinkIcon />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CTA strip — suggest online ordering */}
        <section className="bg-[#f0ede8] border-t border-[#2c3a2e]/8 py-14 px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-[#8aad6e] mb-3">Can't Make It In Person?</p>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c3a2e] mb-4">Order Online, Anytime</h2>
          <p className="text-[#2c3a2e]/60 font-light max-w-md mx-auto mb-8 leading-relaxed">
            Our full product lineup is available in our online shop — shipped fresh right to your door.
          </p>
          <a
            href="/#products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2c3a2e] text-[#f5f2ed] rounded-full font-semibold text-sm tracking-wide hover:bg-[#4a5d4e] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Shop Online
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FindARetailer;
