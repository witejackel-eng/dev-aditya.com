/**
 * POST /api/audits/[auditId]/unlock
 *
 * Unlock the full audit report by providing contact information.
 *
 * Steps:
 *  1. Validate body with Zod (firstName, email, businessName optional, marketingConsent, honeypot, turnstile token)
 *  2. Check honeypot, verify Turnstile, apply rate limits (10 per hour per hashed IP)
 *  3. Validate email format
 *  4. Create or update lead in audit_leads table (unique on audit_id + email)
 *  5. Set report access cookie
 *  6. Generate signed access token for email link
 *  7. Send report email to lead (non-blocking)
 *  8. Send lead notification to admin (non-blocking)
 *  9. If email fails: mark email_delivery_status as 'failed', DON'T relock report, DON'T discard lead
 * 10. Record lead_unlocked event
 * 11. Return success with access token
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'node:crypto';

import { db } from '@/db';
import { audits, auditLeads, auditEvents } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { setReportAccessCookie, generateAccessToken } from '@/lib/audit/report-access';
import { checkRateLimit, hashIpForRateLimit } from '@/lib/rate-limit';
import {
  validateSameOrigin,
  verifyTurnstile,
  checkHoneypot,
  readBodyWithLimit,
  getClientIp,
} from '@/lib/request-security';
import { sendAuditReportEmail, sendNewLeadEmail } from '@/lib/email/resend';
import { env } from '@/lib/env';
import type { AuditFinding, AuditReportData } from '@/lib/audit/types';

export const runtime = 'nodejs';

// ──────────────────────────────────────────────────────────────
// Zod schema
// ──────────────────────────────────────────────────────────────

const unlockSchema = z.object({
  firstName: z.string().min(1, 'First name is required.').max(100),
  email: z.string().email('Please provide a valid email address.').max(254),
  businessName: z.string().max(200).optional(),
  marketingConsent: z.boolean().default(false),
  /** Honeypot — must be empty. */
  website_confirm: z.string().max(0).optional(),
  /** Turnstile token. */
  turnstileToken: z.string().optional(),
});

// ──────────────────────────────────────────────────────────────
// Route handler
// ──────────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ auditId: string }> },
) {
  try {
    const { auditId } = await params;

    if (!auditId || typeof auditId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid audit ID.' },
        { status: 400 },
      );
    }

    // ── Same-origin validation ──
    if (!validateSameOrigin(request)) {
      return NextResponse.json(
        { error: 'Request origin could not be verified.' },
        { status: 403 },
      );
    }

    // ── Read body with size limit ──
    let bodyText: string;
    try {
      bodyText = await readBodyWithLimit(request, 32 * 1024); // 32 KB
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
        { error: 'Invalid request body.' },
        { status: 400 },
      );
    }

    // ── Honeypot check ──
    if (checkHoneypot(rawBody)) {
      // Silently accept — bots think they succeeded
      return NextResponse.json({ success: true, accessToken: '' });
    }

    // ── Zod validation ──
    const parsed = unlockSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message ?? 'Invalid input.' },
        { status: 400 },
      );
    }

    const body = parsed.data;

    // ── Verify Turnstile ──
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    const isDev = process.env.NODE_ENV !== 'production';
    const isTestSiteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === '1x00000000000000000000AA';

    if (!turnstileSecret && !isDev && !isTestSiteKey) {
      return NextResponse.json(
        { error: 'Security verification is not available. Please try again later.' },
        { status: 503 },
      );
    }

    if (!body.turnstileToken && !isDev && !isTestSiteKey) {
      return NextResponse.json(
        { error: 'Security verification is required. Please complete the CAPTCHA.' },
        { status: 403 },
      );
    }

    if (body.turnstileToken) {
      // BACKEND decides the expected action, NOT the client
      const turnstileResult = await verifyTurnstile(body.turnstileToken, 'audit_unlock');
      if (!turnstileResult.success) {
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 403 },
        );
      }
    }

    // ── Rate limit ──
    const clientIp = getClientIp(request);
    const ipHash = hashIpForRateLimit(clientIp);

    const rateLimitResult = await checkRateLimit(
      `audit:unlock:${ipHash}`,
      10, // 10 per hour
      60 * 60 * 1_000, // 1 hour
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many unlock attempts. Please wait before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1_000)),
          },
        },
      );
    }

    // ── Fetch audit ──
    const auditRows = await db
      .select()
      .from(audits)
      .where(eq(audits.id, auditId))
      .limit(1);

    const audit = auditRows[0];

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found.' },
        { status: 404 },
      );
    }

    if (audit.status !== 'completed' && audit.status !== 'partial') {
      return NextResponse.json(
        { error: 'This audit is not yet complete. Please wait for it to finish.' },
        { status: 400 },
      );
    }

    // ── Create or update lead ──
    const leadId = crypto.randomUUID();
    const normalizedEmail = body.email.toLowerCase().trim();

    // Check if lead already exists for this audit + email
    const existingLeads = await db
      .select()
      .from(auditLeads)
      .where(
        and(
          eq(auditLeads.audit_id, auditId),
          eq(auditLeads.email, normalizedEmail),
        ),
      )
      .limit(1);

    let currentLeadId: string;

    if (existingLeads.length > 0) {
      // Update existing lead
      currentLeadId = existingLeads[0].id;
      await db
        .update(auditLeads)
        .set({
          first_name: body.firstName.trim(),
          business_name: body.businessName?.trim() ?? existingLeads[0].business_name,
          marketing_consent: body.marketingConsent,
          updated_at: new Date(),
        })
        .where(eq(auditLeads.id, currentLeadId));
    } else {
      // Create new lead
      await db.insert(auditLeads).values({
        id: leadId,
        audit_id: auditId,
        first_name: body.firstName.trim(),
        email: normalizedEmail,
        business_name: body.businessName?.trim() ?? null,
        marketing_consent: body.marketingConsent,
        status: 'new',
        email_delivery_status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      });
      currentLeadId = leadId;
    }

    // ── Set report access cookie ──
    const accessCookie = setReportAccessCookie(auditId);

    // ── Generate signed access token for email link ──
    const accessToken = generateAccessToken(auditId);

    // ── Build email data from report ──
    const reportData = audit.report_data as AuditReportData | null;
    const allFindings = reportData?.findings ?? [];
    const topFindings = allFindings
      .filter((f: AuditFinding) => f.severity !== 'positive')
      .slice(0, 5);

    const mainProblems = allFindings
      .filter((f: AuditFinding) => f.severity === 'high' || f.severity === 'critical')
      .slice(0, 3)
      .map((f: AuditFinding) => f.title);

    const categoryScores: Record<string, number | null> = {
      performance: audit.performance_score,
      seo: audit.seo_score,
      accessibility: audit.accessibility_score,
      bestPracticesSecurity: audit.best_practices_security_score,
      mobileReadiness: audit.mobile_readiness_score,
      conversionReadiness: audit.conversion_readiness_score,
    };

    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://dev-aditya.com';
    const reportUrl = `${siteUrl}/audit/${auditId}?token=${accessToken}`;

    // ── Send audit report email (non-blocking) ──
    const emailPromise = sendAuditReportEmail({
      to: normalizedEmail,
      firstName: body.firstName.trim(),
      hostname: audit.hostname,
      overallScore: audit.overall_score ?? 0,
      categoryScores,
      topFindings,
      reportUrl,
      reportId: auditId,
    }).catch((err) => ({
      success: false as const,
      error: err instanceof Error ? err.message : String(err),
    }));

    // ── Send lead notification to admin (non-blocking) ──
    const leadUrl = `${siteUrl}/admin/audit-leads/${currentLeadId}`;

    // Determine suggested angle from the most severe finding category
    const suggestedAngle = determineSuggestedAngle(allFindings, audit.overall_score);

    const adminEmailPromise = sendNewLeadEmail({
      firstName: body.firstName.trim(),
      email: normalizedEmail,
      businessName: body.businessName?.trim(),
      hostname: audit.hostname,
      overallScore: audit.overall_score ?? 0,
      mainProblems,
      coverage: audit.coverage ?? 0,
      reportUrl,
      leadUrl,
      suggestedAngle,
      marketingConsent: body.marketingConsent,
    }).catch((err) => ({
      success: false as const,
      error: err instanceof Error ? err.message : String(err),
    }));

    // Wait for both emails (but don't let failure block the response)
    const [reportEmailResult] = await Promise.all([
      emailPromise,
      adminEmailPromise,
    ]);

    // ── Update email delivery status ──
    if (!reportEmailResult.success) {
      try {
        await db
          .update(auditLeads)
          .set({
            email_delivery_status: 'failed',
            updated_at: new Date(),
          })
          .where(eq(auditLeads.id, currentLeadId));
      } catch {
        // Non-critical — report stays unlocked regardless
      }

      // Record email_failed event
      try {
        await db.insert(auditEvents).values({
          id: crypto.randomUUID(),
          audit_id: auditId,
          lead_id: currentLeadId,
          event_type: 'report_email_failed',
          metadata: { reason: 'send_failure' },
          created_at: new Date(),
        });
      } catch {
        // Non-critical
      }
    } else {
      try {
        await db
          .update(auditLeads)
          .set({
            email_delivery_status: 'sent',
            updated_at: new Date(),
          })
          .where(eq(auditLeads.id, currentLeadId));
      } catch {
        // Non-critical
      }

      // Record email_sent event
      try {
        await db.insert(auditEvents).values({
          id: crypto.randomUUID(),
          audit_id: auditId,
          lead_id: currentLeadId,
          event_type: 'report_email_sent',
          metadata: { emailDomain: normalizedEmail.split('@')[1] },
          created_at: new Date(),
        });
      } catch {
        // Non-critical
      }
    }

    // ── Record lead_unlocked event ──
    try {
      await db.insert(auditEvents).values({
        id: crypto.randomUUID(),
        audit_id: auditId,
        lead_id: currentLeadId,
        event_type: 'lead_unlocked',
        metadata: {
          marketingConsent: body.marketingConsent,
          hasBusinessName: !!body.businessName,
        },
        created_at: new Date(),
      });
    } catch {
      // Non-critical
    }

    // ── Return success — do NOT return the signed access token ──
    const response = NextResponse.json(
      {
        success: true,
        emailSent: reportEmailResult.success,
        ...(reportEmailResult.success
          ? {}
          : { emailMessage: 'Email delivery could not be confirmed, but you can access the complete report here.' }),
      },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );

    // Set the report access cookie on the response
    response.cookies.set(
      accessCookie.name,
      accessCookie.value,
      accessCookie.options as {
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'lax' | 'strict' | 'none';
        path: string;
        maxAge: number;
      },
    );

    return response;
  } catch (err) {
    console.error('[audit:unlock] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong unlocking the report. Please try again.' },
      { status: 500 },
    );
  }
}

// ──────────────────────────────────────────────────────────────
// Suggested angle for admin
// ──────────────────────────────────────────────────────────────

function determineSuggestedAngle(
  findings: AuditFinding[],
  overallScore: number | null,
): string {
  if (overallScore != null && overallScore < 40) {
    return 'Full rebuild likely needed — multiple critical issues found.';
  }

  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const highCount = findings.filter((f) => f.severity === 'high').length;

  if (criticalCount >= 3) {
    return 'Multiple critical issues — focused sprint could deliver major improvement.';
  }

  if (highCount >= 3) {
    return 'Several high-impact fixes possible — good candidate for optimization package.';
  }

  if (findings.some((f) => f.category === 'conversion' && f.severity !== 'positive')) {
    return 'Conversion issues detected — CTA and trust signal improvements could boost leads.';
  }

  return 'Standard optimization opportunity — quick wins available.';
}
