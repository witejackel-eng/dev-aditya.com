/**
 * Structured Data Graph Utilities
 *
 * Generates coordinated schema.org entities with stable @id references
 * throughout the website. All data uses verified information only.
 */

import { siteConfig, getCanonicalOrigin } from '@/config/site';

const origin = getCanonicalOrigin();

// ── Stable @id constants ──────────────────────────────────────────
export const IDS = {
  person: `${origin}/#person`,
  website: `${origin}/#website`,
  profilePage: `${origin}/#profile-page`,
  organization: `${origin}/#organization`,
  offerCatalog: `${origin}/#offer-catalog`,
} as const;

// ── Person entity ──────────────────────────────────────────────────
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': IDS.person,
    name: siteConfig.owner.fullName,
    url: siteConfig.owner.portfolio,
    email: siteConfig.owner.email,
    jobTitle: siteConfig.owner.jobTitles,
    description: siteConfig.defaults.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.owner.location,
      addressCountry: 'IN',
    },
    sameAs: [
      siteConfig.owner.github,
    ],
    knowsAbout: [
      'Web Design',
      'Front-End Development',
      'Next.js',
      'React',
      'TypeScript',
      'Responsive Web Design',
      'UI/UX Design',
      'GSAP',
      'Three.js',
      'WebGL',
      'Website Performance',
      'Accessibility',
      'E-commerce Development',
      'Tailwind CSS',
      'Framer Motion',
    ],
    image: `${origin}/aditya-singh-portrait.jpg`,
  };
}

// ── WebSite entity ─────────────────────────────────────────────────
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': IDS.website,
    name: siteConfig.siteName,
    url: origin,
    description: siteConfig.defaults.description,
    author: { '@id': IDS.person },
    inLanguage: 'en',
  };
}

// ── WebPage entity ─────────────────────────────────────────────────
export function generateWebPageSchema({
  path,
  title,
  description,
  type = 'WebPage',
}: {
  path: string;
  title: string;
  description: string;
  type?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${origin}${path}/#webpage`,
    url: `${origin}${path}`,
    name: title,
    description,
    isPartOf: { '@id': IDS.website },
    about: { '@id': IDS.person },
    author: { '@id': IDS.person },
  };
}

// ── ProfilePage entity ─────────────────────────────────────────────
export function generateProfilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': IDS.profilePage,
    url: origin,
    name: siteConfig.owner.fullName,
    mainEntity: { '@id': IDS.person },
  };
}

// ── Service + Offer schema ─────────────────────────────────────────
export function generateServiceSchema({
  name,
  description,
  path,
  offers,
}: {
  name: string;
  description: string;
  path: string;
  offers?: Array<{ name: string; price: string; priceCurrency: string; description: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${origin}${path}/#service`,
    name,
    description,
    url: `${origin}${path}`,
    provider: { '@id': IDS.person },
    ...(offers && offers.length > 0
      ? {
          offers: offers.map((o) => ({
            '@type': 'Offer',
            name: o.name,
            price: o.price,
            priceCurrency: o.priceCurrency,
            description: o.description,
            availability: 'https://schema.org/InStock',
          })),
        }
      : {}),
  };
}

// ── OfferCatalog (packages page) ───────────────────────────────────
export function generateOfferCatalogSchema(
  offers: Array<{
    name: string;
    price: string;
    priceCurrency: string;
    description: string;
    path: string;
  }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': IDS.offerCatalog,
    name: 'Website Design Packages',
    description: 'Transparent web design packages from Aditya Singh.',
    url: `${origin}/packages`,
    provider: { '@id': IDS.person },
    itemListElement: offers.map((o) => ({
      '@type': 'Offer',
      name: o.name,
      price: o.price,
      priceCurrency: o.priceCurrency,
      description: o.description,
      url: `${origin}${o.path}`,
      availability: 'https://schema.org/InStock',
    })),
  };
}

// ── CreativeWork (case studies) ────────────────────────────────────
export function generateCreativeWorkSchema({
  title,
  description,
  path,
  year,
  stack,
  liveUrl,
  codeRepository,
  keywords,
  projectType,
}: {
  title: string;
  description: string;
  path: string;
  year?: string;
  stack?: string;
  liveUrl?: string;
  codeRepository?: string;
  keywords?: string[];
  projectType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${origin}${path}/#creative-work`,
    name: title,
    description,
    url: `${origin}${path}`,
    author: { '@id': IDS.person },
    creator: { '@id': IDS.person },
    ...(year ? { dateCreated: `${year}` } : {}),
    ...(keywords && keywords.length > 0 ? { keywords: keywords.join(', ') } : {}),
    ...(liveUrl ? { workExample: liveUrl } : {}),
    ...(codeRepository ? { codeRepository } : {}),
    ...(stack ? { programmingLanguage: stack } : {}),
    ...(projectType ? { additionalType: `Portfolio Project` } : {}),
  };
}

// ── Article (resources) ────────────────────────────────────────────
export function generateArticleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  keywords,
  section,
  wordCount,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  keywords?: string[];
  section?: string;
  wordCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${origin}${path}/#article`,
    headline,
    description,
    url: `${origin}${path}`,
    mainEntityOfPage: `${origin}${path}`,
    author: { '@id': IDS.person },
    publisher: { '@id': IDS.person },
    datePublished,
    dateModified,
    ...(section ? { articleSection: section } : {}),
    ...(keywords && keywords.length > 0 ? { keywords: keywords.join(', ') } : {}),
    ...(wordCount ? { wordCount } : {}),
    image: `${origin}/og-default.png`,
  };
}

// ── ContactPage ────────────────────────────────────────────────────
export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${origin}/contact/#contact-page`,
    url: `${origin}/contact`,
    name: 'Contact Aditya Singh',
    description: 'Get in touch with Aditya Singh for a website project.',
    mainEntity: { '@id': IDS.person },
  };
}

// ── Breadcrumbs ────────────────────────────────────────────────────
export function generateBreadcrumbs(
  items: Array<{ name: string; path: string }>,
) {
  const breadcrumbOrigin = getCanonicalOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${breadcrumbOrigin}${item.path}`,
    })),
  };
}

/**
 * Build the full homepage schema graph combining Person + WebSite + ProfilePage.
 */
export function generateHomepageSchemaGraph() {
  return [
    generatePersonSchema(),
    generateWebSiteSchema(),
    generateProfilePageSchema(),
  ];
}
