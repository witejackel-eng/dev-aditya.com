import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Content from './Content';
import JsonLd from '@/components/seo/JsonLd';
import { generateArticleSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'How Much Does a Business Website Cost in India?',
  description: 'A practical, experience-based breakdown of business website costs in India in 2026, from starter single-page sites at ₹15,000 to premium multi-page builds at ₹75,000+. Understand what affects pricing and what you should expect.',
  path: '/resources/website-cost-india',
  type: 'article',
  publishedTime: '2026-07-12T00:00:00+05:30',
  modifiedTime: '2026-07-12T00:00:00+05:30',
  section: 'Web Design',
  keywords: ['website cost India', 'website design price India', 'how much does a website cost in India', 'freelance web designer pricing'],
});

export default function WebsiteCostIndiaPage() {
  const articleSchema = generateArticleSchema({
    headline: 'How Much Does a Business Website Cost in India?',
    description: 'A practical, experience-based breakdown of business website costs in India in 2026, from starter single-page sites at ₹15,000 to premium multi-page builds at ₹75,000+.',
    path: '/resources/website-cost-india',
    datePublished: '2026-07-12T00:00:00+05:30',
    dateModified: '2026-07-12T00:00:00+05:30',
    section: 'Web Design',
    keywords: ['website cost India', 'website design price India', 'how much does a website cost in India', 'freelance web designer pricing'],
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Website Cost India', path: '/resources/website-cost-india' },
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
          <li className="text-text-primary" aria-current="page">Website Cost India</li>
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
          <Link href="/packages" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">Website Packages &rarr;</Link>
          <Link href="/resources/choose-freelance-web-designer-india" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">How to Choose a Freelance Web Designer in India &rarr;</Link>
          <Link href="/services/business-websites" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">Business Website Services &rarr;</Link>
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
