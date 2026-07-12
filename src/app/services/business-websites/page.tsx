import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { generateServiceSchema, generateBreadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import Content from './Content';

export const metadata: Metadata = generatePageMetadata({
  title: 'Business Website Design & Development | Aditya Singh',
  description:
    'Professional business website design and development for service businesses, startups, and independent professionals. Responsive, SEO-optimized, and built to convert visitors into clients. Based in Delhi, working worldwide.',
  path: '/services/business-websites',
  keywords: [
    'business website design',
    'corporate website development',
    'service business website',
    'startup website',
    'responsive web design',
    'Delhi web designer',
  ],
});

export default function BusinessWebsitesPage() {
  const serviceSchema = generateServiceSchema({
    name: 'Business Website Design & Development',
    description:
      'Professional business website design and development for service businesses, startups, and independent professionals. Responsive, SEO-optimized, and built to convert.',
    path: '/services/business-websites',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Business Websites', path: '/services/business-websites' },
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
          <li className="text-text-primary" aria-current="page">Business Websites</li>
        </ol>
      </nav>
      <Content />
    </>
  );
}
