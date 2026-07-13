/**
 * Audit-specific offer configuration.
 *
 * This defines the consulting offer presented to leads after they unlock
 * their full audit report.
 */

import { CONTACT_EMAIL } from '@/config/contact';

export const auditOffer = {
  /** Unique slug for this offer — used in URLs and event tracking. */
  id: 'business-website-sprint' as const,

  /** Human-readable offer name. */
  name: 'Business Website Sprint',

  /** Display price string. */
  price: '₹34,999',

  /** Clarifying note under the price. */
  priceNote: 'Fixed starting scope',

  /** Short description shown on the offer card / email. */
  description:
    'A focused website redesign and optimization sprint for businesses whose audit reveals multiple high-impact performance, SEO, trust or conversion problems.',

  /** Payment terms – displayed in the proposal / email body. */
  paymentTerms:
    "50% upfront to begin and 50% after the approved website is deployed to the client's chosen hosting platform and domain.",

  /** Subject line for the consultation email. {{domain}} is replaced at send time. */
  emailSubject: 'Website audit consultation — {{domain}}',

  /** Fallback contact address included in every outbound email. */
  contactEmail: CONTACT_EMAIL,
} as const;
