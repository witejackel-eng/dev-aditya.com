/**
 * Project metadata — single source of truth.
 *
 * Shared between the homepage (Selected Work + Creative Technology + Commerce
 * + Laboratory), the /work page, and every case-study route. Every project
 * card, filter and case-study deep-dive reads from this file.
 *
 * Content is written to sell business outcomes, not frameworks. Technology is
 * kept as secondary metadata. No fabricated metrics — every number is
 * structural and verifiable from the public repositories.
 *
 * The brief requires three tiers of presentation:
 *   - flagship  : large editorial case studies (6)
 *   - selected  : medium cards (folded into flagship/lab as needed)
 *   - laboratory: compact, clearly-labelled experiments (3)
 */

export type ProjectTier = 'flagship' | 'selected' | 'laboratory';

export type ProjectStatus = 'business' | 'concept' | 'experiment';

export type CapabilityTag =
  | 'business-websites'
  | 'commerce'
  | 'digital-products'
  | 'creative-technology';

export interface ProofPoint {
  label: string;
  value: string;
}

export interface CaseStudyData {
  /** Honest disclosure of project status. */
  disclosure: string;
  /** The real problem behind the interface. */
  problem: string;
  /** Meaningful constraints that shaped the solution. */
  constraints: string[];
  /** Structural decisions taken. */
  decisions: { num: string; title: string; desc: string }[];
  /** Concrete interventions made. */
  built: string[];
  /** Why the decisions matter to the business. */
  outcome: string;
  /** Verifiable, structural evidence. */
  proof: ProofPoint[];
  /** One honest moment — a real difficulty, not a humblebrag. */
  honestMoment: string;
  /** Timeline / how it went. */
  timeline: { num: string; title: string; desc: string }[];
  /** Deeper technical material, shown secondarily. */
  engineeringNotes: string[];
  /** Contextual CTA for the end of the case study. */
  contextualCta: { question: string; button: string };
}

export interface Project {
  slug: string;
  name: string;
  /** Short editorial category label, e.g. "LEGAL SERVICES". */
  industry: string;
  /** Concrete project type. */
  projectType: string;
  /** tier drives card size and case-study depth. */
  tier: ProjectTier;
  /** status drives the honest disclosure label. */
  status: ProjectStatus;
  /** Capabilities this project proves — used for /work filtering. */
  capabilities: CapabilityTag[];
  /** featuredRank drives homepage + work-page ordering (1 = first). */
  featuredRank: number;
  /** One-line capability interpretation, e.g. "Complex B2B information architecture". */
  proofRole: string;
  /** Outcome-oriented headline used on cards and section headers. */
  outcomeHeadline: string;
  /** One-sentence business challenge the project is built around. */
  challenge: string;
  /** Wider business context, used on the Work page. */
  context: string;
  /** Short tagline, used in pairing sections. */
  tagline: string;
  scope: string;
  role: string;
  /** How the built system serves the objective — no invented metrics. */
  outcome: string;
  /** Technology, kept as secondary metadata (rendered last). */
  technology: string[];
  /** Full case-study content. */
  caseStudy: CaseStudyData;
  liveUrl: string;
  caseStudyUrl: string;
  githubUrl: string;
  /** Legacy field — honest disclosure also lives inside caseStudy. */
  disclosure: string;
}

export const PROJECTS: Project[] = [
  /* ══════════════════════════ FLAGSHIP 1 · IBS INFRA ══════════════════════════ */
  {
    slug: 'ibs-infra',
    name: 'IBS Infra',
    industry: 'B2B TECHNOLOGY SERVICES',
    projectType: 'Corporate website transformation',
    tier: 'flagship',
    status: 'business',
    capabilities: ['business-websites'],
    featuredRank: 1,
    proofRole: 'Complex B2B information architecture',
    outcomeHeadline:
      'From a sprawling technology catalogue to one coherent sales system.',
    challenge:
      'A multi-discipline technology-services company sells six different divisions through one website, and every division demands equal prominence — leaving serious buyers lost in a flat catalogue.',
    context:
      'IBS Infra covers communication, AV, networking, fire-safety, security and call-centre services. The old site treated all six as equally important, which meant nothing read as important. The transformation reorganises six divisions into one credible commercial journey a serious buyer can actually follow.',
    tagline: 'Bring me the messy version.',
    scope:
      'Information architecture, corporate content strategy, visual direction, frontend engineering, admin and content tooling, SEO/accessibility/security.',
    role: 'Strategy, design and full-stack delivery',
    outcome:
      'A serious buyer can now find their division, understand what IBS does inside it, and send an enquiry that reaches the right team. The site reads as one credible company instead of six brochures stapled together.',
    technology: ['Next.js', 'TypeScript', 'Tailwind CSS', 'CMS', 'Vercel'],
    liveUrl: 'https://ibsinfra.com',
    caseStudyUrl: '/work/ibs-infra',
    githubUrl: 'https://github.com/witejackel-eng/IBS.com',
    disclosure:
      'Live production site. Built and deployed as a real business website, not a concept.',
    caseStudy: {
      disclosure:
        'Live production site. Built and deployed as a real business website, not a concept.',
      problem:
        'The business sold six different technology disciplines through one website, and every discipline wanted equal prominence. Buyers arrived looking for one service — fire-safety, or structured cabling, or a call-centre setup — and landed in a flat catalogue where everything looked equally important, which meant nothing read as important. Enquiries were generic, routing was manual, and the homepage tried to be a brochure for everything at once.',
      constraints: [
        'Six service divisions, each with its own vocabulary and buyer',
        'Legacy service descriptions that were technically accurate but commercially flat',
        'Multiple industry audiences (corporate, government, industrial, hospitality)',
        'SEO equity in existing service pages had to be preserved',
        'Mobile-first buyers researching on site surveys',
        'Admin team needed to maintain content without engineering help',
      ],
      decisions: [
        {
          num: '01',
          title: 'Division-first taxonomy',
          desc: 'Reorganised six divisions into a primary service taxonomy with a clear parent → child → capability hierarchy instead of a flat list.',
        },
        {
          num: '02',
          title: 'Dedicated division routes',
          desc: 'Gave each division its own landing route with an outcome narrative, not a generic service template applied six times.',
        },
        {
          num: '03',
          title: 'Capabilities vs industries',
          desc: 'Separated "what we do" from "where we do it" so buyers can enter by capability or by industry — two paths to the same enquiry.',
        },
        {
          num: '04',
          title: 'Lead-routing enquiry model',
          desc: 'Built an enquiry model that routes a fire-safety lead to the fire-safety team, not a generic inbox.',
        },
        {
          num: '05',
          title: 'Preserved legacy redirects',
          desc: 'Kept old URLs alive with redirects to protect organic search routes the business had earned over years.',
        },
      ],
      built: [
        'Division-first navigation that scales to six verticals without a mega-menu wall',
        'Service copy that leads with the buyer’s problem and ends with a concrete next step',
        'Admin layer so the team can publish and re-order services without touching code',
        'Structured data for services and organisation for honest search visibility',
        'Hardened forms, headers and security defaults for a public B2B surface',
      ],
      outcome:
        'A serious buyer can now find their division, understand what IBS actually does inside it, and send an enquiry that reaches the right team. The site reads as a single credible company instead of six brochures stapled together — and the team can keep it current without filing engineering tickets.',
      proof: [
        { label: 'Service divisions', value: '6 verticals, each with a dedicated route' },
        { label: 'Hierarchy', value: 'Parent → child → capability structure' },
        { label: 'Industry paths', value: 'Cross-cutting industry entry points' },
        { label: 'Lead routing', value: 'Enquiry model routes to the correct division' },
        { label: 'Legacy redirects', value: 'Preserved to protect organic search routes' },
        { label: 'Admin capability', value: 'Content team publishes without engineering' },
      ],
      honestMoment:
        'The hardest call was refusing to give every division "equal" homepage real estate. Six equal blocks is what the internal politics asked for and what makes a homepage unreadable. The compromise was a rotating featured-division surface plus a persistent six-way directory — prominence without hierarchy warfare.',
      timeline: [
        { num: '01', title: 'Audit', desc: 'Mapped all six divisions, their buyers and existing content.' },
        { num: '02', title: 'Architecture', desc: 'Designed the parent → child → capability taxonomy.' },
        { num: '03', title: 'Content', desc: 'Rewrote service copy to lead with the buyer’s problem.' },
        { num: '04', title: 'Build', desc: 'Frontend, admin layer, lead routing, redirects.' },
      ],
      engineeringNotes: [
        'Next.js App Router with server components for the marketing surface; isolated client components only where interaction requires them.',
        'Canonical URLs, Open Graph and structured data per service route; sitemap and robots generated from the same content model.',
        'Form submissions validated client and server side, with honeypot spam protection and fail-safe error states.',
        'Security headers, CSP-friendly asset loading and accessibility landmarks across every route.',
      ],
      contextualCta: {
        question: 'Have a complex service business that is difficult to explain?',
        button: 'Send me the catalogue',
      },
    },
  },

  /* ═══════════════════════ FLAGSHIP 2 · BHARAT ELECTROSAFE ═══════════════════════ */
  {
    slug: 'bharat-electrosafe',
    name: 'Bharat Electrosafe',
    industry: 'INDUSTRIAL SAFETY · ELECTRICAL MANUFACTURING',
    projectType: 'Industrial B2B product website',
    tier: 'flagship',
    status: 'business',
    capabilities: ['business-websites', 'commerce'],
    featuredRank: 2,
    proofRole: 'Industrial product communication',
    outcomeHeadline:
      'Made industrial safety products easier to understand, compare and enquire about.',
    challenge:
      'A manufacturer’s catalogue mixes product families, certifications and datasheets into one long list — engineers comparing options have to keep specs in their head and eventually phone sales to ask which variant fits their panel.',
    context:
      'Bharat Electrosafe manufactures electrical safety products. The product data was accurate but arranged for the manufacturer, not the buyer. The work reorganises product families, certifications, specifications and documents so an engineer can compare, qualify and raise a quotation request without phoning first.',
    tagline: 'Built credibility without shouting.',
    scope:
      'Product information architecture, technical specification system, product comparison, search migration, enquiry conversion, content governance.',
    role: 'Strategy, design and full-stack delivery',
    outcome:
      'An engineer can shortlist, compare and qualify products against their panel requirements, then raise a quotation request that already contains the context. The site keeps its engineering credibility while removing the friction that used to end in a phone call.',
    technology: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Drizzle ORM', 'Vercel'],
    liveUrl: 'https://bharat-electrosafe.vercel.app',
    caseStudyUrl: '/work/bharat-electrosafe',
    githubUrl: 'https://github.com/witejackel-eng/bharat-electrosafe',
    disclosure:
      'Live production site. Built and deployed as a real industrial product website.',
    caseStudy: {
      disclosure:
        'Live production site. Built and deployed as a real industrial product website.',
      problem:
        'The catalogue mixed product families, certification classes, ratings and datasheets into one long list. Engineers comparing a few options had to open six tabs, keep specs in their head, and eventually email to ask which variant actually fit their panel. The product data was accurate — it was just arranged for the manufacturer, not the buyer.',
      constraints: [
        'Multiple product families with overlapping specifications',
        'Certifications and compliance documents that buyers must verify',
        'Technical specifications that cannot be simplified into marketing copy',
        'Quotation-driven sales, not cart-driven checkout',
        'Mobile engineers reading datasheets on site',
        'Content accuracy is a safety issue, not a preference',
      ],
      decisions: [
        {
          num: '01',
          title: 'Consistent spec schema',
          desc: 'Grouped products into families with a consistent specification schema so every product answers the same questions in the same order.',
        },
        {
          num: '02',
          title: 'Comparison view',
          desc: 'Introduced a side-by-side comparison so engineers line up variants instead of tab-switching.',
        },
        {
          num: '03',
          title: 'Certifications as first-class',
          desc: 'Treated certifications as visible, verifiable, downloadable objects — not footnote text.',
        },
        {
          num: '04',
          title: 'Product-aware enquiry',
          desc: 'Replaced the generic contact form with a quotation request that already knows which product the buyer is looking at.',
        },
        {
          num: '05',
          title: 'Honest technical language',
          desc: 'Kept technical language honest; the site respects the engineer reading it rather than dumbing it down.',
        },
      ],
      built: [
        'Product data model enforcing a normalised specification schema across families',
        'Comparison interface that stays legible on mobile',
        'Datasheets and certificates attached directly to the relevant product',
        'Search migrated from the old flat catalogue to the new family-based structure',
        'Enquiry forms wired to carry product context into the quotation request',
      ],
      outcome:
        'An engineer can now shortlist, compare and qualify products against their panel requirements, then raise a quotation request that already contains the context. The site keeps its engineering credibility while removing the friction that used to end in a phone call — or a lost lead.',
      proof: [
        { label: 'Product families', value: 'Consistent spec schema across families' },
        { label: 'Comparison view', value: 'Side-by-side variant comparison' },
        { label: 'Certifications', value: 'First-class, verifiable, downloadable' },
        { label: 'Quotation path', value: 'Product-aware enquiry routing' },
        { label: 'Search migration', value: 'Re-indexed to family-based structure' },
        { label: 'Responsive', value: 'Datasheets legible on mobile' },
      ],
      honestMoment:
        'The temptation was to simplify the specifications for "marketing readability." That would have insulted the engineers who actually buy these products. The harder, correct call was to keep the technical language intact and instead fix the structure around it — so the specs stay honest and the buyer can finally find and compare them.',
      timeline: [
        { num: '01', title: 'Catalogue audit', desc: 'Mapped product families, specs and certifications.' },
        { num: '02', title: 'Schema design', desc: 'Built a normalised spec schema across families.' },
        { num: '03', title: 'Comparison', desc: 'Designed the side-by-side comparison interface.' },
        { num: '04', title: 'Enquiry', desc: 'Wired product context into the quotation path.' },
      ],
      engineeringNotes: [
        'Drizzle-backed product model enforcing a normalised specification schema so product data stays comparable.',
        'Comparison view built as a client component over a server-fetched product set; no full-catalogue client bundle.',
        'Datasheet and certificate assets optimised and lazy-loaded with descriptive alt text and accessible labels.',
        'Form validation shared between client and server via a single schema source.',
      ],
      contextualCta: {
        question: 'Need to turn technical products into a clearer buying journey?',
        button: 'Show me the catalogue',
      },
    },
  },

  /* ═══════════════════════ FLAGSHIP 3 · DEVICEDESTINATION ═══════════════════════ */
  {
    slug: 'device-destination',
    name: 'DeviceDestination',
    industry: 'ECOMMERCE · CONSUMER ELECTRONICS',
    projectType: 'Full-stack commerce platform',
    tier: 'flagship',
    status: 'business',
    capabilities: ['commerce', 'digital-products'],
    featuredRank: 3,
    proofRole: 'Full-stack commerce',
    outcomeHeadline:
      'Turned model-number chaos into a guided buying and checkout experience.',
    challenge:
      'Electronics buyers arrive knowing the exact model number they want — a conventional catalogue is useless. They need to land on the right variant, confirm it, compare alternatives, check GST-inclusive price, pay and get an invoice.',
    context:
      'DeviceDestination is an electronics storefront built around certainty, not browsing. The commerce system is engineered so that when a payment webhook is slow or fires twice, the order still lands in the right state.',
    tagline: 'The payment succeeded. The notification failed. The order still survives.',
    scope:
      'Product discovery and exact-model search, comparison, cart and checkout, GST-safe pricing, Razorpay integration, invoice generation, notifications, authentication.',
    role: 'Design, full-stack engineering and payments architecture',
    outcome:
      'A buyer finds the exact model, compares it, pays safely and receives a correct invoice — and when the payment provider’s webhook is slow or fires twice, the order still ends up correct. The commerce behaviour does not lose money to edge cases.',
    technology: ['Next.js', 'TypeScript', 'Drizzle ORM', 'Razorpay', 'Tailwind CSS', 'Vercel'],
    liveUrl: 'https://device-destination-rose.vercel.app',
    caseStudyUrl: '/work/device-destination',
    githubUrl: 'https://github.com/witejackel-eng/DeviceDestination',
    disclosure:
      'Deployed ecommerce application. Verify the current deployment before publishing the link publicly.',
    caseStudy: {
      disclosure:
        'Deployed ecommerce application. Verify the current deployment before publishing the link publicly.',
      problem:
        'Buyers in this category do not browse — they arrive knowing the exact model number they want. A conventional catalogue front page is useless to them. They need to land on the right variant, confirm it is the right one, compare it against the one they almost bought instead, check the GST-inclusive price, pay, and get an invoice they can file. Most storefronts optimise for browsing. This one had to optimise for certainty.',
      constraints: [
        'Model-number-first buying behaviour',
        'GST-safe pricing that survives partial checkout and refund paths',
        'Payment reliability under webhook delay, duplicate callback and network failure',
        'Invoice generation that matches the payment state, not the request state',
        'Authentication that does not block the buyer from checking out',
        'Mobile checkout with a long specification list',
      ],
      decisions: [
        {
          num: '01',
          title: 'Discovery by model number',
          desc: 'Designed discovery around exact-model search and guided comparison, not category browsing.',
        },
        {
          num: '02',
          title: 'Checkout as a saga',
          desc: 'Treated checkout as a saga with idempotent steps, not a single optimistic request.',
        },
        {
          num: '03',
          title: 'Payment is source of truth',
          desc: 'Made payment verification the source of truth — the order’s state follows the payment, not the other way around.',
        },
        {
          num: '04',
          title: 'Invoice tied to verified payment',
          desc: 'Kept the invoice tied to the verified payment record so a failed notification can never produce a phantom invoice.',
        },
        {
          num: '05',
          title: 'Guest checkout',
          desc: 'Let buyers check out as guests and claim the order later, so auth never costs a sale.',
        },
      ],
      built: [
        'Exact-model search with comparison against nearest alternatives',
        'Idempotent checkout keyed to the payment attempt',
        'Webhook recovery so a delayed or duplicate Razorpay callback reconciles instead of duplicating',
        'Invoices generated from the verified payment record, not the cart',
        'Notifications fired from order-state transitions with safe retry',
      ],
      outcome:
        'A buyer can find the exact model, compare it, pay safely, and receive a correct invoice — and when the payment provider’s webhook is slow or fires twice, the order still ends up in the right state. The commerce behaviour is boring in the best way: it does not lose money to edge cases.',
      proof: [
        { label: 'Exact-model search', value: 'Discovery built around model numbers' },
        { label: 'Comparison', value: 'Variant comparison before checkout' },
        { label: 'GST-safe pricing', value: 'Consistent across checkout and refund paths' },
        { label: 'Payment verification', value: 'Razorpay with idempotent reconciliation' },
        { label: 'Webhook recovery', value: 'Duplicate and delayed callbacks handled' },
        { label: 'Invoice generation', value: 'Tied to verified payment record' },
        { label: 'Authentication', value: 'Guest checkout with later claim' },
      ],
      honestMoment:
        'The payment succeeded but the notification failed on the first real order. That is the moment most ecommerce systems fall apart — the order exists in the payment provider but not in the database, or worse, exists twice. The whole architecture was built so that exact scenario reconciles instead of corrupting. It did.',
      timeline: [
        { num: '01', title: 'Discovery', desc: 'Built exact-model search and comparison.' },
        { num: '02', title: 'Checkout saga', desc: 'Designed idempotent checkout steps.' },
        { num: '03', title: 'Payments', desc: 'Razorpay integration with webhook recovery.' },
        { num: '04', title: 'Invoices', desc: 'Generated from verified payment records.' },
      ],
      engineeringNotes: [
        'Checkout modelled as a saga: each step (reserve, charge, verify, fulfil) is idempotent and reconcilable.',
        'Razorpay integration uses signature verification plus an independent server-side status poll so a missing webhook cannot orphan an order.',
        'Pricing is computed server-side from a single GST-aware function reused by cart, checkout, invoice and refund paths.',
        'Notifications are emitted from order-state transitions with at-least-once delivery and idempotent consumers.',
      ],
      contextualCta: {
        question: 'Need ecommerce that handles the operational details too?',
        button: 'Tell me what breaks',
      },
    },
  },

  /* ═══════════════════════ FLAGSHIP 4 · CLOUDSUN ═══════════════════════ */
  {
    slug: 'cloudsun',
    name: 'CloudSun',
    industry: 'SAAS · CALL-CENTRE OPERATIONS',
    projectType: 'Operational product design (concept)',
    tier: 'flagship',
    status: 'concept',
    capabilities: ['digital-products'],
    featuredRank: 4,
    proofRole: 'Dense operational product design',
    outcomeHeadline:
      'Designed a 24-route operations workspace without losing the operator.',
    challenge:
      'A call-centre workspace has live queues, agent states, escalations, compliance steps and reporting all demanding attention at once — the default outcome is a dashboard wall an operator scans instead of reads.',
    context:
      'CloudSun is a concept operations workspace for a call-centre. Twenty-four application routes, three role-based workflows, dense dashboards and a shared status language — designed so an operator using it eight hours a day can still find the next thing they need to do.',
    tagline: 'Motion with a job.',
    scope:
      'Application information architecture, role-based navigation, dashboard hierarchy, status language system, design system, multi-route frontend.',
    role: 'Product design and front-end architecture',
    outcome:
      'A concept workspace proving dense operational software can be designed without drowning the operator. The hierarchy is explicit, the status language is consistent, and 24 routes collapse into a small number of mental models an agent can actually hold.',
    technology: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zustand'],
    liveUrl: '',
    caseStudyUrl: '/work/cloudsun',
    githubUrl: 'https://github.com/witejackel-eng/cloudsun',
    disclosure:
      'Concept product demonstration, not a commissioned client deployment. No live production environment is linked because none is stable enough to represent the work honestly.',
    caseStudy: {
      disclosure:
        'Concept product demonstration, not a commissioned client deployment. Designed end-to-end as an operational workspace; no live production environment is linked because none is stable enough to represent the work honestly.',
      problem:
        'Operational software fails when it treats every screen as equally urgent. A call-centre workspace has live queues, agent states, escalations, compliance steps and reporting — all demanding attention at once. The default outcome is a dashboard wall that an operator scans instead of reads. The design problem is hierarchy: deciding what an agent, a supervisor and an admin each need to see first, and making the rest reachable without being loud.',
      constraints: [
        'Twenty-four distinct application routes across the product',
        'Three primary roles with overlapping but unequal needs',
        'Information density that must not become visual noise',
        'Eight-hour daily use — every interaction tax compounds',
        'Status language that must mean the same thing across routes',
        'Concept project — no real call-centre data to validate against',
      ],
      decisions: [
        {
          num: '01',
          title: 'Role-weighted priority grid',
          desc: 'Mapped all 24 routes to a role-weighted priority grid before designing any screen.',
        },
        {
          num: '02',
          title: 'Shared status language',
          desc: 'Defined a status language (open, holding, escalated, resolved, breached) reused across every route so an operator never re-learns meaning.',
        },
        {
          num: '03',
          title: 'Now vs later',
          desc: 'Separated "now" surfaces (live queue, active case) from "later" surfaces (reports, config) at the navigation level, not just visually.',
        },
        {
          num: '04',
          title: 'Density as a primitive',
          desc: 'Built a design system where density is a primitive — compact tables, inline status, keyboard-first actions — rather than a compromise.',
        },
        {
          num: '05',
          title: 'Motion signals state',
          desc: 'Scoped motion to signal state change, never to decorate.',
        },
      ],
      built: [
        'Primary operator workspace as a single focused queue with contextual action',
        'Supervisor views as overlays on the operator view, so context is never lost',
        'Status component system reused verbatim across all 24 routes',
        'Keyboard-first navigation for power-operator use',
        'Documented route map and role matrix as a living artifact',
      ],
      outcome:
        'A concept workspace that proves dense operational software can be designed without drowning the operator. The hierarchy is explicit, the status language is consistent, and the 24 routes collapse into a small number of mental models an agent can actually hold.',
      proof: [
        { label: 'Application routes', value: '24 routes mapped to a role priority grid' },
        { label: 'Role-based workflows', value: 'Agent, supervisor, admin' },
        { label: 'Status language', value: 'Shared system reused across routes' },
        { label: 'Dashboard hierarchy', value: '"now" vs "later" separated at nav level' },
        { label: 'Design system', value: 'Density as a primitive' },
        { label: 'Keyboard navigation', value: 'Power-operator first' },
      ],
      honestMoment:
        'As a concept project there is no real call-centre data to prove the hierarchy works. The honest mitigation is that the route map and role matrix are documented as artifacts an operator could audit — the design decisions are explicit and arguable, not hidden inside a polished screen.',
      timeline: [
        { num: '01', title: 'Route map', desc: 'Mapped 24 routes to a role priority grid.' },
        { num: '02', title: 'Status language', desc: 'Defined the shared status system.' },
        { num: '03', title: 'Operator surface', desc: 'Designed the focused queue workspace.' },
        { num: '04', title: 'System', desc: 'Built the density-first design system.' },
      ],
      engineeringNotes: [
        'Front-end architected for a large route count without a monolithic bundle — route-level code splitting and shared layout shells.',
        'Zustand stores scoped per role-context to keep operator state local and fast.',
        'Motion library scoped to state transitions; respects prefers-reduced-motion everywhere.',
        'Design tokens emitted for status colours so the status language is enforced at the token layer.',
      ],
      contextualCta: {
        question: 'Designing software people must use all day?',
        button: 'Map the routes with me',
      },
    },
  },

  /* ═══════════════════════ FLAGSHIP 5 · SAFFRON & STEAM ═══════════════════════ */
  {
    slug: 'saffron-steam-experience',
    name: 'Saffron & Steam',
    industry: 'HOSPITALITY · BRAND EXPERIENCE',
    projectType: 'Interactive brand experience',
    tier: 'flagship',
    status: 'business',
    capabilities: ['creative-technology', 'business-websites'],
    featuredRank: 5,
    proofRole: 'Art direction and creative technology',
    outcomeHeadline:
      'Used motion and WebGL to sell the atmosphere before the first cup was poured.',
    challenge:
      'A hospitality concept does not sell a product — it sells the feeling of being there. A conventional menu-and-gallery website would describe the place without evoking it.',
    context:
      'Saffron & Steam is an interactive brand experience for a hospitality concept. Editorial art direction, motion and WebGL communicate mood, memory and differentiation — not to demonstrate a graphics library. Built around a Delhi garden café at golden hour.',
    tagline: 'No template soup.',
    scope:
      'Brand art direction, editorial design, motion direction, WebGL experience, narrative interaction, hospitality UX.',
    role: 'Art direction, motion design and creative engineering',
    outcome:
      'Visitors land in an atmosphere, not a template. The brand reads as intentional and memorable before anyone reads a word of copy — and the practical information is still there for the person who actually wants to visit.',
    technology: ['Next.js', 'TypeScript', 'Three.js', 'React Three Fiber', 'GSAP', 'Framer Motion'],
    liveUrl: 'https://saffron-steam-experience.vercel.app',
    caseStudyUrl: '/work/saffron-steam-experience',
    githubUrl: 'https://github.com/witejackel-eng/saffron-steam-experience',
    disclosure:
      'Deployed interactive brand experience. Creative direction and engineering by Aditya.',
    caseStudy: {
      disclosure:
        'Deployed interactive brand experience. Creative direction and engineering by Aditya.',
      problem:
        'A hospitality concept does not sell a product — it sells the feeling of being there. A conventional menu-and-gallery website would describe the place without evoking it. The work was to make the website itself feel like the first visit: warm, slow, considered, a little theatrical, and impossible to confuse with the ten other café sites built from the same template.',
      constraints: [
        'Atmosphere is the product — copy alone cannot carry it',
        'WebGL and motion are heavy; they must not punish mobile visitors',
        'Brand had no existing photography library to lean on',
        'The experience must still communicate practical information (location, hours, menu)',
        'Reduced-motion and low-power devices need a graceful fallback, not a broken site',
      ],
      decisions: [
        {
          num: '01',
          title: 'Art direction first',
          desc: 'Led with art direction — type, colour, pacing and motion carry the mood before any 3D loads.',
        },
        {
          num: '02',
          title: 'Selective WebGL',
          desc: 'Used WebGL selectively to reinforce a moment, not to decorate the whole page.',
        },
        {
          num: '03',
          title: 'Motion as pacing',
          desc: 'Treated motion as pacing: slow reveals, deliberate scroll cadence, no constant movement.',
        },
        {
          num: '04',
          title: 'Practical layer underneath',
          desc: 'Kept practical information (menu, hours, location) accessible without fighting the atmosphere.',
        },
        {
          num: '05',
          title: 'Static poster fallback',
          desc: 'Built a static poster fallback so the experience never depends on WebGL to be usable.',
        },
      ],
      built: [
        'Editorial type system that carries the brand with or without motion',
        'WebGL moments that resolve to static posters on reduced-motion or low-power devices',
        'Scroll-linked motion choreographed to pace the narrative, not to show off',
        'Practical content layered underneath the atmospheric surface — one tap away, not buried',
        'WebGL hero scene with custom lathe-geometry ceramic cup and tube-geometry steam ribbon',
        'Day-to-night scroll sequence transitioning morning coffee to evening wine',
      ],
      outcome:
        'Visitors land in an atmosphere, not a template. The brand reads as intentional and memorable before anyone reads a word of copy — and the practical information is still there for the person who actually wants to visit. Mobile and reduced-motion visitors get the brand without paying the performance cost.',
      proof: [
        { label: 'Art direction', value: 'Original editorial type and colour system' },
        { label: 'WebGL moments', value: 'Selective, poster-backed, reduced-motion safe' },
        { label: 'Motion pacing', value: 'Scroll-linked narrative, not decoration' },
        { label: 'Practical layer', value: 'Menu, hours, location one tap away' },
        { label: 'Fallback', value: 'Static poster experience for low-power devices' },
      ],
      honestMoment:
        'The hardest part was balancing WebGL performance with visual richness. The steam ribbon and marigold petals needed to feel alive without tanking frame rates on mobile. The solution was adaptive DPR, geometry optimisation, and a static poster fallback for reduced-motion preferences — not pretending the heavy version works everywhere.',
      timeline: [
        { num: '01', title: 'Mood & narrative', desc: 'Define the golden-hour café story and visual direction.' },
        { num: '02', title: 'WebGL hero', desc: 'Build the ceramic cup, steam, petals and sunset lighting.' },
        { num: '03', title: 'Scroll system', desc: 'Create day-to-night transitions and editorial sections.' },
        { num: '04', title: 'Polish', desc: 'Optimise performance, accessibility and mobile experience.' },
      ],
      engineeringNotes: [
        'WebGL loaded lazily and only when the device and connection can afford it; a static poster is the default until then.',
        'Motion choreographed through Framer Motion and GSAP with prefers-reduced-motion short-circuiting every transition.',
        'Image and font loading sequenced so LCP stays fast even with a heavy creative surface above the fold.',
        'Practical content server-rendered so it is indexable and accessible regardless of WebGL support.',
      ],
      contextualCta: {
        question: 'Need a brand experience people will actually remember?',
        button: 'Bring me the mood',
      },
    },
  },

  /* ═══════════════════════ FLAGSHIP 6 · AAROHAN LEGAL ═══════════════════════ */
  {
    slug: 'aarohan-legal',
    name: 'Aarohan Legal',
    industry: 'LEGAL SERVICES',
    projectType: 'Corporate website concept',
    tier: 'flagship',
    status: 'business',
    capabilities: ['business-websites'],
    featuredRank: 6,
    proofRole: 'Editorial restraint and compliance thinking',
    outcomeHeadline:
      'Built credibility when conventional marketing tactics were not available.',
    challenge:
      'A law firm cannot market the way a SaaS company does — no testimonials, no fabricated results, no stock photography. The default legal-website template fails because it leans on exactly those tactics.',
    context:
      'Aarohan Legal is a boutique legal practice website built under real professional restrictions. Credibility comes from structure, typography, publishing discipline and a controlled enquiry path — not from the crutches conventional marketing provides.',
    tagline: "Designer's eye. Developer's hands. Business outcomes in the middle.",
    scope:
      'Editorial design system, content governance, publishing rules, procedural visual systems, restraint-led UX, enquiry design.',
    role: 'Strategy, editorial design and full-stack delivery',
    outcome:
      'The site reads as a serious firm without ever borrowing the tactics it is not allowed to use. Credibility comes from how clearly the practice is structured, how disciplined the publishing is, and how restrained the visual language is.',
    technology: ['Next.js', 'TypeScript', 'Three.js', 'Framer Motion'],
    liveUrl: 'https://aarohan-legal.vercel.app',
    caseStudyUrl: '/work/aarohan-legal',
    githubUrl: 'https://github.com/witejackel-eng/aarohan-legal',
    disclosure:
      'Deployed professional-services website. Built under explicit marketing restrictions.',
    caseStudy: {
      disclosure:
        'Deployed professional-services website. Built under explicit marketing restrictions.',
      problem:
        'A law firm cannot market the way a SaaS company does. No testimonials without consent, no results claims that cannot be substantiated, no comparisons that imply superiority, no generic legal stock photography of gavels and handshakes, no false credentials. The default legal-website template fails here because it leans on exactly those tactics. The work was to build credibility without any of the crutches — using structure, restraint and editorial discipline instead.',
      constraints: [
        'No testimonials without verified consent',
        'No fabricated results, settlements or success rates',
        'No aggressive or comparative advertising',
        'No generic legal stock photography',
        'No false credentials or implied affiliations',
        'Content accuracy is a professional and ethical obligation',
      ],
      decisions: [
        {
          num: '01',
          title: 'Practice-area navigation',
          desc: 'Made practice-area structure the primary navigation — credibility comes from being specific about what the firm does and does not do.',
        },
        {
          num: '02',
          title: 'Publishing review state',
          desc: 'Established a publishing model where every article has a review state, so unverified content cannot reach the site.',
        },
        {
          num: '03',
          title: 'Procedural visual system',
          desc: 'Designed a procedural visual system — typography, rules, numbered steps — that signals rigour without ornament.',
        },
        {
          num: '04',
          title: 'No stock photography',
          desc: 'Replaced stock photography with type, structure and honest procedural diagrams.',
        },
        {
          num: '05',
          title: 'Qualifying without pressure',
          desc: 'Built an enquiry path that qualifies without pressuring — no urgency theatre, no "limited slots".',
        },
      ],
      built: [
        'Editorial type and layout system tuned for long-form legal reading',
        'Content governance layer with review states before publish',
        'Procedural visuals (process diagrams, numbered practice steps) instead of stock imagery',
        'Practice-area copy that is specific and honest about scope',
        'Controlled enquiry form that respects the visitor’s situation',
      ],
      outcome:
        'The site reads as a serious firm without ever borrowing the tactics it is not allowed to use. Credibility comes from how clearly the practice is structured, how disciplined the publishing is, and how restrained the visual language is — which, for a law firm, is exactly the point.',
      proof: [
        { label: 'Practice areas', value: 'Specific, scope-honest structure' },
        { label: 'Publishing rules', value: 'Review state before any publish' },
        { label: 'Visual system', value: 'Procedural, no stock photography' },
        { label: 'Enquiry design', value: 'Qualifying without pressure' },
        { label: 'Content governance', value: 'Unverified content cannot reach the site' },
        { label: 'Editorial reading', value: 'Type system tuned for long-form legal' },
      ],
      honestMoment:
        'The restriction that hurt most was no testimonials. Every other legal site leans on them. Building credibility without them meant the structure itself had to do the persuading — practice areas had to be specific, publishing had to be disciplined, and the visual language had to signal seriousness through restraint rather than ornament.',
      timeline: [
        { num: '01', title: 'Restrictions', desc: 'Mapped the marketing restrictions and what they forbid.' },
        { num: '02', title: 'Structure', desc: 'Designed practice-area navigation and publishing rules.' },
        { num: '03', title: 'Visual system', desc: 'Built the procedural, ornament-free design language.' },
        { num: '04', title: 'Enquiry', desc: 'Designed the qualifying, non-pressuring contact path.' },
      ],
      engineeringNotes: [
        'MDX-driven content with a frontmatter review-state gate so drafts cannot render in production.',
        'Editorial type system with reading-optimised measure, leading and rhythm for long-form legal text.',
        'Procedural visuals built as SVG from the same design tokens — no binary stock assets.',
        'Enquiry form validated client and server, with honest submission states and a direct email fallback.',
      ],
      contextualCta: {
        question: 'Need credibility without marketing theatre?',
        button: 'Send me the restrictions',
      },
    },
  },

  /* ═══════════════════════ LABORATORY ═══════════════════════ */
  {
    slug: 'casa-aurelia',
    name: 'Casa Aurelia',
    industry: 'LUXURY REAL ESTATE',
    projectType: 'Editorial property presentation (experiment)',
    tier: 'laboratory',
    status: 'experiment',
    capabilities: ['business-websites', 'creative-technology'],
    featuredRank: 7,
    proofRole: 'Luxury editorial presentation',
    outcomeHeadline: 'Luxury property discovery without the portal aesthetic.',
    challenge:
      'Luxury property online defaults to the portal aesthetic: filters, grids, price-first cards. A discerning buyer is not searching a portal — they are deciding whether a place is worth visiting.',
    context:
      'Casa Aurelia is an editorial atelier for presenting luxury property — proof that high-end real estate can feel curated and considered instead of resembling a listings portal.',
    tagline: 'Built to learn.',
    scope: 'Editorial design, property presentation, responsive layout.',
    role: 'Editorial design and front-end',
    outcome:
      'A small experiment proving luxury property can be presented editorially without losing the practical layer a real buyer still needs.',
    technology: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://real-estate-atelier.vercel.app',
    caseStudyUrl: '/work/casa-aurelia',
    githubUrl: 'https://github.com/witejackel-eng/real-estate-atelier',
    disclosure:
      'Experimental atelier. Built to learn editorial luxury presentation, not a commissioned client project.',
    caseStudy: {
      disclosure:
        'Experimental atelier. Built to learn editorial luxury presentation, not a commissioned client project.',
      problem:
        'Luxury property online defaults to the portal aesthetic: filters, grids, price-first cards. A discerning buyer is not searching a portal — they are deciding whether a place is worth visiting. The experiment was to present property the way a magazine presents a subject.',
      constraints: [
        'No portal-style filter grid',
        'Photography-led but type-supported',
        'Must feel curated, not indexed',
      ],
      decisions: [
        { num: '01', title: 'Editorial over grid', desc: 'Led with editorial layout over filter grid.' },
        { num: '02', title: 'Typography carries hierarchy', desc: 'Let typography carry hierarchy where portals use badges.' },
        { num: '03', title: 'Practical but secondary', desc: 'Kept practical details reachable but never primary.' },
      ],
      built: [
        'Magazine-style property presentation',
        'Restrained, photography-led layout',
        'Quiet, considered enquiry path',
      ],
      outcome:
        'A small experiment proving luxury property can be presented editorially without losing the practical layer a real buyer still needs.',
      proof: [
        { label: 'Editorial layout', value: 'Magazine-style over portal grid' },
        { label: 'Responsive', value: 'Considered at mobile and desktop' },
      ],
      honestMoment:
        'As an experiment with no real buyer to test against, the honest measure is whether the presentation feels different from a portal. It does — but whether that difference converts discerning buyers is a question only a real listing can answer.',
      timeline: [
        { num: '01', title: 'Direction', desc: 'Defined the editorial-vs-portal contrast.' },
        { num: '02', title: 'Layout', desc: 'Built the magazine-style presentation.' },
      ],
      engineeringNotes: [
        'Static editorial presentation, optimised images, no heavy runtime.',
      ],
      contextualCta: {
        question: 'Selling something that deserves more than a card grid?',
        button: 'Show me the subject',
      },
    },
  },
  {
    slug: 'pricepilot',
    name: 'PricePilot',
    industry: 'PRICING · DECISION SUPPORT',
    projectType: 'Data-heavy UX (experiment)',
    tier: 'laboratory',
    status: 'experiment',
    capabilities: ['digital-products'],
    featuredRank: 8,
    proofRole: 'Data-heavy decision-support UX',
    outcomeHeadline: 'A pricing spreadsheet that grew up and learned interface design.',
    challenge:
      'Pricing decisions often live in a spreadsheet that one person understands. The experiment was to give that logic a real interface where the decision, not the formula, is the thing on screen.',
    context:
      'PricePilot is a decision-support interface for pricing logic — taking Excel/CSV workflows and giving them an interface, so a person making pricing decisions can see the consequences without living in a spreadsheet.',
    tagline: 'A pricing spreadsheet that grew up.',
    scope: 'Data-heavy UX, pricing logic, CSV/Excel workflows, dashboard design.',
    role: 'Product design and front-end',
    outcome:
      'A useful experiment in turning spreadsheet logic into a decision interface — the kind of thinking that transfers directly to operational product work.',
    technology: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    liveUrl: '',
    caseStudyUrl: '/work/pricepilot',
    githubUrl: 'https://github.com/witejackel-eng/pricepilot',
    disclosure:
      'Experimental project. Built to learn data-heavy decision-support UX. No stable public preview linked.',
    caseStudy: {
      disclosure:
        'Experimental project. Built to learn data-heavy decision-support UX. Verify or create a stable preview before linking publicly.',
      problem:
        'Pricing decisions often live in a spreadsheet that one person understands. The experiment was to take that spreadsheet’s logic — tiers, margins, scenarios — and give it an interface where the decision, not the formula, is the thing on screen.',
      constraints: [
        'CSV/Excel as the real source of truth',
        'Pricing logic is non-trivial but must stay legible',
        'Decision, not data entry, is the job',
      ],
      decisions: [
        { num: '01', title: 'Decision above data', desc: 'Surface the decision and its consequences, hide the formula mechanics.' },
        { num: '02', title: 'Scenarios side by side', desc: 'Let scenarios live side by side instead of across tabs.' },
        { num: '03', title: 'Spreadsheet stays source', desc: 'Keep the spreadsheet importable so it stays the source of truth.' },
      ],
      built: [
        'Scenario comparison interface',
        'CSV import and a legible pricing table',
        'Decision visible above the data',
      ],
      outcome:
        'A useful experiment in turning spreadsheet logic into a decision interface — the kind of thinking that transfers directly to operational product work.',
      proof: [
        { label: 'Scenario comparison', value: 'Side-by-side pricing scenarios' },
        { label: 'CSV workflow', value: 'Spreadsheet stays source of truth' },
        { label: 'Decision-led UX', value: 'Decision above the data' },
      ],
      honestMoment:
        'The experiment has no real pricing team to validate against. The honest value is the transferable skill — taking dense spreadsheet logic and making the decision legible — not the specific interface.',
      timeline: [
        { num: '01', title: 'Logic', desc: 'Mapped the spreadsheet pricing logic.' },
        { num: '02', title: 'Interface', desc: 'Built the scenario comparison.' },
      ],
      engineeringNotes: [
        'Client-side parsing of CSV with a normalised pricing model; no sensitive data leaves the browser.',
      ],
      contextualCta: {
        question: 'Have a spreadsheet that deserves a real interface?',
        button: 'Send me the formulas',
      },
    },
  },
  {
    slug: 'dust-signal',
    name: 'DUST//SIGNAL',
    industry: 'CREATIVE TECHNOLOGY',
    projectType: 'Generative interactive system',
    tier: 'laboratory',
    status: 'experiment',
    capabilities: ['creative-technology'],
    featuredRank: 9,
    proofRole: 'Generative interaction systems',
    outcomeHeadline:
      'Generative systems, procedural sound and mathematics as interaction.',
    challenge:
      'Turn mathematical systems, probability and procedural sound into a coherent interactive experience that is expressive without becoming visual noise.',
    context:
      'DUST//SIGNAL is a self-initiated computational observatory connecting seeded simulations, generative visuals and user-initiated audio across a multi-route world. Kept small on purpose.',
    tagline: 'The Useful Experiments Department.',
    scope: 'Generative systems, procedural sound, experimental interaction.',
    role: 'Concept, design, frontend and generative systems',
    outcome:
      'A small, honest experiment that keeps creative-coding instincts sharp — the kind of thinking that surfaces later in real brand work like Saffron & Steam.',
    technology: ['Next.js', 'TypeScript', 'Three.js', 'Web Audio API'],
    liveUrl: 'https://dune-aditya.vercel.app',
    caseStudyUrl: '/work/dust-signal',
    githubUrl: 'https://github.com/witejackel-eng/dune',
    disclosure:
      'Experimental creative-coding project. Built to explore generative interaction; small by design.',
    caseStudy: {
      disclosure:
        'Experimental creative-coding project. Built to explore generative interaction; small by design.',
      problem:
        'An experiment with no client and no brief — the question was whether mathematics and procedural sound could become the interaction itself, rather than decoration on top of a conventional interface.',
      constraints: [
        'Must stay small and self-contained',
        'Performance on modest devices',
        'Reduced-motion and silent fallbacks',
      ],
      decisions: [
        { num: '01', title: 'System is the interface', desc: 'Let the generative system be the interface.' },
        { num: '02', title: 'Sound coupled to signal', desc: 'Couple sound to signal so they share a single behaviour.' },
        { num: '03', title: 'Short by design', desc: 'Keep it short — an experiment, not a product.' },
      ],
      built: [
        'Procedural visual system driven by signal math',
        'Web Audio coupled to the same signal',
        'Reduced-motion and silent fallbacks',
      ],
      outcome:
        'A small, honest experiment that keeps creative-coding instincts sharp — the kind of thinking that surfaces later in real brand work like Saffron & Steam.',
      proof: [
        { label: 'Generative system', value: 'Signal-driven visuals' },
        { label: 'Procedural sound', value: 'Coupled to the same signal' },
        { label: 'Fallbacks', value: 'Reduced-motion and silent modes' },
      ],
      honestMoment:
        'The experiment has no commercial application. Its honest value is keeping the creative-coding instincts sharp — the same instincts that made Saffron & Steam work when a real brief came along.',
      timeline: [
        { num: '01', title: 'Signal', desc: 'Built the procedural visual system.' },
        { num: '02', title: 'Sound', desc: 'Coupled Web Audio to the signal.' },
      ],
      engineeringNotes: [
        'Canvas + Web Audio on a single signal source; lazy-initialised and capped to protect modest devices.',
      ],
      contextualCta: {
        question: 'Curious whether generative thinking fits a real brief?',
        button: 'Test it on something real',
      },
    },
  },
];

/* ══════════════════════════ DERIVED HELPERS ══════════════════════════ */

export const FLAGSHIP_PROJECTS = PROJECTS.filter((p) => p.tier === 'flagship').sort(
  (a, b) => a.featuredRank - b.featuredRank,
);

export const LABORATORY_PROJECTS = PROJECTS.filter((p) => p.tier === 'laboratory').sort(
  (a, b) => a.featuredRank - b.featuredRank,
);

/** Corporate + creative groups — preserved for backward compatibility. */
export const CORPORATE_PROJECTS = PROJECTS.filter(
  (p) => p.capabilities.includes('business-websites') && p.tier === 'flagship',
);
export const CREATIVE_PROJECTS = PROJECTS.filter(
  (p) => p.capabilities.includes('creative-technology'),
);

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const CAPABILITY_FILTERS: { id: CapabilityTag; label: string }[] = [
  { id: 'business-websites', label: 'Business websites' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'digital-products', label: 'Digital products' },
  { id: 'creative-technology', label: 'Creative technology' },
];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  business: 'Live project',
  concept: 'Concept',
  experiment: 'Experiment',
};
