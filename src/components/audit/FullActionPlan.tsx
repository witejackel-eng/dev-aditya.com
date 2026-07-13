'use client';

import { motion } from 'framer-motion';
import type { AuditFinding } from '@/lib/audit/types';

interface FullActionPlanProps {
  quickWins: AuditFinding[];
  technicalImprovements: AuditFinding[];
  designConversion: AuditFinding[];
  nextAction: string;
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

function FindingItem({ finding, index, isHeuristic }: { finding: AuditFinding; index: number; isHeuristic?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      className="border-b border-border last:border-b-0 py-4 first:pt-0 last:pb-0"
    >
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium text-text-muted bg-bg-surface-2 px-2 py-0.5">
          {getCategoryLabel(finding.category)}
        </span>
        <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium text-maroon-light">
          {getEffortLabel(finding.effort)}
        </span>
        {isHeuristic && (
          <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium text-text-muted italic">
            HEURISTIC
          </span>
        )}
      </div>

      <h4 className="text-sm font-bold text-text-primary font-[family-name:var(--font-sans)] mb-1">
        {finding.title}
      </h4>

      <p className="text-xs text-text-muted leading-relaxed">
        {finding.recommendation}
      </p>
    </motion.div>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function FullActionPlan({ quickWins, technicalImprovements, designConversion, nextAction }: FullActionPlanProps) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-6">
        COMPLETE ACTION PLAN.
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="space-y-8"
      >
        {/* Quick Wins */}
        {quickWins.length > 0 && (
          <motion.section variants={sectionVariants} className="bg-bg-surface border border-border-hard p-5 md:p-6">
            <h3 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-maroon mb-4">
              QUICK WINS
            </h3>
            <div>
              {quickWins.map((finding, i) => (
                <FindingItem key={finding.id} finding={finding} index={i} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Technical Improvements */}
        {technicalImprovements.length > 0 && (
          <motion.section variants={sectionVariants} className="bg-bg-surface border border-border-hard p-5 md:p-6">
            <h3 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-maroon mb-4">
              TECHNICAL IMPROVEMENTS
            </h3>
            <div>
              {technicalImprovements.map((finding, i) => (
                <FindingItem key={finding.id} finding={finding} index={i} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Design & Conversion Improvements */}
        {designConversion.length > 0 && (
          <motion.section variants={sectionVariants} className="bg-bg-surface border border-border-hard p-5 md:p-6">
            <h3 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-maroon mb-1">
              DESIGN & CONVERSION IMPROVEMENTS
            </h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              These findings are based on heuristic analysis of publicly visible page elements and common conversion patterns.
            </p>
            <div>
              {designConversion.map((finding, i) => (
                <FindingItem key={finding.id} finding={finding} index={i} isHeuristic />
              ))}
            </div>
          </motion.section>
        )}

        {/* Next Action */}
        {nextAction && (
          <motion.section variants={sectionVariants} className="bg-maroon-soft border border-maroon/20 p-5 md:p-6">
            <h3 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-maroon mb-2">
              RECOMMENDED NEXT ACTION
            </h3>
            <p className="text-sm text-text-primary leading-relaxed">
              {nextAction}
            </p>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
