/**
 * Next.js middleware for the Website Revenue Audit Funnel.
 *
 * Protects admin routes by verifying the `admin_session` cookie
 * using HMAC-signed session validation.  Unauthenticated requests
 * to admin pages receive a 401 response, and API admin routes
 * (except /api/admin/login) also require a valid session.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin/session';

// ──────────────────────────────────────────────────────────────
// Route matching
// ──────────────────────────────────────────────────────────────

/**
 * Check whether a request path should be protected by admin
 * authentication.
 *
 * Protected:
 *  – /admin/audit-leads
 *  – /admin/audit-leads/*
 *  – /api/admin/*   (except /api/admin/login)
 *
 * NOT protected:
 *  – /api/admin/login  (that's where the login happens)
 *  – Everything else
 */
function isProtectedRoute(pathname: string): boolean {
  // Admin page routes
  if (pathname === '/admin/audit-leads' || pathname.startsWith('/admin/audit-leads/')) {
    return true;
  }

  // Admin API routes — except login
  if (pathname.startsWith('/api/admin/')) {
    // The login endpoint itself is NOT protected
    if (pathname === '/api/admin/login') {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Check whether the path is a page route (not an API route).
 */
function isPageRoute(pathname: string): boolean {
  return !pathname.startsWith('/api/');
}

// ──────────────────────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect specific admin routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for the admin session cookie
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return handleUnauthenticated(request, pathname);
  }

  // Verify the HMAC signature
  const isValid = verifySession(sessionCookie);

  if (!isValid) {
    return handleUnauthenticated(request, pathname);
  }

  // Session is valid — allow the request through
  return NextResponse.next();
}

/**
 * Handle an unauthenticated request.
 *
 * For page routes: return 401 (the client-side will handle
 * showing a login form or redirect).
 *
 * For API routes: return a JSON 401 response.
 */
function handleUnauthenticated(
  request: NextRequest,
  pathname: string,
): NextResponse {
  if (isPageRoute(pathname)) {
    // For admin pages, return 401 so the frontend can show login
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Cookie realm="admin"',
      },
    });
  }

  // For API routes, return a JSON error response
  return NextResponse.json(
    { error: 'Authentication required. Please log in to the admin dashboard.' },
    { status: 401 },
  );
}

// ──────────────────────────────────────────────────────────────
// Matcher
// ──────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match admin-related routes:
     *  – /admin/audit-leads
     *  – /admin/audit-leads/:path*
     *  – /api/admin/:path*
     */
    '/admin/audit-leads',
    '/admin/audit-leads/:path*',
    '/api/admin/:path*',
  ],
};
