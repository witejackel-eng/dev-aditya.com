'use client';

import { motion } from 'framer-motion';
import type { PublicPageSpeedSummary } from '@/lib/audit/dto';

interface CoreWebVitalsTableProps {
  pageSpeedSummary: PublicPageSpeedSummary;
}

interface MetricDisplay {
  label: string;
  mobile: { value: string | null; rating: 'good' | 'needs-improvement' | 'poor' | 'unknown' };
  desktop: { value: string | null; rating: 'good' | 'needs-improvement' | 'poor' | 'unknown' };
}

function formatMs(ms: number | null): string | null {
  if (ms === null) return null;
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function formatCls(cls: number | null): string | null {
  if (cls === null) return null;
  return cls.toFixed(3);
}

function getLcpRating(ms: number | null): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
  if (ms === null) return 'unknown';
  if (ms <= 2500) return 'good';
  if (ms <= 4000) return 'needs-improvement';
  return 'poor';
}

function getClsRating(cls: number | null): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
  if (cls === null) return 'unknown';
  if (cls <= 0.1) return 'good';
  if (cls <= 0.25) return 'needs-improvement';
  return 'poor';
}

function getTbtRating(ms: number | null): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
  if (ms === null) return 'unknown';
  if (ms <= 200) return 'good';
  if (ms <= 600) return 'needs-improvement';
  return 'poor';
}

function getFcpRating(ms: number | null): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
  if (ms === null) return 'unknown';
  if (ms <= 1800) return 'good';
  if (ms <= 3000) return 'needs-improvement';
  return 'poor';
}

function getSiRating(ms: number | null): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
  if (ms === null) return 'unknown';
  if (ms <= 3400) return 'good';
  if (ms <= 5800) return 'needs-improvement';
  return 'poor';
}

function getInpRating(ms: number | null): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
  if (ms === null) return 'unknown';
  if (ms <= 200) return 'good';
  if (ms <= 500) return 'needs-improvement';
  return 'poor';
}

function getRatingBadgeClass(rating: 'good' | 'needs-improvement' | 'poor' | 'unknown'): string {
  switch (rating) {
    case 'good': return 'bg-green-700 text-white';
    case 'needs-improvement': return 'bg-maroon-light text-white';
    case 'poor': return 'bg-maroon text-white';
    default: return 'bg-bg-surface-2 text-text-muted';
  }
}

function formatRating(rating: 'good' | 'needs-improvement' | 'poor' | 'unknown'): string {
  switch (rating) {
    case 'good': return 'GOOD';
    case 'needs-improvement': return 'NEEDS WORK';
    case 'poor': return 'POOR';
    default: return '—';
  }
}

function getMetricValueAndRating(
  metric: 'lcp' | 'cls' | 'tbt' | 'fcp' | 'si' | 'inp',
  value: number | null,
): { value: string | null; rating: 'good' | 'needs-improvement' | 'poor' | 'unknown' } {
  if (value === null) return { value: null, rating: 'unknown' };

  switch (metric) {
    case 'lcp': return { value: formatMs(value), rating: getLcpRating(value) };
    case 'cls': return { value: formatCls(value), rating: getClsRating(value) };
    case 'tbt': return { value: formatMs(value), rating: getTbtRating(value) };
    case 'fcp': return { value: formatMs(value), rating: getFcpRating(value) };
    case 'si': return { value: formatMs(value), rating: getSiRating(value) };
    case 'inp': return { value: formatMs(value), rating: getInpRating(value) };
  }
}

export default function CoreWebVitalsTable({ pageSpeedSummary }: CoreWebVitalsTableProps) {
  const hasMobile = pageSpeedSummary.mobile !== null;
  const hasDesktop = pageSpeedSummary.desktop !== null;

  if (!hasMobile && !hasDesktop) {
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

  const metrics: MetricDisplay[] = [
    {
      label: 'LARGEST CONTENTFUL PAINT',
      mobile: getMetricValueAndRating('lcp', pageSpeedSummary.mobile?.lcp ?? null),
      desktop: getMetricValueAndRating('lcp', pageSpeedSummary.desktop?.lcp ?? null),
    },
    {
      label: 'FIRST CONTENTFUL PAINT',
      mobile: getMetricValueAndRating('fcp', pageSpeedSummary.mobile?.fcp ?? null),
      desktop: getMetricValueAndRating('fcp', pageSpeedSummary.desktop?.fcp ?? null),
    },
    {
      label: 'CUMULATIVE LAYOUT SHIFT',
      mobile: getMetricValueAndRating('cls', pageSpeedSummary.mobile?.cls ?? null),
      desktop: getMetricValueAndRating('cls', pageSpeedSummary.desktop?.cls ?? null),
    },
    {
      label: 'TOTAL BLOCKING TIME',
      mobile: getMetricValueAndRating('tbt', pageSpeedSummary.mobile?.tbt ?? null),
      desktop: getMetricValueAndRating('tbt', pageSpeedSummary.desktop?.tbt ?? null),
    },
    {
      label: 'SPEED INDEX',
      mobile: getMetricValueAndRating('si', pageSpeedSummary.mobile?.si ?? null),
      desktop: getMetricValueAndRating('si', pageSpeedSummary.desktop?.si ?? null),
    },
    {
      label: 'INTERACTION TO NEXT PAINT',
      mobile: getMetricValueAndRating('inp', pageSpeedSummary.mobile?.inp ?? null),
      desktop: getMetricValueAndRating('inp', pageSpeedSummary.desktop?.inp ?? null),
    },
  ];

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
        LAB DATA FROM LIGHTHOUSE
      </p>

      <div className="bg-bg-surface border border-border-hard overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" role="table">
            <thead>
              <tr className="border-b border-border-hard">
                <th scope="col" className="px-4 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted font-medium">
                  METRIC
                </th>
                {hasMobile && (
                  <th scope="col" className="px-4 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted font-medium text-center">
                    MOBILE
                  </th>
                )}
                {hasDesktop && (
                  <th scope="col" className="px-4 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted font-medium text-center">
                    DESKTOP
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, i) => (
                <tr key={metric.label} className={i < metrics.length - 1 ? 'border-b border-border' : ''}>
                  <td className="px-4 py-3 text-sm text-text-primary font-[family-name:var(--font-sans)]">
                    {metric.label}
                  </td>
                  {hasMobile && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm text-text-primary font-[family-name:var(--font-mono)]">
                          {metric.mobile.value ?? 'N/A'}
                        </span>
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-bold ${getRatingBadgeClass(metric.mobile.rating)}`}>
                          {formatRating(metric.mobile.rating)}
                        </span>
                      </div>
                    </td>
                  )}
                  {hasDesktop && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm text-text-primary font-[family-name:var(--font-mono)]">
                          {metric.desktop.value ?? 'N/A'}
                        </span>
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-bold ${getRatingBadgeClass(metric.desktop.rating)}`}>
                          {formatRating(metric.desktop.rating)}
                        </span>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-user data note */}
      <div className="mt-8">
        <h3 className="text-lg font-bold uppercase tracking-tight text-text-primary mb-3">
          REAL-USER DATA.
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          {!hasMobile && !hasDesktop
            ? 'Insufficient field data is available for this page.'
            : 'Not enough public real-user data is available for this page.'}
        </p>
      </div>
    </motion.div>
  );
}
