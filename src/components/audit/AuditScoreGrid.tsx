'use client';

import { motion } from 'framer-motion';
import { getScoreLabel } from '@/lib/audit/constants';

interface AuditScoreGridProps {
  scores: {
    performance: number | null;
    seo: number | null;
    accessibility: number | null;
    bestPracticesSecurity: number | null;
    mobileReadiness: number | null;
    conversionReadiness: number | null;
  };
}

interface CategoryDef {
  key: keyof AuditScoreGridProps['scores'];
  title: string;
  explanation: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    key: 'performance',
    title: 'PERFORMANCE',
    explanation: 'Page load speed, core web vitals and rendering efficiency.',
  },
  {
    key: 'seo',
    title: 'SEO FOUNDATION',
    explanation: 'Technical SEO signals that affect search visibility.',
  },
  {
    key: 'accessibility',
    title: 'ACCESSIBILITY',
    explanation: 'How usable the page is for people with disabilities.',
  },
  {
    key: 'bestPracticesSecurity',
    title: 'BEST PRACTICES & SECURITY',
    explanation: 'Security headers, HTTPS and modern web standards.',
  },
  {
    key: 'mobileReadiness',
    title: 'MOBILE READINESS',
    explanation: 'Mobile performance, viewport and touch usability.',
  },
  {
    key: 'conversionReadiness',
    title: 'CONVERSION READINESS',
    explanation: 'Trust signals, CTAs and contact visibility.',
  },
];

function getBarColor(score: number): string {
  if (score >= 90) return 'bg-green-700';
  if (score >= 75) return 'bg-text-primary';
  if (score >= 60) return 'bg-maroon-light';
  if (score >= 40) return 'bg-maroon';
  return 'bg-maroon-dark';
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function AuditScoreGrid({ scores }: AuditScoreGridProps) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-6">
        CATEGORY SCORES.
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {CATEGORIES.map((cat) => {
          const score = scores[cat.key];
          const displayScore = score ?? 0;
          const label = getScoreLabel(score);
          const barColor = getBarColor(displayScore);

          return (
            <motion.div
              key={cat.key}
              variants={cardVariants}
              className="bg-bg-surface border border-border-hard p-5"
            >
              {/* Title */}
              <h3 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-3">
                {cat.title}
              </h3>

              {/* Score + Label */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className={`text-3xl font-bold font-[family-name:var(--font-sans)] ${score == null ? 'text-text-muted' : ''}`}>
                  {score ?? 'N/A'}
                </span>
                <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted">
                  /100
                </span>
              </div>

              <p className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-maroon mb-3">
                {label}
              </p>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-bg-surface-2 mb-3" role="progressbar" aria-valuenow={displayScore} aria-valuemin={0} aria-valuemax={100} aria-label={`${cat.title}: ${score ?? 'Not available'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: score != null ? `${displayScore}%` : '0%' }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                  className={`h-full ${barColor}`}
                />
              </div>

              {/* Screen reader text */}
              <p className="sr-only">
                {cat.title}: {score ?? 'Not available'} out of 100. {label}.
              </p>

              {/* Explanation */}
              <p className="text-xs text-text-muted leading-relaxed">
                {cat.explanation}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
