/**
 * Reusable admin authentication helper.
 *
 * Reads the admin_session cookie, verifies the HMAC signature,
 * and returns either the validated result or a safe 401 JSON response.
 *
 * Every route under /api/admin/* EXCEPT /api/admin/login must call this.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifySession, ADMIN_COOKIE_NAME } from '@/lib/admin/session';

/**
 * Require admin authentication for an API route.
 *
 * @returns `true` if authenticated, or a `NextResponse` with 401 status.
 */
export async function requireAdmin(): Promise<true | NextResponse> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Authentication required. Please log in to the admin dashboard.' },
      { status: 401 },
    );
  }

  const isValid = verifySession(sessionCookie);

  if (!isValid) {
    return NextResponse.json(
      { error: 'Session expired or invalid. Please log in again.' },
      { status: 401 },
    );
  }

  return true;
}
