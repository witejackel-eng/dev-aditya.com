'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import AuditProgress from '@/components/audit/AuditProgress';
import AuditScoreHero from '@/components/audit/AuditScoreHero';
import AuditScoreGrid from '@/components/audit/AuditScoreGrid';
import CoreWebVitalsTable from '@/components/audit/CoreWebVitalsTable';
import FindingsList from '@/components/audit/FindingsList';
import PositiveFindings from '@/components/audit/PositiveFindings';
import TechnologyList from '@/components/audit/TechnologyList';
import AuditCoverage from '@/components/audit/AuditCoverage';
import AuditLimitations from '@/components/audit/AuditLimitations';
import LeadUnlockForm from '@/components/audit/LeadUnlockForm';
import FullActionPlan from '@/components/audit/FullActionPlan';
import AuditSalesCta from '@/components/audit/AuditSalesCta';
import type { AuditStatus } from '@/lib/audit/types';

const PROCESSING_STATUSES: AuditStatus[] = ['queued', 'validating', 'fetching', 'performance', 'analyzing', 'scoring'];
const TERMINAL_STATUSES: AuditStatus[] = ['completed', 'partial', 'failed'];

interface AuditData {
  id: string;
  status: AuditStatus;
  hostname: string;
  normalizedUrl: string;
  createdAt: string;
  completedAt?: string;
  overallScore: number;
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesSecurityScore: number;
  mobileReadinessScore: number;
  conversionReadinessScore: number;
  coverage: number;
  safeErrorMessage?: string;
  isUnlocked: boolean;
  publicFindings?: any[];
  positiveFindings?: any[];
  technologies?: any[];
  pagespeed?: any;
  reportData?: any;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export default function AuditReportClient({ auditId }: { auditId: string }) {
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewedRecorded, setViewedRecorded] = useState(false);
  const [unlockFormViewed, setUnlockFormViewed] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchAudit = useCallback(async () => {
    try {
      const controller = new AbortController();
      abortRef.current = controller;
      const res = await fetch(`/api/audits/${auditId}`, { signal: controller.signal });
      if (!res.ok) {
        if (res.status === 404) { setError('Report not found. This audit may have expired.'); setLoading(false); return; }
        if (res.status === 410) { setError('This audit report has expired.'); setLoading(false); return; }
        throw new Error('Failed to load report');
      }
      const data = await res.json();
      setAudit(data);
      setLoading(false);
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') return null;
      setError('Could not load the audit report. Please try again.');
      setLoading(false);
      return null;
    }
  }, [auditId]);

  // Initial fetch + polling
  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      const data = await fetchAudit();
      if (!data || !mounted) return;
      if (TERMINAL_STATUSES.includes(data.status)) {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      }
    };
    poll();
    pollRef.current = setInterval(poll, 2000);
    return () => {
      mounted = false;
      if (pollRef.current) clearInterval(pollRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchAudit]);

  // Record public_report_viewed event once
  useEffect(() => {
    if (audit && !viewedRecorded && TERMINAL_STATUSES.includes(audit.status)) {
      setViewedRecorded(true);
      fetch(`/api/audits/${auditId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'public_report_viewed' }),
      }).catch(() => {});
    }
  }, [audit, viewedRecorded, auditId]);

  // Record unlock_form_viewed event once
  useEffect(() => {
    if (audit && !unlockFormViewed && TERMINAL_STATUSES.includes(audit.status) && !audit.isUnlocked) {
      setUnlockFormViewed(true);
      fetch(`/api/audits/${auditId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'unlock_form_viewed' }),
      }).catch(() => {});
    }
  }, [audit, unlockFormViewed, auditId]);

  const handleUnlockSuccess = useCallback((data: any) => {
    setAudit(prev => prev ? { ...prev, isUnlocked: true, reportData: data.reportData } : prev);
    // Focus action plan section
    setTimeout(() => {
      const el = document.getElementById('full-action-plan');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el?.focus({ preventScroll: true });
    }, 300);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    fetchAudit();
  }, [fetchAudit]);

  // Loading state
  if (loading) {
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center">
              <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">Loading report</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !audit) {
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-lg mx-auto text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Error</p>
            <h1 className="text-2xl font-bold text-text-primary mb-4">Could not load audit report</h1>
            <p className="text-text-muted mb-8">{error || 'Something went wrong.'}</p>
            <button
              onClick={handleRetry}
              className="bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processing state
  if (PROCESSING_STATUSES.includes(audit.status)) {
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-xl mx-auto">
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted mb-2">{audit.normalizedUrl}</p>
            <AuditProgress status={audit.status} />
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (audit.status === 'failed') {
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-lg mx-auto text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Audit Failed</p>
            <h1 className="text-2xl font-bold text-text-primary mb-4">We could not complete this audit</h1>
            <p className="text-text-muted mb-8">{audit.safeErrorMessage || 'The website could not be analyzed. This may be a temporary issue.'}</p>
            <button
              onClick={handleRetry}
              className="bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed/Partial report
  const rd = audit.reportData;
  const isUnlocked = audit.isUnlocked;
  const publicFindings = audit.publicFindings || [];
  const positiveFindings = audit.positiveFindings || [];
  const technologies = audit.technologies || [];

  return (
    <div className="pt-[100px] min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Report Header */}
        <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }} className="py-8 border-b border-border mb-8">
          <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-2">
            Website Revenue Audit
          </motion.p>
          <motion.p variants={fadeUp} className="text-text-muted text-sm">
            {audit.hostname} &mdash; {new Date(audit.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
        </motion.div>

        {/* Overall Score */}
        <AuditScoreHero
          score={audit.overallScore}
          hostname={audit.hostname}
          timestamp={audit.createdAt}
          coverage={audit.coverage}
        />

        {/* Category Scores */}
        <AuditScoreGrid
          scores={{
            performance: audit.performanceScore,
            seo: audit.seoScore,
            accessibility: audit.accessibilityScore,
            bestPracticesSecurity: audit.bestPracticesSecurityScore,
            mobileReadiness: audit.mobileReadinessScore,
            conversionReadiness: audit.conversionReadinessScore,
          }}
        />

        {/* Core Web Vitals */}
        {rd?.pagespeed && <CoreWebVitalsTable pagespeed={rd.pagespeed} />}

        {/* Coverage */}
        {audit.coverage < 5 && <AuditCoverage coverage={audit.coverage} totalChecks={5} />}

        {/* Priority Findings (public) */}
        <FindingsList findings={publicFindings} limit={3} heading="What Needs Attention." />

        {/* Positive Findings (public) */}
        {positiveFindings.length > 0 && <PositiveFindings findings={positiveFindings.slice(0, 3)} />}

        {/* Technology */}
        {technologies.length > 0 && <TechnologyList technologies={technologies} />}

        {/* Limitations */}
        <AuditLimitations />

        {/* Unlock Section OR Full Report */}
        {!isUnlocked ? (
          <div className="py-16 border-t border-border-hard mt-12">
            <LeadUnlockForm auditId={auditId} onSuccess={handleUnlockSuccess} />
          </div>
        ) : (
          <div id="full-action-plan" tabIndex={-1} className="outline-none">
            {/* Full Findings */}
            {rd?.findings && rd.findings.length > 3 && (
              <FindingsList findings={rd.findings} heading="All Findings." />
            )}

            {/* Action Plan */}
            {rd?.recommendations && (
              <FullActionPlan
                quickWins={rd.recommendations.quickWins || []}
                technicalImprovements={rd.recommendations.technicalImprovements || []}
                designConversion={rd.recommendations.designConversion || []}
                nextAction={rd.recommendations.nextAction || 'No major rebuild indicated'}
              />
            )}

            {/* Sales CTA */}
            <AuditSalesCta
              hostname={audit.hostname}
              overallScore={audit.overallScore}
              reportId={auditId}
              topFindings={publicFindings.slice(0, 3)}
            />
          </div>
        )}

        <div className="pb-16" />
      </div>
    </div>
  );
}
