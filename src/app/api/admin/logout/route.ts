/**
 * POST /api/admin/logout
 *
 * Clear the admin session cookie.
 */

import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/admin/session';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );

    // Clear the session cookie by setting it with an expired maxAge
    response.cookies.set(ADMIN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Immediately expire
    });

    return response;
  } catch (err) {
    console.error('[admin:logout] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Something went wrong during logout.' },
      { status: 500 },
    );
  }
}
