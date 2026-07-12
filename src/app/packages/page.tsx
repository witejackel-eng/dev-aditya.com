import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import PackagesContent from './PackagesContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateOfferCatalogSchema } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Website Design Packages & Pricing in India',
  description: 'Transparent website design packages: Starter at ₹14,999, Business at ₹34,999, and Premium at ₹74,999. Clear scope, fixed pricing, professional results. Based in Delhi — working worldwide.',
  path: '/packages',
  keywords: ['website design packages India', 'web design pricing India', 'freelance web designer cost'],
});

const offerCatalogSchema = generateOfferCatalogSchema([
  { name: 'Starter Package', price: '14999', priceCurrency: 'INR', description: 'A clean, professional single-page website designed to establish your online presence fast.', path: '/packages' },
  { name: 'Business Package', price: '34999', priceCurrency: 'INR', description: 'A multi-page business website built for credibility, lead generation, and clear communication.', path: '/packages' },
  { name: 'Premium Package', price: '74999', priceCurrency: 'INR', description: 'A full-scale web experience with custom interactions, advanced animations, and polished production quality.', path: '/packages' },
]);

export default function PackagesPage() {
  return (
    <>
      <JsonLd data={offerCatalogSchema} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-7xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Packages</li>
        </ol>
      </nav>
      <PackagesContent />
    </>
  );
}
