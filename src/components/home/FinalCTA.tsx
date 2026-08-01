'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/config/contact';

export default function FinalCTA() {
  return (
    <Reveal className="border-t border-border-hard bg-text-primary">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-28">
        <div className="max-w-2xl">
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight"
          >
            Have a capable business hiding behind an incapable website?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-white/60 text-base md:text-lg mt-6 leading-relaxed max-w-lg"
          >
            Send me the current site and tell me what the business needs it to do
            better. No perfect brief required — a few honest sentences about what
            is not working is enough to start.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-center gap-5 mt-10"
          >
            <Link
              href="/contact"
              className="bg-maroon text-white border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200 inline-block text-center"
            >
              Show me the problem →
            </Link>
            <a
              href={CONTACT_EMAIL_HREF}
              className="text-white/50 hover:text-white transition-colors text-sm font-[family-name:var(--font-mono)]"
            >
              {CONTACT_EMAIL}
            </a>
          </motion.div>
        </div>
      </div>
    </Reveal>
  );
}
