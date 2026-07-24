/**
 * Navigation and footer link configuration.
 *
 * Primary navigation is deliberately short and buyer-focused. Secondary
 * routes (Resources, Project Help) remain live but are surfaced in the
 * footer rather than the header.
 */

export interface NavLink {
  href: string;
  label: string;
}

/** Primary header navigation. */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/work', label: 'WORK' },
  { href: '/services', label: 'SERVICES' },
  { href: '/process', label: 'PROCESS' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

/** Footer — Services column. */
export const FOOTER_SERVICES: NavLink[] = [
  { href: '/services#corporate-website-design', label: 'Corporate Websites' },
  { href: '/services#website-redesign', label: 'Website Redesign' },
  { href: '/services#b2b-landing-pages', label: 'B2B Landing Pages' },
  { href: '/services#frontend-development', label: 'Frontend Development' },
];

/** Footer — Explore column. */
export const FOOTER_EXPLORE: NavLink[] = [
  { href: '/work', label: 'Work' },
  { href: '/process', label: 'Process' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/resources', label: 'Resources' },
];

/** Footer — Legal column. */
export const FOOTER_LEGAL: NavLink[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/accessibility', label: 'Accessibility' },
];
