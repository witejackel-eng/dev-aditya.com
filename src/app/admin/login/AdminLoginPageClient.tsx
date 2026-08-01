'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPageClient() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, website_confirm: '' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
        return;
      }
      router.push('/admin/audit-leads');
    } catch {
      setError('Could not connect. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="pt-[100px] min-h-screen bg-bg-primary flex items-start justify-center">
      <div className="max-w-sm w-full mx-6 mt-16">
        <div className="bg-bg-surface border border-border-hard shadow-hard p-8">
          <h1 className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
            Admin Login
          </h1>
          <h2 className="text-xl font-bold text-text-primary mb-6">Sign in to dashboard</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website_confirm">Website</label>
              <input id="website_confirm" name="website_confirm" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label htmlFor="password" className="block font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-text-muted mb-2">
                Password
              </label>
              <input
                ref={inputRef}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-border-hard px-4 py-3 text-sm bg-white text-text-primary focus:outline-none focus:border-maroon transition-colors"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-maroon" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
