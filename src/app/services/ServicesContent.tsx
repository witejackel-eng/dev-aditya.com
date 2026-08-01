'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import ServicesGrid from '@/components/ServicesGrid';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/config/contact';

export default function ServicesContent() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-[110px] pb-16 max-w-7xl mx-auto px-6 border-b border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">
            Services
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold tracking-tight leading-[1.08] text-text-primary max-w-4xl"
        >
          How I help organisations improve their digital presence.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-text-muted text-lg max-w-2xl mt-8 leading-relaxed"
        >
          Four focused ways to work together, from a complete corporate website
          to frontend implementation for an existing team.
        </motion.p>
      </section>

      {/* Services grid */}
      <Reveal className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <ServicesGrid detailed />
      </Reveal>

      {/* CTA */}
      <section className="border-t border-border-hard bg-bg-surface-2">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary leading-[1.15]">
              Not sure which fits your project?
            </h2>
            <p className="text-text-muted text-base mt-4 leading-relaxed max-w-lg">
              Tell me what the website needs to achieve and I&apos;ll recommend a
              practical direction.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-8">
              <Link
                href="/contact"
                className="bg-maroon text-white border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200 inline-block text-center"
              >
                DISCUSS A PROJECT →
              </Link>
              <a
                href={CONTACT_EMAIL_HREF}
                className="text-text-muted hover:text-maroon transition-colors text-sm font-[family-name:var(--font-mono)]"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
