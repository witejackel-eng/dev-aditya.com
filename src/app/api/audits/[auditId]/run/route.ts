/**
 * POST /api/audits/[auditId]/run
 *
 * Execute the audit pipeline for a queued audit.
 *
 * - Atomically claim audit in 'queued' status (update to 'validating' with WHERE status='queued')
 * - Prevent duplicate simultaneous runs
 * - If already completed/partial: return ONLY { auditId, status } — never reportData
 * - Run the audit using runAudit() with status update callback
 * - Calculate scores, generate findings, recommendations
 * - Save normalized report data to DB
 * - Mark completed or partial
 * - If failed: save safe error message
 * - Idempotent behavior
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

import { db } from '@/db';
import { audits, auditEvents } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { SCANNER_VERSION } from '@/lib/audit/constants';
import { runAudit } from '@/lib/audit/run-audit';
import { generateFindings } from '@/lib/audit/finding-rules';
import { generateRecommendations } from '@/lib/audit/recommendations';
import type { AuditReportData } from '@/lib/audit/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds

// ──────────────────────────────────────────────────────────────
// Status update callback
// ──────────────────────────────────────────────────────────────

function createStatusUpdater(auditId: string) {
  return async (status: string): Promise<void> => {
    try {
      const updateData: Record<string, unknown> = { status };

      if (status === 'validating') {
        updateData.started_at = new Date();
      }

      await db
        .update(audits)
        .set(updateData)
        .where(eq(audits.id, auditId));

      // Record event
      const eventMap: Record<string, string> = {
        validating: 'audit_started',
        fetching: 'audit_started',
        performance: 'audit_started',
        analyzing: 'audit_started',
        scoring: 'audit_started',
        completed: 'audit_completed',
      };

      const eventType = eventMap[status];
      if (eventType) {
        await db.insert(auditEvents).values({
          id: crypto.randomUUID(),
          audit_id: auditId,
          event_type: eventType,
          metadata: { status },
          created_at: new Date(),
        }).catch(() => {});
      }
    } catch (err) {
      console.error('[audit:run] Failed to update status:', err instanceof Error ? err.message : String(err));
    }
  };
}

// ──────────────────────────────────────────────────────────────
// Route handler
// ──────────────────────────────────────────────────────────────

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ auditId: string }> },
) {
  try {
    const { auditId } = await params;

    if (!auditId || typeof auditId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid audit ID.' },
        { status: 400 },
      );
    }

    // ── Atomic claim: only proceed if still 'queued' ──
    const claimResult = await db
      .update(audits)
      .set({
        status: 'validating',
        started_at: new Date(),
        scanner_version: SCANNER_VERSION,
      })
      .where(and(eq(audits.id, auditId), eq(audits.status, 'queued')))
      .returning();

    if (!claimResult || claimResult.length === 0) {
      // No row was updated — fetch current status to determine response
      const auditRows = await db
        .select({ status: audits.status })
        .from(audits)
        .where(eq(audits.id, auditId))
        .limit(1);

      const audit = auditRows[0];

      if (!audit) {
        return NextResponse.json(
          { error: 'Audit not found.' },
          { status: 404 },
        );
      }

      // Already completed/partial — return status only
      if (audit.status === 'completed' || audit.status === 'partial') {
        return NextResponse.json({ auditId, status: audit.status });
      }

      // Already running — 409 Conflict
      if (audit.status !== 'queued' && audit.status !== 'failed') {
        return NextResponse.json(
          { auditId, status: audit.status, message: 'Audit is already in progress.' },
          { status: 409 },
        );
      }

      // Failed — 422, do NOT restart automatically
      if (audit.status === 'failed') {
        return NextResponse.json(
          { auditId, status: 'failed', message: 'Audit previously failed. Create a new audit to retry.' },
          { status: 422 },
        );
      }

      // Fallback
      return NextResponse.json({ auditId, status: audit.status });
    }

    // ── Run the audit pipeline ──
    const updateStatus = createStatusUpdater(auditId);

    let reportData: AuditReportData;
    let finalStatus: 'completed' | 'partial' | 'failed' = 'completed';

    try {
      reportData = await runAudit(
        auditId,
        claimResult[0].normalized_url,
        claimResult[0].hostname,
        updateStatus,
      );

      // ── Generate findings (if not already in reportData) ──
      if (!reportData.findings || reportData.findings.length === 0) {
        reportData.findings = generateFindings(reportData);
      }

      // ── Generate recommendations ──
      const recommendations = generateRecommendations(
        reportData.findings,
        {
          performance: reportData.scores.performance ?? 0,
          seo: reportData.scores.seo ?? 0,
          accessibility: reportData.scores.accessibility ?? 0,
          bestPracticesSecurity: reportData.scores.bestPracticesSecurity ?? 0,
          mobileReadiness: reportData.scores.mobileReadiness ?? 0,
          conversionReadiness: reportData.scores.conversionReadiness ?? 0,
        },
      );

      (reportData as unknown as Record<string, unknown>).recommendations = recommendations;

      // ── Determine final status ──
      const hasPartialData =
        reportData.pageSpeed.mobile === null && reportData.pageSpeed.desktop === null &&
        reportData.htmlAnalysis === null;

      if (hasPartialData) {
        finalStatus = 'failed';
      } else if (
        reportData.pageSpeed.mobile === null ||
        reportData.htmlAnalysis === null ||
        reportData.seoAnalysis === null
      ) {
        finalStatus = 'partial';
      } else {
        finalStatus = 'completed';
      }
    } catch (err) {
      console.error('[audit:run] Audit pipeline failed:', err instanceof Error ? err.message : String(err));
      finalStatus = 'failed';

      reportData = {
        scannerVersion: SCANNER_VERSION,
        pageSpeed: { mobile: null, desktop: null },
        htmlAnalysis: null,
        seoAnalysis: null,
        securityAnalysis: null,
        technologies: [],
        conversionAnalysis: null,
        findings: [],
        freeFindingCount: 3,
        scores: {
          overall: null,
          performance: null,
          seo: null,
          accessibility: null,
          bestPracticesSecurity: null,
          mobileReadiness: null,
          conversionReadiness: null,
        },
      };
    }

    // ── Save results to DB ──
    const safeErrorMessage = finalStatus === 'failed'
      ? 'The audit could not be completed. The website may be temporarily unreachable or blocking automated analysis.'
      : null;

    const scores = reportData.scores;

    await db
      .update(audits)
      .set({
        status: finalStatus,
        overall_score: scores.overall,
        performance_score: scores.performance,
        seo_score: scores.seo,
        accessibility_score: scores.accessibility,
        best_practices_security_score: scores.bestPracticesSecurity,
        mobile_readiness_score: scores.mobileReadiness,
        conversion_readiness_score: scores.conversionReadiness,
        coverage: calculateCoverage(reportData),
        report_data: reportData as unknown as Record<string, unknown>,
        completed_at: new Date(),
        safe_error_message: safeErrorMessage,
        scanner_version: SCANNER_VERSION,
      })
      .where(eq(audits.id, auditId));

    // ── Record completion event ──
    const eventType = finalStatus === 'failed' ? 'audit_failed' : finalStatus === 'partial' ? 'audit_partial' : 'audit_completed';
    try {
      await db.insert(auditEvents).values({
        id: crypto.randomUUID(),
        audit_id: auditId,
        event_type: eventType,
        metadata: {
          status: finalStatus,
          overallScore: scores.overall,
          findingCount: reportData.findings.length,
        },
        created_at: new Date(),
      });
    } catch {
      // Non-critical
    }

    // ── Return minimal response — NEVER include reportData ──
    if (finalStatus === 'failed') {
      return NextResponse.json(
        {
          auditId,
          status: 'failed',
          error: safeErrorMessage,
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      auditId,
      status: finalStatus,
    }, {
      headers: {
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('[audit:run] Unexpected error:', err instanceof Error ? err.message : String(err));

    // Try to mark the audit as failed
    try {
      const { auditId: fallbackId } = await params;
      if (fallbackId) {
        await db
          .update(audits)
          .set({
            status: 'failed',
            safe_error_message: 'An unexpected error occurred during the audit. Please try again.',
            completed_at: new Date(),
          })
          .where(eq(audits.id, fallbackId));
      }
    } catch {
      // Best effort
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred during the audit. Please try again.' },
      { status: 500 },
    );
  }
}

// ──────────────────────────────────────────────────────────────
// Coverage calculation — count of 6 modules that completed
// ──────────────────────────────────────────────────────────────

function calculateCoverage(data: AuditReportData): number {
  let coverage = 0;
  // 1. Performance: at least one PageSpeed result
  if (data.pageSpeed?.mobile != null || data.pageSpeed?.desktop != null) coverage++;
  // 2. HTML analysis
  if (data.htmlAnalysis != null) coverage++;
  // 3. SEO analysis
  if (data.seoAnalysis != null) coverage++;
  // 4. Security analysis
  if (data.securityAnalysis != null) coverage++;
  // 5. Technology detection: counts as completed only if the detector ran,
  //    NOT just because the array exists (it could be empty).
  //    Since we always run detectTechnologies and it returns an array,
  //    an empty array still means it ran successfully.
  if (Array.isArray(data.technologies)) coverage++;
  // 6. Conversion analysis
  if (data.conversionAnalysis != null) coverage++;
  return coverage;
}
