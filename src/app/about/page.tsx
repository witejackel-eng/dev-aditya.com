import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import AboutContent from './AboutContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateWebPageSchema } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Aditya Singh | Web Designer & Front-End Developer',
  description: 'Aditya Singh is a Delhi-based web designer and front-end developer specializing in premium business websites, Next.js applications, and interactive web experiences. Learn about his approach, skills, and background.',
  path: '/about',
});

export default function AboutPage() {
  const schema = generateWebPageSchema({
    path: '/about',
    title: 'About Aditya Singh | Web Designer & Front-End Developer',
    description: 'Aditya Singh is a Delhi-based web designer and front-end developer.',
  });

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-7xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">About</li>
        </ol>
      </nav>
      <AboutContent />
    </>
  );
}
