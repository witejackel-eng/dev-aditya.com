'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import type { AuditStatus, AuditFinding, TechnologyDetection } from '@/lib/audit/types';
import type { PublicAuditDto, FullAuditDto, AuditCoverageDto, PublicPageSpeedSummary, PublicTechnologyDetection } from '@/lib/audit/dto';

const PROCESSING_STATUSES: AuditStatus[] = ['queued', 'validating', 'fetching', 'performance', 'analyzing', 'scoring'];
const TERMINAL_STATUSES: AuditStatus[] = ['completed', 'partial', 'failed'];

type ReportState =
  | { phase: 'loading' }
  | { phase: 'not_found'; message: string }
  | { phase: 'expired'; message: string }
  | { phase: 'error'; message: string }
  | { phase: 'unavailable'; message: string }
  | { phase: 'processing'; status: AuditStatus; hostname: string; normalizedUrl: string }
  | { phase: 'failed'; message: string; normalizedUrl: string }
  | { phase: 'public'; audit: PublicAuditDto }
  | { phase: 'full'; audit: FullAuditDto };

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export default function AuditReportClient({ auditId }: { auditId: string }) {
  const router = useRouter();
  const [state, setState] = useState<ReportState>({ phase: 'loading' });
  const [viewedRecorded, setViewedRecorded] = useState(false);
  const [unlockFormViewed, setUnlockFormViewed] = useState(false);
  const [emailSentMessage, setEmailSentMessage] = useState<string | null>(null);

  // Refs for polling control
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pollingRef = useRef(false);
  const runStartedRef = useRef(false);
  const mountedRef = useRef(true);

  // ── Fetch audit data ──
  const fetchAudit = useCallback(async (): Promise<PublicAuditDto | FullAuditDto | null> => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(`/api/audits/${auditId}`, { signal: controller.signal });
      if (!res.ok) {
        if (res.status === 404) {
          setState({ phase: 'not_found', message: 'Report not found. This audit may have expired.' });
          return null;
        }
        if (res.status === 410) {
          setState({ phase: 'expired', message: 'This audit report has expired.' });
          return null;
        }
        if (res.status === 503) {
          setState({ phase: 'unavailable', message: 'This feature is currently unavailable. Please try again later.' });
          return null;
        }
        throw new Error('Failed to load report');
      }

      const data = await res.json() as PublicAuditDto | FullAuditDto;
      return data;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return null;
      setState({ phase: 'error', message: 'Could not load the audit report. Please try again.' });
      return null;
    }
  }, [auditId]);

  // ── Start the audit scan (call /run) with Strict Mode guard ──
  const startScan = useCallback(async () => {
    if (runStartedRef.current) return;
    runStartedRef.current = true;

    try {
      await fetch(`/api/audits/${auditId}/run`, { method: 'POST' });
    } catch {
      // 409 "already in progress" is normal; swallow errors
    }
  }, [auditId]);

  // ── Polling loop ──
  const poll = useCallback(async () => {
    if (pollingRef.current || !mountedRef.current) return;
    pollingRef.current = true;

    try {
      const data = await fetchAudit();
      if (!data || !mountedRef.current) return;

      if (TERMINAL_STATUSES.includes(data.status)) {
        // Stop polling
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
        applyAuditData(data);
      }
      // Otherwise continue polling — data is already applied by applyAuditData
    } finally {
      pollingRef.current = false;
    }
  }, [fetchAudit]);

  // ── Apply audit data to state ──
  const applyAuditData = useCallback((data: PublicAuditDto | FullAuditDto) => {
    if (PROCESSING_STATUSES.includes(data.status)) {
      setState({ phase: 'processing', status: data.status, hostname: data.hostname, normalizedUrl: data.normalizedUrl });
    } else if (data.status === 'failed') {
      setState({ phase: 'failed', message: data.safeErrorMessage || 'The website could not be analyzed. This may be a temporary issue.', normalizedUrl: data.normalizedUrl });
    } else if (data.isUnlocked) {
      setState({ phase: 'full', audit: data as FullAuditDto });
    } else {
      setState({ phase: 'public', audit: data as PublicAuditDto });
    }
  }, []);

  // ── Initial load: fetch audit, start scan if queued, begin polling ──
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const init = async () => {
      const data = await fetchAudit();
      if (!data || cancelled) return;

      // If queued, start the scan
      if (data.status === 'queued') {
        await startScan();
      }

      // Apply data immediately
      applyAuditData(data);

      // If still processing, start polling
      if (PROCESSING_STATUSES.includes(data.status)) {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        pollTimerRef.current = setInterval(poll, 2000);
      }
    };

    init();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditId]);

  // ── Record public_report_viewed event once ──
  useEffect(() => {
    if ((state.phase === 'public' || state.phase === 'full') && !viewedRecorded) {
      setViewedRecorded(true);
      fetch(`/api/audits/${auditId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'public_report_viewed' }),
      }).catch(() => {});
    }
  }, [state, viewedRecorded, auditId]);

  // ── Record unlock_form_viewed event once ──
  useEffect(() => {
    if (state.phase === 'public' && !unlockFormViewed) {
      setUnlockFormViewed(true);
      fetch(`/api/audits/${auditId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'unlock_form_viewed' }),
      }).catch(() => {});
    }
  }, [state, unlockFormViewed, auditId]);

  // ── Handle unlock success ──
  const handleUnlockSuccess = useCallback((data: { success: boolean; emailSent: boolean; emailMessage?: string }) => {
    setEmailSentMessage(
      data.emailSent
        ? null
        : data.emailMessage || 'Email delivery could not be confirmed, but you can access the complete report here.'
    );

    // Re-fetch the audit which now has the cookie → returns FullAuditDto
    fetchAudit().then((fullData) => {
      if (fullData && fullData.isUnlocked) {
        setState({ phase: 'full', audit: fullData as FullAuditDto });
        // Scroll and focus action plan
        setTimeout(() => {
          const el = document.getElementById('full-action-plan');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.focus({ preventScroll: true });
          }
        }, 300);

        // Record full_report_viewed event
        fetch(`/api/audits/${auditId}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType: 'full_report_viewed' }),
        }).catch(() => {});
      }
    });
  }, [fetchAudit, auditId]);

  // ── Handle retry for failed audits: link to new audit with original URL ──
  const handleRetry = useCallback(() => {
    let url = '';
    if (state.phase === 'failed' && state.normalizedUrl) {
      url = state.normalizedUrl;
    } else if (state.phase === 'error') {
      // Try to re-fetch
      setState({ phase: 'loading' });
      fetchAudit();
      return;
    }
    router.push(url ? `/audit?url=${encodeURIComponent(url)}` : '/audit');
  }, [state, router, fetchAudit]);

  // ──────────────────────────────────────────────────────────
  // Render states
  // ──────────────────────────────────────────────────────────

  // Loading
  if (state.phase === 'loading') {
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">Loading report</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found / Expired / Error / Unavailable
  if (state.phase === 'not_found' || state.phase === 'expired' || state.phase === 'error' || state.phase === 'unavailable') {
    const title = state.phase === 'unavailable' ? 'Feature Unavailable' : state.phase === 'expired' ? 'Report Expired' : 'Could not load audit report';
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-lg mx-auto text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">{state.phase === 'unavailable' ? 'Unavailable' : 'Error'}</p>
            <h1 className="text-2xl font-bold text-text-primary mb-4">{title}</h1>
            <p className="text-text-muted mb-8">{state.message}</p>
            {state.phase !== 'unavailable' && (
              <button
                onClick={handleRetry}
                className="bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Processing
  if (state.phase === 'processing') {
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-xl mx-auto">
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted mb-2">{state.normalizedUrl}</p>
            <AuditProgress status={state.status} />
          </div>
        </div>
      </div>
    );
  }

  // Failed
  if (state.phase === 'failed') {
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-lg mx-auto text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Audit Failed</p>
            <h1 className="text-2xl font-bold text-text-primary mb-4">We could not complete this audit</h1>
            <p className="text-text-muted mb-8">{state.message}</p>
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

  // Public report (not unlocked)
  if (state.phase === 'public') {
    const audit = state.audit;
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <ReportHeader hostname={audit.hostname} createdAt={audit.createdAt} cacheHit={audit.cacheHit} />
          <AuditScoreHero score={audit.overallScore ?? 0} hostname={audit.hostname} timestamp={audit.createdAt} coverage={audit.coverage.completed} />
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
          {audit.pageSpeedSummary && <CoreWebVitalsTable pageSpeedSummary={audit.pageSpeedSummary} />}
          {audit.coverage.completed < 6 && <AuditCoverage coverage={audit.coverage.completed} totalChecks={6} />}
          <FindingsList findings={audit.publicFindings} limit={3} heading="What Needs Attention." />
          {audit.positiveFindings.length > 0 && <PositiveFindings findings={audit.positiveFindings.slice(0, 3)} />}
          {audit.technologies.length > 0 && <TechnologyList technologies={audit.technologies} />}
          <AuditLimitations limitations={audit.limitations} />
          <div className="py-16 border-t border-border-hard mt-12">
            <LeadUnlockForm auditId={auditId} onSuccess={handleUnlockSuccess} />
          </div>
          <div className="pb-16" />
        </div>
        {/* Accessible live region for announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true" />
      </div>
    );
  }

  // Full report (unlocked)
  if (state.phase === 'full') {
    const audit = state.audit;
    const rd = audit.reportData;
    const allFindings = rd?.findings ?? audit.publicFindings;

    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <ReportHeader hostname={audit.hostname} createdAt={audit.createdAt} cacheHit={audit.cacheHit} />
          {emailSentMessage && (
            <div role="status" className="mb-6 bg-bg-surface border border-border p-3 text-sm text-text-muted">
              {emailSentMessage}
            </div>
          )}
          <AuditScoreHero score={audit.overallScore ?? 0} hostname={audit.hostname} timestamp={audit.createdAt} coverage={audit.coverage.completed} />
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
          {audit.pageSpeedSummary && <CoreWebVitalsTable pageSpeedSummary={audit.pageSpeedSummary} />}
          {audit.coverage.completed < 6 && <AuditCoverage coverage={audit.coverage.completed} totalChecks={6} />}
          <FindingsList findings={audit.publicFindings} limit={3} heading="What Needs Attention." />
          {audit.positiveFindings.length > 0 && <PositiveFindings findings={audit.positiveFindings.slice(0, 3)} />}
          {audit.technologies.length > 0 && <TechnologyList technologies={audit.technologies} />}
          <AuditLimitations limitations={audit.limitations} />

          {/* Full unlocked content */}
          <div id="full-action-plan" tabIndex={-1} className="outline-none">
            {allFindings.length > 3 && (
              <FindingsList findings={allFindings} heading="All Findings." />
            )}
            {rd && (() => {
              const rdObj = rd as unknown as Record<string, unknown>;
              const recs = rdObj.recommendations as Record<string, unknown> | undefined;
              if (!recs) return null;
              return (
                <FullActionPlan
                  quickWins={(recs.quickWins as AuditFinding[]) || []}
                  technicalImprovements={(recs.technicalImprovements as AuditFinding[]) || []}
                  designConversion={(recs.designConversion as AuditFinding[]) || []}
                  nextAction={(recs.nextAction as string) || 'No major rebuild indicated'}
                />
              );
            })()}
            <AuditSalesCta
              hostname={audit.hostname}
              overallScore={audit.overallScore ?? 0}
              reportId={auditId}
              topFindings={audit.publicFindings.slice(0, 3)}
            />
          </div>

          <div className="pb-16" />
        </div>
        {/* Accessible live region for unlock announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {state.phase === 'full' ? 'Full report unlocked. Complete action plan is now visible.' : ''}
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

function ReportHeader({ hostname, createdAt, cacheHit }: { hostname: string; createdAt: string; cacheHit: boolean }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }} className="py-8 border-b border-border mb-8">
      <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-2">
        Website Revenue Audit
        {cacheHit && <span className="ml-2 text-text-muted normal-case tracking-normal">[cached result]</span>}
      </motion.p>
      <motion.p variants={fadeUp} className="text-text-muted text-sm">
        {hostname} &mdash; {new Date(createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </motion.p>
    </motion.div>
  );
}
