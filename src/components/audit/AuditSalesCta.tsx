'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { AuditFinding } from '@/lib/audit/types';
import { auditOffer } from '@/config/audit-offer';
import { CONTACT_EMAIL } from '@/config/contact';

interface AuditSalesCtaProps {
  hostname: string;
  overallScore: number;
  reportId: string;
  topFindings: AuditFinding[];
}

function getTopIssueTitles(findings: AuditFinding[], count: number): string {
  return findings
    .slice(0, count)
    .map((f, i) => `${i + 1}. ${f.title}`)
    .join('\n');
}

export default function AuditSalesCta({ hostname, overallScore, reportId, topFindings }: AuditSalesCtaProps) {
  const subject = auditOffer.emailSubject.replace('{{domain}}', hostname);

  const body = [
    `Hi Aditya,`,
    ``,
    `I just completed a website audit on ${hostname} and scored ${overallScore}/100.`,
    `Report ID: ${reportId}`,
    ``,
    `Top issues found:`,
    getTopIssueTitles(topFindings, 3),
    ``,
    `I am interested in the ${auditOffer.name} to fix these problems.`,
    ``,
    `Thanks.`,
  ].join('\n');

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const handleEmailClick = useCallback(() => {
    // Fire-and-forget event tracking
    fetch(`/api/audits/${reportId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'email_cta_clicked',
        metadata: { source: 'sales_cta' },
      }),
    }).catch(() => {
      // Swallow — tracking failure must not block the user
    });
  }, [reportId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      className="bg-bg-surface border-2 border-border-hard shadow-hard p-6 md:p-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-3">
        WANT THESE PROBLEMS FIXED?
      </h2>

      <p className="text-sm text-text-muted leading-relaxed mb-6">
        The <strong className="text-text-primary">{auditOffer.name}</strong> is a focused website redesign and optimization sprint for businesses whose audit reveals multiple high-impact problems. It addresses performance, SEO, trust and conversion issues directly — no open-ended retainers.
      </p>

      {/* Offer card */}
      <div className="bg-bg-surface-2 border border-border p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
          <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-maroon font-bold">
            {auditOffer.name}
          </span>
          <span className="text-2xl font-bold text-text-primary font-[family-name:var(--font-sans)]">
            {auditOffer.price}
          </span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed mb-2">
          {auditOffer.description}
        </p>
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="font-[family-name:var(--font-mono)] uppercase tracking-widest">PAYMENT</span> — {auditOffer.paymentTerms}
        </p>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={mailtoHref}
          onClick={handleEmailClick}
          className="inline-block bg-maroon text-white border border-border-hard px-6 py-4 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark hover:shadow-hard-hover transition-all duration-200 text-center"
        >
          EMAIL ADITYA ABOUT MY AUDIT →
        </a>

        <Link
          href="/packages"
          className="inline-block bg-bg-surface text-text-primary border border-border-hard px-6 py-4 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium hover:bg-bg-surface-2 transition-all duration-200 text-center"
        >
          VIEW EXISTING PACKAGES
        </Link>
      </div>
    </motion.div>
  );
}
