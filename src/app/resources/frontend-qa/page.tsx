import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Content from './Content';
import JsonLd from '@/components/seo/JsonLd';
import { generateArticleSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Frontend Project QA Checklist',
  description: 'A thorough QA checklist for frontend projects covering responsive design, accessibility, SEO, performance, Core Web Vitals, security headers, structured data, and deployment. Based on real project experience.',
  path: '/resources/frontend-qa',
  type: 'article',
  publishedTime: '2026-07-10T00:00:00+05:30',
  modifiedTime: '2026-07-12T00:00:00+05:30',
  section: 'Frontend Development',
  keywords: ['frontend QA checklist', 'website testing checklist', 'Core Web Vitals QA'],
});

export default function FrontendQAPage() {
  const articleSchema = generateArticleSchema({
    headline: 'Frontend Project QA Checklist',
    description: 'A thorough QA checklist for frontend projects covering responsive design, accessibility, SEO, and performance.',
    path: '/resources/frontend-qa',
    datePublished: '2026-07-10T00:00:00+05:30',
    dateModified: '2026-07-12T00:00:00+05:30',
    section: 'Frontend Development',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Frontend QA Checklist', path: '/resources/frontend-qa' },
  ]);

  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <JsonLd data={[articleSchema, breadcrumbs]} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/resources" className="hover:text-maroon transition-colors">Resources</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Frontend QA</li>
        </ol>
      </nav>
      <Content />
    </div>
  );
}
