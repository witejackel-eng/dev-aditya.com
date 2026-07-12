'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AuditUrlForm from '@/components/audit/AuditUrlForm';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const specRows = [
  { label: 'MOBILE SPEED', value: 'LIGHTHOUSE DATA' },
  { label: 'SEO FOUNDATION', value: 'PAGE STRUCTURE' },
  { label: 'ACCESSIBILITY', value: 'AUTOMATED CHECKS' },
  { label: 'SECURITY', value: 'PUBLIC HEADERS' },
  { label: 'CONVERSION', value: 'HEURISTIC REVIEW' },
];

function AuditPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUrl = searchParams.get('url') || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (url: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      // Start the audit run
      const runRes = await fetch(`/api/audits/${data.auditId}/run`, { method: 'POST' });
      if (!runRes.ok) {
        const runData = await runRes.json();
        setError(runData.error || 'Could not start the audit. Please try again.');
        return;
      }
      router.push(`/audit/${data.auditId}`);
    } catch (err) {
      setError('Could not connect. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  return (
    <div className="pt-[100px] min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-16 md:py-24"
        >
          {/* Left column */}
          <div className="lg:col-span-7">
            <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
              Free Website Revenue Audit
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-text-primary uppercase">
              How much business is your website losing?
            </motion.h1>
            <motion.p variants={fadeUp} className="text-text-muted text-base md:text-lg mt-6 leading-relaxed max-w-xl">
              Enter your website URL to check its mobile performance, SEO foundations, accessibility, technical best practices and conversion readiness.
            </motion.p>

            {/* URL Form */}
            <motion.div variants={fadeUp} className="mt-8">
              <AuditUrlForm
                onNavigateToAudit={handleSubmit}
                initialUrl={initialUrl}
                isSubmitting={isSubmitting}
                error={error}
              />
            </motion.div>
          </div>

          {/* Right column - Spec card */}
          <div className="lg:col-span-5">
            <motion.div
              variants={fadeUp}
              className="bg-bg-surface border border-border-hard shadow-hard"
            >
              <div className="px-5 py-3 border-b border-border-hard bg-bg-surface-2">
                <h2 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-text-primary font-medium">
                  What I Check
                </h2>
              </div>
              <div className="divide-y divide-border">
                {specRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-5 py-3">
                    <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-text-primary">
                      {row.label}
                    </span>
                    <span className="text-xs text-text-muted">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-border">
                <p className="text-xs text-text-muted leading-relaxed">
                  This is a public configuration audit, not a penetration test.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default function AuditPageClient() {
  return (
    <Suspense fallback={
      <div className="pt-[100px] min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-muted font-[family-name:var(--font-mono)] text-sm">Loading...</p>
      </div>
    }>
      <AuditPageContent />
    </Suspense>
  );
}
