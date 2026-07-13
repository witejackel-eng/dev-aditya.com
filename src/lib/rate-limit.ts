/**
 * Database-backed rate limiting for the Website Revenue Audit Funnel.
 *
 * Uses the Drizzle ORM with the rate_limits table defined in schema.ts
 * to count requests per key within a sliding time window.
 * Old records are cleaned up opportunistically on every check.
 */

import crypto from 'node:crypto';

import { db } from '@/db';
import { logDbError } from '@/lib/db-error';
import { rateLimits } from '@/db/schema';
import { eq, gt, sql, and } from 'drizzle-orm';
import { env } from '@/lib/env';

// ──────────────────────────────────────────────────────────────
// Opportunistic cleanup
// ──────────────────────────────────────────────────────────────

/** Approximate fraction of check-rate-limit calls that trigger cleanup. */
const CLEANUP_PROBABILITY = 0.05;

async function cleanupOldRecords(): Promise<void> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1_000);
    await db
      .delete(rateLimits)
      .where(gt(rateLimits.created_at, new Date(0))); // placeholder — real filter below
    // Use raw SQL for the date comparison since drizzle-orm doesn't
    // easily support `< NOW() - interval` across all dialects.
    await db.execute(sql`DELETE FROM rate_limits WHERE created_at < NOW() - INTERVAL '1 hour'`);
  } catch {
    // Silently ignore cleanup failures — non-critical
  }
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  // Opportunistic cleanup
  if (Math.random() < CLEANUP_PROBABILITY) {
    cleanupOldRecords().catch(() => {});
  }

  const windowSeconds = Math.ceil(windowMs / 1_000);
  const windowStart = new Date(Date.now() - windowMs);

  try {
    // Count existing records in the window
    const countRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(rateLimits)
      .where(
        and(
          eq(rateLimits.key, key),
          gt(rateLimits.created_at, windowStart),
        ),
      );

    const currentCount = countRows[0]?.count ?? 0;
    const resetAt = new Date(Date.now() + windowMs);

    if (currentCount >= limit) {
      return { allowed: false, remaining: 0, resetAt };
    }

    // Record this request
    await db.insert(rateLimits).values({
      key,
      created_at: new Date(),
    });

    return {
      allowed: true,
      remaining: limit - currentCount - 1,
      resetAt,
    };
  } catch (err) {
    // If the rate_limits table doesn't exist yet, allow the request
    // but log the error
    logDbError('rate-limit', err);
    return { allowed: true, remaining: limit - 1, resetAt: new Date(Date.now() + windowMs) };
  }
}

// ──────────────────────────────────────────────────────────────
// IP hashing
// ──────────────────────────────────────────────────────────────

export function hashIpForRateLimit(ip: string): string {
  const secret = env.IP_HASH_SECRET;
  if (!secret) {
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
