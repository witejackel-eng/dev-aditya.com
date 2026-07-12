import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Content from './Content';
import JsonLd from '@/components/seo/JsonLd';
import { generateArticleSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Portfolio Website Checklist',
  description: 'A comprehensive checklist for making a portfolio website look credible, load fast, and convert visitors into clients. Covers strategy, structure, SEO, accessibility, and launch readiness.',
  path: '/resources/portfolio-checklist',
  type: 'article',
  publishedTime: '2026-07-10T00:00:00+05:30',
  modifiedTime: '2026-07-12T00:00:00+05:30',
  section: 'Web Design',
  keywords: ['portfolio website checklist', 'web developer portfolio tips', 'portfolio website SEO'],
});

export default function PortfolioChecklistPage() {
  const articleSchema = generateArticleSchema({
    headline: 'Portfolio Website Checklist',
    description: 'A comprehensive checklist for making a portfolio website look credible, load fast, and convert visitors into clients.',
    path: '/resources/portfolio-checklist',
    datePublished: '2026-07-10T00:00:00+05:30',
    dateModified: '2026-07-12T00:00:00+05:30',
    section: 'Web Design',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Portfolio Website Checklist', path: '/resources/portfolio-checklist' },
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
          <li className="text-text-primary" aria-current="page">Portfolio Checklist</li>
        </ol>
      </nav>
      <Content />
    </div>
  );
}
