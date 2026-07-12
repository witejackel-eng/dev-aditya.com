# Content Roadmap

**Last updated:** 2026-07-12  
**Purpose:** Track what content exists, what needs improvement, and what opportunities are available. This is a living document — update it as content is published or priorities shift.

---

## What's Been Published

### Core pages (7)

| Route | Title | Type | Status |
|---|---|---|---|
| `/` | Web Designer & Next.js Developer in Delhi | Homepage | Published |
| `/about` | About Aditya Singh | About page | Published |
| `/contact` | Contact for a Website Project | Contact page | Published |
| `/packages` | Website Design Packages & Pricing in India | Pricing page | Published |
| `/mentoring` | Project Help for Frontend Students & Small Businesses | Service page | Published |
| `/work` | Web Design & Next.js Case Studies | Portfolio hub | Published |
| `/resources` | Resources — Web Design Guides & Checklists | Resource hub | Published |

### Service pages (7)

| Route | Title | Type | Status |
|---|---|---|---|
| `/services` | Web Design & Development Services | Service hub | Published |
| `/services/business-websites` | Business Website Design & Development | Service page | Published |
| `/services/website-redesign` | Website Redesign Services | Service page | Published |
| `/services/landing-page-design` | Landing Page Design & Development | Service page | Published |
| `/services/ecommerce-development` | E-commerce Website Development | Service page | Published |
| `/services/nextjs-development` | Next.js Website & Application Development | Service page | Published |
| `/services/interactive-websites` | Interactive & Immersive Website Development | Service page | Published |

### Local page (1)

| Route | Title | Type | Status |
|---|---|---|---|
| `/web-designer-delhi` | Web Designer in Delhi | Local landing page | Published |

### Case studies (4)

| Route | Title | Type | Status |
|---|---|---|---|
| `/work/saffron-steam-experience` | Saffron & Steam — Immersive Café Website | Case study (portfolio project) | Published — no screenshots |
| `/work/corporate-leadgen-platform` | Corporate Lead-Gen Platform | Case study (portfolio project) | Published — no screenshots |
| `/work/driftwear-ecommerce` | Driftwear Studio — Editorial E-commerce | Case study (portfolio project) | Published — no screenshots |
| `/work/real-estate-atelier` | Real Estate Atelier — Luxury Property Advisory | Case study (portfolio project) | Published — no screenshots |

### Resource articles (7)

| Route | Title | Type | Status |
|---|---|---|---|
| `/resources/portfolio-checklist` | Portfolio Website Checklist | Checklist | Published — short format |
| `/resources/frontend-qa` | Frontend Project QA Checklist | Checklist | Published — short format |
| `/resources/ai-website-agency` | AI Website Agency Starter Notes | Essay/notes | Published — short format |
| `/resources/website-cost-india` | How Much Does a Business Website Cost in India? | Cost guide | Published — substantial |
| `/resources/nextjs-vs-wordpress` | Next.js vs WordPress: Which Is Better for Your Business Website? | Comparison | Published — substantial |
| `/resources/website-redesign-checklist` | Website Redesign Checklist for Service Businesses | Checklist | Published — substantial |
| `/resources/choose-freelance-web-designer-india` | How to Choose a Freelance Web Designer in India | Guide | Published — substantial |

### Legal pages (3)

| Route | Title | Type | Status |
|---|---|---|---|
| `/privacy` | Privacy Policy | Legal | Published |
| `/terms` | Terms of Service | Legal | Published |
| `/accessibility` | Accessibility Statement | Legal | Published |

### Infrastructure

| Item | Status |
|---|---|
| `sitemap.xml` | Published — auto-generated from content registry |
| `robots.txt` | Published — explicit crawler allow rules |
| `llms.txt` | Published — machine-readable site overview |
| `feed.xml` | Published — Atom 1.0 feed of resource articles |
| Manifest (`manifest.webmanifest`) | Published |
| Dynamic OG/Twitter images | Published |

**Total published pages: 29** (7 core + 7 service + 1 local + 4 case studies + 7 resources + 3 legal)

---

## What Needs Improvement

### High priority — content gaps that hurt conversion

| Item | Current state | Improvement needed | Why it matters |
|---|---|---|---|
| Case study screenshots | Text-only — no visual evidence | Add 3–5 screenshots per case study with alt text and captions | Case studies without visuals are unconvincing; prospects can't evaluate design quality |
| Portfolio checklist depth | Checklist format with brief items | Add examples, before/after comparisons, and context for each item | Short checklists feel thin; depth signals expertise |
| Frontend QA depth | Checklist format | Add tool recommendations, common failure patterns, and real examples | Same reason |
| AI Website Agency depth | Short notes | Add specific tool reviews, workflows, and limits from real use | Same reason |
| Contact form delivery | Logs to console only | Integrate email service (Resend, SendGrid) so messages aren't lost | Messages are lost on server restart |
| Author bio on resources | "By Aditya Singh" line only | Add short bio card with photo, expertise, and link to `/about` | Builds trust and E-E-A-T signals |

### Medium priority — content quality improvements

| Item | Current state | Improvement needed |
|---|---|---|
| Service page depth | Service descriptions exist but could be richer | Add process section, deliverables list, FAQ per service, related case study callout |
| `/work` hub page | Grid of case study cards | Add a brief intro paragraph explaining the portfolio approach and that all projects are portfolio builds |
| `/packages` page | Pricing tiers listed | Add FAQ section, "What's included" detail, comparison table |
| `/web-designer-delhi` page | Local landing page | Add Delhi-specific content: service areas, local business examples, why local matters |
| Resource article CTAs | "EMAIL ME →" button only | Add softer CTAs: "View packages", "See related services" alongside the direct email CTA |
| 404 page | Basic "Page not found" | Add suggested links (services, resources, contact) and export metadata |

### Low priority — polish

| Item | Current state | Improvement needed |
|---|---|---|
| Footer "About" text | Generic description | Make it match current positioning ("web designer & Next.js developer") |
| Testimonials / social proof | None exist | Add when real testimonials are available — do not fabricate |
| Email signature | Not standardized | See `docs/external-profile-checklist.md` |
| Internal link audit | Links exist but coverage may be uneven | Map every page's internal links; ensure every service page links to relevant case study and resource |

---

## Future Content Opportunities

These article ideas target high-intent commercial queries that the current site doesn't cover yet. Each one connects naturally to an existing service page.

### Priority 1 — High commercial intent (directly supports hiring decisions)

| Proposed title | Target query | Related service | Estimated effort |
|---|---|---|---|
| What Should a Corporate Website Include? | "corporate website pages", "what to include in a business website" | `/services/business-websites` | Medium (1,500–2,000 words) |
| How Long Does It Take to Design and Build a Website? | "how long does a website take to build", "website development timeline India" | `/services/business-websites`, `/packages` | Medium (1,200–1,800 words) |
| Landing Page vs Full Website — Which Do You Need? | "landing page vs website", "do I need a landing page or website" | `/services/landing-page-design`, `/services/business-websites` | Medium (1,200–1,500 words) |
| How to Prepare Content Before Hiring a Web Designer | "what to prepare before hiring a web designer", "content for new website" | `/services/business-websites`, `/contact` | Medium (1,200–1,800 words) |

### Priority 2 — Medium commercial intent (supports consideration stage)

| Proposed title | Target query | Related service | Estimated effort |
|---|---|---|---|
| Website Maintenance Costs in India | "website maintenance cost India", "how much does website maintenance cost" | `/packages`, `/services/website-redesign` | Medium (1,200–1,500 words) |
| What Makes a Business Website Look Trustworthy? | "trustworthy website design", "how to make a business website look professional" | `/services/business-websites` | Medium (1,500–2,000 words) |

### Priority 3 — Long-term / authority building

| Proposed title | Target query | Related service | Estimated effort |
|---|---|---|---|
| Why Your Small Business Needs a Website (Not Just Instagram) | "does my business need a website", "Instagram vs website for business India" | `/services/business-websites` | Medium (1,500–2,000 words) |
| How to Write Website Copy for a Service Business | "website copy for service business", "how to write about page for business" | `/services/business-websites` | High (2,000–3,000 words) |
| What Is Next.js and Why Are Businesses Using It? | "what is Next.js used for", "Next.js for business website" | `/services/nextjs-development` | Medium (1,500–2,000 words) |
| How to Audit Your Current Website Before a Redesign | "website audit before redesign", "pre-redesign checklist" | `/services/website-redesign` | Medium (1,200–1,500 words) — can complement the existing redesign checklist |
| Website Accessibility for Small Businesses in India | "website accessibility India", "accessible website requirements" | `/accessibility`, `/services/business-websites` | Medium (1,500–2,000 words) |

### Priority 4 — Location-targeted (if local SEO becomes a priority)

| Proposed title | Target query | Related page | Estimated effort |
|---|---|---|---|
| Top Website Design Mistakes Delhi Businesses Make | "website design mistakes", "Delhi business website" | `/web-designer-delhi` | Medium (1,500–2,000 words) |
| Why Hire a Local Web Designer in Delhi vs an Agency | "hire local web designer Delhi", "freelance vs agency Delhi" | `/web-designer-delhi` | Medium (1,200–1,500 words) |

---

## Priority Ranking

### Immediate (next 2 weeks)

1. **Add screenshots to case studies** — biggest credibility gap
2. **Integrate email service for contact form** — messages are being lost
3. **Add author bio card to resource articles** — E-E-A-T signal

### Short-term (next 1–2 months)

4. **Write "How Long Does It Take to Design and Build a Website?"** — directly supports `/packages` and `/services/business-websites`
5. **Write "What Should a Corporate Website Include?"** — high-intent commercial query, supports `/services/business-websites`
6. **Expand existing short resources** (portfolio-checklist, frontend-qa, ai-website-agency) with more depth
7. **Add FAQ sections to service pages and `/packages`**

### Medium-term (3–6 months)

8. **Write "Landing Page vs Full Website"** — supports both landing page and business website services
9. **Write "How to Prepare Content Before Hiring a Web Designer"** — reduces friction for prospects
10. **Write "Website Maintenance Costs in India"** — supports ongoing engagement after launch
11. **Write "What Makes a Business Website Look Trustworthy?"** — supports conversion optimization
12. **Improve service page depth** (process section, deliverables, FAQ per service)

### Long-term (6+ months)

13. Location-targeted articles for Delhi/NCR
14. Next.js educational content
15. Accessibility guides for Indian businesses
16. Website copywriting guide for service businesses

---

## Content Standards to Follow

### Writing principles

1. **Honest, not hype** — Never fabricate data, testimonials, results, or client names. If you don't have data, say so. If a project is a portfolio build, label it as such.
2. **Experience-based** — Every claim should be traceable to real experience. "In my experience…" > "Studies show…" (unless you can cite the study).
3. **Commercial but not salesy** — Articles should help the reader make a decision, even if that decision is "I don't need this service." Trust built through honesty converts better than pressure.
4. **Specific, not vague** — "₹15,000–₹75,000" > "affordable pricing". "Next.js with SSR and API routes" > "modern technology". "Within 24 hours" > "fast response".
5. **Scannable** — Use headers, lists, tables, and bold text. Business owners scan before they read.
6. **Short sentences** — Average 15–20 words. Vary length for rhythm, but lean short.

### SEO requirements for every article

| Element | Standard |
|---|---|
| Title tag | Under 60 characters. Primary keyword near the start. Ends with `\| Aditya Singh` (template handles this) |
| Meta description | Under 155 characters. States the value clearly. Includes a reason to click. |
| H1 | Matches the article topic exactly. One H1 per page. |
| URL slug | Short, descriptive, hyphenated. No dates in URLs. |
| Canonical URL | Self-referencing, auto-generated via `generatePageMetadata()` |
| Schema | Article + BreadcrumbList. Use `generateArticleSchema()` and `generateBreadcrumbs()` |
| Published/modified dates | Required. Display visibly. Update `dateModified` when content changes. |
| Author attribution | "By Aditya Singh" with link to `/about` |
| Section/category | Set in `generatePageMetadata()` `section` param and Article schema |
| Keywords | 3–5 natural keywords in `keywords` param. Not stuffed. |
| Internal links | Minimum 3: one to a related service, one to a related resource, one to `/contact` or `/packages` |
| Word count | Minimum 1,200 words for substantive articles. Checklists can be shorter but must have context. |
| Images | If adding screenshots/images: proper `alt` text, compressed (WebP), width/height set. |

### Content registry update

Every new page must be registered in `src/config/content-registry.ts` with:

- `path` — canonical route
- `lastModified` — ISO date
- `changeFrequency` — sitemap hint
- `priority` — sitemap priority (0–1)
- `indexable` — whether search engines should index it
- `type` — page type for schema generation
- `parentPath` — for breadcrumbs
- `title` — human-readable title
- `description` — short description
- `datePublished` — for articles

### Before publishing checklist

- [ ] Title is under 60 characters and includes primary keyword
- [ ] Meta description is under 155 characters and gives a reason to click
- [ ] H1 is clear, specific, and matches the page topic
- [ ] Article schema is generated with correct dates and section
- [ ] BreadcrumbList schema matches the visible breadcrumb
- [ ] At least 3 internal links to related pages
- [ ] Published and modified dates are set and visible
- [ ] Author attribution is present
- [ ] Content registry entry is added
- [ ] No fabricated data, testimonials, or client names
- [ ] All technical claims are verifiable
- [ ] Page loads without JavaScript errors
- [ ] Canonical URL is self-referencing

### After publishing

- [ ] Submit URL via Google Search Console URL Inspection → Request Indexing
- [ ] Run IndexNow submission: `INDEXNOW_KEY=<key> node scripts/submit-indexnow.mjs`
- [ ] Check for crawl errors in GSC after 24–48 hours
- [ ] Share on relevant social profiles (if available)
- [ ] Update this roadmap document
