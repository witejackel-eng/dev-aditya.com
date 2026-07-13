/**
 * Consistent event type names for the Website Revenue Audit Funnel.
 *
 * All events use snake_case naming convention.
 * This is the single source of truth for event type strings.
 */

export type AuditEventType =
  // Audit lifecycle
  | 'audit_created'
  | 'audit_started'
  | 'audit_completed'
  | 'audit_partial'
  | 'audit_failed'
  // Report viewing
  | 'public_report_viewed'
  | 'unlock_form_viewed'
  | 'full_report_viewed'
  // Lead / unlock
  | 'lead_unlocked'
  // CTAs
  | 'consultation_cta_clicked'
  | 'email_cta_clicked'
  // Email
  | 'report_email_sent'
  | 'report_email_failed'
  // Admin
  | 'admin_status_changed'
  | 'admin_resent_email'
  | 'admin_updated_notes';

/**
 * Client-safe event types — only these can be submitted via the
 * POST /api/audits/[auditId]/events endpoint.
 */
export const CLIENT_EVENT_TYPES: readonly AuditEventType[] = [
  'public_report_viewed',
  'unlock_form_viewed',
  'full_report_viewed',
  'consultation_cta_clicked',
  'email_cta_clicked',
] as const;

/**
 * Server-only event types — recorded by backend routes, never by the client.
 */
export const SERVER_EVENT_TYPES: readonly AuditEventType[] = [
  'audit_created',
  'audit_started',
  'audit_completed',
  'audit_partial',
  'audit_failed',
  'lead_unlocked',
  'report_email_sent',
  'report_email_failed',
  'admin_status_changed',
  'admin_resent_email',
  'admin_updated_notes',
] as const;

/** All valid event types. */
export const ALL_EVENT_TYPES: readonly AuditEventType[] = [
  ...CLIENT_EVENT_TYPES,
  ...SERVER_EVENT_TYPES,
] as const;
