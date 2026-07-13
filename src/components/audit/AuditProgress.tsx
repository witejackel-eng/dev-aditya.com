'use client';

import { motion } from 'framer-motion';
import type { AuditStatus } from '@/lib/audit/types';

interface AuditProgressProps {
  status: AuditStatus;
}

const STAGES = [
  { num: '01', label: 'Validating the website', statuses: ['validating'] as AuditStatus[] },
  { num: '02', label: 'Reviewing the public page', statuses: ['fetching'] as AuditStatus[] },
  { num: '03', label: 'Testing mobile and desktop performance', statuses: ['performance'] as AuditStatus[] },
  { num: '04', label: 'Checking SEO, accessibility and security signals', statuses: ['analyzing'] as AuditStatus[] },
  { num: '05', label: 'Prioritizing the findings', statuses: ['scoring'] as AuditStatus[] },
] as const;

function getStageState(stageIndex: number, currentStatus: AuditStatus): 'completed' | 'active' | 'waiting' {
  const stageStatuses = STAGES[stageIndex].statuses;

  // If completed or partial, all stages are done
  if (currentStatus === 'completed' || currentStatus === 'partial') {
    return 'completed';
  }

  // If failed, stages up to the failure point show completed, the rest waiting
  if (currentStatus === 'failed') {
    // We can't precisely know where it failed, so mark as waiting after current
    // A more accurate approach: check which stage the audit was in
    // For now, we'll infer based on the ordering
    const stageOrder: AuditStatus[] = ['queued', 'validating', 'fetching', 'performance', 'analyzing', 'scoring'];
    const currentIdx = stageOrder.indexOf(currentStatus);
    const statusForThisStage = stageStatuses[0];
    const thisStageIdx = stageOrder.indexOf(statusForThisStage);

    if (currentIdx < 0 || thisStageIdx < 0) return 'waiting';
    // Stages before the failure point that were completed
    // Since 'failed' means we don't know exactly where, we mark earlier stages as completed
    // Actually, for failed, let's show all as waiting and just show the failure state
    return 'waiting';
  }

  // Check if this stage is currently active
  if (stageStatuses.includes(currentStatus)) {
    return 'active';
  }

  // Determine if this stage is completed based on ordering
  const stageOrder: AuditStatus[] = ['queued', 'validating', 'fetching', 'performance', 'analyzing', 'scoring'];
  const currentStageIdx = stageOrder.indexOf(currentStatus);
  const thisStageStatusIdx = stageOrder.indexOf(stageStatuses[0]);

  if (currentStageIdx > thisStageStatusIdx) {
    return 'completed';
  }

  return 'waiting';
}

const stageVariants = {
  completed: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
  active: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
  waiting: {
    opacity: 0.4,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function AuditProgress({ status }: AuditProgressProps) {
  const isFailed = status === 'failed';

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-8">
        AUDIT IN PROGRESS.
      </h2>

      <div
        role="status"
        aria-live="polite"
        aria-label="Audit progress status"
        className="space-y-0"
      >
        {STAGES.map((stage, i) => {
          const state = isFailed ? 'waiting' : getStageState(i, status);

          return (
            <motion.div
              key={stage.num}
              variants={stageVariants}
              initial="waiting"
              animate={state}
              className="flex items-start gap-4 py-4 border-b border-border last:border-b-0"
            >
              {/* Number / Checkmark */}
              <div className="flex-shrink-0 w-10">
                {state === 'completed' ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
                    className="inline-flex items-center justify-center w-8 h-8 bg-maroon text-white text-xs font-bold"
                    aria-hidden="true"
                  >
                    ✓
                  </motion.span>
                ) : (
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 border text-xs font-[family-name:var(--font-mono)] font-bold ${
                      state === 'active'
                        ? 'border-maroon text-maroon bg-maroon-soft'
                        : 'border-border text-text-muted bg-bg-surface'
                    }`}
                    aria-hidden="true"
                  >
                    {stage.num}
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="flex-1 pt-1">
                <p
                  className={`text-sm font-[family-name:var(--font-sans)] leading-snug ${
                    state === 'active'
                      ? 'text-maroon font-medium'
                      : state === 'completed'
                        ? 'text-text-primary'
                        : 'text-text-muted'
                  }`}
                >
                  {stage.label}
                </p>
              </div>

              {/* Active indicator */}
              {state === 'active' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 pt-2"
                >
                  <span className="inline-block w-2 h-2 bg-maroon rounded-full animate-pulse" aria-hidden="true" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Failure message */}
      {isFailed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 bg-maroon-soft border border-maroon/30"
          role="alert"
        >
          <p className="text-sm text-maroon font-medium">
            The audit could not be completed. This may be due to the website being unreachable or temporarily unavailable. Please try again.
          </p>
        </motion.div>
      )}
    </div>
  );
}
