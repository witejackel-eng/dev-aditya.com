/**
 * Centralised contact configuration.
 * All contact links across the site should reference these values
 * so that a single update propagates everywhere.
 *
 * WhatsApp uses the same number as the phone field in international
 * format (no spaces, no plus sign) for the wa.me URL.
 */

export const CONTACT_EMAIL = 'hi.aditya.dev@gmail.com';

/** International format without + or spaces — used inside wa.me URLs */
export const WHATSAPP_NUMBER = '919310736542';

/** Human-readable phone for tel: links */
export const PHONE_HREF = 'tel:+919310736542';

/** Full WhatsApp base URL */
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
