#!/usr/bin/env node

/**
 * IndexNow Submission Script
 *
 * Submits canonical URLs to the IndexNow API so that participating search
 * engines (Bing, Yandex, Seznam, Naver) can discover updated pages faster.
 *
 * Usage:
 *   INDEXNOW_KEY=your-key node scripts/submit-indexnow.mjs
 *   INDEXNOW_KEY=your-key node scripts/submit-indexnow.mjs --sitemap https://dev-aditya.com/sitemap.xml
 *
 * Environment variables:
 *   INDEXNOW_KEY          — Required. Your IndexNow API key (min 8 chars, hex or alphanum).
 *   SITE_HOST             — Optional. Host to submit for (default: dev-aditya.com).
 *   SITEMAP_URL           — Optional. Full URL to sitemap.xml (default: https://<SITE_HOST>/sitemap.xml).
 */

const INDEXNOW_API = 'https://api.indexnow.org/indexnow';
const DEFAULT_HOST = 'dev-aditya.com';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fail(message) {
  console.error(`❌  ${message}`);
  process.exit(1);
}

function isLocalhost(url) {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.vercel.app') ||
      hostname.includes('localhost')
    );
  } catch {
    return true;
  }
}

/**
 * Fetch and parse a sitemap.xml, returning an array of URL strings.
 * Handles simple <url><loc>…</loc></url> structures. Does NOT handle
 * sitemap indexes recursively — point at a final sitemap.
 */
async function fetchSitemapUrls(sitemapUrl) {
  console.log(`📡  Fetching sitemap: ${sitemapUrl}`);

  const response = await fetch(sitemapUrl, {
    headers: { 'Accept': 'application/xml, text/xml' },
  });

  if (!response.ok) {
    fail(`Sitemap fetch failed (HTTP ${response.status}): ${sitemapUrl}`);
  }

  const text = await response.text();

  // Basic XML parsing — extract all <loc> values
  const locRegex = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  const urls = [];
  let match;

  while ((match = locRegex.exec(text)) !== null) {
    urls.push(match[1].trim());
  }

  return urls;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    fail(
      'INDEXNOW_KEY environment variable is not set.\n' +
        '  Generate a key (e.g. openssl rand -hex 16) and set it before running this script.'
    );
  }

  if (key.length < 8) {
    fail('INDEXNOW_KEY must be at least 8 characters long.');
  }

  const host = process.env.SITE_HOST || DEFAULT_HOST;
  const sitemapUrl =
    process.env.SITEMAP_URL || `https://${host}/sitemap.xml`;

  console.log(`\n🚀  IndexNow Submission`);
  console.log(`   Host:    ${host}`);
  console.log(`   Key:     ${key.slice(0, 4)}${'*'.repeat(key.length - 4)}`);
  console.log(`   Sitemap: ${sitemapUrl}\n`);

  // ── Step 1: Collect URLs ─────────────────────────────────────────────────

  let urls;

  try {
    urls = await fetchSitemapUrls(sitemapUrl);
  } catch (err) {
    fail(`Failed to fetch sitemap: ${err.message}`);
  }

  if (urls.length === 0) {
    fail('No URLs found in sitemap. Nothing to submit.');
  }

  // ── Step 2: Filter out localhost / preview URLs ──────────────────────────

  const filtered = urls.filter((url) => {
    if (isLocalhost(url)) {
      console.warn(`   ⚠  Skipping non-production URL: ${url}`);
      return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    fail('All URLs were filtered out (localhost/preview). Nothing to submit.');
  }

  console.log(`   Found ${urls.length} URLs, ${filtered.length} after filtering.\n`);

  // ── Step 3: Submit to IndexNow ───────────────────────────────────────────

  const payload = {
    host,
    key,
    keyLocation: `https://${host}/api/indexnow/${key}`,
    urlList: filtered,
  };

  console.log(`   Submitting ${filtered.length} URL(s) to IndexNow…\n`);

  let response;
  try {
    response = await fetch(INDEXNOW_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    fail(`Network error submitting to IndexNow: ${err.message}`);
  }

  // ── Step 4: Report result ────────────────────────────────────────────────

  const status = response.status;
  const statusText = response.statusText;

  // IndexNow API status codes:
  // 200 — All URLs submitted successfully
  // 202 — URLs received and pending review
  // 400 — Bad request (invalid format)
  // 403 — Invalid key (key doesn't match keyLocation)
  // 422 — URL list doesn't match host
  // 429 — Too many requests (rate limited)

  const statusMessages = {
    200: 'All URLs submitted successfully.',
    202: 'URLs received and pending review by search engines.',
    400: 'Bad request — check the payload format.',
    403: 'Forbidden — the key does not match the key location URL. Make sure /api/indexnow/<key> returns the key as plain text.',
    422: 'Unprocessable — URL list does not match the host.',
    429: 'Rate limited — too many requests. Try again later.',
  };

  const message = statusMessages[status] || `Unexpected response.`;

  if (status >= 200 && status < 300) {
    console.log(`✅  ${status} ${statusText} — ${message}`);
    console.log(`\n   Submitted URLs:`);
    filtered.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));
  } else {
    console.error(`❌  ${status} ${statusText} — ${message}`);
    if (status === 403) {
      console.error(
        '\n   💡  Verify that https://' +
          host +
          '/api/indexnow/' +
          key +
          ' returns exactly the key as plain text.'
      );
    }
    process.exit(1);
  }

  console.log(`\n🏁  Done. ${filtered.length} URL(s) submitted.\n`);
}

main().catch((err) => {
  fail(`Unhandled error: ${err.message}`);
});
