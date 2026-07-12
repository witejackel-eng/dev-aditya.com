import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Content from './Content';
import JsonLd from '@/components/seo/JsonLd';
import { generateArticleSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'AI Website Agency Starter Notes',
  description: 'Notes on using AI tools to package website services, automate lead capture, and build chatbots for small businesses. Honest constraints, ethical limits, and practical considerations.',
  path: '/resources/ai-website-agency',
  type: 'article',
  publishedTime: '2026-07-10T00:00:00+05:30',
  modifiedTime: '2026-07-12T00:00:00+05:30',
  section: 'AI & Web Design',
  keywords: ['AI website agency', 'AI web design tools', 'freelance web design AI'],
});

export default function AIWebsiteAgencyPage() {
  const articleSchema = generateArticleSchema({
    headline: 'AI Website Agency Starter Notes',
    description: 'Notes on using AI tools to package website services, automate lead capture, and build chatbots for small businesses.',
    path: '/resources/ai-website-agency',
    datePublished: '2026-07-10T00:00:00+05:30',
    dateModified: '2026-07-12T00:00:00+05:30',
    section: 'AI & Web Design',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'AI Website Agency', path: '/resources/ai-website-agency' },
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
          <li className="text-text-primary" aria-current="page">AI Website Agency</li>
        </ol>
      </nav>
      <Content />
    </div>
  );
}
