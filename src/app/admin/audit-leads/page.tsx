'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface LeadSummary {
  totalAudits: number;
  completedAudits: number;
  emailsCaptured: number;
  unlockRate: number;
  consultationClicks: number;
  clientsWon: number;
}

interface Lead {
  id: string;
  firstName: string;
  email: string;
  businessName: string;
  hostname: string;
  overallScore: number;
  mainIssue: string;
  status: string;
  marketingConsent: boolean;
  createdAt: string;
  auditId: string;
}

export default function AdminAuditLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [summary, setSummary] = useState<LeadSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const perPage = 20;

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(perPage) });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/audit-leads?${params}`);
      if (!res.ok) {
        if (res.status === 401) { setAuthed(false); return; }
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to load leads.');
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setSummary(data.stats || null);
      setTotalPages(data.pagination?.totalPages || 1);
      setError(null);
    } catch {
      // Silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [page, search, statusFilter]);

  if (!authed) {
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    return null;
  }

  const statusColors: Record<string, string> = {
    new: 'bg-bg-surface-2 text-text-primary',
    reviewed: 'bg-maroon-soft text-maroon',
    contacted: 'bg-maroon-soft text-maroon-light',
    replied: 'bg-maroon-soft text-maroon',
    consultation: 'bg-maroon text-white',
    proposal_sent: 'bg-maroon text-white',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-bg-surface-2 text-text-muted',
    not_suitable: 'bg-bg-surface-2 text-text-muted',
  };

  const summaryCards = summary ? [
    { label: 'Total Audits', value: summary.totalAudits },
    { label: 'Completed', value: summary.completedAudits },
    { label: 'Emails Captured', value: summary.emailsCaptured },
    { label: 'Unlock Rate', value: `${summary.unlockRate}%` },
    { label: 'Consultation Clicks', value: summary.consultationClicks },
    { label: 'Clients Won', value: summary.clientsWon },
  ] : [];

  return (
    <div className="pt-[100px] min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-1">Admin</p>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary uppercase tracking-tight">Audit Leads</h1>
          </div>
          <div className="flex gap-3">
            <a href="/api/admin/audit-leads/export" className="bg-bg-surface border border-border-hard px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-primary hover:bg-bg-surface-2 transition-colors shadow-hard-sm">
              Export CSV
            </a>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="bg-maroon text-white border border-border-hard px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest shadow-hard-sm hover:bg-maroon-dark transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-6 bg-bg-surface border border-border-hard p-4 text-sm text-maroon">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-bg-surface border border-border-hard p-4 shadow-hard-sm">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-text-muted mb-1">{card.label}</p>
              <p className="text-xl font-bold text-text-primary">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search name, email, business, website..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border border-border-hard px-4 py-2 text-sm bg-white text-text-primary focus:outline-none focus:border-maroon min-w-[250px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-border-hard px-4 py-2 text-sm bg-white text-text-primary focus:outline-none focus:border-maroon"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="replied">Replied</option>
            <option value="consultation">Consultation</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="not_suitable">Not Suitable</option>
          </select>
        </div>

        {/* Leads Table - Desktop */}
        <div className="hidden md:block bg-bg-surface border border-border-hard shadow-hard overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-surface-2 border-b border-border-hard">
                <th className="text-left px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-text-muted">Date</th>
                <th className="text-left px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-text-muted">Lead</th>
                <th className="text-left px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-text-muted">Website</th>
                <th className="text-left px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-text-muted">Score</th>
                <th className="text-left px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-text-muted">Status</th>
                <th className="text-left px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">Loading...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No leads found</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-bg-surface-2 transition-colors">
                  <td className="px-4 py-3 text-text-muted text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <p className="text-text-primary font-medium">{lead.firstName}</p>
                    <p className="text-text-muted text-xs">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-primary">{lead.hostname}</td>
                  <td className="px-4 py-3 font-bold text-text-primary">{lead.overallScore}/100</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest ${statusColors[lead.status] || 'bg-bg-surface-2 text-text-muted'}`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/audit-leads/${lead.id}`} className="text-xs text-maroon hover:underline font-[family-name:var(--font-mono)] uppercase tracking-widest">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leads Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <p className="text-text-muted text-center py-8">Loading...</p>
          ) : leads.length === 0 ? (
            <p className="text-text-muted text-center py-8">No leads found</p>
          ) : leads.map((lead) => (
            <div key={lead.id} className="bg-bg-surface border border-border-hard p-4 shadow-hard-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-text-primary">{lead.firstName}</p>
                <span className={`px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest ${statusColors[lead.status] || 'bg-bg-surface-2 text-text-muted'}`}>
                  {lead.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-text-muted mb-1">{lead.email}</p>
              <p className="text-xs text-text-primary">{lead.hostname} &mdash; {lead.overallScore}/100</p>
              <div className="flex gap-3 mt-3">
                <Link href={`/admin/audit-leads/${lead.id}`} className="text-xs text-maroon font-[family-name:var(--font-mono)] uppercase tracking-widest">View</Link>
                <a href={`mailto:${lead.email}`} className="text-xs text-text-muted font-[family-name:var(--font-mono)] uppercase tracking-widest hover:text-text-primary">Email</a>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-bg-surface border border-border-hard px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-primary disabled:opacity-50">
              Previous
            </button>
            <span className="text-sm text-text-muted font-[family-name:var(--font-mono)]">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="bg-bg-surface border border-border-hard px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-primary disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
