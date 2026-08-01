/**
 * Generate recommendations from findings for the Website Revenue Audit Funnel.
 *
 * Categorizes findings into:
 *   - Quick wins (effort 1-2)
 *   - Technical improvements (effort 3)
 *   - Design & conversion (conversion category + effort 4-5)
 *
 * Generates a nextAction verdict based on transparent rules:
 *   - "No major rebuild indicated" — mostly good scores
 *   - "Optimization recommended" — some poor categories
 *   - "Focused redesign recommended" — several poor categories + structural issues
 *   - "Full website rebuild may be appropriate" — multiple poor categories +
 *     several high-impact structural findings
 *
 * Does NOT recommend rebuild merely to sell a larger project.
 */

import type { AuditFinding } from './types';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface RecommendationSet {
  quickWins: AuditFinding[];
  technicalImprovements: AuditFinding[];
  designConversion: AuditFinding[];
  nextAction: NextActionVerdict;
}

export type NextActionVerdict =
  | 'No major rebuild indicated'
  | 'Optimization recommended'
  | 'Focused redesign recommended'
  | 'Full website rebuild may be appropriate';

// ──────────────────────────────────────────────────────────────
// Next action determination
// ──────────────────────────────────────────────────────────────

/**
 * Determine the next-action verdict based on scores and findings.
 *
 * Rules (transparent and deterministic):
 *
 * "No major rebuild indicated":
 *   - All category scores >= 60
 *   - Fewer than 3 high/critical findings
 *
 * "Optimization recommended":
 *   - 1-2 category scores < 60
 *   - OR 3-5 high/critical findings
 *   - No more than 1 category < 40
 *
 * "Focused redesign recommended":
 *   - 3+ category scores < 60
 *   - OR 2+ categories < 40
 *   - OR 6+ high/critical findings with structural issues
 *   - Not qualifying for full rebuild
 *
 * "Full website rebuild may be appropriate":
 *   - 4+ category scores < 40
 *   - AND 5+ high-impact (impact 4-5) structural findings
 *   - AND performance < 25 AND seo < 40 AND mobile < 30
 *   - This requires genuinely poor results across the board — not just
 *     mediocre scores that could be improved with targeted fixes.
 */
function determineNextAction(
  scores: Record<string, number>,
  findings: AuditFinding[],
): NextActionVerdict {
  const categoryScores = [
    scores.performance ?? 100,
    scores.seo ?? 100,
    scores.accessibility ?? 100,
    scores.bestPracticesSecurity ?? 100,
    scores.mobileReadiness ?? 100,
    scores.conversionReadiness ?? 100,
  ];

  const below60 = categoryScores.filter((s) => s < 60).length;
  const below40 = categoryScores.filter((s) => s < 40).length;
  const highCriticalFindings = findings.filter(
    (f) => f.severity === 'high' || f.severity === 'critical',
  ).length;
  const highImpactStructural = findings.filter(
    (f) => (f.impact >= 4) &&
      (f.category === 'seo' || f.category === 'performance' || f.category === 'conversion') &&
      (f.severity === 'high' || f.severity === 'critical'),
  ).length;

  // "Full website rebuild may be appropriate" — very strict criteria
  // This should only trigger for genuinely broken sites, not just
  // sites that could use improvement.
  if (
    below40 >= 4 &&
    highImpactStructural >= 5 &&
    (scores.performance ?? 100) < 25 &&
    (scores.seo ?? 100) < 40 &&
    (scores.mobileReadiness ?? 100) < 30
  ) {
    return 'Full website rebuild may be appropriate';
  }

  // "Focused redesign recommended"
  if (
    below60 >= 3 ||
    below40 >= 2 ||
    (highCriticalFindings >= 6 && highImpactStructural >= 3)
  ) {
    return 'Focused redesign recommended';
  }

  // "Optimization recommended"
  if (below60 >= 1 || highCriticalFindings >= 3 || below40 >= 1) {
    return 'Optimization recommended';
  }

  // "No major rebuild indicated"
  return 'No major rebuild indicated';
}

// ──────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────

/**
 * Generate categorized recommendations from findings and scores.
 *
 * @param findings - The audit findings (already sorted by priority)
 * @param scores - Category scores (0-100)
 * @returns Categorized recommendations with a next-action verdict
 */
export function generateRecommendations(
  findings: AuditFinding[],
  scores: Record<string, number>,
): RecommendationSet {
  // ── Categorize findings ──

  // Quick wins: effort 1-2, any category
  const quickWins = findings.filter(
    (f) => f.effort <= 2 && f.severity !== 'positive',
  );

  // Technical improvements: effort 3, non-conversion categories
  const technicalImprovements = findings.filter(
    (f) => f.effort === 3 &&
      f.category !== 'conversion' &&
      f.severity !== 'positive',
  );

  // Design & conversion: conversion category items + effort 4-5 items
  const designConversion = findings.filter(
    (f) =>
      (f.category === 'conversion' && f.severity !== 'positive') ||
      (f.effort >= 4 && f.severity !== 'positive'),
  );

  // ── Cap each category to avoid overwhelming the user ──
  const cappedQuickWins = quickWins.slice(0, 5);
  const cappedTechnical = technicalImprovements.slice(0, 4);
  const cappedDesign = designConversion.slice(0, 4);

  // ── Determine next action ──
  const nextAction = determineNextAction(scores, findings);

  return {
    quickWins: cappedQuickWins,
    technicalImprovements: cappedTechnical,
    designConversion: cappedDesign,
    nextAction,
  };
}
