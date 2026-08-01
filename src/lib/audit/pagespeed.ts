/**
 * Google PageSpeed Insights integration for the Website Revenue Audit Funnel.
 *
 * Calls the PageSpeed Insights v5 API for both mobile and desktop strategies,
 * with retry logic for transient errors (429 / 5xx) and proper timeout handling.
 *
 * IMPORTANT: This module is server-only — it accesses the API key from env.
 */

import 'server-only';

import { env, hasPageSpeedKey } from '@/lib/env';
import type { NormalizedPageSpeed, PageSpeedStrategy } from './types';
import { normalizePageSpeedResponse } from './pagespeed-normalizer';

// ──────────────────────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────────────────────

const PAGESPEED_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const PAGESPEED_CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'] as const;
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 2;
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 5_000;

// ──────────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────────

/**
 * Sleep for a given number of milliseconds with jitter.
 * Jitter randomises the delay between [0.5×, 1.5×] the base.
 */
function sleepWithJitter(baseMs: number): Promise<void> {
  const jitter = 0.5 + Math.random(); // 0.5 – 1.5
  const delay = Math.min(baseMs * jitter, MAX_BACKOFF_MS);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Build the PageSpeed Insights API URL with query parameters.
 */
function buildPageSpeedUrl(url: string, strategy: PageSpeedStrategy): string {
  const params = new URLSearchParams({
    url,
    strategy,
    category: PAGESPEED_CATEGORIES.join(','),
  });

  if (hasPageSpeedKey && env.GOOGLE_PAGESPEED_API_KEY) {
    params.set('key', env.GOOGLE_PAGESPEED_API_KEY);
  }

  return `${PAGESPEED_ENDPOINT}?${params.toString()}`;
}

/**
 * Determine if an HTTP status code is retryable (429 or 5xx).
 */
function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

/**
 * Execute a single PageSpeed API request with timeout.
 * Returns the parsed JSON or throws.
 */
async function fetchPageSpeedRaw(
  url: string,
  strategy: PageSpeedStrategy,
  attempt: number,
): Promise<unknown> {
  const apiUrl = buildPageSpeedUrl(url, strategy);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AdityaWebsiteAudit/1.0 (https://dev-aditya.com)',
      },
      signal: controller.signal,
    });

    // Handle retryable HTTP errors
    if (isRetryableStatus(response.status) && attempt < MAX_ATTEMPTS) {
      await response.body?.cancel().catch(() => {});
      throw new RetryableError(`PageSpeed API returned ${response.status}`);
    }

    // Handle non-retryable HTTP errors
    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch {
        // ignore read errors
      }

      // Check if the response body contains a Lighthouse error
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed?.error?.message) {
          throw new PageSpeedApiError(
            `PageSpeed API error: ${parsed.error.message}`,
            response.status,
          );
        }
      } catch (e) {
        if (e instanceof PageSpeedApiError) throw e;
        // Not JSON or no error field — fall through to generic error
      }

      throw new PageSpeedApiError(
        `PageSpeed API returned HTTP ${response.status}`,
        response.status,
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    // Re-throw our own error types as-is
    if (err instanceof PageSpeedApiError) throw err;
    if (err instanceof RetryableError) throw err;

    // Convert abort/timeout errors
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new PageSpeedApiError('PageSpeed API request timed out', 0);
    }

    // Wrap everything else
    throw new PageSpeedApiError(
      `PageSpeed API request failed: ${err instanceof Error ? err.message : String(err)}`,
      0,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

// ──────────────────────────────────────────────────────────────
// Custom error types
// ──────────────────────────────────────────────────────────────

class RetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetryableError';
  }
}

class PageSpeedApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'PageSpeedApiError';
    this.status = status;
  }
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Run PageSpeed Insights for a single strategy (mobile or desktop).
 *
 * Retries once on 429 / 5xx responses with limited exponential backoff + jitter.
 * Returns `null` on persistent failure — never throws to the caller.
 */
export async function runPageSpeed(
  url: string,
  strategy: PageSpeedStrategy,
): Promise<NormalizedPageSpeed | null> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const rawData = await fetchPageSpeedRaw(url, strategy, attempt);
      const normalized = normalizePageSpeedResponse(rawData, strategy);
      return normalized;
    } catch (err) {
      if (err instanceof RetryableError && attempt < MAX_ATTEMPTS) {
        // Backoff: base × 2^(attempt-1) with jitter, capped
        const backoffBase = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
        await sleepWithJitter(backoffBase);
        continue;
      }

      // Non-retryable or final attempt — log and return null
      if (err instanceof PageSpeedApiError) {
        console.error(
          `[pagespeed] ${strategy} run failed for ${url}: ${err.message} (status: ${err.status})`,
        );
      } else {
        console.error(
          `[pagespeed] ${strategy} run failed for ${url}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }

      return null;
    }
  }

  // Should not reach here, but safety net
  return null;
}

/**
 * Run PageSpeed Insights for both mobile and desktop strategies in parallel.
 *
 * Uses Promise.allSettled so that a failure in one strategy does not
 * prevent the other from completing.
 */
export async function runPageSpeedBothStrategies(
  url: string,
): Promise<{ mobile: NormalizedPageSpeed | null; desktop: NormalizedPageSpeed | null }> {
  const [mobileResult, desktopResult] = await Promise.allSettled([
    runPageSpeed(url, 'mobile'),
    runPageSpeed(url, 'desktop'),
  ]);

  const mobile =
    mobileResult.status === 'fulfilled' ? mobileResult.value : null;
  const desktop =
    desktopResult.status === 'fulfilled' ? desktopResult.value : null;

  if (mobileResult.status === 'rejected') {
    console.error(
      `[pagespeed] Mobile strategy failed: ${mobileResult.reason instanceof Error ? mobileResult.reason.message : String(mobileResult.reason)}`,
    );
  }
  if (desktopResult.status === 'rejected') {
    console.error(
      `[pagespeed] Desktop strategy failed: ${desktopResult.reason instanceof Error ? desktopResult.reason.message : String(desktopResult.reason)}`,
    );
  }

  return { mobile, desktop };
}
