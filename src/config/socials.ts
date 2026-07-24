/**
 * Centralised social / external-profile configuration.
 *
 * Only verified profiles that genuinely exist are listed here. No handle
 * or URL is ever invented. LinkedIn is intentionally absent because no
 * verified LinkedIn URL exists in this repository.
 */

import { GITHUB_URL } from '@/config/contact';

export interface SocialLink {
  label: string;
  href: string;
}

/** Verified external profiles, used in the footer, About page and case studies. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: GITHUB_URL },
];

export { GITHUB_URL };
