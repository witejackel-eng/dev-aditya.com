'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import ProcessList from '@/components/ProcessList';

export default function Process() {
  return (
    <Reveal className="py-20 md:py-24 border-t border-border bg-bg-surface-2">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
          Process
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary max-w-3xl leading-[1.15]">
          A clear, predictable path from brief to launch.
        </motion.h2>

        <div className="mt-12">
          <ProcessList />
        </div>

        <motion.div variants={fadeUp} className="mt-10">
          <Link href="/process" className="text-maroon hover:underline inline-block font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
            See the full process →
          </Link>
        </motion.div>
      </div>
    </Reveal>
  );
}
