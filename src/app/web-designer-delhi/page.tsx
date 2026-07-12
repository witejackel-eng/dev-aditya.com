import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { generateServiceSchema, generateBreadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import Content from './Content';

export const metadata: Metadata = generatePageMetadata({
  title: 'Web Designer in Delhi — Aditya Singh',
  description:
    'Aditya Singh is a Delhi-based web designer and front-end developer building premium, fast websites for businesses in Delhi/NCR and worldwide. View case studies, packages, and get in touch.',
  path: '/web-designer-delhi',
  keywords: [
    'web designer Delhi',
    'website designer Delhi',
    'freelance web developer Delhi',
    'Delhi web design',
    'web developer Delhi NCR',
    'Next.js developer Delhi',
  ],
});

export default function WebDesignerDelhiPage() {
  const serviceSchema = generateServiceSchema({
    name: 'Web Design & Development — Delhi',
    description:
      'Aditya Singh is a Delhi-based web designer and front-end developer building premium, fast websites for businesses in Delhi/NCR and worldwide.',
    path: '/web-designer-delhi',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Web Designer in Delhi', path: '/web-designer-delhi' },
  ]);

  return (
    <>
      <JsonLd data={[serviceSchema, breadcrumbs]} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-4xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Web Designer in Delhi</li>
        </ol>
      </nav>
      <Content />
    </>
  );
}
