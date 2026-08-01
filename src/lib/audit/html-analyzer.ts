/**
 * HTML analysis for the Website Revenue Audit Funnel.
 *
 * Uses Cheerio to parse the fetched HTML and extract a comprehensive
 * set of on-page signals: title, meta tags, headings, structured data,
 * images, links, contact info, CTAs, social presence, and more.
 *
 * Also fetches /robots.txt and sitemap (discovered via robots.txt or
 * /sitemap.xml) to check their availability — does NOT crawl the site.
 *
 * This module is server-only — it performs outbound fetches.
 */

import 'server-only';

import * as cheerio from 'cheerio';
import type { HtmlAnalysisResult } from './types';
import { safeFetch } from './safe-fetch';

// ──────────────────────────────────────────────────────────────
// Patterns
// ──────────────────────────────────────────────────────────────

const UNCLEAR_LINK_TEXT = new Set([
  'click here',
  'here',
  'read more',
  'more',
  'learn more',
  'click',
  'this',
  'link',
  'go',
  'continue',
  'see more',
  'view more',
  'find out more',
  'discover more',
  'read on',
]);

const PHONE_PATTERN = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const ADDRESS_KEYWORDS = /\b(street|st\.|avenue|ave\.|road|rd\.|boulevard|blvd\.|drive|dr\.|lane|ln\.|suite|ste\.|unit|building|bldg|floor|zip|postal|p\.o\.|box)\b/i;

const SOCIAL_DOMAINS: Record<string, string> = {
  'facebook.com': 'Facebook',
  'fb.com': 'Facebook',
  'twitter.com': 'Twitter',
  'x.com': 'X',
  'instagram.com': 'Instagram',
  'linkedin.com': 'LinkedIn',
  'youtube.com': 'YouTube',
  'youtu.be': 'YouTube',
  'tiktok.com': 'TikTok',
  'pinterest.com': 'Pinterest',
  'threads.net': 'Threads',
  'mastodon.social': 'Mastodon',
  'github.com': 'GitHub',
};

const ANALYTICS_PATTERNS: Array<{ pattern: RegExp; provider: string }> = [
  { pattern: /google-analytics\.com|gtag|googletagmanager/, provider: 'Google Analytics' },
  { pattern: /plausible\.io/, provider: 'Plausible' },
  { pattern: /matomo|piwik/, provider: 'Matomo' },
  { pattern: /hotjar\.com/, provider: 'Hotjar' },
  { pattern: /clarity\.ms/, provider: 'Microsoft Clarity' },
  { pattern: /segment\.com|analytics\.js/, provider: 'Segment' },
  { pattern: /mixpanel\.com/, provider: 'Mixpanel' },
  { pattern: /amplitude\.com/, provider: 'Amplitude' },
  { pattern: /heap\.io/, provider: 'Heap' },
  { pattern: /sentry\.io/, provider: 'Sentry' },
  { pattern: /posthog\.com/, provider: 'PostHog' },
  { pattern: /umami\.is/, provider: 'Umami' },
  { pattern: /fathom\.analytics/, provider: 'Fathom' },
];

const CTA_PATTERNS: RegExp[] = [
  /\b(get started|start free|try free|sign up|register|subscribe|book now|buy now|order now|shop now|get quote|request quote|contact us|reach out|schedule|book a|hire me|hire us|work with|let'?s talk|let'?s chat|get in touch|call now|call us|download|free trial|start now|join now|claim your|unlock|enroll|apply now|donate now|save your|reserve|purchase|checkout)\b/i,
];

const COOKIE_CONSENT_PATTERNS: RegExp[] = [
  /cookie(?:s)?[- ]?(?:consent|banner|notice|bar|policy|popup|preferences|block)/i,
  /cc-?(?:banner|notice|widget)/i,
  /cybot|cookielaw|onetrust|trustarc|quantcast|cookiebot|usercentrics|didomi|osano/i,
  /accept[- ]?(?:all|cookies|optional|marketing|analytics)/i,
  /manage[- ]?cookies/i,
];

// ──────────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────────

/**
 * Extract the text content of an element, trimmed.
 */
function elementText($: cheerio.CheerioAPI, selector: string): string | null {
  const text = $(selector).first().text().trim();
  return text.length > 0 ? text : null;
}

/**
 * Extract the value of a meta tag by name or property.
 */
function metaContent($: cheerio.CheerioAPI, attr: string, value: string): string | null {
  const content = $(`meta[${attr}="${value}"]`).attr('content');
  return content && content.trim().length > 0 ? content.trim() : null;
}

/**
 * Extract all meta tags matching an attribute prefix into a key-value map.
 */
function metaMap($: cheerio.CheerioAPI, attr: string, prefix: string): Record<string, string> {
  const result: Record<string, string> = {};
  $(`meta[${attr}^="${prefix}"]`).each((_, el) => {
    const prop = $(el).attr(attr) ?? '';
    const content = $(el).attr('content') ?? '';
    if (prop && content) {
      const key = prop.slice(prefix.length);
      result[key] = content;
    }
  });
  return result;
}

/**
 * Check if a link text is unclear / non-descriptive.
 */
function _isUnclearLinkText(text: string): boolean {
  const cleaned = text.trim().toLowerCase().replace(/[.!?;:,]+$/, '');
  return UNCLEAR_LINK_TEXT.has(cleaned);
}

/**
 * Detect social platforms from a URL.
 */
function detectSocialPlatform(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    for (const [domain, platform] of Object.entries(SOCIAL_DOMAINS)) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return platform;
      }
    }
  } catch {
    // Invalid URL — skip
  }
  return null;
}

/**
 * Estimate word count from visible text.
 */
function estimateWordCount($: cheerio.CheerioAPI): number {
  // Remove scripts, styles, and noscript from consideration
  const $body = $('body').clone();
  $body.find('script, style, noscript').remove();
  const text = $body.text().trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Detect analytics providers from the HTML.
 */
function detectAnalytics($: cheerio.CheerioAPI): { has: boolean; providers: string[] } {
  const html = $.html() ?? '';
  const providers: string[] = [];
  for (const { pattern, provider } of ANALYTICS_PATTERNS) {
    if (pattern.test(html)) {
      providers.push(provider);
    }
  }
  return { has: providers.length > 0, providers };
}

/**
 * Detect cookie consent from the HTML.
 */
function detectCookieConsent($: cheerio.CheerioAPI): boolean {
  const html = $.html() ?? '';
  for (const pattern of COOKIE_CONSENT_PATTERNS) {
    if (pattern.test(html)) return true;
  }
  return false;
}

/**
 * Detect CTA buttons from the HTML.
 */
function detectCTAs($: cheerio.CheerioAPI): { has: boolean; buttons: string[] } {
  const buttons: string[] = [];
  const selectors = [
    'a[class*="btn"]',
    'a[class*="button"]',
    'a[class*="cta"]',
    'button',
    'a[role="button"]',
    'input[type="submit"]',
    'input[type="button"]',
    'a[href^="tel:"]',
    'a[href^="mailto:"]',
  ];

  for (const sel of selectors) {
    $(sel).each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 0 && text.length < 80) {
        for (const pattern of CTA_PATTERNS) {
          if (pattern.test(text) && !buttons.includes(text)) {
            buttons.push(text);
            break;
          }
        }
      }
    });
  }

  return { has: buttons.length > 0, buttons: buttons.slice(0, 10) };
}

/**
 * Detect testimonial-like sections.
 */
function detectTestimonials($: cheerio.CheerioAPI): boolean {
  // Look for common testimonial class/section patterns
  const selectors = [
    '[class*="testimonial"]',
    '[class*="review"]',
    '[class*="feedback"]',
    '[id*="testimonial"]',
    '[id*="review"]',
    'blockquote[cite]',
    '[itemtype*="Review"]',
    '[itemtype*="Rating"]',
  ];
  for (const sel of selectors) {
    if ($(sel).length > 0) return true;
  }
  return false;
}

/**
 * Detect pricing sections.
 */
function detectPricing($: cheerio.CheerioAPI): boolean {
  const selectors = [
    '[class*="pricing"]',
    '[id*="pricing"]',
    '[class*="price-table"]',
    '[class*="plan"]',
    '[itemtype*="PriceSpecification"]',
  ];
  for (const sel of selectors) {
    if ($(sel).length > 0) return true;
  }
  // Also check for currency patterns in headings
  const headings = $('h1, h2, h3, h4').text();
  if (/\$[\d,]+|€[\d,]+|£[\d,]+|₹[\d,]+/.test(headings)) return true;
  return false;
}

/**
 * Detect FAQ schema or sections.
 */
function detectFaqSchema($: cheerio.CheerioAPI): boolean {
  // Check for FAQ schema
  const ldJson = extractStructuredData($);
  for (const item of ldJson) {
    if (item.includes('FAQPage') || item.includes('faq')) return true;
  }
  // Check for common FAQ section patterns
  if ($('[class*="faq"], [id*="faq"], [class*="accordion"]').length > 0) return true;
  return false;
}

/**
 * Extract structured data types from JSON-LD.
 */
function extractStructuredData($: cheerio.CheerioAPI): string[] {
  const types: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const content = $(el).html()?.trim();
    if (!content) return;
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.['@type']) {
            types.push(item['@type']);
          }
        }
      } else if (parsed?.['@type']) {
        types.push(parsed['@type']);
      }
    } catch {
      // Invalid JSON-LD — skip
    }
  });
  return types;
}

/**
 * Check for a logo element.
 */
function detectLogo($: cheerio.CheerioAPI): boolean {
  return (
    $('[class*="logo"] img').length > 0 ||
    $('[id*="logo"] img').length > 0 ||
    $('img[alt*="logo" i]').length > 0 ||
    $('a[href="/"] img').length > 0 ||
    $('[class*="logo"] a').length > 0
  );
}

/**
 * Check for hamburger / mobile menu.
 */
function detectHamburgerMenu($: cheerio.CheerioAPI): boolean {
  return (
    $('[class*="hamburger"]').length > 0 ||
    $('[class*="mobile-menu"]').length > 0 ||
    $('[class*="nav-toggle"]').length > 0 ||
    $('button[aria-label*="menu" i]').length > 0 ||
    $('button[aria-expanded]').length > 0
  );
}

/**
 * Fetch and check robots.txt availability.
 */
async function checkRobotsTxt(baseUrl: string): Promise<{
  accessible: boolean | null;
  content: string | null;
}> {
  try {
    const url = new URL('/robots.txt', baseUrl).toString();
    const result = await safeFetch(url, {
      purpose: 'robots',
      followRedirects: true,
    });
    if (result.status >= 200 && result.status < 300) {
      return { accessible: true, content: result.body };
    }
    return { accessible: false, content: null };
  } catch {
    return { accessible: null, content: null };
  }
}

/**
 * Parse sitemap URL from robots.txt content.
 */
function parseSitemapFromRobotsTxt(robotsContent: string | null): string | null {
  if (!robotsContent) return null;
  const lines = robotsContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith('sitemap:')) {
      const sitemapUrl = trimmed.slice(8).trim();
      if (sitemapUrl) return sitemapUrl;
    }
  }
  return null;
}

/**
 * Fetch and check sitemap.xml availability.
 */
async function checkSitemapXml(baseUrl: string, robotsContent: string | null): Promise<boolean | null> {
  // First try the URL from robots.txt
  const sitemapFromRobots = parseSitemapFromRobotsTxt(robotsContent);
  if (sitemapFromRobots) {
    try {
      const result = await safeFetch(sitemapFromRobots, {
        purpose: 'robots',
        followRedirects: true,
      });
      if (result.status >= 200 && result.status < 300) {
        return true;
      }
    } catch {
      // Fall through to default path
    }
  }

  // Try /sitemap.xml
  try {
    const url = new URL('/sitemap.xml', baseUrl).toString();
    const result = await safeFetch(url, {
      purpose: 'robots',
      followRedirects: true,
    });
    if (result.status >= 200 && result.status < 300) {
      return true;
    }
    return false;
  } catch {
    return null;
  }
}

/**
 * Check for contact information in the page.
 */
function detectContactInfo($: cheerio.CheerioAPI): {
  hasContact: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  hasAddress: boolean;
  hasMap: boolean;
} {
  const html = $.html() ?? '';
  const body = $('body').text();

  const hasPhone = PHONE_PATTERN.test(body) || $('a[href^="tel:"]').length > 0;
  const hasEmail = EMAIL_PATTERN.test(body) || $('a[href^="mailto:"]').length > 0;
  const hasAddress = ADDRESS_KEYWORDS.test(body);
  const hasMap = $('iframe[src*="google.com/maps"], iframe[src*="maps."], [class*="map"]').length > 0;

  return {
    hasContact: hasPhone || hasEmail || hasAddress || hasMap,
    hasPhone,
    hasEmail,
    hasAddress,
    hasMap,
  };
}

/**
 * Count render-blocking resources (approximation from HTML).
 */
function detectRenderBlocking($: cheerio.CheerioAPI): string[] {
  const resources: string[] = [];

  // Stylesheets without async/defer/loadCSS patterns
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    const media = $(el).attr('media');
    // Stylesheets with media="print" or onload handlers are not render-blocking
    if (href && media !== 'print' && !$(el).attr('onload')) {
      resources.push(href);
    }
  });

  // Scripts without async/defer
  $('script[src]').each((_, el) => {
    const src = $(el).attr('href') ?? $(el).attr('src');
    const async_ = $(el).attr('async');
    const defer = $(el).attr('defer');
    const type = $(el).attr('type');
    if (src && !async_ && !defer && type !== 'module' && type !== 'importmap') {
      resources.push(src);
    }
  });

  return resources.slice(0, 20);
}

/**
 * Generate a readability note based on word count and content density.
 */
function assessReadability(wordCount: number): string | null {
  if (wordCount < 100) return 'Very little visible text content detected.';
  if (wordCount < 300) return 'Limited content — consider adding more substantive copy.';
  if (wordCount > 2000) return 'High word count — ensure content is well-structured with headings and sections.';
  return null;
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Analyze HTML content and extract a comprehensive set of on-page signals.
 *
 * @param html - The fetched HTML content
 * @param finalUrl - The final URL after all redirects
 * @returns Structured HtmlAnalysisResult
 */
export async function analyzeHtml(
  html: string,
  finalUrl: string,
): Promise<HtmlAnalysisResult> {
  const $ = cheerio.load(html);
  const baseUrl = new URL(finalUrl).origin;

  // ── Page title ──
  const title = elementText($, 'title');

  // ── Meta description ──
  const metaDescription = metaContent($, 'name', 'description');

  // ── Headings ──
  const h1Elements = $('h1');
  const h1Count = h1Elements.length;
  const h1Text = h1Elements.first().text().trim() || null;
  const h2Count = $('h2').length;

  // ── Language & charset ──
  const language = $('html').attr('lang')?.trim() || null;
  const charset = $('meta[charset]').attr('charset') || metaContent($, 'http-equiv', 'Content-Type');

  // ── Viewport ──
  const viewport = metaContent($, 'name', 'viewport');

  // ── Canonical ──
  const canonical = $('link[rel="canonical"]').attr('href')?.trim() || null;

  // ── Favicon ──
  const faviconPresent =
    $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0;

  // ── Structured data (JSON-LD) ──
  const structuredDataTypes = extractStructuredData($);
  const hasStructuredData = structuredDataTypes.length > 0;

  // ── Open Graph ──
  const openGraphTags = metaMap($, 'property', 'og:');

  // ── Twitter Card ──
  const twitterCardTags = metaMap($, 'name', 'twitter:');

  // ── Images ──
  const images = $('img');
  const imageCount = images.length;
  let imagesWithoutAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined || alt === null) {
      imagesWithoutAlt++;
    }
  });

  // ── Links ──
  let totalLinks = 0;
  let externalLinks = 0;
  let internalLinks = 0;
  const baseUrlObj = new URL(finalUrl);

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    totalLinks++;
    try {
      const linkUrl = new URL(href, finalUrl);
      if (linkUrl.hostname === baseUrlObj.hostname) {
        internalLinks++;
      } else {
        externalLinks++;
      }
    } catch {
      // Relative or invalid URL — treat as internal
      internalLinks++;
    }
  });

  // ── Noindex / nofollow ──
  const robotsMeta = metaContent($, 'name', 'robots')?.toLowerCase() || '';
  const hasNoindexTag = robotsMeta.includes('noindex');
  const hasNofollowTag = robotsMeta.includes('nofollow');

  // ── Render-blocking resources ──
  const renderBlockingResources = detectRenderBlocking($);

  // ── Inline styles & scripts ──
  const inlineStylesCount = $('style').length;
  const inlineScriptsCount = $('script:not([src])').length;

  // ── Forms ──
  const formsCount = $('form').length;

  // ── Contact information ──
  const contact = detectContactInfo($);

  // ── Social links ──
  const socialPlatforms: string[] = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const platform = detectSocialPlatform(href);
    if (platform && !socialPlatforms.includes(platform)) {
      socialPlatforms.push(platform);
    }
  });
  const hasSocialLinks = socialPlatforms.length > 0;

  // ── Analytics ──
  const analytics = detectAnalytics($);

  // ── Cookie consent ──
  const hasCookieConsent = detectCookieConsent($);

  // ── CTAs ──
  const ctas = detectCTAs($);

  // ── Testimonials ──
  const hasTestimonials = detectTestimonials($);

  // ── Pricing ──
  const hasPricing = detectPricing($);

  // ── FAQ schema ──
  const hasFaqSchema = detectFaqSchema($);

  // ── Logo ──
  const hasLogo = detectLogo($);

  // ── Hamburger menu ──
  const hasHamburgerMenu = detectHamburgerMenu($);

  // ── Word count & readability ──
  const estimatedWordCount = estimateWordCount($);
  const readabilityNote = assessReadability(estimatedWordCount);

  // ── HTML size ──
  const htmlSizeBytes = Buffer.byteLength(html, 'utf-8');

  // ── Robots.txt & Sitemap (async fetches) ──
  const robotsResult = await checkRobotsTxt(baseUrl);
  const _sitemapInMain = await checkSitemapXml(baseUrl, robotsResult.content);

  // Note: robots.txt and sitemap accessibility are stored on the SeoAnalysisResult
  // (not HtmlAnalysisResult), but we fetch them here because the HTML analyzer
  // is the module that does secondary fetches. The SEO analyzer will receive
  // the HtmlAnalysisResult + these additional results from the orchestrator.
  // For now, we expose them through a side-channel.
  // The HtmlAnalysisResult type doesn't have robotsTxtAccessible / sitemapXmlAccessible
  // fields — those are on SeoAnalysisResult. We pass the data via the run-audit orchestrator.

  return {
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    h1Count,
    h1Text,
    h2Count,
    language,
    charset,
    viewport,
    canonical,
    faviconPresent,
    hasStructuredData,
    structuredDataTypes,
    openGraphTags,
    twitterCardTags,
    imageCount,
    imagesWithoutAlt,
    totalLinks,
    externalLinks,
    internalLinks,
    hasNoindexTag,
    hasNofollowTag,
    renderBlockingResources,
    inlineStylesCount,
    inlineScriptsCount,
    formsCount,
    hasContactInfo: contact.hasContact,
    hasPhoneNumber: contact.hasPhone,
    hasEmailLink: contact.hasEmail,
    hasAddress: contact.hasAddress,
    hasMapEmbed: contact.hasMap,
    hasSocialLinks,
    socialPlatforms,
    hasAnalytics: analytics.has,
    analyticsProviders: analytics.providers,
    hasCookieConsent,
    hasCallToAction: ctas.has,
    ctaButtons: ctas.buttons,
    hasTestimonials,
    hasPricing,
    hasFaqSchema,
    hasLogo,
    hasHamburgerMenu,
    estimatedWordCount,
    readabilityNote,
    htmlSizeBytes,
  };
}

/**
 * Exported for the orchestrator to get robots.txt/sitemap data.
 * The HtmlAnalysisResult doesn't include these fields, but the
 * SEO analyzer needs them.
 */
export async function fetchSeoAuxiliaryData(
  baseUrl: string,
): Promise<{
  robotsTxtAccessible: boolean | null;
  sitemapXmlAccessible: boolean | null;
}> {
  const robotsResult = await checkRobotsTxt(baseUrl);
  const sitemapAccessible = await checkSitemapXml(baseUrl, robotsResult.content);
  return {
    robotsTxtAccessible: robotsResult.accessible,
    sitemapXmlAccessible: sitemapAccessible,
  };
}
