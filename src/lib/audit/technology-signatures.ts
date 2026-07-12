/**
 * Technology detection signatures for the Website Revenue Audit Funnel.
 *
 * Each signature defines patterns to detect a specific technology
 * through HTTP headers, HTML content, script sources, cookies, and meta tags.
 *
 * Confidence levels:
 *   certain  — strong, unique evidence (e.g., specific header, unique meta tag)
 *   likely   — multiple moderate signals combined
 *   possible — weak or common patterns that could match other technologies
 */

import type { TechnologyCategory } from './types';

// ──────────────────────────────────────────────────────────────
// Signature types
// ──────────────────────────────────────────────────────────────

export type ConfidenceLevel = 'certain' | 'likely' | 'possible';

export interface HeaderPattern {
  /** Header name (case-insensitive match). */
  name: string | RegExp;
  /** Substring or regex to match within the header value. */
  value?: string | RegExp;
  /** What this match proves. */
  description: string;
  /** Confidence if this single pattern matches. */
  confidence: ConfidenceLevel;
}

export interface HtmlPattern {
  /** CSS selector or regex to search for in the HTML. */
  pattern: string | RegExp;
  /** What this match proves. */
  description: string;
  /** Confidence if this single pattern matches. */
  confidence: ConfidenceLevel;
}

export interface ScriptPattern {
  /** Substring or regex to match in script src attributes. */
  srcPattern?: string | RegExp;
  /** Substring or regex to match in inline script content. */
  contentPattern?: string | RegExp;
  /** What this match proves. */
  description: string;
  /** Confidence if this single pattern matches. */
  confidence: ConfidenceLevel;
}

export interface CookiePattern {
  /** Cookie name prefix or regex. */
  name: string | RegExp;
  /** What this match proves. */
  description: string;
  /** Confidence if this single pattern matches. */
  confidence: ConfidenceLevel;
}

export interface MetaPattern {
  /** Meta tag name or property. */
  name: string;
  /** Substring to match in the content attribute (optional). */
  contentContains?: string | RegExp;
  /** What this match proves. */
  description: string;
  /** Confidence if this single pattern matches. */
  confidence: ConfidenceLevel;
}

export interface TechnologySignature {
  /** Human-readable technology name. */
  name: string;
  /** Category for grouping. */
  category: TechnologyCategory;
  /** Header-based detection patterns. */
  headerPatterns?: HeaderPattern[];
  /** HTML content patterns. */
  htmlPatterns?: HtmlPattern[];
  /** Script-based patterns. */
  scriptPatterns?: ScriptPattern[];
  /** Cookie-based patterns. */
  cookiePatterns?: CookiePattern[];
  /** Meta tag patterns. */
  metaPatterns?: MetaPattern[];
  /**
   * Minimum number of matching patterns to reach each confidence level.
   * If a single pattern is marked 'certain', it overrides this.
   */
  minimumEvidence?: {
    likely: number;
    certain: number;
  };
}

// ──────────────────────────────────────────────────────────────
// Technology signatures
// ──────────────────────────────────────────────────────────────

export const TECHNOLOGY_SIGNATURES: TechnologySignature[] = [
  // ── Frameworks ──
  {
    name: 'Next.js',
    category: 'framework',
    headerPatterns: [
      { name: 'x-nextjs-cache', description: 'X-Nextjs-Cache header present', confidence: 'certain' },
      { name: 'x-nextjs-matched-path', description: 'X-Nextjs-Matched-Path header present', confidence: 'certain' },
      { name: 'x-nextjs-redirect', description: 'X-Nextjs-Redirect header present', confidence: 'certain' },
      { name: 'server', value: /next/i, description: 'Server header mentions Next.js', confidence: 'likely' },
    ],
    htmlPatterns: [
      { pattern: /__NEXT_DATA__/, description: 'Next.js hydration data script', confidence: 'certain' },
      { pattern: /_next\/static/, description: 'Next.js static asset path', confidence: 'certain' },
      { pattern: /id="__next"/, description: 'Next.js root div element', confidence: 'likely' },
      { pattern: /_next\/image/, description: 'Next.js image optimization path', confidence: 'likely' },
    ],
    scriptPatterns: [
      { srcPattern: /\/_next\//, description: 'Next.js runtime script', confidence: 'certain' },
    ],
    metaPatterns: [
      { name: 'next-head-count', description: 'Next.js head management meta tag', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 2, certain: 1 },
  },

  {
    name: 'React',
    category: 'framework',
    htmlPatterns: [
      { pattern: /data-reactroot/, description: 'React root data attribute', confidence: 'likely' },
      { pattern: /__REACT_DEVTOOLS/, description: 'React DevTools global hook', confidence: 'likely' },
      { pattern: /react[-_]root/, description: 'React root container', confidence: 'possible' },
    ],
    scriptPatterns: [
      { srcPattern: /react(\.production|\.development)?\.min\.js/, description: 'React library script', confidence: 'certain' },
      { contentPattern: /React\.createElement|react\.createElement/, description: 'React.createElement calls in inline script', confidence: 'likely' },
    ],
    minimumEvidence: { likely: 2, certain: 1 },
  },

  // ── CMS / Builders ──
  {
    name: 'WordPress',
    category: 'cms',
    htmlPatterns: [
      { pattern: /wp-content\//, description: 'WordPress content directory', confidence: 'certain' },
      { pattern: /wp-includes\//, description: 'WordPress includes directory', confidence: 'certain' },
      { pattern: /<link[^>]+\/wp-content\//, description: 'WordPress stylesheet link', confidence: 'certain' },
      { pattern: /class="[^"]*wp-/, description: 'WordPress CSS class prefix', confidence: 'likely' },
    ],
    scriptPatterns: [
      { srcPattern: /\/wp-includes\//, description: 'WordPress includes script', confidence: 'certain' },
      { srcPattern: /\/wp-content\//, description: 'WordPress content script', confidence: 'certain' },
    ],
    metaPatterns: [
      { name: 'generator', contentContains: 'WordPress', description: 'WordPress generator meta tag', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  {
    name: 'Elementor',
    category: 'builder',
    htmlPatterns: [
      { pattern: /elementor[- ]/i, description: 'Elementor CSS class or attribute', confidence: 'certain' },
      { pattern: /data-elementor-/i, description: 'Elementor data attribute', confidence: 'certain' },
    ],
    scriptPatterns: [
      { srcPattern: /elementor/i, description: 'Elementor JavaScript', confidence: 'certain' },
    ],
    metaPatterns: [
      { name: 'generator', contentContains: 'Elementor', description: 'Elementor generator meta tag', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  {
    name: 'Shopify',
    category: 'ecommerce',
    htmlPatterns: [
      { pattern: /cdn\.shopify\.com/, description: 'Shopify CDN reference', confidence: 'certain' },
      { pattern: /Shopify\.theme/i, description: 'Shopify theme object', confidence: 'certain' },
      { pattern: /shopify-section/i, description: 'Shopify section attribute', confidence: 'certain' },
      { pattern: /data-shopify/i, description: 'Shopify data attribute', confidence: 'likely' },
    ],
    scriptPatterns: [
      { srcPattern: /cdn\.shopify\.com/, description: 'Shopify CDN script', confidence: 'certain' },
      { contentPattern: /Shopify\.currency|Shopify\.country/, description: 'Shopify global object', confidence: 'certain' },
    ],
    cookiePatterns: [
      { name: '_shopify_', description: 'Shopify session cookie', confidence: 'certain' },
      { name: 'shopify_pay_', description: 'Shopify Pay cookie', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  {
    name: 'Webflow',
    category: 'builder',
    htmlPatterns: [
      { pattern: /data-w-id=/, description: 'Webflow interaction data attribute', confidence: 'certain' },
      { pattern: /data-wf-/i, description: 'Webflow data attribute', confidence: 'certain' },
      { pattern: /w-conditional/i, description: 'Webflow conditional visibility', confidence: 'likely' },
    ],
    scriptPatterns: [
      { srcPattern: /webflow\.com|webflow-assets/, description: 'Webflow script', confidence: 'certain' },
    ],
    metaPatterns: [
      { name: 'generator', contentContains: 'Webflow', description: 'Webflow generator meta tag', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  {
    name: 'Wix',
    category: 'builder',
    htmlPatterns: [
      { pattern: /wix[-.]|_wix_/i, description: 'Wix-specific markup', confidence: 'certain' },
      { pattern: /data-wix-/i, description: 'Wix data attribute', confidence: 'certain' },
    ],
    scriptPatterns: [
      { srcPattern: /wix\.com|static\.wixstatic\.com/, description: 'Wix script resource', confidence: 'certain' },
    ],
    metaPatterns: [
      { name: 'generator', contentContains: 'Wix.com', description: 'Wix generator meta tag', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  {
    name: 'Squarespace',
    category: 'builder',
    htmlPatterns: [
      { pattern: /squarespace\.com/i, description: 'Squarespace domain reference', confidence: 'certain' },
      { pattern: /data-sqs-/i, description: 'Squarespace data attribute', confidence: 'likely' },
    ],
    scriptPatterns: [
      { srcPattern: /squarespace\.com/, description: 'Squarespace script', confidence: 'certain' },
    ],
    metaPatterns: [
      { name: 'generator', contentContains: 'Squarespace', description: 'Squarespace generator meta tag', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  // ── CSS Frameworks ──
  {
    name: 'Tailwind CSS',
    category: 'framework',
    htmlPatterns: [
      { pattern: /class="[^"]*\b(flex|grid|gap-|p-|m-|text-|bg-|border-|rounded-|shadow-|space-|justify-|items-|w-|h-|max-w-|min-h-|overflow-|relative|absolute|fixed|sticky)[\s"]/, description: 'Tailwind utility classes detected', confidence: 'possible' },
    ],
    // IMPORTANT: Don't claim Tailwind certainty from short utility-looking class names alone.
    // Many CSS frameworks and custom CSS use similar patterns.
    minimumEvidence: { likely: 3, certain: 10 }, // Need strong multiple signals for certainty
  },

  {
    name: 'Bootstrap',
    category: 'framework',
    htmlPatterns: [
      { pattern: /class="[^"]*\bcontainer(-fluid)?\b/, description: 'Bootstrap container class', confidence: 'likely' },
      { pattern: /class="[^"]*\brow\b/, description: 'Bootstrap row class', confidence: 'possible' },
      { pattern: /class="[^"]*\bcol-(xs|sm|md|lg|xl)-/, description: 'Bootstrap column class', confidence: 'certain' },
      { pattern: /class="[^"]*\bbtn(-outline|-primary|-secondary|-success|-danger|-warning|-info|-light|-dark)?\b/, description: 'Bootstrap button class', confidence: 'likely' },
      { pattern: /data-bs-/, description: 'Bootstrap 5 data attribute', confidence: 'certain' },
    ],
    scriptPatterns: [
      { srcPattern: /bootstrap(\.min)?\.js/, description: 'Bootstrap JavaScript', confidence: 'certain' },
    ],
    linkPatterns: [
      { hrefPattern: /bootstrap(\.min)?\.css/, description: 'Bootstrap CSS', confidence: 'certain' },
    ] as Array<{ hrefPattern: RegExp; description: string; confidence: ConfidenceLevel }>,
    metaPatterns: [
      { name: 'viewport', contentContains: 'width=device-width', description: 'Viewport meta (Bootstrap recommends this)', confidence: 'possible' },
    ],
    minimumEvidence: { likely: 2, certain: 1 },
  },

  // ── Analytics / Marketing ──
  {
    name: 'Google Tag Manager',
    category: 'analytics',
    scriptPatterns: [
      { srcPattern: /googletagmanager\.com\/gtm\.js/, description: 'GTM container script', confidence: 'certain' },
      { contentPattern: /googletagmanager\.com\/gtm\.js/, description: 'GTM snippet in inline script', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  {
    name: 'Google Analytics',
    category: 'analytics',
    scriptPatterns: [
      { srcPattern: /google-analytics\.com\/(analytics|ga)\.js/, description: 'Google Analytics (Universal Analytics)', confidence: 'certain' },
      { srcPattern: /gtag\/js\?id=G-/, description: 'Google Analytics 4 via gtag', confidence: 'certain' },
      { srcPattern: /gtag\/js\?id=UA-/, description: 'Universal Analytics via gtag', confidence: 'certain' },
      { contentPattern: /gtag\(['"]config['"],\s*['"]G-/, description: 'GA4 config call in inline script', confidence: 'certain' },
      { contentPattern: /ga\(['"]create['"],\s*['"]UA-/, description: 'Universal Analytics create call', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  // ── Hosting / CDN ──
  {
    name: 'Cloudflare',
    category: 'cdn',
    headerPatterns: [
      { name: 'cf-ray', description: 'Cloudflare Ray ID header', confidence: 'certain' },
      { name: 'cf-cache-status', description: 'Cloudflare cache status header', confidence: 'certain' },
      { name: 'server', value: /cloudflare/i, description: 'Server header mentions Cloudflare', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  {
    name: 'Vercel',
    category: 'hosting',
    headerPatterns: [
      { name: 'x-vercel-id', description: 'Vercel request ID header', confidence: 'certain' },
      { name: 'x-vercel-cache', description: 'Vercel cache header', confidence: 'certain' },
      { name: 'server', value: /vercel/i, description: 'Server header mentions Vercel', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  {
    name: 'Netlify',
    category: 'hosting',
    headerPatterns: [
      { name: 'x-nf-request-id', description: 'Netlify request ID header', confidence: 'certain' },
      { name: 'server', value: /netlify/i, description: 'Server header mentions Netlify', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  // ── JavaScript Libraries ──
  {
    name: 'jQuery',
    category: 'framework',
    scriptPatterns: [
      { srcPattern: /jquery[.-](\d+\.\d+|min)\.js/i, description: 'jQuery library script', confidence: 'certain' },
    ],
    htmlPatterns: [
      { pattern: /jQuery\(/, description: 'jQuery function call', confidence: 'likely' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },

  // ── E-commerce ──
  {
    name: 'WooCommerce',
    category: 'ecommerce',
    htmlPatterns: [
      { pattern: /woocommerce/i, description: 'WooCommerce class or identifier', confidence: 'certain' },
      { pattern: /class="[^"]*woocommerce/, description: 'WooCommerce CSS class', confidence: 'certain' },
    ],
    scriptPatterns: [
      { srcPattern: /woocommerce/i, description: 'WooCommerce script', confidence: 'certain' },
    ],
    metaPatterns: [
      { name: 'generator', contentContains: 'WooCommerce', description: 'WooCommerce generator meta tag', confidence: 'certain' },
    ],
    minimumEvidence: { likely: 1, certain: 1 },
  },
];

// Extend the signature type to support link patterns (for Bootstrap detection)
declare module './technology-signatures' {
  interface TechnologySignature {
    linkPatterns?: Array<{
      hrefPattern: RegExp;
      description: string;
      confidence: ConfidenceLevel;
    }>;
  }
}
