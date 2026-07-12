/**
 * Content Registry — centralized source for route metadata, dates, and relationships.
 *
 * Used by: sitemap.ts, feed.xml, internal linking, SEO validation.
 * When adding new pages, register them here.
 */

export interface RouteEntry {
  /** Canonical path */
  path: string;
  /** Last modified date (ISO format) — update when content actually changes */
  lastModified: string;
  /** Change frequency hint for sitemap */
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** Priority 0–1 for sitemap */
  priority: number;
  /** Whether this page should be indexed */
  indexable: boolean;
  /** Page type for schema generation */
  type: 'homepage' | 'work' | 'case-study' | 'packages' | 'about' | 'contact' | 'mentoring' | 'resource-hub' | 'resource-article' | 'service-hub' | 'service-page' | 'local-page' | 'legal';
  /** Parent route for breadcrumbs (empty = top-level) */
  parentPath?: string;
  /** Human-readable title — required for resource-article, case-study, service-page */
  title?: string;
  /** Short description — required for resource-article, case-study, service-page */
  description?: string;
  /** ISO publication date — required for resource-article */
  datePublished?: string;
}

export const routes: RouteEntry[] = [
  // ── Core pages ──────────────────────────────────────────────────
  { path: '/', lastModified: '2026-07-12', changeFrequency: 'weekly', priority: 1, indexable: true, type: 'homepage' },
  { path: '/work', lastModified: '2026-07-10', changeFrequency: 'monthly', priority: 0.9, indexable: true, type: 'work', parentPath: '/' },
  { path: '/packages', lastModified: '2026-07-10', changeFrequency: 'monthly', priority: 0.9, indexable: true, type: 'packages', parentPath: '/' },
  { path: '/about', lastModified: '2026-07-10', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'about', parentPath: '/' },
  { path: '/contact', lastModified: '2026-07-10', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'contact', parentPath: '/' },
  { path: '/mentoring', lastModified: '2026-07-10', changeFrequency: 'monthly', priority: 0.7, indexable: true, type: 'mentoring', parentPath: '/' },

  // ── Case studies ────────────────────────────────────────────────
  { path: '/work/saffron-steam-experience', lastModified: '2026-07-10', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'case-study', parentPath: '/work', title: 'Saffron & Steam' },
  { path: '/work/corporate-leadgen-platform', lastModified: '2026-07-10', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'case-study', parentPath: '/work', title: 'Corporate Lead-Gen Platform' },
  { path: '/work/driftwear-ecommerce', lastModified: '2026-07-10', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'case-study', parentPath: '/work', title: 'Driftwear Studio' },
  { path: '/work/real-estate-atelier', lastModified: '2026-07-10', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'case-study', parentPath: '/work', title: 'Real Estate Atelier' },

  // ── Resources ───────────────────────────────────────────────────
  { path: '/resources', lastModified: '2026-07-10', changeFrequency: 'weekly', priority: 0.7, indexable: true, type: 'resource-hub', parentPath: '/' },
  { path: '/resources/portfolio-checklist', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.7, indexable: true, type: 'resource-article', parentPath: '/resources', title: 'Portfolio Website Checklist', description: 'A comprehensive checklist for making a portfolio website look credible, load fast, and convert visitors into clients. Covers strategy, structure, SEO, accessibility, and launch readiness.', datePublished: '2026-07-10T00:00:00+05:30' },
  { path: '/resources/frontend-qa', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.7, indexable: true, type: 'resource-article', parentPath: '/resources', title: 'Frontend Project QA', description: 'A thorough QA checklist for frontend projects covering responsive design, accessibility, SEO, performance, Core Web Vitals, security headers, structured data, and deployment.', datePublished: '2026-07-10T00:00:00+05:30' },
  { path: '/resources/ai-website-agency', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.6, indexable: true, type: 'resource-article', parentPath: '/resources', title: 'AI Website Agency', description: 'Notes on using AI tools to package website services, automate lead capture, and build chatbots for small businesses. Honest constraints, ethical limits, and practical considerations.', datePublished: '2026-07-10T00:00:00+05:30' },

  // ── Services (new) ──────────────────────────────────────────────
  { path: '/services', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.9, indexable: true, type: 'service-hub', parentPath: '/' },
  { path: '/services/business-websites', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'service-page', parentPath: '/services', title: 'Business Websites' },
  { path: '/services/website-redesign', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'service-page', parentPath: '/services', title: 'Website Redesign' },
  { path: '/services/landing-page-design', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'service-page', parentPath: '/services', title: 'Landing Page Design' },
  { path: '/services/ecommerce-development', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'service-page', parentPath: '/services', title: 'E-commerce Development' },
  { path: '/services/nextjs-development', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'service-page', parentPath: '/services', title: 'Next.js Development' },
  { path: '/services/interactive-websites', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'service-page', parentPath: '/services', title: 'Interactive Websites' },

  // ── Local page (new) ────────────────────────────────────────────
  { path: '/web-designer-delhi', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.8, indexable: true, type: 'local-page', parentPath: '/' },

  // ── New resources ───────────────────────────────────────────────
  { path: '/resources/website-cost-india', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.7, indexable: true, type: 'resource-article', parentPath: '/resources', title: 'Website Cost in India', description: 'A practical, experience-based breakdown of business website costs in India in 2026, from starter single-page sites at ₹15,000 to premium multi-page builds at ₹75,000+.', datePublished: '2026-07-12T00:00:00+05:30' },
  { path: '/resources/nextjs-vs-wordpress', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.7, indexable: true, type: 'resource-article', parentPath: '/resources', title: 'Next.js vs WordPress', description: 'An honest comparison of Next.js and WordPress for business websites in 2026. Covers performance, SEO, customization, content management, maintenance, and when each platform is the right choice.', datePublished: '2026-07-12T00:00:00+05:30' },
  { path: '/resources/website-redesign-checklist', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.7, indexable: true, type: 'resource-article', parentPath: '/resources', title: 'Website Redesign Checklist', description: 'A complete, experience-based checklist for redesigning a service business website. Covers pre-redesign audits, strategy, content planning, design, development, launch, and post-launch monitoring.', datePublished: '2026-07-12T00:00:00+05:30' },
  { path: '/resources/choose-freelance-web-designer-india', lastModified: '2026-07-12', changeFrequency: 'monthly', priority: 0.7, indexable: true, type: 'resource-article', parentPath: '/resources', title: 'Choose a Freelance Web Designer', description: 'Practical advice on choosing a freelance web designer in India — what to look for, red flags to avoid, freelancer vs agency comparison, questions to ask, and how to evaluate a portfolio honestly.', datePublished: '2026-07-12T00:00:00+05:30' },

  // ── Legal ───────────────────────────────────────────────────────
  { path: '/privacy', lastModified: '2026-07-10', changeFrequency: 'yearly', priority: 0.3, indexable: true, type: 'legal' },
  { path: '/terms', lastModified: '2026-07-10', changeFrequency: 'yearly', priority: 0.3, indexable: true, type: 'legal' },
  { path: '/accessibility', lastModified: '2026-07-10', changeFrequency: 'yearly', priority: 0.3, indexable: true, type: 'legal' },
];

/** Get all indexable routes for sitemap */
export function getIndexableRoutes(): RouteEntry[] {
  return routes.filter((r) => r.indexable);
}
