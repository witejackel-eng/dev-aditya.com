import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { generateServiceSchema, generateBreadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import Content from './Content';

export const metadata: Metadata = generatePageMetadata({
  title: 'Website Redesign Services | Aditya Singh',
  description:
    'Professional website redesign services. Transform your outdated website into a modern, fast, conversion-focused experience. Preserve what works, rebuild what doesn\'t. Based in Delhi, working worldwide.',
  path: '/services/website-redesign',
  keywords: [
    'website redesign',
    'website revamp',
    'website refresh',
    'modernize website',
    'website migration',
    'UX redesign',
  ],
});

export default function WebsiteRedesignPage() {
  const serviceSchema = generateServiceSchema({
    name: 'Website Redesign Services',
    description:
      'Professional website redesign services. Transform your outdated website into a modern, fast, conversion-focused experience.',
    path: '/services/website-redesign',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Website Redesign', path: '/services/website-redesign' },
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
          <li className="text-text-primary" aria-current="page">Website Redesign</li>
        </ol>
      </nav>
      <Content />
    </>
  );
}
