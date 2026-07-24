'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/components/Reveal';
import { SERVICES } from '@/config/services';

interface ServicesGridProps {
  /** When true, renders full deliverable lists (used on the /services route). */
  detailed?: boolean;
}

export default function ServicesGrid({ detailed = false }: ServicesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {SERVICES.map((service) => (
        <motion.article
          key={service.id}
          id={service.id}
          variants={fadeUp}
          className="bg-white border border-border-hard p-6 md:p-7 shadow-hard-sm scroll-mt-[90px] flex flex-col"
        >
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-[family-name:var(--font-mono)] text-maroon text-sm font-bold tabular-nums">
              {service.number}
            </span>
            <h3 className="text-lg font-bold text-text-primary tracking-tight leading-snug">
              {service.title}
            </h3>
          </div>
          <p className="text-text-muted text-sm leading-[1.7]">{service.summary}</p>

          {detailed && (
            <ul className="mt-5 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {service.deliverables.map((item) => (
                <li key={item} className="text-text-muted text-[13px] flex items-start gap-2 leading-snug">
                  <span className="text-maroon mt-0.5 shrink-0" aria-hidden="true">▪</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </motion.article>
      ))}
    </div>
  );
}
