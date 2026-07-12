/**
 * Centralized site configuration — single source of truth for
 * canonical URLs, owner identity, brand colors, and default metadata.
 *
 * All SEO-relevant values derive from here.
 */

export const siteConfig = {
  /** Canonical production origin — must be consistent everywhere */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dev-aditya.com',

  /** Fallback Vercel domain used during development or before custom domain is live */
  vercelUrl: 'https://dev-aditya-com.vercel.app',

  /** Whether the custom domain is confirmed as live and resolving */
  customDomainLive: process.env.NEXT_PUBLIC_CUSTOM_DOMAIN_LIVE === 'true',

  name: 'Aditya Singh',
  siteName: 'Aditya Singh — Web Designer & Developer',

  /** Owner identity — only verified information */
  owner: {
    fullName: 'Aditya Singh',
    firstName: 'Aditya',
    email: 'hi.aditya.dev@gmail.com',
    phone: '+919310736542',
    location: 'Delhi, India',
    region: 'Delhi/NCR',
    country: 'India',
    jobTitles: [
      'Web Designer',
      'Front-End Developer',
      'UI/UX Designer',
      'Next.js Developer',
    ],
    github: 'https://github.com/witejackel-eng',
    portfolio: 'https://dev-aditya.com',
  },

  /** Default SEO metadata */
  defaults: {
    title: 'Web Designer & Next.js Developer in Delhi | Aditya Singh',
    description:
      'Aditya Singh designs and develops fast, premium websites for service businesses, startups and independent brands in Delhi, across India and worldwide. Explore website packages and case studies.',
    template: '%s | Aditya Singh',
  },

  locale: 'en_US',
  language: 'en',

  /** Service regions — honest claims only */
  serviceRegions: ['Delhi', 'Delhi/NCR', 'India', 'Remote / Worldwide'],

  /** Brand identity */
  brand: {
    primaryColor: '#7A1F2B',    // maroon
    primaryColorDark: '#55131D',
    backgroundColor: '#FAFAF7',
    textColor: '#080808',
  },

  /** Social / OG defaults */
  og: {
    type: 'website' as const,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'Aditya Singh — Web Designer & Next.js Developer in Delhi',
  },

  /** Twitter defaults */
  twitter: {
    card: 'summary_large_image' as const,
    handle: undefined, // add when available
  },

  /** Search engine verification env-var names */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? '',
  },

  /** IndexNow key — loaded from env */
  indexNowKey: process.env.NEXT_PUBLIC_INDEXNOW_KEY ?? '',
} as const;

/** Helper: returns the canonical production origin, falling back to Vercel URL */
export function getCanonicalOrigin(): string {
  return siteConfig.customDomainLive ? siteConfig.url : siteConfig.vercelUrl;
}
