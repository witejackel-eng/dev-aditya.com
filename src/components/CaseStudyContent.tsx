'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

interface ProofItem { label: string; value: string; }
interface TimelineStep { num: string; title: string; desc: string; }

interface CaseStudyProps {
  meta: string; title: string; summary: string; proof: ProofItem[];
  problem: string; decision: string; built: string[]; proofText: string;
  honestMoment: string; timeline: TimelineStep[]; stack: string;
  liveUrl: string; githubUrl?: string;
}

export default function CaseStudyContent({
  meta, title, summary, proof, problem, decision,
  built, proofText, honestMoment, timeline, stack, liveUrl, githubUrl,
}: CaseStudyProps) {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="pt-32">
        <Link href="/work" className="text-sm text-text-muted hover:text-maroon transition-colors font-[family-name:var(--font-mono)] uppercase tracking-widest">
          &larr; All work
        </Link>
      </div>

      <Section className="mt-8">
        <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-text-muted">{meta}</motion.p>
        <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-bold mt-4 tracking-tight leading-tight text-text-primary">{title}</motion.h1>
        <motion.p variants={fadeUp} className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">{summary}</motion.p>
      </Section>

      <Section className="mt-12">
        <div className="grid md:grid-cols-3 gap-4">
          {proof.map((item) => (
            <motion.div key={item.label} variants={fadeUp} className="bg-white border border-border-hard p-5 shadow-hard-sm">
              <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">{item.label}</p>
              <p className="text-sm text-text-primary mt-2 leading-relaxed">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="mt-20">
        <motion.h2 variants={fadeUp} className="text-xl font-bold text-text-primary">The problem</motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted leading-relaxed mt-4">{problem}</motion.p>
      </Section>

      <Section className="mt-16">
        <motion.h2 variants={fadeUp} className="text-xl font-bold text-text-primary">The decision</motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted leading-relaxed mt-4">{decision}</motion.p>
      </Section>

      <Section className="mt-16">
        <motion.h2 variants={fadeUp} className="text-xl font-bold text-text-primary">What I built</motion.h2>
        <motion.ul variants={fadeUp} className="mt-4 space-y-2">
          {built.map((item) => (
            <li key={item} className="text-text-muted leading-relaxed flex gap-2">
              <span className="text-maroon mt-0.5">&mdash;</span> {item}
            </li>
          ))}
        </motion.ul>
      </Section>

      <Section className="mt-16">
        <motion.h2 variants={fadeUp} className="text-xl font-bold text-text-primary">The proof</motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted leading-relaxed mt-4">{proofText}</motion.p>
      </Section>

      <Section className="mt-16">
        <motion.h2 variants={fadeUp} className="text-xl font-bold text-text-primary">One honest moment</motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted leading-relaxed mt-4">{honestMoment}</motion.p>
      </Section>

      <Section className="mt-20">
        <motion.h2 variants={fadeUp} className="text-xl font-bold mb-8 text-text-primary">How it went</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeline.map((step) => (
            <motion.div key={step.num} variants={fadeUp} className="bg-white border border-border-hard p-5 shadow-hard-sm">
              <p className="font-[family-name:var(--font-mono)] text-maroon text-2xl font-bold">{step.num}</p>
              <p className="font-[family-name:var(--font-mono)] text-sm text-text-primary mt-2">{step.title}</p>
              <p className="text-text-muted text-sm mt-2 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="mt-16">
        <p className="font-[family-name:var(--font-mono)] text-sm text-text-muted">Stack: {stack}</p>
        <div className="flex gap-6 mt-4">
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-maroon hover:underline font-[family-name:var(--font-mono)] uppercase tracking-widest">Live &nearr;</a>
          {githubUrl && <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-text-primary transition-colors font-[family-name:var(--font-mono)] uppercase tracking-widest">GitHub &nearr;</a>}
        </div>
      </Section>

      <section className="mt-20 pt-16 border-t border-border pb-32">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Working on something similar?</h2>
        <a href="mailto:hi.aditya.dev@gmail.com" className="inline-block mt-6 bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200">
          EMAIL ME &rarr;
        </a>
      </section>
    </div>
  );
}