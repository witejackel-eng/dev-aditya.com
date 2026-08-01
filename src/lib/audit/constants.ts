/**
 * Constants for the Website Revenue Audit Funnel.
 *
 * Centralises status enums, event types, score labels, cache durations,
 * rate limits and other magic numbers so they are defined once.
 */

// ──────────────────────────────────────────────────────────────
// Scanner version
// ──────────────────────────────────────────────────────────────

export const SCANNER_VERSION = '1.0.0';

// ──────────────────────────────────────────────────────────────
// Audit statuses
// ──────────────────────────────────────────────────────────────

export const AUDIT_STATUSES = [
  'queued',
  'validating',
  'fetching',
  'performance',
  'analyzing',
  'scoring',
  'completed',
  'partial',
  'failed',
] as const;

// ──────────────────────────────────────────────────────────────
// Lead statuses
// ──────────────────────────────────────────────────────────────

export const LEAD_STATUSES = [
  'new',
  'reviewed',
  'contacted',
  'replied',
  'consultation',
  'proposal_sent',
  'won',
  'lost',
  'not_suitable',
] as const;

// ──────────────────────────────────────────────────────────────
// Event types
// ──────────────────────────────────────────────────────────────

export const EVENT_TYPES = [
  'audit_created',
  'audit_started',
  'audit_completed',
  'audit_partial',
  'audit_failed',
  'public_report_viewed',
  'unlock_form_viewed',
  'full_report_viewed',
  'lead_unlocked',
  'consultation_cta_clicked',
  'email_cta_clicked',
  'report_email_sent',
  'report_email_failed',
  'admin_status_changed',
  'admin_resent_email',
  'admin_updated_notes',
] as const;

// ──────────────────────────────────────────────────────────────
// Score labels
// ──────────────────────────────────────────────────────────────

export const SCORE_LABELS: Record<string, string> = {
  '90-100': 'Excellent',
  '75-89': 'Strong',
  '60-74': 'Needs improvement',
  '40-59': 'Weak',
  '0-39': 'Critical attention',
};

/**
 * Return a human-readable label for a 0-100 score.
 */
export function getScoreLabel(score: number | null | undefined): string {
  if (score == null) return 'N/A';
  if (score >= 90) return SCORE_LABELS['90-100'];
  if (score >= 75) return SCORE_LABELS['75-89'];
  if (score >= 60) return SCORE_LABELS['60-74'];
  if (score >= 40) return SCORE_LABELS['40-59'];
  return SCORE_LABELS['0-39'];
}

// ──────────────────────────────────────────────────────────────
// Durations
// ──────────────────────────────────────────────────────────────

/** How long a completed audit can be served from cache before re-scanning. */
export const CACHE_DURATION_HOURS = 12;

/** Days after which a report is purged from the database. */
export const REPORT_EXPIRY_DAYS = 90;

/** Days the access token (in the email link) remains valid. */
export const ACCESS_TOKEN_EXPIRY_DAYS = 30;

// ──────────────────────────────────────────────────────────────
// Rate limits
// ──────────────────────────────────────────────────────────────

export const RATE_LIMITS = {
  /** Max audit creations per IP hash per sliding window. */
  auditCreation: {
    max: 3,
    windowMs: 60 * 60 * 1_000, // 1 hour
  },

  /** Max concurrent in-progress audits for the same hostname. */
  domainScans: {
    max: 1,
    windowMs: CACHE_DURATION_HOURS * 60 * 60 * 1_000,
  },

  /** Max unlock attempts per audit per IP hash. */
  unlock: {
    max: 5,
    windowMs: 15 * 60 * 1_000, // 15 min
  },

  /** Max admin login attempts per IP hash. */
  adminLogin: {
    max: 5,
    windowMs: 15 * 60 * 1_000, // 15 min
  },

  /** Max email resends per audit. */
  adminResend: {
    max: 3,
    windowMs: 60 * 60 * 1_000, // 1 hour
  },
} as const;

// ──────────────────────────────────────────────────────────────
// Fetch / scanning tunables
// ──────────────────────────────────────────────────────────────

export const FETCH_TIMEOUTS = {
  /** Timeout for HTML page fetch (ms). */
  html: 15_000,
  /** Timeout for HTML page fetch — conservative fallback. */
  htmlConservative: 10_000,
  /** Timeout for robots.txt fetch (ms). */
  robots: 8_000,
  /** Timeout for robots.txt — conservative fallback. */
  robotsConservative: 5_000,
} as const;

export const MAX_RESPONSE_SIZES = {
  /** Max bytes for an HTML response body. */
  html: 2 * 1_024 * 1_024, // 2 MB
  /** Max bytes for a robots.txt response body. */
  robots: 1 * 1_024 * 1_024, // 1 MB
} as const;

export const MAX_REDIRECTS = 5;

export const AUDIT_USER_AGENT = 'AdityaWebsiteAudit/1.0 (https://dev-aditya.com)';
