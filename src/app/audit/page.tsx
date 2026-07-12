import type { Metadata } from 'next';
import AuditPageClient from './AuditPageClient';

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
  return <AuditPageClient />;
}
