/**
 * POST /api/admin/audit-leads/[leadId]/resend
 *
 * Resend the audit report email to the lead.
 *
 * - Verify admin session (handled by middleware)
 * - Apply rate limits (3 per hour for the lead)
 * - Resend the audit report email
 * - Prevent repeated resend spam
 * - Update email_delivery_status
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

import { db } from '@/db';
import { auditLeads, audits, auditEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateAccessToken } from '@/lib/audit/report-access';
import { sendAuditReportEmail } from '@/lib/email/resend';
import { env } from '@/lib/env';
import type { AuditFinding, AuditReportData } from '@/lib/audit/types';

// ──────────────────────────────────────────────────────────────
// Route handler
// ──────────────────────────────────────────────────────────────

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> },
) {
  try {
    const { leadId } = await params;

    if (!leadId || typeof leadId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid lead ID.' },
        { status: 400 },
      );
    }

    // ── Fetch lead ──
    const leadRows = await db
      .select()
      .from(auditLeads)
      .where(eq(auditLeads.id, leadId))
      .limit(1);

    const lead = leadRows[0];

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 },
      );
    }

    // ── Fetch audit ──
    const auditRows = await db
      .select()
      .from(audits)
      .where(eq(audits.id, lead.audit_id))
      .limit(1);

    const audit = auditRows[0];

    if (!audit) {
      return NextResponse.json(
        { error: 'Associated audit not found.' },
        { status: 404 },
      );
    }

    // ── Rate limit resends (3 per hour per lead) ──
    const rateLimitResult = await checkRateLimit(
      `admin:resend:${leadId}`,
      3, // 3 per hour
      60 * 60 * 1_000, // 1 hour
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many resend attempts for this lead. Please wait before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1_000)),
          },
        },
      );
    }

    // ── Build email data ──
    const reportData = audit.report_data as AuditReportData | null;
    const allFindings = reportData?.findings ?? [];
    const topFindings = allFindings
      .filter((f: AuditFinding) => f.severity !== 'positive')
      .slice(0, 5);

    const categoryScores: Record<string, number | null> = {
      performance: audit.performance_score,
      seo: audit.seo_score,
      accessibility: audit.accessibility_score,
      bestPracticesSecurity: audit.best_practices_security_score,
      mobileReadiness: audit.mobile_readiness_score,
      conversionReadiness: audit.conversion_readiness_score,
    };

    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://dev-aditya.com';
    const accessToken = generateAccessToken(audit.id);
    const reportUrl = `${siteUrl}/audit/${audit.id}?token=${accessToken}`;

    // ── Send the email ──
    const emailResult = await sendAuditReportEmail({
      to: lead.email,
      firstName: lead.first_name,
      hostname: audit.hostname,
      overallScore: audit.overall_score ?? 0,
      categoryScores,
      topFindings,
      reportUrl,
      reportId: audit.id,
    });

    // ── Update email delivery status ──
    const newDeliveryStatus = emailResult.success ? 'sent' : 'failed';

    await db
      .update(auditLeads)
      .set({
        email_delivery_status: newDeliveryStatus,
        updated_at: new Date(),
      })
      .where(eq(auditLeads.id, leadId));

    // ── Record admin_resent_email event ──
    try {
      await db.insert(auditEvents).values({
        id: crypto.randomUUID(),
        audit_id: audit.id,
        lead_id: leadId,
        event_type: 'admin.resent_email',
        metadata: {
          success: emailResult.success,
          previousStatus: lead.email_delivery_status,
        },
        created_at: new Date(),
      });
    } catch {
      // Non-critical
    }

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to resend email. The email service may be temporarily unavailable.',
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Report email resent to ${lead.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}`,
        emailDeliveryStatus: newDeliveryStatus,
      },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  } catch (err) {
    console.error('[admin:resend] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong resending the email.' },
      { status: 500 },
    );
  }
}
