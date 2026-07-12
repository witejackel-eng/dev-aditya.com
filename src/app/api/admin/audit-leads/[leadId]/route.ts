/**
 * GET + PATCH /api/admin/audit-leads/[leadId]
 *
 * GET: return lead detail with audit data, timeline events, notes.
 * PATCH: update status, add notes. Validate allowed status transitions.
 *        Record admin_status_changed event. Sanitize input.
 *
 * Requires admin session (verified by middleware).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'node:crypto';

import { db } from '@/db';
import { auditLeads, audits, auditEvents } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// ──────────────────────────────────────────────────────────────
// Allowed status transitions
// ──────────────────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<string, string[]> = {
  new: ['reviewed', 'not_suitable'],
  reviewed: ['contacted', 'not_suitable'],
  contacted: ['replied', 'not_suitable'],
  replied: ['consultation', 'not_suitable'],
  consultation: ['proposal_sent', 'not_suitable'],
  proposal_sent: ['won', 'lost', 'not_suitable'],
  won: [],
  lost: ['replied', 'consultation', 'proposal_sent'],
  not_suitable: ['new', 'reviewed'],
};

// ──────────────────────────────────────────────────────────────
// PATCH Zod schema
// ──────────────────────────────────────────────────────────────

const patchSchema = z.object({
  status: z.enum([
    'new', 'reviewed', 'contacted', 'replied',
    'consultation', 'proposal_sent', 'won', 'lost', 'not_suitable',
  ]).optional(),
  notes: z.string().max(5000).optional(),
});

// ──────────────────────────────────────────────────────────────
// GET handler
// ──────────────────────────────────────────────────────────────

export async function GET(
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

    // ── Fetch associated audit ──
    const auditRows = await db
      .select()
      .from(audits)
      .where(eq(audits.id, lead.audit_id))
      .limit(1);

    const audit = auditRows[0] ?? null;

    // ── Fetch timeline events ──
    const events = await db
      .select({
        id: auditEvents.id,
        event_type: auditEvents.event_type,
        metadata: auditEvents.metadata,
        created_at: auditEvents.created_at,
      })
      .from(auditEvents)
      .where(eq(auditEvents.audit_id, lead.audit_id))
      .orderBy(desc(auditEvents.created_at))
      .limit(100);

    // ── Format response ──
    const formattedLead = {
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
    };

    const formattedAudit = audit ? {
      id: audit.id,
      hostname: audit.hostname,
      normalizedUrl: audit.normalized_url,
      status: audit.status,
      overallScore: audit.overall_score,
      performanceScore: audit.performance_score,
      seoScore: audit.seo_score,
      accessibilityScore: audit.accessibility_score,
      bestPracticesSecurityScore: audit.best_practices_security_score,
      mobileReadinessScore: audit.mobile_readiness_score,
      conversionReadinessScore: audit.conversion_readiness_score,
      reportData: audit.report_data,
      cacheHit: audit.cache_hit,
      createdAt: audit.created_at?.toISOString() ?? null,
      completedAt: audit.completed_at?.toISOString() ?? null,
    } : null;

    const formattedEvents = events.map((event) => ({
      id: event.id,
      eventType: event.event_type,
      metadata: event.metadata,
      createdAt: event.created_at?.toISOString() ?? null,
    }));

    return NextResponse.json(
      {
        lead: formattedLead,
        audit: formattedAudit,
        events: formattedEvents,
      },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'private, no-store',
        },
      },
    );
  } catch (err) {
    console.error('[admin:lead] GET unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong fetching the lead.' },
      { status: 500 },
    );
  }
}

// ──────────────────────────────────────────────────────────────
// PATCH handler
// ──────────────────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
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

    // ── Parse body ──
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 },
      );
    }

    // ── Validate with Zod ──
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message ?? 'Invalid input.' },
        { status: 400 },
      );
    }

    const { status: newStatus, notes: newNotes } = parsed.data;

    if (!newStatus && newNotes === undefined) {
      return NextResponse.json(
        { error: 'At least one field must be provided (status or notes).' },
        { status: 400 },
      );
    }

    // ── Fetch current lead ──
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

    // ── Validate status transition ──
    if (newStatus && newStatus !== lead.status) {
      const allowedTransitions = VALID_TRANSITIONS[lead.status] ?? [];
      if (!allowedTransitions.includes(newStatus)) {
        return NextResponse.json(
          {
            error: `Cannot transition from "${lead.status}" to "${newStatus}". Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`,
          },
          { status: 400 },
        );
      }
    }

    // ── Sanitize notes ──
    const sanitizedNotes = newNotes !== undefined
      ? sanitizeNotes(newNotes)
      : lead.notes;

    // ── Update lead ──
    const updateData: Record<string, unknown> = {
      updated_at: new Date(),
    };

    if (newStatus && newStatus !== lead.status) {
      updateData.status = newStatus;
      // Set last_contacted_at when moving to an active contact stage
      if (['contacted', 'replied', 'consultation', 'proposal_sent'].includes(newStatus)) {
        updateData.last_contacted_at = new Date();
      }
    }

    if (newNotes !== undefined) {
      updateData.notes = sanitizedNotes;
    }

    await db
      .update(auditLeads)
      .set(updateData)
      .where(eq(auditLeads.id, leadId));

    // ── Record admin events ──
    if (newStatus && newStatus !== lead.status) {
      try {
        await db.insert(auditEvents).values({
          id: crypto.randomUUID(),
          audit_id: lead.audit_id,
          lead_id: leadId,
          event_type: 'admin.updated_status',
          metadata: {
            from: lead.status,
            to: newStatus,
          },
          created_at: new Date(),
        });
      } catch {
        // Non-critical
      }
    }

    if (newNotes !== undefined && newNotes !== lead.notes) {
      try {
        await db.insert(auditEvents).values({
          id: crypto.randomUUID(),
          audit_id: lead.audit_id,
          lead_id: leadId,
          event_type: 'admin.updated_notes',
          metadata: { noteLength: sanitizedNotes?.length ?? 0 },
          created_at: new Date(),
        });
      } catch {
        // Non-critical
      }
    }

    // ── Return updated lead ──
    const updatedLeadRows = await db
      .select()
      .from(auditLeads)
      .where(eq(auditLeads.id, leadId))
      .limit(1);

    const updatedLead = updatedLeadRows[0];

    return NextResponse.json(
      {
        lead: {
          id: updatedLead?.id,
          auditId: updatedLead?.audit_id,
          firstName: updatedLead?.first_name,
          email: updatedLead?.email,
          businessName: updatedLead?.business_name,
          marketingConsent: updatedLead?.marketing_consent,
          status: updatedLead?.status,
          emailDeliveryStatus: updatedLead?.email_delivery_status,
          notes: updatedLead?.notes,
          createdAt: updatedLead?.created_at?.toISOString() ?? null,
          updatedAt: updatedLead?.updated_at?.toISOString() ?? null,
          lastContactedAt: updatedLead?.last_contacted_at?.toISOString() ?? null,
        },
      },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  } catch (err) {
    console.error('[admin:lead] PATCH unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong updating the lead.' },
      { status: 500 },
    );
  }
}

// ──────────────────────────────────────────────────────────────
// Sanitize notes — strip HTML tags and limit length
// ──────────────────────────────────────────────────────────────

function sanitizeNotes(notes: string): string {
  // Strip HTML tags
  const stripped = notes
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-zA-Z0-9]+;/g, ' ')
    .trim();

  // Limit to 5000 characters
  return stripped.slice(0, 5000);
}
