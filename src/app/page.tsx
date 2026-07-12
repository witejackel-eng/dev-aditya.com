import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import HomeContent from './HomeContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateWebPageSchema } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Web Designer & Next.js Developer in Delhi | Aditya Singh',
  description: 'Aditya Singh designs and develops fast, premium websites for service businesses, startups and independent brands in Delhi, across India and worldwide. Explore website packages and case studies.',
  path: '/',
});

export default function HomePage() {
  const webPageSchema = generateWebPageSchema({
    path: '/',
    title: 'Web Designer & Next.js Developer in Delhi | Aditya Singh',
    description: 'Aditya Singh designs and develops fast, premium websites for service businesses, startups and independent brands.',
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <HomeContent />
    </>
  );
}
