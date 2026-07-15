/**
 * Centralised social configuration.
 *
 * Instagram is the primary contact channel for the free homepage sample
 * offer. The URL is sourced from NEXT_PUBLIC_INSTAGRAM_URL so it can be
 * configured per-environment without code changes.
 *
 * If the env var is not set, the UI falls back to an email link with a
 * pre-filled sample-request template. No Instagram handle is ever
 * invented.
 */

export const CONTACT_EMAIL = 'hi.aditya.dev@gmail.com';

export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '';

/** Returns true when a valid Instagram URL is configured. */
export function hasInstagram(): boolean {
  if (!INSTAGRAM_URL) return false;
  try {
    new URL(INSTAGRAM_URL);
    return true;
  } catch {
    return false;
  }
}

/** Pre-filled email subject for the sample-request fallback. */
export const SAMPLE_EMAIL_SUBJECT = 'Free Homepage Sample Request';

/** Pre-filled email body for the sample-request fallback. */
export const SAMPLE_EMAIL_BODY = `Hi Aditya,

I would like a free homepage sample.

Business name:
Current website or Instagram:
What the business offers:
Main problem with the current website:
Preferred visual style:`;

/** Mailto link for the email fallback button. */
export function getSampleEmailLink(): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    SAMPLE_EMAIL_SUBJECT,
  )}&body=${encodeURIComponent(SAMPLE_EMAIL_BODY)}`;
}
