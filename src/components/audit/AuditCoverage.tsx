'use client';

interface AuditCoverageProps {
  coverage: number;
  totalChecks: number;
}

export default function AuditCoverage({ coverage, totalChecks }: AuditCoverageProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted">
        AUDIT COVERAGE — {coverage} OF {totalChecks} CHECKS COMPLETED
      </span>
    </div>
  );
}
