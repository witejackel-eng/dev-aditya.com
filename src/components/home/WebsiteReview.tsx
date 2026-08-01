'use client';

import { motion } from 'framer-motion';
import { Reveal, fadeUp } from '@/components/Reveal';
import { WEBSITE_REVIEW, getWebsiteReviewMailto } from '@/config/website-review';

export default function WebsiteReview() {
  return (
    <Reveal className="py-20 md:py-24 border-t border-border bg-bg-surface-2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
              Complimentary Website Review
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary leading-[1.15]">
              {WEBSITE_REVIEW.headline}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-muted text-base mt-4 leading-relaxed max-w-lg">
              {WEBSITE_REVIEW.body}
            </motion.p>
          </div>

          <div className="lg:col-span-5">
            <motion.div variants={fadeUp} className="bg-white border border-border-hard shadow-hard p-6">
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-text-muted mb-3">
                What to expect
              </p>
              <ul className="flex flex-col gap-2 mb-6">
                {WEBSITE_REVIEW.clarifications.map((item) => (
                  <li key={item} className="text-sm text-text-muted flex items-start gap-2 leading-snug">
                    <span className="text-maroon mt-0.5 shrink-0 text-xs" aria-hidden="true">▪</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={getWebsiteReviewMailto()}
                className="w-full bg-maroon text-white border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors block text-center"
              >
                {WEBSITE_REVIEW.cta} →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
