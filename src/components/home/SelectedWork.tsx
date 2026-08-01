'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import { FlagshipFeature } from '@/components/home/FlagshipStory';
import { getProject } from '@/config/projects';

/**
 * Selected Work — homepage section.
 *
 * Per the brief: IBS Infra and Bharat Electrosafe get large editorial flagship
 * treatment (equal or nearly equal prominence), each leading with the business
 * complexity and the clarity created — not with technology.
 */
export default function SelectedWork() {
  const ibs = getProject('ibs-infra')!;
  const bharat = getProject('bharat-electrosafe')!;

  return (
    <>
      {/* Section intro */}
      <Reveal id="selected-work" className="pt-20 md:pt-24 pb-4 max-w-7xl mx-auto px-6 scroll-mt-[80px]">
        <motion.p
          variants={fadeUp}
          className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4"
        >
          Selected Work
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary max-w-3xl leading-[1.15]"
        >
          Six projects that prove range without losing focus.
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-text-muted text-base md:text-lg max-w-2xl mt-5 leading-relaxed"
        >
          Corporate, industrial, commerce, SaaS, brand and professional services —
          each chosen because it demonstrates a different kind of judgement. Open
          any of them for the full case study.
        </motion.p>
      </Reveal>

      {/* Flagship features */}
      <FlagshipFeature project={ibs} index={1} />
      <FlagshipFeature project={bharat} index={2} />
    </>
  );
}
