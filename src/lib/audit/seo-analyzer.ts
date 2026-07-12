/**
 * SEO scoring for the Website Revenue Audit Funnel.
 *
 * Produces a deterministic 0-100 score based on a fixed rubric:
 *   Title 12, Meta desc 10, H1 10, Canonical 8, Indexability 7,
 *   Language 5, Viewport 5, OG 8, Twitter 4, Structured data 8,
 *   Image alt 8, Heading structure 5, Sitemap 5, Robots.txt 5 = 100
 *
 * Doesn't award points for empty/invalid tags.
 * Doesn't rigidly penalize slight character count variations.
 */

import type { HtmlAnalysisResult, SeoAnalysisResult } from './types';

// ──────────────────────────────────────────────────────────────
// Scoring rubric constants
// ──────────────────────────────────────────────────────────────

const RUBRIC = {
  title: 12,
  metaDescription: 10,
  h1: 10,
  canonical: 8,
  indexability: 7,
  language: 5,
  viewport: 5,
  openGraph: 8,
  twitter: 4,
  structuredData: 8,
  imageAlt: 8,
  headingStructure: 5,
  sitemap: 5,
  robotsTxt: 5,
} as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TOTAL_POSSIBLE = Object.values(RUBRIC).reduce((sum, v) => sum + v, 0); // 100

// ──────────────────────────────────────────────────────────────
// Title tag assessment
// ──────────────────────────────────────────────────────────────

function assessTitle(html: HtmlAnalysisResult): {
  score: number;
  present: boolean;
  optimal: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 0;

  if (!html.title || html.title.trim().length === 0) {
    return { score: 0, present: false, optimal: false, issues: ['Missing page title tag'] };
  }

  score += RUBRIC.title * 0.4; // 40% for presence
  const len = html.titleLength;

  // Optimal range: 10-60 characters (guidance, not rigid)
  // Very short (< 10): probably not descriptive enough
  // Very long (> 60): may be truncated in search results
  if (len >= 10 && len <= 60) {
    score += RUBRIC.title * 0.6; // Full marks for optimal length
  } else if (len >= 5 && len <= 70) {
    // Close enough — partial credit
    score += RUBRIC.title * 0.4;
    if (len < 10) issues.push('Title is quite short — consider making it more descriptive (aim for 10-60 characters)');
    if (len > 60) issues.push('Title is longer than 60 characters and may be truncated in search results');
  } else {
    score += RUBRIC.title * 0.1;
    if (len < 5) issues.push('Title is very short — it likely doesn\'t describe the page well');
    if (len > 70) issues.push('Title is significantly longer than 60 characters and will likely be truncated');
  }

  return {
    score: Math.round(score),
    present: true,
    optimal: issues.length === 0,
    issues,
  };
}

// ──────────────────────────────────────────────────────────────
// Meta description assessment
// ──────────────────────────────────────────────────────────────

function assessMetaDescription(html: HtmlAnalysisResult): {
  score: number;
  present: boolean;
  optimal: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 0;

  if (!html.metaDescription || html.metaDescription.trim().length === 0) {
    return { score: 0, present: false, optimal: false, issues: ['Missing meta description'] };
  }

  score += RUBRIC.metaDescription * 0.4; // 40% for presence
  const len = html.metaDescriptionLength;

  // Optimal: 120-160 characters (guidance)
  if (len >= 120 && len <= 160) {
    score += RUBRIC.metaDescription * 0.6;
  } else if (len >= 50 && len <= 170) {
    // Reasonable range — partial credit
    score += RUBRIC.metaDescription * 0.35;
    if (len < 120) issues.push('Meta description is shorter than recommended (aim for 120-160 characters for best search result display)');
    if (len > 160) issues.push('Meta description exceeds 160 characters and may be truncated in search results');
  } else {
    score += RUBRIC.metaDescription * 0.1;
    if (len < 50) issues.push('Meta description is very short — it may not provide enough context for searchers');
    if (len > 170) issues.push('Meta description is significantly longer than 160 characters and will likely be truncated');
  }

  return {
    score: Math.round(score),
    present: true,
    optimal: issues.length === 0,
    issues,
  };
}

// ──────────────────────────────────────────────────────────────
// H1 assessment
// ──────────────────────────────────────────────────────────────

function assessH1(html: HtmlAnalysisResult): {
  score: number;
  present: boolean;
  single: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 0;

  if (html.h1Count === 0) {
    return { score: 0, present: false, single: false, issues: ['No H1 heading found — every page should have one'] };
  }

  score += RUBRIC.h1 * 0.6; // 60% for presence

  if (html.h1Count === 1) {
    score += RUBRIC.h1 * 0.4; // Full marks for single H1
  } else {
    // Multiple H1s — partial credit, flag it
    score += RUBRIC.h1 * 0.1;
    issues.push(`Found ${html.h1Count} H1 headings — best practice is to use exactly one H1 per page`);
  }

  if (!html.h1Text || html.h1Text.trim().length === 0) {
    issues.push('H1 heading appears to be empty');
    score = Math.min(score, RUBRIC.h1 * 0.3);
  }

  return {
    score: Math.round(score),
    present: true,
    single: html.h1Count === 1,
    issues,
  };
}

// ──────────────────────────────────────────────────────────────
// Canonical tag assessment
// ──────────────────────────────────────────────────────────────

function assessCanonical(html: HtmlAnalysisResult, _url: string): {
  score: number;
  present: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!html.canonical) {
    return { score: 0, present: false, issues: ['No canonical URL tag found — this helps prevent duplicate content issues'] };
  }

  // Canonical is present — award full points
  // We don't penalize if it points to a different URL, as this may be intentional
  // (e.g., syndicated content, parameter consolidation)
  return { score: RUBRIC.canonical, present: true, issues: [] };
}

// ──────────────────────────────────────────────────────────────
// Indexability assessment
// ──────────────────────────────────────────────────────────────

function assessIndexability(html: HtmlAnalysisResult): {
  score: number;
  isIndexable: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (html.hasNoindexTag) {
    issues.push('Page has a noindex meta tag — search engines are instructed not to index this page');
    return { score: 0, isIndexable: false, issues };
  }

  return { score: RUBRIC.indexability, isIndexable: true, issues: [] };
}

// ──────────────────────────────────────────────────────────────
// Language assessment
// ──────────────────────────────────────────────────────────────

function assessLanguage(html: HtmlAnalysisResult): {
  score: number;
  issues: string[];
} {
  if (!html.language) {
    return { score: 0, issues: ['No HTML lang attribute found — this helps search engines and screen readers understand the page language'] };
  }

  return { score: RUBRIC.language, issues: [] };
}

// ──────────────────────────────────────────────────────────────
// Viewport assessment
// ──────────────────────────────────────────────────────────────

function assessViewport(html: HtmlAnalysisResult): {
  score: number;
  hasViewport: boolean;
  configured: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!html.viewport) {
    return {
      score: 0,
      hasViewport: false,
      configured: false,
      issues: ['No viewport meta tag found — this is essential for mobile-friendly rendering'],
    };
  }

  // Check if viewport is properly configured (has width=device-width)
  const configured = html.viewport.includes('width=device-width') || html.viewport.includes('width = device-width');
  if (!configured) {
    issues.push('Viewport meta tag exists but may not be properly configured for responsive design');
    return { score: RUBRIC.viewport * 0.5, hasViewport: true, configured: false, issues };
  }

  return { score: RUBRIC.viewport, hasViewport: true, configured: true, issues: [] };
}

// ──────────────────────────────────────────────────────────────
// Open Graph assessment
// ──────────────────────────────────────────────────────────────

function assessOpenGraph(html: HtmlAnalysisResult): {
  score: number;
  complete: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const hasTitle = 'title' in html.openGraphTags && !!html.openGraphTags.title;
  const hasDescription = 'description' in html.openGraphTags && !!html.openGraphTags.description;
  const hasImage = 'image' in html.openGraphTags && !!html.openGraphTags.image;

  if (!hasTitle && !hasDescription && !hasImage) {
    return { score: 0, complete: false, issues: ['No Open Graph meta tags found — these control how your page appears when shared on social media'] };
  }

  let score = 0;
  const total = RUBRIC.openGraph;

  if (hasTitle) score += total * 0.35;
  else issues.push('Missing og:title — social shares may show an incorrect or empty title');

  if (hasDescription) score += total * 0.3;
  else issues.push('Missing og:description — social shares may show an incorrect or empty description');

  if (hasImage) score += total * 0.35;
  else issues.push('Missing og:image — social shares will not show a preview image');

  return {
    score: Math.round(score),
    complete: hasTitle && hasDescription && hasImage,
    issues,
  };
}

// ──────────────────────────────────────────────────────────────
// Twitter Card assessment
// ──────────────────────────────────────────────────────────────

function assessTwitter(html: HtmlAnalysisResult): {
  score: number;
  issues: string[];
} {
  const hasCard = 'card' in html.twitterCardTags && !!html.twitterCardTags.card;
  const hasTitle = 'title' in html.twitterCardTags && !!html.twitterCardTags.title;
  const hasDescription = 'description' in html.twitterCardTags && !!html.twitterCardTags.description;

  if (!hasCard && !hasTitle && !hasDescription) {
    return { score: 0, issues: ['No Twitter Card meta tags found — these control how your page appears when shared on Twitter/X'] };
  }

  let score = 0;
  const total = RUBRIC.twitter;

  if (hasCard) score += total * 0.4;
  if (hasTitle) score += total * 0.3;
  if (hasDescription) score += total * 0.3;

  return { score: Math.round(score), issues: [] };
}

// ──────────────────────────────────────────────────────────────
// Structured data assessment
// ──────────────────────────────────────────────────────────────

function assessStructuredData(html: HtmlAnalysisResult): {
  score: number;
  present: boolean;
  valid: boolean | null;
  issues: string[];
} {
  if (!html.hasStructuredData) {
    return { score: 0, present: false, valid: null, issues: ['No JSON-LD structured data found — this helps search engines understand your content and can enable rich results'] };
  }

  // Structured data is present
  // Note: We don't validate the schema here — that would require a separate API call.
  // We mark validity as null (unknown) rather than assuming it's valid.
  return { score: RUBRIC.structuredData, present: true, valid: null, issues: [] };
}

// ──────────────────────────────────────────────────────────────
// Image alt text assessment
// ──────────────────────────────────────────────────────────────

function assessImageAlt(html: HtmlAnalysisResult): {
  score: number;
  allHaveAlt: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (html.imageCount === 0) {
    // No images — can't assess, award full points (nothing to penalize)
    return { score: RUBRIC.imageAlt, allHaveAlt: true, issues: [] };
  }

  const ratio = 1 - (html.imagesWithoutAlt / html.imageCount);

  if (ratio === 1) {
    return { score: RUBRIC.imageAlt, allHaveAlt: true, issues: [] };
  }

  // Partial credit based on ratio
  let score = Math.round(RUBRIC.imageAlt * ratio);

  if (html.imagesWithoutAlt === html.imageCount) {
    score = 0;
    issues.push(`All ${html.imageCount} images are missing alt text — this hurts accessibility and SEO`);
  } else {
    issues.push(`${html.imagesWithoutAlt} of ${html.imageCount} images are missing alt text — every image should have descriptive alt text`);
  }

  return { score, allHaveAlt: ratio === 1, issues };
}

// ──────────────────────────────────────────────────────────────
// Heading structure assessment
// ──────────────────────────────────────────────────────────────

function assessHeadingStructure(html: HtmlAnalysisResult): {
  score: number;
  issues: string[];
} {
  const issues: string[] = [];

  // Check: H1 exists (already covered by H1 assessment, but we check structure too)
  if (html.h1Count === 0) {
    issues.push('No H1 heading — heading hierarchy should start with H1');
  }

  // Multiple H1s is a structural issue too
  if (html.h1Count > 1) {
    issues.push(`Multiple H1 headings (${html.h1Count}) found — heading hierarchy should have a single H1`);
  }

  // If we have H1s but no H2s, that's not necessarily bad for simple pages
  // But it's worth noting for content-heavy pages
  if (html.h1Count === 1 && html.h2Count === 0 && html.estimatedWordCount > 500) {
    issues.push('Only H1 and no H2+ subheadings on a content-rich page — consider adding subheadings for better structure');
  }

  if (issues.length === 0) {
    return { score: RUBRIC.headingStructure, issues: [] };
  }

  // Partial credit based on how many issues
  const deduction = issues.length * (RUBRIC.headingStructure * 0.4);
  const score = Math.max(0, Math.round(RUBRIC.headingStructure - deduction));

  return { score, issues };
}

// ──────────────────────────────────────────────────────────────
// URL structure assessment
// ──────────────────────────────────────────────────────────────

function assessUrlStructure(url: string): {
  isHttps: boolean;
  hasWww: boolean | null;
  hasTrailingSlash: boolean;
  pathDepth: number;
  hasUtmParams: boolean;
  isCleanUrl: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    return {
      isHttps: false,
      hasWww: null,
      hasTrailingSlash: false,
      pathDepth: 0,
      hasUtmParams: false,
      isCleanUrl: false,
      issues: ['Invalid URL format'],
    };
  }

  const isHttps = parsedUrl.protocol === 'https:';
  const hasWww = parsedUrl.hostname.startsWith('www.') ? true : parsedUrl.hostname.startsWith('www') ? null : false;
  const hasTrailingSlash = parsedUrl.pathname.endsWith('/') && parsedUrl.pathname.length > 1;
  const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
  const pathDepth = pathParts.length;
  const hasUtmParams = parsedUrl.search.includes('utm_');
  const isCleanUrl = !hasUtmParams && !/[A-Z]/.test(parsedUrl.pathname) && !/%[0-9A-Fa-f]{2}/.test(parsedUrl.pathname);

  if (!isHttps) {
    issues.push('URL uses HTTP instead of HTTPS — secure URLs are a ranking signal');
  }

  if (pathDepth > 4) {
    issues.push('URL path is deeply nested (4+ levels) — flatter URL structures are generally better for SEO');
  }

  if (hasUtmParams) {
    issues.push('URL contains UTM parameters — these should be removed before auditing the canonical URL');
  }

  return {
    isHttps,
    hasWww,
    hasTrailingSlash,
    pathDepth,
    hasUtmParams,
    isCleanUrl,
    issues,
  };
}

// ──────────────────────────────────────────────────────────────
// Link text assessment
// ──────────────────────────────────────────────────────────────

function assessLinks(_html: HtmlAnalysisResult): {
  issues: string[];
} {
  // This is informational — no direct score impact
  return { issues: [] };
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Calculate the SEO score from HTML analysis results.
 *
 * Produces a deterministic 0-100 score and detailed per-item assessment.
 * The rubric totals 100 points exactly.
 */
export function calculateSeoScore(
  htmlAnalysis: HtmlAnalysisResult,
  url: string,
  robotsTxtAccessible: boolean | null,
  sitemapXmlAccessible: boolean | null,
): { score: number; details: SeoAnalysisResult } {
  // ── Assess each rubric item ──
  const title = assessTitle(htmlAnalysis);
  const metaDesc = assessMetaDescription(htmlAnalysis);
  const h1 = assessH1(htmlAnalysis);
  const canonical = assessCanonical(htmlAnalysis, url);
  const indexability = assessIndexability(htmlAnalysis);
  const language = assessLanguage(htmlAnalysis);
  const viewport = assessViewport(htmlAnalysis);
  const og = assessOpenGraph(htmlAnalysis);
  const twitter = assessTwitter(htmlAnalysis);
  const structuredData = assessStructuredData(htmlAnalysis);
  const imageAlt = assessImageAlt(htmlAnalysis);
  const headingStructure = assessHeadingStructure(htmlAnalysis);
  const urlStructure = assessUrlStructure(url);
  const linkAssessment = assessLinks(htmlAnalysis);

  // ── Sitemap & robots.txt ──
  const sitemapScore = sitemapXmlAccessible === true ? RUBRIC.sitemap : 0;
  const sitemapIssues: string[] = [];
  if (sitemapXmlAccessible === false) sitemapIssues.push('sitemap.xml not found or not accessible');
  if (sitemapXmlAccessible === null) sitemapIssues.push('Could not determine sitemap.xml availability');

  const robotsScore = robotsTxtAccessible === true ? RUBRIC.robotsTxt : 0;
  const robotsIssues: string[] = [];
  if (robotsTxtAccessible === false) robotsIssues.push('robots.txt not found or not accessible');
  if (robotsTxtAccessible === null) robotsIssues.push('Could not determine robots.txt availability');

  // ── Total score ──
  const rawScore =
    title.score +
    metaDesc.score +
    h1.score +
    canonical.score +
    indexability.score +
    language.score +
    viewport.score +
    og.score +
    twitter.score +
    structuredData.score +
    imageAlt.score +
    headingStructure.score +
    sitemapScore +
    robotsScore;

  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // ── Overall assessment ──
  let overallAssessment: string;
  if (score >= 90) overallAssessment = 'Excellent — the page has strong technical SEO fundamentals.';
  else if (score >= 75) overallAssessment = 'Good — most SEO basics are covered with a few areas to improve.';
  else if (score >= 60) overallAssessment = 'Fair — several SEO improvements would help search visibility.';
  else if (score >= 40) overallAssessment = 'Needs improvement — significant SEO issues that should be addressed.';
  else overallAssessment = 'Critical — major SEO problems are likely harming search visibility.';

  const details: SeoAnalysisResult = {
    titleTagPresent: title.present,
    titleTagOptimal: title.optimal,
    titleTagIssues: title.issues,
    metaDescriptionPresent: metaDesc.present,
    metaDescriptionOptimal: metaDesc.optimal,
    metaDescriptionIssues: metaDesc.issues,
    canonicalTagPresent: canonical.present,
    canonicalTagIssues: canonical.issues,
    h1Present: h1.present,
    h1Single: h1.single,
    h1Issues: h1.issues,
    imagesHaveAlt: imageAlt.allHaveAlt,
    imageAltIssues: imageAlt.issues,
    urlStructure,
    robotsTxtAccessible,
    robotsTxtIssues: robotsIssues,
    sitemapXmlAccessible,
    sitemapXmlIssues: sitemapIssues,
    structuredDataPresent: structuredData.present,
    structuredDataValid: structuredData.valid,
    structuredDataIssues: structuredData.issues,
    openGraphComplete: og.complete,
    openGraphIssues: og.issues,
    indexability: {
      isIndexable: indexability.isIndexable,
      issues: indexability.issues,
    },
    mobileFriendliness: {
      hasViewport: viewport.hasViewport,
      viewportConfigured: viewport.configured,
      issues: viewport.issues,
    },
    internalLinkCount: htmlAnalysis.internalLinks,
    externalLinkCount: htmlAnalysis.externalLinks,
    linkIssues: linkAssessment.issues,
    overallAssessment,
  };

  return { score, details };
}
