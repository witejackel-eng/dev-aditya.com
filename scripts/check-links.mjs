#!/usr/bin/env node

/**
 * Link Checker Script
 *
 * Fetches the sitemap.xml from a given URL, then checks every URL in it
 * returns a 200 HTTP status. Also scans each page for internal and external
 * links and validates them.
 *
 * Usage:
 *   node scripts/check-links.mjs
 *   node scripts/check-links.mjs https://dev-aditya.com
 *   node scripts/check-links.mjs --base-url http://localhost:3000
 *
 * Exit code 0 if all links are healthy, 1 if any broken links found.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

function parseArgv() {
  const args = process.argv.slice(2);
  let baseUrl = 'http://localhost:3000';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base-url' && args[i + 1]) {
      baseUrl = args[i + 1].replace(/\/+$/, '');
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Link Checker Script

Usage:
  node scripts/check-links.mjs [BASE_URL]
  node scripts/check-links.mjs --base-url <url>

Arguments:
  BASE_URL          Base URL to check (default: http://localhost:3000)
  --base-url <url>  Same as positional argument
  -h, --help        Show this help message

Examples:
  node scripts/check-links.mjs
  node scripts/check-links.mjs https://dev-aditya.com
      `);
      process.exit(0);
    } else if (!args[i].startsWith('-')) {
      baseUrl = args[i].replace(/\/+$/, '');
    }
  }

  return { baseUrl };
}

/**
 * Fetch and parse sitemap.xml, returning an array of URL strings.
 */
async function fetchSitemapUrls(sitemapUrl) {
  console.log(`  Fetching sitemap: ${CYAN}${sitemapUrl}${RESET}`);

  const response = await fetch(sitemapUrl, {
    headers: { 'Accept': 'application/xml, text/xml', 'User-Agent': 'LinkChecker-Bot/1.0' },
  });

  if (!response.ok) {
    throw new Error(`Sitemap fetch failed (HTTP ${response.status}): ${sitemapUrl}`);
  }

  const text = await response.text();

  // Extract all <loc> values from the XML
  const locRegex = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  const urls = [];
  let match;

  while ((match = locRegex.exec(text)) !== null) {
    urls.push(match[1].trim());
  }

  return urls;
}

/**
 * Extract all href values from anchor tags in HTML.
 */
function extractLinks(html, pageUrl) {
  const hrefRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  const links = new Set();
  let match;

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];

    // Skip non-http links (mailto:, tel:, javascript:, #fragments, data:)
    if (
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      href.startsWith('#') ||
      href.startsWith('data:')
    ) {
      continue;
    }

    try {
      // Resolve relative URLs
      const resolved = new URL(href, pageUrl).href;
      links.add(resolved);
    } catch {
      // Invalid URL, skip
    }
  }

  return [...links];
}

/**
 * Check a single URL and return its HTTP status.
 * Returns { url, status, error? }
 */
async function checkUrl(url, options = {}) {
  const { timeout = 15000, method = 'HEAD' } = options;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method,
      headers: {
        'User-Agent': 'LinkChecker-Bot/1.0',
        'Accept': '*/*',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timer);

    return { url, status: response.status, ok: response.ok };
  } catch (err) {
    // If HEAD fails, try GET (some servers reject HEAD)
    if (method === 'HEAD') {
      return checkUrl(url, { ...options, method: 'GET' });
    }

    return {
      url,
      status: 0,
      ok: false,
      error: err.name === 'AbortError' ? 'Timeout' : err.message,
    };
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { baseUrl } = parseArgv();

  console.log(`\n${BOLD}═══════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  Link Checker${RESET}`);
  console.log(`${BOLD}═══════════════════════════════════════════════════════════${RESET}`);
  console.log(`  Target: ${CYAN}${baseUrl}${RESET}`);
  console.log(`  Time:   ${new Date().toISOString()}\n`);

  let totalChecked = 0;
  let totalOk = 0;
  let totalBroken = 0;
  const brokenLinks = [];

  // ── Step 1: Fetch sitemap ────────────────────────────────────────────────

  console.log(`${BOLD}── Sitemap URLs ────────────────────────────────────────────${RESET}\n`);

  let sitemapUrls;
  try {
    sitemapUrls = await fetchSitemapUrls(`${baseUrl}/sitemap.xml`);
  } catch (err) {
    console.error(`  ${RED}✗ Failed to fetch sitemap: ${err.message}${RESET}`);
    console.error(`  ${YELLOW}Falling back to checking the base URL only.${RESET}\n`);
    sitemapUrls = [baseUrl];
  }

  if (sitemapUrls.length === 0) {
    console.error(`  ${RED}No URLs found in sitemap.${RESET}\n`);
    process.exit(1);
  }

  console.log(`  Found ${sitemapUrls.length} URL(s) in sitemap.\n`);

  // ── Step 2: Check sitemap URLs ───────────────────────────────────────────

  console.log(`${BOLD}── Checking Sitemap URLs ───────────────────────────────────${RESET}\n`);

  for (const url of sitemapUrls) {
    totalChecked++;
    const result = await checkUrl(url);

    if (result.ok) {
      totalOk++;
      console.log(`  ${GREEN}✓${RESET} ${result.status}  ${url}`);
    } else {
      totalBroken++;
      const reason = result.error || `HTTP ${result.status}`;
      brokenLinks.push({ url, reason, source: 'sitemap' });
      console.log(`  ${RED}✗${RESET} ${reason}  ${url}`);
    }
  }

  // ── Step 3: Crawl pages for additional links ────────────────────────────

  console.log(`\n${BOLD}── Crawling Pages for Links ───────────────────────────────${RESET}\n`);

  const checkedUrls = new Set(sitemapUrls);
  const allFoundLinks = new Set();

  // Collect links from each sitemap page
  for (const pageUrl of sitemapUrls) {
    try {
      const response = await fetch(pageUrl, {
        headers: { 'User-Agent': 'LinkChecker-Bot/1.0' },
        redirect: 'follow',
      });

      if (!response.ok) continue; // Already reported above

      const html = await response.text();
      const links = extractLinks(html, pageUrl);

      for (const link of links) {
        if (!checkedUrls.has(link)) {
          allFoundLinks.add(link);
        }
      }
    } catch {
      // Skip pages we can't fetch — already reported
    }
  }

  const newLinks = [...allFoundLinks];
  console.log(`  Found ${newLinks.length} additional unique link(s) across all pages.\n`);

  if (newLinks.length > 0) {
    console.log(`${BOLD}── Checking Discovered Links ───────────────────────────────${RESET}\n`);

    // Limit to reasonable number to avoid excessive requests
    const maxLinks = 200;
    const linksToCheck = newLinks.slice(0, maxLinks);

    if (newLinks.length > maxLinks) {
      console.log(`  ${YELLOW}⚠ Checking first ${maxLinks} of ${newLinks.length} links (limit).${RESET}\n`);
    }

    for (const url of linksToCheck) {
      totalChecked++;
      checkedUrls.add(url);
      const result = await checkUrl(url);

      if (result.ok) {
        totalOk++;
        console.log(`  ${GREEN}✓${RESET} ${result.status}  ${url}`);
      } else {
        totalBroken++;
        const reason = result.error || `HTTP ${result.status}`;
        brokenLinks.push({ url, reason, source: 'page-link' });
        console.log(`  ${RED}✗${RESET} ${reason}  ${url}`);
      }
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────

  console.log(`\n${BOLD}═══════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  Summary${RESET}`);
  console.log(`${BOLD}═══════════════════════════════════════════════════════════${RESET}`);
  console.log(`  Total links checked:  ${totalChecked}`);
  console.log(`  ${GREEN}Healthy: ${totalOk}${RESET}`);
  console.log(`  ${RED}Broken:  ${totalBroken}${RESET}`);

  if (brokenLinks.length > 0) {
    console.log(`\n${BOLD}  Broken Links:${RESET}`);
    brokenLinks.forEach(({ url, reason, source }, i) => {
      console.log(`  ${RED}${i + 1}.${RESET} [${source}] ${reason} — ${url}`);
    });
  }

  console.log(`\n${totalBroken === 0 ? GREEN + BOLD : RED + BOLD}  Result: ${totalBroken === 0 ? 'ALL LINKS HEALTHY ✅' : 'BROKEN LINKS FOUND ❌'}${RESET}\n`);

  process.exit(totalBroken > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(`${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
