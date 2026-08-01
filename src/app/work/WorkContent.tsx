'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import { FlagshipPair } from '@/components/home/FlagshipStory';
import {
  PROJECTS,
  FLAGSHIP_PROJECTS,
  LABORATORY_PROJECTS,
  CAPABILITY_FILTERS,
  STATUS_LABELS,
  type CapabilityTag,
  type Project,
} from '@/config/projects';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/config/contact';

const strip = [
  'Strategy-led design',
  'Full-stack delivery',
  'Responsive by default',
  'Production-ready handover',
];

export default function WorkContent() {
  const [filter, setFilter] = useState<CapabilityTag | 'all'>('all');

  const filteredFlagships = useMemo(
    () =>
      filter === 'all'
        ? FLAGSHIP_PROJECTS
        : FLAGSHIP_PROJECTS.filter((p) => p.capabilities.includes(filter)),
    [filter],
  );

  const filteredLab = useMemo(
    () =>
      filter === 'all'
        ? LABORATORY_PROJECTS
        : LABORATORY_PROJECTS.filter((p) => p.capabilities.includes(filter)),
    [filter],
  );

  return (
    <>
      {/* Hero */}
      <section className="pt-[110px]">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-16 md:pt-20 md:pb-20 border-b border-border-hard">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-3 h-3 bg-maroon inline-block" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">
              Selected Work
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold tracking-tight leading-[1.08] text-text-primary max-w-4xl"
          >
            Six projects that prove judgement and execution — not a GitHub feed.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-text-muted text-lg max-w-2xl mt-8 leading-relaxed"
          >
            Corporate, industrial, commerce, SaaS, brand and professional services.
            Each project is chosen because it demonstrates a different kind of
            judgement. Filter by capability, or read the full case study.
          </motion.p>
        </div>
      </section>

      {/* Non-numeric strip */}
      <section className="border-b border-border-hard bg-bg-surface-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border">
            {strip.map((item) => (
              <div key={item} className="py-6 lg:px-7 flex items-center gap-3">
                <span className="w-2 h-2 bg-maroon inline-block shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-text-primary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capability filters */}
      <Reveal className="py-10 max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
            Filter by capability
          </span>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All ({PROJECTS.length})
          </FilterButton>
          {CAPABILITY_FILTERS.map((f) => {
            const count = PROJECTS.filter((p) => p.capabilities.includes(f.id)).length;
            return (
              <FilterButton
                key={f.id}
                active={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label} ({count})
              </FilterButton>
            );
          })}
        </motion.div>
      </Reveal>

      {/* Flagship case studies */}
      <Reveal className="pb-8 max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="mb-10 border-b border-border-hard pb-6">
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
            01
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mt-2">
            Flagship case studies
          </h2>
          <p className="text-text-muted text-sm mt-2 max-w-2xl leading-relaxed">
            Six primary projects — each with a dedicated case study explaining
            the business problem, constraints, strategy, outcome and engineering
            notes.
          </p>
        </motion.div>

        {filteredFlagships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFlagships.map((project, i) => (
              <FlagshipPair key={project.slug} project={project} index={i + 1} />
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm italic py-8">
            No flagship projects match this filter.
          </p>
        )}
      </Reveal>

      {/* Laboratory */}
      <Reveal className="pb-16 md:pb-20 max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="mb-10 border-b border-border-hard pb-6">
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
            02
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mt-2">
            Laboratory
          </h2>
          <p className="text-text-muted text-sm mt-3 max-w-2xl leading-relaxed">
            The Useful Experiments Department. Built to learn — small on
            purpose, kept honest, clearly labelled as experiments.
          </p>
        </motion.div>

        {filteredLab.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredLab.map((project) => (
              <LabCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm italic py-8">
            No laboratory projects match this filter.
          </p>
        )}
      </Reveal>

      {/* CTA */}
      <section className="border-t border-border-hard bg-text-primary">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-[1.1] tracking-tight">
              Have a capable business hiding behind an incapable website?
            </h2>
            <p className="text-white/60 text-base md:text-lg mt-6 leading-relaxed max-w-lg">
              Send me the current site and tell me what the business needs it to
              do better. No perfect brief required.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-10">
              <Link
                href="/contact"
                className="bg-maroon text-white border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200 inline-block text-center"
              >
                Show me the problem →
              </Link>
              <a
                href={CONTACT_EMAIL_HREF}
                className="text-white/50 hover:text-white transition-colors text-sm font-[family-name:var(--font-mono)]"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3 py-1.5 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider transition-colors duration-200 ${
        active
          ? 'bg-maroon text-white border-maroon'
          : 'bg-white text-text-muted border-border hover:border-text-primary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

function LabCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={fadeUp}
      className="bg-white border border-border p-5 flex flex-col h-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="border border-border bg-bg-surface-2 px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-text-muted">
          {STATUS_LABELS[project.status]}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted/60 uppercase tracking-wider">
          {project.proofRole}
        </span>
      </div>
      <h3 className="font-bold text-text-primary text-lg leading-tight">{project.name}</h3>
      <p className="font-[family-name:var(--font-mono)] text-xs text-maroon italic mt-1">
        {project.outcomeHeadline}
      </p>
      <p className="text-text-muted text-sm leading-relaxed mt-3 flex-1">{project.challenge}</p>
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-text-muted hover:text-maroon transition-colors"
          >
            Preview ↗
          </a>
        ) : null}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-text-muted hover:text-maroon transition-colors"
        >
          Code ↗
        </a>
        <Link
          href={project.caseStudyUrl}
          className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-maroon hover:underline ml-auto"
        >
          Case study →
        </Link>
      </div>
    </motion.article>
  );
}
