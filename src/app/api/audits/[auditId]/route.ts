/**
 * GET /api/audits/[auditId]
 *
 * Fetch an audit and return either a PublicAuditDto (no access)
 * or a FullAuditDto (access granted via cookie, query token, or admin session).
 *
 * Uses proper DTOs. No _public property. Sets isUnlocked explicitly.
 * Cache-Control: private, no-store with Vary: Cookie.
 */

import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/db';
import { audits } from '@/db/schema';
import { logDbError } from '@/lib/db-error';
import { eq } from 'drizzle-orm';
import { verifyReportAccessCookie, REPORT_ACCESS_COOKIE_PREFIX, verifyAccessToken } from '@/lib/audit/report-access';
import { verifySession, ADMIN_COOKIE_NAME } from '@/lib/admin/session';
import type { AuditFinding, TechnologyDetection } from '@/lib/audit/types';
import type { PublicAuditDto, FullAuditDto, AuditCoverageDto, PublicPageSpeedSummary, PublicTechnologyDetection, PublicPageSpeedMetric } from '@/lib/audit/dto';

export const runtime = 'nodejs';

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

    // ── Build base fields ──
    const reportData = audit.report_data as Record<string, unknown> | null;
    const allFindings = (reportData?.findings as AuditFinding[] | undefined) ?? [];
    const freeFindingCount = (reportData?.freeFindingCount as number) ?? 3;

    const positiveFindings: AuditFinding[] = allFindings.filter(
      (f) => f.severity === 'positive',
    );

    // Build coverage DTO
    const coverage = buildCoverageDto(reportData, audit.coverage ?? 0);

    // Build pageSpeedSummary
    const pageSpeedSummary = buildPageSpeedSummary(reportData);

    // Build limitations
    const limitations = buildLimitations(coverage);

    if (hasAccess) {
      // ── FullAuditDto ──
      const fullDto: FullAuditDto = {
        id: audit.id,
        hostname: audit.hostname,
        normalizedUrl: audit.normalized_url,
        status: audit.status as FullAuditDto['status'],
        createdAt: audit.created_at?.toISOString() ?? new Date().toISOString(),
        completedAt: audit.completed_at?.toISOString() ?? null,
        safeErrorMessage: audit.safe_error_message,
        cacheHit: audit.cache_hit,
        coverage,
        isUnlocked: true,
        overallScore: audit.overall_score,
        performanceScore: audit.performance_score,
        seoScore: audit.seo_score,
        accessibilityScore: audit.accessibility_score,
        bestPracticesSecurityScore: audit.best_practices_security_score,
        mobileReadinessScore: audit.mobile_readiness_score,
        conversionReadinessScore: audit.conversion_readiness_score,
        publicFindings: allFindings.filter(f => f.severity !== 'positive').slice(0, freeFindingCount + 3),
        positiveFindings,
        technologies: (reportData?.technologies as TechnologyDetection[] | undefined) ?? [],
        pageSpeedSummary,
        totalFindingCount: allFindings.length,
        freeFindingCount,
        limitations,
        reportData: reportData as unknown as FullAuditDto['reportData'],
      };

      return NextResponse.json(fullDto, {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'private, no-store',
          'Vary': 'Cookie',
        },
      });
    }

    // ── PublicAuditDto: PHYSICALLY OMIT locked data ──

    // Top non-positive findings (preview only)
    const nonPositiveFindings = allFindings
      .filter((f) => f.severity !== 'positive')
      .slice(0, freeFindingCount);

    // 3 positive findings
    const publicPositiveFindings = positiveFindings.slice(0, 3);

    // High-confidence technologies only — no evidence
    const technologies = (reportData?.technologies as TechnologyDetection[] | undefined) ?? [];
    const publicTechnologies: PublicTechnologyDetection[] = technologies
      .filter((t) => t.confidence >= 0.8)
      .map((t) => ({ name: t.name, category: t.category, confidence: t.confidence }));

    const publicDto: PublicAuditDto = {
      id: audit.id,
      hostname: audit.hostname,
      normalizedUrl: audit.normalized_url,
      status: audit.status as PublicAuditDto['status'],
      createdAt: audit.created_at?.toISOString() ?? new Date().toISOString(),
      completedAt: audit.completed_at?.toISOString() ?? null,
      safeErrorMessage: audit.safe_error_message,
      cacheHit: audit.cache_hit,
      coverage,
      isUnlocked: false,
      overallScore: audit.overall_score,
      performanceScore: audit.performance_score,
      seoScore: audit.seo_score,
      accessibilityScore: audit.accessibility_score,
      bestPracticesSecurityScore: audit.best_practices_security_score,
      mobileReadinessScore: audit.mobile_readiness_score,
      conversionReadinessScore: audit.conversion_readiness_score,
      publicFindings: nonPositiveFindings,
      positiveFindings: publicPositiveFindings,
      technologies: publicTechnologies,
      pageSpeedSummary,
      totalFindingCount: allFindings.length,
      freeFindingCount,
      limitations,
    };

    return NextResponse.json(publicDto, {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-store',
        'Vary': 'Cookie',
      },
    });
  } catch (err) {
    logDbError('audit:get', err);
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
// Coverage DTO builder
// ──────────────────────────────────────────────────────────────

function buildCoverageDto(reportData: Record<string, unknown> | null, storedCoverage: number): AuditCoverageDto {
  const pageSpeed = reportData?.pageSpeed as Record<string, unknown> | null;
  const htmlAnalysis = reportData?.htmlAnalysis;
  const seoAnalysis = reportData?.seoAnalysis;
  const securityAnalysis = reportData?.securityAnalysis;
  const technologies = reportData?.technologies as unknown[] | null;
  const conversionAnalysis = reportData?.conversionAnalysis;

  const performance = !!(pageSpeed?.mobile || pageSpeed?.desktop);
  const html = !!htmlAnalysis;
  const seo = !!seoAnalysis;
  const security = !!securityAnalysis;
  // Technology counts as completed only if the detector actually ran,
  // NOT just because the array exists (it could be empty).
  // We check if it's an array (detector ran) rather than null/undefined.
  const technology = Array.isArray(technologies);
  const conversion = !!conversionAnalysis;

  const modules = { performance, html, seo, security, technology, conversion };
  const completed = Object.values(modules).filter(Boolean).length;

  return { completed, total: 6, modules };
}

// ──────────────────────────────────────────────────────────────
// PageSpeed summary builder
// ──────────────────────────────────────────────────────────────

function buildPageSpeedSummary(reportData: Record<string, unknown> | null): PublicPageSpeedSummary | null {
  const pageSpeed = reportData?.pageSpeed as Record<string, unknown> | null;
  if (!pageSpeed) return null;

  function extractMetrics(strategy: Record<string, unknown> | null): PublicPageSpeedMetric | null {
    if (!strategy) return null;

    const metrics = strategy.metrics as Record<string, Record<string, unknown>> | null;
    const categories = strategy.categories as Record<string, Record<string, unknown>> | null;

    const perfCategory = categories?.performance;
    const performanceScore = typeof perfCategory?.score === 'number' ? Math.round(perfCategory.score * 100) : null;

    return {
      performanceScore,
      lcp: typeof metrics?.largestContentfulPaint?.numericValue === 'number' ? metrics.largestContentfulPaint.numericValue : null,
      fcp: typeof metrics?.firstContentfulPaint?.numericValue === 'number' ? metrics.firstContentfulPaint.numericValue : null,
      cls: typeof metrics?.cumulativeLayoutShift?.numericValue === 'number' ? metrics.cumulativeLayoutShift.numericValue : null,
      tbt: typeof metrics?.totalBlockingTime?.numericValue === 'number' ? metrics.totalBlockingTime.numericValue : null,
      si: typeof metrics?.speedIndex?.numericValue === 'number' ? metrics.speedIndex.numericValue : null,
      inp: typeof metrics?.interactionToNextPaint?.numericValue === 'number' ? metrics.interactionToNextPaint.numericValue : null,
    };
  }

  const mobile = extractMetrics(pageSpeed.mobile as Record<string, unknown> | null);
  const desktop = extractMetrics(pageSpeed.desktop as Record<string, unknown> | null);

  if (!mobile && !desktop) return null;

  return { mobile, desktop };
}

// ──────────────────────────────────────────────────────────────
// Limitations builder
// ──────────────────────────────────────────────────────────────

function buildLimitations(coverage: AuditCoverageDto): string[] {
  const limitations: string[] = [];
  const m = coverage.modules;

  if (!m.performance) limitations.push('No performance data available.');
  if (!m.html) limitations.push('HTML content analysis was not completed.');
  if (!m.seo) limitations.push('SEO analysis was not completed.');
  if (!m.security) limitations.push('Security analysis was not completed.');
  if (!m.technology) limitations.push('Technology detection was not completed.');
  if (!m.conversion) limitations.push('Conversion analysis was not completed.');

  if (limitations.length === 0) {
    limitations.push('All analysis modules completed successfully.');
  }

  return limitations;
}
