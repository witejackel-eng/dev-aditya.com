'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import ProjectCard from '@/components/ProjectCard';
import { CORPORATE_PROJECTS } from '@/config/projects';

export default function SelectedWork() {
  return (
    <Reveal id="selected-work" className="py-20 md:py-24 max-w-7xl mx-auto px-6 scroll-mt-[80px]">
      <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
        Selected Work
      </motion.p>
      <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary max-w-3xl leading-[1.15]">
        Websites designed around real business requirements.
      </motion.h2>
      <motion.p variants={fadeUp} className="text-text-muted text-base md:text-lg max-w-2xl mt-5 leading-relaxed">
        Selected corporate websites, marketing platforms and digital
        products—built to communicate clearly, perform reliably and support
        practical business objectives.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {CORPORATE_PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <motion.div variants={fadeUp} className="mt-10">
        <Link href="/work" className="text-maroon hover:underline inline-block font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
          View all work →
        </Link>
      </motion.div>
    </Reveal>
  );
}
