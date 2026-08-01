/**
 * SSRF-safe URL validation for the Website Revenue Audit Funnel.
 *
 * Every user-supplied URL is normalised, DNS-resolved, and checked
 * against a comprehensive block-list of private / reserved IP ranges
 * before any outbound request is made.  This prevents Server-Side
 * Request Forgery attacks that could probe internal services.
 *
 * IP range checks use `ipaddr.js` exclusively — never string-prefix
 * matching — so attacks like `127.0.0.01` or `0x7f000001` are caught.
 */

import dns from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

// ──────────────────────────────────────────────────────────────
// Blocked hostname suffixes
// ──────────────────────────────────────────────────────────────

const BLOCKED_HOSTNAME_SUFFIXES = [
  'localhost',
  'local',
  'internal',
  'intranet',
  'localdomain',
  'example.com',
  'example.org',
  'example.net',
  'test',
  'invalid',
] as const;

// ──────────────────────────────────────────────────────────────
// IPv4 private / reserved CIDRs (RFC 1918 + others)
// ──────────────────────────────────────────────────────────────

const IPV4_PRIVATE_CIDRS = [
  '127.0.0.0/8',      // loopback
  '10.0.0.0/8',       // RFC 1918
  '172.16.0.0/12',    // RFC 1918
  '192.168.0.0/16',   // RFC 1918
  '169.254.0.0/16',   // link-local
  '0.0.0.0/8',        // "this" network
  '100.64.0.0/10',    // RFC 6598 carrier-grade NAT
  '198.18.0.0/15',    // RFC 2544 benchmarking
  '224.0.0.0/4',      // multicast
  '240.0.0.0/4',      // future use
] as const;

// ──────────────────────────────────────────────────────────────
// IPv6 private / reserved CIDRs
// ──────────────────────────────────────────────────────────────

const IPV6_PRIVATE_CIDRS = [
  '::1/128',      // loopback
  'fc00::/7',     // RFC 4193 unique-local
  'fe80::/10',    // link-local
  'ff00::/8',     // multicast
] as const;

// ──────────────────────────────────────────────────────────────
// Pre-parsed CIDR subnets (avoids repeated parsing at runtime)
// ──────────────────────────────────────────────────────────────

const IPV4_SUBNETS = IPV4_PRIVATE_CIDRS.map((cidr) => ipaddr.parseCIDR(cidr));
const IPV6_SUBNETS = IPV6_PRIVATE_CIDRS.map((cidr) => ipaddr.parseCIDR(cidr));

// ──────────────────────────────────────────────────────────────
// Private / reserved ranges that ipaddr.js recognises via .range()
// ──────────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────────

/**
 * Check whether a single resolved IP address falls into any
 * private / reserved range.  Returns `true` if the address is
 * private/reserved, `false` if it is publicly routable.
 *
 * Uses `ipaddr.js` `addr.match(subnet)` for CIDR checks and
 * `addr.range()` as a catch-all — never string-prefix matching.
 */
function isPrivateIp(ipStr: string): boolean {
  // ── IPv4 ──
  if (ipaddr.IPv4.isValid(ipStr)) {
    const addr = ipaddr.IPv4.parse(ipStr);

    // Check against our explicit CIDR list.
    for (const subnet of IPV4_SUBNETS) {
      try {
        if (addr.match(subnet)) return true;
      } catch {
        // match() throws if the subnet is a different address kind — skip.
      }
    }

    // Fall back to ipaddr.js built-in range classification.
    if (IPV4_BLOCKED_RANGES.has(addr.range())) return true;

    return false;
  }

  // ── IPv6 ──
  if (ipaddr.IPv6.isValid(ipStr)) {
    const addr = ipaddr.IPv6.parse(ipStr);

    // IPv4-mapped IPv6 addresses (::ffff:x.x.x.x) — check the embedded IPv4.
    if (addr.isIPv4MappedAddress()) {
      try {
        const ipv4 = addr.toIPv4Address();
        return isPrivateIp(ipv4.toString());
      } catch {
        return true;
      }
    }

    // Check against our explicit CIDR list.
    for (const subnet of IPV6_SUBNETS) {
      try {
        if (addr.match(subnet)) return true;
      } catch {
        // match() throws if the subnet is a different address kind — skip.
      }
    }

    // Fall back to ipaddr.js built-in range classification.
    if (IPV6_BLOCKED_RANGES.has(addr.range())) return true;

    return false;
  }

  // Not a valid IP — treat as unsafe.
  return true;
}

/** Result of DNS resolution for a hostname. */
type DnsCheckResult =
  | null                    // all resolved IPs are public
  | 'dns-not-found'
  | 'dns-servfail'
  | 'dns-timeout'
  | 'dns-error'
  | 'dns-empty'
  | 'private-ip';          // at least one resolved IP is private/reserved

/**
 * Check all resolved addresses for a hostname.
 * Returns `null` if every address is publicly routable,
 * or a string code describing the problem.
 */
async function checkResolvedAddresses(hostname: string): Promise<DnsCheckResult> {
  try {
    const addresses = await dns.lookup(hostname, { all: true, verbatim: true });

    if (addresses.length === 0) return 'dns-empty';

    for (const entry of addresses) {
      if (isPrivateIp(entry.address)) return 'private-ip';
    }

    return null;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOTFOUND') return 'dns-not-found';
    if (code === 'ESERVFAIL') return 'dns-servfail';
    if (code === 'ETIMEOUT') return 'dns-timeout';
    return 'dns-error';
  }
}

/**
 * Strip URL fragment (#…) and collapse duplicate slashes in the path.
 */
function cleanUrl(url: URL): URL {
  const cleaned = new URL(url.toString());
  // Remove fragment
  cleaned.hash = '';
  // Collapse duplicate slashes in the path
  cleaned.pathname = cleaned.pathname.replace(/\/{2,}/g, '/');
  return cleaned;
}

/**
 * Reject hostnames that look like internal / test domains.
 */
function isBlockedHostname(hostname: string): string | null {
  const lower = hostname.toLowerCase();

  for (const suffix of BLOCKED_HOSTNAME_SUFFIXES) {
    if (lower === suffix || lower.endsWith('.' + suffix)) {
      return suffix;
    }
  }

  return null;
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

export type UrlValidationSuccess = {
  normalizedUrl: string;
  hostname: string;
};

export type UrlValidationError = {
  error: string;
};

export type UrlValidationResult = UrlValidationSuccess | UrlValidationError;

/**
 * Validate and normalise a user-supplied URL for auditing.
 *
 * Steps:
 * 1. Accept domain-only input (prepend `https://`).
 * 2. Parse with the URL constructor; reject non-http(s) protocols.
 * 3. Reject embedded credentials (`user:pass@host`).
 * 4. Handle Unicode / IDN hostnames via the WHATWG URL parser.
 * 5. Reject blocked hostname suffixes (localhost, .local, etc.).
 * 6. Reject direct IP addresses as the hostname.
 * 7. Resolve DNS and check every returned IP against private ranges.
 * 8. Strip fragments and duplicate slashes.
 *
 * Returns `{ normalizedUrl, hostname }` on success or `{ error }` on failure.
 */
export async function validateAuditUrl(
  input: string,
): Promise<UrlValidationResult> {
  if (!input || typeof input !== 'string') {
    return { error: 'Please enter a URL to audit.' };
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { error: 'Please enter a URL to audit.' };
  }

  if (trimmed.length > 2048) {
    return { error: 'The URL is too long. Please enter a valid website address.' };
  }

  // ── Step 1: Prepend https:// if no scheme is present ──
  let urlStr = trimmed;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(urlStr)) {
    urlStr = 'https://' + urlStr;
  }

  // ── Step 2: Parse and validate protocol ──
  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return { error: 'This does not appear to be a valid website address.' };
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return {
      error: 'Only http:// and https:// URLs are supported. Please enter a regular website address.',
    };
  }

  // ── Step 3: Reject embedded credentials ──
  if (url.username || url.password) {
    return {
      error: 'URLs with embedded credentials (user:pass@host) are not allowed.',
    };
  }

  // ── Step 4: Extract and validate hostname ──
  const hostname = url.hostname;

  if (!hostname || hostname.length === 0) {
    return { error: 'Could not determine the website hostname.' };
  }

  // ── Step 5: Reject direct IP addresses as the host ──
  if (ipaddr.IPv4.isValid(hostname) || ipaddr.IPv6.isValid(hostname)) {
    return {
      error: 'Direct IP addresses are not supported. Please enter a domain name (e.g., example.com).',
    };
  }

  // ── Step 6: Check blocked hostname suffixes ──
  const blockedSuffix = isBlockedHostname(hostname);
  if (blockedSuffix) {
    return {
      error: 'This domain appears to be a local or internal address. Please enter a public website URL.',
    };
  }

  // ── Step 7: DNS resolution + private-IP check ──
  // The WHATWG URL parser already handles IDN / Unicode hostnames,
  // converting them to punycode internally. We resolve using the
  // hostname as the URL parser stores it (punycode for IDN).
  const dnsCheck = await checkResolvedAddresses(hostname);
  if (dnsCheck) {
    switch (dnsCheck) {
      case 'dns-not-found':
        return { error: 'This domain does not exist. Please check the spelling and try again.' };
      case 'dns-servfail':
        return { error: 'The domain\'s DNS server could not be reached. Please try again later.' };
      case 'dns-timeout':
        return { error: 'DNS lookup timed out. The website may be temporarily unreachable — please try again.' };
      case 'dns-error':
        return { error: 'We could not resolve this domain. Please check the URL and try again.' };
      case 'dns-empty':
        return { error: 'This domain has no DNS records. Please check the URL and try again.' };
      case 'private-ip':
        return {
          error: 'This domain resolves to a private or reserved IP address. Only public websites can be audited.',
        };
      default:
        return {
          error: 'This domain resolves to a private or reserved IP address. Only public websites can be audited.',
        };
    }
  }

  // ── Step 8: Clean and normalise ──
  const cleaned = cleanUrl(url);

  // Upgrade http to https for normalised URL
  if (cleaned.protocol === 'http:') {
    cleaned.protocol = 'https:';
  }

  // Remove trailing slash from domain-only URLs
  const normalizedPath = cleaned.pathname === '/' ? '' : cleaned.pathname;
  const normalizedUrl = `${cleaned.origin}${normalizedPath}${cleaned.search}`;

  return {
    normalizedUrl,
    hostname: cleaned.hostname,
  };
}
