/**
 * Report access control for the Website Revenue Audit Funnel.
 *
 * Provides signed access tokens and HttpOnly cookies that gate
 * access to the full audit report.  Tokens are HMAC-signed with
 * AUDIT_SIGNING_SECRET and verified with constant-time comparison.
 *
 * **Security notes**:
 *  – Tokens never contain email addresses or other PII.
 *  – HMAC verification uses `crypto.timingSafeEqual` to resist
 *    timing attacks.
 *  – Access tokens expire after 30 days.
 */

import crypto from 'node:crypto';

import { env } from '@/lib/env';
import { ACCESS_TOKEN_EXPIRY_DAYS } from './constants';

// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────

/** Prefix for audit access cookies. */
export const REPORT_ACCESS_COOKIE_PREFIX = 'audit_access_';

/** HMAC algorithm used for signing. */
const HMAC_ALGORITHM = 'sha256';

/** Token expiration in milliseconds. */
const TOKEN_EXPIRY_MS = ACCESS_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1_000;

// ──────────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────────

/**
 * Compute an HMAC over the given data using AUDIT_SIGNING_SECRET.
 *
 * @throws Error if AUDIT_SIGNING_SECRET is not configured.
 */
function computeHmac(data: string): string {
  const secret = env.AUDIT_SIGNING_SECRET;
  if (!secret) {
    throw new Error(
      '[report-access] AUDIT_SIGNING_SECRET is not configured. Cannot sign or verify tokens.',
    );
  }
  return crypto.createHmac(HMAC_ALGORITHM, secret).update(data).digest('hex');
}

/**
 * URL-safe Base64 encoding (no `+`, `/`, or `=` padding).
 */
function base64urlEncode(input: string): string {
  return Buffer.from(input, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * URL-safe Base64 decoding.
 */
function base64urlDecode(input: string): string {
  // Restore padding.
  let padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  padded += '='.repeat(padLength);
  return Buffer.from(padded, 'base64').toString('utf-8');
}

/**
 * Constant-time string comparison.
 */
function constantTimeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still perform a comparison of equal-length data to avoid timing leaks.
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b.padEnd(a.length, '\0'), 'utf8');
    try {
      crypto.timingSafeEqual(bufA, bufB.subarray(0, bufA.length));
    } catch {
      // Swallow — result is false anyway.
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
// Access token (for email links)
// ──────────────────────────────────────────────────────────────

/**
 * Generate a signed access token for an audit report.
 *
 * Token format: `<base64url payload>.<HMAC signature>`
 *
 * Payload is a JSON object: `{ aid: auditId, exp: timestamp }`
 * — **no email or PII** is ever included.
 *
 * @param auditId  The audit ID this token grants access to.
 * @returns The signed access token string.
 */
export function generateAccessToken(auditId: string): string {
  const now = Date.now();
  const payload = JSON.stringify({
    aid: auditId,
    exp: now + TOKEN_EXPIRY_MS,
  });

  const encodedPayload = base64urlEncode(payload);
  const signature = computeHmac(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

/**
 * Verify an access token and extract the audit ID.
 *
 * @param token  The token string to verify.
 * @returns `{ valid: true, auditId }` or `{ valid: false }`.
 */
export function verifyAccessToken(token: string): {
  valid: boolean;
  auditId?: string;
} {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) {
    return { valid: false };
  }

  const encodedPayload = token.substring(0, dotIndex);
  const providedSignature = token.substring(dotIndex + 1);

  if (!encodedPayload || !providedSignature) {
    return { valid: false };
  }

  // Verify HMAC with constant-time comparison.
  try {
    const expectedSignature = computeHmac(encodedPayload);
    if (!constantTimeStringEqual(providedSignature, expectedSignature)) {
      return { valid: false };
    }
  } catch {
    return { valid: false };
  }

  // Decode and validate payload.
  try {
    const payloadJson = base64urlDecode(encodedPayload);
    const payload = JSON.parse(payloadJson) as { aid?: string; exp?: number };

    if (!payload.aid || typeof payload.aid !== 'string') {
      return { valid: false };
    }

    // Check expiration.
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, auditId: payload.aid };
  } catch {
    return { valid: false };
  }
}

// ──────────────────────────────────────────────────────────────
// Report access cookie
// ──────────────────────────────────────────────────────────────

/**
 * Create a signed HttpOnly cookie that grants access to a specific
 * audit report.
 *
 * The cookie value is a signed token (same format as the access
 * token) scoped to the given audit ID.
 *
 * @param auditId  The audit ID to grant access to.
 * @returns Object with `name`, `value`, and `options` for `cookies().set()`.
 */
export function setReportAccessCookie(auditId: string): {
  name: string;
  value: string;
  options: Record<string, unknown>;
} {
  const token = generateAccessToken(auditId);
  const cookieName = `${REPORT_ACCESS_COOKIE_PREFIX}${auditId}`;

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: cookieName,
    value: token,
    options: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: ACCESS_TOKEN_EXPIRY_DAYS * 24 * 60 * 60, // 30 days in seconds
    },
  };
}

/**
 * Verify a report access cookie value for a specific audit ID.
 *
 * @param cookieValue  The raw cookie value.
 * @param auditId      The audit ID to verify access for.
 * @returns `true` if the cookie is valid for this audit, `false` otherwise.
 */
export function verifyReportAccessCookie(
  cookieValue: string,
  auditId: string,
): boolean {
  const result = verifyAccessToken(cookieValue);

  if (!result.valid || !result.auditId) {
    return false;
  }

  return result.auditId === auditId;
}
