/**
 * Email template for the /contact enquiry form.
 *
 * Sent to the site owner (CONTACT_TO_EMAIL) whenever a visitor submits
 * the "Discuss a Project" form. Reply-To is set to the visitor's own
 * address so replying in the inbox goes straight back to them.
 *
 * Brand styling matches NewAuditLeadEmail.tsx:
 *  – Off-white background: #FAFAF7
 *  – White content panel, black border
 *  – Maroon accents: #7A1F2B
 *  – Inline styles only — no Tailwind classes.
 */

export interface ContactEnquiryEmailProps {
  name: string;
  email: string;
  company: string;
  website: string;
  projectType: string;
  scope: string;
  timing: string;
  details: string;
  submittedAt: string;
  sourcePage: string;
}

/** Subject line. Omits the company suffix when none was provided. */
export function CONTACT_ENQUIRY_EMAIL_SUBJECT(name: string, company: string): string {
  return company ? `New website enquiry from ${name} — ${company}` : `New website enquiry from ${name}`;
}

/** Plain-text counterpart, sent alongside the HTML body. */
export function contactEnquiryEmailText(props: ContactEnquiryEmailProps): string {
  const { name, email, company, website, projectType, scope, timing, details, submittedAt, sourcePage } = props;
  return [
    'New website enquiry',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || '—'}`,
    `Current website: ${website || '—'}`,
    `Project type: ${projectType || '—'}`,
    `Approximate scope: ${scope || '—'}`,
    `Target launch timing: ${timing || '—'}`,
    '',
    'Project details:',
    details,
    '',
    `Submitted: ${submittedAt}`,
    `Source page: ${sourcePage}`,
  ].join('\n');
}

const fieldRows: Array<{ label: string; key: keyof ContactEnquiryEmailProps }> = [
  { label: 'Company', key: 'company' },
  { label: 'Current website', key: 'website' },
  { label: 'Project type', key: 'projectType' },
  { label: 'Approximate scope', key: 'scope' },
  { label: 'Target launch timing', key: 'timing' },
];

export function ContactEnquiryEmail(props: ContactEnquiryEmailProps) {
  const { name, email, details, submittedAt, sourcePage } = props;

  return (
    <div style={styles.outer}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>New Website Enquiry</h1>
          <p style={styles.headerSubtitle}>{name}</p>
        </div>

        <div style={styles.body}>
          <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td style={styles.infoLabelCell}>Name</td>
                <td style={styles.infoValueCell}>{name}</td>
              </tr>
              <tr>
                <td style={styles.infoLabelCell}>Email</td>
                <td style={styles.infoValueCell}>
                  <a href={`mailto:${email}`} style={styles.emailLink}>{email}</a>
                </td>
              </tr>
              {fieldRows.map(({ label, key }) => {
                const value = props[key];
                if (!value) return null;
                return (
                  <tr key={key}>
                    <td style={styles.infoLabelCell}>{label}</td>
                    <td style={styles.infoValueCell}>{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={styles.detailsSection}>
            <h2 style={styles.sectionTitle}>Project details</h2>
            <p style={styles.detailsText}>{details}</p>
          </div>

          <div style={styles.footer}>
            <p style={styles.footerText}>Reply-To is set to {email} — replying goes straight to them.</p>
            <p style={styles.footerText}>Submitted: {submittedAt}</p>
            <p style={styles.footerText}>Source page: {sourcePage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    backgroundColor: '#7A1F2B',
    color: '#ffffff',
    padding: '28px 40px',
  },
  headerTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  headerSubtitle: {
    margin: '8px 0 0',
    fontSize: 15,
    fontWeight: 400,
    opacity: 0.9,
  },
  body: {
    padding: '32px 40px',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    margin: '0 0 10px',
    color: '#111111',
  },
  infoTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: 24,
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
  detailsSection: {
    margin: '0 0 24px',
    padding: '16px',
    backgroundColor: '#faf5f5',
    border: '1px solid #f0d0d0',
    borderRadius: 4,
  },
  detailsText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.7,
    color: '#333333',
    whiteSpace: 'pre-wrap' as const,
  },
  footer: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: 16,
  },
  footerText: {
    margin: '0 0 6px',
    fontSize: 12,
    color: '#888888',
  },
};

export default ContactEnquiryEmail;
