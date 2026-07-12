import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import MentoringContent from './MentoringContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateWebPageSchema, generateServiceSchema } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Project Help for Frontend Students & Small Businesses',
  description: 'Frontend project help for students, creators, and small businesses. Turn rough ideas, broken layouts, and unfinished projects into something cleaner and ready to show. Based in Delhi, remote worldwide.',
  path: '/mentoring',
  keywords: ['frontend project help', 'web design mentoring', 'portfolio help India'],
});

export default function MentoringPage() {
  const webPageSchema = generateWebPageSchema({
    path: '/mentoring',
    title: 'Project Help for Frontend Students & Small Businesses',
    description: 'Frontend project help for students, creators, and small businesses.',
  });

  const serviceSchema = generateServiceSchema({
    name: 'Frontend Project Help',
    description: 'One-on-one frontend guidance for students, creators, and small businesses who need help turning rough ideas into polished projects.',
    path: '/mentoring',
  });

  return (
    <>
      <JsonLd data={[webPageSchema, serviceSchema]} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-7xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Project Help</li>
        </ol>
      </nav>
      <MentoringContent />
    </>
  );
}
