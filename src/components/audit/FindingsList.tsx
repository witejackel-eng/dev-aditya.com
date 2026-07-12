'use client';

import { motion } from 'framer-motion';
import type { AuditFinding } from '@/lib/audit/types';

interface FindingsListProps {
  findings: AuditFinding[];
  limit?: number;
  heading?: string;
}

type ExtendedSeverity = AuditFinding['severity'];

function getSeverityBadgeClasses(severity: ExtendedSeverity): string {
  switch (severity) {
    case 'critical':
      return 'bg-maroon text-white';
    case 'high':
      return 'bg-maroon-light text-white';
    case 'medium':
      return 'bg-maroon-soft text-maroon';
    case 'low':
      return 'bg-bg-surface-2 text-text-muted';
    case 'positive':
      return 'bg-green-700 text-white';
    default:
      return 'bg-bg-surface-2 text-text-muted';
  }
}

function getSeverityLabel(severity: ExtendedSeverity): string {
  switch (severity) {
    case 'critical':
      return 'CRITICAL';
    case 'high':
      return 'HIGH';
    case 'medium':
      return 'MEDIUM';
    case 'low':
      return 'LOW';
    case 'positive':
      return 'POSITIVE';
    default:
      return (severity as string).toUpperCase();
  }
}

function getCategoryLabel(category: AuditFinding['category']): string {
  switch (category) {
    case 'performance':
      return 'PERFORMANCE';
    case 'seo':
      return 'SEO';
    case 'accessibility':
      return 'ACCESSIBILITY';
    case 'security':
      return 'SECURITY';
    case 'mobile':
      return 'MOBILE';
    case 'conversion':
      return 'CONVERSION';
    default:
      return (category as string).toUpperCase();
  }
}

function getEffortLabel(effort: number): string {
  switch (effort) {
    case 1:
      return 'QUICK FIX';
    case 2:
      return 'MODERATE WORK';
    case 3:
      return 'MODERATE WORK';
    case 4:
      return 'LARGER CHANGE';
    case 5:
      return 'REDESIGN-LEVEL';
    default:
      return 'MODERATE WORK';
  }
}

function getEffortBadgeClass(effort: number): string {
  switch (effort) {
    case 1:
      return 'bg-green-700/10 text-green-700';
    case 2:
    case 3:
      return 'bg-maroon-soft text-maroon-light';
    case 4:
    case 5:
      return 'bg-maroon/10 text-maroon';
    default:
      return 'bg-bg-surface-2 text-text-muted';
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function FindingsList({ findings, limit, heading = 'WHAT NEEDS ATTENTION.' }: FindingsListProps) {
  const displayFindings = limit ? findings.slice(0, limit) : findings;

  if (displayFindings.length === 0) {
    return (
      <div className="bg-bg-surface border border-border-hard p-6">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-3">
          {heading}
        </h2>
        <p className="text-sm text-text-muted">
          No issues were found in this area.
        </p>
      </div>
    );
  }

  const hasMore = limit && findings.length > limit;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-6">
        {heading}
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
        className="space-y-4"
      >
        {displayFindings.map((finding) => (
          <motion.article
            key={finding.id}
            variants={cardVariants}
            className="bg-bg-surface border border-border-hard p-5 md:p-6"
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-bold ${getSeverityBadgeClasses(finding.severity)}`}>
                {getSeverityLabel(finding.severity)}
              </span>
              <span className="inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium bg-bg-surface-2 text-text-muted">
                {getCategoryLabel(finding.category)}
              </span>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium ${getEffortBadgeClass(finding.effort)}`}>
                {getEffortLabel(finding.effort)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-text-primary font-[family-name:var(--font-sans)] mb-2">
              {finding.title}
            </h3>

            {/* Summary */}
            <p className="text-sm text-text-primary leading-relaxed mb-3">
              {finding.summary}
            </p>

            {/* Why it matters */}
            <p className="text-sm text-text-muted leading-relaxed mb-3">
              {finding.whyItMatters}
            </p>

            {/* Evidence */}
            {finding.evidence.length > 0 && (
              <div className="mb-3">
                <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-1.5 block">
                  EVIDENCE
                </span>
                <ul className="space-y-1">
                  {finding.evidence.map((ev, i) => (
                    <li key={i} className="text-xs text-text-muted font-[family-name:var(--font-mono)] pl-3 border-l-2 border-border">
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendation */}
            <div className="border-t border-border pt-3 mt-3">
              <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-1.5 block">
                RECOMMENDED FIX
              </span>
              <p className="text-sm text-text-primary leading-relaxed">
                {finding.recommendation}
              </p>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* More findings indicator */}
      {hasMore && (
        <div className="mt-6 p-4 bg-bg-surface-2 border border-border">
          <p className="text-sm text-text-muted">
            Showing {limit} of {findings.length} findings. Unlock the full report to see all findings and detailed recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
