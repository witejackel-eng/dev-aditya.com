import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import CaseStudyContent from '@/components/CaseStudyContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateCreativeWorkSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Corporate Lead-Gen Platform — B2B Marketing Website Case Study',
  description: 'Case study: a polished B2B marketing platform built around modular sections, conversion-focused storytelling, and smooth motion. Built with React, Next.js, and Framer Motion.',
  path: '/work/corporate-leadgen-platform',
  type: 'article',
  publishedTime: '2026-07-10T00:00:00+05:30',
  modifiedTime: '2026-07-10T00:00:00+05:30',
  section: 'Case Study',
  keywords: ['B2B website', 'marketing platform', 'lead generation website'],
});

export default function CorporateCaseStudy() {
  const creativeWorkSchema = generateCreativeWorkSchema({
    title: 'Corporate Lead-Gen Platform — B2B Marketing Website',
    description: 'A polished marketing platform built around modular sections, conversion-focused storytelling, and smooth motion.',
    path: '/work/corporate-leadgen-platform',
    year: '2026',
    stack: 'React, Next.js, Framer Motion',
    liveUrl: 'https://corporate-leadgen-platform-jet.vercel.app/',
    codeRepository: 'https://github.com/witejackel-eng/corporate-leadgen-platform',
    keywords: ['B2B website', 'marketing platform', 'lead generation'],
    projectType: 'Portfolio Project',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Corporate Lead-Gen Platform', path: '/work/corporate-leadgen-platform' },
  ]);

  return (
    <>
      <JsonLd data={[creativeWorkSchema, breadcrumbs]} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-4xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/work" className="hover:text-maroon transition-colors">Work</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Corporate Lead-Gen Platform</li>
        </ol>
      </nav>
      <CaseStudyContent
        meta="CASE STUDY 02 · B2B MARKETING SITE · REACT / NEXT.JS / FRAMER MOTION · PORTFOLIO PROJECT"
        title="Designing a B2B lead-generation platform experience"
        summary="A polished marketing platform built around modular sections, conversion-focused storytelling, and smooth motion."
        proof={[
          { label: 'B2B marketing', value: 'Positioning, features, customer stories, case studies, FAQ, and CTA flow.' },
          { label: 'Modular system', value: 'Reusable sections for marketing pages.' },
          { label: 'Motion polish', value: 'Smooth animations without overwhelming the content.' },
        ]}
        problem="The goal was to create a landing experience that feels like a real enterprise SaaS platform, with enough structure to support product sections, proof, customer stories, case studies, pricing, and conversion CTAs."
        decision="Use a modern SaaS page structure: hero, trust strip, product features, dashboard preview, reasons to believe, technical showcase, customer stories, case studies, FAQ, and final CTA."
        built={[
          'SaaS-style landing page',
          'Product feature sections',
          'Dashboard preview area',
          'Case study cards',
          'FAQ section',
          'CTA sections',
          'Animation system',
          'Responsive layout',
          'Engineering showcase links',
        ]}
        proofText="The site uses clear product storytelling and structured sections so a visitor can understand the offer, inspect the product, see proof, and take action."
        honestMoment="The main risk was making the page look impressive while not becoming fake or bloated. Keep the copy believable, keep the UI clean, and do not invent unrealistic metrics."
        timeline={[
          { num: '01', title: 'Positioning', desc: 'Define the product story and user journey.' },
          { num: '02', title: 'Sections', desc: 'Create the full marketing page structure.' },
          { num: '03', title: 'Interface', desc: 'Build polished UI cards, dashboard elements, and motion.' },
          { num: '04', title: 'Conversion', desc: 'Add CTAs, FAQ, and trust-building sections.' },
        ]}
        stack="React, Next.js, Framer Motion, Tailwind CSS"
        liveUrl="https://corporate-leadgen-platform-jet.vercel.app/"
        githubUrl="https://github.com/witejackel-eng/corporate-leadgen-platform"
      />
    </>
  );
}
