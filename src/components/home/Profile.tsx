'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';

export default function Profile() {
  return (
    <Reveal className="py-20 md:py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-[1.15]"
            >
              A designer and developer who takes the project from the problem to the deploy.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-text-muted text-base md:text-lg mt-6 leading-relaxed"
            >
              I&apos;m Aditya, an independent designer and developer based in
              Delhi, working remotely with organisations in India and
              internationally.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-text-muted text-base md:text-lg mt-4 leading-relaxed"
            >
              I prefer projects where the business is genuinely complicated: too
              many services, technical products, regulated industries,
              operational density. That is where design judgement and engineering
              rigour actually pay for themselves. I do not lead with frameworks —
              the work is judged by whether the site makes the business easier to
              understand, trust and choose.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href="/about"
                className="bg-white text-text-primary border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 shadow-hard-sm inline-block"
              >
                About Aditya →
              </Link>
            </motion.div>
          </div>
          <div className="lg:col-span-5">
            <motion.div
              variants={fadeUp}
              className="bg-bg-surface-2 border border-border p-6"
            >
              <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
                Experience across
              </p>
              <ul className="space-y-2.5 text-sm text-text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-0.5 shrink-0">—</span>
                  B2B &amp; industrial corporate websites
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-0.5 shrink-0">—</span>
                  Ecommerce and full-stack buying systems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-0.5 shrink-0">—</span>
                  SaaS and operational product design
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-maroon mt-0.5 shrink-0">—</span>
                  Editorial and interactive brand experiences
                </li>
              </ul>
              <p className="mt-6 pt-5 border-t border-border font-[family-name:var(--font-mono)] text-sm italic text-text-muted">
                Selected availability. I take on a small number of projects so
                each one gets the attention it needs.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
