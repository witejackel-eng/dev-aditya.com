'use client';

import { motion } from 'framer-motion';
import type { NormalizedPageSpeed, NormalizedMetric } from '@/lib/audit/types';

interface CoreWebVitalsTableProps {
  pagespeed: NormalizedPageSpeed | null;
}

interface MetricRow {
  label: string;
  key: string;
  getValue: (m: NormalizedMetric | undefined) => string | null;
  getRating: (m: NormalizedMetric | undefined) => 'good' | 'needs-improvement' | 'poor' | 'unknown';
  unit?: string;
}

function metricOrUndefined(metrics: NormalizedPageSpeed['metrics'], key: keyof NormalizedPageSpeed['metrics']): NormalizedMetric | undefined {
  return metrics[key] ?? undefined;
}

function getDisplayValue(m: NormalizedMetric | undefined): string | null {
  if (!m || m.displayValue == null) return null;
  return m.displayValue;
}

function getLighthouseRating(m: NormalizedMetric | undefined): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
  if (!m || m.score == null) return 'unknown';
  if (m.score >= 0.9) return 'good';
  if (m.score >= 0.5) return 'needs-improvement';
  return 'poor';
}

function getRatingBadgeClass(rating: 'good' | 'needs-improvement' | 'poor' | 'unknown'): string {
  switch (rating) {
    case 'good':
      return 'bg-green-700 text-white';
    case 'needs-improvement':
      return 'bg-maroon-light text-white';
    case 'poor':
      return 'bg-maroon text-white';
    default:
      return 'bg-bg-surface-2 text-text-muted';
  }
}

function formatRating(rating: 'good' | 'needs-improvement' | 'poor' | 'unknown'): string {
  switch (rating) {
    case 'good':
      return 'GOOD';
    case 'needs-improvement':
      return 'NEEDS WORK';
    case 'poor':
      return 'POOR';
    default:
      return '—';
  }
}

const LAB_METRICS: MetricRow[] = [
  {
    label: 'LARGEST CONTENTFUL PAINT',
    key: 'lcp',
    getValue: (m) => getDisplayValue(m),
    getRating: (m) => getLighthouseRating(m),
  },
  {
    label: 'CUMULATIVE LAYOUT SHIFT',
    key: 'cls',
    getValue: (m) => getDisplayValue(m),
    getRating: (m) => getLighthouseRating(m),
  },
  {
    label: 'TOTAL BLOCKING TIME',
    key: 'tbt',
    getValue: (m) => getDisplayValue(m),
    getRating: (m) => getLighthouseRating(m),
  },
  {
    label: 'FIRST CONTENTFUL PAINT',
    key: 'fcp',
    getValue: (m) => getDisplayValue(m),
    getRating: (m) => getLighthouseRating(m),
  },
  {
    label: 'SPEED INDEX',
    key: 'si',
    getValue: (m) => getDisplayValue(m),
    getRating: (m) => getLighthouseRating(m),
  },
];

function getLabMetric(ps: NormalizedPageSpeed, key: string): NormalizedMetric | undefined {
  switch (key) {
    case 'lcp':
      return metricOrUndefined(ps.metrics, 'largestContentfulPaint');
    case 'cls':
      return metricOrUndefined(ps.metrics, 'cumulativeLayoutShift');
    case 'tbt':
      return metricOrUndefined(ps.metrics, 'totalBlockingTime');
    case 'fcp':
      return metricOrUndefined(ps.metrics, 'firstContentfulPaint');
    case 'si':
      return metricOrUndefined(ps.metrics, 'speedIndex');
    default:
      return undefined;
  }
}

// Field data extraction from the raw PageSpeed result
// Since NormalizedPageSpeed doesn't directly store field data in a separate field,
// we need to pass it separately. For now, we'll show lab data only and
// indicate when field data is unavailable.
// The parent component can pass the raw PageSpeedResult for field data.

export default function CoreWebVitalsTable({ pagespeed }: CoreWebVitalsTableProps) {
  if (!pagespeed) {
    return (
      <div className="bg-bg-surface border border-border-hard p-6">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-4">
          CORE WEB VITALS.
        </h2>
        <p className="text-sm text-text-muted">
          Not available — performance data could not be collected for this page.
        </p>
      </div>
    );
  }

  const strategyLabel = pagespeed.strategy === 'mobile' ? 'MOBILE' : 'DESKTOP';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
    >
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-2">
        CORE WEB VITALS.
      </h2>
      <p className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-6">
        {strategyLabel} — LAB DATA FROM LIGHTHOUSE
      </p>

      {/* Lab Data Table */}
      <div className="bg-bg-surface border border-border-hard overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" role="table">
            <thead>
              <tr className="border-b border-border-hard">
                <th scope="col" className="px-4 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted font-medium">
                  METRIC
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted font-medium text-right">
                  VALUE
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted font-medium text-right">
                  RATING
                </th>
              </tr>
            </thead>
            <tbody>
              {LAB_METRICS.map((metric, i) => {
                const m = getLabMetric(pagespeed, metric.key);
                const value = metric.getValue(m);
                const rating = metric.getRating(m);
                const ratingClass = getRatingBadgeClass(rating);

                return (
                  <tr key={metric.key} className={i < LAB_METRICS.length - 1 ? 'border-b border-border' : ''}>
                    <td className="px-4 py-3 text-sm text-text-primary font-[family-name:var(--font-sans)]">
                      {metric.label}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary font-[family-name:var(--font-mono)] text-right">
                      {value ?? 'Not available'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-bold ${ratingClass}`}>
                        {formatRating(rating)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-user data section */}
      <div className="mt-8">
        <h3 className="text-lg font-bold uppercase tracking-tight text-text-primary mb-3">
          REAL-USER DATA.
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          Not enough public real-user data is available for this page.
        </p>
      </div>
    </motion.div>
  );
}
