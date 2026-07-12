/**
 * Resend email client for the Website Revenue Audit Funnel.
 *
 * Sends two types of transactional email:
 *  1. Audit report email — delivered to the lead after they unlock
 *     their full website audit.
 *  2. New lead notification — internal alert sent to the site
 *     owner when a new lead completes the audit funnel.
 *
 * Uses the Resend Node.js SDK (server-side only).
 * Failures are caught and returned as `{ success: false, error }`
 * so callers can handle them gracefully without crashing.
 *
 * **Security**: Never log full email bodies containing personal
 * information in production.
 */

import { Resend } from 'resend';

import { env } from '@/lib/env';
import { hasResendKey } from '@/lib/env';
import type { AuditFinding } from '@/lib/audit/types';

import { AuditReportEmail, AUDIT_REPORT_EMAIL_SUBJECT } from '@/emails/AuditReportEmail';
import { NewAuditLeadEmail, NEW_LEAD_EMAIL_SUBJECT } from '@/emails/NewAuditLeadEmail';

// ──────────────────────────────────────────────────────────────
// Resend client singleton
// ──────────────────────────────────────────────────────────────

function createResendClient(): Resend | null {
  if (!hasResendKey || !env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[email] RESEND_API_KEY is not set — emails will not be sent.',
      );
    }
    return null;
  }
  return new Resend(env.RESEND_API_KEY);
}

const resendClient = createResendClient();

// ──────────────────────────────────────────────────────────────
// Public API — Audit report email
// ──────────────────────────────────────────────────────────────

export interface SendAuditReportEmailParams {
  to: string;
  firstName: string;
  hostname: string;
  overallScore: number;
  categoryScores: Record<string, number | null>;
  topFindings: AuditFinding[];
  reportUrl: string;
  reportId: string;
}

/**
 * Send the full audit report email to a lead.
 *
 * @returns `{ success: true }` or `{ success: false, error }`.
 */
export async function sendAuditReportEmail(
  params: SendAuditReportEmailParams,
): Promise<{ success: boolean; error?: string }> {
  if (!resendClient) {
    console.warn(
      '[email] Skipping audit report email — RESEND_API_KEY is not configured.',
    );
    return { success: false, error: 'Email service is not configured.' };
  }

  try {
    const {
      to,
      firstName,
      hostname,
      overallScore,
      categoryScores,
      topFindings,
      reportUrl,
      reportId,
    } = params;

    const subject = AUDIT_REPORT_EMAIL_SUBJECT(hostname, overallScore);

    const { data, error } = await resendClient.emails.send({
      from: env.AUDIT_FROM_EMAIL,
      to,
      subject,
      react: AuditReportEmail({
        firstName,
        hostname,
        overallScore,
        categoryScores,
        topFindings,
        reportUrl,
        reportId,
      }),
    });

    if (error) {
      console.error(
        `[email] Resend returned an error sending audit report to ${hostname}:`,
        error.message,
      );
      return { success: false, error: error.message };
    }

    // Log a redacted summary — never the full body or personal data.
    console.info(
      `[email] Audit report sent: id=${data?.id}, to=***@${to.split('@')[1]}, hostname=${hostname}, score=${overallScore}`,
    );

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] Unexpected error sending audit report email:', message);
    return { success: false, error: message };
  }
}

// ──────────────────────────────────────────────────────────────
// Public API — New lead notification email
// ──────────────────────────────────────────────────────────────

export interface SendNewLeadEmailParams {
  firstName: string;
  email: string;
  businessName?: string;
  hostname: string;
  overallScore: number;
  mainProblems: string[];
  coverage: number;
  reportUrl: string;
  leadUrl: string;
  suggestedAngle: string;
  marketingConsent: boolean;
}

/**
 * Send a new-lead notification to the site owner.
 *
 * @returns `{ success: true }` or `{ success: false, error }`.
 */
export async function sendNewLeadEmail(
  params: SendNewLeadEmailParams,
): Promise<{ success: boolean; error?: string }> {
  if (!resendClient) {
    console.warn(
      '[email] Skipping lead notification email — RESEND_API_KEY is not configured.',
    );
    return { success: false, error: 'Email service is not configured.' };
  }

  try {
    const {
      firstName,
      email,
      businessName,
      hostname,
      overallScore,
      mainProblems,
      coverage,
      reportUrl,
      leadUrl,
      suggestedAngle,
      marketingConsent,
    } = params;

    const subject = NEW_LEAD_EMAIL_SUBJECT(hostname, overallScore);

    const { data, error } = await resendClient.emails.send({
      from: env.AUDIT_FROM_EMAIL,
      to: env.AUDIT_NOTIFICATION_EMAIL,
      subject,
      replyTo: email,
      react: NewAuditLeadEmail({
        firstName,
        email,
        businessName,
        hostname,
        overallScore,
        mainProblems,
        coverage,
        reportUrl,
        leadUrl,
        suggestedAngle,
        marketingConsent,
      }),
    });

    if (error) {
      console.error(
        `[email] Resend returned an error sending lead notification for ${hostname}:`,
        error.message,
      );
      return { success: false, error: error.message };
    }

    // Redacted log — no PII.
    console.info(
      `[email] Lead notification sent: id=${data?.id}, hostname=${hostname}, score=${overallScore}`,
    );

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] Unexpected error sending lead notification:', message);
    return { success: false, error: message };
  }
}
