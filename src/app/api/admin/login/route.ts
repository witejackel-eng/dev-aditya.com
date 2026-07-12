/**
 * POST /api/admin/login
 *
 * Admin dashboard login.
 *
 * Steps:
 *  1. Validate body (password field)
 *  2. Apply rate limits (5 per 15 min per hashed IP)
 *  3. Check honeypot
 *  4. Verify password against ADMIN_PASSWORD_HASH
 *  5. Generic error: "Invalid credentials." — don't expose whether username or password was wrong
 *  6. On success: set session cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyPassword } from '@/lib/admin/password';
import { createSessionCookie } from '@/lib/admin/session';
import { env } from '@/lib/env';
import { checkRateLimit, hashIpForRateLimit } from '@/lib/rate-limit';
import { checkHoneypot, readBodyWithLimit, getClientIp, validateSameOrigin } from '@/lib/request-security';

// ──────────────────────────────────────────────────────────────
// Zod schema
// ──────────────────────────────────────────────────────────────

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required.').max(256),
  /** Honeypot — must be empty. */
  website_confirm: z.string().max(0).optional(),
});

// ──────────────────────────────────────────────────────────────
// Route handler
// ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // ── Same-origin validation ──
    if (!validateSameOrigin(request)) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    // ── Read body ──
    let bodyText: string;
    try {
      bodyText = await readBodyWithLimit(request, 8 * 1024); // 8 KB
    } catch {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    let rawBody: Record<string, unknown>;
    try {
      rawBody = JSON.parse(bodyText) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    // ── Honeypot check ──
    if (checkHoneypot(rawBody)) {
      // Silently reject — bots think they failed
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    // ── Zod validation ──
    const parsed = loginSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    const { password } = parsed.data;

    // ── Rate limit ──
    const clientIp = getClientIp(request);
    const ipHash = hashIpForRateLimit(clientIp);

    const rateLimitResult = await checkRateLimit(
      `admin:login:${ipHash}`,
      5, // 5 per 15 minutes
      15 * 60 * 1_000, // 15 minutes
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1_000)),
          },
        },
      );
    }

    // ── Verify password ──
    const passwordHash = env.ADMIN_PASSWORD_HASH;
    if (!passwordHash) {
      console.error('[admin:login] ADMIN_PASSWORD_HASH is not configured.');
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(password, passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    // ── Create session cookie ──
    const sessionCookie = createSessionCookie();

    const response = NextResponse.json(
      { success: true },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options as {
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'lax' | 'strict' | 'none';
        path: string;
        maxAge: number;
      },
    );

    return response;
  } catch (err) {
    console.error('[admin:login] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Invalid credentials.' },
      { status: 401 },
    );
  }
}
