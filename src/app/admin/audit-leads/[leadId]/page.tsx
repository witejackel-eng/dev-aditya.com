'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface LeadDetail {
  id: string;
  firstName: string;
  email: string;
  businessName: string;
  marketingConsent: boolean;
  hostname: string;
  normalizedUrl: string;
  overallScore: number;
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesSecurityScore: number;
  mobileReadinessScore: number;
  conversionReadinessScore: number;
  coverage: number;
  status: string;
  notes: string;
  emailDeliveryStatus: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt: string;
  auditId: string;
  topFindings: { title: string; severity: string; category: string }[];
  timeline: { eventType: string; createdAt: string; metadata: any }[];
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  new: ['reviewed', 'not_suitable'],
  reviewed: ['contacted', 'not_suitable'],
  contacted: ['replied', 'not_suitable'],
  replied: ['consultation', 'not_suitable'],
  consultation: ['proposal_sent', 'not_suitable', 'lost'],
  proposal_sent: ['won', 'lost', 'not_suitable'],
  won: [],
  lost: ['replied'],
  not_suitable: ['new'],
};

export default function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const [leadId, setLeadId] = useState<string>('');
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { params.then(p => setLeadId(p.leadId)); }, [params]);

  const fetchLead = useCallback(async () => {
    if (!leadId) return;
    try {
      const res = await fetch(`/api/admin/audit-leads/${leadId}`);
      if (res.status === 401) { setAuthed(false); return; }
      const data = await res.json();
      setLead(data);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [leadId]);

  useEffect(() => { fetchLead(); }, [fetchLead]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await fetch(`/api/admin/audit-leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchLead();
    } catch { /* ignore */ } finally { setUpdating(false); }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setUpdating(true);
    try {
      await fetch(`/api/admin/audit-leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: ((lead?.notes || '') + '\n' + note).trim() }),
      });
      setNote('');
      fetchLead();
    } catch { /* ignore */ } finally { setUpdating(false); }
  };

  const resendEmail = async () => {
    try {
      await fetch(`/api/admin/audit-leads/${leadId}/resend`, { method: 'POST' });
      fetchLead();
    } catch { /* ignore */ }
  };

  if (!authed) {
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    return null;
  }

  if (loading || !lead) {
    return (
      <div className="pt-[100px] min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-muted font-[family-name:var(--font-mono)] text-sm">Loading...</p>
      </div>
    );
  }

  const allowedNext = ALLOWED_TRANSITIONS[lead.status] || [];

  return (
    <div className="pt-[100px] min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link href="/admin/audit-leads" className="text-sm text-text-muted hover:text-maroon transition-colors font-[family-name:var(--font-mono)] uppercase tracking-widest">
          &larr; All leads
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Left - Contact info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-bg-surface border border-border-hard shadow-hard-sm p-6">
              <h2 className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Contact Details</h2>
              <div className="space-y-3 text-sm">
                <p><span className="text-text-muted">Name:</span> <span className="text-text-primary font-medium">{lead.firstName}</span></p>
                <p><span className="text-text-muted">Email:</span> <a href={`mailto:${lead.email}`} className="text-maroon hover:underline">{lead.email}</a></p>
                {lead.businessName && <p><span className="text-text-muted">Business:</span> {lead.businessName}</p>}
                <p><span className="text-text-muted">Website:</span> <a href={lead.normalizedUrl} target="_blank" rel="noopener noreferrer" className="text-maroon hover:underline">{lead.hostname} &nearr;</a></p>
                <p><span className="text-text-muted">Marketing consent:</span> <span className={lead.marketingConsent ? 'text-green-700' : 'text-text-muted'}>{lead.marketingConsent ? 'Yes' : 'No'}</span></p>
                <p><span className="text-text-muted">Email delivery:</span> <span className={lead.emailDeliveryStatus === 'sent' ? 'text-green-700' : lead.emailDeliveryStatus === 'failed' ? 'text-maroon' : 'text-text-muted'}>{lead.emailDeliveryStatus}</span></p>
              </div>
            </div>

            {/* Status update */}
            <div className="bg-bg-surface border border-border-hard shadow-hard-sm p-6">
              <h2 className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Lead Status</h2>
              <p className="text-lg font-bold text-text-primary mb-3 capitalize">{lead.status.replace('_', ' ')}</p>
              {allowedNext.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {allowedNext.map((s) => (
                    <button key={s} onClick={() => updateStatus(s)} disabled={updating} className="bg-bg-surface-2 border border-border-hard px-3 py-1.5 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-primary hover:bg-maroon hover:text-white hover:border-maroon transition-colors disabled:opacity-50">
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-bg-surface border border-border-hard shadow-hard-sm p-6">
              <h2 className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Actions</h2>
              <div className="space-y-3">
                <a href={`mailto:${lead.email}`} className="block bg-maroon text-white border border-border-hard px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-center shadow-hard-sm hover:bg-maroon-dark transition-colors">
                  Compose Email
                </a>
                <Link href={`/audit/${lead.auditId}`} className="block bg-bg-surface-2 border border-border-hard px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-center text-text-primary hover:bg-bg-surface transition-colors">
                  View Report
                </Link>
                {lead.emailDeliveryStatus === 'failed' && (
                  <button onClick={resendEmail} className="w-full bg-bg-surface-2 border border-border-hard px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-primary hover:bg-bg-surface transition-colors">
                    Resend Report Email
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right - Audit data + notes + timeline */}
          <div className="lg:col-span-7 space-y-6">
            {/* Score breakdown */}
            <div className="bg-bg-surface border border-border-hard shadow-hard-sm p-6">
              <h2 className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Score Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Overall', value: lead.overallScore },
                  { label: 'Performance', value: lead.performanceScore },
                  { label: 'SEO', value: lead.seoScore },
                  { label: 'Accessibility', value: lead.accessibilityScore },
                  { label: 'Security', value: lead.bestPracticesSecurityScore },
                  { label: 'Conversion', value: lead.conversionReadinessScore },
                ].map((s) => (
                  <div key={s.label} className="border border-border p-3">
                    <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-text-muted">{s.label}</p>
                    <p className="text-lg font-bold text-text-primary">{s.value}/100</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3">Coverage: {lead.coverage} of 5 checks completed</p>
            </div>

            {/* Top Findings */}
            {lead.topFindings && lead.topFindings.length > 0 && (
              <div className="bg-bg-surface border border-border-hard shadow-hard-sm p-6">
                <h2 className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Top Findings</h2>
                <div className="space-y-2">
                  {lead.topFindings.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-maroon-soft text-maroon shrink-0">{f.severity}</span>
                      <div>
                        <p className="text-text-primary font-medium">{f.title}</p>
                        <p className="text-xs text-text-muted">{f.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="bg-bg-surface border border-border-hard shadow-hard-sm p-6">
              <h2 className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Notes</h2>
              {lead.notes && (
                <div className="bg-bg-surface-2 border border-border p-4 mb-4 text-sm text-text-primary whitespace-pre-wrap">{lead.notes}</div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 border border-border-hard px-3 py-2 text-sm bg-white text-text-primary focus:outline-none focus:border-maroon"
                />
                <button onClick={addNote} disabled={updating || !note.trim()} className="bg-maroon text-white border border-border-hard px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest shadow-hard-sm hover:bg-maroon-dark transition-colors disabled:opacity-50">
                  Add
                </button>
              </div>
            </div>

            {/* Timeline */}
            {lead.timeline && lead.timeline.length > 0 && (
              <div className="bg-bg-surface border border-border-hard shadow-hard-sm p-6">
                <h2 className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">Timeline</h2>
                <div className="space-y-3">
                  {lead.timeline.map((event, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-2 h-2 bg-maroon rounded-full mt-1.5 shrink-0" />
                      <div>
                        <p className="text-text-primary font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest">{event.eventType.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-text-muted">{new Date(event.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
