'use client';

import { motion } from 'framer-motion';
import { getScoreLabel } from '@/lib/audit/constants';

interface AuditScoreHeroProps {
  score: number;
  label?: string;
  hostname: string;
  timestamp: string;
  coverage?: number;
}

function getScoreColorClass(score: number): string {
  if (score >= 90) return 'text-green-700';
  if (score >= 75) return 'text-text-primary';
  if (score >= 60) return 'text-maroon-light';
  if (score >= 40) return 'text-maroon';
  return 'text-maroon-dark';
}

function getLabelColorClass(score: number): string {
  if (score >= 90) return 'bg-green-700 text-white';
  if (score >= 75) return 'bg-text-primary text-bg-surface';
  if (score >= 60) return 'bg-maroon-soft text-maroon-light';
  if (score >= 40) return 'bg-maroon text-white';
  return 'bg-maroon-dark text-white';
}

export default function AuditScoreHero({ score, label, hostname, timestamp, coverage }: AuditScoreHeroProps) {
  const displayLabel = label || getScoreLabel(score);
  const scoreColor = getScoreColorClass(score);
  const labelColor = getLabelColorClass(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-bg-surface border border-border-hard shadow-hard p-6 md:p-8">
        {/* Metadata row */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted">
            WEBSITE AUDIT
          </span>
          <span className="text-xs font-[family-name:var(--font-mono)] text-text-muted">
            {hostname}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className={`text-7xl md:text-8xl font-bold font-[family-name:var(--font-sans)] leading-none ${scoreColor}`}>
            {score}
          </span>
          <span className="text-2xl md:text-3xl font-bold text-text-muted font-[family-name:var(--font-sans)]">
            /100
          </span>
        </div>

        {/* Label badge */}
        <div className="mb-6">
          <span className={`inline-block px-3 py-1 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest font-bold ${labelColor}`}>
            {displayLabel}
          </span>
        </div>

        {/* Timestamp + Coverage */}
        <div className="border-t border-border pt-4 space-y-1.5">
          <p className="text-xs font-[family-name:var(--font-mono)] text-text-muted">
            AUDITED — {new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
          </p>

          {coverage != null && coverage < 6 && (
            <p className="text-xs font-[family-name:var(--font-mono)] text-maroon-light">
              AUDIT COVERAGE — {coverage} OF 6 CHECKS COMPLETED
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
