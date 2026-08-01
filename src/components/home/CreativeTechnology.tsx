'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import { FlagshipPair } from '@/components/home/FlagshipStory';
import { getProject, type Project } from '@/config/projects';

/**
 * Commerce & product systems pairing.
 *
 * Per the brief: pair DeviceDestination and CloudSun to change the visitor's
 * perception from "He makes corporate websites" to "He can design and engineer
 * serious digital systems."
 */
export function CommercePair() {
  const device = getProject('device-destination')!;
  const cloud = getProject('cloudsun')!;

  return (
    <Reveal className="py-16 md:py-20 border-t border-border max-w-7xl mx-auto px-6">
      <motion.div variants={fadeUp} className="mb-10">
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
          03
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mt-2 max-w-3xl leading-[1.15]">
          He can design and engineer serious digital systems — not just corporate websites.
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FlagshipPair project={device} index={3} />
        <FlagshipPair project={cloud} index={4} />
      </div>
    </Reveal>
  );
}

/**
 * Creative range pairing.
 *
 * Per the brief: pair Saffron & Steam and Aarohan Legal. The contrast is the
 * point — Saffron is expressive, atmospheric and motion-led; Aarohan is
 * restrained, editorial and compliance-aware.
 */
export function CreativePair() {
  const saffron = getProject('saffron-steam-experience')!;
  const aarohan = getProject('aarohan-legal')!;

  return (
    <Reveal className="py-16 md:py-20 border-t border-border max-w-7xl mx-auto px-6">
      <motion.div variants={fadeUp} className="mb-10">
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
          04
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mt-2 max-w-3xl leading-[1.15]">
          Sometimes the right design performs. Sometimes it knows when to stay quiet.
        </h2>
        <p className="text-text-muted text-sm mt-3 max-w-2xl leading-relaxed">
          Saffron &amp; Steam is expressive, atmospheric and motion-led. Aarohan
          Legal is restrained, editorial and compliance-aware. The contrast is
          the point — judgement means knowing which the brief needs.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FlagshipPair project={saffron} index={5} />
        <FlagshipPair project={aarohan} index={6} />
      </div>
    </Reveal>
  );
}

/**
 * Laboratory — compact experiments, clearly labelled.
 */
export function LaboratorySection() {
  const lab = [
    getProject('casa-aurelia')!,
    getProject('pricepilot')!,
    getProject('dust-signal')!,
  ];

  return (
    <Reveal className="py-16 md:py-20 border-t border-border bg-bg-surface-2">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="mb-10">
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
            Laboratory
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mt-2">
            The Useful Experiments Department.
          </h2>
          <p className="text-text-muted text-sm mt-3 max-w-2xl leading-relaxed">
            Built to learn — small on purpose, kept honest. These never compete
            with the primary case studies for attention.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {lab.map((p, i) => (
            <LabCard key={p.slug} project={p} index={i + 7} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function LabCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      variants={fadeUp}
      className="bg-white border border-border p-5 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="border border-border bg-bg-surface-2 px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-text-muted">
          Experiment
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted/60 uppercase tracking-wider">
          {project.proofRole}
        </span>
      </div>
      <h3 className="font-bold text-text-primary text-lg leading-tight">{project.name}</h3>
      <p className="font-[family-name:var(--font-mono)] text-xs text-maroon italic mt-1">{project.outcomeHeadline}</p>
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
