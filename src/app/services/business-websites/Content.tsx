'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ─── Animation ─── */
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

/* ─── FAQ Accordion ─── */
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

/* ─── Data ─── */
const whoFor = [
  { label: 'Service Businesses', desc: 'Consultancies, agencies, law firms, accounting practices, and professional service providers who need a website that reflects their expertise and brings in enquiries.' },
  { label: 'Startups', desc: 'Early-stage companies that need a credible web presence to attract investors, early adopters, and talent — without spending months on it.' },
  { label: 'Independent Professionals', desc: 'Freelancers, coaches, advisors, and solo consultants who want a website that positions them as the obvious choice in their field.' },
];

const deliverables = [
  'Multi-page responsive website (typically 5–10 pages)',
  'Mobile-first design that works on every screen size',
  'Contact forms and enquiry flows integrated into your workflow',
  'SEO foundation — meta titles, descriptions, headings, and structured data',
  'Performance optimization — fast load times, optimized images, clean code',
  'CMS integration if you need to update content yourself',
  'Analytics setup so you can track visitors and conversions',
];

const processSteps = [
  { num: '01', title: 'Understand', desc: 'I learn about your business, audience, competitors, and goals. We agree on the site structure, content needs, and project scope before any design work begins.' },
  { num: '02', title: 'Design', desc: 'I create the visual design — layouts, typography, color system, and interaction patterns. You review and refine until every page communicates clearly and looks right.' },
  { num: '03', title: 'Build', desc: 'I develop the production frontend with responsive layouts, working forms, SEO structure, and performance optimization. Code is clean, maintainable, and documented.' },
  { num: '04', title: 'Launch', desc: 'Final QA across browsers and devices, deployment to your hosting, and handoff. I stay available for 2 weeks of post-launch fixes and adjustments.' },
];

const relatedProjects = [
  { title: 'Corporate Lead-Gen Platform', desc: 'Portfolio project — A modular marketing platform with high-conversion campaign pages.', href: '/work/corporate-leadgen-platform' },
  { title: 'Real Estate Atelier', desc: 'Portfolio project — A premium real estate advisory website with cinematic editorial design.', href: '/work/real-estate-atelier' },
];

const relatedResources = [
  { title: 'How Much Does a Website Cost in India?', desc: 'A breakdown of website costs, from DIY to professional development.', href: '/resources/website-cost-india' },
];

const faqItems = [
  {
    q: 'How many pages does a business website typically need?',
    a: 'Most service businesses need 5–10 pages: Home, About, Services (or individual service pages), Work/Portfolio, and Contact. The exact number depends on how you want to present your services. I\'ll recommend a structure based on your content and goals during our first conversation.',
  },
  {
    q: 'Will my website work well on mobile phones?',
    a: 'Yes. Every website I build is mobile-first — designed and developed for mobile screens before desktop. Over 60% of web traffic comes from mobile devices, so responsive design is not optional in my process.',
  },
  {
    q: 'Can I update the website content myself after launch?',
    a: 'It depends on the approach. If your site needs frequent content updates, I can integrate a headless CMS (like Sanity or Contentful) so you can edit text and images without touching code. If updates are rare, a static site may be more appropriate — and I\'ll make small content changes for you as needed.',
  },
  {
    q: 'Do you write the website content as well?',
    a: 'I provide structure and guidance for content — page outlines, headline suggestions, and call-to-action frameworks. For full copywriting, I collaborate with content writers or work with your existing copy. The best websites have content written by someone who understands the business deeply.',
  },
  {
    q: 'How long does a business website project take?',
    a: 'A standard 5–10 page business website typically takes 2–4 weeks from kickoff to launch. The timeline depends on content readiness, revision cycles, and any integrations needed. I\'ll give you a specific timeline before we start.',
  },
];

/* ═══════════════════════════════════════════════════════════════ */

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
          Business Website Design & Development
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">
          Multi-page responsive websites for service businesses, startups, and independent professionals. SEO-optimized, fast, and designed to turn visitors into enquiries.
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
        <div className="grid md:grid-cols-2 gap-5 mt-8">
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
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mt-4">Transparent packages for business websites.</h3>
          <p className="text-text-muted text-base mt-3 leading-relaxed max-w-xl">
            Fixed-price packages with clear deliverables. No hidden costs, no scope ambiguity. Choose a tier that fits your project and budget.
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
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Common questions about business websites.</motion.h2>
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
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Need a business website?</h2>
          <p className="text-text-muted text-base mt-4 leading-relaxed max-w-xl">
            Tell me about your business and what you need. I&apos;ll recommend the right approach and give you a clear scope and timeline.
          </p>
          <a href="mailto:hi.aditya.dev@gmail.com" className="inline-block mt-8 bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200">
            EMAIL ME &rarr;
          </a>
        </motion.div>
      </section>
    </>
  );
}
