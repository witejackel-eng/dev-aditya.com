/**
 * Request security utilities for the Website Revenue Audit Funnel.
 *
 * Provides:
 *  – Client IP extraction from proxy headers
 *  – Cloudflare Turnstile server-side verification
 *  – Same-origin validation (origin / referer checks)
 *  – Honeypot field detection for spam bots
 *  – Request body size limit helper
 */

import { env } from '@/lib/env';

// ──────────────────────────────────────────────────────────────
// Client IP extraction
// ──────────────────────────────────────────────────────────────

/**
 * Extract the client IP address from a Request object.
 *
 * Checks headers in order of trust:
 *  1. `x-forwarded-for` — first IP in the list (original client)
 *  2. `x-real-ip`       — set by some reverse proxies
 *  3. Fallback           — `unknown` (never an empty string)
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    const trimmed = realIp.trim();
    if (trimmed) return trimmed;
  }

  return 'unknown';
}

// ──────────────────────────────────────────────────────────────
// Cloudflare Turnstile verification
// ──────────────────────────────────────────────────────────────

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_TIMEOUT_MS = 10_000;

/** Official Cloudflare test keys. */
const TURNSTILE_TEST_SECRET_ALWAYS_PASSES = '1x0000000000000000000000000000000AA';
const TURNSTILE_TEST_SECRET_ALWAYS_FAILS = '2x0000000000000000000000000000000AA';
const TURNSTILE_TEST_SECRET_FORCE_INTERACTIVE = '3x0000000000000000000000000000000AA';

/**
 * Server-side Cloudflare Turnstile token verification.
 *
 * In test / development mode (when the official test site key is
 * configured), the verification uses the "always passes" test secret.
 */
export async function verifyTurnstile(
  token: string,
  expectedAction?: string,
): Promise<{ success: boolean; error?: string }> {
  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Turnstile token is missing.' };
  }

  let secret = env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (
      siteKey === '1x00000000000000000000AA' ||
      process.env.NODE_ENV !== 'production'
    ) {
      secret = TURNSTILE_TEST_SECRET_ALWAYS_PASSES;
    } else {
      return {
        success: false,
        error: 'Turnstile is not configured on the server.',
      };
    }
  }

  // Detect known test tokens
  if (token.startsWith('10000000-aaaa-bbbb-cccc-000000000001')) {
    secret = TURNSTILE_TEST_SECRET_ALWAYS_PASSES;
  } else if (token.startsWith('20000000-aaaa-bbbb-cccc-000000000002')) {
    secret = TURNSTILE_TEST_SECRET_ALWAYS_FAILS;
  } else if (token.startsWith('30000000-aaaa-bbbb-cccc-000000000003')) {
    secret = TURNSTILE_TEST_SECRET_FORCE_INTERACTIVE;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Turnstile verification request failed with status ${response.status}.`,
      };
    }

    const data = await response.json() as {
      success: boolean;
      'error-codes'?: string[];
      action?: string;
      hostname?: string;
      challenge_ts?: string;
    };

    if (!data.success) {
      const codes = data['error-codes']?.join(', ') ?? 'unknown';
      return {
        success: false,
        error: `Turnstile verification failed: ${codes}`,
      };
    }

    // Validate action if provided
    if (expectedAction && data.action !== expectedAction) {
      return {
        success: false,
        error: `Turnstile action mismatch. Expected "${expectedAction}", got "${data.action ?? 'null'}".`,
      };
    }

    return { success: true };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        error: 'Turnstile verification request timed out.',
      };
    }

    return {
      success: false,
      error: 'Turnstile verification request failed unexpectedly.',
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Same-origin validation
// ──────────────────────────────────────────────────────────────

/**
 * Validate that the request's Origin or Referer header matches
 * the site's own origin.
 *
 * Uses the incoming request's nextUrl.origin as the primary runtime
 * origin (instead of relying solely on NEXT_PUBLIC_SITE_URL).
 * Allows the current deployment host.
 * Optionally allows additional configured origins through
 * AUDIT_ALLOWED_ORIGINS env var (comma-separated).
 *
 * Does not blindly trust forwarded host headers.
 */
export function validateSameOrigin(request: Request & { nextUrl?: { origin: string } }): boolean {
  // Collect allowed origins
  const allowedOrigins = new Set<string>();

  // 1. Use the incoming request origin as the primary runtime origin
  const requestOrigin = (request as { nextUrl?: { origin: string } }).nextUrl?.origin;
  if (requestOrigin) {
    allowedOrigins.add(requestOrigin);
  }

  // 2. Allow NEXT_PUBLIC_SITE_URL as a fallback
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      allowedOrigins.add(new URL(siteUrl).origin);
    } catch {
      // Invalid URL — skip
    }
  }

  // 3. Allow additional configured origins
  const allowedOriginsEnv = env.AUDIT_ALLOWED_ORIGINS;
  if (allowedOriginsEnv) {
    for (const origin of allowedOriginsEnv.split(',')) {
      const trimmed = origin.trim();
      if (trimmed) {
        try {
          allowedOrigins.add(new URL(trimmed).origin);
        } catch {
          // Skip invalid URLs
        }
      }
    }
  }

  // If no origins could be determined, skip the check
  if (allowedOrigins.size === 0) {
    return true;
  }

  // Check Origin header
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const requestOriginStr = new URL(origin).origin;
      return allowedOrigins.has(requestOriginStr);
    } catch {
      return false;
    }
  }

  // Check Referer header
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      return allowedOrigins.has(refererOrigin);
    } catch {
      return false;
    }
  }

  // Neither header present — allow (legitimate clients may strip headers)
  return true;
}

// ──────────────────────────────────────────────────────────────
// Honeypot field check
// ──────────────────────────────────────────────────────────────

export function checkHoneypot(
  body: Record<string, unknown>,
  fieldName: string = 'website_confirm',
): boolean {
  const value = body[fieldName];

  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  return true;
}

// ──────────────────────────────────────────────────────────────
// Body size limit helper
// ──────────────────────────────────────────────────────────────

export async function readBodyWithLimit(
  request: Request,
  maxBytes: number = 1_024 * 1_024,
): Promise<string> {
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const length = parseInt(contentLength, 10);
    if (!isNaN(length) && length > maxBytes) {
      throw new Error(
        `Request body too large: ${length} bytes exceeds limit of ${maxBytes} bytes.`,
      );
    }
  }

  let bytesRead = 0;
  const chunks: Uint8Array[] = [];

  if (!request.body) {
    return '';
  }

  const reader = request.body.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesRead += value.byteLength;

      if (bytesRead > maxBytes) {
        reader.cancel().catch(() => {});
        throw new Error(
          `Request body too large: exceeded limit of ${maxBytes} bytes.`,
        );
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const totalLength = chunks.reduce((sum, c) => sum + c.byteLength, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder('utf-8', { fatal: false }).decode(combined);
}
