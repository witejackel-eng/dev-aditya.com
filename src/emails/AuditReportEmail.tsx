/**
 * React email template for the audit report email.
 *
 * Brand styling:
 *  – Off-white background: #FAFAF7
 *  – White content panel
 *  – Black borders: #111
 *  – Maroon CTA: #7A1F2B
 *  – Plain professional typography (system fonts)
 *
 * Uses inline styles exclusively — no Tailwind classes (email
 * clients don't support them).
 */

import type { AuditFinding } from '@/lib/audit/types';
import { CONTACT_EMAIL } from '@/config/contact';

// ──────────────────────────────────────────────────────────────
// Props
// ──────────────────────────────────────────────────────────────

export interface AuditReportEmailProps {
  firstName: string;
  hostname: string;
  overallScore: number;
  categoryScores: Record<string, number | null>;
  topFindings: AuditFinding[];
  reportUrl: string;
  reportId: string;
}

// ──────────────────────────────────────────────────────────────
// Subject line factory
// ──────────────────────────────────────────────────────────────

export function AUDIT_REPORT_EMAIL_SUBJECT(
  hostname: string,
  score: number,
): string {
  return `Your website audit for ${hostname} — ${score}/100`;
}

// ──────────────────────────────────────────────────────────────
// Category display labels
// ──────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  performance: 'Performance',
  seo: 'SEO',
  accessibility: 'Accessibility',
  bestPracticesSecurity: 'Best Practices & Security',
  mobileReadiness: 'Mobile Readiness',
  conversionReadiness: 'Conversion Readiness',
};

// ──────────────────────────────────────────────────────────────
// Score colour helper
// ──────────────────────────────────────────────────────────────

function scoreColor(score: number | null): string {
  if (score == null) return '#888888';
  if (score >= 90) return '#1a7a3a';
  if (score >= 75) return '#3a8a1a';
  if (score >= 60) return '#b8860b';
  if (score >= 40) return '#cc5500';
  return '#aa1111';
}

// ──────────────────────────────────────────────────────────────
// Severity badge colour
// ──────────────────────────────────────────────────────────────

function severityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return '#aa1111';
    case 'high':
      return '#cc5500';
    case 'medium':
      return '#b8860b';
    case 'low':
      return '#3a8a1a';
    default:
      return '#888888';
  }
}

// ──────────────────────────────────────────────────────────────
// Template
// ──────────────────────────────────────────────────────────────

export function AuditReportEmail({
  firstName,
  hostname,
  overallScore,
  categoryScores,
  topFindings,
  reportUrl,
  reportId,
}: AuditReportEmailProps) {
  const top3 = topFindings.slice(0, 3);

  return (
    <div style={styles.outer}>
      <div style={styles.wrapper}>
        {/* ── Header ── */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            Website Audit Report
          </h1>
          <p style={styles.headerSubtitle}>
            {hostname}
          </p>
        </div>

        {/* ── Greeting ── */}
        <div style={styles.body}>
          <p style={styles.greeting}>
            Hi {firstName},
          </p>
          <p style={styles.paragraph}>
            Your website audit for <strong>{hostname}</strong> is complete.
            Here&apos;s a summary of how your site performed.
          </p>

          {/* ── Overall Score ── */}
          <div style={styles.scoreSection}>
            <div style={styles.scoreBox}>
              <span style={{ ...styles.scoreNumber, color: scoreColor(overallScore) }}>
                {overallScore}
              </span>
              <span style={styles.scoreOutOf}>/100</span>
            </div>
            <p style={styles.scoreLabel}>Overall Score</p>
          </div>

          {/* ── Category Scores ── */}
          <div style={styles.categoriesSection}>
            <h2 style={styles.sectionTitle}>Category Breakdown</h2>
            <table style={styles.categoryTable} cellPadding={0} cellSpacing={0}>
              <tbody>
                {Object.entries(categoryScores).map(([key, score]) => (
                  <tr key={key}>
                    <td style={styles.categoryLabelCell}>
                      {CATEGORY_LABELS[key] ?? key}
                    </td>
                    <td style={styles.categoryScoreCell}>
                      <span style={{ color: scoreColor(score), fontWeight: 700 }}>
                        {score ?? 'N/A'}
                      </span>
                      {score != null && <span style={{ color: '#888888' }}>/100</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Top Findings ── */}
          {top3.length > 0 && (
            <div style={styles.findingsSection}>
              <h2 style={styles.sectionTitle}>Top Findings</h2>
              {top3.map((finding, i) => (
                <div key={finding.id} style={styles.findingCard}>
                  <div style={styles.findingHeader}>
                    <span style={styles.findingNumber}>{i + 1}.</span>
                    <span style={styles.findingTitle}>{finding.title}</span>
                    <span
                      style={{
                        ...styles.severityBadge,
                        backgroundColor: severityColor(finding.severity),
                      }}
                    >
                      {finding.severity}
                    </span>
                  </div>
                  <p style={styles.findingSummary}>{finding.summary}</p>
                  {finding.whyItMatters && (
                    <p style={styles.findingWhy}>
                      <strong>Why it matters:</strong> {finding.whyItMatters}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── CTA Button ── */}
          <div style={styles.ctaSection}>
            <a href={reportUrl} style={styles.ctaButton}>
              View Your Full Report
            </a>
          </div>

          {/* ── Expiration Note ── */}
          <p style={styles.note}>
            This report link expires in 30 days. Save or print the report
            before then for your records.
          </p>

          {/* ── Reply Invitation ── */}
          <p style={styles.paragraph}>
            Have questions about your audit results? Reply directly to this
            email — I read every response.
          </p>

          {/* ── Footer ── */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Report ID: {reportId}
            </p>
            <p style={styles.footerText}>
              Contact: <a href={`mailto:${CONTACT_EMAIL}`} style={styles.footerLink}>{CONTACT_EMAIL}</a>
            </p>
            <p style={styles.footerDisclaimer}>
              This audit is automated and based on publicly accessible data at
              the time of scanning. It provides directional guidance, not a
              guarantee of specific outcomes. Manual review is recommended
              before acting on any finding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  outer: {
    backgroundColor: '#FAFAF7',
    padding: '40px 20px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#111111',
  },
  wrapper: {
    maxWidth: 600,
    margin: '0 auto',
    backgroundColor: '#ffffff',
    border: '1px solid #111111',
    borderRadius: 4,
  },
  header: {
    backgroundColor: '#111111',
    color: '#ffffff',
    padding: '32px 40px',
    textAlign: 'center' as const,
  },
  headerTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  headerSubtitle: {
    margin: '8px 0 0',
    fontSize: 16,
    fontWeight: 400,
    opacity: 0.85,
  },
  body: {
    padding: '32px 40px',
  },
  greeting: {
    fontSize: 16,
    lineHeight: 1.6,
    margin: '0 0 12px',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 1.7,
    margin: '0 0 20px',
    color: '#333333',
  },
  scoreSection: {
    textAlign: 'center' as const,
    padding: '24px 0',
    borderTop: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
    margin: '20px 0',
  },
  scoreBox: {
    marginBottom: 4,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: 800,
  },
  scoreOutOf: {
    fontSize: 20,
    color: '#888888',
    fontWeight: 400,
  },
  scoreLabel: {
    margin: 0,
    fontSize: 14,
    color: '#666666',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  },
  categoriesSection: {
    margin: '24px 0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    margin: '0 0 12px',
    color: '#111111',
  },
  categoryTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  categoryLabelCell: {
    padding: '8px 0',
    fontSize: 14,
    color: '#333333',
    borderBottom: '1px solid #eeeeee',
  },
  categoryScoreCell: {
    padding: '8px 0',
    fontSize: 14,
    textAlign: 'right' as const,
    borderBottom: '1px solid #eeeeee',
  },
  findingsSection: {
    margin: '24px 0',
  },
  findingCard: {
    padding: '16px',
    marginBottom: 12,
    border: '1px solid #e0e0e0',
    borderRadius: 4,
    backgroundColor: '#fafafa',
  },
  findingHeader: {
    marginBottom: 6,
  },
  findingNumber: {
    fontWeight: 700,
    color: '#111111',
    marginRight: 6,
    fontSize: 14,
  },
  findingTitle: {
    fontWeight: 600,
    fontSize: 14,
    color: '#111111',
    marginRight: 8,
  },
  severityBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 3,
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  findingSummary: {
    margin: '0 0 6px',
    fontSize: 13,
    lineHeight: 1.5,
    color: '#555555',
  },
  findingWhy: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.5,
    color: '#555555',
  },
  ctaSection: {
    textAlign: 'center' as const,
    padding: '24px 0',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '14px 36px',
    backgroundColor: '#7A1F2B',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 700,
    textDecoration: 'none',
    borderRadius: 4,
    letterSpacing: '0.02em',
  },
  note: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center' as const,
    margin: '0 0 20px',
    lineHeight: 1.5,
  },
  footer: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: 20,
    marginTop: 20,
  },
  footerText: {
    margin: '0 0 6px',
    fontSize: 12,
    color: '#888888',
  },
  footerLink: {
    color: '#7A1F2B',
    textDecoration: 'underline',
  },
  footerDisclaimer: {
    margin: '12px 0 0',
    fontSize: 11,
    color: '#aaaaaa',
    lineHeight: 1.5,
  },
};

export default AuditReportEmail;
