/**
 * POST /api/audits/[auditId]/events
 *
 * Record funnel events for analytics.
 *
 * Supported events:
 *  - public_report_viewed
 *  - unlock_form_viewed
 *  - full_report_viewed
 *  - consultation_cta_clicked
 *  - email_cta_clicked
 *
 * Validates event type against EVENT_TYPES.
 * Does NOT store unnecessary personal info in metadata.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'node:crypto';

import { db } from '@/db';
import { auditEvents, audits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { readBodyWithLimit } from '@/lib/request-security';

// ──────────────────────────────────────────────────────────────
// Allowed client-side event types
// ──────────────────────────────────────────────────────────────

const CLIENT_EVENT_TYPES = [
  'public_report_viewed',
  'unlock_form_viewed',
  'full_report_viewed',
  'consultation_cta_clicked',
  'email_cta_clicked',
] as const;

// ──────────────────────────────────────────────────────────────
// Zod schema
// ──────────────────────────────────────────────────────────────

const eventSchema = z.object({
  eventType: z.string().refine((val) => CLIENT_EVENT_TYPES.includes(val as any), {
    message: 'Invalid event type.',
  }),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
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

    // ── Verify audit exists ──
    const auditRows = await db
      .select({ id: audits.id })
      .from(audits)
      .where(eq(audits.id, auditId))
      .limit(1);

    if (auditRows.length === 0) {
      return NextResponse.json(
        { error: 'Audit not found.' },
        { status: 404 },
      );
    }

    // ── Read and parse body ──
    let bodyText: string;
    try {
      bodyText = await readBodyWithLimit(request, 8 * 1024); // 8 KB
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

    // ── Validate with Zod ──
    const parsed = eventSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message ?? 'Invalid input.' },
        { status: 400 },
      );
    }

    const body = parsed.data;

    // ── Sanitize metadata — strip any PII ──
    const sanitizedMetadata: Record<string, unknown> = {};
    if (body.metadata) {
      // Only keep safe, non-personal keys
      const allowedKeys = ['section', 'source', 'action', 'ctaText', 'position', 'variant'];
      for (const key of allowedKeys) {
        if (key in body.metadata) {
          sanitizedMetadata[key] = String(body.metadata[key]).slice(0, 200);
        }
      }
    }

    // ── Record event ──
    await db.insert(auditEvents).values({
      id: crypto.randomUUID(),
      audit_id: auditId,
      event_type: body.eventType,
      metadata: Object.keys(sanitizedMetadata).length > 0 ? sanitizedMetadata : null,
      created_at: new Date(),
    });

    return NextResponse.json(
      { success: true },
      {
        status: 201,
        headers: {
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  } catch (err) {
    console.error('[audit:events] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong recording the event.' },
      { status: 500 },
    );
  }
}
