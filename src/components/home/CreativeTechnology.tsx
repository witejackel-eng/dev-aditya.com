'use client';

import { motion } from 'framer-motion';
import { Reveal, fadeUp } from '@/components/Reveal';
import ProjectCard from '@/components/ProjectCard';
import { CREATIVE_PROJECTS } from '@/config/projects';

export default function CreativeTechnology() {
  return (
    <Reveal className="py-20 md:py-24 max-w-7xl mx-auto px-6">
      <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
        Creative Technology
      </motion.p>
      <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary max-w-3xl leading-[1.15]">
        Experiments and interactive work.
      </motion.h2>
      <motion.p variants={fadeUp} className="text-text-muted text-base md:text-lg max-w-2xl mt-5 leading-relaxed">
        Selected self-initiated projects exploring motion, WebGL, generative
        systems and interactive storytelling.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {CREATIVE_PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} showDisclosure />
        ))}
      </div>
    </Reveal>
  );
}
