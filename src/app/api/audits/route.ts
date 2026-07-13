/**
 * POST /api/audits
 *
 * Create a new website audit session.
 *
 * Steps:
 *  1. Validate same-origin, Zod body validation
 *  2. Check honeypot, verify Turnstile, apply rate limits
 *  3. Normalize and validate URL using validateAuditUrl
 *  4. Check for recent cached result (same hostname, completed within CACHE_DURATION_HOURS)
 *  5. If cached: create new audit with copied data, set cache_hit=true
 *  6. If not cached: create new audit with status 'queued'
 *  7. Save UTM attribution, record audit_created event
 *  8. Return {auditId, reportPath}
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'node:crypto';

import { db } from '@/db';
import { audits, auditEvents } from '@/db/schema';
import { SCANNER_VERSION, CACHE_DURATION_HOURS } from '@/lib/audit/constants';
import { validateAuditUrl } from '@/lib/audit/url-validator';
import { checkRateLimit, hashIpForRateLimit } from '@/lib/rate-limit';
import { env } from '@/lib/env';
import {
  validateSameOrigin,
  verifyTurnstile,
  checkHoneypot,
  readBodyWithLimit,
  getClientIp,
} from '@/lib/request-security';
import { eq, and, desc } from 'drizzle-orm';

export const runtime = 'nodejs';

// ──────────────────────────────────────────────────────────────
// Zod schema
// ──────────────────────────────────────────────────────────────

const createAuditSchema = z.object({
  url: z.string().min(1, 'Please enter a URL to audit.').max(2048),
  /** Honeypot field — must be empty for real users. */
  website_confirm: z.string().max(0).optional(),
  /** Cloudflare Turnstile response token. */
  turnstileToken: z.string().optional(),
  /** UTM parameters. */
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
});

// ──────────────────────────────────────────────────────────────
// Route handler
// ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // ── Step 1: Same-origin validation ──
    if (!validateSameOrigin(request)) {
      return NextResponse.json(
        { error: 'Request origin could not be verified. Please submit from the website.' },
        { status: 403 },
      );
    }

    // ── Read body with size limit ──
    let bodyText: string;
    try {
      bodyText = await readBodyWithLimit(request, 64 * 1024); // 64 KB max
    } catch {
      return NextResponse.json(
        { error: 'Request body is too large.' },
        { status: 413 },
      );
    }

    let rawBody: Record<string, unknown>;
    try {
      rawBody = JSON.parse(bodyText) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body. Please submit a valid JSON payload.' },
        { status: 400 },
      );
    }

    // ── Step 2: Honeypot check ──
    if (checkHoneypot(rawBody)) {
      // Silently accept — bots think they succeeded
      return NextResponse.json({
        auditId: crypto.randomUUID(),
        reportPath: `/audit/${crypto.randomUUID()}`,
      });
    }

    // ── Zod validation ──
    const parsed = createAuditSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message ?? 'Invalid input.' },
        { status: 400 },
      );
    }

    const body = parsed.data;

    // ── Step 2b: Verify Turnstile ──
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    const isDev = process.env.NODE_ENV !== 'production';
    const isTestSiteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === '1x00000000000000000000AA';

    if (!turnstileSecret && !isDev && !isTestSiteKey) {
      // In production without Turnstile secret, return 503
      return NextResponse.json(
        { error: 'Security verification is not available. Please try again later.' },
        { status: 503 },
      );
    }

    if (!body.turnstileToken && !isDev && !isTestSiteKey) {
      // In production, missing token must fail
      return NextResponse.json(
        { error: 'Security verification is required. Please complete the CAPTCHA.' },
        { status: 403 },
      );
    }

    if (body.turnstileToken) {
      // BACKEND decides the expected action, NOT the client
      const turnstileResult = await verifyTurnstile(body.turnstileToken, 'audit_create');
      if (!turnstileResult.success) {
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 403 },
        );
      }
    }

    // ── Step 2c: Rate limit ──
    const clientIp = getClientIp(request);
    const ipHash = hashIpForRateLimit(clientIp);

    const rateLimitResult = await checkRateLimit(
      `audit:create:${ipHash}`,
      5, // 5 per 10 minutes per hashed IP
      10 * 60 * 1_000, // 10 minutes
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many audit requests. Please wait a few minutes before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1_000)),
          },
        },
      );
    }

    // ── Step 3: Validate and normalize URL ──
    const urlValidation = await validateAuditUrl(body.url);
    if ('error' in urlValidation) {
      return NextResponse.json(
        { error: urlValidation.error },
        { status: 400 },
      );
    }

    const { normalizedUrl, hostname } = urlValidation;

    // ── Step 4: Check for recent cached result (full normalized_url + scanner_version) ──
    const cacheCutoff = new Date(Date.now() - CACHE_DURATION_HOURS * 60 * 60 * 1_000);

    let cachedAudit: typeof audits.$inferSelect | null = null;
    try {
      const cachedResults = await db
        .select()
        .from(audits)
        .where(
          and(
            eq(audits.normalized_url, normalizedUrl),
            eq(audits.scanner_version, SCANNER_VERSION),
            eq(audits.status, 'completed'),
          ),
        )
        .orderBy(desc(audits.completed_at))
        .limit(5);

      // Find the most recent one that was completed after the cache cutoff
      for (const result of cachedResults) {
        if (result.completed_at && result.completed_at >= cacheCutoff) {
          cachedAudit = result;
          break;
        }
      }
    } catch (err) {
      console.error('[audit:create] Error checking cache:', err instanceof Error ? err.message : String(err));
      // Continue without cache — don't block audit creation
    }

    // ── Generate audit ID and UTM data ──
    const auditId = crypto.randomUUID();

    const utmData: Record<string, string> | null = (body.utm_source || body.utm_medium || body.utm_campaign || body.utm_term || body.utm_content)
      ? {
          ...(body.utm_source ? { source: body.utm_source } : {}),
          ...(body.utm_medium ? { medium: body.utm_medium } : {}),
          ...(body.utm_campaign ? { campaign: body.utm_campaign } : {}),
          ...(body.utm_term ? { term: body.utm_term } : {}),
          ...(body.utm_content ? { content: body.utm_content } : {}),
        }
      : null;

    // ── Step 5/6: Create audit record ──
    if (cachedAudit) {
      // Cache hit — copy data from the existing completed audit
      await db.insert(audits).values({
        id: auditId,
        input_url: body.url.trim(),
        normalized_url: normalizedUrl,
        hostname,
        status: 'completed',
        scanner_version: cachedAudit.scanner_version ?? SCANNER_VERSION,
        overall_score: cachedAudit.overall_score,
        performance_score: cachedAudit.performance_score,
        seo_score: cachedAudit.seo_score,
        accessibility_score: cachedAudit.accessibility_score,
        best_practices_security_score: cachedAudit.best_practices_security_score,
        mobile_readiness_score: cachedAudit.mobile_readiness_score,
        conversion_readiness_score: cachedAudit.conversion_readiness_score,
        coverage: cachedAudit.coverage,
        report_data: cachedAudit.report_data,
        cache_hit: true,
        ip_hash: ipHash,
        utm_data: utmData,
        created_at: new Date(),
        completed_at: new Date(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1_000), // 90 days
      });
    } else {
      // No cache — create a new queued audit
      await db.insert(audits).values({
        id: auditId,
        input_url: body.url.trim(),
        normalized_url: normalizedUrl,
        hostname,
        status: 'queued',
        scanner_version: SCANNER_VERSION,
        cache_hit: false,
        ip_hash: ipHash,
        utm_data: utmData,
        created_at: new Date(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1_000), // 90 days
      });
    }

    // ── Step 7: Record audit_created event ──
    try {
      await db.insert(auditEvents).values({
        id: crypto.randomUUID(),
        audit_id: auditId,
        event_type: 'audit_created',
        metadata: {
          cacheHit: !!cachedAudit,
          hostname,
          utmData,
        },
        created_at: new Date(),
      });
    } catch (err) {
      // Event recording is non-critical
      console.error('[audit:create] Failed to record event:', err instanceof Error ? err.message : String(err));
    }

    // ── Step 8: Return result ──
    return NextResponse.json(
      {
        auditId,
        reportPath: `/audit/${auditId}`,
      },
      {
        status: 201,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        },
      },
    );
  } catch (err) {
    console.error('[audit:create] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong creating your audit. Please try again.' },
      { status: 500 },
    );
  }
}
