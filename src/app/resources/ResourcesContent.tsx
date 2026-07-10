'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const resources = [
  {
    num: '01',
    title: 'Portfolio Website Checklist',
    desc: 'A practical checklist for making a portfolio look credible, fast, and client-ready.',
    href: '/resources/portfolio-checklist',
  },
  {
    num: '02',
    title: 'AI Website Agency Starter Notes',
    desc: 'Notes on packaging websites, AI chatbots, lead capture, and automation for small businesses.',
    href: '/resources/ai-website-agency',
  },
  {
    num: '03',
    title: 'Frontend Project QA Checklist',
    desc: 'Responsive, accessibility, SEO, performance, and deployment checks before shipping.',
    href: '/resources/frontend-qa',
  },
];

export default function ResourcesContent() {
  return (
    <>
      <Section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-accent uppercase tracking-widest">
          Resources
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
          Guides, checklists, and notes.
        </motion.h1>
        <motion.p variants={fadeUp} className="text-text-muted text-lg max-w-2xl mt-6 leading-relaxed">
          Practical resources I&apos;ve put together for building better websites, portfolios, and frontend projects.
        </motion.p>
      </Section>

      <Section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-4">
          {resources.map((r) => (
            <Link key={r.num} href={r.href}>
              <motion.div
                variants={fadeUp}
                className="bg-bg-surface border border-border p-6 hover:border-accent/30 transition-all duration-300 group h-full"
              >
                <p className="font-[family-name:var(--font-mono)] text-xs text-accent">{r.num}</p>
                <h2 className="text-lg font-bold mt-3 group-hover:text-accent transition-colors">{r.title}</h2>
                <p className="text-text-muted text-sm mt-2 leading-relaxed">{r.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}