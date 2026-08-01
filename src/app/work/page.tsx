import { Metadata } from 'next';
import WorkContent from './WorkContent';

export const metadata: Metadata = {
  title: 'Work — Corporate Websites & Digital Products',
  description:
    'Selected corporate websites, professional-service platforms and interactive digital products, designed and developed from structure through launch.',
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Work — Aditya',
    description:
      'Corporate websites, professional-service platforms and interactive digital products built for clarity, usability and performance.',
    url: '/work',
    type: 'website',
  },
};

export default function WorkPage() {
  return <WorkContent />;
}
