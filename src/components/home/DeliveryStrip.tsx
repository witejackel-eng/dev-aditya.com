'use client';

import { motion } from 'framer-motion';
import { Reveal, fadeUp } from '@/components/Reveal';

const items = [
  'Strategy-led design',
  'Custom frontend development',
  'Responsive implementation',
  'Production-ready delivery',
];

export default function DeliveryStrip() {
  return (
    <Reveal className="border-y border-border-hard bg-bg-surface-2" as="div">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border">
          {items.map((item) => (
            <motion.div
              key={item}
              variants={fadeUp}
              className="py-6 lg:px-7 first:pt-8 sm:first:pt-6 flex items-center gap-3"
            >
              <span className="w-2 h-2 bg-maroon inline-block shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-text-primary">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
