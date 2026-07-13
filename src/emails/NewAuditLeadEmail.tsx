/**
 * React email template for the new-lead notification email.
 *
 * This email is sent internally to the site owner when a new lead
 * completes the audit funnel.  It includes all relevant lead data
 * and a suggested sales angle grounded in the actual audit findings.
 *
 * Brand styling:
 *  – Off-white background: #FAFAF7
 *  – White content panel
 *  – Black borders: #111
 *  – Maroon accents: #7A1F2B
 *  – Plain professional typography (system fonts)
 *
 * Uses inline styles exclusively — no Tailwind classes.
 */

import { CONTACT_EMAIL } from '@/config/contact';

// ──────────────────────────────────────────────────────────────
// Props
// ──────────────────────────────────────────────────────────────

export interface NewAuditLeadEmailProps {
  firstName: string;
  email: string;
  businessName?: string;
  hostname: string;
  overallScore: number;
  mainProblems: string[];
  coverage: number;
  reportUrl: string;
  leadUrl: string;
  suggestedAngle: string;
  marketingConsent: boolean;
}

// ──────────────────────────────────────────────────────────────
// Subject line factory
// ──────────────────────────────────────────────────────────────

export function NEW_LEAD_EMAIL_SUBJECT(
  hostname: string,
  score: number,
): string {
  return `New website audit lead — ${hostname} — ${score}/100`;
}

// ──────────────────────────────────────────────────────────────
// Score colour helper
// ──────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 90) return '#1a7a3a';
  if (score >= 75) return '#3a8a1a';
  if (score >= 60) return '#b8860b';
  if (score >= 40) return '#cc5500';
  return '#aa1111';
}

// ──────────────────────────────────────────────────────────────
// Template
// ──────────────────────────────────────────────────────────────

export function NewAuditLeadEmail({
  firstName,
  email,
  businessName,
  hostname,
  overallScore,
  mainProblems,
  coverage,
  reportUrl,
  leadUrl,
  suggestedAngle,
  marketingConsent,
}: NewAuditLeadEmailProps) {
  const top3Problems = mainProblems.slice(0, 3);

  return (
    <div style={styles.outer}>
      <div style={styles.wrapper}>
        {/* ── Header ── */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            New Audit Lead
          </h1>
          <p style={styles.headerSubtitle}>
            {hostname} — {overallScore}/100
          </p>
        </div>

        {/* ── Body ── */}
        <div style={styles.body}>
          {/* ── Lead Info ── */}
          <div style={styles.leadInfoSection}>
            <h2 style={styles.sectionTitle}>Lead Details</h2>
            <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td style={styles.infoLabelCell}>Name</td>
                  <td style={styles.infoValueCell}>{firstName}</td>
                </tr>
                <tr>
                  <td style={styles.infoLabelCell}>Email</td>
                  <td style={styles.infoValueCell}>
                    <a href={`mailto:${email}`} style={styles.emailLink}>{email}</a>
                  </td>
                </tr>
                {businessName && (
                  <tr>
                    <td style={styles.infoLabelCell}>Business</td>
                    <td style={styles.infoValueCell}>{businessName}</td>
                  </tr>
                )}
                <tr>
                  <td style={styles.infoLabelCell}>Website</td>
                  <td style={styles.infoValueCell}>{hostname}</td>
                </tr>
                <tr>
                  <td style={styles.infoLabelCell}>Overall Score</td>
                  <td style={styles.infoValueCell}>
                    <span style={{ color: scoreColor(overallScore), fontWeight: 700 }}>
                      {overallScore}
                    </span>
                    /100
                  </td>
                </tr>
                <tr>
                  <td style={styles.infoLabelCell}>Scan Coverage</td>
                  <td style={styles.infoValueCell}>{coverage}%</td>
                </tr>
                <tr>
                  <td style={styles.infoLabelCell}>Marketing Consent</td>
                  <td style={styles.infoValueCell}>
                    <span style={marketingConsent ? styles.consentYes : styles.consentNo}>
                      {marketingConsent ? 'Yes — opted in' : 'No — not opted in'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Main Problems ── */}
          {top3Problems.length > 0 && (
            <div style={styles.problemsSection}>
              <h2 style={styles.sectionTitle}>Top Problems Identified</h2>
              <ul style={styles.problemList}>
                {top3Problems.map((problem, i) => (
                  <li key={i} style={styles.problemItem}>
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Suggested Sales Angle ── */}
          <div style={styles.angleSection}>
            <h2 style={styles.sectionTitle}>Suggested Sales Angle</h2>
            <p style={styles.angleText}>
              {suggestedAngle}
            </p>
          </div>

          {/* ── Action Buttons ── */}
          <div style={styles.buttonsSection}>
            <a href={reportUrl} style={styles.primaryButton}>
              View Full Report
            </a>
            <a href={leadUrl} style={styles.secondaryButton}>
              Open in Lead Dashboard
            </a>
          </div>

          {/* ── Footer ── */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Reply-to is set to the lead&apos;s email address ({email}).
            </p>
            <p style={styles.footerText}>
              Internal contact: <a href={`mailto:${CONTACT_EMAIL}`} style={styles.footerLink}>{CONTACT_EMAIL}</a>
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
  leadInfoSection: {
    margin: '0 0 24px',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    margin: '0 0 12px',
    color: '#111111',
  },
  infoTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  infoLabelCell: {
    padding: '8px 12px 8px 0',
    fontSize: 13,
    color: '#888888',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
    borderBottom: '1px solid #eeeeee',
    verticalAlign: 'top' as const,
  },
  infoValueCell: {
    padding: '8px 0',
    fontSize: 14,
    color: '#111111',
    borderBottom: '1px solid #eeeeee',
  },
  emailLink: {
    color: '#7A1F2B',
    textDecoration: 'none',
    fontWeight: 500,
  },
  consentYes: {
    color: '#1a7a3a',
    fontWeight: 600,
  },
  consentNo: {
    color: '#888888',
    fontWeight: 400,
  },
  problemsSection: {
    margin: '0 0 24px',
    padding: '16px',
    backgroundColor: '#fef8f8',
    border: '1px solid #f0d0d0',
    borderRadius: 4,
  },
  problemList: {
    margin: 0,
    paddingLeft: 20,
  },
  problemItem: {
    fontSize: 14,
    lineHeight: 1.7,
    color: '#555555',
    marginBottom: 4,
  },
  angleSection: {
    margin: '0 0 24px',
    padding: '16px',
    backgroundColor: '#f5f9f5',
    border: '1px solid #d0e0d0',
    borderRadius: 4,
  },
  angleText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.7,
    color: '#333333',
  },
  buttonsSection: {
    textAlign: 'center' as const,
    padding: '16px 0 24px',
  },
  primaryButton: {
    display: 'inline-block',
    padding: '14px 32px',
    backgroundColor: '#7A1F2B',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 700,
    textDecoration: 'none',
    borderRadius: 4,
    marginRight: 8,
    letterSpacing: '0.02em',
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '14px 24px',
    backgroundColor: '#ffffff',
    color: '#111111',
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: 4,
    border: '1px solid #111111',
    letterSpacing: '0.02em',
  },
  footer: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: 20,
    marginTop: 4,
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
};

export default NewAuditLeadEmail;
