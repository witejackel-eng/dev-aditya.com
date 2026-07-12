import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { generateServiceSchema, generateBreadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import Content from './Content';

export const metadata: Metadata = generatePageMetadata({
  title: 'E-commerce Website Development | Aditya Singh',
  description:
    'Professional e-commerce website development with full shopping flows, editorial design, persistent cart state, and payment integration. Based in Delhi, working worldwide.',
  path: '/services/ecommerce-development',
  keywords: [
    'e-commerce development',
    'online store development',
    'ecommerce website',
    'shopping cart development',
    'payment integration',
    'Next.js ecommerce',
  ],
});

export default function EcommerceDevelopmentPage() {
  const serviceSchema = generateServiceSchema({
    name: 'E-commerce Website Development',
    description:
      'Professional e-commerce website development with full shopping flows, editorial design, persistent cart state, and payment integration.',
    path: '/services/ecommerce-development',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'E-commerce Development', path: '/services/ecommerce-development' },
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
          <li className="text-text-primary" aria-current="page">E-commerce Development</li>
        </ol>
      </nav>
      <Content />
    </>
  );
}
