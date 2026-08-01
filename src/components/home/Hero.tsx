'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';

const profileRows = [
  { label: 'BASED', value: 'Delhi, India' },
  { label: 'WORKING', value: 'Remote · India / International' },
  { label: 'FOCUS', value: 'Strategy · Design · Full-stack delivery' },
  { label: 'RANGE', value: 'Corporate · Commerce · SaaS · Brand' },
  { label: 'STATUS', value: 'Available for selected projects' },
];

export default function Hero() {
  return (
    <section className="pt-[110px] pb-20 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left column */}
        <div className="lg:col-span-7">
          <Reveal as="div">
            <motion.div variants={fadeUp} className="flex items-start gap-2 mb-6">
              <span className="w-3 h-3 bg-maroon inline-block mt-1 shrink-0" />
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted tracking-widest uppercase leading-relaxed">
                Designer &amp; Developer for Business Websites, Ecommerce and Digital Products
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[clamp(2.25rem,5.2vw,4rem)] font-bold tracking-tight leading-[1.05] text-text-primary max-w-2xl"
            >
              I design and build websites that make{' '}
              <span className="text-maroon">complicated businesses</span>{' '}
              easier to trust — and easier to choose.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-text-muted text-base md:text-lg max-w-xl mt-7 leading-relaxed"
            >
              Corporate websites, ecommerce platforms and digital products shaped
              around the result your business needs, then engineered to work
              properly after launch.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-8 items-center">
              <Link
                href="/work"
                className="bg-maroon text-white border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200"
              >
                See what changed →
              </Link>
              <Link
                href="/contact"
                className="bg-white text-text-primary border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 shadow-hard-sm"
              >
                Bring me the messy version →
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-8 font-[family-name:var(--font-mono)] text-sm text-text-muted italic"
            >
              Designer&apos;s eye. Developer&apos;s hands. Business outcomes in the middle.
            </motion.p>
          </Reveal>
        </div>

        {/* Right column — Engagement profile card */}
        <div className="lg:col-span-5 lg:pt-4">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="bg-white border border-border-hard shadow-hard relative">
              {/* Side badge */}
              <div className="absolute -right-3 top-4 bg-text-primary text-white px-2 py-4 flex flex-col items-center gap-1 z-10">
                <span className="text-xs font-bold">A.</span>
                <span
                  className="text-[8px] uppercase tracking-widest"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  Profile
                </span>
              </div>

              {/* Title bar */}
              <div className="bg-maroon text-white border-b border-border-hard px-5 py-3">
                <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest font-medium">
                  Engagement Profile
                </span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border">
                {profileRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-wider shrink-0">
                      {row.label}
                    </span>
                    <span className="text-sm text-text-primary font-medium text-right">
                      {row.value}
                      {row.label === 'STATUS' && (
                        <span className="inline-block w-2 h-2 rounded-full bg-green-600 ml-2 align-middle" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
