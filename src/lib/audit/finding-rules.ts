/**
 * Generate findings from analysis results for the Website Revenue Audit Funnel.
 *
 * Converts analysis results into AuditFinding objects with proper category,
 * severity, title, summary, whyItMatters, evidence, recommendation,
 * impact, effort, confidence, and source.
 *
 * Severity: critical (score 0-25), high (26-50), medium (51-75), low (76-89), positive (90+)
 *
 * Groups duplicate findings (e.g., Lighthouse image warning + HTML oversized-image →
 * one image optimization finding; Missing OG title + desc → one social metadata finding).
 *
 * Generates positive findings too (what's working).
 *
 * Sort: severity desc, impact desc, confidence desc, effort asc.
 *
 * Doesn't allow 25 low-value metadata warnings to bury one major performance/indexability problem.
 */

import type {
  AuditFinding,
  AuditReportData,
  FindingSeverity,
  FindingSource,
  NormalizedPageSpeed,
  HtmlAnalysisResult,
  SeoAnalysisResult,
  SecurityAnalysisResult,
  ConversionAnalysisResult,
  TechnologyDetection,
} from './types';
import { calculateConversionScore } from './conversion-analyzer';
import { calculateScoresWithCustomSeo, type ScoreResult } from './scoring';

// ──────────────────────────────────────────────────────────────
// Severity helpers
// ──────────────────────────────────────────────────────────────

function _scoreToSeverity(score: number): FindingSeverity {
  if (score >= 90) return 'positive';
  if (score >= 76) return 'low';
  if (score >= 51) return 'medium';
  if (score >= 26) return 'high';
  return 'critical';
}

function severityOrder(s: FindingSeverity): number {
  switch (s) {
    case 'critical': return 5;
    case 'high': return 4;
    case 'medium': return 3;
    case 'low': return 2;
    case 'positive': return 1;
    default: return 0;
  }
}

// ──────────────────────────────────────────────────────────────
// Finding deduplication / grouping
// ──────────────────────────────────────────────────────────────

/**
 * Group findings by a deduplication key.
 * If multiple findings share a key, merge them into one.
 */
function deduplicateFindings(findings: AuditFinding[]): AuditFinding[] {
  const groups = new Map<string, AuditFinding[]>();

  for (const finding of findings) {
    const key = finding.id;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(finding);
  }

  const result: AuditFinding[] = [];
  for (const [, group] of groups) {
    if (group.length === 1) {
      result.push(group[0]);
      continue;
    }

    // Merge: combine evidence, use highest impact/confidence, most severe
    const merged = group[0];
    const allEvidence = group.flatMap((f) => f.evidence).filter((v, i, a) => a.indexOf(v) === i);
    const maxImpact = Math.max(...group.map((f) => f.impact)) as AuditFinding['impact'];
    const maxConfidence = Math.max(...group.map((f) => f.confidence));
    const worstSeverity = group.sort((a, b) => severityOrder(b.severity) - severityOrder(a.severity))[0].severity;

    result.push({
      ...merged,
      severity: worstSeverity,
      evidence: allEvidence.slice(0, 8),
      impact: maxImpact,
      confidence: maxConfidence,
      summary: merged.summary, // Keep the first (most detailed) summary
      source: group.some((f) => f.source === 'synthesis') ? 'synthesis' as FindingSource : merged.source,
    });
  }

  return result;
}

// ──────────────────────────────────────────────────────────────
// Performance findings
// ──────────────────────────────────────────────────────────────

function generatePerformanceFindings(
  mobile: NormalizedPageSpeed | null,
  desktop: NormalizedPageSpeed | null,
  scores: ScoreResult,
): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const _perf = scores.performance;

  // ── Overall performance assessment ──
  if (mobile?.performanceScore != null) {
    if (mobile.performanceScore < 50) {
      findings.push({
        id: 'perf-mobile-slow',
        category: 'performance',
        severity: mobile.performanceScore < 25 ? 'critical' : 'high',
        title: 'Poor mobile performance',
        summary: `Mobile performance score is ${mobile.performanceScore}/100 — the site loads slowly on mobile devices.`,
        whyItMatters: 'Over 60% of web traffic is mobile. Slow loading directly increases bounce rates — each additional second of load time can reduce conversions by 7%.',
        evidence: [`Mobile performance: ${mobile.performanceScore}/100`],
        recommendation: 'Focus on the specific opportunities listed below to improve mobile load times. Start with the highest-impact items.',
        impact: 5,
        effort: 3,
        confidence: 0.95,
        source: 'pagespeed-mobile',
      });
    } else if (mobile.performanceScore >= 90) {
      findings.push({
        id: 'perf-mobile-fast',
        category: 'performance',
        severity: 'positive',
        title: 'Strong mobile performance',
        summary: `Mobile performance score is ${mobile.performanceScore}/100 — the site loads quickly on mobile devices.`,
        whyItMatters: 'Fast mobile performance keeps visitors engaged and improves search rankings, since Google uses mobile-first indexing.',
        evidence: [`Mobile performance: ${mobile.performanceScore}/100`],
        recommendation: 'Continue monitoring performance as the site evolves. Even small regressions can impact user experience.',
        impact: 5,
        effort: 1,
        confidence: 0.95,
        source: 'pagespeed-mobile',
      });
    }
  }

  // ── Core Web Vitals ──
  if (mobile) {
    const lcp = mobile.metrics.largestContentfulPaint;
    if (lcp.numericValue != null && lcp.score != null && lcp.score < 0.9) {
      findings.push({
        id: 'perf-lcp-slow',
        category: 'performance',
        severity: lcp.score < 0.5 ? 'critical' : lcp.score < 0.75 ? 'high' : 'medium',
        title: 'Largest Contentful Paint is slow',
        summary: `LCP is ${lcp.displayValue || `${Math.round(lcp.numericValue)}ms`} — this is the time until the largest visible content element renders.`,
        whyItMatters: 'LCP is a Core Web Vital and directly affects Google ranking. Users perceive pages as slow when the main content takes too long to appear.',
        evidence: [`LCP: ${lcp.displayValue || `${Math.round(lcp.numericValue)}ms`} (score: ${Math.round(lcp.score * 100)}%)`],
        recommendation: 'Optimize the largest content element: preload key resources, optimize images, use CDN, and reduce server response time.',
        impact: 5,
        effort: 3,
        confidence: 0.9,
        source: 'pagespeed-mobile',
      });
    }

    const cls = mobile.metrics.cumulativeLayoutShift;
    if (cls.numericValue != null && cls.score != null && cls.score < 0.9) {
      findings.push({
        id: 'perf-cls-high',
        category: 'performance',
        severity: cls.score < 0.5 ? 'high' : 'medium',
        title: 'Cumulative Layout Shift is high',
        summary: `CLS is ${cls.displayValue || cls.numericValue.toFixed(3)} — page elements shift during loading, causing a poor user experience.`,
        whyItMatters: 'CLS is a Core Web Vital. Layout shifts frustrate users, especially on mobile, and can cause accidental clicks on wrong elements.',
        evidence: [`CLS: ${cls.displayValue || cls.numericValue.toFixed(3)} (score: ${Math.round(cls.score * 100)}%)`],
        recommendation: 'Set explicit dimensions on images and embeds, avoid inserting content above existing content, and use CSS contain for dynamic elements.',
        impact: 4,
        effort: 2,
        confidence: 0.9,
        source: 'pagespeed-mobile',
      });
    }

    const tbt = mobile.metrics.totalBlockingTime;
    if (tbt.numericValue != null && tbt.score != null && tbt.score < 0.9) {
      findings.push({
        id: 'perf-tbt-high',
        category: 'performance',
        severity: tbt.score < 0.5 ? 'high' : 'medium',
        title: 'High Total Blocking Time',
        summary: `TBT is ${tbt.displayValue || `${Math.round(tbt.numericValue)}ms`} — the main thread is blocked, making the page unresponsive.`,
        whyItMatters: 'High TBT means users experience lag when trying to interact with the page. This directly harms perceived performance and user engagement.',
        evidence: [`TBT: ${tbt.displayValue || `${Math.round(tbt.numericValue)}ms`} (score: ${Math.round(tbt.score * 100)}%)`],
        recommendation: 'Reduce JavaScript execution time: code-split bundles, defer non-critical scripts, and minimize main-thread work.',
        impact: 4,
        effort: 3,
        confidence: 0.85,
        source: 'pagespeed-mobile',
      });
    }
  }

  // ── Opportunities ──
  // Group related opportunities to avoid 25 low-value warnings burying major issues
  const opportunityCategories: Record<string, {
    id: string;
    title: string;
    summary: string;
    whyItMatters: string;
    recommendation: string;
    impact: AuditFinding['impact'];
    effort: AuditFinding['effort'];
  }> = {
    'render-blocking-resources': {
      id: 'perf-render-blocking',
      title: 'Render-blocking resources detected',
      summary: 'Resources are blocking the first paint of the page.',
      whyItMatters: 'Render-blocking resources delay when users see anything on screen, directly hurting perceived load speed.',
      recommendation: 'Defer or async-load non-critical JavaScript, inline critical CSS, and preload key resources.',
      impact: 4,
      effort: 2,
    },
    'unused-javascript': {
      id: 'perf-unused-js',
      title: 'Unused JavaScript detected',
      summary: 'JavaScript code is being loaded that isn\'t used on this page.',
      whyItMatters: 'Unused JavaScript increases download size and parsing time, slowing down page load without providing any benefit.',
      recommendation: 'Code-split your bundles, tree-shake unused code, and lazy-load non-critical scripts.',
      impact: 4,
      effort: 3,
    },
    'unused-css-rules': {
      id: 'perf-unused-css',
      title: 'Unused CSS rules detected',
      summary: 'CSS rules are being loaded that don\'t apply to this page.',
      whyItMatters: 'Unused CSS increases download size and can delay rendering as the browser must parse all stylesheets.',
      recommendation: 'Remove unused CSS, use CSS modules or scoped styles, and consider critical CSS inlining.',
      impact: 3,
      effort: 2,
    },
    'modern-image-formats': {
      id: 'perf-image-formats',
      title: 'Images not using modern formats',
      summary: 'Images could be smaller if served in next-gen formats like WebP or AVIF.',
      whyItMatters: 'Modern image formats can reduce file sizes by 25-50% with no visible quality loss, significantly improving load times.',
      recommendation: 'Convert images to WebP or AVIF format. Use <picture> elements for format negotiation with fallbacks.',
      impact: 4,
      effort: 2,
    },
    'uses-optimized-images': {
      id: 'perf-image-optimization',
      title: 'Images not optimally compressed',
      summary: 'Some images could be further compressed without quality loss.',
      whyItMatters: 'Oversized images are one of the most common causes of slow page loads, especially on mobile connections.',
      recommendation: 'Compress images using tools like Squoosh, Sharp, or ImageOptim. Aim for quality levels that balance size and visual fidelity.',
      impact: 4,
      effort: 2,
    },
    'uses-responsive-images': {
      id: 'perf-responsive-images',
      title: 'Images not sized for mobile',
      summary: 'Some images are larger than needed for the viewport, wasting bandwidth.',
      whyItMatters: 'Serving desktop-sized images to mobile devices wastes bandwidth and slows loading on slower connections.',
      recommendation: 'Use srcset and sizes attributes to serve appropriately sized images for each viewport.',
      impact: 3,
      effort: 2,
    },
    'offscreen-images': {
      id: 'perf-offscreen-images',
      title: 'Offscreen images not lazy-loaded',
      summary: 'Images below the fold are loading immediately, delaying visible content.',
      whyItMatters: 'Lazy-loading offscreen images prioritizes content users see first, improving perceived performance.',
      recommendation: 'Add loading="lazy" to images below the fold, or use IntersectionObserver for custom lazy-loading.',
      impact: 3,
      effort: 1,
    },
    'uses-text-compression': {
      id: 'perf-text-compression',
      title: 'Text resources not compressed',
      summary: 'HTML, CSS, or JavaScript responses are not served with compression.',
      whyItMatters: 'Gzip or Brotli compression can reduce text-based resource sizes by 60-80%, dramatically improving transfer times.',
      recommendation: 'Enable Gzip or Brotli compression on your server for all text-based resources (HTML, CSS, JS, JSON).',
      impact: 5,
      effort: 1,
    },
    'server-response-time': {
      id: 'perf-server-response',
      title: 'Slow server response time',
      summary: 'The server is responding slowly (TTFB is high).',
      whyItMatters: 'Server response time affects everything that follows — no other optimization matters if the server is slow to respond.',
      recommendation: 'Optimize server-side rendering, use a CDN, implement caching, and consider serverless or edge functions for dynamic content.',
      impact: 5,
      effort: 3,
    },
  };

  // Only include opportunities with significant savings
  const significantOpps = (mobile?.opportunities ?? [])
    .filter((opp) => opp.savingsMs >= 100) // Only flag if savings > 100ms
    .sort((a, b) => b.savingsMs - a.savingsMs);

  for (const opp of significantOpps) {
    const category = opportunityCategories[opp.id];
    if (category) {
      findings.push({
        id: category.id,
        category: 'performance',
        severity: opp.savingsMs >= 1000 ? 'high' : opp.savingsMs >= 500 ? 'medium' : 'low',
        title: category.title,
        summary: `${category.summary} Potential savings: ${opp.displayValue || `${opp.savingsMs}ms`}.`,
        whyItMatters: category.whyItMatters,
        evidence: [
          `${opp.title}: ${opp.displayValue || `${opp.savingsMs}ms`}`,
          ...(opp.savingsBytes != null ? [`${Math.round(opp.savingsBytes / 1024)}KB savings`] : []),
        ],
        recommendation: category.recommendation,
        impact: category.impact,
        effort: category.effort,
        confidence: 0.85,
        source: 'pagespeed-mobile',
      });
    }
  }

  return findings;
}

// ──────────────────────────────────────────────────────────────
// SEO findings
// ──────────────────────────────────────────────────────────────

function generateSeoFindings(
  seo: SeoAnalysisResult | null,
  html: HtmlAnalysisResult | null,
  lighthouseSeo: number | null,
  customSeoScore: number | null,
): AuditFinding[] {
  const findings: AuditFinding[] = [];
  if (!seo || !html) return findings;

  const seoScore = customSeoScore ?? 0;

  // ── Noindex ── (highest priority SEO issue)
  if (!seo.indexability.isIndexable) {
    findings.push({
      id: 'seo-noindex',
      category: 'seo',
      severity: 'critical',
      title: 'Page is blocked from search engines',
      summary: 'A noindex meta tag is present — search engines are instructed not to include this page in results.',
      whyItMatters: 'If this page should appear in search results, the noindex tag will prevent all organic traffic. This is often accidentally left in place after development.',
      evidence: seo.indexability.issues,
      recommendation: 'Remove the noindex meta tag if this page should be indexed by search engines. If it was added intentionally (e.g., for a thank-you page), verify it\'s correct.',
      impact: 5,
      effort: 1,
      confidence: 1,
      source: 'seo-analysis',
    });
  }

  // ── Missing title ──
  if (!seo.titleTagPresent) {
    findings.push({
      id: 'seo-missing-title',
      category: 'seo',
      severity: 'high',
      title: 'Missing page title',
      summary: 'The page has no <title> tag, which is one of the most important SEO elements.',
      whyItMatters: 'The title tag appears in search results, browser tabs, and social shares. Without it, search engines will guess a title — usually poorly.',
      evidence: ['No <title> tag found'],
      recommendation: 'Add a descriptive <title> tag (10-60 characters) that includes your primary keyword and brand name.',
      impact: 5,
      effort: 1,
      confidence: 1,
      source: 'seo-analysis',
    });
  } else if (!seo.titleTagOptimal && seo.titleTagIssues.length > 0) {
    findings.push({
      id: 'seo-title-quality',
      category: 'seo',
      severity: 'medium',
      title: 'Page title could be improved',
      summary: seo.titleTagIssues.join('. '),
      whyItMatters: 'The title tag is the first thing users see in search results. An optimized title improves click-through rates.',
      evidence: [`Current title: "${html.title}"`, ...seo.titleTagIssues],
      recommendation: 'Adjust the title to be 10-60 characters, include your primary keyword, and clearly describe the page.',
      impact: 3,
      effort: 1,
      confidence: 0.9,
      source: 'seo-analysis',
    });
  }

  // ── Missing meta description ──
  if (!seo.metaDescriptionPresent) {
    findings.push({
      id: 'seo-missing-meta-desc',
      category: 'seo',
      severity: 'high',
      title: 'Missing meta description',
      summary: 'The page has no meta description tag.',
      whyItMatters: 'The meta description appears in search results below the title. Without it, search engines auto-generate one — often poorly.',
      evidence: ['No meta description found'],
      recommendation: 'Add a compelling meta description (120-160 characters) that summarizes the page and encourages clicks.',
      impact: 4,
      effort: 1,
      confidence: 1,
      source: 'seo-analysis',
    });
  } else if (!seo.metaDescriptionOptimal && seo.metaDescriptionIssues.length > 0) {
    findings.push({
      id: 'seo-meta-desc-quality',
      category: 'seo',
      severity: 'low',
      title: 'Meta description could be improved',
      summary: seo.metaDescriptionIssues.join('. '),
      whyItMatters: 'An optimized meta description improves click-through rates from search results.',
      evidence: [`Current length: ${html.metaDescriptionLength} characters`, ...seo.metaDescriptionIssues],
      recommendation: 'Adjust the meta description to be 120-160 characters and compelling for searchers.',
      impact: 2,
      effort: 1,
      confidence: 0.9,
      source: 'seo-analysis',
    });
  }

  // ── Missing H1 ──
  if (!seo.h1Present) {
    findings.push({
      id: 'seo-missing-h1',
      category: 'seo',
      severity: 'high',
      title: 'Missing H1 heading',
      summary: 'The page has no H1 heading tag.',
      whyItMatters: 'The H1 heading tells search engines and users what the page is about. It\'s the most important heading for SEO.',
      evidence: ['No <h1> tag found'],
      recommendation: 'Add a single, descriptive H1 heading that includes your primary keyword.',
      impact: 4,
      effort: 1,
      confidence: 1,
      source: 'seo-analysis',
    });
  } else if (!seo.h1Single) {
    findings.push({
      id: 'seo-multiple-h1',
      category: 'seo',
      severity: 'medium',
      title: 'Multiple H1 headings',
      summary: seo.h1Issues.join('. '),
      whyItMatters: 'Using multiple H1 headings confuses the page hierarchy. Best practice is one H1 per page.',
      evidence: [`Found ${html.h1Count} H1 tags`, ...seo.h1Issues],
      recommendation: 'Keep only one H1 heading as the main page title. Use H2-H6 for sub-sections.',
      impact: 3,
      effort: 1,
      confidence: 0.95,
      source: 'seo-analysis',
    });
  }

  // ── Missing canonical ──
  if (!seo.canonicalTagPresent) {
    findings.push({
      id: 'seo-missing-canonical',
      category: 'seo',
      severity: 'medium',
      title: 'Missing canonical URL',
      summary: 'No canonical link tag is set, which helps prevent duplicate content issues.',
      whyItMatters: 'Without a canonical URL, search engines may index multiple versions of the same page (http/https, www/non-www, with/without trailing slash), diluting your SEO value.',
      evidence: ['No <link rel="canonical"> found'],
      recommendation: 'Add a canonical link tag pointing to the preferred version of this page URL.',
      impact: 3,
      effort: 1,
      confidence: 0.9,
      source: 'seo-analysis',
    });
  }

  // ── Missing Open Graph (group title + desc + image into one finding) ──
  if (!seo.openGraphComplete) {
    const missing: string[] = [];
    if (!html.openGraphTags.title) missing.push('og:title');
    if (!html.openGraphTags.description) missing.push('og:description');
    if (!html.openGraphTags.image) missing.push('og:image');

    findings.push({
      id: 'seo-og-incomplete',
      category: 'seo',
      severity: missing.length >= 2 ? 'medium' : 'low',
      title: 'Incomplete Open Graph meta tags',
      summary: `Missing: ${missing.join(', ')} — social media shares may not display correctly.`,
      whyItMatters: 'Open Graph tags control how your page appears when shared on Facebook, LinkedIn, and other platforms. Missing tags result in empty or incorrect previews.',
      evidence: [...missing.map((m) => `Missing: ${m}`), ...seo.openGraphIssues],
      recommendation: 'Add complete Open Graph tags (og:title, og:description, og:image) to control how your page appears in social shares.',
      impact: 3,
      effort: 1,
      confidence: 0.95,
      source: 'seo-analysis',
    });
  }

  // ── Missing structured data ──
  if (!seo.structuredDataPresent) {
    findings.push({
      id: 'seo-no-structured-data',
      category: 'seo',
      severity: 'medium',
      title: 'No structured data (JSON-LD)',
      summary: 'The page has no JSON-LD structured data, which helps search engines understand your content.',
      whyItMatters: 'Structured data enables rich results (star ratings, FAQ expandables, breadcrumbs) in search results, which can significantly improve click-through rates.',
      evidence: ['No <script type="application/ld+json"> found'],
      recommendation: 'Add JSON-LD structured data appropriate for your content type (Organization, LocalBusiness, Article, Product, FAQPage, etc.).',
      impact: 3,
      effort: 2,
      confidence: 0.95,
      source: 'seo-analysis',
    });
  }

  // ── Image alt text issues ──
  if (!seo.imagesHaveAlt && html.imageCount > 0) {
    findings.push({
      id: 'seo-missing-alt',
      category: 'seo',
      severity: html.imagesWithoutAlt === html.imageCount ? 'high' : 'medium',
      title: 'Images missing alt text',
      summary: `${html.imagesWithoutAlt} of ${html.imageCount} images are missing alt attributes.`,
      whyItMatters: 'Alt text helps visually impaired users and tells search engines what images contain. Missing alt text hurts accessibility and SEO.',
      evidence: [`${html.imagesWithoutAlt}/${html.imageCount} images missing alt text`],
      recommendation: 'Add descriptive alt text to all images. For decorative images, use alt="" to indicate they don\'t convey information.',
      impact: 4,
      effort: 2,
      confidence: 1,
      source: 'seo-analysis',
    });
  }

  // ── Viewport missing ──
  if (!seo.mobileFriendliness.hasViewport) {
    findings.push({
      id: 'seo-missing-viewport',
      category: 'seo',
      severity: 'high',
      title: 'Missing viewport meta tag',
      summary: 'No viewport meta tag is set, which is essential for mobile-friendly rendering.',
      whyItMatters: 'Without a viewport tag, mobile browsers render the page at desktop width and scale down, making text tiny and interactions difficult.',
      evidence: ['No <meta name="viewport"> found'],
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the <head> of every page.',
      impact: 5,
      effort: 1,
      confidence: 1,
      source: 'seo-analysis',
    });
  }

  // ── Sitemap / robots.txt ──
  if (seo.sitemapXmlAccessible === false) {
    findings.push({
      id: 'seo-no-sitemap',
      category: 'seo',
      severity: 'medium',
      title: 'XML sitemap not found',
      summary: 'No sitemap.xml was found or is not accessible.',
      whyItMatters: 'Sitemaps help search engines discover and index all pages on your site efficiently, especially for larger sites or new content.',
      evidence: [...seo.sitemapXmlIssues],
      recommendation: 'Create and submit an XML sitemap. Reference it in your robots.txt file and submit it to Google Search Console.',
      impact: 2,
      effort: 2,
      confidence: 0.8,
      source: 'seo-analysis',
    });
  }

  if (seo.robotsTxtAccessible === false) {
    findings.push({
      id: 'seo-no-robots',
      category: 'seo',
      severity: 'low',
      title: 'robots.txt not found',
      summary: 'No robots.txt file was found at the expected location.',
      whyItMatters: 'robots.txt tells search engine crawlers which pages to access. While not required, it\'s a best practice for controlling crawl behavior.',
      evidence: [...seo.robotsTxtIssues],
      recommendation: 'Create a robots.txt file in the root directory. Even a minimal one (allowing all crawling) is better than none.',
      impact: 2,
      effort: 1,
      confidence: 0.8,
      source: 'seo-analysis',
    });
  }

  // ── Positive SEO findings ──
  if (seoScore >= 80) {
    const positives: string[] = [];
    if (seo.titleTagPresent && seo.titleTagOptimal) positives.push('well-optimized title tag');
    if (seo.metaDescriptionPresent && seo.metaDescriptionOptimal) positives.push('proper meta description');
    if (seo.h1Present && seo.h1Single) positives.push('proper H1 heading');
    if (seo.canonicalTagPresent) positives.push('canonical URL set');
    if (seo.indexability.isIndexable) positives.push('properly indexable');
    if (seo.openGraphComplete) positives.push('complete Open Graph tags');

    if (positives.length >= 3) {
      findings.push({
        id: 'seo-strong-foundation',
        category: 'seo',
        severity: 'positive',
        title: 'Strong SEO foundation',
        summary: `The page has ${positives.join(', ')} — good technical SEO fundamentals are in place.`,
        whyItMatters: 'These foundational elements ensure search engines can properly crawl, index, and display your page in results.',
        evidence: positives,
        recommendation: 'Continue maintaining these best practices as the site evolves.',
        impact: 3,
        effort: 1,
        confidence: 0.9,
        source: 'seo-analysis',
      });
    }
  }

  return findings;
}

// ──────────────────────────────────────────────────────────────
// Security findings
// ──────────────────────────────────────────────────────────────

function generateSecurityFindings(
  security: SecurityAnalysisResult | null,
  _scores: ScoreResult,
): AuditFinding[] {
  const findings: AuditFinding[] = [];
  if (!security) return findings;

  // ── HTTPS ──
  if (!security.isHttps) {
    findings.push({
      id: 'security-no-https',
      category: 'security',
      severity: 'critical',
      title: 'Site is not served over HTTPS',
      summary: 'The website does not use HTTPS encryption. This is a fundamental security requirement.',
      whyItMatters: 'HTTPS protects data in transit, is required for many browser features, and is a Google ranking signal. Chrome marks HTTP sites as "Not Secure."',
      evidence: ['URL uses HTTP protocol'],
      recommendation: 'Obtain an SSL/TLS certificate and configure your server to serve all pages over HTTPS. Set up redirects from HTTP to HTTPS.',
      impact: 5,
      effort: 2,
      confidence: 1,
      source: 'security-analysis',
    });
  }

  // ── Missing security headers ── (group related ones)
  const missingHeaders = security.securityHeaders.filter((h) => !h.present && h.severity !== 'positive');
  if (missingHeaders.length > 0) {
    // Only create one finding for missing headers, not one per header
    const critical = missingHeaders.filter((h) => h.severity === 'high' || h.severity === 'critical');
    const moderate = missingHeaders.filter((h) => h.severity === 'medium');
    const low = missingHeaders.filter((h) => h.severity === 'low');

    const headerNames = missingHeaders.map((h) => h.name);
    const severity: FindingSeverity = critical.length > 0 ? 'high' : moderate.length > 0 ? 'medium' : 'low';

    findings.push({
      id: 'security-missing-headers',
      category: 'security',
      severity,
      title: `Missing security headers: ${headerNames.join(', ')}`,
      summary: `${missingHeaders.length} security header(s) are missing or misconfigured: ${headerNames.join(', ')}.`,
      whyItMatters: 'Security headers are defense-in-depth measures that protect against common web attacks like XSS, clickjacking, and data injection. Their absence doesn\'t mean you\'re vulnerable, but it removes an important layer of protection.',
      evidence: missingHeaders.map((h) => `${h.name}: ${h.recommendation}`),
      recommendation: missingHeaders.map((h) => h.recommendation).join(' '),
      impact: critical.length > 0 ? 4 : 3,
      effort: 2,
      confidence: 0.95,
      source: 'security-analysis',
    });
  }

  // ── Mixed content ──
  if (security.mixedContentIssues.length > 0) {
    findings.push({
      id: 'security-mixed-content',
      category: 'security',
      severity: 'high',
      title: 'Mixed content detected',
      summary: 'The HTTPS page loads some resources over HTTP, creating mixed content warnings.',
      whyItMatters: 'Mixed content breaks the security guarantees of HTTPS. Browsers may block or warn about insecure resources, and attackers can modify these resources.',
      evidence: security.mixedContentIssues,
      recommendation: 'Change all resource URLs (images, scripts, stylesheets) from http:// to https:// or use protocol-relative URLs.',
      impact: 4,
      effort: 1,
      confidence: 0.9,
      source: 'security-analysis',
    });
  }

  // ── Positive security finding ──
  if (security.isHttps && missingHeaders.length === 0 && security.mixedContentIssues.length === 0) {
    findings.push({
      id: 'security-good-headers',
      category: 'security',
      severity: 'positive',
      title: 'Good security header configuration',
      summary: 'No obvious issue was found in the public checks performed. The site uses HTTPS and key security headers are in place.',
      whyItMatters: 'These headers provide defense-in-depth against common web attacks. Note: this only checks publicly visible response headers — it does not constitute a full security audit.',
      evidence: ['HTTPS enabled', 'Key security headers present'],
      recommendation: 'Continue monitoring and updating your security configuration as new threats emerge.',
      impact: 2,
      effort: 1,
      confidence: 0.8,
      source: 'security-analysis',
    });
  }

  return findings;
}

// ──────────────────────────────────────────────────────────────
// Accessibility findings
// ──────────────────────────────────────────────────────────────

function generateAccessibilityFindings(
  mobile: NormalizedPageSpeed | null,
  html: HtmlAnalysisResult | null,
): AuditFinding[] {
  const findings: AuditFinding[] = [];

  if (mobile?.accessibilityScore != null && mobile.accessibilityScore < 90) {
    findings.push({
      id: 'a11y-low-score',
      category: 'accessibility',
      severity: mobile.accessibilityScore < 50 ? 'high' : mobile.accessibilityScore < 75 ? 'medium' : 'low',
      title: 'Accessibility improvements needed',
      summary: `Lighthouse accessibility score is ${mobile.accessibilityScore}/100 — some accessibility best practices are not followed.`,
      whyItMatters: 'Accessibility ensures your website is usable by people with disabilities. It\'s also a legal requirement in many jurisdictions and improves SEO.',
      evidence: [`Accessibility score: ${mobile.accessibilityScore}/100`],
      recommendation: 'Review the Lighthouse accessibility audit in Chrome DevTools for specific issues. Common fixes include adding alt text, ARIA labels, and proper heading hierarchy.',
      impact: 4,
      effort: 3,
      confidence: 0.9,
      source: 'pagespeed-mobile',
    });
  }

  if (html && !html.language) {
    findings.push({
      id: 'a11y-missing-lang',
      category: 'accessibility',
      severity: 'medium',
      title: 'Missing HTML lang attribute',
      summary: 'The <html> element has no lang attribute, which helps screen readers use correct pronunciation.',
      whyItMatters: 'Screen readers use the lang attribute to determine pronunciation. Without it, they may mispronounce content, making the site unusable for visually impaired users.',
      evidence: ['No lang attribute on <html> element'],
      recommendation: 'Add a lang attribute to the <html> element (e.g., lang="en" for English).',
      impact: 3,
      effort: 1,
      confidence: 1,
      source: 'html-analysis',
    });
  }

  if (html && html.imageCount > 0 && html.imagesWithoutAlt > 0) {
    findings.push({
      id: 'a11y-missing-alt',
      category: 'accessibility',
      severity: html.imagesWithoutAlt === html.imageCount ? 'high' : 'medium',
      title: 'Images missing alt text',
      summary: `${html.imagesWithoutAlt} of ${html.imageCount} images lack alt attributes, making them invisible to screen readers.`,
      whyItMatters: 'Alt text is essential for visually impaired users who rely on screen readers. It also helps when images fail to load.',
      evidence: [`${html.imagesWithoutAlt}/${html.imageCount} images missing alt text`],
      recommendation: 'Add descriptive alt text to informative images. Use alt="" for purely decorative images.',
      impact: 4,
      effort: 2,
      confidence: 1,
      source: 'html-analysis',
    });
  }

  return findings;
}

// ──────────────────────────────────────────────────────────────
// Conversion findings
// ──────────────────────────────────────────────────────────────

function generateConversionFindings(
  conversion: ConversionAnalysisResult | null,
  html: HtmlAnalysisResult | null,
): AuditFinding[] {
  const findings: AuditFinding[] = [];
  if (!conversion) return findings;

  // ── Missing primary CTA ──
  if (!conversion.hasPrimaryCta) {
    findings.push({
      id: 'conv-no-cta',
      category: 'conversion',
      severity: 'high',
      title: 'No clear call-to-action',
      summary: 'No prominent call-to-action button was found — visitors don\'t have a clear next step.',
      whyItMatters: 'Without a clear CTA, visitors who are interested in your offering have no way to take the next step, leading to lost leads and sales.',
      evidence: conversion.ctaIssues,
      recommendation: 'Add a prominent call-to-action button (e.g., "Book a Call", "Get Your Quote") that stands out visually and uses action-oriented language.',
      impact: 5,
      effort: 2,
      confidence: 0.85,
      source: 'conversion-analysis',
    });
  }

  // ── CTA language issues ──
  if (conversion.hasPrimaryCta && conversion.ctaIssues.length > 0) {
    findings.push({
      id: 'conv-cta-quality',
      category: 'conversion',
      severity: 'medium',
      title: 'Call-to-action could be more effective',
      summary: conversion.ctaIssues.join('. '),
      whyItMatters: 'CTAs that use specific, action-oriented language convert significantly better than vague alternatives like "Learn More" or "Click Here."',
      evidence: conversion.ctaIssues,
      recommendation: 'Use specific action verbs in your CTAs (e.g., "Book Your Free Consultation" instead of "Learn More"). Place CTAs prominently and use contrasting colors.',
      impact: 4,
      effort: 2,
      confidence: 0.8,
      source: 'conversion-analysis',
    });
  }

  // ── Missing contact info ──
  if (!conversion.hasContactSection) {
    findings.push({
      id: 'conv-no-contact',
      category: 'conversion',
      severity: 'high',
      title: 'No visible contact method',
      summary: 'No phone number, email, or contact form was found on the page.',
      whyItMatters: 'Many visitors prefer to contact businesses directly. Without visible contact info, interested prospects have no way to reach you.',
      evidence: conversion.contactIssues,
      recommendation: 'Add at least one visible contact method: phone number, email address, or contact form. Place it in the header, footer, or a dedicated contact section.',
      impact: 5,
      effort: 1,
      confidence: 0.85,
      source: 'conversion-analysis',
    });
  }

  // ── Missing value proposition ──
  if (!conversion.hasValueProposition) {
    findings.push({
      id: 'conv-no-value-prop',
      category: 'conversion',
      severity: 'high',
      title: 'No clear value proposition',
      summary: 'Visitors can\'t quickly understand what makes your offering unique or valuable.',
      whyItMatters: 'Visitors decide within seconds whether to stay. A clear value proposition immediately answers "Why should I choose you?" and prevents them from leaving.',
      evidence: conversion.valuePropositionIssues,
      recommendation: 'Add a clear headline or tagline that states your unique value — what you do, who you help, and what makes you different. Place it prominently at the top of the page.',
      impact: 5,
      effort: 2,
      confidence: 0.75,
      source: 'conversion-analysis',
    });
  }

  // ── Missing testimonials ──
  if (!conversion.hasTestimonials) {
    findings.push({
      id: 'conv-no-testimonials',
      category: 'conversion',
      severity: 'medium',
      title: 'No testimonials or reviews',
      summary: 'No customer testimonials or reviews were found on the page.',
      whyItMatters: 'Social proof is one of the strongest conversion drivers. 92% of consumers read online reviews before making a purchase decision.',
      evidence: conversion.testimonialIssues,
      recommendation: 'Add genuine customer testimonials with names and photos if possible. Video testimonials are even more powerful.',
      impact: 3,
      effort: 2,
      confidence: 0.8,
      source: 'conversion-analysis',
    });
  }

  // ── Missing trust signals ──
  if (!conversion.hasTrustBadges) {
    findings.push({
      id: 'conv-no-trust',
      category: 'conversion',
      severity: 'medium',
      title: 'No trust signals found',
      summary: 'No certifications, awards, client logos, or other trust indicators were detected.',
      whyItMatters: 'Trust signals reduce anxiety and help new visitors feel confident about choosing your business. They\'re especially important for higher-value purchases.',
      evidence: conversion.trustBadgeIssues,
      recommendation: 'Add trust indicators relevant to your business: client logos, certifications, awards, guarantees, or security badges.',
      impact: 3,
      effort: 2,
      confidence: 0.75,
      source: 'conversion-analysis',
    });
  }

  // ── Mobile usability issues ──
  if (conversion.mobileCtaIssues.length > 0) {
    findings.push({
      id: 'conv-mobile-issues',
      category: 'mobile',
      severity: 'medium',
      title: 'Mobile interaction concerns',
      summary: conversion.mobileCtaIssues.join('. '),
      whyItMatters: 'Mobile visitors account for over 60% of web traffic. Interaction problems on mobile directly reduce conversion rates.',
      evidence: conversion.mobileCtaIssues,
      recommendation: 'Ensure tap targets are at least 44×44px, buttons have adequate spacing, and the viewport is properly configured.',
      impact: 3,
      effort: 2,
      confidence: 0.7,
      source: 'conversion-analysis',
    });
  }

  // ── Positive conversion findings ──
  const convScore = calculateConversionScore(conversion);
  if (convScore >= 75) {
    const positives: string[] = [];
    if (conversion.hasPrimaryCta) positives.push('clear call-to-action');
    if (conversion.hasContactSection) positives.push('visible contact methods');
    if (conversion.hasValueProposition) positives.push('clear value proposition');
    if (conversion.hasTestimonials) positives.push('customer testimonials');
    if (conversion.hasTrustBadges) positives.push('trust signals');

    if (positives.length >= 3) {
      findings.push({
        id: 'conv-strong-foundation',
        category: 'conversion',
        severity: 'positive',
        title: 'Good conversion foundation',
        summary: `The page has ${positives.join(', ')} — visitors have clear paths to engage with your business.`,
        whyItMatters: 'CONVERSION READINESS — HEURISTIC ASSESSMENT: These elements work together to guide visitors toward becoming customers.',
        evidence: positives,
        recommendation: 'Continue A/B testing CTA language, placement, and design to optimize conversion rates.',
        impact: 3,
        effort: 1,
        confidence: 0.7,
        source: 'conversion-analysis',
      });
    }
  }

  return findings;
}

// ──────────────────────────────────────────────────────────────
// Technology findings (informational)
// ──────────────────────────────────────────────────────────────

function generateTechnologyFindings(
  technologies: TechnologyDetection[],
): AuditFinding[] {
  const findings: AuditFinding[] = [];
  if (technologies.length === 0) return findings;

  // Only report high-confidence detections as findings
  const certain = technologies.filter((t) => t.confidence >= 0.8);
  if (certain.length > 0) {
    findings.push({
      id: 'tech-stack-detected',
      category: 'performance',
      severity: 'positive',
      title: 'Technology stack detected',
      summary: `The site appears to use: ${certain.map((t) => t.name).join(', ')}.`,
      whyItMatters: 'Knowing the technology stack helps understand performance characteristics, maintenance requirements, and optimization options.',
      evidence: certain.map((t) => `${t.name} (${t.category}): ${t.evidence}`),
      recommendation: 'Review whether all detected technologies are necessary and up to date. Outdated frameworks may have performance or security issues.',
      impact: 1,
      effort: 1,
      confidence: certain.length >= 3 ? 0.9 : 0.7,
      source: 'technology-detection',
    });
  }

  return findings;
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Generate findings from all analysis results.
 *
 * Converts analysis results into AuditFinding objects, groups duplicates,
 * generates positive findings, and sorts by priority:
 * severity desc, impact desc, confidence desc, effort asc.
 */
export function generateFindings(reportData: AuditReportData): AuditFinding[] {
  // ── Calculate scores ──
  const scores = calculateScoresWithCustomSeo(reportData, null);

  // ── Generate findings from each module ──
  const allFindings: AuditFinding[] = [
    ...generatePerformanceFindings(reportData.pageSpeed.mobile, reportData.pageSpeed.desktop, scores),
    ...generateSeoFindings(reportData.seoAnalysis, reportData.htmlAnalysis, reportData.pageSpeed.mobile?.seoScore ?? null, null),
    ...generateSecurityFindings(reportData.securityAnalysis, scores),
    ...generateAccessibilityFindings(reportData.pageSpeed.mobile, reportData.htmlAnalysis),
    ...generateConversionFindings(reportData.conversionAnalysis, reportData.htmlAnalysis),
    ...generateTechnologyFindings(reportData.technologies),
  ];

  // ── Deduplicate ──
  const deduped = deduplicateFindings(allFindings);

  // ── Sort by priority ──
  deduped.sort((a, b) => {
    // Severity descending
    const sevDiff = severityOrder(b.severity) - severityOrder(a.severity);
    if (sevDiff !== 0) return sevDiff;

    // Impact descending
    const impDiff = b.impact - a.impact;
    if (impDiff !== 0) return impDiff;

    // Confidence descending
    const confDiff = b.confidence - a.confidence;
    if (confDiff !== 0) return confDiff;

    // Effort ascending (easier first within same priority)
    return a.effort - b.effort;
  });

  // ── Cap total findings ──
  // Don't allow 25 low-value metadata warnings to bury major problems.
  // Limit to 15 findings, with at most 5 low/info severity.
  const criticalAndHigh = deduped.filter((f) => severityOrder(f.severity) >= 4);
  const medium = deduped.filter((f) => severityOrder(f.severity) === 3);
  const lowAndInfo = deduped.filter((f) => severityOrder(f.severity) <= 2);

  const result: AuditFinding[] = [
    ...criticalAndHigh.slice(0, 6),
    ...medium.slice(0, 5),
    ...lowAndInfo.slice(0, 4),
  ];

  return result;
}
