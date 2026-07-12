/**
 * Database-backed rate limiting for the Website Revenue Audit Funnel.
 *
 * Uses a PostgreSQL `rate_limits` table (created via raw SQL) to
 * count requests per key within a sliding time window. Old records
 * are cleaned up opportunistically on every check to keep the table
 * small.
 *
 * The `key` parameter is typically a HMAC-hashed IP address
 * (produced by `hashIpForRateLimit`) so that raw IPs are never
 * stored in the database.
 *
 * Parameterised queries use the neon tagged-template function
 * accessed via `db.$client` for safe SQL injection protection.
 */

import crypto from 'node:crypto';

import { db } from '@/db';
import { env } from '@/lib/env';

// ──────────────────────────────────────────────────────────────
// Table initialisation
// ──────────────────────────────────────────────────────────────

let tableEnsured = false;

/**
 * Ensure the `rate_limits` table exists.  Idempotent — safe to
 * call multiple times.
 */
async function ensureTable(): Promise<void> {
  if (tableEnsured) return;

  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id        SERIAL PRIMARY KEY,
        key       TEXT    NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_rate_limits_key_created
        ON rate_limits (key, created_at);
    `);

    tableEnsured = true;
  } catch (err) {
    // If the table/index already exists, that's fine.
    if (err instanceof Error && err.message.includes('already exists')) {
      tableEnsured = true;
      return;
    }
    // Re-throw unexpected errors so callers know the DB is unreachable.
    throw err;
  }
}

// ──────────────────────────────────────────────────────────────
// Opportunistic cleanup
// ──────────────────────────────────────────────────────────────

/** Approximate fraction of check-rate-limit calls that trigger cleanup. */
const CLEANUP_PROBABILITY = 0.05; // ~5 % of calls

/**
 * Delete stale rate-limit rows that are older than the largest
 * reasonable window (1 hour).  Called opportunistically to avoid
 * unbounded table growth.
 */
async function cleanupOldRecords(): Promise<void> {
  try {
    await db.execute(`
      DELETE FROM rate_limits
      WHERE created_at < NOW() - INTERVAL '1 hour';
    `);
  } catch {
    // Silently ignore cleanup failures — they are non-critical.
  }
}

// ──────────────────────────────────────────────────────────────
// Neon client accessor
// ──────────────────────────────────────────────────────────────

/**
 * Get the underlying neon tagged-template function from the drizzle
 * client.  This allows parameterised SQL queries with proper
 * injection protection: `sql\`SELECT $1\`${[value]}\`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNeonClient(): any {
  // db.$client is the neon query function set during drizzle()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db as any).$client;
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

export interface RateLimitResult {
  /** Whether the request is allowed within the limit. */
  allowed: boolean;
  /** Number of remaining requests in the current window. */
  remaining: number;
  /** When the window resets (earliest record in the window expires). */
  resetAt: Date;
}

/**
 * Check whether a request identified by `key` is within the
 * allowed rate limit.
 *
 * @param key       Identifier for the rate-limit bucket
 *                  (e.g., HMAC-hashed IP, or `audit:<hostname>`).
 * @param limit     Maximum number of requests allowed in the window.
 * @param windowMs  Sliding window duration in milliseconds.
 * @returns Promise resolving to `{ allowed, remaining, resetAt }`.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  await ensureTable();

  // Opportunistic cleanup.
  if (Math.random() < CLEANUP_PROBABILITY) {
    // Fire-and-forget — don't block the rate-limit check.
    cleanupOldRecords().catch(() => {});
  }

  const windowSeconds = Math.ceil(windowMs / 1_000);

  // Use the neon tagged-template client for parameterised queries
  // to prevent SQL injection.
  const neonClient = getNeonClient();

  let currentCount = 0;

  if (neonClient && typeof neonClient === 'function') {
    const countRows = await neonClient`
      SELECT COUNT(*) AS count
      FROM rate_limits
      WHERE key = ${key}
        AND created_at > NOW() - INTERVAL '1 second' * ${windowSeconds}
    `;
    currentCount = Number(countRows?.[0]?.count ?? 0);
  } else {
    // Fallback: use db.execute with escaped string (less ideal but safe
    // because `key` is always a hex HMAC hash).
    const escapedKey = key.replace(/'/g, "''");
    const countResult = await db.execute(`
      SELECT COUNT(*) AS count
      FROM rate_limits
      WHERE key = '${escapedKey}'
        AND created_at > NOW() - INTERVAL '1 second' * ${windowSeconds}
    `);
    const rows = countResult as unknown as { rows: Array<{ count: string }> };
    currentCount = Number(rows.rows?.[0]?.count ?? 0);
  }

  const resetAt = new Date(Date.now() + windowMs);

  if (currentCount >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // Record this request.
  if (neonClient && typeof neonClient === 'function') {
    await neonClient`
      INSERT INTO rate_limits (key) VALUES (${key})
    `;
  } else {
    const escapedKey = key.replace(/'/g, "''");
    await db.execute(`
      INSERT INTO rate_limits (key) VALUES ('${escapedKey}')
    `);
  }

  return {
    allowed: true,
    remaining: limit - currentCount - 1,
    resetAt,
  };
}

// ──────────────────────────────────────────────────────────────
// IP hashing
// ──────────────────────────────────────────────────────────────

/**
 * HMAC-hash an IP address so the raw IP is never stored in the
 * database.  Uses IP_HASH_SECRET from environment.
 *
 * @param ip  The raw IP address string.
 * @returns   Hex-encoded HMAC digest.
 */
export function hashIpForRateLimit(ip: string): string {
  const secret = env.IP_HASH_SECRET;
  if (!secret) {
    // Fallback: if the secret is not configured, hash with a fixed
    // salt so we at least don't store raw IPs.  This is NOT as
    // secure as a proper HMAC secret — log a warning.
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[rate-limit] IP_HASH_SECRET is not set — using fallback hashing. Set IP_HASH_SECRET for production.',
      );
    }
    return crypto.createHash('sha256').update(`ip-fallback-salt:${ip}`).digest('hex');
  }

  return crypto
    .createHmac('sha256', secret)
    .update(ip)
    .digest('hex');
}
