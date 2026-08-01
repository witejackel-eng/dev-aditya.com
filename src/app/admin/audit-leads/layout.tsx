/**
 * Admin audit-leads layout.
 *
 * Server layout that reads the admin_session cookie, verifies it using
 * the Node runtime admin session helper, and redirects unauthenticated
 * users to /admin/login. Preserves an optional safe `next` query parameter.
 *
 * Adds noindex/nofollow/noarchive meta to prevent search engine indexing.
 */

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySession, ADMIN_COOKIE_NAME } from '@/lib/admin/session';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Aditya',
  robots: { index: false, follow: false, noarchive: true },
};

export default async function AdminAuditLeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionCookie || !verifySession(sessionCookie)) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
