/**
 * API Data Transfer Objects for the Website Revenue Audit Funnel.
 *
 * These types define the exact shape of data returned by API routes.
 * The GET /api/audits/[auditId] route returns either PublicAuditDto
 * (before unlock) or FullAuditDto (after unlock), distinguished by
 * the isUnlocked field.
 *
 * CRITICAL: The /run endpoint returns ONLY { auditId, status } for
 * completed/partial audits — never the full report data.
 */

import type { AuditStatus, AuditFinding, TechnologyDetection, AuditReportData } from './types';

// ──────────────────────────────────────────────────────────────
// Coverage DTO
// ──────────────────────────────────────────────────────────────

export interface AuditCoverageDto {
  /** Number of completed modules (0–6). */
  completed: number;
  /** Total number of modules. Always 6. */
  total: 6;
  /** Per-module completion flags. */
  modules: {
    performance: boolean;
    html: boolean;
    seo: boolean;
    security: boolean;
    technology: boolean;
    conversion: boolean;
  };
}

// ──────────────────────────────────────────────────────────────
// Base status DTO (shared by public and full)
// ──────────────────────────────────────────────────────────────

export interface AuditStatusDto {
  id: string;
  status: AuditStatus;
  hostname: string;
  normalizedUrl: string;
  createdAt: string;
  completedAt: string | null;
  safeErrorMessage: string | null;
  cacheHit: boolean;
  coverage: AuditCoverageDto;
}

// ──────────────────────────────────────────────────────────────
// Public technology (no evidence field)
// ──────────────────────────────────────────────────────────────

export interface PublicTechnologyDetection {
  name: string;
  category: string;
  confidence: number;
}

// ──────────────────────────────────────────────────────────────
// Public PageSpeed summary
// ──────────────────────────────────────────────────────────────

export interface PublicPageSpeedMetric {
  performanceScore: number | null;
  lcp: number | null;
  fcp: number | null;
  cls: number | null;
  tbt: number | null;
  si: number | null;
  inp: number | null;
}

export interface PublicPageSpeedSummary {
  mobile: PublicPageSpeedMetric | null;
  desktop: PublicPageSpeedMetric | null;
}

// ──────────────────────────────────────────────────────────────
// Public audit DTO — returned before unlock
// ──────────────────────────────────────────────────────────────

export interface PublicAuditDto extends AuditStatusDto {
  isUnlocked: false;
  overallScore: number | null;
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesSecurityScore: number | null;
  mobileReadinessScore: number | null;
  conversionReadinessScore: number | null;
  /** Preview findings only (no evidence for locked items). */
  publicFindings: AuditFinding[];
  /** Positive findings visible to all. */
  positiveFindings: AuditFinding[];
  /** Technologies without evidence. */
  technologies: PublicTechnologyDetection[];
  /** PageSpeed summary without raw data. */
  pageSpeedSummary: PublicPageSpeedSummary | null;
  totalFindingCount: number;
  freeFindingCount: number;
  limitations: string[];
}

// ──────────────────────────────────────────────────────────────
// Full audit DTO — returned after unlock
// ──────────────────────────────────────────────────────────────

export interface FullAuditDto extends AuditStatusDto {
  isUnlocked: true;
  overallScore: number | null;
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesSecurityScore: number | null;
  mobileReadinessScore: number | null;
  conversionReadinessScore: number | null;
  /** All findings with full evidence. */
  publicFindings: AuditFinding[];
  positiveFindings: AuditFinding[];
  /** Technologies with evidence. */
  technologies: TechnologyDetection[];
  pageSpeedSummary: PublicPageSpeedSummary | null;
  totalFindingCount: number;
  freeFindingCount: number;
  limitations: string[];
  /** Full report data — only present when unlocked. */
  reportData: AuditReportData;
}

// ──────────────────────────────────────────────────────────────
// Union type for convenience
// ──────────────────────────────────────────────────────────────

export type AuditDto = PublicAuditDto | FullAuditDto;

// ──────────────────────────────────────────────────────────────
// Unlock response DTO
// ──────────────────────────────────────────────────────────────

export interface UnlockResponseDto {
  success: true;
  emailSent: boolean;
  emailMessage?: string;
}

// ──────────────────────────────────────────────────────────────
// Run response DTO — minimal, no report data
// ──────────────────────────────────────────────────────────────

export interface RunResponseDto {
  auditId: string;
  status: AuditStatus;
}

export interface RunErrorResponseDto {
  auditId: string;
  status: 'failed';
  error: string;
}

// ──────────────────────────────────────────────────────────────
// Create audit response DTO
// ──────────────────────────────────────────────────────────────

export interface CreateAuditResponseDto {
  auditId: string;
  reportPath: string;
}
