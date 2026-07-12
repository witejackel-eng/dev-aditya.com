import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Content from './Content';
import JsonLd from '@/components/seo/JsonLd';
import { generateArticleSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Website Redesign Checklist for Service Businesses',
  description: 'A complete, experience-based checklist for redesigning a service business website. Covers pre-redesign audits, strategy, content planning, design, development, launch, and post-launch monitoring.',
  path: '/resources/website-redesign-checklist',
  type: 'article',
  publishedTime: '2026-07-12T00:00:00+05:30',
  modifiedTime: '2026-07-12T00:00:00+05:30',
  section: 'Web Design',
  keywords: ['website redesign checklist', 'website redesign guide', 'how to redesign a website', 'service business website'],
});

export default function WebsiteRedesignChecklistPage() {
  const articleSchema = generateArticleSchema({
    headline: 'Website Redesign Checklist for Service Businesses',
    description: 'A complete, experience-based checklist for redesigning a service business website. Covers pre-redesign audits, strategy, content planning, design, development, launch, and post-launch monitoring.',
    path: '/resources/website-redesign-checklist',
    datePublished: '2026-07-12T00:00:00+05:30',
    dateModified: '2026-07-12T00:00:00+05:30',
    section: 'Web Design',
    keywords: ['website redesign checklist', 'website redesign guide', 'how to redesign a website', 'service business website'],
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Website Redesign Checklist', path: '/resources/website-redesign-checklist' },
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
          <li className="text-text-primary" aria-current="page">Website Redesign Checklist</li>
        </ol>
      </nav>
      <div className="flex items-center gap-3 mb-8 text-sm text-text-muted">
        <span>By Aditya Singh</span>
        <span>·</span>
        <time dateTime="2026-07-12">July 12, 2026</time>
        <span>·</span>
        <span>Updated July 12, 2026</span>
      </div>
      <Content />
      <section className="mt-16 pt-12 border-t border-border">
        <h2 className="text-xl font-bold text-text-primary mb-6">Related</h2>
        <div className="flex flex-col gap-3">
          <Link href="/services/website-redesign" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">Website Redesign Services &rarr;</Link>
          <Link href="/resources/frontend-qa" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">Frontend QA Checklist &rarr;</Link>
          <Link href="/resources/website-cost-india" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">Website Cost in India &rarr;</Link>
        </div>
      </section>
      <section className="mt-16 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold text-text-primary">Need a website?</h2>
        <p className="text-text-muted mt-2">Get in touch to discuss your project.</p>
        <a href="mailto:hi.aditya.dev@gmail.com" className="inline-block mt-6 bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors duration-200">
          EMAIL ME &rarr;
        </a>
      </section>
    </div>
  );
}
