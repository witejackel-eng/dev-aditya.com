import { NextRequest, NextResponse } from 'next/server';

import { CONTACT_EMAIL } from '@/config/contact';
import { checkHoneypot, readBodyWithLimit } from '@/lib/request-security';
import { sendContactEnquiryEmail } from '@/lib/email/resend';

export const runtime = 'nodejs';

const MAX_LENGTHS = {
  name: 200,
  email: 254,
  company: 200,
  website: 300,
  projectType: 100,
  scope: 200,
  timing: 200,
  details: 2000,
  sourcePage: 300,
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** True for ASCII control characters (0-31, 127) — no place in a header or a display value. */
function isControlCharCode(code: number): boolean {
  return code <= 31 || code === 127;
}

/**
 * Strip control characters — including CR/LF, which would otherwise allow
 * email header injection via the subject line — collapse whitespace, trim,
 * and cap length. Used for every single-line field.
 */
function sanitizeLine(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  let out = '';
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    out += isControlCharCode(code) ? ' ' : value[i];
  }
  return out.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

/** Like sanitizeLine, but preserves single newlines for the free-text details field. */
function sanitizeDetails(value: unknown): string {
  if (typeof value !== 'string') return '';
  const normalized = value.split('\r\n').join('\n');
  let out = '';
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const code = normalized.charCodeAt(i);
    if (char === '\n' || !isControlCharCode(code)) out += char;
  }
  return out.trim().slice(0, MAX_LENGTHS.details);
}

export async function POST(request: NextRequest) {
  let raw: string;
  try {
    raw = await readBodyWithLimit(request, 50_000);
  } catch {
    return NextResponse.json(
      { success: false, message: 'Request body is too large.' },
      { status: 413 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 },
    );
  }

  // Honeypot — silently accept without sending an email or touching Resend.
  if (checkHoneypot(body, '_honey')) {
    return NextResponse.json(
      { success: true, message: "Enquiry received. I'll reply within 1–2 business days." },
      { status: 200 },
    );
  }

  const name = sanitizeLine(body.name, MAX_LENGTHS.name);
  const email = sanitizeLine(body.email, MAX_LENGTHS.email);
  const company = sanitizeLine(body.company, MAX_LENGTHS.company);
  const website = sanitizeLine(body.website, MAX_LENGTHS.website);
  const projectType = sanitizeLine(body.projectType, MAX_LENGTHS.projectType);
  const scope = sanitizeLine(body.scope, MAX_LENGTHS.scope);
  const timing = sanitizeLine(body.timing, MAX_LENGTHS.timing);
  const details = sanitizeDetails(body.details);

  if (!name || !email || !details) {
    return NextResponse.json(
      { success: false, message: 'Name, work email, and project details are required.' },
      { status: 400 },
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { success: false, message: 'Please provide a valid email address.' },
      { status: 400 },
    );
  }

  const sourcePage = sanitizeLine(request.headers.get('referer'), MAX_LENGTHS.sourcePage) || '/contact';
  const submittedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const result = await sendContactEnquiryEmail({
    name,
    email,
    company,
    website,
    projectType,
    scope,
    timing,
    details,
    sourcePage,
    submittedAt,
  });

  if (!result.success) {
    if (result.reason === 'not_configured') {
      // Safe diagnostic only — never leaks a key or personal data.
      console.error('[contact] Enquiry email not sent — service not configured:', result.error);
      return NextResponse.json(
        {
          success: false,
          message: `Email delivery is not configured yet. Please email ${CONTACT_EMAIL} directly.`,
        },
        { status: 503 },
      );
    }

    console.error('[contact] Enquiry email failed to send:', result.error);
    return NextResponse.json(
      {
        success: false,
        message: `Something went wrong sending your enquiry. Please email ${CONTACT_EMAIL} directly.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Enquiry received. I'll reply within 1–2 business days.",
  });
}
