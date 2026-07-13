/**
 * Environment variable validation for the Website Revenue Audit Funnel.
 *
 * Uses Zod to parse and type-check every env var the audit feature needs.
 * Optional vars that are missing at runtime produce a warning but never
 * crash the build.
 */

import { z } from 'zod';

const envSchema = z.object({
  /** Public site origin — used in URLs, email links, and the user-agent header. */
  NEXT_PUBLIC_SITE_URL: z.string().default('https://dev-aditya.com'),

  /** Neon PostgreSQL connection string. Optional at build time. */
  DATABASE_URL: z.string().optional(),

  /** Google PageSpeed Insights API key. */
  GOOGLE_PAGESPEED_API_KEY: z.string().optional(),

  /** Resend.com API key for transactional email. */
  RESEND_API_KEY: z.string().optional(),

  /** From address for audit report emails. */
  AUDIT_FROM_EMAIL: z.string().default('Aditya Website Audit <audit@dev-aditya.com>'),

  /** Internal notification address — receives new-lead alerts. */
  AUDIT_NOTIFICATION_EMAIL: z.string().default('hi.aditya.dev@gmail.com'),

  /** HMAC secret for signing audit access tokens. */
  AUDIT_SIGNING_SECRET: z.string().optional(),

  /** Salt mixed into IP hashes so raw hashes are not reversible. */
  IP_HASH_SECRET: z.string().optional(),

  /** Feature flag — set to "false" to disable the audit funnel entirely. */
  AUDIT_FEATURE_ENABLED: z.string().default('true'),

  /** Cloudflare Turnstile site key (rendered client-side). */
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),

  /** Cloudflare Turnstile secret key (server-side verification). */
  TURNSTILE_SECRET_KEY: z.string().optional(),

  /** bcrypt/argon hash of the admin dashboard password. */
  ADMIN_PASSWORD_HASH: z.string().optional(),

  /** Secret for signing admin session cookies. */
  ADMIN_SESSION_SECRET: z.string().optional(),

  /** When "true", the scanner returns hardcoded fixture data instead of live results. */
  AUDIT_USE_FIXTURES: z.string().default('false'),

  /** Comma-separated list of additional allowed origins for same-origin checks. */
  AUDIT_ALLOWED_ORIGINS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Log all validation issues but never throw — the app should still build.
  console.error(
    '[env] Invalid environment variables:',
    parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
  );
}

/** Typed, validated environment variables. Falls back to defaults where defined. */
export const env: z.infer<typeof envSchema> = parsed.success
  ? parsed.data
  : envSchema.parse({});

// Warn about optional vars that are empty at runtime (not build time).
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  const optionalKeys: (keyof z.infer<typeof envSchema>)[] = [
    'DATABASE_URL',
    'GOOGLE_PAGESPEED_API_KEY',
    'RESEND_API_KEY',
    'AUDIT_SIGNING_SECRET',
    'IP_HASH_SECRET',
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
    'TURNSTILE_SECRET_KEY',
    'ADMIN_PASSWORD_HASH',
    'ADMIN_SESSION_SECRET',
  ];

  for (const key of optionalKeys) {
    if (!env[key]) {
      console.warn(`[env] Optional variable ${key} is not set.`);
    }
  }
}

/** Convenience booleans derived from env. */
export const isAuditEnabled = env.AUDIT_FEATURE_ENABLED === 'true';
export const isFixturesMode = (() => {
  // Guard: fixtures mode must never activate in production
  if (process.env.NODE_ENV === 'production' && env.AUDIT_USE_FIXTURES === 'true') {
    console.error(
      '[env] CRITICAL: AUDIT_USE_FIXTURES is "true" in production. ' +
      'Fixtures mode is disabled for safety. Remove AUDIT_USE_FIXTURES or set it to "false".',
    );
    return false;
  }
  return env.AUDIT_USE_FIXTURES === 'true';
})();
export const hasPageSpeedKey = typeof env.GOOGLE_PAGESPEED_API_KEY === 'string' && env.GOOGLE_PAGESPEED_API_KEY.length > 0;
export const hasResendKey = typeof env.RESEND_API_KEY === 'string' && env.RESEND_API_KEY.length > 0;
export const hasTurnstile = typeof env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === 'string' && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY.length > 0;
