/**
 * Complimentary Website Review offer.
 *
 * A short, qualified initial review offered near the bottom of the homepage
 * (not in the header and not directly under the hero). Replaces the earlier
 * "free homepage sample" offer with a review scoped to genuine business
 * projects.
 */

import { CONTACT_EMAIL } from '@/config/contact';

export const WEBSITE_REVIEW = {
  headline: 'Not sure what your website needs?',
  body:
    "Send your current website and a short explanation of what is not working. I'll review the structure, messaging and user experience, then identify the clearest next step.",
  clarifications: [
    'A short initial review, not a full audit or homepage redesign',
    'For genuine business projects',
    'No production code or editable design files',
    'Availability may be limited',
  ],
  cta: 'REQUEST A WEBSITE REVIEW',
} as const;

const REVIEW_EMAIL_BODY = `Company:
Current website:
What the business offers:
What is not working:
What you want the website to achieve:
Preferred launch timing:`;

/**
 * Builds the mailto link for the website-review request. The subject keeps a
 * "[Company Name]" placeholder so the sender can fill it in.
 */
export function getWebsiteReviewMailto(): string {
  const subject = 'Website Review Request — [Company Name]';
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(REVIEW_EMAIL_BODY)}`;
}
