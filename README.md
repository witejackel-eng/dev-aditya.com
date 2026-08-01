# Aditya — Portfolio

Designer and developer for business websites, ecommerce platforms and digital
products. The portfolio sells **outcomes** — not frameworks, pages or
components.

> I design and build websites that make complicated businesses easier to
> trust — and easier to choose.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui,
Framer Motion, Prisma.

---

## Strategic change

Transformed the positioning from _"makes modern websites using Next.js"_ into
_"understands complicated businesses, identifies the commercial problem,
creates an intelligent design direction, builds the complete solution, and
explains why the decisions matter."_

Technology supports the evidence; it is not the sales proposition.

## Selected work

**Six flagship case studies** — each proves a different kind of judgement:

| # | Project | What it proves |
|---|---------|----------------|
| 1 | IBS Infra | Complex B2B information architecture |
| 2 | Bharat Electrosafe | Industrial product communication |
| 3 | DeviceDestination | Full-stack commerce |
| 4 | CloudSun | Dense operational product design (concept) |
| 5 | Saffron & Steam | Art direction and creative technology |
| 6 | Aarohan Legal | Editorial restraint and compliance thinking |

**Three laboratory experiments** — Casa Aurelia, PricePilot, DUST//SIGNAL —
kept small and clearly labelled as experiments, not client work.

## Homepage structure (persuasion sequence)

1. **Hero** — outcome-led headline, range, clear next action
2. **Capability proof strip** — four categories of range
3. **Selected work** — IBS & Bharat as large editorial features
4. **Commerce & product systems** — DeviceDestination + CloudSun paired
5. **Creative range** — Saffron & Steam + Aarohan Legal paired (contrast = point)
6. **Outcomes** — four client situations, not a service list
7. **Process** — direct collaboration, six concrete steps
8. **About** — concise, credible, no invented metrics
9. **Laboratory** — three small experiments
10. **Contact** — qualifying form + direct email fallback

Each flagship opens into a full case study (problem, constraints, strategy,
intervention, outcome, evidence, engineering notes, contextual CTA).

## Major files

```
src/
  app/
    layout.tsx              # fonts (Fraunces + Inter + JetBrains Mono), SEO, skip link, sticky footer
    page.tsx                # homepage composition + JSON-LD
    globals.css             # maroon / warm-neutral editorial design system
    api/contact/route.ts    # validated, spam-protected, rate-limited enquiry endpoint
    sitemap.ts / robots.ts  # SEO
  data/projects.ts          # single source of truth — 9 projects, types, helpers
  components/
    site/                   # header, footer, skip-link, section primitives, motion reveal
    portfolio/              # hero, capability-strip, work-section, flagship-story,
                            # outcomes, process, about, laboratory, contact-section,
                            # contact-form, project-cover (honest SVG/CSS covers)
  lib/validations/contact.ts # shared zod schema (client + server)
prisma/schema.prisma        # Enquiry model
```

## Verification

```bash
bun install
bun run lint        # ESLint — passes clean
npx tsc --noEmit    # TypeScript strict — passes clean
bun run dev         # http://localhost:3000
```

Verified in-browser:
- All sections render, no console errors, no hydration errors
- Case-study expansion works for every flagship
- Contact form validates client + server, persists enquiry, shows honest states
- No horizontal overflow at 360–390 px
- Mobile menu works; footer sticks to bottom; skip link & landmarks present
- Reduced-motion respected (Framer Motion + global CSS)

## Deploy (Vercel)

1. Connect the repo, framework preset **Next.js**.
2. Set environment variable `DATABASE_URL` to a real database connection
   (SQLite is used for local dev; Vercel serverless needs a persistent DB such
   as Vercel Postgres or an external Postgres/MySQL — update the Prisma
   `datasource` provider accordingly).
3. Deploy.

## Honest limitations

- `CloudSun` is a concept product; no live deployment is linked because none is
  stable enough to represent the work honestly.
- `PricePilot` has no public live link; verify or create a preview before
  linking.
- Project cover visuals are designed CSS/SVG architectural representations, not
  screenshots — kept honest rather than inventing interfaces.
- No fabricated metrics, testimonials, conversion rates or revenue claims
  appear anywhere on the site.

---

© Aditya. Built deliberately, not from a template.
