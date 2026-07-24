'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeUp } from '@/components/Reveal';
import type { Project } from '@/config/projects';

interface ProjectCardProps {
  project: Project;
  /** Show the self-initiated disclosure prominently (used for creative work). */
  showDisclosure?: boolean;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-muted/60 uppercase tracking-[0.15em] mb-1">
        {label}
      </p>
      <p className="text-[13px] text-text-primary leading-snug">{value}</p>
    </div>
  );
}

export default function ProjectCard({ project, showDisclosure = false }: ProjectCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      className="bg-white border border-border-hard shadow-hard-sm group relative overflow-hidden hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-maroon scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {/* Header: industry + type + name */}
      <div className="p-6 md:p-7 pb-5 border-b border-border">
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-[0.12em] font-medium">
            {project.industry}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted/70 uppercase tracking-[0.12em]">
            {project.projectType}
          </span>
        </div>
        <Link href={project.caseStudyUrl} className="block group/link">
          <h3 className="text-2xl md:text-[1.6rem] font-bold text-text-primary group-hover/link:text-maroon transition-colors duration-200 leading-[1.15] tracking-tight">
            {project.name}
          </h3>
        </Link>
        {showDisclosure && (
          <p className="mt-3 text-[11px] text-text-muted/80 leading-snug border border-border px-2.5 py-1.5 inline-block">
            {project.disclosure}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="p-6 md:p-7 pt-5 flex flex-col flex-1">
        <p className="text-text-muted text-sm leading-[1.7]">{project.challenge}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-border">
          <MetaRow label="Scope" value={project.scope} />
          <MetaRow label="Role" value={project.role} />
        </div>

        <div className="mt-4">
          <MetaRow label="Outcome" value={project.outcome} />
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 pt-5 border-t border-border">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-maroon hover:underline font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] font-medium"
          >
            VIEW LIVE →
          </a>
          <Link
            href={project.caseStudyUrl}
            className="text-[11px] text-text-muted hover:text-text-primary transition-colors font-[family-name:var(--font-mono)] uppercase tracking-[0.12em]"
          >
            CASE STUDY →
          </Link>
        </div>

        {/* Technology — secondary metadata, last */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {project.technology.map((tag) => (
            <span
              key={tag}
              className="bg-maroon-soft text-maroon font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
