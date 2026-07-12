# Domain Canonicalization

## Canonical Domain Decision

**Canonical domain: `dev-aditya.com` (non-www, HTTPS)**

All canonical URLs, sitemap entries, and `rel="canonical"` tags use `https://dev-aditya.com` as the origin. The `www` subdomain should 301-redirect to the bare domain. There is no technical or SEO reason to use `www` for this site.

## Current State

| Aspect | Value |
|---|---|
| **Canonical origin** | `https://dev-aditya.com` |
| **Vercel deployment URL** | `https://dev-aditya-com.vercel.app` |
| **Custom domain live?** | Controlled by `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE` env var |

Until the custom domain is fully configured and resolving, the site uses the Vercel deployment URL as the effective canonical origin (see `getCanonicalOrigin()` in `src/config/site.ts`).

## Environment Variables

### `NEXT_PUBLIC_SITE_URL`

The canonical production origin. Defaults to `https://dev-aditya.com`.

```bash
NEXT_PUBLIC_SITE_URL=https://dev-aditya.com
```

This is used as the metadata base URL and the default origin for all SEO metadata generation. It should always be set to the canonical domain, regardless of whether the domain is currently live.

### `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE`

A boolean flag (`"true"` or absent) that controls which origin the site actually uses for generated URLs.

```bash
# When the custom domain is resolving and serving the site:
NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true

# When still using the Vercel deployment URL (default):
# NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=   (unset or any value other than "true")
```

**Why this flag exists**: The sitemap, `rel="canonical"` tags, and Open Graph URLs must point to the domain search engines should index. If we point these to `dev-aditya.com` before the domain is resolving, search engines will find broken URLs and may de-index the site. The flag ensures we only emit the canonical domain URLs once the domain is actually working.

**How it works** (in `src/config/site.ts`):

```typescript
export function getCanonicalOrigin(): string {
  return siteConfig.customDomainLive ? siteConfig.url : siteConfig.vercelUrl;
}
```

- When `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true`: returns `https://dev-aditya.com`
- Otherwise: returns `https://dev-aditya-com.vercel.app`

## Steps to Configure Custom Domain in Vercel

### 1. Add the Domain in Vercel

1. Go to your Vercel project dashboard → **Settings** → **Domains**.
2. Enter `dev-aditya.com` and click **Add**.
3. Vercel will also suggest adding `www.dev-aditya.com` — add it as a redirect.

### 2. Configure DNS

At your domain registrar (where you purchased `dev-aditya.com`), configure the following DNS records:

#### Option A: A Record (recommended for apex domain)

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `76.76.21.21` | 3600 |

#### Option B: CNAME (if your registrar supports CNAME flattening)

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `@` | `cname.vercel-dns.com` | 3600 |

#### For `www` subdomain (redirect target)

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `www` | `cname.vercel-dns.com` | 3600 |

> **Note**: Some registrars don't allow CNAME records on the apex domain (`@`). In that case, use the A record option. The IP `76.76.21.21` is Vercel's current apex IP — verify this in Vercel's domain setup instructions, as it may change.

### 3. Wait for DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate. You can check progress with:

```bash
dig dev-aditya.com
# or
nslookup dev-aditya.com
```

Vercel will also show the domain status in the dashboard. Wait until it shows **Valid Configuration**.

### 4. Enable the Custom Domain Flag

Once the domain is resolving and serving the site correctly:

1. In Vercel → Settings → Environment Variables, set:
   ```
   NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true
   ```
2. Redeploy the site.

3. Verify that canonical URLs now use `https://dev-aditya.com`:
   ```bash
   curl -s https://dev-aditya.com | grep 'rel="canonical"'
   # Should show: <link rel="canonical" href="https://dev-aditya.com/"/>
   ```

## Redirect Strategy

### HTTP → HTTPS

Vercel handles this automatically. All HTTP requests are 301-redirected to HTTPS. No configuration needed.

### www → non-www

When you add `www.dev-aditya.com` in Vercel's domain settings, you can set it to redirect to `dev-aditya.com`:

1. In Vercel → Settings → Domains, add `www.dev-aditya.com`.
2. Vercel will ask how to handle it — choose **Redirect to `dev-aditya.com`**.

Vercel handles this with a 301 redirect automatically. No additional middleware needed.

### Vercel Deployment URL → Custom Domain

The Vercel deployment URL (`dev-aditya-com.vercel.app`) will continue to work after the custom domain is configured. This is fine — as long as:

1. **Canonical tags point to the custom domain** (handled by `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true`).
2. **The sitemap uses the custom domain** (handled by `getCanonicalOrigin()`).
3. **Search engines are told the canonical URL** via `rel="canonical"`, sitemap, and Google Search Console.

Google will consolidate signals to the canonical URL even if it discovers the Vercel URL first.

**Do NOT** try to redirect the Vercel deployment URL to the custom domain. The deployment URL is needed for:
- Vercel preview deploys
- Rollback scenarios
- Internal build checks

### ⚠️ Do NOT Deploy Redirects to Custom Domain If It's Not Resolving

This is critical. If you set `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true` before `dev-aditya.com` actually resolves to your Vercel deployment:

- The sitemap will list URLs at `dev-aditya.com` that return NXDOMAIN or a registrar parking page.
- Search engines crawling the sitemap will find broken URLs.
- Google may flag the site as unreliable or de-index pages.
- Bing may do the same.

**Always verify the domain resolves before enabling the flag:**

```bash
curl -I https://dev-aditya.com
# Should return HTTP 200 with your site's content, not a DNS error.
```

## Verification Checklist

After configuring the custom domain:

- [ ] `https://dev-aditya.com` loads the site (HTTP 200)
- [ ] `http://dev-aditya.com` redirects to HTTPS (301 → 200)
- [ ] `https://www.dev-aditya.com` redirects to `https://dev-aditya.com` (301)
- [ ] `rel="canonical"` tags use `https://dev-aditya.com`
- [ ] Sitemap at `https://dev-aditya.com/sitemap.xml` uses `https://dev-aditya.com` URLs
- [ ] `robots.txt` at `https://dev-aditya.com/robots.txt` references the correct sitemap
- [ ] Open Graph / Twitter meta tags use `https://dev-aditya.com`
- [ ] `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true` is set in Vercel production env vars
- [ ] Google Search Console property added for `dev-aditya.com`
- [ ] Bing Webmaster Tools property added for `dev-aditya.com`
