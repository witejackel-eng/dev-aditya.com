/**
 * Reusable SEO metadata generation utilities.
 *
 * All page-level metadata should be generated through these helpers
 * to ensure consistency, correct canonical URLs, and complete OG/Twitter coverage.
 */

import type { Metadata } from 'next';
import { siteConfig, getCanonicalOrigin } from '@/config/site';

interface SeoPageParams {
  /** Page title (will be combined with template) */
  title: string;
  /** Page description */
  description: string;
  /** Canonical path relative to root, e.g. '/work' or '/services/business-websites' */
  path: string;
  /** OG image path relative to root, defaults to /og-default.png */
  ogImage?: string;
  /** OG image alt text */
  ogImageAlt?: string;
  /** Article publication date (ISO string) — for Article type pages */
  publishedTime?: string;
  /** Article modification date (ISO string) */
  modifiedTime?: string;
  /** Article section / category */
  section?: string;
  /** Robots directives (defaults to index/follow) */
  robots?: Metadata['robots'];
  /** OG type override */
  type?: 'website' | 'article';
  /** Keywords — only when naturally useful */
  keywords?: string[];
}

export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  ogImageAlt,
  publishedTime,
  modifiedTime,
  section,
  robots,
  type = 'website',
  keywords,
}: SeoPageParams): Metadata {
  const origin = getCanonicalOrigin();
  const canonicalUrl = `${origin}${path}`;
  const ogImageUrl = ogImage
    ? `${origin}${ogImage}`
    : `${origin}/og-default.png`;
  const imageAlt =
    ogImageAlt ?? siteConfig.og.imageAlt;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.siteName,
      locale: siteConfig.locale,
      type: type === 'article' ? 'article' : 'website',
      images: [
        {
          url: ogImageUrl,
          width: siteConfig.og.imageWidth,
          height: siteConfig.og.imageHeight,
          alt: imageAlt,
        },
      ],
      ...(type === 'article' && publishedTime
        ? { publishedTime }
        : {}),
      ...(type === 'article' && modifiedTime
        ? { modifiedTime }
        : {}),
      ...(section ? { section } : {}),
    },
    twitter: {
      card: siteConfig.twitter.card,
      title,
      description,
      images: [ogImageUrl],
    },
    robots: robots ?? { index: true, follow: true },
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    creator: siteConfig.owner.fullName,
    authors: [{ name: siteConfig.owner.fullName, url: siteConfig.owner.portfolio }],
  };
}

/**
 * Generate BreadcrumbList JSON-LD data.
 */
export function generateBreadcrumbs(
  items: Array<{ name: string; path: string }>,
) {
  const origin = getCanonicalOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}
