'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';

export default function Profile() {
  return (
    <Reveal className="py-20 md:py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-[1.15]">
            Design judgment supported by technical execution.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-text-muted text-base md:text-lg mt-6 leading-relaxed">
            I&apos;m Aditya, an independent web designer and frontend developer
            based in Delhi, working remotely with organisations in India and
            internationally.
          </motion.p>
          <motion.p variants={fadeUp} className="text-text-muted text-base md:text-lg mt-4 leading-relaxed">
            My work sits between design and engineering. I help companies turn
            complicated services, products and ideas into digital experiences
            that feel credible, clear and carefully built.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Link
              href="/about"
              className="bg-white text-text-primary border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 shadow-hard-sm inline-block"
            >
              ABOUT ADITYA →
            </Link>
          </motion.div>
        </div>
      </div>
    </Reveal>
  );
}
