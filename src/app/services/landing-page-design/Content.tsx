'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function FAQ({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="flex items-start gap-5">
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted/50 mt-0.5 shrink-0 tabular-nums">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-[15px] font-medium text-text-primary group-hover:text-maroon transition-colors duration-200 leading-snug">
            {q}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-text-muted text-xl shrink-0 mt-[-2px] font-light"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
            }}
            className="overflow-hidden"
          >
            <p className="pl-[3.25rem] pb-6 text-text-muted text-[14px] leading-[1.7] max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const whoFor = [
  { label: 'Marketing Teams', desc: 'Running paid campaigns that need dedicated, conversion-optimized pages. Stop sending ad traffic to generic homepage sections.' },
  { label: 'Product Launches', desc: 'Launching a new product, service, or feature and need a focused page that communicates value and drives sign-ups or purchases.' },
  { label: 'Lead Generation', desc: 'Service businesses and agencies that want to capture more enquiries through dedicated landing pages tied to specific channels.' },
];

const deliverables = [
  'Single-page or multi-section landing page designed for conversion',
  'Conversion-focused layout — hero, value proposition, social proof, and CTA flow',
  'Responsive design optimized for mobile-first ad traffic',
  'Lead capture forms with validation and integration-ready setup',
  'A/B test–ready structure so you can iterate on messaging and design',
  'Performance optimization — sub-3-second load times on 4G connections',
  'Analytics and conversion tracking setup',
];

const processSteps = [
  { num: '01', title: 'Understand', desc: 'I learn your campaign goals, target audience, value proposition, and conversion metrics. We define what success looks like before any design work.' },
  { num: '02', title: 'Design', desc: 'I create the landing page layout with a clear visual hierarchy, compelling copy structure, and strategic CTA placement. Every element serves the conversion goal.' },
  { num: '03', title: 'Build', desc: 'I develop the production page with working forms, tracking pixels, responsive layouts, and fast performance. Clean code that\'s easy to update for future campaigns.' },
  { num: '04', title: 'Launch', desc: 'I deploy the page, verify tracking and form submissions, and ensure everything works across browsers and devices. Ready for your campaign traffic.' },
];

const relatedProjects = [
  { title: 'Corporate Lead-Gen Platform', desc: 'Portfolio project — A high-conversion marketing platform with modular campaign pages.', href: '/work/corporate-leadgen-platform' },
];

const relatedResources = [
  { title: 'How Much Does a Website Cost in India?', desc: 'A breakdown of website costs, including landing page development pricing.', href: '/resources/website-cost-india' },
];

const faqItems = [
  {
    q: 'How long does a landing page take to build?',
    a: 'A focused landing page typically takes 1–2 weeks from kickoff to launch. If you have copy and assets ready, it can be faster. The timeline includes design review, development, and testing.',
  },
  {
    q: 'Can I A/B test the landing page?',
    a: 'Yes. I build landing pages with a clean, modular structure that makes it easy to create variants for A/B testing. I can set up the initial test structure, and you can iterate using tools like Google Optimize, VWO, or similar platforms.',
  },
  {
    q: 'Do you write the landing page copy?',
    a: 'I provide a copy structure — headline frameworks, section outlines, and CTA suggestions based on conversion best practices. For full copywriting, I recommend working with a copywriter who understands your industry. The best landing pages combine strong design with compelling, specific copy.',
  },
  {
    q: 'What makes a landing page different from a regular website page?',
    a: 'A landing page has one goal: conversion. It removes navigation distractions, presents a clear value proposition, builds trust with relevant proof, and drives visitors toward a single action. Regular website pages serve multiple purposes; landing pages serve one.',
  },
  {
    q: 'Can the landing page connect to my CRM or email marketing tool?',
    a: 'Yes. I build forms that can integrate with popular tools like Mailchimp, ConvertKit, HubSpot, and others through API connections or webhook setups. Let me know what tools you use and I\'ll make the integration work.',
  },
];

export default function Content() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="max-w-4xl mx-auto px-6 pt-28 md:pt-32 pb-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex items-center gap-3 mb-6">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Service</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-text-primary">
          Landing Page Design & Development
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">
          High-conversion landing pages built for campaigns, product launches, and lead generation. Every element — from headline to CTA — serves the conversion goal.
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="font-[family-name:var(--font-mono)] text-sm text-text-muted mt-4">
          Based in Delhi, available worldwide for remote projects.
        </motion.p>
      </section>

      {/* ═══ WHO THIS IS FOR ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Who This Is For</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Is this the right service for you?</motion.h2>
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {whoFor.map((item) => (
            <motion.div key={item.label} variants={fadeUp} className="bg-white border border-border-hard p-5 shadow-hard-sm">
              <p className="font-[family-name:var(--font-mono)] text-sm text-maroon font-bold">{item.label}</p>
              <p className="text-text-muted text-sm mt-3 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ WHAT YOU GET ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Deliverables</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">What you get.</motion.h2>
        <motion.ul variants={fadeUp} className="mt-8 space-y-3">
          {deliverables.map((item) => (
            <li key={item} className="text-text-muted leading-relaxed flex gap-3">
              <span className="text-maroon mt-0.5 shrink-0">&mdash;</span> {item}
            </li>
          ))}
        </motion.ul>
      </AnimatedSection>

      {/* ═══ PROCESS ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Process</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">How it works.</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {processSteps.map((step) => (
            <motion.div key={step.num} variants={fadeUp} className="bg-white border border-border-hard p-5 shadow-hard-sm">
              <p className="font-[family-name:var(--font-mono)] text-maroon text-2xl font-bold">{step.num}</p>
              <p className="font-[family-name:var(--font-mono)] text-sm text-text-primary mt-2 font-bold">{step.title}</p>
              <p className="text-text-muted text-sm mt-2 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ RELATED PROJECTS ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Related Projects</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Projects like this.</motion.h2>
        <div className="mt-8">
          {relatedProjects.map((p) => (
            <Link key={p.href} href={p.href}>
              <motion.div variants={fadeUp} className="bg-white border border-border-hard p-6 shadow-hard-sm group hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200">
                <h3 className="text-base font-bold text-text-primary group-hover:text-maroon transition-colors duration-200">{p.title}</h3>
                <p className="text-text-muted text-sm mt-2 leading-relaxed">{p.desc}</p>
                <span className="text-[11px] text-maroon font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] font-medium mt-4 inline-block group-hover:underline">VIEW CASE STUDY &rarr;</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ RELATED RESOURCES ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-16">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Related Resources</span>
        </motion.div>
        <div className="space-y-4">
          {relatedResources.map((r) => (
            <Link key={r.href} href={r.href}>
              <motion.div variants={fadeUp} className="bg-white border border-border-hard p-5 shadow-hard-sm group hover:shadow-hard-hover hover:-translate-y-0.5 transition-all duration-200">
                <h3 className="text-base font-bold text-text-primary group-hover:text-maroon transition-colors duration-200">{r.title}</h3>
                <p className="text-text-muted text-sm mt-1 leading-relaxed">{r.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ PRICING ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="bg-bg-surface-2 border border-border-hard p-8 md:p-10">
          <p className="font-[family-name:var(--font-mono)] text-sm text-maroon font-bold uppercase tracking-widest">Pricing</p>
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mt-4">Landing page packages available.</h3>
          <p className="text-text-muted text-base mt-3 leading-relaxed max-w-xl">
            Fixed-price packages for single and multi-section landing pages. Includes design, development, form setup, and performance optimization.
          </p>
          <Link href="/packages" className="inline-block mt-6 bg-maroon text-white border border-border-hard px-6 py-3 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200">
            VIEW PACKAGES &rarr;
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ═══ FAQ ═══ */}
      <section className="max-w-4xl mx-auto px-6 mt-20">
        <AnimatedSection className="mb-0">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 bg-maroon inline-block" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">FAQ</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Common questions about landing pages.</motion.h2>
        </AnimatedSection>
        <AnimatedSection className="mt-8 mb-0">
          <div className="border-t border-border">
            {faqItems.map((item, i) => (
              <FAQ key={i} q={item.q} a={item.a} i={i} />
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="max-w-4xl mx-auto px-6 mt-20 pt-16 border-t border-border pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Need a landing page that converts?</h2>
          <p className="text-text-muted text-base mt-4 leading-relaxed max-w-xl">
            Tell me about your campaign and conversion goals. I&apos;ll design and build a page that turns traffic into results.
          </p>
          <a href="mailto:hi.aditya.dev@gmail.com" className="inline-block mt-8 bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200">
            EMAIL ME &rarr;
          </a>
        </motion.div>
      </section>
    </>
  );
}
