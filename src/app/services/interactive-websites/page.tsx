import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { generateServiceSchema, generateBreadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import Content from './Content';

export const metadata: Metadata = generatePageMetadata({
  title: 'Interactive & Immersive Website Development | Aditya Singh',
  description:
    'Interactive and immersive website development with WebGL, scroll choreography, and motion design. For brands that want more than a static page. Based in Delhi, working worldwide.',
  path: '/services/interactive-websites',
  keywords: [
    'interactive website',
    'immersive website',
    'WebGL website',
    'GSAP animations',
    'Three.js developer',
    'scroll animations',
    'motion design website',
  ],
});

export default function InteractiveWebsitesPage() {
  const serviceSchema = generateServiceSchema({
    name: 'Interactive & Immersive Website Development',
    description:
      'Interactive and immersive website development with WebGL, scroll choreography, and motion design. For brands that want more than a static page.',
    path: '/services/interactive-websites',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Interactive Websites', path: '/services/interactive-websites' },
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
          <li className="text-text-primary" aria-current="page">Interactive Websites</li>
        </ol>
      </nav>
      <Content />
    </>
  );
}
