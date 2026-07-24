import { Metadata } from 'next';
import ServicesContent from './ServicesContent';

export const metadata: Metadata = {
  title: 'Services — Corporate Web Design & Frontend Development',
  description:
    'Corporate website design and development, website redesign, B2B landing pages and frontend development for companies in India and internationally.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services — Aditya',
    description:
      'Corporate website design, redesign, B2B landing pages and frontend development for B2B and professional-service firms.',
    url: '/services',
    type: 'website',
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
