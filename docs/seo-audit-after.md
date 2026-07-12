# SEO Post-Implementation Audit

**Date:** 2026-07-12  
**Repository:** https://github.com/witejackel-eng/dev-aditya.com  
**Live deployment:** https://dev-aditya-com.vercel.app  
**Intended canonical domain:** https://dev-aditya.com

---

## Summary

This document records what changed after the SEO audit documented in `seo-audit-before.md`. Every critical and high-priority issue has been addressed. Some medium/low items remain and are noted explicitly.

---

## All Files Changed

### New files created

| File | Purpose |
|---|---|
| `src/config/site.ts` | Centralized site configuration — canonical URL, owner identity, brand colors, verification env vars |
| `src/config/content-registry.ts` | Centralized route registry — metadata, dates, priorities, types, parent paths |
| `src/lib/seo.ts` | Reusable `generatePageMetadata()` and `generateBreadcrumbs()` helpers |
| `src/lib/schema.ts` | Structured data graph utilities — Person, WebSite, WebPage, ProfilePage, Service, OfferCatalog, CreativeWork, Article, ContactPage, BreadcrumbList |
| `src/components/seo/JsonLd.tsx` | Generic `<script type="application/ld+json">` renderer |
| `src/app/HomeContent.tsx` | Client component extracted from homepage (Framer Motion animations) |
| `src/app/services/page.tsx` | Services hub page (server component) |
| `src/app/services/ServicesContent.tsx` | Services hub client component |
| `src/app/services/business-websites/page.tsx` | Business Websites service page |
| `src/app/services/business-websites/Content.tsx` | Business Websites client component |
| `src/app/services/website-redesign/page.tsx` | Website Redesign service page |
| `src/app/services/website-redesign/Content.tsx` | Website Redesign client component |
| `src/app/services/landing-page-design/page.tsx` | Landing Page Design service page |
| `src/app/services/landing-page-design/Content.tsx` | Landing Page Design client component |
| `src/app/services/ecommerce-development/page.tsx` | E-commerce Development service page |
| `src/app/services/ecommerce-development/Content.tsx` | E-commerce Development client component |
| `src/app/services/nextjs-development/page.tsx` | Next.js Development service page |
| `src/app/services/nextjs-development/Content.tsx` | Next.js Development client component |
| `src/app/services/interactive-websites/page.tsx` | Interactive Websites service page |
| `src/app/services/interactive-websites/Content.tsx` | Interactive Websites client component |
| `src/app/web-designer-delhi/page.tsx` | Local/geo-targeted page — "Web Designer in Delhi" |
| `src/app/web-designer-delhi/Content.tsx` | Web Designer Delhi client component |
| `src/app/resources/website-cost-india/page.tsx` | "How Much Does a Website Cost in India?" resource article |
| `src/app/resources/website-cost-india/Content.tsx` | Website Cost India article content |
| `src/app/resources/nextjs-vs-wordpress/page.tsx` | "Next.js vs WordPress" resource article |
| `src/app/resources/nextjs-vs-wordpress/Content.tsx` | Next.js vs WordPress article content |
| `src/app/resources/website-redesign-checklist/page.tsx` | "Website Redesign Checklist" resource article |
| `src/app/resources/website-redesign-checklist/Content.tsx` | Redesign Checklist article content |
| `src/app/resources/choose-freelance-web-designer-india/page.tsx` | "How to Choose a Freelance Web Designer in India" resource article |
| `src/app/resources/choose-freelance-web-designer-india/Content.tsx` | Choose Freelance Designer article content |
| `src/app/api/llms-txt/route.ts` | `/api/llms-txt` — generates llms.txt for AI consumers |
| `src/app/api/feed-xml/route.ts` | `/api/feed-xml` — generates Atom 1.0 feed for RSS readers |
| `src/app/api/indexnow/[key]/route.ts` | IndexNow key verification route |
| `src/app/opengraph-image.tsx` | Dynamic OG image generation (edge runtime) |
| `src/app/twitter-image.tsx` | Dynamic Twitter image generation (edge runtime) |
| `src/components/SmoothScroll.tsx` | Lenis smooth scroll (client component) |
| `scripts/submit-indexnow.mjs` | IndexNow URL submission script |
| `docs/seo-audit-before.md` | Pre-implementation audit |
| `docs/domain-canonicalization.md` | Domain canonicalization strategy |
| `docs/search-engine-submission.md` | Search engine submission guide |
| `docs/indexnow-setup.md` | IndexNow setup guide |

### Modified files

| File | What changed |
|---|---|
| `src/app/page.tsx` | Refactored from `'use client'` to server component; metadata exported via `generatePageMetadata()`; WebPage schema added; content extracted to `HomeContent.tsx` |
| `src/app/layout.tsx` | Root metadata centralized via `siteConfig`; Person + WebSite + ProfilePage schema graph; Google/Bing verification meta tags conditional on env vars; skip-to-content link added; viewport exported separately; `metadataBase` set to canonical origin |
| `src/app/sitemap.ts` | Reads from `content-registry.ts` instead of hardcoded array; uses `getCanonicalOrigin()` for URL generation |
| `src/app/robots.ts` | Explicit allow rules for Googlebot, Bingbot, OAI-SearchBot, GPTBot, ChatGPT-User, PerplexityBot; sitemap URL uses `getCanonicalOrigin()` |
| `src/app/manifest.ts` | Values from `siteConfig` |
| `src/app/work/page.tsx` | Metadata via `generatePageMetadata()` |
| `src/app/packages/page.tsx` | Metadata via `generatePageMetadata()`; OfferCatalog schema added |
| `src/app/about/page.tsx` | Metadata via `generatePageMetadata()`; WebPage schema added |
| `src/app/contact/page.tsx` | Metadata via `generatePageMetadata()`; ContactPage schema added |
| `src/app/mentoring/page.tsx` | Metadata via `generatePageMetadata()`; WebPage + Service schema added |
| `src/app/resources/page.tsx` | Metadata via `generatePageMetadata()`; WebPage schema added |
| `src/app/resources/portfolio-checklist/page.tsx` | Metadata via `generatePageMetadata()` (article type); Article + BreadcrumbList schema; visible breadcrumb nav; author + date display |
| `src/app/resources/frontend-qa/page.tsx` | Metadata via `generatePageMetadata()` (article type); Article + BreadcrumbList schema; visible breadcrumb nav |
| `src/app/resources/ai-website-agency/page.tsx` | Metadata via `generatePageMetadata()` (article type); Article + BreadcrumbList schema; visible breadcrumb nav |
| `src/app/work/saffron-steam-experience/page.tsx` | Metadata via `generatePageMetadata()` (article type); CreativeWork + BreadcrumbList schema |
| `src/app/work/corporate-leadgen-platform/page.tsx` | Metadata via `generatePageMetadata()` (article type); CreativeWork + BreadcrumbList schema |
| `src/app/work/driftwear-ecommerce/page.tsx` | Metadata via `generatePageMetadata()` (article type); CreativeWork + BreadcrumbList schema |
| `src/app/work/real-estate-atelier/page.tsx` | Metadata via `generatePageMetadata()` (article type); CreativeWork + BreadcrumbList schema |
| `src/app/privacy/page.tsx` | Metadata via `generatePageMetadata()` |
| `src/app/terms/page.tsx` | Metadata via `generatePageMetadata()` |
| `src/app/accessibility/page.tsx` | Metadata via `generatePageMetadata()` |
| `src/components/Header.tsx` | Added Services link to main nav |
| `src/components/Footer.tsx` | Added Services link to page links; added project links section |
| `next.config.ts` | Added `poweredByHeader: false`, `trailingSlash: false`, `compress: true`; image optimization (avif/webp, remote patterns); rewrites for `/llms.txt` and `/feed.xml`; security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy); long-lived cache for static assets and fonts |

---

## All Routes Added

### Service pages

| Route | Type |
|---|---|
| `/services` | Service hub |
| `/services/business-websites` | Service page |
| `/services/website-redesign` | Service page |
| `/services/landing-page-design` | Service page |
| `/services/ecommerce-development` | Service page |
| `/services/nextjs-development` | Service page |
| `/services/interactive-websites` | Service page |

### Local page

| Route | Type |
|---|---|
| `/web-designer-delhi` | Local/geo-targeted page |

### Resource articles

| Route | Type |
|---|---|
| `/resources/website-cost-india` | Resource article |
| `/resources/nextjs-vs-wordpress` | Resource article |
| `/resources/website-redesign-checklist` | Resource article |
| `/resources/choose-freelance-web-designer-india` | Resource article |

### API routes

| Route | Type |
|---|---|
| `/api/llms-txt` | Generates llms.txt (served at `/llms.txt` via rewrite) |
| `/api/feed-xml` | Generates Atom feed (served at `/feed.xml` via rewrite) |
| `/api/indexnow/[key]` | IndexNow key verification |
| `/api/contact` | Contact form handler (honeypot anti-spam) |

---

## Redirects Added

**None.** No 301/302 redirects have been configured in `next.config.ts` redirects.

### Rewrite rules configured

| Source | Destination | Purpose |
|---|---|---|
| `/llms.txt` | `/api/llms-txt` | App Router doesn't allow dots in directory names; rewrite serves llms.txt at the conventional root path |
| `/feed.xml` | `/api/feed-xml` | Same reason; serves Atom feed at `/feed.xml` |

### Domain-level redirects (handled by Vercel, not in code)

| From | To | Type | Notes |
|---|---|---|---|
| `http://dev-aditya.com` | `https://dev-aditya.com` | 301 | Automatic on Vercel |
| `https://www.dev-aditya.com` | `https://dev-aditya.com` | 301 | Must be configured in Vercel domain settings (see `docs/domain-canonicalization.md`) |

---

## Metadata Map

Every page now exports metadata through `generatePageMetadata()` with a self-referencing canonical URL.

| Route | Title | Description |
|---|---|---|
| `/` | Web Designer & Next.js Developer in Delhi \| Aditya Singh | Aditya Singh designs and develops fast, premium websites for service businesses, startups and independent brands in Delhi, across India and worldwide. Explore website packages and case studies. |
| `/services` | Web Design & Development Services \| Aditya Singh | Professional web design and development services: business websites, website redesign, landing pages, e-commerce, Next.js applications, and interactive web experiences. Based in Delhi, working worldwide. |
| `/services/business-websites` | Business Website Design & Development \| Aditya Singh | Professional business website design and development for service businesses, startups, and independent professionals. Responsive, SEO-optimized, and built to convert visitors into clients. Based in Delhi, working worldwide. |
| `/services/website-redesign` | Website Redesign Services \| Aditya Singh | Professional website redesign services. Transform your outdated website into a modern, fast, conversion-focused experience. Preserve what works, rebuild what doesn't. Based in Delhi, working worldwide. |
| `/services/landing-page-design` | Landing Page Design & Development \| Aditya Singh | High-conversion landing page design and development for campaigns, product launches, and lead generation. Every element serves the conversion goal. Based in Delhi, working worldwide. |
| `/services/ecommerce-development` | E-commerce Website Development \| Aditya Singh | Professional e-commerce website development with full shopping flows, editorial design, persistent cart state, and payment integration. Based in Delhi, working worldwide. |
| `/services/nextjs-development` | Next.js Website & Application Development \| Aditya Singh | Production-grade Next.js website and application development with server-side rendering, API routes, and modern architecture. Built for speed, SEO, and scale. Based in Delhi, working worldwide. |
| `/services/interactive-websites` | Interactive & Immersive Website Development \| Aditya Singh | Interactive and immersive website development with WebGL, scroll choreography, and motion design. For brands that want more than a static page. Based in Delhi, working worldwide. |
| `/packages` | Website Design Packages & Pricing in India | Transparent website design packages: Starter at ₹14,999, Business at ₹34,999, and Premium at ₹74,999. Clear scope, fixed pricing, professional results. Based in Delhi — working worldwide. |
| `/work` | Web Design & Next.js Case Studies \| Aditya Singh | Selected case studies showcasing business websites, e-commerce builds, interactive experiences, and marketing platforms designed and developed by Aditya Singh with React, Next.js, and TypeScript. |
| `/work/saffron-steam-experience` | Saffron & Steam — Immersive Café Website with WebGL & Editorial Design \| Aditya Singh | Case study: an immersive, motion-led concept café website with a WebGL hero, day-to-night scroll sequences, editorial typography, and an interactive signature-menu rail. |
| `/work/corporate-leadgen-platform` | Corporate Lead-Gen Platform — B2B Marketing Website Case Study \| Aditya Singh | Case study: a polished B2B marketing platform built around modular sections, conversion-focused storytelling, and smooth motion. |
| `/work/driftwear-ecommerce` | Driftwear Studio — Editorial E-commerce Website Case Study \| Aditya Singh | Case study: an editorial e-commerce experience for relaxed clothing with full cart flow, persistent cart state, category filtering, and Razorpay payment integration. |
| `/work/real-estate-atelier` | Real Estate Atelier — Luxury Property Advisory Website Case Study \| Aditya Singh | Case study: a premium real estate advisory website with curated property collections, cinematic editorial design, custom filtering, and immersive property detail pages. |
| `/about` | About Aditya Singh \| Web Designer & Front-End Developer | Aditya Singh is a Delhi-based web designer and front-end developer specializing in premium business websites, Next.js applications, and interactive web experiences. |
| `/contact` | Contact Aditya Singh for a Website Project \| Aditya Singh | Get in touch with Aditya Singh to discuss your website project. Based in Delhi, available for remote work worldwide. Send your project details and get a response within 24 hours. |
| `/web-designer-delhi` | Web Designer in Delhi — Aditya Singh | Aditya Singh is a Delhi-based web designer and front-end developer building premium, fast websites for businesses in Delhi/NCR and worldwide. View case studies, packages, and get in touch. |
| `/mentoring` | Project Help for Frontend Students & Small Businesses \| Aditya Singh | Frontend project help for students, creators, and small businesses. Turn rough ideas, broken layouts, and unfinished projects into something cleaner and ready to show. |
| `/resources` | Resources — Web Design Guides & Checklists \| Aditya Singh | Practical resources for building better websites: portfolio checklists, frontend QA guides, website cost breakdowns, and redesign checklists. Written from real project experience by Aditya Singh. |
| `/resources/portfolio-checklist` | Portfolio Website Checklist \| Aditya Singh | A comprehensive checklist for making a portfolio website look credible, load fast, and convert visitors into clients. Covers strategy, structure, SEO, accessibility, and launch readiness. |
| `/resources/frontend-qa` | Frontend Project QA Checklist \| Aditya Singh | A thorough QA checklist for frontend projects covering responsive design, accessibility, SEO, performance, Core Web Vitals, security headers, structured data, and deployment. |
| `/resources/ai-website-agency` | AI Website Agency Starter Notes \| Aditya Singh | Notes on using AI tools to package website services, automate lead capture, and build chatbots for small businesses. Honest constraints, ethical limits, and practical considerations. |
| `/resources/website-cost-india` | How Much Does a Business Website Cost in India? \| Aditya Singh | A practical, experience-based breakdown of business website costs in India in 2026, from starter single-page sites at ₹15,000 to premium multi-page builds at ₹75,000+. |
| `/resources/nextjs-vs-wordpress` | Next.js vs WordPress: Which Is Better for Your Business Website? \| Aditya Singh | An honest comparison of Next.js and WordPress for business websites in 2026. Covers performance, SEO, customization, content management, maintenance, and when each platform is the right choice. |
| `/resources/website-redesign-checklist` | Website Redesign Checklist for Service Businesses \| Aditya Singh | A complete, experience-based checklist for redesigning a service business website. Covers pre-redesign audits, strategy, content planning, design, development, launch, and post-launch monitoring. |
| `/resources/choose-freelance-web-designer-india` | How to Choose a Freelance Web Designer in India \| Aditya Singh | Practical advice on choosing a freelance web designer in India — what to look for, red flags to avoid, freelancer vs agency comparison, questions to ask, and how to evaluate a portfolio honestly. |
| `/privacy` | Privacy Policy \| Aditya Singh | Privacy policy for the Aditya portfolio website. |
| `/terms` | Terms of Service \| Aditya Singh | Terms of service for the Aditya portfolio website. |
| `/accessibility` | Accessibility Statement \| Aditya Singh | Accessibility statement for the Aditya portfolio website. |

---

## Structured-Data Map

| Route | Schema types (JSON-LD) |
|---|---|
| `/` (layout) | Person, WebSite, ProfilePage (via `generateHomepageSchemaGraph()`) |
| `/` (page) | WebPage |
| `/services` | Service, BreadcrumbList |
| `/services/business-websites` | Service, BreadcrumbList |
| `/services/website-redesign` | Service, BreadcrumbList |
| `/services/landing-page-design` | Service, BreadcrumbList |
| `/services/ecommerce-development` | Service, BreadcrumbList |
| `/services/nextjs-development` | Service, BreadcrumbList |
| `/services/interactive-websites` | Service, BreadcrumbList |
| `/packages` | OfferCatalog (with Offer items for each package) |
| `/work` | None (hub page, no unique entity) |
| `/work/saffron-steam-experience` | CreativeWork, BreadcrumbList |
| `/work/corporate-leadgen-platform` | CreativeWork, BreadcrumbList |
| `/work/driftwear-ecommerce` | CreativeWork, BreadcrumbList |
| `/work/real-estate-atelier` | CreativeWork, BreadcrumbList |
| `/about` | WebPage |
| `/contact` | ContactPage |
| `/web-designer-delhi` | Service, BreadcrumbList |
| `/mentoring` | WebPage, Service |
| `/resources` | WebPage |
| `/resources/portfolio-checklist` | Article, BreadcrumbList |
| `/resources/frontend-qa` | Article, BreadcrumbList |
| `/resources/ai-website-agency` | Article, BreadcrumbList |
| `/resources/website-cost-india` | Article, BreadcrumbList |
| `/resources/nextjs-vs-wordpress` | Article, BreadcrumbList |
| `/resources/website-redesign-checklist` | Article, BreadcrumbList |
| `/resources/choose-freelance-web-designer-india` | Article, BreadcrumbList |
| `/privacy` | None |
| `/terms` | None |
| `/accessibility` | None |

All schema entities use stable `@id` references (defined in `IDS` constants in `src/lib/schema.ts`) so that entities can cross-reference each other consistently.

---

## Content Added Summary

### New service pages (7 pages)

| Page | What it covers |
|---|---|
| `/services` (hub) | Overview of all services: business websites, redesign, landing pages, e-commerce, Next.js, interactive |
| `/services/business-websites` | Professional websites for service businesses, startups, and independent professionals |
| `/services/website-redesign` | Transform outdated websites into modern, conversion-focused experiences |
| `/services/landing-page-design` | High-conversion landing pages for campaigns, launches, and lead gen |
| `/services/ecommerce-development` | E-commerce sites with full shopping flow, cart, and payment integration |
| `/services/nextjs-development` | Production-grade Next.js sites with SSR, API routes, and modern architecture |
| `/services/interactive-websites` | WebGL, scroll choreography, motion design for immersive web experiences |

### New local/geo page (1 page)

| Page | What it covers |
|---|---|
| `/web-designer-delhi` | Delhi-specific landing page targeting "web designer Delhi" search intent |

### New resource articles (4 articles)

| Page | What it covers |
|---|---|
| `/resources/website-cost-india` | Experience-based cost breakdown for business websites in India (₹15K–₹75K+) |
| `/resources/nextjs-vs-wordpress` | Honest comparison of Next.js and WordPress for business websites |
| `/resources/website-redesign-checklist` | Complete checklist for redesigning a service business website |
| `/resources/choose-freelance-web-designer-india` | Practical guide for choosing a freelance web designer in India |

### Existing resources expanded (3 articles)

| Page | What was improved |
|---|---|
| `/resources/portfolio-checklist` | Expanded with more context and depth (still a checklist format) |
| `/resources/frontend-qa` | Expanded with more categories and detail |
| `/resources/ai-website-agency` | Expanded with ethical constraints and practical considerations |

### New infrastructure

| Item | Description |
|---|---|
| `llms.txt` | Machine-readable site overview for LLM consumers, served at `/llms.txt` |
| `feed.xml` | Atom 1.0 feed of resource articles, served at `/feed.xml` |
| IndexNow key route | Verification at `/api/indexnow/<key>` |
| IndexNow submission script | `scripts/submit-indexnow.mjs` |
| Dynamic OG/Twitter images | Edge-runtime image generation via `opengraph-image.tsx` and `twitter-image.tsx` |
| Contact form API | `/api/contact` with honeypot anti-spam |

---

## Performance Changes

### Server/client component split

| Before | After |
|---|---|
| Homepage was entirely `'use client'` — no metadata export, all content JS-dependent | Homepage is a server component with `export const metadata`; interactive parts extracted to `HomeContent.tsx` client component |
| All page content was in single client files | Every page follows the pattern: server component `page.tsx` (metadata + schema) → client `Content.tsx` (interactions/animations) |

### Next.js config headers

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-type sniffing |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Enable browser XSS filtering |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Privacy for referrer data |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restrict unused browser features |

### Caching headers

| Path | Cache-Control | Purpose |
|---|---|---|
| `/_next/static/*` | `public, max-age=31536000, immutable` | Long-lived cache for static assets |
| `/fonts/*` | `public, max-age=31536000, immutable` | Long-lived cache for fonts |
| `/llms.txt` (API) | `public, max-age=3600, s-maxage=3600` | 1-hour cache for LLM consumers |
| `/feed.xml` (API) | `public, max-age=3600, s-maxage=3600` | 1-hour cache for RSS readers |

### Other performance changes

- `poweredByHeader: false` — removes `X-Powered-By: Next.js` header
- `trailingSlash: false` — consistent URL format (no trailing slashes)
- `compress: true` — explicit gzip compression
- Image optimization: AVIF + WebP formats; remote patterns for Vercel and custom domain
- Dynamic OG image generation uses edge runtime (fast, no cold start)

---

## Audit Issue Resolution

| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | Homepage entirely client component | CRITICAL | ✅ Fixed — server/client split |
| 2 | No self-referencing canonical URLs | CRITICAL | ✅ Fixed — `generatePageMetadata()` adds canonical to every page |
| 3 | Canonical domain conflict | CRITICAL | ✅ Fixed — `getCanonicalOrigin()` + env var flag |
| 4 | Minimal structured data | CRITICAL | ✅ Fixed — full schema graph with 9+ entity types |
| 5 | Sitemap has hardcoded dates | HIGH | ✅ Fixed — content registry with per-route dates |
| 6 | No page-level structured data | HIGH | ✅ Fixed — schema on every page type |
| 7 | No Open Graph images | HIGH | ✅ Fixed — dynamic OG/Twitter image generation |
| 8 | Generic developer positioning in titles | HIGH | ✅ Fixed — commercial-intent titles |
| 9 | No services information architecture | HIGH | ✅ Fixed — 7 service pages + hub |
| 10 | No breadcrumbs | HIGH | ✅ Fixed — BreadcrumbList schema + visible breadcrumb nav on resource articles |
| 11 | Resource pages lack depth | MEDIUM | ⚠️ Partially addressed — existing articles expanded; new articles are substantial |
| 12 | Case studies lack visual evidence | MEDIUM | ❌ Not fixed — no real screenshots yet |
| 13 | No RSS/Atom feed | MEDIUM | ✅ Fixed — Atom feed at `/feed.xml` |
| 14 | No IndexNow support | MEDIUM | ✅ Fixed — key route + submission script |
| 15 | No analytics or monitoring | MEDIUM | ❌ Not fixed — no analytics configured |
| 16 | No llms.txt | MEDIUM | ✅ Fixed — served at `/llms.txt` |
| 17 | Minimal Next.js config | MEDIUM | ✅ Fixed — security headers, caching, rewrites, image config |
| 18 | Resource pages missing publication/update dates | LOW | ✅ Fixed — visible author + date on new articles |
| 19 | No author cards on resources | LOW | ⚠️ Partially — "By Aditya Singh" line on new articles; no bio card |
| 20 | Footer lacks Services link | LOW | ✅ Fixed — Services link added |
| 21 | Header navigation doesn't include Services | LOW | ✅ Fixed — Services link in main nav |
| 22 | No skip-to-content link | LOW | ✅ Fixed — skip link added in layout |
| 23 | Case study 404 page has no metadata | LOW | ❌ Not fixed — `not-found.tsx` still has no metadata export |

---

## Tests Run

| Test | Command | Status | Notes |
|---|---|---|---|
| TypeScript check | `bun run typecheck` or `npx tsc --noEmit` | Not run in this session | Should be run before deployment |
| ESLint | `bun run lint` | Not run in this session | Should be run before deployment |
| Build | `bun run build` | Not run in this session | Should be run before deployment |

> **Note**: These checks should be run manually before considering the site deployment-ready. The sandbox environment does not run production builds.

---

## Remaining Owner Actions

### Must-do before launch

- [ ] Set `NEXT_PUBLIC_SITE_URL=https://dev-aditya.com` in Vercel environment variables
- [ ] Set `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true` in Vercel environment variables **only after** the custom domain is resolving
- [ ] Configure custom domain `dev-aditya.com` in Vercel → Settings → Domains
- [ ] Configure DNS records at domain registrar (A record: `@` → `76.76.21.21` or CNAME: `@` → `cname.vercel-dns.com`)
- [ ] Add `www.dev-aditya.com` as redirect to `dev-aditya.com` in Vercel
- [ ] Verify domain resolves: `curl -I https://dev-aditya.com` should return HTTP 200
- [ ] Run `bun run typecheck` and `bun run lint` — fix any errors
- [ ] Run `bun run build` — fix any build errors

### Search engine setup

- [ ] Generate Google Search Console verification code; set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var
- [ ] Add domain property in Google Search Console
- [ ] Submit sitemap (`sitemap.xml`) in GSC
- [ ] Use URL Inspection tool on homepage + key pages; request indexing
- [ ] Generate Bing Webmaster Tools verification code; set `NEXT_PUBLIC_BING_SITE_VERIFICATION` env var
- [ ] Submit sitemap in Bing Webmaster Tools
- [ ] Generate IndexNow key: `openssl rand -hex 16`; set `NEXT_PUBLIC_INDEXNOW_KEY` env var
- [ ] Verify IndexNow key route works: `curl https://dev-aditya.com/api/indexnow/<key>`
- [ ] Run IndexNow submission: `INDEXNOW_KEY=<key> node scripts/submit-indexnow.mjs`

### Content improvements

- [ ] Add real project screenshots to case studies (issue #12)
- [ ] Expand resource articles that are still checklist-length (issue #11)
- [ ] Add author bio card to resource articles (issue #19)
- [ ] Add metadata export to `not-found.tsx` (issue #23)
- [ ] Configure analytics (Vercel Analytics or Google Analytics) (issue #15)

---

## Credentials Still Needed

| Credential | Env var name | How to obtain | Required for |
|---|---|---|---|
| Google Search Console verification | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Add domain property at [search.google.com/search-console](https://search.google.com/search-console); copy verification code | Google indexing + monitoring |
| Bing Webmaster Tools verification | `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Add site at [bing.com/webmasters](https://www.bing.com/webmasters); copy meta tag verification code | Bing indexing + monitoring |
| IndexNow API key | `NEXT_PUBLIC_INDEXNOW_KEY` | Generate with `openssl rand -hex 16` | Instant notification to Bing/Yandex/Naver/Seznam |

All three env vars are already wired into the codebase. They just need to be generated and set.

---

## Search Console Steps

### Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **Add property** → choose **Domain** → enter `dev-aditya.com`
3. Google will provide a DNS TXT record for verification
   - Alternative: Use meta tag verification — set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var
4. Add the DNS record at your domain registrar, or set the env var and redeploy
5. Click **Verify** in GSC
6. Go to **Sitemaps** → submit `sitemap.xml`
7. Use **URL Inspection** on `https://dev-aditya.com/` → **Test Live URL** → **Request Indexing**
8. Repeat URL Inspection for key pages (services, case studies, resources, `/web-designer-delhi`)
9. Wait 3–7 days, then check **Pages** report for index coverage
10. Check **Page Experience** for Core Web Vitals data
11. Set up email alerts for crawl errors and security issues

### Bing Webmaster Tools

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Add site: `https://dev-aditya.com`
3. Verify ownership via DNS TXT record or meta tag (`NEXT_PUBLIC_BING_SITE_VERIFICATION`)
4. Submit sitemap: `https://dev-aditya.com/sitemap.xml`
5. Run IndexNow submission after key is configured
6. Check **Page Insights** and **URL Inspection** after 24–48 hours
7. Monitor **Crawl Information** for errors

---

## Domain Steps

See full details in `docs/domain-canonicalization.md`.

1. Add `dev-aditya.com` in Vercel → Settings → Domains
2. Add `www.dev-aditya.com` and set it to redirect to `dev-aditya.com`
3. At domain registrar, configure DNS:
   - A record: `@` → `76.76.21.21` (verify this IP is current in Vercel's instructions)
   - CNAME: `www` → `cname.vercel-dns.com`
4. Wait for DNS propagation (minutes to 48 hours)
5. Verify: `curl -I https://dev-aditya.com` → HTTP 200
6. Set `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE=true` in Vercel env vars
7. Redeploy
8. Verify canonical URLs in page source use `https://dev-aditya.com`
9. Verify sitemap at `https://dev-aditya.com/sitemap.xml` uses `https://dev-aditya.com` URLs

---

## Honest Limitations

1. **No real screenshots on case studies** — All four case studies are text-only. No project screenshots, mockups, or visual evidence exists yet. This significantly reduces credibility and engagement.

2. **Custom domain not confirmed live** — `dev-aditya.com` has not been verified as resolving and serving the site. The `NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE` flag is not set. Until the domain is configured and resolving, canonical URLs in the current deployment point to `dev-aditya-com.vercel.app`.

3. **No analytics configured** — No Google Analytics, Vercel Analytics, or any other tracking. There is no way to measure traffic, user behavior, or conversion. This is a significant gap for a business site.

4. **Contact form only logs to console** — The `/api/contact` route logs submissions to the server console but does not send email or persist to a database. Messages will be lost on server restart. An email service (Resend, SendGrid, etc.) or database persistence is needed.

5. **No real testimonials or client references** — The site makes service claims without third-party validation. No testimonials, reviews, or named client references exist.

6. **Case studies are portfolio projects, not client work** — All four case studies are self-initiated portfolio builds. This is disclosed in the llms.txt and in each case study's meta line, but it means there's no evidence of delivering for real clients yet.

7. **No performance benchmarks** — Core Web Vitals have not been measured on the actual deployment. LCP, INP, and CLS scores are unknown.

8. **IndexNow key not set** — The `NEXT_PUBLIC_INDEXNOW_KEY` env var is empty. The key verification route returns 404. IndexNow submissions cannot be made until this is configured.

9. **Google/Bing verification not set** — Neither `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` nor `NEXT_PUBLIC_BING_SITE_VERIFICATION` are set. Search Console and Bing Webmaster Tools cannot verify ownership until these are configured.

10. **Not-found page has no metadata** — `src/app/not-found.tsx` doesn't export metadata, so the 404 page will use the root layout's default title.

11. **Resource articles vary in depth** — The original three resources (portfolio-checklist, frontend-qa, ai-website-agency) are checklist-format and relatively short. The newer four articles (website-cost-india, nextjs-vs-wordpress, website-redesign-checklist, choose-freelance-web-designer-india) are more substantial. All could benefit from more real-world examples and visuals.

12. **No social media profiles linked (beyond GitHub)** — The Person schema and footer only link to GitHub. No LinkedIn, Twitter/X, Dribbble, or other professional profiles are connected.

13. **No email signature or external profile consistency** — No standardized email signature or external profile descriptions have been set up. See `docs/external-profile-checklist.md`.

---

## No Fake Guarantees

This document makes no claims about:
- Search rankings (no position guarantees)
- Traffic numbers (no traffic data exists)
- Conversion rates (no analytics to measure)
- Indexing timelines (Google indexes on its own schedule)
- Revenue impact (no baseline to compare against)

The SEO changes ensure the site is **technically discoverable** and **correctly structured** for search engines. Visibility depends on content quality, backlinks, domain authority, and competition — none of which can be guaranteed by technical SEO alone.
