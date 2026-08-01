'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import { type Project, STATUS_LABELS } from '@/config/projects';

/* ──────────────── Large editorial flagship feature (IBS / Bharat) ──────────────── */

export function FlagshipFeature({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal id={project.slug} className="py-16 md:py-20 max-w-7xl mx-auto px-6 scroll-mt-[80px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Visual / cover panel */}
        <motion.div
          variants={fadeUp}
          className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <ProjectCover project={project} />
        </motion.div>

        {/* Narrative */}
        <div className={`lg:col-span-7 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
              {String(index).padStart(2, '0')} / Flagship
            </span>
            <span className="h-px w-10 bg-border" aria-hidden />
            <StatusBadge status={project.status} />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-3"
          >
            {project.proofRole}
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-[1.9rem] font-bold tracking-tight text-text-primary max-w-2xl leading-[1.15]"
          >
            {project.outcomeHeadline}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-text-muted text-base mt-5 max-w-xl leading-relaxed"
          >
            {project.context}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-6">
            {project.scope.split(',').slice(0, 4).map((s) => (
              <span
                key={s}
                className="border border-border px-2.5 py-1 text-[11px] text-text-muted font-[family-name:var(--font-mono)]"
              >
                {s.trim()}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              href={project.caseStudyUrl}
              className="bg-maroon text-white border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200"
            >
              View the transformation →
            </Link>
            <ProjectLinks project={project} />
          </motion.div>
        </div>
      </div>
    </Reveal>
  );
}

/* ──────────────── Paired flagship card (commerce / creative) ──────────────── */

export function FlagshipPair({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      variants={fadeUp}
      className="bg-white border border-border-hard shadow-hard-sm group relative overflow-hidden hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200 flex flex-col h-full"
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-maroon scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {/* Cover */}
      <div className="border-b border-border">
        <ProjectCover project={project} compact />
      </div>

      {/* Body */}
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-[0.12em] font-medium">
            {project.industry}
          </span>
          <StatusBadge status={project.status} />
        </div>

        <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted/70 uppercase tracking-[0.12em] mb-2">
          {project.proofRole}
        </p>

        <Link href={project.caseStudyUrl} className="block group/link">
          <h3 className="text-xl md:text-2xl font-bold text-text-primary group-hover/link:text-maroon transition-colors duration-200 leading-[1.15] tracking-tight">
            {project.outcomeHeadline}
          </h3>
        </Link>

        <p className="text-text-muted text-sm leading-[1.7] mt-3 flex-1">{project.challenge}</p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 pt-5 border-t border-border">
          <Link
            href={project.caseStudyUrl}
            className="text-[11px] text-maroon hover:underline font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] font-medium"
          >
            View the transformation →
          </Link>
          <ProjectLinks project={project} compact />
        </div>
      </div>
    </motion.article>
  );
}

/* ──────────────── Shared bits ──────────────── */

function StatusBadge({ status }: { status: Project['status'] }) {
  const styles: Record<Project['status'], string> = {
    business: 'border-maroon/30 bg-maroon-soft text-maroon',
    concept: 'border-accent/40 bg-bg-surface-2 text-text-muted',
    experiment: 'border-border bg-bg-surface-2 text-text-muted',
  };
  return (
    <span
      className={`border px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider ${styles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function ProjectLinks({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] text-text-muted hover:text-maroon transition-colors ${compact ? 'text-[10px]' : 'text-[11px]'}`}
        >
          Live ↗
        </a>
      ) : (
        <span className="font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] text-text-muted/40 text-[10px] border border-dashed border-border px-2 py-0.5">
          No live link
        </span>
      )}
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] text-text-muted hover:text-maroon transition-colors ${compact ? 'text-[10px]' : 'text-[11px]'}`}
      >
        Code ↗
      </a>
    </div>
  );
}

/* ──────────────── Designed project cover (honest CSS/SVG, no fake screenshots) ──────────────── */

function ProjectCover({ project, compact = false }: { project: Project; compact?: boolean }) {
  const height = compact ? 'h-40' : 'h-56 md:h-64';
  const bg =
    project.slug === 'ibs-infra' || project.slug === 'device-destination'
      ? 'bg-maroon text-white'
      : project.slug === 'bharat-electrosafe' || project.slug === 'dust-signal' || project.slug === 'aarohan-legal'
        ? 'bg-text-primary text-white'
        : project.slug === 'cloudsun' || project.slug === 'pricepilot'
          ? 'bg-[#B8732A] text-white'
          : 'bg-bg-surface-2 text-text-primary';

  return (
    <div
      className={`relative overflow-hidden border-b border-border-hard ${bg} ${height}`}
      aria-hidden="true"
    >
      <Motif slug={project.slug} />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <div>
          <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-70">
            {project.industry}
          </div>
          <div className="font-bold text-lg leading-tight">{project.name}</div>
        </div>
        <span className="font-[family-name:var(--font-mono)] text-xs opacity-50">
          {String(project.featuredRank).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

function Motif({ slug }: { slug: string }) {
  switch (slug) {
    case 'ibs-infra':
      return <TaxonomyMotif />;
    case 'bharat-electrosafe':
      return <GridCompareMotif />;
    case 'device-destination':
      return <CheckoutMotif />;
    case 'cloudsun':
      return <RoutesMotif />;
    case 'saffron-steam-experience':
      return <SteamMotif />;
    case 'aarohan-legal':
      return <RestraintMotif />;
    case 'casa-aurelia':
      return <EditorialLuxMotif />;
    case 'pricepilot':
      return <DataGridMotif />;
    case 'dust-signal':
      return <SignalMotif />;
    default:
      return null;
  }
}

function TaxonomyMotif() {
  const divisions = ['Comm', 'AV', 'Net', 'Fire', 'Sec', 'Call'];
  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-current opacity-80" />
        <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-70">Services taxonomy</span>
      </div>
      <div className="h-px w-full bg-current opacity-30" />
      <div className="grid grid-cols-6 gap-1.5">
        {divisions.map((d) => (
          <div key={d} className="flex flex-col gap-1">
            <div className="bg-current/85 px-1 py-0.5 text-[0.55rem] font-medium text-center">{d}</div>
            <div className="space-y-0.5">
              <div className="h-1 bg-current/40" />
              <div className="h-1 w-3/4 bg-current/40" />
              <div className="h-1 w-1/2 bg-current/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridCompareMotif() {
  const rows = ['Family', 'Rating', 'Cert.', 'Spec'];
  return (
    <div className="p-5">
      <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-70">Product comparison</div>
      <div className="mt-3 grid grid-cols-4 gap-0 border border-current/20 text-[0.55rem]">
        <div className="bg-current/15 p-1.5 font-medium">Attr</div>
        <div className="bg-current/10 p-1.5 font-medium">A</div>
        <div className="bg-current/10 p-1.5 font-medium">B</div>
        <div className="bg-current/10 p-1.5 font-medium">C</div>
        {rows.map((r) => (
          <div key={r} className="contents">
            <div className="border-t border-current/15 bg-current/15 p-1.5">{r}</div>
            <div className="border-t border-current/15 p-1.5 opacity-60">—</div>
            <div className="border-t border-current/15 p-1.5 opacity-60">—</div>
            <div className="border-t border-current/15 p-1.5 opacity-60">—</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutMotif() {
  const steps = ['Search', 'Compare', 'Cart', 'Pay', 'Verify', 'Invoice'];
  return (
    <div className="flex flex-col justify-center gap-3 p-5">
      <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-70">Checkout saga</div>
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div className="flex-1 bg-current/80 px-1 py-0.5 text-center text-[0.5rem] font-medium">{s}</div>
            {i < steps.length - 1 && <span className="h-0.5 w-1.5 bg-current opacity-50" />}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[0.55rem] opacity-60">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span>idempotent · reconcilable · webhook-safe</span>
      </div>
    </div>
  );
}

function RoutesMotif() {
  const routes = Array.from({ length: 24 });
  return (
    <div className="p-5">
      <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-70">24 routes · 3 roles</div>
      <div className="mt-3 grid grid-cols-8 gap-1">
        {routes.map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-current"
            style={{ opacity: 0.2 + ((i * 37) % 70) / 100 }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-1 text-[0.5rem] opacity-60">
        <span className="bg-current/80 px-1 py-0.5">agent</span>
        <span className="bg-current/50 px-1 py-0.5">sup</span>
        <span className="bg-current/30 px-1 py-0.5">admin</span>
      </div>
    </div>
  );
}

function SteamMotif() {
  return (
    <div className="relative p-5">
      <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-70">Atmosphere first</div>
      <svg viewBox="0 0 320 100" className="absolute inset-x-5 bottom-3 w-[calc(100%-2.5rem)]" preserveAspectRatio="none">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M 0 ${50 + i * 12} C 60 ${30 + i * 12}, 120 ${70 + i * 12}, 160 ${48 + i * 12} S 280 ${60 + i * 12}, 320 ${40 + i * 12}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity={0.65 - i * 0.12}
          />
        ))}
      </svg>
    </div>
  );
}

function RestraintMotif() {
  return (
    <div className="flex flex-col justify-center gap-2 p-5">
      <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-60">Practice areas</div>
      <div className="space-y-1 text-sm leading-tight opacity-90">
        <div>01 — Corporate &amp; commercial</div>
        <div>02 — Dispute resolution</div>
        <div>03 — Contracts &amp; advisory</div>
        <div className="opacity-40">04 — …</div>
      </div>
      <div className="mt-2 h-px w-2/3 bg-current opacity-40" />
    </div>
  );
}

function EditorialLuxMotif() {
  return (
    <div className="p-5">
      <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-70">Atelier — no portal</div>
      <div className="mt-3 grid grid-cols-5 gap-3">
        <div className="col-span-3 flex flex-col justify-end">
          <div className="text-2xl font-bold leading-none opacity-90">
            Casa<br />Aurelia
          </div>
        </div>
        <div className="col-span-2 space-y-1">
          <div className="h-14 bg-current opacity-80" />
          <div className="h-1 bg-current/40" />
          <div className="h-1 w-2/3 bg-current/40" />
        </div>
      </div>
    </div>
  );
}

function DataGridMotif() {
  return (
    <div className="p-5">
      <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-70">Decision support</div>
      <div className="mt-2 space-y-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="h-1.5 w-12 bg-current/50" />
            <div className="flex-1">
              <div className="h-1.5 bg-current" style={{ opacity: 0.2 + i * 0.15 }} />
            </div>
            <div className="h-1.5 w-6 bg-current/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalMotif() {
  return (
    <div className="relative p-5">
      <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest opacity-70">Generative signal</div>
      <svg viewBox="0 0 320 80" className="absolute inset-x-5 bottom-4 w-[calc(100%-2.5rem)]" preserveAspectRatio="none">
        <path
          d="M 0 40 L 20 40 L 24 20 L 28 60 L 32 40 L 60 40 L 64 10 L 68 70 L 72 40 L 110 40 L 114 25 L 118 55 L 122 40 L 160 40 L 164 5 L 168 75 L 172 40 L 220 40 L 224 22 L 228 58 L 232 40 L 280 40 L 284 30 L 288 50 L 292 40 L 320 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
