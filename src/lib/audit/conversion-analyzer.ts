/**
 * Conversion readiness heuristics for the Website Revenue Audit Funnel.
 *
 * Labels results as "CONVERSION READINESS — HEURISTIC ASSESSMENT"
 * (not scientific measurement).
 *
 * Checks heuristics using Cheerio:
 *   Early primary CTA, CTA language specificity, contact method,
 *   value proposition identifiable, services clearly named,
 *   trust/portfolio evidence, testimonials, pricing, CTA consistency,
 *   form labels, form required fields count, mobile tap-target concerns,
 *   important link descriptive text
 *
 * Score rubric (0-100):
 *   Early CTA 20, Visible contact 15, Clear value prop 15,
 *   Service clarity 10, Trust evidence 10, Testimonial evidence 10,
 *   Pricing clarity 5, CTA consistency 5, Mobile interaction 5,
 *   Form clarity 5 = 100
 *
 * Doesn't claim element is above fold with certainty.
 * Labels DOM-order inference as heuristic.
 * Doesn't penalize for missing irrelevant features without explaining assumption.
 */

import 'server-only';

import * as cheerio from 'cheerio';
import type { ConversionAnalysisResult } from './types';

// ──────────────────────────────────────────────────────────────
// Scoring rubric
// ──────────────────────────────────────────────────────────────

const RUBRIC: Record<string, number> = {
  earlyCta: 20,
  visibleContact: 15,
  clearValueProp: 15,
  serviceClarity: 10,
  trustEvidence: 10,
  testimonialEvidence: 10,
  pricingClarity: 5,
  ctaConsistency: 5,
  mobileInteraction: 5,
  formClarity: 5,
};

// ──────────────────────────────────────────────────────────────
// Patterns
// ──────────────────────────────────────────────────────────────

const CTA_PATTERNS: RegExp[] = [
  /\b(get started|start free|try free|sign up|register|subscribe|book now|buy now|order now|shop now|get quote|request quote|contact us|reach out|schedule|book a|hire me|hire us|work with|let'?s talk|let'?s chat|get in touch|call now|call us|download|free trial|start now|join now|claim your|unlock|enroll|apply now|donate now|save your|reserve|purchase|checkout)\b/i,
];

const SPECIFIC_CTA_WORDS: RegExp[] = [
  /\b(book|schedule|reserve|order|buy|shop|get|start|try|sign\s?up|subscribe|register|download|claim|enroll|apply|hire|contact|call|email)\b/i,
];

const VAGUE_CTA_WORDS: RegExp[] = [
  /\b(learn more|read more|find out|discover|explore|see more|view more|more|click here|here)\b/i,
];

const VALUE_PROP_PATTERNS: RegExp[] = [
  /\b(we (help|provide|offer|deliver|create|build|design|develop|specialize|focus|partner|work|transform|streamline|improve|optimize|enhance|elevate|simplify|accelerate))\b/i,
  /\b(our (mission|approach|method|process|solution|service|expertise|team|platform))\b/i,
  /\b(you (deserve|need|will|can|get|save|earn|gain|achieve|receive|enjoy|experience))\b/i,
  /\b(save|grow|increase|reduce|improve|boost|streamline|accelerate|transform)\b.*\b(time|money|revenue|sales|traffic|conversion|efficiency|productivity|results)\b/i,
  /\b(trusted\s+by|used\s+by|chosen\s+by|helping|powering|serving)\b/i,
];

const SERVICE_PATTERNS: RegExp[] = [
  /\b(services|solutions|what\s+we\s+do|offerings|capabilities|how\s+we\s+help|our\s+work)\b/i,
];

const TRUST_PATTERNS: RegExp[] = [
  /\b(trusted\s+by|as\s+seen\s+on|featured\s+in|awards?|certified|accredited|recognized|partner|verified|guarantee|satisfaction)\b/i,
];

const PORTFOLIO_PATTERNS: RegExp[] = [
  /\b(portfolio|case\s+stud(y|ies)|our\s+work|projects?|showcase|client\s+work|examples?)\b/i,
];

const PHONE_PATTERN = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;

// ──────────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────────

/**
 * Check for early primary CTA.
 * Note: We cannot know with certainty what is "above the fold" without
 * rendering the page, so we use DOM order as a heuristic — the first
 * CTA-like element in the body is assumed to be "early" in the page flow.
 */
function assessEarlyCta($: cheerio.CheerioAPI): {
  score: number;
  hasPrimary: boolean;
  text: string | null;
  count: number;
  issues: string[];
} {
  const issues: string[] = [];
  const ctaElements: Array<{ text: string; index: number; isSpecific: boolean }> = [];

  const selectors = [
    'a[class*="btn"]',
    'a[class*="button"]',
    'a[class*="cta"]',
    'button',
    'a[role="button"]',
    'input[type="submit"]',
    'input[type="button"]',
  ];

  let bodyElementCount = 0;
  $('body').find('*').each(() => { bodyElementCount++; });

  $(selectors.join(', ')).each((i, el) => {
    const text = $(el).text().trim();
    if (text.length === 0 || text.length > 80) return;

    const isCta = CTA_PATTERNS.some((p) => p.test(text));
    if (!isCta) return;

    const isSpecific = SPECIFIC_CTA_WORDS.some((p) => p.test(text));
    const isVague = VAGUE_CTA_WORDS.some((p) => p.test(text));

    ctaElements.push({ text: text.substring(0, 60), index: i, isSpecific: isSpecific && !isVague });
  });

  if (ctaElements.length === 0) {
    return {
      score: 0,
      hasPrimary: false,
      text: null,
      count: 0,
      issues: ['No clear call-to-action buttons found — visitors need a clear next step'],
    };
  }

  // The first CTA in DOM order is considered "early" (heuristic)
  const firstCta = ctaElements[0];
  const isEarly = firstCta.index < bodyElementCount * 0.4; // Top 40% of DOM

  let score = 0;
  if (isEarly) {
    score += RUBRIC.earlyCta * 0.6;
  } else {
    issues.push('The first call-to-action appears later in the page flow (heuristic: DOM-order inference) — placing it earlier may capture more engagement');
  }

  if (firstCta.isSpecific) {
    score += RUBRIC.earlyCta * 0.3;
  } else {
    issues.push('The primary call-to-action uses generic language — specific action verbs (e.g., "Book a Call", "Get Your Quote") tend to convert better');
  }

  // Bonus for having CTAs at all
  score += RUBRIC.earlyCta * 0.1;

  return {
    score: Math.round(score),
    hasPrimary: true,
    text: firstCta.text,
    count: ctaElements.length,
    issues,
  };
}

/**
 * Assess CTA consistency across the page.
 */
function assessCtaConsistency(ctaElements: Array<{ text: string }>): {
  score: number;
  issues: string[];
} {
  const issues: string[] = [];

  if (ctaElements.length <= 1) {
    // Single or no CTA — consistency is N/A, give partial credit
    return { score: RUBRIC.ctaConsistency * 0.5, issues: [] };
  }

  // Check if CTAs have consistent language/goals
  const texts = ctaElements.map((e) => e.text.toLowerCase());

  // Very simple heuristic: if CTAs share common action words, they're consistent
  const actionWords = texts.map((t) => {
    const match = t.match(/\b(book|schedule|buy|get|start|try|sign|subscribe|contact|call|download)\b/i);
    return match ? match[1].toLowerCase() : t;
  });

  const uniqueActions = new Set(actionWords);
  if (uniqueActions.size <= 2) {
    // Consistent — similar language
    return { score: RUBRIC.ctaConsistency, issues: [] };
  }

  if (uniqueActions.size <= 4) {
    issues.push('Multiple different call-to-action messages may confuse visitors — consider using more consistent language');
    return { score: RUBRIC.ctaConsistency * 0.5, issues };
  }

  issues.push('Too many different call-to-action messages — visitors may be overwhelmed. Focus on 1-2 primary actions.');
  return { score: RUBRIC.ctaConsistency * 0.2, issues };
}

/**
 * Assess contact visibility.
 */
function assessContact($: cheerio.CheerioAPI): {
  score: number;
  hasSection: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const body = $('body').text();

  const hasPhone = PHONE_PATTERN.test(body) || $('a[href^="tel:"]').length > 0;
  const hasEmail = EMAIL_PATTERN.test(body) || $('a[href^="mailto:"]').length > 0;
  const hasContactForm = $('form').length > 0;
  const hasContactSection =
    $('[class*="contact"], [id*="contact"], [href*="contact"]').length > 0;

  const hasAny = hasPhone || hasEmail || hasContactForm || hasContactSection;

  if (!hasAny) {
    return {
      score: 0,
      hasSection: false,
      issues: ['No visible contact method found — visitors need a way to reach you'],
    };
  }

  let score = RUBRIC.visibleContact;
  if (!hasPhone) issues.push('No phone number found — some visitors prefer calling');
  if (!hasEmail) issues.push('No email address found — some visitors prefer email');
  if (!hasContactForm && !hasContactSection) issues.push('No contact form or section found — a clear contact path improves conversion');

  // Partial deduction for missing methods
  if (issues.length >= 2) score = Math.round(RUBRIC.visibleContact * 0.6);
  if (issues.length >= 3) score = Math.round(RUBRIC.visibleContact * 0.3);

  return { score, hasSection: true, issues };
}

/**
 * Assess value proposition clarity.
 */
function assessValueProposition($: cheerio.CheerioAPI): {
  score: number;
  has: boolean;
  issues: string[];
} {
  let score = 0;
  const body = $('body').text();

  // Check for value proposition language in the first part of the page
  // (heuristic: check headings and first ~500 words)
  const headings = $('h1, h2').map((_, el) => $(el).text()).get().join(' ');
  const firstParagraphs = $('p').slice(0, 5).map((_, el) => $(el).text()).get().join(' ');
  const heroText = headings + ' ' + firstParagraphs;

  const hasValueProp = VALUE_PROP_PATTERNS.some((p) => p.test(heroText));

  if (!hasValueProp) {
    // Try the full body as a fallback
    const hasInBody = VALUE_PROP_PATTERNS.some((p) => p.test(body));
    if (!hasInBody) {
      return {
        score: 0,
        has: false,
        issues: ['No clear value proposition identified — visitors should quickly understand what you offer and why they should choose you'],
      };
    }
    // Found in body but not prominently placed
    return {
      score: Math.round(RUBRIC.clearValueProp * 0.4),
      has: true,
      issues: ['Value proposition language exists but may not be prominent enough — consider placing it in your main heading or hero section'],
    };
  }

  return { score: RUBRIC.clearValueProp, has: true, issues: [] };
}

/**
 * Assess service / offering clarity.
 */
function assessServiceClarity($: cheerio.CheerioAPI): {
  score: number;
  issues: string[];
} {
  const body = $('body').text();
  const headings = $('h1, h2, h3').map((_, el) => $(el).text()).get().join(' ');

  const hasServiceSection = SERVICE_PATTERNS.some((p) => p.test(headings));
  const hasServiceInBody = SERVICE_PATTERNS.some((p) => p.test(body));

  if (hasServiceSection) {
    return { score: RUBRIC.serviceClarity, issues: [] };
  }

  if (hasServiceInBody) {
    return {
      score: Math.round(RUBRIC.serviceClarity * 0.6),
      issues: ['Services are mentioned but not clearly structured with headings — named service sections help visitors find what they need'],
    };
  }

  return {
    score: 0,
    issues: ['No clearly named services or offerings section found — visitors should be able to quickly identify what you provide'],
  };
}

/**
 * Assess trust evidence (trust badges, certifications, portfolio).
 */
function assessTrustEvidence($: cheerio.CheerioAPI): {
  score: number;
  hasBadges: boolean;
  badgeIssues: string[];
} {
  const body = $('body').text();
  const _html = $.html() ?? '';

  const hasTrustSignals = TRUST_PATTERNS.some((p) => p.test(body));
  const hasPortfolio = PORTFOLIO_PATTERNS.some((p) => p.test(body));

  // Check for client logos
  const hasClientLogos =
    $('[class*="logo"], [class*="client"], [class*="partner"]').find('img').length > 0 ||
    $('img[alt*="logo" i]').length > 1;

  let score = 0;
  const badgeIssues: string[] = [];

  if (hasTrustSignals) score += RUBRIC.trustEvidence * 0.4;
  if (hasPortfolio) score += RUBRIC.trustEvidence * 0.3;
  if (hasClientLogos) score += RUBRIC.trustEvidence * 0.3;

  if (score === 0) {
    badgeIssues.push('No trust signals detected (certifications, client logos, portfolio, awards) — these build credibility with new visitors');
    return { score: 0, hasBadges: false, badgeIssues };
  }

  if (!hasTrustSignals) badgeIssues.push('Consider adding trust indicators (certifications, awards, guarantees) to build credibility');
  if (!hasPortfolio) badgeIssues.push('A portfolio or case studies section would demonstrate your track record');

  return { score: Math.round(score), hasBadges: true, badgeIssues };
}

/**
 * Assess testimonial evidence.
 */
function assessTestimonials($: cheerio.CheerioAPI): {
  score: number;
  has: boolean;
  issues: string[];
} {
  const selectors = [
    '[class*="testimonial"]',
    '[class*="review"]',
    '[class*="feedback"]',
    '[id*="testimonial"]',
    'blockquote[cite]',
    '[itemtype*="Review"]',
    '[itemtype*="Rating"]',
  ];

  const hasTestimonials = selectors.some((sel) => $(sel).length > 0);

  // Also check for quoted text patterns
  const body = $('body').text();
  const hasQuotePattern = /"[^"]{20,}"|"[^"]{20,}"/.test(body) && /said|says|stated|mentioned|wrote/i.test(body);

  if (hasTestimonials) {
    return { score: RUBRIC.testimonialEvidence, has: true, issues: [] };
  }

  if (hasQuotePattern) {
    return {
      score: Math.round(RUBRIC.testimonialEvidence * 0.5),
      has: true,
      issues: ['Quoted text found but not in a dedicated testimonial section — consider creating a clear testimonials area'],
    };
  }

  return {
    score: 0,
    has: false,
    issues: ['No testimonials or customer reviews found — social proof from real customers significantly increases conversion rates'],
  };
}

/**
 * Assess social proof (social media links, follower counts, etc.).
 */
function _detectSocialProof($: cheerio.CheerioAPI): {
  has: boolean;
  issues: string[];
} {
  const socialDomains = [
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
    'linkedin.com', 'youtube.com', 'tiktok.com', 'pinterest.com',
    'threads.net',
  ];

  let hasSocial = false;
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    for (const domain of socialDomains) {
      if (href.includes(domain)) {
        hasSocial = true;
        return false; // break
      }
    }
    return; // continue
  });

  return {
    has: hasSocial,
    issues: hasSocial ? [] : ['No social media links found — social presence builds trust and provides additional touchpoints'],
  };
}

/**
 * Assess pricing clarity.
 */
function assessPricing($: cheerio.CheerioAPI): {
  score: number;
  has: boolean;
  issues: string[];
} {
  const selectors = [
    '[class*="pricing"]',
    '[id*="pricing"]',
    '[class*="price-table"]',
    '[class*="plan"]',
    '[itemtype*="PriceSpecification"]',
  ];

  const hasPricingSection = selectors.some((sel) => $(sel).length > 0);

  // Check for currency patterns in headings
  const headings = $('h1, h2, h3, h4').text();
  const hasPriceText = /\$[\d,]+|€[\d,]+|£[\d,]+|₹[\d,]+/.test(headings);

  if (hasPricingSection || hasPriceText) {
    return { score: RUBRIC.pricingClarity, has: true, issues: [] };
  }

  // Don't penalize if this isn't a commerce/agency site — the assumption
  // is that some businesses don't show prices. We note it as informational.
  return {
    score: Math.round(RUBRIC.pricingClarity * 0.3),
    has: false,
    issues: ['No pricing information found — if you sell products or tiered services, visible pricing helps visitors self-qualify (this is optional for some business models)'],
  };
}

/**
 * Assess mobile interaction (tap targets, touch-friendly elements).
 */
function assessMobileInteraction($: cheerio.CheerioAPI): {
  score: number;
  issues: string[];
} {
  const issues: string[] = [];

  // Check for common mobile issues:
  // 1. Very small links that might be hard to tap
  // 2. Links too close together
  // 3. Missing viewport (handled by SEO analyzer, but we double-check)
  const viewport = $('meta[name="viewport"]').attr('content');
  if (!viewport || !viewport.includes('width=device-width')) {
    issues.push('Missing or misconfigured viewport meta tag — this affects mobile rendering and tap-target sizing');
    return { score: 0, issues };
  }

  // Check for inline styles that set very small font sizes on interactive elements
  let smallInteractiveElements = 0;
  $('a, button').each((_, el) => {
    const style = $(el).attr('style') ?? '';
    const fontSizeMatch = style.match(/font-size:\s*(\d+)/);
    if (fontSizeMatch && parseInt(fontSizeMatch[1]) < 12) {
      smallInteractiveElements++;
    }
  });

  if (smallInteractiveElements > 0) {
    issues.push(`Found ${smallInteractiveElements} interactive element(s) with very small font sizes — these may be hard to tap on mobile`);
    return { score: Math.round(RUBRIC.mobileInteraction * 0.5), issues };
  }

  // Check for very short link text (less than 4 chars) which could indicate tiny tap targets
  let shortLinks = 0;
  $('a').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 0 && text.length < 4) {
      shortLinks++;
    }
  });

  if (shortLinks > 3) {
    issues.push('Several links have very short text — these may create small tap targets on mobile devices');
    return { score: Math.round(RUBRIC.mobileInteraction * 0.7), issues };
  }

  return { score: RUBRIC.mobileInteraction, issues: [] };
}

/**
 * Assess form usability.
 */
function assessFormClarity($: cheerio.CheerioAPI): {
  score: number;
  hasForm: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const forms = $('form');

  if (forms.length === 0) {
    // Not all sites need forms — this is a partial-credit situation
    return {
      score: Math.round(RUBRIC.formClarity * 0.5),
      hasForm: false,
      issues: ['No contact form found — some visitors prefer forms over email or phone (optional for some business models)'],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let totalLabels = 0;
  let totalInputs = 0;
  let labeledInputs = 0;
  let requiredFields = 0;

  forms.each((_, form) => {
    const $form = $(form);

    // Check for labels
    $form.find('label').each(() => { totalLabels++; });

    // Check for inputs
    $form.find('input[type!="hidden"], textarea, select').each((_, input) => {
      totalInputs++;
      const $input = $(input);

      // Check if labeled
      const id = $input.attr('id');
      const hasLabel = id && $form.find(`label[for="${id}"]`).length > 0;
      const hasAriaLabel = $input.attr('aria-label') || $input.attr('aria-labelledby');
      const hasPlaceholder = $input.attr('placeholder');

      if (hasLabel || hasAriaLabel) {
        labeledInputs++;
      } else if (!hasPlaceholder) {
        issues.push('Form input without a visible label or aria-label — this hurts usability and accessibility');
      }

      // Check for required fields
      if ($input.attr('required') || $input.attr('aria-required') === 'true') {
        requiredFields++;
      }
    });
  });

  if (totalInputs > 0 && labeledInputs / totalInputs < 0.5) {
    issues.push('Many form inputs lack proper labels — labeled forms are easier to fill out and more accessible');
  }

  if (requiredFields === 0 && totalInputs > 0) {
    issues.push('No required form fields detected — marking essential fields helps visitors know what information is needed');
  }

  if (issues.length === 0) {
    return { score: RUBRIC.formClarity, hasForm: true, issues: [] };
  }

  const deduction = issues.length * (RUBRIC.formClarity * 0.2);
  return { score: Math.max(0, Math.round(RUBRIC.formClarity - deduction)), hasForm: true, issues };
}

/**
 * Check for social links.
 */
function detectSocialLinks($: cheerio.CheerioAPI): {
  has: boolean;
  platforms: string[];
} {
  const socialDomains: Record<string, string> = {
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'twitter.com': 'Twitter',
    'x.com': 'X',
    'linkedin.com': 'LinkedIn',
    'youtube.com': 'YouTube',
    'tiktok.com': 'TikTok',
    'pinterest.com': 'Pinterest',
    'threads.net': 'Threads',
  };

  const platforms: string[] = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    try {
      const hostname = new URL(href, 'https://example.com').hostname.toLowerCase();
      for (const [domain, platform] of Object.entries(socialDomains)) {
        if ((hostname === domain || hostname.endsWith('.' + domain)) && !platforms.includes(platform)) {
          platforms.push(platform);
        }
      }
    } catch {
      // Invalid URL — skip
    }
  });

  return { has: platforms.length > 0, platforms };
}

/**
 * Check for FAQ section.
 */
function detectFaq($: cheerio.CheerioAPI): {
  has: boolean;
  issues: string[];
} {
  const hasFaq =
    $('[class*="faq"], [id*="faq"], [class*="accordion"]').length > 0 ||
    $('script[type="application/ld+json"]').text().includes('FAQPage');

  return {
    has: hasFaq,
    issues: hasFaq ? [] : ['No FAQ section found — addressing common objections can reduce hesitation and improve conversion'],
  };
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Analyze conversion readiness of a webpage.
 *
 * This is a HEURISTIC ASSESSMENT, not a scientific measurement.
 * It uses DOM-order inference and pattern matching — not actual
 * rendering or user testing data.
 */
export function analyzeConversionReadiness(
  html: string,
  _url: string,
): ConversionAnalysisResult {
  const $ = cheerio.load(html);

  // ── Run all assessments ──
  const earlyCta = assessEarlyCta($);
  const contact = assessContact($);
  const valueProp = assessValueProposition($);
  const serviceClarity = assessServiceClarity($);
  const trust = assessTrustEvidence($);
  const testimonials = assessTestimonials($);
  const pricing = assessPricing($);
  const mobile = assessMobileInteraction($);
  const form = assessFormClarity($);
  const social = detectSocialLinks($);
  const faq = detectFaq($);

  // CTA consistency — gather all CTA elements
  const ctaButtons: Array<{ text: string }> = [];
  const ctaSelectors = 'a[class*="btn"], a[class*="button"], a[class*="cta"], button, a[role="button"]';
  $(ctaSelectors).each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 0 && text.length < 80) {
      ctaButtons.push({ text });
    }
  });
  const ctaConsistency = assessCtaConsistency(ctaButtons);

  // ── Total score ──
  const rawScore =
    earlyCta.score +
    contact.score +
    valueProp.score +
    serviceClarity.score +
    trust.score +
    testimonials.score +
    pricing.score +
    ctaConsistency.score +
    mobile.score +
    form.score;

  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // ── Overall assessment ──
  let overallAssessment: string;
  if (score >= 90) {
    overallAssessment = 'CONVERSION READINESS — HEURISTIC ASSESSMENT: Strong conversion signals detected. The page has clear calls-to-action, visible contact methods, and credibility indicators. Note: this is a heuristic assessment based on page structure — actual conversion rates depend on many factors beyond page content.';
  } else if (score >= 70) {
    overallAssessment = 'CONVERSION READINESS — HEURISTIC ASSESSMENT: Good conversion foundation with some areas to strengthen. Key elements like CTAs and contact methods are present, but adding trust signals or refining CTA language could improve effectiveness. Note: this is a heuristic assessment based on page structure.';
  } else if (score >= 50) {
    overallAssessment = 'CONVERSION READINESS — HEURISTIC ASSESSMENT: Several conversion elements are missing or could be improved. The page would benefit from clearer calls-to-action, more visible contact options, and stronger trust indicators. Note: this is a heuristic assessment based on page structure.';
  } else {
    overallAssessment = 'CONVERSION READINESS — HEURISTIC ASSESSMENT: Key conversion elements are missing. Visitors may struggle to understand the value proposition, find a way to contact you, or take the next step. Addressing these fundamentals would likely improve lead generation. Note: this is a heuristic assessment based on page structure.';
  }

  // ── Assemble result ──
  return {
    hasPrimaryCta: earlyCta.hasPrimary,
    primaryCtaText: earlyCta.text,
    ctaCount: earlyCta.count,
    ctaIssues: [...earlyCta.issues, ...ctaConsistency.issues],

    hasContactSection: contact.hasSection,
    contactIssues: contact.issues,

    hasTestimonials: testimonials.has,
    testimonialIssues: testimonials.issues,

    hasSocialProof: social.has,
    socialProofIssues: social.has ? [] : ['Social media presence builds trust — consider adding social links'],

    hasTrustBadges: trust.hasBadges,
    trustBadgeIssues: trust.badgeIssues,

    hasValueProposition: valueProp.has,
    valuePropositionIssues: valueProp.issues,

    mobileCtaAccessible: mobile.score > 0,
    mobileCtaIssues: mobile.issues,

    hasContactForm: form.hasForm,
    formIssues: form.issues,

    hasSocialLinks: social.has,
    socialPlatforms: social.platforms,

    hasPricingInfo: pricing.has,
    pricingIssues: pricing.issues,

    hasFaq: faq.has,
    faqIssues: faq.issues,

    overallAssessment,
  };
}

/**
 * Calculate the conversion readiness score (0-100) from a ConversionAnalysisResult.
 * Exported for use by the scoring module.
 */
export function calculateConversionScore(result: ConversionAnalysisResult): number {
  // Re-score based on the rubric using the result's boolean flags
  let score = 0;

  // Early CTA: 20
  if (result.hasPrimaryCta) score += 20;
  else score += result.ctaIssues.length === 0 ? 0 : 0;

  // Visible contact: 15
  if (result.hasContactSection) score += 15;
  else if (result.hasContactForm) score += 10;

  // Clear value prop: 15
  if (result.hasValueProposition) score += 15;
  else if (result.valuePropositionIssues.length <= 1) score += 7;

  // Service clarity: 10
  if (result.valuePropositionIssues.length === 0) score += 10;
  else if (result.valuePropositionIssues.length <= 1) score += 5;

  // Trust evidence: 10
  if (result.hasTrustBadges) score += 10;
  else if (result.hasSocialProof) score += 5;

  // Testimonial evidence: 10
  if (result.hasTestimonials) score += 10;
  else score += 0;

  // Pricing clarity: 5
  if (result.hasPricingInfo) score += 5;
  else score += 1; // Don't fully penalize — some businesses don't show pricing

  // CTA consistency: 5
  if (result.ctaIssues.length === 0 && result.hasPrimaryCta) score += 5;
  else if (result.ctaIssues.length <= 1) score += 3;

  // Mobile interaction: 5
  if (result.mobileCtaAccessible && result.mobileCtaIssues.length === 0) score += 5;
  else if (result.mobileCtaIssues.length <= 1) score += 2;

  // Form clarity: 5
  if (result.hasContactForm && result.formIssues.length === 0) score += 5;
  else if (result.hasContactForm) score += 3;
  else score += 2; // Partial credit — not all sites need forms

  return Math.min(100, Math.max(0, score));
}
