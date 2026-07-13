/**
 * Safe HTTP fetching for the Website Revenue Audit Funnel.
 *
 * Every outbound request goes through this module so that:
 *  – SSRF is prevented (redirects are re-validated against private IPs)
 *  – Timeouts are enforced
 *  – Response sizes are bounded
 *  – The user-agent identifies the audit tool
 *  – No cookies, auth tokens, or internal headers leak out
 *  – Non-HTML content types are rejected for HTML fetches
 *
 * Uses native `fetch` with manual redirect following so we can
 * re-validate DNS on every hop.
 */

import dns from 'node:dns/promises';
import ipaddr from 'ipaddr.js';
import {
  AUDIT_USER_AGENT,
  FETCH_TIMEOUTS,
  MAX_RESPONSE_SIZES,
  MAX_REDIRECTS,
} from './constants';

// ──────────────────────────────────────────────────────────────
// IP validation helpers
// ──────────────────────────────────────────────────────────────

const IPV4_PRIVATE_CIDRS = [
  '127.0.0.0/8',
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  '169.254.0.0/16',
  '0.0.0.0/8',
  '100.64.0.0/10',
  '198.18.0.0/15',
  '224.0.0.0/4',
  '240.0.0.0/4',
] as const;

const IPV6_PRIVATE_CIDRS = [
  '::1/128',
  'fc00::/7',
  'fe80::/10',
  'ff00::/8',
] as const;

const IPV4_SUBNETS = IPV4_PRIVATE_CIDRS.map((cidr) => ipaddr.parseCIDR(cidr));
const IPV6_SUBNETS = IPV6_PRIVATE_CIDRS.map((cidr) => ipaddr.parseCIDR(cidr));

const IPV4_BLOCKED_RANGES = new Set([
  'loopback',
  'private',
  'linkLocal',
  'multicast',
  'reserved',
  'unspecified',
  'carrierGradeNat',
]);

const IPV6_BLOCKED_RANGES = new Set([
  'loopback',
  'uniqueLocal',
  'linkLocal',
  'multicast',
  'reserved',
  'unspecified',
]);

function isPrivateIp(ipStr: string): boolean {
  if (ipaddr.IPv4.isValid(ipStr)) {
    const addr = ipaddr.IPv4.parse(ipStr);
    for (const subnet of IPV4_SUBNETS) {
      try {
        if (addr.match(subnet)) return true;
      } catch {
        // skip incompatible subnet
      }
    }
    if (IPV4_BLOCKED_RANGES.has(addr.range())) return true;
    return false;
  }

  if (ipaddr.IPv6.isValid(ipStr)) {
    const addr = ipaddr.IPv6.parse(ipStr);
    if (addr.isIPv4MappedAddress()) {
      try {
        const v4 = addr.toIPv4Address();
        return isPrivateIp(v4.toString());
      } catch {
        return true;
      }
    }
    for (const subnet of IPV6_SUBNETS) {
      try {
        if (addr.match(subnet)) return true;
      } catch {
        // skip incompatible subnet
      }
    }
    if (IPV6_BLOCKED_RANGES.has(addr.range())) return true;
    return false;
  }

  // Not parseable — treat as unsafe.
  return true;
}

/**
 * Resolve a hostname and confirm every address is public.
 * Returns `true` if the hostname resolves exclusively to public IPs.
 */
async function isPublicHostname(hostname: string): Promise<boolean> {
  try {
    const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
    return addresses.length > 0 && addresses.every((a) => !isPrivateIp(a.address));
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────────────────────
// Safe error messages
// ──────────────────────────────────────────────────────────────

const SAFE_ERROR_MAP: Record<string, string> = {
  ABORT_ERR: 'We could not access this public page — the request timed out.',
  TIMEOUT: 'We could not access this public page — the request timed out.',
  ECONNREFUSED: 'We could not access this public page — the server refused the connection.',
  ECONNRESET: 'We could not access this public page — the connection was reset.',
  ENOTFOUND: 'We could not access this public page — the domain could not be found.',
  EAI_AGAIN: 'We could not access this public page — DNS lookup timed out.',
  FETCH_ERROR: 'We could not access this public page.',
  PRIVATE_REDIRECT: 'The website redirected to an unsupported destination.',
  TOO_MANY_REDIRECTS: 'The website redirected too many times.',
  NON_HTML_CONTENT: 'The website returned non-HTML content that cannot be audited.',
  RESPONSE_TOO_LARGE: 'The website returned a response that is too large to process.',
  UNSAFE_URL: 'The website URL is not safe to access.',
};

/**
 * Convert a raw error into a user-safe message that reveals
 * nothing about our infrastructure.
 */
export function toSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for our custom codes first.
    if ('code' in error) {
      const code = (error as Error & { code: string }).code;
      if (SAFE_ERROR_MAP[code]) return SAFE_ERROR_MAP[code];
    }

    // Match common native error names / messages.
    const name = error.name;
    if (name === 'AbortError') return SAFE_ERROR_MAP.ABORT_ERR;
    if (name === 'TimeoutError') return SAFE_ERROR_MAP.TIMEOUT;

    const msg = error.message || '';
    if (msg.includes('ECONNREFUSED')) return SAFE_ERROR_MAP.ECONNREFUSED;
    if (msg.includes('ECONNRESET')) return SAFE_ERROR_MAP.ECONNRESET;
    if (msg.includes('ENOTFOUND')) return SAFE_ERROR_MAP.ENOTFOUND;
    if (msg.includes('EAI_AGAIN')) return SAFE_ERROR_MAP.EAI_AGAIN;
    if (msg.includes('redirect')) return SAFE_ERROR_MAP.TOO_MANY_REDIRECTS;
    if (msg.includes('private') || msg.includes('internal')) return SAFE_ERROR_MAP.PRIVATE_REDIRECT;
    if (msg.includes('non-HTML') || msg.includes('content-type')) return SAFE_ERROR_MAP.NON_HTML_CONTENT;
    if (msg.includes('too large') || msg.includes('exceeded')) return SAFE_ERROR_MAP.RESPONSE_TOO_LARGE;
  }

  return SAFE_ERROR_MAP.FETCH_ERROR;
}

// ──────────────────────────────────────────────────────────────
// Fetch options
// ──────────────────────────────────────────────────────────────

export interface SafeFetchOptions {
  /** Fetch purpose — controls timeouts, size limits, and Accept header. */
  purpose: 'html' | 'robots';
  /** Custom timeout in ms (overrides the default for the purpose). */
  timeoutMs?: number;
  /** Custom max response size in bytes. */
  maxSize?: number;
  /** Whether to follow redirects (default: true, with SSRF re-validation). */
  followRedirects?: boolean;
  /** AbortSignal for external cancellation. */
  signal?: AbortSignal;
}

// ──────────────────────────────────────────────────────────────
// Core safeFetch
// ──────────────────────────────────────────────────────────────

export interface SafeFetchResult {
  /** The final URL after following all redirects. */
  finalUrl: string;
  /** HTTP status code of the final response. */
  status: number;
  /** Response body as text (bounded by maxSize). */
  body: string;
  /** Content-Type header of the final response. */
  contentType: string | null;
  /** All redirect hops encountered (empty if none). */
  redirectChain: string[];
  /** Whether the response was truncated due to size limits. */
  truncated: boolean;
}

class SafeFetchError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'SafeFetchError';
    this.code = code;
  }
}

/**
 * SSRF-safe fetch with manual redirect handling.
 *
 * On each redirect hop the destination hostname is DNS-resolved
 * and checked against the private-IP blocklist before the next
 * request is made.
 */
export async function safeFetch(
  url: string,
  options: SafeFetchOptions,
): Promise<SafeFetchResult> {
  const {
    purpose,
    timeoutMs,
    maxSize,
    followRedirects = true,
    signal: externalSignal,
  } = options;

  const timeout = timeoutMs ?? (purpose === 'html' ? FETCH_TIMEOUTS.html : FETCH_TIMEOUTS.robots);
  const maxBytes = maxSize ?? (purpose === 'html' ? MAX_RESPONSE_SIZES.html : MAX_RESPONSE_SIZES.robots);
  const acceptHeader =
    purpose === 'html'
      ? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.1'
      : 'text/plain,*/*;q=0.1';

  let currentUrl = url;
  let redirectsRemaining = MAX_REDIRECTS;
  const redirectChain: string[] = [];

  // Create a combined AbortController for timeout + external signal.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Wire up external signal if provided.
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      throw new SafeFetchError('TIMEOUT', 'Request was aborted before it started.');
    }
    externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    while (true) {
      // ── Validate the URL before each hop ──
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(currentUrl);
      } catch {
        throw new SafeFetchError('UNSAFE_URL', `Invalid URL: ${currentUrl}`);
      }

      if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
        throw new SafeFetchError('UNSAFE_URL', `Unsupported protocol: ${parsedUrl.protocol}`);
      }

      // ── DNS re-validation on each redirect ──
      const isPublic = await isPublicHostname(parsedUrl.hostname);
      if (!isPublic) {
        throw new SafeFetchError(
          'PRIVATE_REDIRECT',
          `Hostname ${parsedUrl.hostname} resolves to a private/reserved IP.`,
        );
      }

      // ── Build the request (never send cookies / auth / internal headers) ──
      const headers: Record<string, string> = {
        'User-Agent': AUDIT_USER_AGENT,
        'Accept': acceptHeader,
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
      };

      const response = await fetch(currentUrl, {
        method: 'GET',
        headers,
        redirect: 'manual', // Handle redirects ourselves for SSRF validation.
        signal: controller.signal,
      });

      // ── Handle redirects ──
      const status = response.status;
      if (
        followRedirects &&
        (status === 301 || status === 302 || status === 303 || status === 307 || status === 308)
      ) {
        redirectsRemaining -= 1;
        if (redirectsRemaining < 0) {
          throw new SafeFetchError(
            'TOO_MANY_REDIRECTS',
            `Exceeded maximum of ${MAX_REDIRECTS} redirects.`,
          );
        }

        const location = response.headers.get('location');
        if (!location) {
          throw new SafeFetchError(
            'TOO_MANY_REDIRECTS',
            'Redirect response missing Location header.',
          );
        }

        // Resolve the redirect URL relative to the current URL.
        const nextUrl = new URL(location, currentUrl).toString();
        redirectChain.push(nextUrl);
        currentUrl = nextUrl;

        // Consume the body to free the connection.
        await response.body?.cancel().catch(() => {});

        // Loop to follow the redirect.
        continue;
      }

      // ── Not a redirect — this is the final response ──

      // Check content type for HTML fetches.
      const contentType = response.headers.get('content-type') ?? null;
      if (purpose === 'html' && contentType) {
        const ctLower = contentType.toLowerCase();
        // Allow HTML, XHTML, and plain XML. Reject images, PDFs, etc.
        const isHtmlLike =
          ctLower.includes('text/html') ||
          ctLower.includes('application/xhtml') ||
          ctLower.includes('application/xml');
        if (!isHtmlLike) {
          await response.body?.cancel().catch(() => {});
          throw new SafeFetchError(
            'NON_HTML_CONTENT',
            `Expected HTML content but received: ${contentType}`,
          );
        }
      }

      // ── Read the body with size limiting ──
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const length = parseInt(contentLength, 10);
        if (!isNaN(length) && length > maxBytes) {
          await response.body?.cancel().catch(() => {});
          throw new SafeFetchError(
            'RESPONSE_TOO_LARGE',
            `Response size (${length} bytes) exceeds limit (${maxBytes} bytes).`,
          );
        }
      }

      // Stream the body, respecting the size limit.
      let body = '';
      let bytesRead = 0;
      let truncated = false;

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8', { fatal: false });

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            bytesRead += value.byteLength;
            if (bytesRead > maxBytes) {
              truncated = true;
              // Keep partial data already read; discard the rest.
              const excess = bytesRead - maxBytes;
              const keep = value.byteLength - excess;
              if (keep > 0) {
                body += decoder.decode(value.subarray(0, keep), { stream: false });
              }
              reader.cancel().catch(() => {});
              break;
            }

            body += decoder.decode(value, { stream: true });
          }
        } catch (err) {
          // If the abort controller killed the stream, surface a timeout error.
          if (err instanceof DOMException && err.name === 'AbortError') {
            throw new SafeFetchError('TIMEOUT', 'Request timed out while reading the response body.');
          }
          throw err;
        } finally {
          reader.releaseLock();
        }
      } else {
        // No body stream — use text() as a fallback.
        body = await response.text();
      }

      return {
        finalUrl: currentUrl,
        status: response.status,
        body,
        contentType,
        redirectChain,
        truncated,
      };
    }
  } catch (err) {
    // Re-throw our own error type as-is.
    if (err instanceof SafeFetchError) throw err;

    // Convert abort/timeout errors.
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new SafeFetchError('TIMEOUT', 'Request timed out.');
    }
    if (err instanceof Error && err.name === 'AbortError') {
      throw new SafeFetchError('TIMEOUT', 'Request timed out.');
    }

    // Wrap everything else.
    throw new SafeFetchError('FETCH_ERROR', err instanceof Error ? err.message : String(err));
  } finally {
    clearTimeout(timeoutId);
  }
}
