/**
 * GET /api/admin/audit-leads
 *
 * List leads with pagination, search, filtering, and sorting.
 * Returns paginated results with lead data and audit scores.
 * Includes summary stats.
 *
 * Requires admin session (verified by middleware).
 */

import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/db';
import { auditLeads, audits, auditEvents } from '@/db/schema';
import { eq, desc, asc, like, and, or, gte, lte, count } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin/require-admin';

export const runtime = 'nodejs';

// ──────────────────────────────────────────────────────────────
// Route handler
// ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // ── Admin authentication ──
    const authResult = await requireAdmin();
    if (authResult !== true) return authResult;

    const { searchParams } = request.nextUrl;

    // ── Parse query parameters ──
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '25', 10) || 25));
    const search = searchParams.get('search')?.trim() || undefined;
    const status = searchParams.get('status')?.trim() || undefined;
    const scoreMin = parseInt(searchParams.get('scoreMin') ?? '0', 10) || 0;
    const scoreMax = parseInt(searchParams.get('scoreMax') ?? '100', 10) || 100;
    const sortBy = searchParams.get('sortBy') ?? 'newest';

    // ── Validate status filter ──
    const validStatuses = ['new', 'reviewed', 'contacted', 'replied', 'consultation', 'proposal_sent', 'won', 'lost', 'not_suitable'] as string[];
    const statusFilter = status && validStatuses.includes(status) ? (status as 'new' | 'reviewed' | 'contacted' | 'replied' | 'consultation' | 'proposal_sent' | 'won' | 'lost' | 'not_suitable') : undefined;

    // ── Build where conditions ──
    const conditions = [];

    if (statusFilter) {
      conditions.push(eq(auditLeads.status, statusFilter));
    }

    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          like(auditLeads.first_name, searchPattern),
          like(auditLeads.email, searchPattern),
          like(auditLeads.business_name, searchPattern),
          like(audits.hostname, searchPattern),
        )!,
      );
    }

    if (scoreMin > 0) {
      conditions.push(gte(audits.overall_score, scoreMin));
    }

    if (scoreMax < 100) {
      conditions.push(lte(audits.overall_score, scoreMax));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // ── Determine sort order ──
    const orderByClause = sortBy === 'oldest'
      ? asc(auditLeads.created_at)
      : desc(auditLeads.created_at);

    // ── Query leads with join to audits ──
    const offset = (page - 1) * limit;

    const leads = await db
      .select({
        id: auditLeads.id,
        audit_id: auditLeads.audit_id,
        first_name: auditLeads.first_name,
        email: auditLeads.email,
        business_name: auditLeads.business_name,
        marketing_consent: auditLeads.marketing_consent,
        status: auditLeads.status,
        email_delivery_status: auditLeads.email_delivery_status,
        notes: auditLeads.notes,
        created_at: auditLeads.created_at,
        updated_at: auditLeads.updated_at,
        last_contacted_at: auditLeads.last_contacted_at,
        // Audit data
        hostname: audits.hostname,
        overall_score: audits.overall_score,
        audit_status: audits.status,
        audit_completed_at: audits.completed_at,
      })
      .from(auditLeads)
      .innerJoin(audits, eq(auditLeads.audit_id, audits.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // ── Count total for pagination ──
    const countResult = await db
      .select({ total: count() })
      .from(auditLeads)
      .innerJoin(audits, eq(auditLeads.audit_id, audits.id))
      .where(whereClause);

    const total = countResult[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    // ── Summary stats ──
    const stats = await getSummaryStats();

    // ── Format leads for response ──
    const formattedLeads = leads.map((lead) => ({
      id: lead.id,
      auditId: lead.audit_id,
      firstName: lead.first_name,
      email: lead.email,
      businessName: lead.business_name,
      marketingConsent: lead.marketing_consent,
      status: lead.status,
      emailDeliveryStatus: lead.email_delivery_status,
      notes: lead.notes,
      createdAt: lead.created_at?.toISOString() ?? null,
      updatedAt: lead.updated_at?.toISOString() ?? null,
      lastContactedAt: lead.last_contacted_at?.toISOString() ?? null,
      hostname: lead.hostname,
      overallScore: lead.overall_score,
      auditStatus: lead.audit_status,
      auditCompletedAt: lead.audit_completed_at?.toISOString() ?? null,
    }));

    return NextResponse.json(
      {
        leads: formattedLeads,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
        stats,
      },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'private, no-store',
        },
      },
    );
  } catch (err) {
    console.error('[admin:leads] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong fetching leads.' },
      { status: 500 },
    );
  }
}

// ──────────────────────────────────────────────────────────────
// Summary stats
// ──────────────────────────────────────────────────────────────

async function getSummaryStats() {
  try {
    // Total audits
    const totalAuditsResult = await db
      .select({ total: count() })
      .from(audits);
    const totalAudits = totalAuditsResult[0]?.total ?? 0;

    // Completed audits
    const completedAuditsResult = await db
      .select({ total: count() })
      .from(audits)
      .where(eq(audits.status, 'completed'));
    const completedAudits = completedAuditsResult[0]?.total ?? 0;

    // Emails captured (total leads)
    const emailsCapturedResult = await db
      .select({ total: count() })
      .from(auditLeads);
    const emailsCaptured = emailsCapturedResult[0]?.total ?? 0;

    // Unlock rate (leads / completed audits)
    const unlockRate = completedAudits > 0
      ? Math.round((emailsCaptured / completedAudits) * 100)
      : 0;

    // Consultation CTA clicks
    let consultationClicks = 0;
    try {
      const consultationResult = await db
        .select({ total: count() })
        .from(auditEvents)
        .where(eq(auditEvents.event_type, 'consultation_cta_clicked'));
      consultationClicks = consultationResult[0]?.total ?? 0;
    } catch {
      // audit_events table may not exist yet
    }

    // Clients won (leads with status 'won')
    const clientsWonResult = await db
      .select({ total: count() })
      .from(auditLeads)
      .where(eq(auditLeads.status, 'won'));
    const clientsWon = clientsWonResult[0]?.total ?? 0;

    return {
      totalAudits,
      completedAudits,
      emailsCaptured,
      unlockRate,
      consultationClicks,
      clientsWon,
    };
  } catch (err) {
    console.error('[admin:leads] Stats error:', err instanceof Error ? err.message : String(err));
    return {
      totalAudits: 0,
      completedAudits: 0,
      emailsCaptured: 0,
      unlockRate: 0,
      consultationClicks: 0,
      clientsWon: 0,
    };
  }
}
