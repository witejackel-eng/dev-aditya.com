/**
 * Drizzle ORM schema for the Website Revenue Audit Funnel.
 *
 * Three tables: audits, audit_leads, audit_events.
 * Uses neon serverless driver (PostgreSQL).
 */

import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ──────────────────────────────────────────────────────────────
// audits
// ──────────────────────────────────────────────────────────────

export const audits = pgTable(
  'audits',
  {
    id: text('id').primaryKey(),

    input_url: text('input_url').notNull(),
    normalized_url: text('normalized_url').notNull(),
    hostname: text('hostname').notNull(),

    status: text('status', {
      enum: [
        'queued',
        'validating',
        'fetching',
        'performance',
        'analyzing',
        'scoring',
        'completed',
        'partial',
        'failed',
      ],
    }).notNull().default('queued'),

    scanner_version: text('scanner_version'),

    overall_score: integer('overall_score'),
    performance_score: integer('performance_score'),
    seo_score: integer('seo_score'),
    accessibility_score: integer('accessibility_score'),
    best_practices_security_score: integer('best_practices_security_score'),
    mobile_readiness_score: integer('mobile_readiness_score'),
    conversion_readiness_score: integer('conversion_readiness_score'),

    /** Bit-flag coverage: which analysis steps completed successfully. */
    coverage: integer('coverage'),

    /** Full report payload – only populated on completed / partial. */
    report_data: jsonb('report_data'),

    cache_hit: boolean('cache_hit').notNull().default(false),

    /** SHA-256 hash of the originating IP (salted). */
    ip_hash: text('ip_hash'),

    utm_data: jsonb('utm_data'),

    error_code: text('error_code'),
    safe_error_message: text('safe_error_message'),

    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    started_at: timestamp('started_at', { withTimezone: true }),
    completed_at: timestamp('completed_at', { withTimezone: true }),
    expires_at: timestamp('expires_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_audits_hostname').on(table.hostname),
    index('idx_audits_status').on(table.status),
    index('idx_audits_created_at').on(table.created_at),
  ],
);

// ──────────────────────────────────────────────────────────────
// audit_leads
// ──────────────────────────────────────────────────────────────

export const audit_leads = pgTable(
  'audit_leads',
  {
    id: text('id').primaryKey(),

    audit_id: text('audit_id')
      .notNull()
      .references(() => audits.id, { onDelete: 'cascade' }),

    first_name: text('first_name').notNull(),
    email: text('email').notNull(),
    business_name: text('business_name'),

    marketing_consent: boolean('marketing_consent').notNull().default(false),

    status: text('status', {
      enum: [
        'new',
        'reviewed',
        'contacted',
        'replied',
        'consultation',
        'proposal_sent',
        'won',
        'lost',
        'not_suitable',
      ],
    })
      .notNull()
      .default('new'),

    notes: text('notes'),

    email_delivery_status: text('email_delivery_status', {
      enum: ['pending', 'sent', 'failed'],
    })
      .notNull()
      .default('pending'),

    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    last_contacted_at: timestamp('last_contacted_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('uq_audit_leads_audit_email').on(table.audit_id, table.email),
  ],
);

// ──────────────────────────────────────────────────────────────
// audit_events
// ──────────────────────────────────────────────────────────────

export const audit_events = pgTable(
  'audit_events',
  {
    id: text('id').primaryKey(),

    audit_id: text('audit_id')
      .notNull()
      .references(() => audits.id, { onDelete: 'cascade' }),

    lead_id: text('lead_id').references(() => audit_leads.id, {
      onDelete: 'set null',
    }),

    event_type: text('event_type').notNull(),

    metadata: jsonb('metadata'),

    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('idx_audit_events_audit_id').on(table.audit_id),
    index('idx_audit_events_event_type').on(table.event_type),
  ],
);

// CamelCase aliases for convenient imports
export { audit_leads as auditLeads, audit_events as auditEvents };
