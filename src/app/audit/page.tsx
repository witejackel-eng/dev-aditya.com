import type { Metadata } from 'next';
import AuditPageClient from './AuditPageClient';
import { isAuditEnabled } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Free Website Audit — Performance, SEO & Conversion | Aditya',
  description: 'Run a free public-page website audit covering mobile performance, SEO foundations, accessibility, security headers and conversion readiness.',
  alternates: { canonical: 'https://dev-aditya.com/audit' },
  openGraph: {
    title: 'Free Website Audit — Performance, SEO & Conversion | Aditya',
    description: 'Run a free public-page website audit covering mobile performance, SEO foundations, accessibility, security headers and conversion readiness.',
    url: 'https://dev-aditya.com/audit',
    siteName: 'Aditya Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Website Audit — Performance, SEO & Conversion | Aditya',
    description: 'Run a free public-page website audit covering mobile performance, SEO foundations, accessibility, security headers and conversion readiness.',
  },
  robots: { index: true, follow: true },
};

export default function AuditPage() {
  if (!isAuditEnabled) {
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-lg mx-auto text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Unavailable</p>
            <h1 className="text-2xl font-bold text-text-primary mb-4">This Feature Is Currently Unavailable</h1>
            <p className="text-text-muted">The website audit feature is temporarily unavailable. Please check back later.</p>
          </div>
        </div>
      </div>
    );
  }

  return <AuditPageClient />;
}
