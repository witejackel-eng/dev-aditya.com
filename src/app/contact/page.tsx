import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import ContactContent from './ContactContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateContactPageSchema } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Aditya Singh for a Website Project',
  description: 'Get in touch with Aditya Singh to discuss your website project. Based in Delhi, available for remote work worldwide. Send your project details and get a response within 24 hours.',
  path: '/contact',
});

export default function ContactPage() {
  const schema = generateContactPageSchema();

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-7xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Contact</li>
        </ol>
      </nav>
      <ContactContent />
    </>
  );
}
