'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import ProjectCard from '@/components/ProjectCard';
import { CORPORATE_PROJECTS, CREATIVE_PROJECTS } from '@/config/projects';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/config/contact';

const strip = [
  'Design + Development',
  'Responsive by Default',
  'Production-Ready Handover',
  'Remote Collaboration',
];

export default function WorkContent() {
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
            Digital work built around business clarity, usability and performance.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-text-muted text-lg max-w-2xl mt-8 leading-relaxed"
          >
            A selection of corporate websites, professional-service platforms and
            interactive digital products—designed and developed from structure
            through launch.
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

      {/* Corporate and Commercial Work */}
      <Reveal className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="mb-12 border-b border-border-hard pb-6">
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
            01
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mt-2">
            Corporate and Commercial Work
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CORPORATE_PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Reveal>

      {/* Creative Technology */}
      <Reveal className="pb-16 md:pb-20 max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="mb-12 border-b border-border-hard pb-6">
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
            02
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mt-2">
            Creative Technology
          </h2>
          <p className="text-text-muted text-sm mt-3 max-w-2xl leading-relaxed">
            Self-initiated projects exploring motion, WebGL, generative systems
            and interactive storytelling.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CREATIVE_PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} showDisclosure />
          ))}
        </div>
      </Reveal>

      {/* CTA */}
      <section className="border-t border-border-hard bg-text-primary">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-[1.1] tracking-tight">
              Planning a new website or redesign?
            </h2>
            <p className="text-white/60 text-base md:text-lg mt-6 leading-relaxed max-w-lg">
              Share the current website, business objective and the result you
              want to achieve. I&apos;ll recommend a practical direction.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-10">
              <Link
                href="/contact"
                className="bg-maroon text-white border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200 inline-block text-center"
              >
                DISCUSS A PROJECT →
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
