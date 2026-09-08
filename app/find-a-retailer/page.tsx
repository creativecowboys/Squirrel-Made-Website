import type { Metadata } from 'next';
import FindARetailerPage from '@/components/FindARetailerPage';

const description =
  'Squirrel Made products are available at these trusted local shops across Georgia. Stop in and stock your pantry.';

export const metadata: Metadata = {
  title: 'Find a Retailer',
  description,
  alternates: { canonical: '/find-a-retailer' },
  openGraph: { title: 'Find a Retailer', description, url: '/find-a-retailer' },
};

export default function Page() {
  return <FindARetailerPage />;
}
