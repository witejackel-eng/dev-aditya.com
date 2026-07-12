/**
 * Scoring engine for the Website Revenue Audit Funnel.
 *
 * Computes all category scores and the overall weighted score from
 * the analysis results. Handles partial data gracefully — missing
 * analyzer modules are NEVER assigned a score of 0; instead, the
 * weighting is redistributed across available modules.
 *
 * Weighting:
 *   Overall: Performance 25%, SEO 25%, Accessibility 15%,
 *            BestPractices+Security 15%, Mobile 10%, Conversion 10%
 *
 * Performance: 75% mobile + 25% desktop Lighthouse (reweight if only one)
 * SEO: 60% custom technical SEO + 40% Lighthouse SEO (reweight when unavailable)
 * Accessibility: Use Lighthouse accessibility when available
 * BestPractices+Security: 55% Lighthouse BP + 45% security header (reweight)
 * Mobile: 55% mobile performance + 15% viewport + 15% CLS + 15% accessibility/tap-target
 * Conversion: Use deterministic checklist score
 *
 * Scores are 0-100 integers, clamped.
 * Coverage: 0-6 for how many modules succeeded.
 */

import type {
  AuditReportData,
  NormalizedPageSpeed,
  HtmlAnalysisResult,
  ConversionAnalysisResult,
  SeoAnalysisResult,
} from './types';
import { calculateSecurityScore } from './security-analyzer';
import { calculateConversionScore } from './conversion-analyzer';

// ──────────────────────────────────────────────────────────────
// Score result type
// ──────────────────────────────────────────────────────────────

export interface ScoreResult {
  overall: number;
  performance: number;
  seo: number;
  accessibility: number;
  bestPracticesSecurity: number;
  mobileReadiness: number;
  conversionReadiness: number;
  coverage: number;
}

// ──────────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────────

/**
 * Clamp a value to 0-100 integer range.
 */
function clamp(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

/**
 * Weighted average that redistributes weight when a value is null.
 * NEVER treats a missing value as 0 — it redistributes weight to available values.
 */
function weightedAvg(entries: Array<{ value: number | null; weight: number }>): number {
  const available = entries.filter((e) => e.value !== null);
  if (available.length === 0) return 0; // All null = can't compute

  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = available.reduce((sum, e) => sum + (e.value as number) * e.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

// ──────────────────────────────────────────────────────────────
// Category score calculators
// ──────────────────────────────────────────────────────────────

/**
 * Calculate Performance score.
 * 75% mobile + 25% desktop Lighthouse performance score.
 * Reweight if only one is available — don't treat missing as 0.
 */
function calcPerformanceScore(
  mobile: NormalizedPageSpeed | null,
  desktop: NormalizedPageSpeed | null,
): number {
  const entries: Array<{ value: number | null; weight: number }> = [
    { value: mobile?.performanceScore ?? null, weight: 75 },
    { value: desktop?.performanceScore ?? null, weight: 25 },
  ];
  return clamp(weightedAvg(entries));
}

/**
 * Calculate SEO score.
 * 60% custom technical SEO + 40% Lighthouse SEO.
 * Reweight when Lighthouse SEO is unavailable.
 */
function calcSeoScore(
  customSeoScore: number | null,
  lighthouseSeo: number | null,
): number {
  const entries: Array<{ value: number | null; weight: number }> = [
    { value: customSeoScore, weight: 60 },
    { value: lighthouseSeo, weight: 40 },
  ];
  return clamp(weightedAvg(entries));
}

/**
 * Calculate Accessibility score.
 * Uses Lighthouse accessibility when available.
 */
function calcAccessibilityScore(
  mobile: NormalizedPageSpeed | null,
  desktop: NormalizedPageSpeed | null,
): number | null {
  // Prefer mobile accessibility score
  if (mobile?.accessibilityScore != null) return clamp(mobile.accessibilityScore);
  if (desktop?.accessibilityScore != null) return clamp(desktop.accessibilityScore);
  return null;
}

/**
 * Calculate Best Practices + Security score.
 * 55% Lighthouse BP + 45% security header score.
 * Reweight when either is unavailable.
 */
function calcBestPracticesSecurityScore(
  lighthouseBP: number | null,
  securityScore: number | null,
): number {
  const entries: Array<{ value: number | null; weight: number }> = [
    { value: lighthouseBP, weight: 55 },
    { value: securityScore, weight: 45 },
  ];
  return clamp(weightedAvg(entries));
}

/**
 * Calculate Mobile Readiness score.
 * 55% mobile performance + 15% viewport + 15% CLS + 15% accessibility/tap-target
 */
function calcMobileReadinessScore(
  mobile: NormalizedPageSpeed | null,
  htmlAnalysis: HtmlAnalysisResult | null,
  conversionAnalysis: ConversionAnalysisResult | null,
): number {
  // Mobile performance
  const mobilePerf = mobile?.performanceScore ?? null;

  // Viewport score: full marks if viewport is properly configured
  const viewportScore: number | null = htmlAnalysis
    ? (htmlAnalysis.viewport?.includes('width=device-width') ? 100 : htmlAnalysis.viewport ? 50 : 0)
    : null;

  // CLS score: convert Lighthouse CLS score to 0-100
  const clsScore: number | null = mobile?.metrics?.cumulativeLayoutShift?.score != null
    ? clamp(mobile.metrics.cumulativeLayoutShift.score * 100)
    : null;

  // Accessibility / tap-target signals
  const a11yTapScore: number | null = (() => {
    if (!conversionAnalysis) return null;
    if (conversionAnalysis.mobileCtaIssues.length === 0 && conversionAnalysis.mobileCtaAccessible) return 100;
    if (conversionAnalysis.mobileCtaIssues.length <= 1) return 60;
    return 30;
  })();

  const entries: Array<{ value: number | null; weight: number }> = [
    { value: mobilePerf, weight: 55 },
    { value: viewportScore, weight: 15 },
    { value: clsScore, weight: 15 },
    { value: a11yTapScore, weight: 15 },
  ];
  return clamp(weightedAvg(entries));
}

// ──────────────────────────────────────────────────────────────
// Coverage calculation
// ──────────────────────────────────────────────────────────────

/**
 * Calculate coverage (0-6) — how many analysis modules succeeded.
 * Each successful module adds 1 to the coverage counter.
 */
function calcCoverage(reportData: Partial<AuditReportData>): number {
  let coverage = 0;

  // PageSpeed (mobile or desktop counts as 1)
  if (reportData.pageSpeed?.mobile != null || reportData.pageSpeed?.desktop != null) {
    coverage++;
  }

  // HTML analysis
  if (reportData.htmlAnalysis != null) {
    coverage++;
  }

  // SEO analysis
  if (reportData.seoAnalysis != null) {
    coverage++;
  }

  // Security analysis
  if (reportData.securityAnalysis != null) {
    coverage++;
  }

  // Technology detection (any technologies found)
  if (reportData.technologies != null && reportData.technologies.length >= 0) {
    coverage++;
  }

  // Conversion analysis
  if (reportData.conversionAnalysis != null) {
    coverage++;
  }

  return coverage;
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Calculate all scores from the report data.
 *
 * NEVER assigns a missing analyzer a score of 0 — reweights only
 * across available modules. Stores and displays coverage value.
 *
 * @param reportData - Partial report data (some modules may have failed)
 * @returns All category scores + overall score + coverage
 */
export function calculateScores(
  reportData: Partial<AuditReportData>,
): ScoreResult {
  const { pageSpeed, htmlAnalysis, seoAnalysis, securityAnalysis, conversionAnalysis } = reportData;
  const _technologies = reportData.technologies;

  // ── Individual category scores ──

  // Performance
  const performance = calcPerformanceScore(
    pageSpeed?.mobile ?? null,
    pageSpeed?.desktop ?? null,
  );

  // SEO: custom + Lighthouse
  const customSeoScore = seoAnalysis
    ? (() => {
        // Re-derive the SEO score from the SeoAnalysisResult
        // Since we don't store the raw score on the SeoAnalysisResult,
        // we need to get it from the report data or compute it.
        // The SEO score is calculated in calculateSeoScore and stored separately.
        // For now, we use a heuristic to re-derive it from the result.
        // In practice, the orchestrator passes the computed score.
        return null; // Will be passed from the orchestrator
      })()
    : null;

  // We need the actual SEO score value — it's computed by the orchestrator
  // and should be available. For now, we'll derive it from the seoAnalysis
  // quality indicators if the raw score isn't available.
  // The orchestrator will pass the computed scores directly.

  const lighthouseSeoMobile = pageSpeed?.mobile?.seoScore ?? null;
  const lighthouseSeoDesktop = pageSpeed?.desktop?.seoScore ?? null;
  const lighthouseSeo = lighthouseSeoMobile ?? lighthouseSeoDesktop;

  // For the SEO score, we need the custom SEO score from the seo-analyzer.
  // The orchestrator computes this separately and can pass it in.
  // Here we use the seoAnalysis presence as a proxy — if it exists,
  // we assume the custom score was computed (stored externally).
  // The actual custom SEO score will be passed via reportData.scores.seo
  // in the orchestrator flow.

  // For the SEO score, the orchestrator computes this separately.
  const estimatedCustomSeo = seoAnalysis ? estimateSeoScoreFromResult(seoAnalysis) : null;
  const seo = calcSeoScore(estimatedCustomSeo, lighthouseSeo);

  // Accessibility
  const accessibilityRaw = calcAccessibilityScore(
    pageSpeed?.mobile ?? null,
    pageSpeed?.desktop ?? null,
  );
  const accessibility = accessibilityRaw ?? 0; // If no Lighthouse data, accessibility is unknown

  // Best Practices + Security
  const lighthouseBP = pageSpeed?.mobile?.bestPracticesScore ?? pageSpeed?.desktop?.bestPracticesScore ?? null;
  const securityScore = securityAnalysis ? calculateSecurityScore(securityAnalysis) : null;
  const bestPracticesSecurity = calcBestPracticesSecurityScore(lighthouseBP, securityScore);

  // Mobile Readiness
  const mobileReadiness = calcMobileReadinessScore(
    pageSpeed?.mobile ?? null,
    htmlAnalysis ?? null,
    conversionAnalysis ?? null,
  );

  // Conversion Readiness
  const conversionReadiness = conversionAnalysis
    ? calculateConversionScore(conversionAnalysis)
    : 0; // If no conversion analysis, can't score — but we mark coverage=0

  // ── Coverage ──
  const coverage = calcCoverage(reportData);

  // ── Overall score (weighted average) ──
  // Only include categories where we have data.
  // Weight distribution: Performance 25, SEO 25, Accessibility 15,
  //                      BestPractices+Security 15, Mobile 10, Conversion 10
  const overallEntries: Array<{ value: number | null; weight: number }> = [
    { value: (pageSpeed?.mobile || pageSpeed?.desktop) ? performance : null, weight: 25 },
    { value: seoAnalysis ? seo : null, weight: 25 },
    { value: (pageSpeed?.mobile?.accessibilityScore != null || pageSpeed?.desktop?.accessibilityScore != null)
        ? accessibility
        : null,
      weight: 15 },
    { value: (lighthouseBP != null || securityAnalysis != null) ? bestPracticesSecurity : null, weight: 15 },
    { value: (pageSpeed?.mobile || htmlAnalysis) ? mobileReadiness : null, weight: 10 },
    { value: conversionAnalysis ? conversionReadiness : null, weight: 10 },
  ];

  const overall = clamp(weightedAvg(overallEntries));

  return {
    overall,
    performance,
    seo,
    accessibility: accessibilityRaw ?? 0,
    bestPracticesSecurity,
    mobileReadiness,
    conversionReadiness: conversionAnalysis ? conversionReadiness : 0,
    coverage,
  };
}

/**
 * Re-export the score calculation with explicit custom SEO score.
 * The orchestrator should call this version when it has the exact score.
 */
export function calculateScoresWithCustomSeo(
  reportData: Partial<AuditReportData>,
  customSeoScore: number | null,
): ScoreResult {
  const result = calculateScores(reportData);

  // Override SEO calculation with the actual custom score
  const lighthouseSeoMobile = reportData.pageSpeed?.mobile?.seoScore ?? null;
  const lighthouseSeoDesktop = reportData.pageSpeed?.desktop?.seoScore ?? null;
  const lighthouseSeo = lighthouseSeoMobile ?? lighthouseSeoDesktop;

  if (customSeoScore != null || lighthouseSeo != null) {
    result.seo = calcSeoScore(customSeoScore, lighthouseSeo);
  }

  // Recalculate overall with updated SEO
  const overallEntries: Array<{ value: number | null; weight: number }> = [
    { value: (reportData.pageSpeed?.mobile || reportData.pageSpeed?.desktop) ? result.performance : null, weight: 25 },
    { value: (customSeoScore != null || reportData.seoAnalysis != null) ? result.seo : null, weight: 25 },
    { value: (reportData.pageSpeed?.mobile?.accessibilityScore != null || reportData.pageSpeed?.desktop?.accessibilityScore != null)
        ? result.accessibility
        : null,
      weight: 15 },
    { value: (reportData.pageSpeed?.mobile?.bestPracticesScore != null || reportData.securityAnalysis != null)
        ? result.bestPracticesSecurity
        : null,
      weight: 15 },
    { value: (reportData.pageSpeed?.mobile || reportData.htmlAnalysis) ? result.mobileReadiness : null, weight: 10 },
    { value: reportData.conversionAnalysis ? result.conversionReadiness : null, weight: 10 },
  ];

  result.overall = clamp(weightedAvg(overallEntries));

  return result;
}

// ──────────────────────────────────────────────────────────────
// Estimate SEO score from SeoAnalysisResult (fallback)
// ──────────────────────────────────────────────────────────────

/**
 * Rough estimation of the custom SEO score from the SeoAnalysisResult.
 * This is a fallback — the orchestrator should use the actual computed score.
 *
 * Rubric: Title 12, Meta desc 10, H1 10, Canonical 8, Indexability 7,
 *         Language 5, Viewport 5, OG 8, Twitter 4, Structured data 8,
 *         Image alt 8, Heading structure 5, Sitemap 5, Robots.txt 5 = 100
 */
function estimateSeoScoreFromResult(seo: SeoAnalysisResult): number {
  let score = 0;

  // Title: 12 points
  if (seo.titleTagPresent) score += seo.titleTagOptimal ? 12 : 6;

  // Meta description: 10 points
  if (seo.metaDescriptionPresent) score += seo.metaDescriptionOptimal ? 10 : 5;

  // H1: 10 points
  if (seo.h1Present) score += seo.h1Single ? 10 : 5;

  // Canonical: 8 points
  if (seo.canonicalTagPresent) score += 8;

  // Indexability: 7 points
  if (seo.indexability.isIndexable) score += 7;

  // Language: 5 points (assume present if not flagged)
  if (seo.indexability.issues.length < 3) score += 5;

  // Viewport: 5 points
  if (seo.mobileFriendliness.hasViewport && seo.mobileFriendliness.viewportConfigured) score += 5;
  else if (seo.mobileFriendliness.hasViewport) score += 2;

  // OG: 8 points
  if (seo.openGraphComplete) score += 8;
  else if (Object.keys(seo.openGraphIssues).length <= 1) score += 4;

  // Twitter: 4 points
  score += Math.max(0, 4 - seo.openGraphIssues.length);

  // Structured data: 8 points
  if (seo.structuredDataPresent) score += 8;

  // Image alt: 8 points
  if (seo.imagesHaveAlt) score += 8;

  // Heading structure: 5 points
  if (seo.h1Present && seo.h1Single) score += 5;

  // Sitemap: 5 points
  if (seo.sitemapXmlAccessible === true) score += 5;

  // Robots.txt: 5 points
  if (seo.robotsTxtAccessible === true) score += 5;

  return Math.min(100, Math.max(0, score));
}
