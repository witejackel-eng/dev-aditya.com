/**
 * Technology detection for the Website Revenue Audit Funnel.
 *
 * Detects technologies used by a website by inspecting HTTP headers,
 * HTML content, script sources, cookies, and meta tags.
 *
 * Confidence levels:
 *   certain  — strong unique evidence (e.g., specific header, unique meta tag)
 *   likely   — multiple moderate signals combined
 *   possible — weak or common patterns that could match other technologies
 *
 * Does NOT expose cookie values or private data in evidence text.
 * Does NOT claim Tailwind certainty from short utility-looking class names alone.
 */

import 'server-only';

import * as cheerio from 'cheerio';
import type { TechnologyDetection } from './types';
import {
  TECHNOLOGY_SIGNATURES,
  type TechnologySignature,
  type ConfidenceLevel,
} from './technology-signatures';

// ──────────────────────────────────────────────────────────────
// Internal types for match tracking
// ──────────────────────────────────────────────────────────────

interface PatternMatch {
  description: string;
  confidence: ConfidenceLevel;
}

// ──────────────────────────────────────────────────────────────
// Pattern matchers
// ──────────────────────────────────────────────────────────────

/**
 * Match header patterns against the response headers.
 */
function matchHeaderPatterns(
  headers: Headers,
  signature: TechnologySignature,
): PatternMatch[] {
  const matches: PatternMatch[] = [];
  if (!signature.headerPatterns) return matches;

  for (const pattern of signature.headerPatterns) {
    const headerValue = headers.get(
      typeof pattern.name === 'string' ? pattern.name : '',
    );

    // If pattern.name is a regex, iterate all headers
    if (pattern.name instanceof RegExp) {
      // We can't easily iterate headers in a standard way,
      // so we skip regex header name matching for now.
      continue;
    }

    if (!headerValue) continue;

    if (pattern.value) {
      const valueMatch =
        pattern.value instanceof RegExp
          ? pattern.value.test(headerValue)
          : headerValue.toLowerCase().includes(pattern.value.toLowerCase());

      if (valueMatch) {
        matches.push({ description: pattern.description, confidence: pattern.confidence });
      }
    } else {
      // Header exists with any value
      matches.push({ description: pattern.description, confidence: pattern.confidence });
    }
  }

  return matches;
}

/**
 * Match HTML patterns against the HTML content.
 */
function matchHtmlPatterns(
  html: string,
  signature: TechnologySignature,
): PatternMatch[] {
  const matches: PatternMatch[] = [];
  if (!signature.htmlPatterns) return matches;

  for (const pattern of signature.htmlPatterns) {
    const isMatch =
      pattern.pattern instanceof RegExp
        ? pattern.pattern.test(html)
        : html.includes(pattern.pattern);

    if (isMatch) {
      matches.push({ description: pattern.description, confidence: pattern.confidence });
    }
  }

  return matches;
}

/**
 * Match script patterns against script elements in the HTML.
 */
function matchScriptPatterns(
  $: cheerio.CheerioAPI,
  html: string,
  signature: TechnologySignature,
): PatternMatch[] {
  const matches: PatternMatch[] = [];
  if (!signature.scriptPatterns) return matches;

  // Collect script src attributes and inline content
  const scriptSrcs: string[] = [];
  const inlineScripts: string[] = [];

  $('script').each((_, el) => {
    const src = $(el).attr('src');
    if (src) scriptSrcs.push(src);
    const content = $(el).html();
    if (content) inlineScripts.push(content);
  });

  for (const pattern of signature.scriptPatterns) {
    let matched = false;

    if (pattern.srcPattern) {
      for (const src of scriptSrcs) {
        const isMatch =
          pattern.srcPattern instanceof RegExp
            ? pattern.srcPattern.test(src)
            : src.toLowerCase().includes(pattern.srcPattern.toLowerCase());
        if (isMatch) {
          matched = true;
          break;
        }
      }
    }

    if (!matched && pattern.contentPattern) {
      for (const content of inlineScripts) {
        const isMatch =
          pattern.contentPattern instanceof RegExp
            ? pattern.contentPattern.test(content)
            : content.toLowerCase().includes(pattern.contentPattern.toLowerCase());
        if (isMatch) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      matches.push({ description: pattern.description, confidence: pattern.confidence });
    }
  }

  return matches;
}

/**
 * Match link patterns against link elements in the HTML.
 */
function matchLinkPatterns(
  $: cheerio.CheerioAPI,
  signature: TechnologySignature,
): PatternMatch[] {
  const matches: PatternMatch[] = [];

  // Access linkPatterns from the signature (extended property)
  const linkPatterns = (signature as TechnologySignature & {
    linkPatterns?: Array<{
      hrefPattern: RegExp;
      description: string;
      confidence: ConfidenceLevel;
    }>;
  }).linkPatterns;

  if (!linkPatterns) return matches;

  const linkHrefs: string[] = [];
  $('link[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) linkHrefs.push(href);
  });

  for (const pattern of linkPatterns) {
    for (const href of linkHrefs) {
      if (pattern.hrefPattern.test(href)) {
        matches.push({ description: pattern.description, confidence: pattern.confidence });
        break;
      }
    }
  }

  return matches;
}

/**
 * Match cookie patterns against cookies (limited — we only see Set-Cookie headers).
 */
function matchCookiePatterns(
  headers: Headers,
  signature: TechnologySignature,
): PatternMatch[] {
  const matches: PatternMatch[] = [];
  if (!signature.cookiePatterns) return matches;

  // Try to extract Set-Cookie headers
  const setCookies: string[] = [];
  try {
    const allCookies = headers.getSetCookie?.() ?? [];
    setCookies.push(...allCookies);
  } catch {
    // getSetCookie may not be available
  }

  for (const pattern of signature.cookiePatterns) {
    for (const cookie of setCookies) {
      const cookieName = cookie.split('=')[0]?.trim() ?? '';
      const isMatch =
        pattern.name instanceof RegExp
          ? pattern.name.test(cookieName)
          : cookieName.toLowerCase().startsWith(pattern.name.toLowerCase());

      if (isMatch) {
        // Don't expose cookie values in evidence — only the name prefix
        matches.push({
          description: pattern.description,
          confidence: pattern.confidence,
        });
        break;
      }
    }
  }

  return matches;
}

/**
 * Match meta tag patterns against the HTML.
 */
function matchMetaPatterns(
  $: cheerio.CheerioAPI,
  signature: TechnologySignature,
): PatternMatch[] {
  const matches: PatternMatch[] = [];
  if (!signature.metaPatterns) return matches;

  for (const pattern of signature.metaPatterns) {
    const $meta = $(`meta[name="${pattern.name}"], meta[property="${pattern.name}"]`);
    if ($meta.length === 0) continue;

    if (pattern.contentContains) {
      const content = $meta.attr('content') ?? '';
      const isMatch =
        pattern.contentContains instanceof RegExp
          ? pattern.contentContains.test(content)
          : content.toLowerCase().includes(pattern.contentContains.toLowerCase());

      if (isMatch) {
        matches.push({ description: pattern.description, confidence: pattern.confidence });
      }
    } else {
      // Meta tag exists
      matches.push({ description: pattern.description, confidence: pattern.confidence });
    }
  }

  return matches;
}

// ──────────────────────────────────────────────────────────────
// Confidence determination
// ──────────────────────────────────────────────────────────────

/**
 * Determine the overall confidence level for a technology detection
 * based on all pattern matches and the signature's minimum evidence thresholds.
 */
function determineConfidence(
  matches: PatternMatch[],
  signature: TechnologySignature,
): { confidence: number; level: ConfidenceLevel; evidence: string[] } {
  if (matches.length === 0) {
    return { confidence: 0, level: 'possible', evidence: [] };
  }

  const evidence = matches.map((m) => m.description);
  const hasCertainMatch = matches.some((m) => m.confidence === 'certain');
  const certainCount = matches.filter((m) => m.confidence === 'certain').length;
  const likelyCount = matches.filter((m) => m.confidence === 'likely').length;
  const _level: ConfidenceLevel = 'possible';

  // Strong unique evidence = certain
  if (hasCertainMatch) {
    const minCertain = signature.minimumEvidence?.certain ?? 1;
    if (certainCount >= minCertain) {
      // Calculate confidence: base 0.85 for certain, plus bonus for additional evidence
      const bonus = Math.min(0.15, (certainCount + likelyCount * 0.5) * 0.03);
      return {
        confidence: Math.min(1, 0.85 + bonus),
        level: 'certain',
        evidence,
      };
    }
  }

  // Multiple moderate = likely
  const effectiveLikelyCount = certainCount + likelyCount;
  const minLikely = signature.minimumEvidence?.likely ?? 2;
  if (effectiveLikelyCount >= minLikely) {
    const possibleCount = matches.filter((m) => m.confidence === 'possible').length;
    const confidence = Math.min(0.84, 0.55 + effectiveLikelyCount * 0.06 + possibleCount * 0.02);
    return {
      confidence,
      level: 'likely',
      evidence,
    };
  }

  // Weak pattern = possible
  if (matches.length >= 1) {
    const confidence = Math.min(0.54, 0.2 + matches.length * 0.08);
    return {
      confidence,
      level: 'possible',
      evidence,
    };
  }

  return { confidence: 0, level: 'possible', evidence: [] };
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Detect technologies used by a website.
 *
 * @param html - The fetched HTML content
 * @param headers - HTTP response headers from the page fetch
 * @param url - The final URL of the page
 * @returns Array of detected technologies with confidence and evidence
 */
export function detectTechnologies(
  html: string,
  headers: Headers,
  _url: string,
): TechnologyDetection[] {
  const $ = cheerio.load(html);
  const results: TechnologyDetection[] = [];

  for (const signature of TECHNOLOGY_SIGNATURES) {
    // Collect all pattern matches
    const allMatches: PatternMatch[] = [
      ...matchHeaderPatterns(headers, signature),
      ...matchHtmlPatterns(html, signature),
      ...matchScriptPatterns($, html, signature),
      ...matchLinkPatterns($, signature),
      ...matchCookiePatterns(headers, signature),
      ...matchMetaPatterns($, signature),
    ];

    if (allMatches.length === 0) continue;

    const { confidence, level, evidence } = determineConfidence(allMatches, signature);

    // Don't include very low confidence detections
    if (confidence < 0.15) continue;

    // Format evidence string — don't expose cookie values or private data
    const safeEvidence = evidence
      .map((e) => {
        // Sanitize: remove any accidental cookie values or tokens
        return e.replace(/=[^;\s]+/g, '=**redacted**');
      })
      .join('; ');

    results.push({
      name: signature.name,
      category: signature.category,
      confidence: Math.round(confidence * 100) / 100,
      evidence: safeEvidence,
    });
  }

  // Sort by confidence descending
  results.sort((a, b) => b.confidence - a.confidence);

  return results;
}
