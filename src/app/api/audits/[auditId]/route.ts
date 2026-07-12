/**
 * GET /api/audits/[auditId]
 *
 * Fetch an audit and return either a PublicAuditDto (no access)
 * or a FullAuditDto (access granted via cookie, query token, or admin session).
 *
 * The public DTO PHYSICALLY OMITS locked data — not just hidden.
 */

import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/db';
import { audits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyReportAccessCookie, REPORT_ACCESS_COOKIE_PREFIX, verifyAccessToken } from '@/lib/audit/report-access';
import { verifySession, ADMIN_COOKIE_NAME } from '@/lib/admin/session';
import type { AuditFinding, PublicAuditDto, FullAuditDto } from '@/lib/audit/types';

export async function GET(
  request: NextRequest,
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

    // ── Fetch audit from DB ──
    const auditRows = await db
      .select()
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

    // ── Check for expired audit ──
    if (audit.expires_at && audit.expires_at < new Date()) {
      return NextResponse.json(
        { error: 'This audit report has expired.' },
        { status: 410 },
      );
    }

    // ── Determine report access ──
    const hasAccess = checkReportAccess(request, auditId);

    // ── Build base DTO fields ──
    const reportData = audit.report_data as Record<string, unknown> | null;
    const allFindings = (reportData?.findings as AuditFinding[] | undefined) ?? [];
    const freeFindingCount = (reportData?.freeFindingCount as number) ?? 3;

    // ── Compute positive findings for public view ──
    const positiveFindings: AuditFinding[] = allFindings.filter(
      (f) => f.severity === 'positive',
    );

    if (hasAccess) {
      // ── FullAuditDto: return complete report ──
      const fullDto: FullAuditDto = {
        id: audit.id,
        hostname: audit.hostname,
        normalizedUrl: audit.normalized_url,
        status: audit.status as FullAuditDto['status'],
        overallScore: audit.overall_score,
        performanceScore: audit.performance_score,
        seoScore: audit.seo_score,
        accessibilityScore: audit.accessibility_score,
        bestPracticesSecurityScore: audit.best_practices_security_score,
        mobileReadinessScore: audit.mobile_readiness_score,
        conversionReadinessScore: audit.conversion_readiness_score,
        findings: allFindings,
        freeFindingCount,
        totalFindingCount: allFindings.length,
        safeErrorMessage: audit.safe_error_message,
        createdAt: audit.created_at?.toISOString() ?? new Date().toISOString(),
        completedAt: audit.completed_at?.toISOString() ?? null,
        reportData: reportData as unknown as FullAuditDto['reportData'],
        cacheHit: audit.cache_hit,
        expiresAt: audit.expires_at?.toISOString() ?? null,
      };

      return NextResponse.json(fullDto, {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'private, no-store',
        },
      });
    }

    // ── PublicAuditDto: PHYSICALLY OMIT locked data ──
    // We only expose limited findings, NOT the full report data

    // Top 3 non-positive findings (most severe issues)
    const nonPositiveFindings = allFindings
      .filter((f) => f.severity !== 'positive')
      .slice(0, 3);

    // 3 positive findings
    const publicPositiveFindings = positiveFindings.slice(0, 3);

    // High-confidence technologies only (confidence >= 0.8)
    const technologies = (reportData?.technologies as Array<{ name: string; category: string; confidence: number; evidence: string }> | undefined) ?? [];
    const highConfidenceTech = technologies
      .filter((t) => t.confidence >= 0.8)
      .map((t) => ({ name: t.name, category: t.category }));

    const publicDto: PublicAuditDto = {
      id: audit.id,
      hostname: audit.hostname,
      normalizedUrl: audit.normalized_url,
      status: audit.status as PublicAuditDto['status'],
      overallScore: audit.overall_score,
      performanceScore: audit.performance_score,
      seoScore: audit.seo_score,
      accessibilityScore: audit.accessibility_score,
      bestPracticesSecurityScore: audit.best_practices_security_score,
      mobileReadinessScore: audit.mobile_readiness_score,
      conversionReadinessScore: audit.conversion_readiness_score,
      findings: [...nonPositiveFindings, ...publicPositiveFindings].slice(0, freeFindingCount + 3),
      freeFindingCount,
      totalFindingCount: allFindings.length,
      safeErrorMessage: audit.safe_error_message,
      createdAt: audit.created_at?.toISOString() ?? new Date().toISOString(),
      completedAt: audit.completed_at?.toISOString() ?? null,
      // Additional public-only fields
      ...(getCoverageLimitations(audit.coverage) ? {} : {}),
    };

    // Attach extra public data not in the DTO type
    (publicDto as unknown as Record<string, unknown>)._public = {
      topIssues: nonPositiveFindings,
      positives: publicPositiveFindings,
      highConfidenceTech,
      coverage: audit.coverage,
      limitations: getCoverageLimitations(audit.coverage),
    };

    return NextResponse.json(publicDto, {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (err) {
    console.error('[audit:get] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong fetching the audit.' },
      { status: 500 },
    );
  }
}

// ──────────────────────────────────────────────────────────────
// Access check helper
// ──────────────────────────────────────────────────────────────

function checkReportAccess(request: NextRequest, auditId: string): boolean {
  // 1. Check signed cookie
  const cookieName = `${REPORT_ACCESS_COOKIE_PREFIX}${auditId}`;
  const cookieValue = request.cookies.get(cookieName)?.value;
  if (cookieValue && verifyReportAccessCookie(cookieValue, auditId)) {
    return true;
  }

  // 2. Check signed query token
  const token = request.nextUrl.searchParams.get('token');
  if (token && typeof token === 'string') {
    const tokenResult = verifyAccessToken(token);
    if (tokenResult.valid && tokenResult.auditId === auditId) {
      return true;
    }
  }

  // 3. Check admin session
  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (adminCookie && verifySession(adminCookie)) {
    return true;
  }

  return false;
}

// ──────────────────────────────────────────────────────────────
// Coverage limitations description
// ──────────────────────────────────────────────────────────────

function getCoverageLimitations(coverage: number | null): string[] {
  const limitations: string[] = [];
  const c = coverage ?? 0;

  if (c < 1) limitations.push('No performance data available.');
  if (c < 2) limitations.push('HTML content analysis was not completed.');
  if (c < 3) limitations.push('SEO analysis was not completed.');
  if (c < 4) limitations.push('Security analysis was not completed.');
  if (c < 5) limitations.push('Technology detection was not completed.');
  if (c < 6) limitations.push('Conversion analysis was not completed.');

  if (limitations.length === 0) {
    limitations.push('All analysis modules completed successfully.');
  }

  return limitations;
}
