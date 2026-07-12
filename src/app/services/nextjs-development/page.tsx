import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { generateServiceSchema, generateBreadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import Content from './Content';

export const metadata: Metadata = generatePageMetadata({
  title: 'Next.js Website & Application Development | Aditya Singh',
  description:
    'Production-grade Next.js website and application development with server-side rendering, API routes, and modern architecture. Built for speed, SEO, and scale. Based in Delhi, working worldwide.',
  path: '/services/nextjs-development',
  keywords: [
    'Next.js developer',
    'Next.js development',
    'React developer',
    'server-side rendering',
    'SSR website',
    'Next.js application',
    'TypeScript developer',
  ],
});

export default function NextjsDevelopmentPage() {
  const serviceSchema = generateServiceSchema({
    name: 'Next.js Website & Application Development',
    description:
      'Production-grade Next.js website and application development with server-side rendering, API routes, and modern architecture. Built for speed, SEO, and scale.',
    path: '/services/nextjs-development',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Next.js Development', path: '/services/nextjs-development' },
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
          <li className="text-text-primary" aria-current="page">Next.js Development</li>
        </ol>
      </nav>
      <Content />
    </>
  );
}
