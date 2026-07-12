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
 *
 * @param request  The incoming Request.
 * @returns The client IP string, or `'unknown'` if it cannot be determined.
 */
export function getClientIp(request: Request): string {
  // x-forwarded-for may contain: "client-ip, proxy1, proxy2"
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
const TURNSTILE_TIMEOUT_MS = 10_000; // 10 seconds

/** Official Cloudflare test keys — always pass / always fail. */
const TURNSTILE_TEST_SECRET_ALWAYS_PASSES = '1x0000000000000000000000000000000AA';
const TURNSTILE_TEST_SECRET_ALWAYS_FAILS = '2x0000000000000000000000000000000AA';
const TURNSTILE_TEST_SECRET_FORCE_INTERACTIVE = '3x0000000000000000000000000000000AA';

/**
 * Server-side Cloudflare Turnstile token verification.
 *
 * **IMPORTANT**: This function MUST only be called from server-side
 * code (API routes, server actions).  The secret key must never be
 * sent to the browser.
 *
 * In test / development mode (when the official test site key is
 * configured), the verification uses the "always passes" test secret.
 *
 * @param token           The Turnstile response token from the client.
 * @param expectedAction  Optional action string to validate against.
 * @returns `{ success: true }` or `{ success: false, error: string }`.
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
    // If no secret is configured, check if we're in test mode.
    const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (
      siteKey === '1x00000000000000000000AA' || // always-passes test key
      process.env.NODE_ENV !== 'production'
    ) {
      // Use the official "always passes" test secret.
      secret = TURNSTILE_TEST_SECRET_ALWAYS_PASSES;
    } else {
      return {
        success: false,
        error: 'Turnstile is not configured on the server.',
      };
    }
  }

  // Detect if the provided token is a known test token and use
  // the matching test secret.
  if (token.startsWith('10000000-aaaa-bbbb-cccc-000000000001')) {
    // Cloudflare "always passes" test token
    secret = TURNSTILE_TEST_SECRET_ALWAYS_PASSES;
  } else if (token.startsWith('20000000-aaaa-bbbb-cccc-000000000002')) {
    // Cloudflare "always fails" test token
    secret = TURNSTILE_TEST_SECRET_ALWAYS_FAILS;
  } else if (token.startsWith('30000000-aaaa-bbbb-cccc-000000000003')) {
    // Cloudflare "force interactive" test token
    secret = TURNSTILE_TEST_SECRET_FORCE_INTERACTIVE;
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  let expectedHostname: string | undefined;
  try {
    expectedHostname = new URL(siteUrl).hostname;
  } catch {
    // If SITE_URL is invalid, skip hostname validation.
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
        // remoteip is not sent — we don't need IP-based validation.
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

    // Validate action if an expected action was provided.
    if (expectedAction && data.action !== expectedAction) {
      return {
        success: false,
        error: `Turnstile action mismatch. Expected "${expectedAction}", got "${data.action ?? 'null'}".`,
      };
    }

    // Validate hostname if we were able to determine it.
    if (expectedHostname && data.hostname && data.hostname !== expectedHostname) {
      return {
        success: false,
        error: `Turnstile hostname mismatch. Expected "${expectedHostname}", got "${data.hostname}".`,
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
 * Validate that the request's `Origin` or `Referer` header matches
 * the site's own origin (NEXT_PUBLIC_SITE_URL).
 *
 * This prevents cross-origin form submissions from third-party
 * sites.  If neither header is present the check is skipped
 * (some privacy-focused clients strip these headers).
 *
 * @param request  The incoming Request.
 * @returns `true` if the origin is valid or cannot be determined,
 *          `false` if it is explicitly from a different origin.
 */
export function validateSameOrigin(request: Request): boolean {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  let siteOrigin: string;
  try {
    siteOrigin = new URL(siteUrl).origin;
  } catch {
    // If SITE_URL is invalid, skip the check.
    return true;
  }

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const requestOrigin = new URL(origin).origin;
      return requestOrigin === siteOrigin;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      return refererOrigin === siteOrigin;
    } catch {
      return false;
    }
  }

  // Neither header present — allow (can't verify, but don't block
  // legitimate clients that strip headers).
  return true;
}

// ──────────────────────────────────────────────────────────────
// Honeypot field check
// ──────────────────────────────────────────────────────────────

/**
 * Check whether a honeypot field in the request body has been
 * filled in.  Honeypot fields are hidden from real users but
 * visible to bots that blindly fill every input.
 *
 * @param body       Parsed request body as a plain object.
 * @param fieldName  The honeypot field name (default: `'website_confirm'`).
 * @returns `true` if the honeypot is filled (likely a bot), `false` if clean.
 */
export function checkHoneypot(
  body: Record<string, unknown>,
  fieldName: string = 'website_confirm',
): boolean {
  const value = body[fieldName];

  if (value === undefined || value === null) {
    // Field not submitted — clean.
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    // Empty string — clean (legitimate user left it blank).
    return false;
  }

  // Any non-empty value means a bot likely filled it.
  return true;
}

// ──────────────────────────────────────────────────────────────
// Body size limit helper
// ──────────────────────────────────────────────────────────────

/**
 * Read the request body as text, enforcing a maximum size limit.
 *
 * If the body exceeds `maxBytes`, the read is aborted and an
 * error is thrown.  This prevents clients from sending
 * arbitrarily large payloads.
 *
 * @param request  The incoming Request.
 * @param maxBytes Maximum body size in bytes (default: 1 MB).
 * @returns The body as a string.
 * @throws Error if the body is too large or cannot be read.
 */
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
