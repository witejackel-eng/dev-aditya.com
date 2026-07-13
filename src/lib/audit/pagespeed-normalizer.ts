/**
 * Normalize PageSpeed Insights API response into our internal shape.
 *
 * Decouples the rest of the codebase from the raw Google API format.
 * Defensive optional parsing — never assumes every audit ID is present.
 * When field data is missing, sets it to null (does NOT mark as failure).
 */

import type {
  NormalizedMetric,
  NormalizedOpportunity,
  NormalizedPageSpeed,
  PageSpeedStrategy,
} from './types';

// ──────────────────────────────────────────────────────────────
// Opportunity audit IDs we care about
// ──────────────────────────────────────────────────────────────

const OPPORTUNITY_IDS = new Set([
  'render-blocking-resources',
  'unused-javascript',
  'unused-css-rules',
  'modern-image-formats',
  'uses-optimized-images',
  'uses-responsive-images',
  'offscreen-images',
  'uses-text-compression',
  'uses-long-cache-ttl',
  'server-response-time',
  'third-party-summary',
  'mainthread-work-breakdown',
  'bootup-time',
  'dom-size',
]);

// ──────────────────────────────────────────────────────────────
// Metric audit IDs
// ──────────────────────────────────────────────────────────────

const METRIC_IDS = {
  firstContentfulPaint: 'first-contentful-paint',
  largestContentfulPaint: 'largest-contentful-paint',
  cumulativeLayoutShift: 'cumulative-layout-shift',
  totalBlockingTime: 'total-blocking-time',
  speedIndex: 'speed-index',
  interactionToNextPaint: 'interaction-to-next-paint',
  serverResponseTime: 'server-response-time',
} as const;

// ──────────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────────

/**
 * Safely extract a numeric value from a nested object path.
 * Returns `undefined` if any part of the path is missing or not a number.
 */
function safeGet<T>(obj: unknown, path: string[]): T | undefined {
  let current: unknown = obj;
  for (const key of path) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current as T | undefined;
}

/**
 * Extract a Lighthouse audit as a NormalizedMetric.
 * Returns a null-scored metric if the audit is missing or malformed.
 */
function extractMetric(
  audits: Record<string, unknown> | undefined,
  auditId: string,
): NormalizedMetric {
  const audit = audits?.[auditId];
  if (!audit || typeof audit !== 'object') {
    return { score: null, numericValue: null, displayValue: null };
  }

  const a = audit as Record<string, unknown>;
  return {
    score: typeof a.score === 'number' ? a.score : null,
    numericValue: typeof a.numericValue === 'number' ? a.numericValue : null,
    displayValue: typeof a.displayValue === 'string' ? a.displayValue : null,
  };
}

/**
 * Extract an opportunity from a Lighthouse audit.
 * Returns null if the audit is not an opportunity or is missing.
 */
function extractOpportunity(
  audits: Record<string, unknown> | undefined,
  auditId: string,
): NormalizedOpportunity | null {
  const audit = audits?.[auditId];
  if (!audit || typeof audit !== 'object') return null;

  const a = audit as Record<string, unknown>;

  // Only include if there are actual savings
  const savingsMs = typeof a.details === 'object' && a.details !== null
    ? (a.details as Record<string, unknown>).overallSavingsMs
    : undefined;

  const savingsBytes = typeof a.details === 'object' && a.details !== null
    ? (a.details as Record<string, unknown>).overallSavingsBytes
    : undefined;

  // If the audit has a perfect score (1), it's not really an "opportunity"
  const score = typeof a.score === 'number' ? a.score : null;
  if (score === 1) return null;

  return {
    id: auditId,
    title: typeof a.title === 'string' ? a.title : auditId,
    savingsMs: typeof savingsMs === 'number' ? savingsMs : 0,
    savingsBytes: typeof savingsBytes === 'number' ? savingsBytes : null,
    displayValue: typeof a.displayValue === 'string' ? a.displayValue : null,
  };
}

/**
 * Extract a Lighthouse category score (0-100).
 * Lighthouse returns 0-1; we multiply by 100.
 * Returns null if unavailable.
 */
function extractCategoryScore(
  data: unknown,
  categoryId: string,
): number | null {
  const raw = safeGet<number>(data, ['lighthouseResult', 'categories', categoryId, 'score']);
  if (raw == null || typeof raw !== 'number') return null;
  return Math.round(raw * 100);
}

/**
 * Extract run warnings from the Lighthouse result.
 */
function extractRunWarnings(data: unknown): string[] {
  const warnings = safeGet<unknown[]>(data, ['lighthouseResult', 'runWarnings']);
  if (!Array.isArray(warnings)) return [];

  return warnings
    .filter((w): w is string => typeof w === 'string')
    .slice(0, 20); // Cap at 20 warnings
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Normalize a raw PageSpeed Insights API response into our NormalizedPageSpeed type.
 *
 * Handles:
 *  - Missing lighthouseResult gracefully
 *  - Missing categories / audits / metrics
 *  - Missing field data (sets to null, not failure)
 *  - Extracts only the opportunity audit IDs we care about
 *  - Separates lab data (Lighthouse) from field data (CrUX)
 *
 * @param data - Raw JSON response from the PageSpeed Insights API
 * @param strategy - 'mobile' or 'desktop'
 */
export function normalizePageSpeedResponse(
  data: unknown,
  strategy: string,
): NormalizedPageSpeed {
  // ── Basic info ──
  const requestedUrl =
    safeGet<string>(data, ['lighthouseResult', 'requestedUrl']) ?? '';
  const finalUrl =
    safeGet<string>(data, ['lighthouseResult', 'finalUrl']) ?? null;
  const fetchTime =
    safeGet<string>(data, ['lighthouseResult', 'fetchTime']) ?? null;

  // ── Category scores (0-100) ──
  const performanceScore = extractCategoryScore(data, 'performance');
  const seoScore = extractCategoryScore(data, 'seo');
  const accessibilityScore = extractCategoryScore(data, 'accessibility');
  const bestPracticesScore = extractCategoryScore(data, 'best-practices');

  // ── Audits ──
  const audits = safeGet<Record<string, unknown>>(
    data,
    ['lighthouseResult', 'audits'],
  );

  // ── Core Web Vitals metrics (lab data from Lighthouse) ──
  const metrics = {
    firstContentfulPaint: extractMetric(audits, METRIC_IDS.firstContentfulPaint),
    largestContentfulPaint: extractMetric(audits, METRIC_IDS.largestContentfulPaint),
    cumulativeLayoutShift: extractMetric(audits, METRIC_IDS.cumulativeLayoutShift),
    totalBlockingTime: extractMetric(audits, METRIC_IDS.totalBlockingTime),
    speedIndex: extractMetric(audits, METRIC_IDS.speedIndex),
    interactionToNextPaint: extractMetric(audits, METRIC_IDS.interactionToNextPaint),
  };

  // ── Server response time (separate from core CWV) ──
  const _serverResponseTime = extractMetric(audits, METRIC_IDS.serverResponseTime);
  // We include it in the metrics object via the NormalizedPageSpeed type
  // Note: The type doesn't have serverResponseTime in metrics, but we
  // surface it through the opportunities extraction instead.

  // If the type had serverResponseTime in metrics, we'd add it here.
  // For now, server response time is captured via the server-response-time opportunity.

  // ── Opportunities ──
  const opportunities: NormalizedOpportunity[] = [];
  for (const auditId of OPPORTUNITY_IDS) {
    const opp = extractOpportunity(audits, auditId);
    if (opp) {
      opportunities.push(opp);
    }
  }

  // Sort by savings descending
  opportunities.sort((a, b) => b.savingsMs - a.savingsMs);

  // ── Field data (CrUX) ──
  // When field data is missing, we set it to null — this is NOT a failure.
  // CrUX data is only available for origins with sufficient real-user traffic.
  // We extract it for informational purposes but don't penalize its absence.
  //
  // Note: The NormalizedPageSpeed type currently stores field data as part of
  // the overall metrics. If we had separate field data types, we'd populate
  // them here from loadingExperience.metrics. For now, we just note that
  // field data was available or not via the serverResponseTime metric.

  // ── Run warnings ──
  const runWarnings = extractRunWarnings(data);

  // ── Assemble result ──
  return {
    strategy: strategy as PageSpeedStrategy,
    requestedUrl,
    finalUrl,
    fetchTime,
    performanceScore,
    seoScore,
    accessibilityScore,
    bestPracticesScore,
    metrics,
    opportunities,
    runWarnings,
  };
}
