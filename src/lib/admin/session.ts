/**
 * Admin session management.
 *
 * Creates and verifies HMAC-signed session cookies for the admin
 * dashboard.  The cookie value is `sessionId:HMAC` where the HMAC
 * is computed over the session ID using ADMIN_SESSION_SECRET.
 *
 * Sessions expire after 24 hours.
 */

import crypto from 'node:crypto';

import { env } from '@/lib/env';

// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────

/** Name of the admin session cookie. */
export const ADMIN_COOKIE_NAME = 'admin_session';

/** Session lifetime in milliseconds (24 hours). */
const SESSION_LIFETIME_MS = 24 * 60 * 60 * 1_000;

/** HMAC digest algorithm. */
const HMAC_ALGORITHM = 'sha256';

// ──────────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────────

/**
 * Compute an HMAC over the given data using ADMIN_SESSION_SECRET.
 */
function computeHmac(data: string): string {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      '[admin/session] ADMIN_SESSION_SECRET is not configured. Cannot create or verify sessions.',
    );
  }
  return crypto.createHmac(HMAC_ALGORITHM, secret).update(data).digest('hex');
}

/**
 * Constant-time string comparison.
 *
 * Returns `true` when `a` and `b` are the same length and have
 * identical contents, `false` otherwise.  Timing does not depend
 * on where the first difference occurs.
 */
function constantTimeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do a comparison of the same length to keep timing consistent,
    // but the result is always false.
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b.padEnd(a.length, '\0'), 'utf8');
    try {
      crypto.timingSafeEqual(bufA, bufB.subarray(0, bufA.length));
    } catch {
      // Swallow — we're returning false anyway.
    }
    return false;
  }

  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');

  try {
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Create a signed admin session cookie.
 *
 * @returns An object with `name`, `value`, and `options` suitable
 *          for passing to `cookies().set()`.
 */
export function createSessionCookie(): {
  name: string;
  value: string;
  options: Record<string, unknown>;
} {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const hmac = computeHmac(sessionId);
  const value = `${sessionId}:${hmac}`;

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: ADMIN_COOKIE_NAME,
    value,
    options: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/admin',
      maxAge: Math.floor(SESSION_LIFETIME_MS / 1_000),
    },
  };
}

/**
 * Verify a session cookie value.
 *
 * Splits the value into `sessionId` and `HMAC`, recomputes the
 * expected HMAC, and performs a constant-time comparison.
 *
 * @param cookieValue  The raw cookie value from the request.
 * @returns `true` if the HMAC is valid, `false` otherwise.
 */
export function verifySession(cookieValue: string): boolean {
  if (!cookieValue || typeof cookieValue !== 'string') {
    return false;
  }

  const colonIndex = cookieValue.lastIndexOf(':');
  if (colonIndex === -1) {
    return false;
  }

  const sessionId = cookieValue.substring(0, colonIndex);
  const providedHmac = cookieValue.substring(colonIndex + 1);

  if (!sessionId || !providedHmac) {
    return false;
  }

  try {
    const expectedHmac = computeHmac(sessionId);
    return constantTimeStringEqual(providedHmac, expectedHmac);
  } catch {
    return false;
  }
}
