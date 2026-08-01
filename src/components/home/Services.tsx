'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import ServicesGrid from '@/components/ServicesGrid';

export default function Services() {
  return (
    <Reveal className="py-20 md:py-24 border-t border-border bg-bg-surface-2">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
          Services
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary max-w-3xl leading-[1.15]">
          How I help organisations improve their digital presence.
        </motion.h2>

        <div className="mt-12">
          <ServicesGrid />
        </div>

        <motion.div variants={fadeUp} className="mt-10">
          <Link href="/services" className="text-maroon hover:underline inline-block font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
            See full capabilities →
          </Link>
        </motion.div>
      </div>
    </Reveal>
  );
}
