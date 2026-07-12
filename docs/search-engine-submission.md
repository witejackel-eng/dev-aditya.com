# Search Engine Submission Guide

A step-by-step checklist for getting `dev-aditya.com` indexed by Google and Bing. This is not a guarantee of rankings — it only ensures search engines can discover and crawl your pages.

## Prerequisites

- The custom domain `dev-aditya.com` is resolving and serving the site over HTTPS.
- `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true` is set in production.
- The sitemap at `https://dev-aditya.com/sitemap.xml` lists all canonical URLs.

---

## Step 1: Confirm Canonical Domain

Ensure all SEO signals consistently point to the canonical domain:

```bash
# Check canonical tag
curl -s https://dev-aditya.com | grep 'rel="canonical"'

# Check sitemap
curl -s https://dev-aditya.com/sitemap.xml | head -20

# Check robots.txt
curl -s https://dev-aditya.com/robots.txt
```

All URLs should use `https://dev-aditya.com` — not `www.dev-aditya.com`, not the Vercel deployment URL.

If they don't, see `docs/domain-canonicalization.md`.

---

## Step 2: Verify Google Search Console Domain Property

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add a **Domain property** for `dev-aditya.com` (this covers all subdomains and both HTTP/HTTPS).
3. Google will ask you to verify ownership via a **DNS TXT record**.

### DNS Verification

Google will give you a TXT record like:

| Type | Name | Value |
|---|---|---|
| TXT | `@` | `google-site-verification=XXXXXXXXXX` |

Add this at your domain registrar, then click **Verify** in GSC.

### Meta Tag Verification (Alternative)

If DNS verification is difficult, you can use the meta tag method. Set the environment variable:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=XXXXXXXXXX
```

This is already wired into the layout — the `<meta name="google-site-verification">` tag will be added automatically when this env var is set (see `src/app/layout.tsx`).

Add this env var in Vercel → Settings → Environment Variables and redeploy.

---

## Step 3: Submit Sitemap to Google

1. In Google Search Console, go to **Sitemaps**.
2. Enter `sitemap.xml` (relative to the domain root).
3. Click **Submit**.
4. Wait for the status to change from "Pending" to "Success". This can take hours to days.

You can also notify Google directly:

```bash
# Ping Google with the sitemap URL
curl "https://www.google.com/ping?sitemap=https://dev-aditya.com/sitemap.xml"
```

---

## Step 4: Inspect Homepage URL in GSC

1. In Google Search Console, use the **URL Inspection** tool (top of the page).
2. Enter `https://dev-aditya.com/`.
3. Click **Test Live URL** — this requests Google to fetch and render the page.
4. If the test passes, click **Request Indexing**.

This is the most effective way to get Google to crawl a specific page quickly.

---

## Step 5: Inspect All Service and Case-Study URLs

Repeat the URL Inspection + Request Indexing flow for key pages:

**Service pages:**
- `https://dev-aditya.com/services`
- `https://dev-aditya.com/services/business-websites`
- `https://dev-aditya.com/services/website-redesign`
- `https://dev-aditya.com/services/landing-page-design`
- `https://dev-aditya.com/services/ecommerce-development`
- `https://dev-aditya.com/services/nextjs-development`
- `https://dev-aditya.com/services/interactive-websites`

**Case-study pages:**
- `https://dev-aditya.com/work/saffron-steam-experience`
- `https://dev-aditya.com/work/corporate-leadgen-platform`
- `https://dev-aditya.com/work/driftwear-ecommerce`
- `https://dev-aditya.com/work/real-estate-atelier`

**Local page:**
- `https://dev-aditya.com/web-designer-delhi`

**Resource pages:**
- `https://dev-aditya.com/resources/portfolio-checklist`
- `https://dev-aditya.com/resources/frontend-qa`
- `https://dev-aditya.com/resources/ai-website-agency`
- `https://dev-aditya.com/resources/website-cost-india`
- `https://dev-aditya.com/resources/nextjs-vs-wordpress`
- `https://dev-aditya.com/resources/website-redesign-checklist`
- `https://dev-aditya.com/resources/choose-freelance-web-designer-india`

> **Note**: Google may not index all pages immediately. Requesting indexing adds them to the crawl queue — it doesn't guarantee they'll be indexed.

---

## Step 6: Verify Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Add your site: `https://dev-aditya.com`.
3. Verify ownership. Options:
   - **DNS TXT record** (similar to Google)
   - **Meta tag** — set the `NEXT_PUBLIC_BING_SITE_VERIFICATION` env var:

```bash
NEXT_PUBLIC_BING_SITE_VERIFICATION=XXXXXXXXXX
```

This is wired into the layout via the `<meta name="msvalidate.01">` tag (see `src/app/layout.tsx`).

4. Add the env var in Vercel → Settings → Environment Variables and redeploy.

---

## Step 7: Submit Sitemap to Bing

1. In Bing Webmaster Tools, go to **Sitemaps**.
2. Submit `https://dev-aditya.com/sitemap.xml`.
3. Bing also supports direct sitemap ping:

```bash
curl "https://www.bing.com/ping?sitemap=https://dev-aditya.com/sitemap.xml"
```

---

## Step 8: Configure IndexNow

IndexNow is a protocol that notifies Bing, Yandex, and other participating engines about new or updated content instantly.

See `docs/indexnow-setup.md` for the full guide, but in short:

1. Generate a key:
   ```bash
   openssl rand -hex 16
   ```

2. Set the env var:
   ```bash
   NEXT_PUBLIC_INDEXNOW_KEY=<your-key>
   ```

3. Verify the key route works:
   ```bash
   curl -s https://dev-aditya.com/api/indexnow/<your-key>
   # Should return the key as plain text
   ```

4. Submit URLs:
   ```bash
   INDEXNOW_KEY=<your-key> node scripts/submit-indexnow.mjs
   ```

> **Reminder**: IndexNow does NOT notify Google. It only affects Bing, Yandex, Seznam, and Naver.

---

## Step 9: Review Crawl Errors

After submitting the sitemap and waiting 24–48 hours:

### Google Search Console

1. Go to **Pages** (under the Index section) to see which pages are indexed and which aren't.
2. Check **Crawl Stats** for any server errors or redirect issues.
3. Look at **Page Experience** for Core Web Vitals data.

### Bing Webmaster Tools

1. Check **Page Insights** for crawl errors.
2. Review **URL Inspection** for specific pages.
3. Look at **Crawl Information** for any 404s or 5xx errors.

### Common Issues

| Issue | Fix |
|---|---|
| Pages not indexed | Request indexing via URL Inspection; check for noindex tags |
| 404 errors in crawl | Verify all sitemap URLs return 200; remove old URLs |
| Redirect chains | Ensure no double-redirects (e.g., http→https→www→non-www) |
| Soft 404s | Ensure error pages return proper 404 status codes |
| Canonical conflicts | Verify `rel="canonical"` matches the sitemap URL |

---

## Step 10: Check Indexing After Changes

After making SEO changes or submitting new content, wait at least 3–7 days and then:

1. In Google Search Console → **Pages**, check the index coverage.
2. Use the `site:` operator to spot-check:
   ```
   site:dev-aditya.com
   site:dev-aditya.com/services
   ```
3. In Bing, use:
   ```
   site:dev-aditya.com
   ```

These operators show roughly how many pages are indexed. They're not perfectly accurate, but they give a directional sense.

> **Honest note**: There is no way to force Google to index a page. You can only submit it and make it easy to find. Some pages may never be indexed if Google determines they don't provide unique value.

---

## Step 11: Review Core Web Vitals

Core Web Vitals are a ranking factor for Google. They measure real-world user experience:

| Metric | What it measures | Good | Needs improvement | Poor |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | Loading performance | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | Interactivity | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | ≤ 0.1 | ≤ 0.25 | > 0.25 |

### How to Check

1. **Google Search Console** → **Page Experience** → **Core Web Vitals** — shows real-user data from Chrome.
2. **PageSpeed Insights** — [pagespeed.web.dev](https://pagespeed.web.dev/) — run lab tests for specific URLs.
3. **Chrome DevTools** → **Lighthouse** — local performance audit.

### Common Fixes for This Site

- **LCP**: Ensure the hero image is optimized (WebP, proper sizing, priority loading).
- **INP**: Avoid heavy JavaScript on interactive elements; defer non-critical scripts.
- **CLS**: Set explicit dimensions on images and fonts; avoid layout-shifting ads or dynamic content.

---

## Step 12: Monitor Search Queries

Once pages are indexed and appearing in search results:

### Google Search Console → **Search Results**

- **Queries**: What search terms lead users to your site.
- **Pages**: Which pages get the most impressions/clicks.
- **Countries**: Where your audience is located.
- **CTR**: Click-through rate — are people clicking your result when they see it?

### Bing Webmaster Tools → **Search Performance**

- Similar data for Bing specifically.

### What to Look For

- **Low CTR on high-impression queries**: Improve title tags and meta descriptions.
- **Impressions but no clicks**: Your result may be too low on the page; consider improving content depth or getting backlinks.
- **Unexpected queries**: You may be ranking for terms you didn't target — this can inform content strategy.
- **No impressions at all**: The page may not be indexed or may be competing with very strong sites.

### Monitoring Frequency

- Check weekly during the first month after launch.
- Check monthly after that.
- Set up email alerts in GSC for critical issues (crawl errors, manual actions, security issues).

---

## Environment Variables Summary

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical production origin | `https://dev-aditya.com` |
| `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE` | Switch canonical URLs to custom domain | `true` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | GSC meta tag verification code | `abc123XYZ` |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing meta tag verification code | `def456UVW` |
| `NEXT_PUBLIC_INDEXNOW_KEY` | IndexNow API key for instant submission | `a1b2c3d4e5f6...` |

All `NEXT_PUBLIC_` variables must be set in both `.env.local` (for local dev) and in Vercel's environment variables (for production). Redeploy after changing any of these.

---

## Quick Launch Checklist

- [ ] Custom domain `dev-aditya.com` resolves and serves the site over HTTPS
- [ ] `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true` set in Vercel
- [ ] `rel="canonical"` tags use `https://dev-aditya.com`
- [ ] Sitemap uses `https://dev-aditya.com` URLs
- [ ] `robots.txt` references the correct sitemap
- [ ] Google Search Console domain property verified
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` set and meta tag present
- [ ] Sitemap submitted to Google
- [ ] Homepage URL inspected and indexing requested in GSC
- [ ] Key pages (services, case studies, local page) inspected in GSC
- [ ] Bing Webmaster Tools site verified
- [ ] `NEXT_PUBLIC_BING_SITE_VERIFICATION` set and meta tag present
- [ ] Sitemap submitted to Bing
- [ ] IndexNow key generated and `NEXT_PUBLIC_INDEXNOW_KEY` set
- [ ] IndexNow key verification route working
- [ ] IndexNow submission script run successfully
- [ ] No crawl errors in GSC or Bing Webmaster Tools
- [ ] Core Web Vitals passing (LCP, INP, CLS)
- [ ] Search performance monitoring set up

> **No guarantees**: Following this guide ensures search engines can find and crawl your site. It does not guarantee rankings, traffic, or indexing of every page. SEO is an ongoing process — continue to create useful content, fix technical issues, and monitor performance over time.
