import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Content from './Content';
import JsonLd from '@/components/seo/JsonLd';
import { generateArticleSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Next.js vs WordPress: Which Is Better for Your Business Website?',
  description: 'An honest comparison of Next.js and WordPress for business websites in 2026. Covers performance, SEO, customization, content management, maintenance, and when each platform is the right choice.',
  path: '/resources/nextjs-vs-wordpress',
  type: 'article',
  publishedTime: '2026-07-12T00:00:00+05:30',
  modifiedTime: '2026-07-12T00:00:00+05:30',
  section: 'Web Development',
  keywords: ['Next.js vs WordPress', 'Next.js business website', 'WordPress alternative', 'static site vs CMS'],
});

export default function NextjsVsWordpressPage() {
  const articleSchema = generateArticleSchema({
    headline: 'Next.js vs WordPress: Which Is Better for Your Business Website?',
    description: 'An honest comparison of Next.js and WordPress for business websites in 2026. Covers performance, SEO, customization, content management, maintenance, and when each platform is the right choice.',
    path: '/resources/nextjs-vs-wordpress',
    datePublished: '2026-07-12T00:00:00+05:30',
    dateModified: '2026-07-12T00:00:00+05:30',
    section: 'Web Development',
    keywords: ['Next.js vs WordPress', 'Next.js business website', 'WordPress alternative', 'static site vs CMS'],
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Next.js vs WordPress', path: '/resources/nextjs-vs-wordpress' },
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
          <li className="text-text-primary" aria-current="page">Next.js vs WordPress</li>
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
          <Link href="/services/nextjs-development" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">Next.js Development Services &rarr;</Link>
          <Link href="/resources/website-cost-india" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">Website Cost in India &rarr;</Link>
          <Link href="/work/saffron-steam-experience" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">Saffron Steam Case Study &rarr;</Link>
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
