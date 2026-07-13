import type { Metadata } from 'next';
import AuditReportClient from './AuditReportClient';

export const metadata: Metadata = {
  title: 'Website Audit Report | Aditya',
  description: 'Your website audit report.',
  robots: { index: false, follow: false, noarchive: true },
};

export default async function AuditReportPage({ params }: { params: Promise<{ auditId: string }> }) {
  const { auditId } = await params;
  return <AuditReportClient auditId={auditId} />;
}
