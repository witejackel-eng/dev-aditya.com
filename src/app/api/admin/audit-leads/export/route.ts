/**
 * GET /api/admin/audit-leads/export
 *
 * Export leads as CSV with:
 *  - date, first name, email, business, website, score, main issue, status, marketing consent
 *
 * Sanitize values to prevent spreadsheet formula injection
 * (prefix = + - @ with single quote).
 *
 * Requires admin session (verified by middleware).
 */

import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/db';
import { auditLeads, audits } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { AuditFinding, AuditReportData } from '@/lib/audit/types';

// ──────────────────────────────────────────────────────────────
// Route handler
// ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Optional filters
    const status = searchParams.get('status')?.trim() || undefined;
    const validStatuses = ['new', 'reviewed', 'contacted', 'replied', 'consultation', 'proposal_sent', 'won', 'lost', 'not_suitable'] as string[];
    const statusFilter = status && validStatuses.includes(status) ? (status as 'new' | 'reviewed' | 'contacted' | 'replied' | 'consultation' | 'proposal_sent' | 'won' | 'lost' | 'not_suitable') : undefined;

    // ── Build query ──
    const conditions = [];
    if (statusFilter) {
      conditions.push(eq(auditLeads.status, statusFilter));
    }

    const { and } = await import('drizzle-orm');
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const leads = await db
      .select({
        id: auditLeads.id,
        first_name: auditLeads.first_name,
        email: auditLeads.email,
        business_name: auditLeads.business_name,
        status: auditLeads.status,
        marketing_consent: auditLeads.marketing_consent,
        created_at: auditLeads.created_at,
        // Audit data
        audit_id: auditLeads.audit_id,
        hostname: audits.hostname,
        overall_score: audits.overall_score,
        report_data: audits.report_data,
      })
      .from(auditLeads)
      .innerJoin(audits, eq(auditLeads.audit_id, audits.id))
      .where(whereClause)
      .orderBy(desc(auditLeads.created_at))
      .limit(10_000); // Safety cap

    // ── Build CSV ──
    const csvHeaders = [
      'Date',
      'First Name',
      'Email',
      'Business',
      'Website',
      'Score',
      'Main Issue',
      'Status',
      'Marketing Consent',
    ];

    const csvRows = leads.map((lead) => {
      // Extract main issue from report findings
      const reportData = lead.report_data as AuditReportData | null;
      const findings = reportData?.findings ?? [];
      const mainIssue = findings
        .filter((f: AuditFinding) => f.severity === 'critical' || f.severity === 'high')
        .slice(0, 1)
        .map((f: AuditFinding) => f.title)
        .join('; ') || 'N/A';

      const date = lead.created_at
        ? lead.created_at.toISOString().split('T')[0]
        : '';

      return [
        sanitizeCsv(date),
        sanitizeCsv(lead.first_name),
        sanitizeCsv(lead.email),
        sanitizeCsv(lead.business_name ?? ''),
        sanitizeCsv(lead.hostname),
        sanitizeCsv(String(lead.overall_score ?? 'N/A')),
        sanitizeCsv(mainIssue),
        sanitizeCsv(lead.status),
        sanitizeCsv(lead.marketing_consent ? 'Yes' : 'No'),
      ].join(',');
    });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // ── Return CSV ──
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="audit-leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[admin:export] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong exporting leads.' },
      { status: 500 },
    );
  }
}

// ──────────────────────────────────────────────────────────────
// CSV sanitization
// ──────────────────────────────────────────────────────────────

/**
 * Sanitize a CSV value to prevent spreadsheet formula injection.
 *
 * If the value starts with =, +, -, or @, prefix it with a single
 * quote so spreadsheets treat it as text rather than a formula.
 *
 * Also escapes double quotes and wraps values containing commas,
 * double quotes, or newlines in double quotes.
 */
function sanitizeCsv(value: string): string {
  if (!value) return '';

  // Prevent formula injection: prefix dangerous characters with a single quote
  let sanitized = value;
  if (/^[=+\-@\t\r]/.test(sanitized)) {
    sanitized = "'" + sanitized;
  }

  // Escape double quotes by doubling them
  sanitized = sanitized.replace(/"/g, '""');

  // Wrap in quotes if the value contains commas, double quotes, or newlines
  if (sanitized.includes(',') || sanitized.includes('"') || sanitized.includes('\n') || sanitized.includes('\r')) {
    sanitized = `"${sanitized}"`;
  }

  return sanitized;
}
