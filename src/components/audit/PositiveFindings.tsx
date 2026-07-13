'use client';

import { motion } from 'framer-motion';
import type { AuditFinding } from '@/lib/audit/types';

interface PositiveFindingsProps {
  findings: AuditFinding[];
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

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function PositiveFindings({ findings }: PositiveFindingsProps) {
  const positives = findings.filter((f) => f.severity === 'positive' || f.severity === 'low');

  if (positives.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-6">
        WHAT IS ALREADY WORKING.
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {positives.map((finding) => (
          <motion.div
            key={finding.id}
            variants={cardVariants}
            className="bg-bg-surface border border-border-hard p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-5 h-5 bg-green-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0" aria-hidden="true">
                ✓
              </span>
              <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium text-text-muted">
                {getCategoryLabel(finding.category)}
              </span>
            </div>

            <h3 className="text-sm font-bold text-text-primary font-[family-name:var(--font-sans)] mb-1.5">
              {finding.title}
            </h3>

            <p className="text-xs text-text-muted leading-relaxed">
              {finding.summary}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
