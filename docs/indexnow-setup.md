# IndexNow Setup Guide

## What Is IndexNow?

IndexNow is an open protocol that lets website owners instantly notify search engines about content changes. Instead of waiting for crawlers to discover updates on their own, you proactively tell them — and they can fetch the changed pages within seconds or minutes, rather than days or weeks.

### Which Search Engines Support IndexNow?

| Search Engine | Supports IndexNow | Notes |
|---|---|---|
| **Microsoft Bing** | ✅ Yes | Primary adopter; natively integrated into Bing Webmaster Tools |
| **Yandex** | ✅ Yes | Co-creator of the protocol |
| **Seznam** | ✅ Yes | Czech search engine |
| **Naver** | ✅ Yes | Korean search engine |
| **Google** | ❌ No | Google has **not** adopted IndexNow. Google discovers content through its own crawling pipeline and sitemaps. Submitting via IndexNow will NOT affect Google indexing. |

> **Important**: IndexNow does NOT control Google indexing. If you want Google to discover your pages faster, submit your sitemap in Google Search Console and request indexing through the URL Inspection tool.

## How It Works

1. You generate an API key (a random string).
2. You host that key at a well-known URL on your domain so search engines can verify you own the site.
3. When you publish or update content, you send a POST request to the IndexNow API with a list of changed URLs.
4. Participating search engines verify the key, then schedule crawls for those URLs.

## Step-by-Step Setup

### 1. Generate an IndexNow Key

The key must be at least 8 characters and can contain hexadecimal characters (`a-f`, `0-9`) or any alphanumeric characters. The simplest way:

```bash
# Generate a 32-character hex key
openssl rand -hex 16
```

Example output: `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6`

Save this key — you'll need it in two places.

### 2. Set the Environment Variable

Add the key to your `.env.local` file (and to your Vercel project environment variables for production):

```bash
# .env.local
NEXT_PUBLIC_INDEXNOW_KEY=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
```

The `NEXT_PUBLIC_` prefix is required because the key verification route (`/api/indexnow/[key]`) reads it at request time via `process.env.NEXT_PUBLIC_INDEXNOW_KEY`.

**For Vercel production deployment:**

1. Go to your Vercel project dashboard → Settings → Environment Variables.
2. Add `NEXT_PUBLIC_INDEXNOW_KEY` with your generated key.
3. Redeploy for the variable to take effect.

### 3. Verify the Key Route

Once deployed, the key should be accessible at:

```
https://dev-aditya.com/api/indexnow/<your-key>
```

It must return **exactly** the key as plain text — nothing else, no HTML wrapper, no quotes.

Test it:

```bash
curl -s https://dev-aditya.com/api/indexnow/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
# Expected output: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
```

If you get a 404, the env var is not set or doesn't match. If you get HTML, something is wrong with the route.

### 4. Run the Submission Script

The project includes a ready-made script at `scripts/submit-indexnow.mjs` that:

- Reads the sitemap from your production domain
- Filters out localhost and preview URLs
- Submits all canonical URLs to the IndexNow API
- Prints a clear success/failure report

**Run it:**

```bash
INDEXNOW_KEY=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6 node scripts/submit-indexnow.mjs
```

**With a custom sitemap URL:**

```bash
INDEXNOW_KEY=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6 \
  SITEMAP_URL=https://dev-aditya.com/sitemap.xml \
  node scripts/submit-indexnow.mjs
```

**With a custom host:**

```bash
INDEXNOW_KEY=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6 \
  SITE_HOST=dev-aditya.com \
  node scripts/submit-indexnow.mjs
```

### 5. Understand the Response Codes

| Code | Meaning |
|---|---|
| `200` | All URLs submitted successfully |
| `202` | URLs received and pending review |
| `400` | Bad request — check payload format |
| `403` | Key doesn't match key location — verify the `/api/indexnow/<key>` route |
| `422` | URL list doesn't match the host parameter |
| `429` | Rate limited — try again later |

### 6. When to Run the Script

You don't need to run it on every deploy. Good times to submit:

- After launching a new page
- After significantly updating existing content
- After fixing a major SEO issue (title, canonical, etc.)
- After initial site launch

IndexNow search engines share submissions, so submitting to `api.indexnow.org` notifies all participants.

### 7. Automating (Optional)

If you want to automate after deploys, add it as a Vercel build hook or a GitHub Action:

```yaml
# .github/workflows/indexnow.yml
name: Submit to IndexNow
on:
  workflow_dispatch: # manual trigger
jobs:
  submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/submit-indexnow.mjs
        env:
          INDEXNOW_KEY: ${{ secrets.INDEXNOW_KEY }}
          SITE_HOST: dev-aditya.com
```

## Troubleshooting

### "403 Forbidden"

The key at `/api/indexnow/<key>` doesn't match what you submitted. Check:

1. The `NEXT_PUBLIC_INDEXNOW_KEY` env var is set in production.
2. The route returns the exact key string with no extra whitespace.
3. The key in the submission payload matches the one hosted on the site.

### "No URLs found in sitemap"

Your sitemap might be returning empty or erroring. Verify:

```bash
curl -s https://dev-aditya.com/sitemap.xml | head -20
```

### Script says "All URLs were filtered out"

The sitemap contains localhost or Vercel preview URLs instead of the production domain. Make sure `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true` is set so the sitemap generates canonical URLs with `dev-aditya.com`.

## Key Security Notes

- The IndexNow key is **not a secret** in the traditional sense — it must be publicly accessible at the verification URL. Anyone can see it.
- However, only someone who can modify your site's content or run the submission script can submit URLs on your behalf.
- Rotating the key is simple: generate a new one, update the env var, redeploy.
- The `NEXT_PUBLIC_` prefix means the key is embedded in the client bundle. This is intentional and safe for IndexNow — the key is designed to be public.

## References

- [IndexNow Protocol Specification](https://www.indexnow.org/documentation)
- [Bing Webmaster Tools — IndexNow](https://www.bing.com/indexnow)
- [Yandex Webmaster — IndexNow](https://webmaster.yandex.com/docs/indexnow.xml)
