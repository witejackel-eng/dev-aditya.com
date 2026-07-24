'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import { PROCESS_STEPS } from '@/config/process';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/config/contact';

export default function ProcessContent() {
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
            Process
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold tracking-tight leading-[1.08] text-text-primary max-w-4xl"
        >
          A clear, predictable path from brief to launch.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-text-muted text-lg max-w-2xl mt-8 leading-relaxed"
        >
          Six stages that keep scope clear, progress visible and the final
          implementation faithful to the approved direction.
        </motion.p>
      </section>

      {/* Steps as a numbered editorial list */}
      <Reveal className="py-16 md:py-20 max-w-4xl mx-auto px-6">
        <div className="divide-y divide-border border-t border-border">
          {PROCESS_STEPS.map((step) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 sm:gap-8 py-8"
            >
              <span className="font-[family-name:var(--font-mono)] text-maroon text-2xl font-bold tabular-nums leading-none">
                {step.number}
              </span>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
                  {step.title}
                </h2>
                <p className="text-text-muted text-[15px] mt-3 leading-[1.8] max-w-2xl">
                  {step.summary}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* CTA */}
      <section className="border-t border-border-hard bg-bg-surface-2">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary leading-[1.15]">
              Ready to scope a project?
            </h2>
            <p className="text-text-muted text-base mt-4 leading-relaxed max-w-lg">
              Share the current website and what you want the new one to achieve.
              I&apos;ll reply with a practical next step.
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
