import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { generateServiceSchema, generateBreadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import Content from './Content';

export const metadata: Metadata = generatePageMetadata({
  title: 'Landing Page Design & Development | Aditya Singh',
  description:
    'High-conversion landing page design and development for campaigns, product launches, and lead generation. Every element serves the conversion goal. Based in Delhi, working worldwide.',
  path: '/services/landing-page-design',
  keywords: [
    'landing page design',
    'landing page development',
    'lead generation pages',
    'campaign landing pages',
    'conversion optimization',
    'product launch page',
  ],
});

export default function LandingPageDesignPage() {
  const serviceSchema = generateServiceSchema({
    name: 'Landing Page Design & Development',
    description:
      'High-conversion landing page design and development for campaigns, product launches, and lead generation.',
    path: '/services/landing-page-design',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Landing Page Design', path: '/services/landing-page-design' },
  ]);

  return (
    <>
      <JsonLd data={[serviceSchema, breadcrumbs]} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-4xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/services" className="hover:text-maroon transition-colors">Services</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Landing Page Design</li>
        </ol>
      </nav>
      <Content />
    </>
  );
}
