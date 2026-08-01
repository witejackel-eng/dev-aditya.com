'use client';

interface AuditLimitationsProps {
  limitations?: string[];
}

export default function AuditLimitations({ limitations }: AuditLimitationsProps) {
  return (
    <div className="bg-bg-surface-2 border border-border p-5 md:p-6">
      {limitations && limitations.length > 0 && limitations[0] !== 'All analysis modules completed successfully.' && (
        <ul className="text-xs text-text-muted leading-relaxed mb-3 list-disc pl-4">
          {limitations.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
      <p className="text-xs text-text-muted leading-relaxed">
        This report reviews one publicly accessible page using automated technical checks and clearly labelled heuristics. It is not a penetration test, a complete accessibility certification, a legal compliance review or a guarantee of search rankings or conversion results.
      </p>
    </div>
  );
}
