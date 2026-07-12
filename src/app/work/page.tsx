import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import WorkContent from './WorkContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Web Design & Next.js Case Studies',
  description: 'Selected case studies showcasing business websites, e-commerce builds, interactive experiences, and marketing platforms designed and developed by Aditya Singh with React, Next.js, and TypeScript.',
  path: '/work',
});

export default function WorkPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 max-w-7xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Work</li>
        </ol>
      </nav>
      <WorkContent />
    </>
  );
}
