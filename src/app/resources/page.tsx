import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import ResourcesContent from './ResourcesContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateWebPageSchema } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Resources — Web Design Guides & Checklists',
  description: 'Practical resources for building better websites: portfolio checklists, frontend QA guides, website cost breakdowns, and redesign checklists. Written from real project experience by Aditya Singh.',
  path: '/resources',
});

export default function ResourcesPage() {
  const schema = generateWebPageSchema({
    path: '/resources',
    title: 'Resources — Web Design Guides & Checklists',
    description: 'Practical resources for building better websites.',
  });

  return (
    <>
      <JsonLd data={schema} />
      <ResourcesContent />
    </>
  );
}
