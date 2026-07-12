#!/usr/bin/env node

/**
 * SEO Audit Script
 *
 * Audits a running Next.js site for common SEO issues:
 *   - HTTP status codes for every internal route
 *   - <title> presence
 *   - <meta name="description"> presence
 *   - <link rel="canonical"> presence
 *   - Open Graph tags (og:title, og:description, og:url, og:image)
 *   - Duplicate titles across pages
 *   - Duplicate descriptions across pages
 *   - /robots.txt returns 200
 *   - /sitemap.xml returns 200
 *   - /llms.txt returns 200
 *   - /feed.xml returns 200
 *
 * Usage:
 *   node scripts/seo-audit.mjs
 *   node scripts/seo-audit.mjs https://dev-aditya.com
 *   node scripts/seo-audit.mjs --base-url http://localhost:3000
 *
 * Exit code 0 if all checks pass, 1 if any fail.
 */

// ── Routes to audit ──────────────────────────────────────────────────────────

const ROUTES = [
  '/',
  '/work',
  '/packages',
  '/about',
  '/contact',
  '/mentoring',
  '/services',
  '/services/business-websites',
  '/services/website-redesign',
  '/services/landing-page-design',
  '/services/ecommerce-development',
  '/services/nextjs-development',
  '/services/interactive-websites',
  '/web-designer-delhi',
  '/resources',
  '/resources/portfolio-checklist',
  '/resources/frontend-qa',
  '/resources/ai-website-agency',
  '/resources/website-cost-india',
  '/resources/nextjs-vs-wordpress',
  '/resources/website-redesign-checklist',
  '/resources/choose-freelance-web-designer-india',
  '/work/saffron-steam-experience',
  '/work/corporate-leadgen-platform',
  '/work/driftwear-ecommerce',
  '/work/real-estate-atelier',
  '/privacy',
  '/terms',
  '/accessibility',
];

// ── Static file / API routes to check ────────────────────────────────────────

const STATIC_ROUTES = [
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/feed.xml',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseArgv() {
  const args = process.argv.slice(2);
  let baseUrl = 'http://localhost:3000';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base-url' && args[i + 1]) {
      baseUrl = args[i + 1].replace(/\/+$/, '');
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
SEO Audit Script

Usage:
  node scripts/seo-audit.mjs [BASE_URL]
  node scripts/seo-audit.mjs --base-url <url>

Arguments:
  BASE_URL          Base URL to audit (default: http://localhost:3000)
  --base-url <url>  Same as positional argument
  -h, --help        Show this help message

Examples:
  node scripts/seo-audit.mjs
  node scripts/seo-audit.mjs https://dev-aditya.com
  node scripts/seo-audit.mjs --base-url http://staging.example.com
      `);
      process.exit(0);
    } else if (!args[i].startsWith('-')) {
      baseUrl = args[i].replace(/\/+$/, '');
    }
  }

  return { baseUrl };
}

/**
 * Extract text content from an HTML string between opening and closing tags.
 * Returns empty string if not found.
 */
function extractTag(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1]?.trim() ?? '' : '';
}

/**
 * Extract the content attribute from a meta tag.
 * e.g. <meta name="description" content="..."> → returns the content value
 */
function extractMetaContent(html, nameAttr) {
  // Handle both name= and property= attributes
  const patterns = [
    new RegExp(`<meta[^>]*\\b${nameAttr.includes(':') ? 'property' : 'name'}=["']${escapeRegex(nameAttr)}["'][^>]*\\bcontent=["']([^"']*?)["']`, 'i'),
    new RegExp(`<meta[^>]*\\bcontent=["']([^"']*?)["'][^>]*\\b${nameAttr.includes(':') ? 'property' : 'name'}=["']${escapeRegex(nameAttr)}["']`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Fetch a URL and return { status, html } or throw on network error.
 */
async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml',
      'User-Agent': 'SEO-Audit-Bot/1.0',
    },
    redirect: 'follow',
  });
  const html = await response.text();
  return { status: response.status, html, url: response.url };
}

// ── Color helpers (ANSI) ────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

function pass(msg) {
  return `${GREEN}PASS${RESET} ${msg}`;
}

function fail(msg) {
  return `${RED}FAIL${RESET} ${msg}`;
}


// ── Main audit ───────────────────────────────────────────────────────────────

async function main() {
  const { baseUrl } = parseArgv();

  console.log(`\n${BOLD}═══════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  SEO Audit${RESET}`);
  console.log(`${BOLD}═══════════════════════════════════════════════════════════${RESET}`);
  console.log(`  Target: ${CYAN}${baseUrl}${RESET}`);
  console.log(`  Pages:  ${ROUTES.length} routes + ${STATIC_ROUTES.length} static files`);
  console.log(`  Time:   ${new Date().toISOString()}\n`);

  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;
  const failures = [];

  function recordPass(msg) {
    totalChecks++;
    passedChecks++;
    console.log(`  ${pass(msg)}`);
  }

  function recordFail(msg) {
    totalChecks++;
    failedChecks++;
    failures.push(msg);
    console.log(`  ${fail(msg)}`);
  }

  // ── Phase 1: Static file routes ──────────────────────────────────────────

  console.log(`${BOLD}── Static / Well-Known Routes ──────────────────────────────${RESET}\n`);

  for (const route of STATIC_ROUTES) {
    const url = `${baseUrl}${route}`;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SEO-Audit-Bot/1.0' },
        redirect: 'follow',
      });
      if (res.ok) {
        recordPass(`${route} → HTTP ${res.status}`);
      } else {
        recordFail(`${route} → HTTP ${res.status} (expected 200)`);
      }
    } catch (err) {
      recordFail(`${route} → Network error: ${err.message}`);
    }
  }

  // ── Phase 2: Page routes ─────────────────────────────────────────────────

  console.log(`\n${BOLD}── Page Routes ─────────────────────────────────────────────${RESET}\n`);

  const pageResults = []; // { route, status, title, description, canonical, ogTitle, ogDescription, ogUrl, ogImage }

  for (const route of ROUTES) {
    const url = `${baseUrl}${route}`;
    const label = route === '/' ? '/' : route;

    try {
      const { status, html } = await fetchPage(url);

      // HTTP status check
      if (status >= 200 && status < 300) {
        recordPass(`[${label}] HTTP ${status}`);
      } else {
        recordFail(`[${label}] HTTP ${status} (expected 2xx)`);
      }

      // Title
      const title = extractTag(html, /<title[^>]*>([^<]+)<\/title>/i);
      if (title) {
        recordPass(`[${label}] <title> present: "${title.slice(0, 60)}${title.length > 60 ? '…' : ''}"`);
      } else {
        recordFail(`[${label}] <title> is missing`);
      }

      // Meta description
      const description = extractMetaContent(html, 'description');
      if (description) {
        recordPass(`[${label}] meta description present: "${description.slice(0, 60)}${description.length > 60 ? '…' : ''}"`);
      } else {
        recordFail(`[${label}] meta description is missing`);
      }

      // Canonical link
      const canonical = extractTag(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
        || extractTag(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
      if (canonical) {
        recordPass(`[${label}] canonical link: ${canonical}`);
      } else {
        recordFail(`[${label}] canonical link is missing`);
      }

      // OG tags
      const ogTitle = extractMetaContent(html, 'og:title');
      const ogDescription = extractMetaContent(html, 'og:description');
      const ogUrl = extractMetaContent(html, 'og:url');
      const ogImage = extractMetaContent(html, 'og:image');

      if (ogTitle) {
        recordPass(`[${label}] og:title present`);
      } else {
        recordFail(`[${label}] og:title is missing`);
      }

      if (ogDescription) {
        recordPass(`[${label}] og:description present`);
      } else {
        recordFail(`[${label}] og:description is missing`);
      }

      if (ogUrl) {
        recordPass(`[${label}] og:url present`);
      } else {
        recordFail(`[${label}] og:url is missing`);
      }

      if (ogImage) {
        recordPass(`[${label}] og:image present`);
      } else {
        recordFail(`[${label}] og:image is missing`);
      }

      pageResults.push({ route, status, title, description, canonical, ogTitle, ogDescription, ogUrl, ogImage });

    } catch (err) {
      recordFail(`[${label}] Network error: ${err.message}`);
      pageResults.push({ route, status: 0, title: '', description: '', canonical: '', ogTitle: '', ogDescription: '', ogUrl: '', ogImage: '' });
    }
  }

  // ── Phase 3: Duplicate checks ───────────────────────────────────────────

  console.log(`\n${BOLD}── Duplicate Content Checks ────────────────────────────────${RESET}\n`);

  // Duplicate titles
  const titleMap = new Map(); // title → [routes]
  for (const page of pageResults) {
    if (page.title) {
      const key = page.title.toLowerCase();
      if (!titleMap.has(key)) titleMap.set(key, []);
      titleMap.get(key).push(page.route);
    }
  }

  let duplicateTitlesFound = false;
  for (const [title, routes] of titleMap) {
    if (routes.length > 1) {
      duplicateTitlesFound = true;
      recordFail(`Duplicate title "${title.slice(0, 60)}" on: ${routes.join(', ')}`);
    }
  }
  if (!duplicateTitlesFound) {
    recordPass('No duplicate page titles found');
  }

  // Duplicate descriptions
  const descMap = new Map();
  for (const page of pageResults) {
    if (page.description) {
      const key = page.description.toLowerCase();
      if (!descMap.has(key)) descMap.set(key, []);
      descMap.get(key).push(page.route);
    }
  }

  let duplicateDescsFound = false;
  for (const [desc, routes] of descMap) {
    if (routes.length > 1) {
      duplicateDescsFound = true;
      recordFail(`Duplicate description "${desc.slice(0, 60)}…" on: ${routes.join(', ')}`);
    }
  }
  if (!duplicateDescsFound) {
    recordPass('No duplicate meta descriptions found');
  }

  // ── Summary ──────────────────────────────────────────────────────────────

  console.log(`\n${BOLD}═══════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  Summary${RESET}`);
  console.log(`${BOLD}═══════════════════════════════════════════════════════════${RESET}`);
  console.log(`  Total checks:  ${totalChecks}`);
  console.log(`  ${GREEN}Passed: ${passedChecks}${RESET}`);
  console.log(`  ${RED}Failed: ${failedChecks}${RESET}`);

  if (failedChecks > 0) {
    console.log(`\n${BOLD}  Failed Checks:${RESET}`);
    failures.forEach((f, i) => console.log(`  ${RED}${i + 1}.${RESET} ${f}`));
  }

  console.log(`\n${failedChecks === 0 ? GREEN + BOLD : RED + BOLD}  Result: ${failedChecks === 0 ? 'ALL CHECKS PASSED ✅' : 'SOME CHECKS FAILED ❌'}${RESET}\n`);

  process.exit(failedChecks > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(`${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
