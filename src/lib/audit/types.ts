/**
 * Complete TypeScript types for the Website Revenue Audit Funnel.
 *
 * These types mirror the database schema, PageSpeed Insights responses,
 * and all intermediate analysis results. They are the single source of
 * truth consumed by the scanner, API routes, and UI components.
 */

import { AUDIT_STATUSES, LEAD_STATUSES, EVENT_TYPES } from './constants';

// ──────────────────────────────────────────────────────────────
// Status & event unions (derived from constant arrays)
// ──────────────────────────────────────────────────────────────

export type AuditStatus = (typeof AUDIT_STATUSES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type EventType = (typeof EVENT_TYPES)[number];

// ──────────────────────────────────────────────────────────────
// PageSpeed Insights types
// ──────────────────────────────────────────────────────────────

export type PageSpeedStrategy = 'mobile' | 'desktop';

/** Raw metric item from a Lighthouse audit. */
export interface PageSpeedMetricItem {
  score?: number | null;
  numericValue?: number | null;
  displayValue?: string | null;
}

/** Raw opportunity / diagnostic item from Lighthouse. */
export interface PageSpeedAuditRef {
  id: string;
  title: string;
  description?: string;
  score?: number | null;
  numericValue?: number | null;
  displayValue?: string | null;
  details?: {
    type?: string;
    items?: Record<string, unknown>[];
    overallSavingsMs?: number;
    overallSavingsBytes?: number;
    [key: string]: unknown;
  };
}

/** Top-level result from the PageSpeed Insights API. */
export interface PageSpeedResult {
  captchaResult?: string;
  kind?: string;
  lighthouseResult?: {
    requestedUrl?: string;
    finalUrl?: string;
    finalDisplayedUrl?: string;
    userAgent?: string;
    fetchTime?: string;
    runWarnings?: unknown[];
    categories?: {
      performance?: { score?: number | null; id?: string; title?: string };
      seo?: { score?: number | null; id?: string; title?: string };
      accessibility?: { score?: number | null; id?: string; title?: string };
      'best-practices'?: { score?: number | null; id?: string; title?: string };
    };
    audits?: Record<string, PageSpeedAuditRef>;
  };
  loadingExperience?: {
    metrics?: {
      FIRST_CONTENTFUL_PAINT_MS?: { percentile?: number; category?: string };
      LARGEST_CONTENTFUL_PAINT_MS?: { percentile?: number; category?: string };
      CUMULATIVE_LAYOUT_SHIFT_SCORE?: { percentile?: number; category?: string };
      INTERACTION_TO_NEXT_PAINT_MS?: { percentile?: number; category?: string };
    };
    overall_category?: string;
  };
  error?: { code?: number; message?: string; errors?: { message?: string; domain?: string; reason?: string }[] };
}

/** Normalised core-web-vital metric. */
export interface NormalizedMetric {
  /** 0–1 score from Lighthouse (null if unavailable). */
  score: number | null;
  /** Raw numeric value in the metric's native unit (ms, unitless, etc.). */
  numericValue: number | null;
  /** Human-readable display string from Lighthouse. */
  displayValue: string | null;
}

/** Normalised PageSpeed result — our own shape, decoupled from the raw API. */
export interface NormalizedPageSpeed {
  strategy: PageSpeedStrategy;
  requestedUrl: string;
  finalUrl: string | null;
  fetchTime: string | null;

  /** Lighthouse category scores (0–100, null if unavailable). */
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;

  /** Core Web Vitals. */
  metrics: {
    firstContentfulPaint: NormalizedMetric;
    largestContentfulPaint: NormalizedMetric;
    cumulativeLayoutShift: NormalizedMetric;
    totalBlockingTime: NormalizedMetric;
    speedIndex: NormalizedMetric;
    interactionToNextPaint: NormalizedMetric;
  };

  /** Actionable opportunities with estimated savings. */
  opportunities: NormalizedOpportunity[];

  /** Any warnings from the Lighthouse run. */
  runWarnings: string[];
}

export interface NormalizedOpportunity {
  id: string;
  title: string;
  savingsMs: number;
  savingsBytes: number | null;
  displayValue: string | null;
}

// ──────────────────────────────────────────────────────────────
// HTML analysis types
// ──────────────────────────────────────────────────────────────

export interface HtmlAnalysisResult {
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1Count: number;
  h1Text: string | null;
  h2Count: number;
  language: string | null;
  charset: string | null;
  viewport: string | null;
  canonical: string | null;
  faviconPresent: boolean;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  openGraphTags: Record<string, string>;
  twitterCardTags: Record<string, string>;
  imageCount: number;
  imagesWithoutAlt: number;
  totalLinks: number;
  externalLinks: number;
  internalLinks: number;
  hasNoindexTag: boolean;
  hasNofollowTag: boolean;
  renderBlockingResources: string[];
  inlineStylesCount: number;
  inlineScriptsCount: number;
  formsCount: number;
  hasContactInfo: boolean;
  hasPhoneNumber: boolean;
  hasEmailLink: boolean;
  hasAddress: boolean;
  hasMapEmbed: boolean;
  hasSocialLinks: boolean;
  socialPlatforms: string[];
  hasAnalytics: boolean;
  analyticsProviders: string[];
  hasCookieConsent: boolean;
  hasCallToAction: boolean;
  ctaButtons: string[];
  hasTestimonials: boolean;
  hasPricing: boolean;
  hasFaqSchema: boolean;
  hasLogo: boolean;
  hasHamburgerMenu: boolean;
  estimatedWordCount: number;
  readabilityNote: string | null;
  htmlSizeBytes: number;
}

// ──────────────────────────────────────────────────────────────
// SEO analysis types
// ──────────────────────────────────────────────────────────────

export interface SeoAnalysisResult {
  titleTagPresent: boolean;
  titleTagOptimal: boolean;
  titleTagIssues: string[];
  metaDescriptionPresent: boolean;
  metaDescriptionOptimal: boolean;
  metaDescriptionIssues: string[];
  canonicalTagPresent: boolean;
  canonicalTagIssues: string[];
  h1Present: boolean;
  h1Single: boolean;
  h1Issues: string[];
  imagesHaveAlt: boolean;
  imageAltIssues: string[];
  urlStructure: {
    isHttps: boolean;
    hasWww: boolean | null;
    hasTrailingSlash: boolean;
    pathDepth: number;
    hasUtmParams: boolean;
    isCleanUrl: boolean;
    issues: string[];
  };
  robotsTxtAccessible: boolean | null;
  robotsTxtIssues: string[];
  sitemapXmlAccessible: boolean | null;
  sitemapXmlIssues: string[];
  structuredDataPresent: boolean;
  structuredDataValid: boolean | null;
  structuredDataIssues: string[];
  openGraphComplete: boolean;
  openGraphIssues: string[];
  indexability: {
    isIndexable: boolean;
    issues: string[];
  };
  mobileFriendliness: {
    hasViewport: boolean;
    viewportConfigured: boolean;
    issues: string[];
  };
  internalLinkCount: number;
  externalLinkCount: number;
  linkIssues: string[];
  overallAssessment: string;
}

// ──────────────────────────────────────────────────────────────
// Security analysis types
// ──────────────────────────────────────────────────────────────

export interface SecurityHeaderResult {
  name: string;
  present: boolean;
  value: string | null;
  recommendation: string;
  severity: 'positive' | 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityAnalysisResult {
  isHttps: boolean;
  hasRedirectToHttps: boolean;
  securityHeaders: SecurityHeaderResult[];
  mixedContentIssues: string[];
  cookieFlags: {
    totalCookies: number;
    secureCookies: number;
    httpOnlyCookies: number;
    sameSiteCookies: number;
    issues: string[];
  };
  certificateInfo: {
    valid: boolean | null;
    expiresSoon: boolean;
    daysUntilExpiry: number | null;
    issuer: string | null;
    issues: string[];
  } | null;
  overallAssessment: string;
}

// ──────────────────────────────────────────────────────────────
// Technology detection
// ──────────────────────────────────────────────────────────────

export type TechnologyCategory =
  | 'cms'
  | 'framework'
  | 'hosting'
  | 'cdn'
  | 'analytics'
  | 'advertising'
  | 'marketing'
  | 'security'
  | 'ecommerce'
  | 'builder'
  | 'other';

export interface TechnologyDetection {
  name: string;
  category: TechnologyCategory;
  /** 0–1 confidence score. */
  confidence: number;
  /** How we detected this technology. */
  evidence: string;
}

// ──────────────────────────────────────────────────────────────
// Conversion / business-readiness analysis
// ──────────────────────────────────────────────────────────────

export interface ConversionAnalysisResult {
  /** Is there a clear primary call-to-action above the fold? */
  hasPrimaryCta: boolean;
  primaryCtaText: string | null;
  /** Number of distinct CTA elements on the page. */
  ctaCount: number;
  ctaIssues: string[];

  /** Contact information presence. */
  hasContactSection: boolean;
  contactIssues: string[];

  /** Trust signals. */
  hasTestimonials: boolean;
  testimonialIssues: string[];
  hasSocialProof: boolean;
  socialProofIssues: string[];
  hasTrustBadges: boolean;
  trustBadgeIssues: string[];

  /** Value proposition clarity. */
  hasValueProposition: boolean;
  valuePropositionIssues: string[];

  /** Mobile CTA usability. */
  mobileCtaAccessible: boolean;
  mobileCtaIssues: string[];

  /** Form usability. */
  hasContactForm: boolean;
  formIssues: string[];

  /** Social / community links. */
  hasSocialLinks: boolean;
  socialPlatforms: string[];

  /** Pricing visibility. */
  hasPricingInfo: boolean;
  pricingIssues: string[];

  /** FAQ / objection handling. */
  hasFaq: boolean;
  faqIssues: string[];

  /** Overall conversion readiness assessment. */
  overallAssessment: string;
}

// ──────────────────────────────────────────────────────────────
// Findings
// ──────────────────────────────────────────────────────────────

export type FindingCategory =
  | 'performance'
  | 'seo'
  | 'accessibility'
  | 'security'
  | 'mobile'
  | 'conversion';

export type FindingSeverity =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'positive';

export type FindingSource =
  | 'pagespeed-mobile'
  | 'pagespeed-desktop'
  | 'html-analysis'
  | 'seo-analysis'
  | 'security-analysis'
  | 'technology-detection'
  | 'conversion-analysis'
  | 'synthesis';

export interface AuditFinding {
  /** Stable unique id (e.g., "perf-lcp-slow"). */
  id: string;
  /** High-level category. */
  category: FindingCategory;
  /** Severity level. */
  severity: FindingSeverity;
  /** Short human-readable title. */
  title: string;
  /** One-line summary of the issue. */
  summary: string;
  /** Why this matters for the business. */
  whyItMatters: string;
  /** Supporting evidence (metric values, specific elements, etc.). */
  evidence: string[];
  /** Actionable recommendation. */
  recommendation: string;
  /** Business impact rating (1 = low, 5 = high). */
  impact: 1 | 2 | 3 | 4 | 5;
  /** Implementation effort rating (1 = easy, 5 = hard). */
  effort: 1 | 2 | 3 | 4 | 5;
  /** Confidence in the finding (0–1). */
  confidence: number;
  /** Which analysis step produced this finding. */
  source: FindingSource;
}

// ──────────────────────────────────────────────────────────────
// Complete report data
// ──────────────────────────────────────────────────────────────

export interface AuditReportData {
  /** Scanner version that produced this report. */
  scannerVersion: string;

  /** Normalised PageSpeed results. */
  pageSpeed: {
    mobile: NormalizedPageSpeed | null;
    desktop: NormalizedPageSpeed | null;
  };

  /** HTML content analysis. */
  htmlAnalysis: HtmlAnalysisResult | null;

  /** SEO analysis. */
  seoAnalysis: SeoAnalysisResult | null;

  /** Security analysis. */
  securityAnalysis: SecurityAnalysisResult | null;

  /** Detected technologies. */
  technologies: TechnologyDetection[];

  /** Conversion / business-readiness analysis. */
  conversionAnalysis: ConversionAnalysisResult | null;

  /** Consolidated findings (free preview + locked). */
  findings: AuditFinding[];

  /** Number of findings shown in the free preview. */
  freeFindingCount: number;

  /** Computed scores (0–100, null when unavailable). */
  scores: {
    overall: number | null;
    performance: number | null;
    seo: number | null;
    accessibility: number | null;
    bestPracticesSecurity: number | null;
    mobileReadiness: number | null;
    conversionReadiness: number | null;
  };
}

// ──────────────────────────────────────────────────────────────
// DTOs for API responses
// ──────────────────────────────────────────────────────────────

/**
 * Public audit DTO — returned before the lead unlocks the full report.
 * Contains preview findings only (first `freeFindingCount` items).
 */
export interface PublicAuditDto {
  id: string;
  hostname: string;
  normalizedUrl: string;
  status: AuditStatus;
  overallScore: number | null;
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesSecurityScore: number | null;
  mobileReadinessScore: number | null;
  conversionReadinessScore: number | null;
  /** Preview findings only. */
  findings: AuditFinding[];
  freeFindingCount: number;
  totalFindingCount: number;
  safeErrorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

/**
 * Full audit DTO — returned after the lead unlocks.
 * Contains all findings plus the full report data.
 */
export interface FullAuditDto extends PublicAuditDto {
  findings: AuditFinding[];
  reportData: AuditReportData;
  cacheHit: boolean;
  expiresAt: string | null;
}

// ──────────────────────────────────────────────────────────────
// API input types
// ──────────────────────────────────────────────────────────────

export interface AuditCreateInput {
  url: string;
  utmData?: Record<string, string> | null;
  /** Cloudflare Turnstile response token. */
  turnstileToken?: string | null;
}

export interface AuditUnlockInput {
  auditId: string;
  firstName: string;
  email: string;
  businessName?: string | null;
  marketingConsent?: boolean;
  /** Cloudflare Turnstile response token. */
  turnstileToken?: string | null;
}

// ──────────────────────────────────────────────────────────────
// UTM data shape
// ──────────────────────────────────────────────────────────────

export interface UtmData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  [key: string]: string | undefined;
}

// ──────────────────────────────────────────────────────────────
// Access token payload (for email links)
// ──────────────────────────────────────────────────────────────

export interface AccessTokenPayload {
  auditId: string;
  leadId: string;
  exp: number;
  iat: number;
}
