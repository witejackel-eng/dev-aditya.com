import { Metadata } from 'next';
import PackagesContent from './PackagesContent';

export const metadata: Metadata = {
  title: 'Website Packages — Aditya | Front-End Developer & UI/UX Designer',
  description: 'Transparent web design packages: Starter, Business, and Premium. Clear scope, fixed pricing, professional results. Based in Delhi, India — working worldwide.',
  openGraph: {
    title: 'Website Packages — Aditya | Front-End Developer & UI/UX Designer',
    description: 'Transparent web design packages: Starter, Business, and Premium. Clear scope, fixed pricing, professional results.',
  },
};

export default function PackagesPage() {
  return <PackagesContent />;
}