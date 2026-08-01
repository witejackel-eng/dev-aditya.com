/**
 * Aditya — portfolio data architecture.
 *
 * Single source of truth for every project card, flagship story, case study
 * deep-dive, laboratory entry and capability label on the site. Content is
 * written to sell business outcomes, not frameworks. No fabricated metrics —
 * every number is structural and verifiable from the public repositories.
 */

export type ProjectStatus = "client" | "business" | "concept" | "experiment";

export type ProjectTier = "flagship" | "selected" | "laboratory";

export type CapabilityTag =
  | "business-websites"
  | "commerce"
  | "digital-products"
  | "creative-technology";

export interface ProofPoint {
  label: string;
  detail: string;
}

export interface CaseStudy {
  /** A short, honest disclosure of project status. */
  disclosure: string;
  /** The real problem behind the interface. */
  businessProblem: string;
  /** Meaningful constraints that shaped the solution. */
  constraints: string[];
  /** Structural decisions taken. */
  strategy: string[];
  /** Concrete interventions made. */
  intervention: string[];
  /** Why the decisions matter to the business. */
  outcome: string;
  /** Verifiable, structural evidence. */
  evidence: ProofPoint[];
  /** Deeper technical material, shown secondarily. */
  engineeringNotes: string[];
}

export interface PortfolioProject {
  slug: string;
  name: string;
  industry: string;
  projectType: string;
  status: ProjectStatus;
  tier: ProjectTier;
  featuredRank: number;

  /** One-line capability interpretation, e.g. "Complex B2B information architecture". */
  proofRole: string;
  /** Outcome-oriented headline used on cards and section headers. */
  outcomeHeadline: string;
  /** Two-to-three sentence summary. */
  summary: string;

  /** Short tagline used on the creative/commerce pairing sections. */
  tagline: string;

  role: string;
  scope: string[];
  capabilities: CapabilityTag[];
  /** Tech is secondary evidence — never the headline. */
  technology: string[];

  /** Visual motif key drives the CSS/SVG cover, keeping visuals honest. */
  motif:
    | "taxonomy"
    | "grid-compare"
    | "checkout-flow"
    | "routes"
    | "steam"
    | "restraint"
    | "editorial-lux"
    | "data-grid"
    | "signal";

  accent: "maroon" | "ochre" | "ink" | "sand";

  liveUrl?: string;
  liveLabel?: string;
  githubUrl: string;

  caseStudy: CaseStudy;

  /** Contextual CTA used at the end of each case study. */
  contextualCta: {
    question: string;
    button: string;
  };
}

export const projects: PortfolioProject[] = [
  /* ─────────────────────────────  FLAGSHIP 1  ───────────────────────────── */
  {
    slug: "ibs-infra",
    name: "IBS Infra",
    industry: "B2B Technology Services",
    projectType: "Corporate website transformation",
    status: "business",
    tier: "flagship",
    featuredRank: 1,
    proofRole: "Complex B2B information architecture",
    outcomeHeadline:
      "From a sprawling technology catalogue to one coherent sales system.",
    tagline: "Bring me the messy version.",
    summary:
      "A multi-discipline technology-services company with communication, AV, networking, fire-safety, security and call-centre divisions — reorganised into one credible commercial journey that a serious buyer can actually follow.",
    role: "Strategy, design and full-stack delivery",
    scope: [
      "Information architecture",
      "Corporate content strategy",
      "Visual direction",
      "Frontend engineering",
      "Admin and content tooling",
      "SEO, accessibility and security",
    ],
    capabilities: ["business-websites"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "CMS", "Vercel"],
    motif: "taxonomy",
    accent: "maroon",
    liveUrl: "https://ibsinfra.com",
    liveLabel: "ibsinfra.com",
    githubUrl: "https://github.com/witejackel-eng/IBS.com",
    caseStudy: {
      disclosure:
        "Live production site. Built and deployed as a real business website, not a concept.",
      businessProblem:
        "The business sold six different technology disciplines through one website, and every discipline wanted equal prominence. Buyers arrived looking for one service — fire-safety, or structured cabling, or a call-centre setup — and landed in a flat catalogue where everything looked equally important, which meant nothing read as important. Enquiries were generic, routing was manual, and the homepage tried to be a brochure for everything at once.",
      constraints: [
        "Six service divisions, each with its own vocabulary and buyer",
        "Legacy service descriptions that were technically accurate but commercially flat",
        "Multiple industry audiences (corporate, government, industrial, hospitality)",
        "SEO equity in existing service pages had to be preserved",
        "Mobile-first buyers researching on site surveys",
        "Admin team needed to maintain content without engineering help",
      ],
      strategy: [
        "Reorganised six divisions into a primary service taxonomy with a clear parent → child → capability hierarchy",
        "Gave each division a dedicated landing route with its own outcome narrative, not a generic service template",
        "Separated 'what we do' (capabilities) from 'where we do it' (industries served) so buyers could enter either way",
        "Built a lead-routing enquiry model so a fire-safety enquiry never lands in the AV queue",
        "Kept legacy URLs alive with preserved redirects to protect organic search routes",
      ],
      intervention: [
        "Designed a division-first navigation that scales to six verticals without a mega-menu wall",
        "Wrote service copy that leads with the buyer's problem and ends with a concrete next step",
        "Built an admin layer so the team can publish and re-order services without touching code",
        "Implemented structured data for services and organisation for honest search visibility",
        "Hardened forms, headers and security defaults for a public B2B surface",
      ],
      outcome:
        "A serious buyer can now find their division, understand what IBS actually does inside it, and send an enquiry that reaches the right team. The site reads as a single credible company instead of six brochures stapled together — and the team can keep it current without filing engineering tickets.",
      evidence: [
        { label: "Service divisions structured", detail: "6 verticals, each with a dedicated route" },
        { label: "Capability pages", detail: "Parent → child → capability hierarchy" },
        { label: "Industry paths", detail: "Cross-cutting industry entry points" },
        { label: "Lead routing", detail: "Enquiry model routes to the correct division" },
        { label: "Legacy redirects", detail: "Preserved to protect organic search routes" },
        { label: "Admin capability", detail: "Content team can publish without engineering" },
      ],
      engineeringNotes: [
        "Next.js App Router with server components for the marketing surface and isolated client components only where interaction requires them.",
        "Canonical URLs, Open Graph and structured data per service route; sitemap and robots generated from the same content model.",
        "Form submissions validated client and server side, with honeypot spam protection and fail-safe error states.",
        "Security headers, CSP-friendly asset loading and accessibility landmarks across every route.",
      ],
    },
    contextualCta: {
      question: "Have a complex service business that is difficult to explain?",
      button: "Send me the catalogue",
    },
  },

  /* ─────────────────────────────  FLAGSHIP 2  ───────────────────────────── */
  {
    slug: "bharat-electrosafe",
    name: "Bharat Electrosafe",
    industry: "Industrial Safety & Electrical Manufacturing",
    projectType: "Industrial B2B product website",
    status: "business",
    tier: "flagship",
    featuredRank: 2,
    proofRole: "Industrial product communication",
    outcomeHeadline:
      "Made industrial safety products easier to understand, compare and enquire about.",
    tagline: "Built credibility without shouting.",
    summary:
      "A manufacturer of electrical safety products — across product families, certifications, technical specifications and documents — reorganised so an engineer can compare, qualify and raise a quotation request without phoning a salesperson first.",
    role: "Strategy, design and full-stack delivery",
    scope: [
      "Product information architecture",
      "Technical specification system",
      "Product comparison",
      "Search migration",
      "Enquiry conversion",
      "Content governance",
    ],
    capabilities: ["business-websites", "commerce"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Vercel"],
    motif: "grid-compare",
    accent: "ink",
    liveUrl: "https://bharatelectrosafe.com",
    liveLabel: "bharatelectrosafe.com",
    githubUrl: "https://github.com/witejackel-eng/bharat-electrosafe",
    caseStudy: {
      disclosure:
        "Live production site. Built and deployed as a real industrial product website.",
      businessProblem:
        "The catalogue mixed product families, certification classes, ratings and datasheets into one long list. Engineers comparing a few options had to open six tabs, keep specs in their head, and eventually email to ask which variant actually fit their panel. The product data was accurate — it was just arranged for the manufacturer, not the buyer.",
      constraints: [
        "Multiple product families with overlapping specifications",
        "Certifications and compliance documents that buyers must verify",
        "Technical specifications that cannot be simplified into marketing copy",
        "Quotation-driven sales, not cart-driven checkout",
        "Mobile engineers reading datasheets on site",
        "Content accuracy is a safety issue, not a preference",
      ],
      strategy: [
        "Grouped products into families with a consistent specification schema so every product answers the same questions in the same order",
        "Introduced a comparison view so engineers can line up variants side by side instead of tab-switching",
        "Treated certifications as first-class objects — visible, verifiable, downloadable — not footnote text",
        "Replaced the generic contact form with a quotation request that already knows which product the buyer is looking at",
        "Kept technical language honest; the site respects the engineer reading it",
      ],
      intervention: [
        "Built a product data model that enforces a consistent spec schema across families",
        "Designed a comparison interface that stays legible on mobile",
        "Attached documents (datasheets, certificates) directly to the relevant product, not a separate downloads graveyard",
        "Migrated search from the old flat catalogue to the new family-based structure",
        "Wired enquiry forms to carry product context into the quotation request",
      ],
      outcome:
        "An engineer can now shortlist, compare and qualify products against their panel requirements, then raise a quotation request that already contains the context. The site keeps its engineering credibility while removing the friction that used to end in a phone call — or a lost lead.",
      evidence: [
        { label: "Product families", detail: "Consistent spec schema across families" },
        { label: "Comparison view", detail: "Side-by-side variant comparison" },
        { label: "Certifications", detail: "First-class, verifiable, downloadable" },
        { label: "Quotation path", detail: "Product-aware enquiry routing" },
        { label: "Search migration", detail: "Re-indexed to family-based structure" },
        { label: "Responsive views", detail: "Datasheets legible on mobile" },
      ],
      engineeringNotes: [
        "Prisma-backed product model enforcing a normalised specification schema so product data stays comparable.",
        "Comparison view built as a client component over a server-fetched product set; no full-catalogue client bundle.",
        "Datasheet and certificate assets optimised and lazy-loaded with descriptive alt text and accessible labels.",
        "Form validation shared between client and server via a single schema source.",
      ],
    },
    contextualCta: {
      question: "Need to turn technical products into a clearer buying journey?",
      button: "Show me the catalogue",
    },
  },

  /* ─────────────────────────────  FLAGSHIP 3  ───────────────────────────── */
  {
    slug: "device-destination",
    name: "DeviceDestination",
    industry: "Ecommerce / Consumer Electronics",
    projectType: "Full-stack commerce platform",
    status: "business",
    tier: "flagship",
    featuredRank: 3,
    proofRole: "Full-stack commerce",
    outcomeHeadline:
      "Turned model-number chaos into a guided buying and checkout experience.",
    tagline: "The payment succeeded. The notification failed. The order still survives.",
    summary:
      "An electronics storefront where buyers search by exact model number, compare variants, check out with GST-safe pricing and Razorpay, and receive an invoice — engineered so that when something fails mid-flight, the order still lands correctly.",
    role: "Design, full-stack engineering and payments architecture",
    scope: [
      "Product discovery and exact-model search",
      "Product comparison",
      "Cart and checkout",
      "GST-safe pricing",
      "Razorpay integration",
      "Invoice generation",
      "Notifications",
      "Authentication",
    ],
    capabilities: ["commerce", "digital-products"],
    technology: ["Next.js", "TypeScript", "Prisma", "Razorpay", "Tailwind CSS", "Vercel"],
    motif: "checkout-flow",
    accent: "maroon",
    liveUrl: "https://device-destination-rose.vercel.app",
    liveLabel: "device-destination-rose.vercel.app",
    githubUrl: "https://github.com/witejackel-eng/DeviceDestination",
    caseStudy: {
      disclosure:
        "Deployed ecommerce application. Verify the current deployment before publishing the link publicly.",
      businessProblem:
        "Buyers in this category do not browse — they arrive knowing the exact model number they want. A conventional catalogue front page is useless to them. They need to land on the right variant, confirm it is the right one, compare it against the one they almost bought instead, check the GST-inclusive price, pay, and get an invoice they can file. Most storefronts optimise for browsing. This one had to optimise for certainty.",
      constraints: [
        "Model-number-first buying behaviour",
        "GST-safe pricing that survives partial checkout and refund paths",
        "Payment reliability under webhook delay, duplicate callback and network failure",
        "Invoice generation that matches the payment state, not the request state",
        "Authentication that does not block the buyer from checking out",
        "Mobile checkout with a long specification list",
      ],
      strategy: [
        "Designed discovery around exact-model search and guided comparison, not category browsing",
        "Treated checkout as a saga with idempotent steps, not a single optimistic request",
        "Made payment verification the source of truth — the order's state follows the payment, not the other way around",
        "Kept the invoice tied to the verified payment record so a failed notification can never produce a phantom invoice",
        "Let buyers check out as guests and claim the order later, so auth never costs a sale",
      ],
      intervention: [
        "Built exact-model search with comparison against the nearest alternatives",
        "Implemented idempotent checkout keyed to the payment attempt",
        "Added webhook recovery so a delayed or duplicate Razorpay callback reconciles instead of duplicating",
        "Generated invoices from the verified payment record, not the cart",
        "Wired notifications to fire from order state transitions, with safe retry",
      ],
      outcome:
        "A buyer can find the exact model, compare it, pay safely, and receive a correct invoice — and when the payment provider's webhook is slow or fires twice, the order still ends up in the right state. The commerce behaviour is boring in the best way: it does not lose money to edge cases.",
      evidence: [
        { label: "Exact-model search", detail: "Discovery built around model numbers" },
        { label: "Comparison", detail: "Variant comparison before checkout" },
        { label: "GST-safe pricing", detail: "Consistent across checkout and refund paths" },
        { label: "Payment verification", detail: "Razorpay with idempotent reconciliation" },
        { label: "Webhook recovery", detail: "Duplicate and delayed callbacks handled" },
        { label: "Invoice generation", detail: "Tied to verified payment record" },
        { label: "Authentication", detail: "Guest checkout with later claim" },
      ],
      engineeringNotes: [
        "Checkout modelled as a saga: each step (reserve, charge, verify, fulfil) is idempotent and reconcilable.",
        "Razorpay integration uses signature verification plus an independent server-side status poll so a missing webhook cannot orphan an order.",
        "Pricing is computed server-side from a single GST-aware function reused by cart, checkout, invoice and refund paths.",
        "Notifications are emitted from order-state transitions with at-least-once delivery and idempotent consumers.",
      ],
    },
    contextualCta: {
      question: "Need ecommerce that handles the operational details too?",
      button: "Tell me what breaks",
    },
  },

  /* ─────────────────────────────  FLAGSHIP 4  ───────────────────────────── */
  {
    slug: "cloudsun",
    name: "CloudSun",
    industry: "SaaS / Call-Centre Operations",
    projectType: "Operational product design (concept)",
    status: "concept",
    tier: "flagship",
    featuredRank: 4,
    proofRole: "Dense operational product design",
    outcomeHeadline:
      "Designed a 24-route operations workspace without losing the operator.",
    tagline: "Motion with a job.",
    summary:
      "A concept operations workspace for a call-centre — twenty-four application routes, role-based workflows, dense dashboards and status language — designed so an operator using it eight hours a day can still find the next thing they need to do.",
    role: "Product design and front-end architecture",
    scope: [
      "Application information architecture",
      "Role-based navigation",
      "Dashboard hierarchy",
      "Status language system",
      "Design system",
      "Multi-route front-end",
    ],
    capabilities: ["digital-products"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"],
    motif: "routes",
    accent: "ochre",
    githubUrl: "https://github.com/witejackel-eng/cloudsun",
    caseStudy: {
      disclosure:
        "Concept product demonstration, not a commissioned client deployment. Designed end-to-end as an operational workspace; no live production environment is linked because none is stable enough to represent the work honestly.",
      businessProblem:
        "Operational software fails when it treats every screen as equally urgent. A call-centre workspace has live queues, agent states, escalations, compliance steps and reporting — all demanding attention at once. The default outcome is a dashboard wall that an operator scans instead of reads. The design problem is hierarchy: deciding what an agent, a supervisor and an admin each need to see first, and making the rest reachable without being loud.",
      constraints: [
        "Twenty-four distinct application routes across the product",
        "Three primary roles with overlapping but unequal needs",
        "Information density that must not become visual noise",
        "Eight-hour daily use — every interaction tax compounds",
        "Status language that must mean the same thing across routes",
        "Concept project — no real call-centre data to validate against",
      ],
      strategy: [
        "Mapped all twenty-four routes to a role-weighted priority grid before designing any screen",
        "Defined a shared status language (open, holding, escalated, resolved, breached) reused across every route so an operator never re-learns meaning",
        "Separated 'now' surfaces (live queue, active case) from 'later' surfaces (reports, config) at the navigation level, not just the visual level",
        "Built a design system where density is a primitive — compact tables, inline status, keyboard-first actions — rather than a compromise",
        "Scoped motion to signal state change, never to decorate",
      ],
      intervention: [
        "Designed the primary operator workspace as a single focused queue with contextual action, not a dashboard wall",
        "Built supervisor views as overlays on the operator view, so context is never lost",
        "Created a status component system reused verbatim across routes",
        "Established keyboard-first navigation for power-operator use",
        "Documented the route map and role matrix as a living artifact",
      ],
      outcome:
        "A concept workspace that proves dense operational software can be designed without drowning the operator. The hierarchy is explicit, the status language is consistent, and the twenty-four routes collapse into a small number of mental models an agent can actually hold.",
      evidence: [
        { label: "Application routes", detail: "24 routes mapped to a role priority grid" },
        { label: "Role-based workflows", detail: "Agent, supervisor, admin" },
        { label: "Status language", detail: "Shared system reused across routes" },
        { label: "Dashboard hierarchy", detail: "'now' vs 'later' separated at nav level" },
        { label: "Design system", detail: "Density as a primitive" },
        { label: "Keyboard navigation", detail: "Power-operator first" },
      ],
      engineeringNotes: [
        "Front-end architected for a large route count without a monolithic bundle — route-level code splitting and shared layout shells.",
        "Zustand stores scoped per role-context to keep operator state local and fast.",
        "Motion library scoped to state transitions; respects prefers-reduced-motion everywhere.",
        "Design tokens emitted for status colours so the status language is enforced at the token layer, not by hand.",
      ],
    },
    contextualCta: {
      question: "Designing software people must use all day?",
      button: "Map the routes with me",
    },
  },

  /* ─────────────────────────────  FLAGSHIP 5  ───────────────────────────── */
  {
    slug: "saffron-steam",
    name: "Saffron & Steam",
    industry: "Hospitality / Brand Experience",
    projectType: "Interactive brand experience",
    status: "business",
    tier: "flagship",
    featuredRank: 5,
    proofRole: "Art direction and creative technology",
    outcomeHeadline:
      "Used motion and WebGL to sell the atmosphere before the first cup was poured.",
    tagline: "No template soup.",
    summary:
      "An interactive brand experience for a hospitality concept — editorial art direction, motion and WebGL used to communicate mood, memory and differentiation, not to demonstrate a graphics library.",
    role: "Art direction, motion design and creative engineering",
    scope: [
      "Brand art direction",
      "Editorial design",
      "Motion direction",
      "WebGL experience",
      "Narrative interaction",
      "Hospitality UX",
    ],
    capabilities: ["creative-technology", "business-websites"],
    technology: ["Next.js", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
    motif: "steam",
    accent: "ochre",
    liveUrl: "https://saffron-steam-experience.vercel.app",
    liveLabel: "saffron-steam-experience.vercel.app",
    githubUrl: "https://github.com/witejackel-eng/saffron-steam-experience",
    caseStudy: {
      disclosure:
        "Deployed interactive brand experience. Creative direction and engineering by Aditya.",
      businessProblem:
        "A hospitality concept does not sell a product — it sells the feeling of being there. A conventional menu-and-gallery website would describe the place without evoking it. The work was to make the website itself feel like the first visit: warm, slow, considered, a little theatrical, and impossible to confuse with the ten other café sites built from the same template.",
      constraints: [
        "Atmosphere is the product — copy alone cannot carry it",
        "WebGL and motion are heavy; they must not punish mobile visitors",
        "Brand had no existing photography library to lean on",
        "The experience must still communicate practical information (location, hours, menu)",
        "Reduced-motion and low-power devices need a graceful fallback, not a broken site",
      ],
      strategy: [
        "Led with art direction — type, colour, pacing and motion carry the mood before any 3D loads",
        "Used WebGL selectively to reinforce a moment, not to decorate the whole page",
        "Treated motion as pacing: slow reveals, deliberate scroll cadence, no constant movement",
        "Kept practical information (menu, hours, location) accessible without fighting the atmosphere",
        "Built a static poster fallback so the experience never depends on WebGL to be usable",
      ],
      intervention: [
        "Designed an editorial type system that carries the brand with or without motion",
        "Composed WebGL moments that resolve to static posters on reduced-motion or low-power devices",
        "Choreographed scroll-linked motion to pace the narrative, not to show off",
        "Layered practical content underneath the atmospheric surface so it is one tap away, not buried",
      ],
      outcome:
        "Visitors land in an atmosphere, not a template. The brand reads as intentional and memorable before anyone reads a word of copy — and the practical information is still there for the person who actually wants to visit. Mobile and reduced-motion visitors get the brand without paying the performance cost.",
      evidence: [
        { label: "Art direction", detail: "Original editorial type and colour system" },
        { label: "WebGL moments", detail: "Selective, poster-backed, reduced-motion safe" },
        { label: "Motion pacing", detail: "Scroll-linked narrative, not decoration" },
        { label: "Practical layer", detail: "Menu, hours, location one tap away" },
        { label: "Fallback", detail: "Static poster experience for low-power devices" },
      ],
      engineeringNotes: [
        "WebGL loaded lazily and only when the device and connection can afford it; a static poster is the default until then.",
        "Motion choreographed through Framer Motion with prefers-reduced-motion short-circuiting every transition.",
        "Image and font loading sequenced so LCP stays fast even with a heavy creative surface above the fold.",
        "Practical content server-rendered so it is indexable and accessible regardless of WebGL support.",
      ],
    },
    contextualCta: {
      question: "Need a brand experience people will actually remember?",
      button: "Bring me the mood",
    },
  },

  /* ─────────────────────────────  FLAGSHIP 6  ───────────────────────────── */
  {
    slug: "aarohan-legal",
    name: "Aarohan Legal",
    industry: "Legal / Professional Services",
    projectType: "Professional services website",
    status: "business",
    tier: "flagship",
    featuredRank: 6,
    proofRole: "Editorial restraint and compliance thinking",
    outcomeHeadline:
      "Built credibility when conventional marketing tactics were not available.",
    tagline: "Designer's eye. Developer's hands. Business outcomes in the middle.",
    summary:
      "A law-firm website built under real professional restrictions — no testimonials, no fabricated results, no aggressive advertising, no stock photography — where credibility comes from structure, typography, publishing discipline and a controlled enquiry path.",
    role: "Strategy, editorial design and full-stack delivery",
    scope: [
      "Editorial design system",
      "Content governance",
      "Publishing rules",
      "Procedural visual systems",
      "Restraint-led UX",
      "Enquiry design",
    ],
    capabilities: ["business-websites"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "MDX", "Vercel"],
    motif: "restraint",
    accent: "ink",
    liveUrl: "https://aarohan-legal.vercel.app",
    liveLabel: "aarohan-legal.vercel.app",
    githubUrl: "https://github.com/witejackel-eng/aarohan-legal",
    caseStudy: {
      disclosure:
        "Deployed professional-services website. Built under explicit marketing restrictions.",
      businessProblem:
        "A law firm cannot market the way a SaaS company does. No testimonials without consent, no results claims that cannot be substantiated, no comparisons that imply superiority, no generic legal stock photography of gavels and handshakes, no false credentials. The default legal-website template fails here because it leans on exactly those tactics. The work was to build credibility without any of the crutches — using structure, restraint and editorial discipline instead.",
      constraints: [
        "No testimonials without verified consent",
        "No fabricated results, settlements or success rates",
        "No aggressive or comparative advertising",
        "No generic legal stock photography",
        "No false credentials or implied affiliations",
        "Content accuracy is a professional and ethical obligation",
      ],
      strategy: [
        "Made practice-area structure the primary navigation — credibility comes from being specific about what the firm does and does not do",
        "Established a publishing model where every article has a review state, so unverified content cannot reach the site",
        "Designed a procedural visual system — typography, rules, numbered steps — that signals rigour without ornament",
        "Replaced stock photography with type, structure and honest procedural diagrams",
        "Built an enquiry path that qualifies without pressuring — no urgency theatre, no 'limited slots'",
      ],
      intervention: [
        "Designed an editorial type and layout system tuned for long-form legal reading",
        "Built a content governance layer with review states before publish",
        "Created procedural visuals (process diagrams, numbered practice steps) instead of stock imagery",
        "Wrote practice-area copy that is specific and honest about scope",
        "Designed a controlled enquiry form that respects the visitor's situation",
      ],
      outcome:
        "The site reads as a serious firm without ever borrowing the tactics it is not allowed to use. Credibility comes from how clearly the practice is structured, how disciplined the publishing is, and how restrained the visual language is — which, for a law firm, is exactly the point.",
      evidence: [
        { label: "Practice areas", detail: "Specific, scope-honest structure" },
        { label: "Publishing rules", detail: "Review state before any publish" },
        { label: "Visual system", detail: "Procedural, no stock photography" },
        { label: "Enquiry design", detail: "Qualifying without pressure" },
        { label: "Content governance", detail: "Unverified content cannot reach the site" },
        { label: "Editorial reading", detail: "Type system tuned for long-form legal" },
      ],
      engineeringNotes: [
        "MDX-driven content with a frontmatter review-state gate so drafts cannot render in production.",
        "Editorial type system with reading-optimised measure, leading and rhythm for long-form legal text.",
        "Procedural visuals built as SVG from the same design tokens — no binary stock assets.",
        "Enquiry form validated client and server, with honest submission states and a direct email fallback.",
      ],
    },
    contextualCta: {
      question: "Need credibility without marketing theatre?",
      button: "Send me the restrictions",
    },
  },

  /* ─────────────────────────────  LABORATORY  ───────────────────────────── */
  {
    slug: "casa-aurelia",
    name: "Casa Aurelia",
    industry: "Luxury Real Estate",
    projectType: "Editorial property presentation (experiment)",
    status: "experiment",
    tier: "laboratory",
    featuredRank: 7,
    proofRole: "Luxury editorial presentation",
    outcomeHeadline:
      "Luxury property discovery without the portal aesthetic.",
    tagline: "Built to learn.",
    summary:
      "An editorial atelier for presenting luxury property — proof that high-end real estate can feel curated and considered instead of resembling a listings portal.",
    role: "Editorial design and front-end",
    scope: ["Editorial design", "Property presentation", "Responsive layout"],
    capabilities: ["business-websites", "creative-technology"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS"],
    motif: "editorial-lux",
    accent: "sand",
    liveUrl: "https://real-estate-atelier.vercel.app",
    liveLabel: "real-estate-atelier.vercel.app",
    githubUrl: "https://github.com/witejackel-eng/real-estate-atelier",
    caseStudy: {
      disclosure:
        "Experimental atelier. Built to learn editorial luxury presentation, not a commissioned client project.",
      businessProblem:
        "Luxury property online defaults to the portal aesthetic: filters, grids, price-first cards. A discerning buyer is not searching a portal — they are deciding whether a place is worth visiting. The experiment was to present property the way a magazine presents a subject.",
      constraints: [
        "No portal-style filter grid",
        "Photography-led but type-supported",
        "Must feel curated, not indexed",
      ],
      strategy: [
        "Led with editorial layout over filter grid",
        "Let typography carry hierarchy where portals use badges",
        "Kept practical details reachable but never primary",
      ],
      intervention: [
        "Designed a magazine-style property presentation",
        "Built a restrained, photography-led layout",
        "Kept enquiry quiet and considered",
      ],
      outcome:
        "A small experiment proving luxury property can be presented editorially without losing the practical layer a real buyer still needs.",
      evidence: [
        { label: "Editorial layout", detail: "Magazine-style over portal grid" },
        { label: "Responsive", detail: "Considered at mobile and desktop" },
      ],
      engineeringNotes: [
        "Static editorial presentation, optimised images, no heavy runtime.",
      ],
    },
    contextualCta: {
      question: "Selling something that deserves more than a card grid?",
      button: "Show me the subject",
    },
  },
  {
    slug: "pricepilot",
    name: "PricePilot",
    industry: "Pricing / Decision Support",
    projectType: "Data-heavy UX (experiment)",
    status: "experiment",
    tier: "laboratory",
    featuredRank: 8,
    proofRole: "Data-heavy decision-support UX",
    outcomeHeadline:
      "A pricing spreadsheet that grew up and learned interface design.",
    tagline: "A pricing spreadsheet that grew up.",
    summary:
      "A decision-support interface for pricing logic — taking Excel/CSV workflows and giving them a real interface, so a person making pricing decisions can see the consequences without living in a spreadsheet.",
    role: "Product design and front-end",
    scope: ["Data-heavy UX", "Pricing logic", "CSV/Excel workflows", "Dashboard design"],
    capabilities: ["digital-products"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS"],
    motif: "data-grid",
    accent: "ochre",
    githubUrl: "https://github.com/witejackel-eng/pricepilot",
    caseStudy: {
      disclosure:
        "Experimental project. Built to learn data-heavy decision-support UX. Verify or create a stable preview before linking publicly.",
      businessProblem:
        "Pricing decisions often live in a spreadsheet that one person understands. The experiment was to take that spreadsheet's logic — tiers, margins, scenarios — and give it an interface where the decision, not the formula, is the thing on screen.",
      constraints: [
        "CSV/Excel as the real source of truth",
        "Pricing logic is non-trivial but must stay legible",
        "Decision, not data entry, is the job",
      ],
      strategy: [
        "Surface the decision and its consequences, hide the formula mechanics",
        "Let scenarios live side by side instead of across tabs",
        "Keep the spreadsheet importable so it stays the source of truth",
      ],
      intervention: [
        "Designed a scenario comparison interface",
        "Built CSV import and a legible pricing table",
        "Kept the decision visible above the data",
      ],
      outcome:
        "A useful experiment in turning spreadsheet logic into a decision interface — the kind of thinking that transfers directly to operational product work.",
      evidence: [
        { label: "Scenario comparison", detail: "Side-by-side pricing scenarios" },
        { label: "CSV workflow", detail: "Spreadsheet stays source of truth" },
        { label: "Decision-led UX", detail: "Decision above the data" },
      ],
      engineeringNotes: [
        "Client-side parsing of CSV with a normalised pricing model; no sensitive data leaves the browser.",
      ],
    },
    contextualCta: {
      question: "Have a spreadsheet that deserves a real interface?",
      button: "Send me the formulas",
    },
  },
  {
    slug: "dust-signal",
    name: "DUST//SIGNAL",
    industry: "Generative / Creative Coding",
    projectType: "Generative interaction system (experiment)",
    status: "experiment",
    tier: "laboratory",
    featuredRank: 9,
    proofRole: "Generative interaction systems",
    outcomeHeadline:
      "Generative systems, procedural sound and mathematics as interaction.",
    tagline: "The Useful Experiments Department.",
    summary:
      "A generative interaction experiment — procedural visuals, signal-driven sound and mathematics used as the interaction itself, not as decoration. Kept small on purpose.",
    role: "Creative coding and interaction design",
    scope: ["Generative systems", "Procedural sound", "Experimental interaction"],
    capabilities: ["creative-technology"],
    technology: ["TypeScript", "Canvas", "Web Audio"],
    motif: "signal",
    accent: "ink",
    liveUrl: "https://dune-aditya.vercel.app",
    liveLabel: "dune-aditya.vercel.app",
    githubUrl: "https://github.com/witejackel-eng/dune",
    caseStudy: {
      disclosure:
        "Experimental creative-coding project. Built to explore generative interaction; small by design.",
      businessProblem:
        "An experiment with no client and no brief — the question was whether mathematics and procedural sound could become the interaction itself, rather than decoration on top of a conventional interface.",
      constraints: [
        "Must stay small and self-contained",
        "Performance on modest devices",
        "Reduced-motion and silent fallbacks",
      ],
      strategy: [
        "Let the generative system be the interface",
        "Couple sound to signal so they share a single behaviour",
        "Keep it short — an experiment, not a product",
      ],
      intervention: [
        "Built a procedural visual system driven by signal math",
        "Coupled Web Audio to the same signal",
        "Added reduced-motion and silent fallbacks",
      ],
      outcome:
        "A small, honest experiment that keeps Aditya's creative-coding instincts sharp — the kind of thinking that surfaces later in real brand work like Saffron & Steam.",
      evidence: [
        { label: "Generative system", detail: "Signal-driven visuals" },
        { label: "Procedural sound", detail: "Coupled to the same signal" },
        { label: "Fallbacks", detail: "Reduced-motion and silent modes" },
      ],
      engineeringNotes: [
        "Canvas + Web Audio on a single signal source; lazy-initialised and capped to protect modest devices.",
      ],
    },
    contextualCta: {
      question: "Curious whether generative thinking fits a real brief?",
      button: "Test it on something real",
    },
  },
];

/* ──────────────────────────  derived helpers  ────────────────────────── */

export const flagshipProjects = projects
  .filter((p) => p.tier === "flagship")
  .sort((a, b) => a.featuredRank - b.featuredRank);

export const laboratoryProjects = projects
  .filter((p) => p.tier === "laboratory")
  .sort((a, b) => a.featuredRank - b.featuredRank);

export function getProject(slug: string): PortfolioProject | undefined {
  return projects.find((p) => p.slug === slug);
}

export const capabilityFilters: { id: CapabilityTag; label: string }[] = [
  { id: "business-websites", label: "Business websites" },
  { id: "commerce", label: "Commerce" },
  { id: "digital-products", label: "Digital products" },
  { id: "creative-technology", label: "Creative technology" },
];

export const statusLabels: Record<ProjectStatus, string> = {
  client: "Client work",
  business: "Live project",
  concept: "Concept",
  experiment: "Experiment",
};
