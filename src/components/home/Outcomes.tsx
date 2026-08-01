'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';

/**
 * Outcomes section — replaces the conventional service-category presentation
 * with four client situations per the brief.
 *
 * Icons are inline SVG (no extra dependency) drawn in the existing maroon /
 * brutalist vocabulary.
 */
const outcomes = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M3 7l9 9 9-9" strokeLinecap="square" />
      </svg>
    ),
    situation: 'Your website is underselling the business',
    work: ['Positioning', 'Information architecture', 'Corporate redesign', 'Credibility systems', 'Visual direction'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9a3 3 0 1 1 4.5 2.6c-.9.4-1.5 1.2-1.5 2.2v.2" strokeLinecap="square" />
        <circle cx="12" cy="18" r="0.5" fill="currentColor" />
      </svg>
    ),
    situation: 'People cannot understand what you sell',
    work: ['Product organisation', 'Service architecture', 'Comparison tools', 'Technical content systems', 'Guided journeys'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" strokeLinejoin="miter" />
      </svg>
    ),
    situation: 'The design exists, but the product needs building',
    work: ['Frontend engineering', 'Design-system implementation', 'Responsive interfaces', 'Motion', 'Accessibility'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M14 7l3 3M5 19l3-1 9-9-3-3-9 9-1 3z" strokeLinejoin="miter" />
        <path d="M14 7l3 3" />
      </svg>
    ),
    situation: 'The website needs to do actual work',
    work: ['Forms & ecommerce', 'Payments', 'Admin tools & dashboards', 'Databases & integrations', 'Notifications'],
  },
];

export default function Outcomes() {
  return (
    <Reveal className="py-20 md:py-24 border-t border-border bg-bg-surface-2">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          variants={fadeUp}
          className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4"
        >
          Outcomes, not services
        </motion.p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-end">
          <motion.h2
            variants={fadeUp}
            className="lg:col-span-7 text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-[1.15]"
          >
            Tell me the situation. I will tell you whether I can help.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="lg:col-span-5 text-text-muted text-base md:text-lg leading-relaxed"
          >
            Most agencies sell services by the yard. This is organised by the
            problem the business actually has — so you can recognise yours and
            see whether the work fits.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-12">
          {outcomes.map((o) => (
            <motion.div
              key={o.situation}
              variants={fadeUp}
              className="bg-white border border-border-hard shadow-hard-sm p-6 group hover:shadow-hard-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="bg-maroon-soft p-2.5 shrink-0 text-maroon">
                  {o.icon}
                </div>
                <h3 className="font-bold text-text-primary text-lg leading-tight pt-0.5">
                  {o.situation}
                </h3>
              </div>
              <ul className="flex flex-wrap gap-2 mt-5">
                {o.work.map((w) => (
                  <li
                    key={w}
                    className="border border-border bg-bg-surface px-2.5 py-1 text-xs text-text-muted font-[family-name:var(--font-mono)]"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/services"
            className="text-maroon hover:underline inline-block font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest"
          >
            See full capabilities →
          </Link>
        </motion.div>
      </div>
    </Reveal>
  );
}
