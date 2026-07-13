/**
 * Security header analysis for the Website Revenue Audit Funnel.
 *
 * Inspects HTTP response headers for security-related configurations:
 *   HTTPS, HSTS, CSP, Frame protection, X-Content-Type-Options,
 *   Referrer-Policy, Permissions-Policy
 *
 * Scoring rubric (0-100):
 *   HTTPS 30, HSTS 15, CSP 20, Frame protection 10,
 *   X-Content-Type-Options 10, Referrer-Policy 8, Permissions-Policy 7 = 100
 *
 * Handles:
 *   - CSP frame-ancestors satisfies frame protection without X-Frame-Options
 *   - HSTS not expected on non-HTTPS (not penalized)
 *   - Never says "Your website is secure" or "no vulnerabilities"
 *   - Uses "No obvious issue was found in the public checks performed."
 *   - Explains limitations of header-only inspection
 */

import type { SecurityAnalysisResult, SecurityHeaderResult } from './types';

// ──────────────────────────────────────────────────────────────
// Scoring rubric
// ──────────────────────────────────────────────────────────────

const RUBRIC = {
  https: 30,
  hsts: 15,
  csp: 20,
  frameProtection: 10,
  xContentTypeOptions: 10,
  referrerPolicy: 8,
  permissionsPolicy: 7,
} as const;

// ──────────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────────

/**
 * Check if the URL uses HTTPS.
 */
function checkHttps(url: string): { isHttps: boolean; hasRedirect: boolean } {
  try {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    // We can't easily detect redirect-to-HTTPS from just the final URL,
    // since our safeFetch already follows redirects and upgrades HTTP.
    // If the URL is HTTPS, we assume it's properly served.
    return { isHttps, hasRedirect: false };
  } catch {
    return { isHttps: false, hasRedirect: false };
  }
}

/**
 * Analyze the Strict-Transport-Security header.
 */
function analyzeHSTS(headers: Headers, isHttps: boolean): SecurityHeaderResult {
  const hsts = headers.get('strict-transport-security');

  if (!isHttps) {
    // HSTS is only applicable over HTTPS — not penalized for absence on HTTP
    return {
      name: 'Strict-Transport-Security',
      present: false,
      value: null,
      recommendation: 'Enable HTTPS first, then set the Strict-Transport-Security header to enforce secure connections.',
      severity: 'positive',
    };
  }

  if (!hsts) {
    return {
      name: 'Strict-Transport-Security',
      present: false,
      value: null,
      recommendation: 'Add the Strict-Transport-Security header to tell browsers to only connect via HTTPS. Start with "max-age=31536000" and consider adding "includeSubDomains" and "preload" once confident.',
      severity: 'high',
    };
  }

  const issues: string[] = [];
  const maxAgeMatch = hsts.match(/max-age=(\d+)/);
  if (!maxAgeMatch) {
    issues.push('max-age directive is missing');
  } else {
    const maxAge = parseInt(maxAgeMatch[1], 10);
    if (maxAge < 31536000) {
      issues.push('max-age is less than 1 year (31536000 seconds) — consider increasing it');
    }
  }

  if (!hsts.includes('includeSubDomains')) {
    issues.push('includeSubDomains directive is not set — subdomains are not covered');
  }

  if (!hsts.includes('preload')) {
    issues.push('preload directive is not set — consider adding it for browser-level HSTS lists');
  }

  return {
    name: 'Strict-Transport-Security',
    present: true,
    value: hsts,
    recommendation: issues.length > 0 ? issues.join('. ') + '.' : 'HSTS is properly configured.',
    severity: issues.length > 1 ? 'low' : 'positive',
  };
}

/**
 * Analyze the Content-Security-Policy header.
 */
function analyzeCSP(headers: Headers): SecurityHeaderResult {
  const csp = headers.get('content-security-policy');
  const cspReportOnly = headers.get('content-security-policy-report-only');

  if (csp) {
    // Check for common weaknesses
    const issues: string[] = [];
    if (csp.includes("'unsafe-inline'")) {
      issues.push("'unsafe-inline' allows inline scripts/styles — consider using nonces or hashes instead");
    }
    if (csp.includes("'unsafe-eval'")) {
      issues.push("'unsafe-eval' allows eval() — this weakens XSS protection significantly");
    }
    if (csp.includes('*') && !csp.includes('*.')) {
      issues.push("Wildcard (*) source detected — this significantly reduces CSP's protective value");
    }
    if (!csp.includes('default-src') && !csp.includes("default-src 'none'")) {
      issues.push('Consider adding a default-src directive as a fallback');
    }

    return {
      name: 'Content-Security-Policy',
      present: true,
      value: csp.length > 200 ? csp.substring(0, 200) + '...' : csp,
      recommendation: issues.length > 0 ? issues.join('. ') + '.' : 'CSP is present and provides protection.',
      severity: issues.length >= 2 ? 'medium' : issues.length === 1 ? 'low' : 'positive',
    };
  }

  if (cspReportOnly) {
    return {
      name: 'Content-Security-Policy',
      present: false, // Report-only doesn't enforce
      value: 'Report-Only mode',
      recommendation: 'A Content-Security-Policy-Report-Only header is present but doesn\'t enforce protection. Switch to the enforcing Content-Security-Policy header when ready.',
      severity: 'medium',
    };
  }

  return {
    name: 'Content-Security-Policy',
    present: false,
    value: null,
    recommendation: 'Add a Content-Security-Policy header to prevent cross-site scripting (XSS) and data injection attacks. Start with a restrictive policy like "default-src \'self\'" and relax as needed.',
    severity: 'high',
  };
}

/**
 * Analyze frame protection (X-Frame-Options or CSP frame-ancestors).
 */
function analyzeFrameProtection(headers: Headers): SecurityHeaderResult {
  const xFrameOptions = headers.get('x-frame-options');
  const csp = headers.get('content-security-policy');

  // CSP frame-ancestors satisfies frame protection without X-Frame-Options
  if (csp && csp.includes('frame-ancestors')) {
    return {
      name: 'Frame Protection',
      present: true,
      value: 'CSP frame-ancestors directive',
      recommendation: 'Frame protection is provided via CSP frame-ancestors — this is the modern approach and supersedes X-Frame-Options.',
      severity: 'positive',
    };
  }

  if (xFrameOptions) {
    const value = xFrameOptions.toLowerCase();
    if (value === 'deny' || value === 'sameorigin') {
      return {
        name: 'X-Frame-Options',
        present: true,
        value: xFrameOptions,
        recommendation: 'X-Frame-Options is set. Consider migrating to CSP frame-ancestors for more granular control.',
        severity: 'positive',
      };
    }
    // ALLOW-FROM is deprecated
    return {
      name: 'X-Frame-Options',
      present: true,
      value: xFrameOptions,
      recommendation: 'X-Frame-Options value appears non-standard (ALLOW-FROM is deprecated). Use DENY or SAMEORIGIN, or migrate to CSP frame-ancestors.',
      severity: 'medium',
    };
  }

  return {
    name: 'Frame Protection',
    present: false,
    value: null,
    recommendation: 'Add X-Frame-Options (DENY or SAMEORIGIN) or include a frame-ancestors directive in your Content-Security-Policy to prevent clickjacking attacks.',
    severity: 'medium',
  };
}

/**
 * Analyze X-Content-Type-Options header.
 */
function analyzeXContentTypeOptions(headers: Headers): SecurityHeaderResult {
  const xcto = headers.get('x-content-type-options');

  if (xcto && xcto.toLowerCase() === 'nosniff') {
    return {
      name: 'X-Content-Type-Options',
      present: true,
      value: xcto,
      recommendation: 'X-Content-Type-Options is correctly set to nosniff.',
      severity: 'positive',
    };
  }

  return {
    name: 'X-Content-Type-Options',
    present: false,
    value: xcto,
    recommendation: 'Add the X-Content-Type-Options: nosniff header to prevent browsers from MIME-type sniffing, which can lead to security vulnerabilities.',
    severity: 'medium',
  };
}

/**
 * Analyze Referrer-Policy header.
 */
function analyzeReferrerPolicy(headers: Headers): SecurityHeaderResult {
  const rp = headers.get('referrer-policy');

  if (rp) {
    const value = rp.toLowerCase().trim();
    const strongValues = ['no-referrer', 'strict-origin', 'strict-origin-when-cross-origin'];
    const moderateValues = ['same-origin', 'origin', 'origin-when-cross-origin'];

    if (strongValues.includes(value)) {
      return {
        name: 'Referrer-Policy',
        present: true,
        value: rp,
        recommendation: 'Referrer-Policy is set to a privacy-protecting value.',
        severity: 'positive',
      };
    }

    if (moderateValues.includes(value)) {
      return {
        name: 'Referrer-Policy',
        present: true,
        value: rp,
        recommendation: 'Referrer-Policy is set but consider using a stricter value like "strict-origin-when-cross-origin" for better privacy.',
        severity: 'low',
      };
    }

    if (value === 'unsafe-url' || value === 'no-referrer-when-downgrade') {
      return {
        name: 'Referrer-Policy',
        present: true,
        value: rp,
        recommendation: 'Referrer-Policy is set to a permissive value that may leak full URLs to third parties. Use "strict-origin-when-cross-origin" or "no-referrer" instead.',
        severity: 'medium',
      };
    }

    return {
      name: 'Referrer-Policy',
      present: true,
      value: rp,
      recommendation: 'Referrer-Policy is set to an unrecognized value. Verify it\'s correct.',
      severity: 'low',
    };
  }

  return {
    name: 'Referrer-Policy',
    present: false,
    value: null,
    recommendation: 'Add a Referrer-Policy header to control how much referrer information is shared. "strict-origin-when-cross-origin" is a good default.',
    severity: 'low',
  };
}

/**
 * Analyze Permissions-Policy header.
 */
function analyzePermissionsPolicy(headers: Headers): SecurityHeaderResult {
  const pp = headers.get('permissions-policy') || headers.get('feature-policy');

  if (pp) {
    return {
      name: 'Permissions-Policy',
      present: true,
      value: pp.length > 200 ? pp.substring(0, 200) + '...' : pp,
      recommendation: 'Permissions-Policy is set. Review the allowed features to ensure they match your site\'s needs.',
      severity: 'positive',
    };
  }

  return {
    name: 'Permissions-Policy',
    present: false,
    value: null,
    recommendation: 'Add a Permissions-Policy header to control which browser features and APIs the page can use (e.g., camera, microphone, geolocation). This reduces the attack surface.',
    severity: 'low',
  };
}

/**
 * Check for mixed content in HTML.
 * (This is a basic check — full mixed content detection requires loading all resources.)
 */
function checkMixedContent(html: string | null, isHttps: boolean): string[] {
  const issues: string[] = [];
  if (!isHttps || !html) return issues;

  // Look for http:// resources in src/href/action attributes on an HTTPS page
  const httpResourcePatterns = [
    /<(?:img|script|link|iframe|video|audio|source|embed|object)\s[^>]*(?:src|href)=["']http:\/\//gi,
    /<form\s[^>]*action=["']http:\/\//gi,
  ];

  for (const pattern of httpResourcePatterns) {
    const matches = html.match(pattern);
    if (matches && matches.length > 0) {
      issues.push(`Found ${matches.length} resource(s) loaded over HTTP on an HTTPS page (mixed content)`);
      break; // One message is enough
    }
  }

  return issues;
}

/**
 * Check for Server header disclosure (informational only).
 */
function checkServerDisclosure(headers: Headers): string | null {
  const server = headers.get('server');
  if (!server) return null;

  // Only flag if it reveals specific version information
  const versionPatterns = [
    /\d+\.\d+/, // Version numbers like 2.4.41
    /Apache\/\d/,
    /nginx\/\d/,
    /IIS\/\d/,
    /PHP\/\d/,
    /Express/,
    /Express\.js/,
  ];

  for (const pattern of versionPatterns) {
    if (pattern.test(server)) {
      return `Server header reveals version information: "${server}" — consider removing version details to reduce information disclosure`;
    }
  }

  return null;
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Analyze security headers and produce a structured result.
 *
 * @param headers - HTTP response headers from the page fetch
 * @param url - The final URL of the page
 * @param html - Optional HTML content for mixed content checks
 */
export function analyzeSecurityHeaders(
  headers: Headers,
  url: string,
  html?: string | null,
): SecurityAnalysisResult {
  const { isHttps, hasRedirect: hasRedirectToHttps } = checkHttps(url);

  // ── Individual header analyses ──
  const hstsResult = analyzeHSTS(headers, isHttps);
  const cspResult = analyzeCSP(headers);
  const frameResult = analyzeFrameProtection(headers);
  const xctoResult = analyzeXContentTypeOptions(headers);
  const rpResult = analyzeReferrerPolicy(headers);
  const ppResult = analyzePermissionsPolicy(headers);

  const securityHeaders: SecurityHeaderResult[] = [
    hstsResult,
    cspResult,
    frameResult,
    xctoResult,
    rpResult,
    ppResult,
  ];

  // Add informational Server header note
  const serverNote = checkServerDisclosure(headers);
  if (serverNote) {
    securityHeaders.push({
      name: 'Server',
      present: true,
      value: headers.get('server'),
      recommendation: serverNote,
      severity: 'positive',
    });
  }

  // ── Mixed content check ──
  const mixedContentIssues = checkMixedContent(html ?? null, isHttps);

  // ── Cookie flags (from Set-Cookie headers — limited visibility) ──
  // Note: We can only see cookies set on this specific request, not all cookies.
  // In practice, fetch() doesn't expose Set-Cookie headers due to browser restrictions,
  // but in Node.js server-side fetch, some implementations may expose them.
  const setCookieHeaders: string[] = [];
  // Try to extract Set-Cookie headers
  try {
    const allHeaders = headers.getSetCookie?.() ?? [];
    setCookieHeaders.push(...allHeaders);
  } catch {
    // getSetCookie may not be available
  }

  let secureCookies = 0;
  let httpOnlyCookies = 0;
  let sameSiteCookies = 0;
  const cookieIssues: string[] = [];

  for (const cookie of setCookieHeaders) {
    const lower = cookie.toLowerCase();
    if (lower.includes('secure')) secureCookies++;
    if (lower.includes('httponly')) httpOnlyCookies++;
    if (lower.includes('samesite')) sameSiteCookies++;
    if (isHttps && !lower.includes('secure')) {
      cookieIssues.push('Cookie set without Secure flag on HTTPS page');
    }
    if (!lower.includes('httponly') && !lower.includes('samesite')) {
      cookieIssues.push('Cookie missing HttpOnly and SameSite flags');
    }
  }

  const cookieFlags = {
    totalCookies: setCookieHeaders.length,
    secureCookies,
    httpOnlyCookies,
    sameSiteCookies,
    issues: cookieIssues.slice(0, 5), // Cap at 5 issues
  };

  // ── Score calculation ──
  let score = 0;

  if (isHttps) score += RUBRIC.https;
  if (hstsResult.present) score += RUBRIC.hsts;
  if (cspResult.present) score += RUBRIC.csp;
  if (frameResult.present) score += RUBRIC.frameProtection;
  if (xctoResult.present) score += RUBRIC.xContentTypeOptions;
  if (rpResult.present) score += RUBRIC.referrerPolicy;
  if (ppResult.present) score += RUBRIC.permissionsPolicy;

  // ── Overall assessment ──
  let overallAssessment: string;
  if (!isHttps) {
    overallAssessment =
      'The site is not served over HTTPS. This is a fundamental security requirement that affects data privacy, search rankings, and user trust. All other security header checks are secondary to enabling HTTPS first.';
  } else if (score >= 90) {
    overallAssessment =
      'No obvious issue was found in the public checks performed. The site uses HTTPS and the key security headers are in place. Note: this only checks publicly visible response headers — it does not constitute a full security audit.';
  } else if (score >= 60) {
    overallAssessment =
      'The site uses HTTPS but some security headers are missing or misconfigured. These headers are defense-in-depth measures that protect against common web vulnerabilities. This check only inspects publicly visible response headers and does not cover server configuration, authentication, or application logic.';
  } else {
    overallAssessment =
      'Several important security headers are missing. While HTTPS is the most critical protection, headers like Content-Security-Policy and Strict-Transport-Security provide essential defense-in-depth. This check only inspects publicly visible response headers — it does not constitute a comprehensive security assessment.';
  }

  return {
    isHttps,
    hasRedirectToHttps,
    securityHeaders,
    mixedContentIssues,
    cookieFlags,
    certificateInfo: null, // Certificate details require server-side TLS inspection not available via HTTP headers
    overallAssessment,
  };
}

/**
 * Calculate the security score (0-100) from a SecurityAnalysisResult.
 * Exported for use by the scoring module.
 */
export function calculateSecurityScore(result: SecurityAnalysisResult): number {
  let score = 0;

  if (result.isHttps) score += RUBRIC.https;
  // HSTS: only count if HTTPS (already handled in the analysis)
  const hstsHeader = result.securityHeaders.find(
    (h) => h.name === 'Strict-Transport-Security',
  );
  if (hstsHeader?.present && result.isHttps) score += RUBRIC.hsts;

  const cspHeader = result.securityHeaders.find(
    (h) => h.name === 'Content-Security-Policy',
  );
  if (cspHeader?.present) score += RUBRIC.csp;

  const frameHeader = result.securityHeaders.find(
    (h) => h.name === 'Frame Protection' || h.name === 'X-Frame-Options',
  );
  if (frameHeader?.present) score += RUBRIC.frameProtection;

  const xctoHeader = result.securityHeaders.find(
    (h) => h.name === 'X-Content-Type-Options',
  );
  if (xctoHeader?.present) score += RUBRIC.xContentTypeOptions;

  const rpHeader = result.securityHeaders.find(
    (h) => h.name === 'Referrer-Policy',
  );
  if (rpHeader?.present) score += RUBRIC.referrerPolicy;

  const ppHeader = result.securityHeaders.find(
    (h) => h.name === 'Permissions-Policy',
  );
  if (ppHeader?.present) score += RUBRIC.permissionsPolicy;

  return Math.min(100, Math.max(0, score));
}
