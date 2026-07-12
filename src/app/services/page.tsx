import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { generateServiceSchema, generateBreadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import ServicesContent from './ServicesContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Web Design & Development Services | Aditya Singh',
  description:
    'Professional web design and development services: business websites, website redesign, landing pages, e-commerce, Next.js applications, and interactive web experiences. Based in Delhi, working worldwide.',
  path: '/services',
  keywords: [
    'web design services',
    'website development',
    'Next.js developer',
    'e-commerce development',
    'landing page design',
    'website redesign',
    'Delhi web designer',
  ],
});

export default function ServicesPage() {
  const serviceSchema = generateServiceSchema({
    name: 'Web Design & Development Services',
    description:
      'Professional web design and development services: business websites, website redesign, landing pages, e-commerce, Next.js applications, and interactive web experiences.',
    path: '/services',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  return (
    <>
      <JsonLd data={[serviceSchema, breadcrumbs]} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-7xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Services</li>
        </ol>
      </nav>
      <ServicesContent />
    </>
  );
}
