'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/components/Reveal';
import { PROCESS_STEPS } from '@/config/process';

export default function ProcessList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {PROCESS_STEPS.map((step) => (
        <motion.div
          key={step.number}
          variants={fadeUp}
          className="bg-white border border-border-hard p-6 shadow-hard-sm flex flex-col"
        >
          <span className="font-[family-name:var(--font-mono)] text-maroon text-2xl font-bold tabular-nums">
            {step.number}
          </span>
          <h3 className="text-lg font-bold mt-2 text-text-primary tracking-tight">{step.title}</h3>
          <p className="text-text-muted text-sm mt-2 leading-[1.7]">{step.summary}</p>
        </motion.div>
      ))}
    </div>
  );
}
