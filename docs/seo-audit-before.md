# SEO Pre-Implementation Audit

**Date:** 2026-07-12  
**Repository:** https://github.com/witejackel-eng/dev-aditya.com  
**Live deployment:** https://dev-aditya-com.vercel.app  
**Intended domain:** https://dev-aditya.com

---

## Route Inventory

| Route | Status | Indexable | Title | H1 | Schema | OG Image | Canonical |
|---|---|---|---|---|---|---|---|
| `/` | 200 | Yes | "Aditya — Front-End Developer & UI/UX Designer" | Multiple potential H1s in client component | Person (minimal) | None | No self-ref |
| `/work` | 200 | Yes | "Work — Aditya \| Front-End Developer & UI/UX Designer" | In client component | None | None | No self-ref |
| `/packages` | 200 | Yes | "Website Packages — Aditya \| Front-End Developer & UI/UX Designer" | In client component | None | None | No self-ref |
| `/about` | 200 | Yes | "About — Front-End Developer & UI/UX Designer" | In client component | None | None | No self-ref |
| `/mentoring` | 200 | Yes | "Project Help — Frontend help for students, creators, and small businesses" | In client component | None | None | No self-ref |
| `/contact` | 200 | Yes | "Contact — Tell me what you are trying to build" | In client component | None | None | No self-ref |
| `/resources` | 200 | Yes | "Resources — Useful guides and checklists" | In client component | None | None | No self-ref |
| `/resources/portfolio-checklist` | 200 | Yes | "Portfolio Website Checklist" | In client component | None | None | No self-ref |
| `/resources/ai-website-agency` | 200 | Yes | "AI Website Agency Starter Notes" | In client component | None | None | No self-ref |
| `/resources/frontend-qa` | 200 | Yes | "Frontend Project QA Checklist" | In client component | None | None | No self-ref |
| `/work/saffron-steam-experience` | 200 | Yes | "Saffron & Steam — Building an immersive café experience..." | In client component | None | None | No self-ref |
| `/work/corporate-leadgen-platform` | 200 | Yes | "Corporate Lead-Gen Platform — B2B lead-generation experience" | In client component | None | None | No self-ref |
| `/work/driftwear-ecommerce` | 200 | Yes | "Driftwear Studio — Building an editorial e-commerce..." | In client component | None | None | No self-ref |
| `/work/real-estate-atelier` | 200 | Yes | "Real Estate Atelier — Building a cinematic luxury..." | In client component | None | None | No self-ref |
| `/privacy` | 200 | Yes | "Privacy Policy" | Yes | None | None | No self-ref |
| `/terms` | 200 | Yes | "Terms of Service" | Yes | None | None | No self-ref |
| `/accessibility` | 200 | Yes | "Accessibility" | Yes | None | None | No self-ref |
| `/robots.txt` | 200 | N/A | N/A | N/A | N/A | N/A | N/A |
| `/sitemap.xml` | 200 | N/A | N/A | N/A | N/A | N/A | N/A |
| 404 | 200 | No | "Page not found." | Yes | None | None | N/A |

---

## Problems Found

### CRITICAL

1. **Homepage is entirely a client component** — Entire page is `'use client'` with Framer Motion. No metadata can be exported from the page. Important content (hero text, services, project summaries) may not appear in initial server-rendered HTML. Crawlers that don't execute JavaScript may see blank content.
   - **Files:** `src/app/page.tsx`
   - **Fix:** Refactor into server component page + client component for animations.

2. **No self-referencing canonical URLs on any page** — While `metadataBase` is set, no page explicitly sets a canonical URL. This risks duplicate-content signals when both Vercel domain and custom domain serve the same content.
   - **Files:** All page files
   - **Fix:** Add explicit `alternates.canonical` to every indexable page.

3. **Canonical domain conflict** — Metadata, robots.txt, and sitemap all reference `https://dev-aditya.com`, but the owner is sharing `https://dev-aditya-com.vercel.app`. If the custom domain isn't properly configured and resolving, this creates a mismatch.
   - **Files:** `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`
   - **Fix:** Create centralized config, verify domain status, add domain canonicalization documentation.

4. **Minimal structured data** — Only a small Person JSON-LD exists with just name, jobTitle, email, one sameAs link, and location. Missing: WebSite, WebPage, ProfilePage, Service, OfferCatalog, CreativeWork, Article, BreadcrumbList entities.
   - **Files:** `src/app/layout.tsx`
   - **Fix:** Build comprehensive schema graph with stable @id references.

### HIGH

5. **Sitemap has hardcoded identical lastModified date** — All routes show `new Date('2026-07-10')`. This is not useful for search engines determining freshness.
   - **Files:** `src/app/sitemap.ts`
   - **Fix:** Use content registry with accurate modification dates.

6. **No page-level structured data** — Zero case-study, service, article, or breadcrumb schema on any page beyond the root layout.
   - **Files:** All page files
   - **Fix:** Add appropriate schema to each page type.

7. **No Open Graph images** — No OG images are configured for any page. Social sharing will show generic or empty previews.
   - **Files:** All page files
   - **Fix:** Create OG image generation system and add to all pages.

8. **Titles use generic developer positioning** — "Front-End Developer & UI/UX Designer" doesn't target commercial search intent (web design, business websites, website redesign, etc.).
   - **Files:** `src/app/layout.tsx`, all page metadata
   - **Fix:** Reposition titles toward commercial search intent while maintaining authenticity.

9. **No services information architecture** — The site has no `/services` hub. Businesses searching for specific services can't find dedicated landing pages.
   - **Fix:** Create services hub and individual service pages.

10. **No breadcrumbs** — No visible or structured-data breadcrumbs exist on any page.
    - **Fix:** Add breadcrumb component and BreadcrumbList schema.

### MEDIUM

11. **Resource pages lack depth** — Portfolio checklist, AI Website Agency, and Frontend QA are short checklists rather than experience-led, substantial resources.
    - **Files:** `src/app/resources/*/Content.tsx`
    - **Fix:** Expand with firsthand experience, examples, and context.

12. **Case studies lack visual evidence** — All four case studies are text-only with no screenshots, images, or visual proof.
    - **Files:** All case study pages
    - **Fix:** Add project screenshots with proper alt text and captions.

13. **No RSS/Atom feed** — No feed.xml for resource content discovery.
    - **Fix:** Create feed.xml route.

14. **No IndexNow support** — No IndexNow automation for participating search engines.
    - **Fix:** Create IndexNow script and key setup.

15. **No analytics or monitoring** — No Search Console integration, no analytics, no Core Web Vitals monitoring.
    - **Fix:** Add Vercel Analytics, Search Console verification placeholders.

16. **No `llms.txt`** — No supplementary discovery file for AI systems.
    - **Fix:** Create llms.txt at root.

17. **Minimal Next.js config** — No redirects, security headers, or performance optimizations configured.
    - **Files:** `next.config.ts`
    - **Fix:** Add production-safe configuration.

### LOW

18. **Resource pages missing publication/update dates** — No visible dates on resource articles.
19. **No author cards on resources** — No attribution or author bio on resource pages.
20. **Footer lacks Services link** — Navigation doesn't include the new services hub.
21. **Header navigation doesn't include Services** — Main nav has no link to /services.
22. **No skip-to-content link** — Accessibility improvement needed.
23. **Case study 404 page has no metadata** — `not-found.tsx` doesn't export metadata.

---

## Baseline Metadata Inventory

| Route | Title | Description |
|---|---|---|
| `/` | "Aditya — Front-End Developer & UI/UX Designer" | "Aditya is a Delhi-based Front-End Developer and UI/UX Designer building high-performance digital interfaces..." |
| `/work` | "Work — Aditya \| Front-End Developer & UI/UX Designer" | "Selected case studies: corporate websites..." |
| `/packages` | "Website Packages — Aditya \| Front-End Developer & UI/UX Designer" | "Transparent web design packages..." |
| `/about` | "About — Front-End Developer & UI/UX Designer" | "I'm Aditya — a Front-End Developer..." |
| `/contact` | "Contact — Tell me what you are trying to build" | "Send the short version..." |
| `/mentoring` | "Project Help — Frontend help for students..." | "I help people turn rough website ideas..." |
| `/resources` | "Resources — Useful guides and checklists" | "Practical resources for building better portfolios..." |
| `/resources/portfolio-checklist` | "Portfolio Website Checklist" | "A practical checklist for making a portfolio look credible..." |
| `/resources/ai-website-agency` | "AI Website Agency Starter Notes" | "Notes on packaging websites..." |
| `/resources/frontend-qa` | "Frontend Project QA Checklist" | "Responsive, accessibility, SEO..." |
| `/work/saffron-steam-experience` | "Saffron & Steam — Building an immersive..." | "An immersive, motion-led concept..." |
| `/work/corporate-leadgen-platform` | "Corporate Lead-Gen Platform — B2B..." | "A polished marketing platform..." |
| `/work/driftwear-ecommerce` | "Driftwear Studio — Building an editorial..." | "An editorial e-commerce experience..." |
| `/work/real-estate-atelier` | "Real Estate Atelier — Building a cinematic..." | "A premium real estate advisory..." |
| `/privacy` | "Privacy Policy" | "Privacy policy for the Aditya portfolio..." |
| `/terms` | "Terms of Service" | "Terms of service for the Aditya portfolio..." |
| `/accessibility` | "Accessibility" | "Accessibility statement for the Aditya portfolio..." |

## Baseline Structured Data Inventory

Only one JSON-LD block exists in `src/app/layout.tsx`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Aditya",
  "jobTitle": "Front-End Developer & UI/UX Designer",
  "email": "hi.aditya.dev@gmail.com",
  "url": "https://dev-aditya.com",
  "sameAs": ["https://github.com/witejackel-eng"],
  "address": { "@type": "PostalAddress", "addressLocality": "Delhi", "addressCountry": "IN" }
}
```

Missing: WebSite, WebPage, ProfilePage, Service, OfferCatalog, CreativeWork, Article, BreadcrumbList, ContactPage.

## Performance Baseline

- Homepage is entirely client-rendered with Framer Motion — all content depends on JavaScript
- No `next/image` usage (no images currently exist on the site)
- No dynamic imports or lazy loading for animation code
- Lenis smooth scroll loaded on every page
