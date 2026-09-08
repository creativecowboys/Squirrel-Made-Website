import type { Metadata } from 'next';
import ContactPage from '@/components/ContactPage';

const description =
  "We'd love to hear from you. Email squirrelmadeproducts@gmail.com, call (404) 312-6810, or find us at the Marietta Square Farmers Market.";

export const metadata: Metadata = {
  title: 'Get in Touch',
  description,
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Get in Touch', description, url: '/contact' },
};

export default function Page() {
  return <ContactPage />;
}
