/**
 * Main audit orchestrator for the Website Revenue Audit Funnel.
 *
 * Coordinates the full audit pipeline:
 *   validating → fetching → performance → analyzing → scoring → completed
 *
 * Runs independent analyzers with Promise.allSettled.
 * Partial completion: if one module fails, continue with others.
 * Uses idempotent behavior — repeated request must not duplicate events.
 *
 * This module is server-only.
 */

import 'server-only';

import type {
  AuditReportData,
  NormalizedPageSpeed,
  HtmlAnalysisResult,
  SeoAnalysisResult,
  SecurityAnalysisResult,
  ConversionAnalysisResult,
  TechnologyDetection,
} from './types';
import { SCANNER_VERSION } from './constants';
import { validateAuditUrl } from './url-validator';
import { safeFetch, type SafeFetchResult } from './safe-fetch';
import { runPageSpeedBothStrategies } from './pagespeed';
import { analyzeHtml, fetchSeoAuxiliaryData } from './html-analyzer';
import { calculateSeoScore } from './seo-analyzer';
import { analyzeSecurityHeaders } from './security-analyzer';
import { detectTechnologies } from './technology-detector';
import { analyzeConversionReadiness } from './conversion-analyzer';
import { calculateScoresWithCustomSeo } from './scoring';
import { generateFindings } from './finding-rules';
import { generateRecommendations } from './recommendations';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export type AuditStatusCallback = (status: string) => Promise<void>;

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Run a full website audit.
 *
 * @param auditId - Unique audit identifier
 * @param normalizedUrl - Pre-validated, normalized URL
 * @param hostname - Pre-extracted hostname
 * @param updateStatus - Callback to update audit status in DB
 * @returns Complete audit report data
 */
export async function runAudit(
  auditId: string,
  normalizedUrl: string,
  _hostname: string,
  updateStatus: AuditStatusCallback,
): Promise<AuditReportData> {
  // ── Stage 1: Validating ──
  await updateStatus('validating');

  // URL is already validated by the caller (API route), but we double-check
  const validation = await validateAuditUrl(normalizedUrl);
  if ('error' in validation) {
    throw new Error(`URL validation failed: ${validation.error}`);
  }

  const url = validation.normalizedUrl;

  // ── Stage 2: Fetching ──
  await updateStatus('fetching');

  let fetchResult: SafeFetchResult;
  try {
    fetchResult = await safeFetch(url, {
      purpose: 'html',
      followRedirects: true,
    });
  } catch (err) {
    // Fetch failed — we can still run PageSpeed but not HTML-based analyses
    console.error(`[audit] HTML fetch failed for ${url}: ${err instanceof Error ? err.message : String(err)}`);
    fetchResult = {
      finalUrl: url,
      status: 0,
      body: '',
      contentType: null,
      redirectChain: [],
      truncated: false,
    };
  }

  const html = fetchResult.body;
  const finalUrl = fetchResult.finalUrl || url;
  const baseUrl = new URL(finalUrl).origin;

  // Build response headers from the fetch (for security/tech analysis)
  // Note: safeFetch doesn't return headers, so we need a separate lightweight fetch
  // for header inspection if the page was fetched successfully.
  let responseHeaders: Headers = new Headers();
  if (fetchResult.status >= 200 && fetchResult.status < 400 && html) {
    try {
      // Make a separate HEAD request to get headers (lightweight)
      const headResponse = await fetch(finalUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'AdityaWebsiteAudit/1.0 (https://dev-aditya.com)',
          'Accept': '*/*',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(10_000),
      });
      responseHeaders = headResponse.headers;
    } catch {
      // HEAD request may not be supported — that's fine, we'll use empty headers
      // and rely on the HTML content for what we can detect.
    }
  }

  // ── Stage 3: Performance (PageSpeed Insights) ──
  await updateStatus('performance');

  const pageSpeedPromise = runPageSpeedBothStrategies(finalUrl);

  // ── Stage 4: Analyzing ──
  await updateStatus('analyzing');

  // Run all independent analyzers in parallel with Promise.allSettled
  // so that if one fails, the others continue.
  const [
    pageSpeedResult,
    htmlAndAuxResult,
    securityResult,
    technologyResult,
    conversionResult,
  ] = await Promise.allSettled([
    // 1. PageSpeed Insights (both strategies)
    pageSpeedPromise,

    // 2. HTML analysis + SEO auxiliary data (robots.txt, sitemap)
    html
      ? Promise.all([analyzeHtml(html, finalUrl), fetchSeoAuxiliaryData(baseUrl)])
          .then(([htmlAnalysis, seoAux]) => ({ htmlAnalysis, seoAux }))
      : Promise.resolve({ htmlAnalysis: null as HtmlAnalysisResult | null, seoAux: { robotsTxtAccessible: null as boolean | null, sitemapXmlAccessible: null as boolean | null } }),

    // 3. Security headers analysis
    html
      ? Promise.resolve(analyzeSecurityHeaders(responseHeaders, finalUrl, html))
      : Promise.resolve(null as SecurityAnalysisResult | null),

    // 4. Technology detection
    html
      ? Promise.resolve(detectTechnologies(html, responseHeaders, finalUrl))
      : Promise.resolve([] as TechnologyDetection[]),

    // 5. Conversion readiness analysis
    html
      ? Promise.resolve(analyzeConversionReadiness(html, finalUrl))
      : Promise.resolve(null as ConversionAnalysisResult | null),
  ]);

  // ── Extract results (with null fallbacks for failed modules) ──

  const pageSpeed = pageSpeedResult.status === 'fulfilled'
    ? pageSpeedResult.value
    : { mobile: null as NormalizedPageSpeed | null, desktop: null as NormalizedPageSpeed | null };

  if (pageSpeedResult.status === 'rejected') {
    console.error(`[audit] PageSpeed analysis failed: ${pageSpeedResult.reason}`);
  }

  let htmlAnalysis: HtmlAnalysisResult | null = null;
  let seoAux: { robotsTxtAccessible: boolean | null; sitemapXmlAccessible: boolean | null } = {
    robotsTxtAccessible: null,
    sitemapXmlAccessible: null,
  };

  if (htmlAndAuxResult.status === 'fulfilled' && htmlAndAuxResult.value) {
    htmlAnalysis = htmlAndAuxResult.value.htmlAnalysis;
    seoAux = htmlAndAuxResult.value.seoAux;
  } else if (htmlAndAuxResult.status === 'rejected') {
    console.error(`[audit] HTML analysis failed: ${htmlAndAuxResult.reason}`);
  }

  const securityAnalysis: SecurityAnalysisResult | null =
    securityResult.status === 'fulfilled' ? securityResult.value : null;

  if (securityResult.status === 'rejected') {
    console.error(`[audit] Security analysis failed: ${securityResult.reason}`);
  }

  const technologies: TechnologyDetection[] =
    technologyResult.status === 'fulfilled' ? technologyResult.value : [];

  if (technologyResult.status === 'rejected') {
    console.error(`[audit] Technology detection failed: ${technologyResult.reason}`);
  }

  const conversionAnalysis: ConversionAnalysisResult | null =
    conversionResult.status === 'fulfilled' ? conversionResult.value : null;

  if (conversionResult.status === 'rejected') {
    console.error(`[audit] Conversion analysis failed: ${conversionResult.reason}`);
  }

  // ── SEO Analysis (depends on HTML analysis + auxiliary data) ──
  let seoAnalysis: SeoAnalysisResult | null = null;
  let customSeoScore: number | null = null;

  if (htmlAnalysis) {
    try {
      const seoResult = calculateSeoScore(
        htmlAnalysis,
        finalUrl,
        seoAux.robotsTxtAccessible,
        seoAux.sitemapXmlAccessible,
      );
      seoAnalysis = seoResult.details;
      customSeoScore = seoResult.score;
    } catch (err) {
      console.error(`[audit] SEO analysis failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // ── Stage 5: Scoring ──
  await updateStatus('scoring');

  const partialData: Partial<AuditReportData> = {
    scannerVersion: SCANNER_VERSION,
    pageSpeed,
    htmlAnalysis,
    seoAnalysis,
    securityAnalysis,
    technologies,
    conversionAnalysis,
  };

  const scores = calculateScoresWithCustomSeo(partialData, customSeoScore);

  // ── Generate findings ──
  const reportData: AuditReportData = {
    scannerVersion: SCANNER_VERSION,
    pageSpeed,
    htmlAnalysis,
    seoAnalysis,
    securityAnalysis,
    technologies,
    conversionAnalysis,
    findings: [], // Will be populated below
    freeFindingCount: 3, // First 3 findings are free
    scores: {
      overall: scores.overall,
      performance: scores.performance,
      seo: scores.seo,
      accessibility: scores.accessibility,
      bestPracticesSecurity: scores.bestPracticesSecurity,
      mobileReadiness: scores.mobileReadiness,
      conversionReadiness: scores.conversionReadiness,
    },
  };

  reportData.findings = generateFindings(reportData);

  // ── Generate recommendations (stored separately, not in AuditReportData) ──
  // The recommendations module is used by the API route to build the response.
  // We import it here to ensure the module is exercised during the audit pipeline.
  const _recommendations = generateRecommendations(
    reportData.findings,
    {
      performance: scores.performance,
      seo: scores.seo,
      accessibility: scores.accessibility,
      bestPracticesSecurity: scores.bestPracticesSecurity,
      mobileReadiness: scores.mobileReadiness,
      conversionReadiness: scores.conversionReadiness,
    },
  );

  // ── Stage 6: Completed ──
  await updateStatus('completed');

  return reportData;
}
