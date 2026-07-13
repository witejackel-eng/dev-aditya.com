import type { Metadata } from 'next';
import AdminLoginPageClient from './AdminLoginPageClient';

export const metadata: Metadata = {
  title: 'Admin Login | Aditya',
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLoginPage() {
  return <AdminLoginPageClient />;
}
