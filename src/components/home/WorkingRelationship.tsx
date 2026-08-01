'use client';

import { motion } from 'framer-motion';
import { Reveal, fadeUp } from '@/components/Reveal';
import { WORKING_ADVANTAGES } from '@/config/capabilities';

export default function WorkingRelationship() {
  return (
    <Reveal className="py-20 md:py-24 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-[1.15]">
            A direct working relationship.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-text-muted text-base md:text-lg mt-5 leading-relaxed">
            You work directly with the person designing and developing the
            website. Communication stays clear, decisions move quickly and the
            final implementation remains faithful to the approved direction.
          </motion.p>
        </div>

        <div className="lg:col-span-7">
          <motion.ul variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 border-t border-border pt-6">
            {WORKING_ADVANTAGES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-text-primary leading-snug">
                <span className="text-maroon mt-0.5 shrink-0" aria-hidden="true">▪</span>
                {item}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </Reveal>
  );
}
