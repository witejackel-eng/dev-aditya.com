'use client';

import { motion } from 'framer-motion';
import { Reveal, fadeUp } from '@/components/Reveal';

/**
 * Capability proof strip — four clear categories that communicate range.
 * Replaces the generic delivery-claims strip with outcome-led categories
 * per the brief.
 */
const capabilities = [
  {
    title: 'Corporate & industrial websites',
    detail:
      'Service businesses, manufacturers and professional firms — reorganised so a serious buyer can follow the journey.',
  },
  {
    title: 'Ecommerce & buying systems',
    detail:
      'Discovery, comparison, checkout and payments engineered to survive the operational edge cases that lose money.',
  },
  {
    title: 'SaaS & operational interfaces',
    detail:
      'Dense, role-based workspaces designed for people who use the software eight hours a day, not once.',
  },
  {
    title: 'Interactive brand experiences',
    detail:
      'Art direction, motion and WebGL used to sell atmosphere — without punishing mobile or low-power visitors.',
  },
];

export default function DeliveryStrip() {
  return (
    <Reveal className="border-y border-border-hard bg-bg-surface-2" as="div">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border">
          {capabilities.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="py-7 lg:px-7 first:pt-8 sm:first:pt-7"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="w-2 h-2 bg-maroon inline-block shrink-0 mt-1.5" aria-hidden="true" />
                <p className="font-[family-name:var(--font-mono)] text-sm font-semibold text-text-primary leading-snug">
                  {item.title}
                </p>
              </div>
              <p className="text-text-muted text-[13px] leading-relaxed pl-5">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
