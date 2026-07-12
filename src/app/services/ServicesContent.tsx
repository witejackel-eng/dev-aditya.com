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

/* ─── Data ─── */
const services = [
  {
    num: '01',
    title: 'Business Website Design & Development',
    slug: 'business-websites',
    desc: 'Multi-page responsive websites for service businesses, startups, and independent professionals. SEO foundation, contact forms, and performance optimization included.',
    tags: ['Responsive', 'SEO', 'Contact Forms', 'Performance'],
  },
  {
    num: '02',
    title: 'Website Redesign',
    slug: 'website-redesign',
    desc: 'Transform an outdated website into a modern, fast, conversion-focused experience. Preserve what works, rebuild what doesn\'t.',
    tags: ['Redesign', 'Migration', 'Performance', 'UX Audit'],
  },
  {
    num: '03',
    title: 'Landing Page Design & Development',
    slug: 'landing-page-design',
    desc: 'High-conversion landing pages built for campaigns, product launches, and lead generation. Every element serves the conversion goal.',
    tags: ['Conversion', 'Campaign', 'Lead Gen', 'A/B Ready'],
  },
  {
    num: '04',
    title: 'E-commerce Website Development',
    slug: 'ecommerce-development',
    desc: 'Full shopping experiences from product browsing through cart to checkout. Editorial design, persistent cart state, and payment integration.',
    tags: ['E-commerce', 'Cart System', 'Payments', 'Product Catalog'],
  },
  {
    num: '05',
    title: 'Next.js Website & Application Development',
    slug: 'nextjs-development',
    desc: 'Production-grade Next.js applications with server-side rendering, API routes, and modern architecture. Built for speed, SEO, and scale.',
    tags: ['Next.js', 'SSR', 'API Routes', 'TypeScript'],
  },
  {
    num: '06',
    title: 'Interactive & Immersive Website Development',
    slug: 'interactive-websites',
    desc: 'Websites with WebGL, scroll choreography, and motion design that create memorable experiences. For brands that want more than a static page.',
    tags: ['WebGL', 'GSAP', 'Motion Design', 'Three.js'],
  },
];

const faqItems = [
  {
    q: 'What types of businesses do you work with?',
    a: 'I work with service businesses, startups, independent professionals, and creative brands. My focus is on building premium, fast websites that communicate clearly and convert visitors into clients.',
  },
  {
    q: 'How do I know which service is right for my project?',
    a: 'Start by describing what you need — a new website, a redesign, or something interactive. During our first conversation, I\'ll recommend the right approach based on your goals, timeline, and budget. You can also review my packages at /packages.',
  },
  {
    q: 'Do you design and develop both?',
    a: 'Yes. I handle the full process from UI/UX design through frontend development. If you already have designs from a separate designer, I can build to those as well.',
  },
  {
    q: 'What is the typical timeline for a project?',
    a: 'A landing page ships in 1–2 weeks. A full business website takes 2–4 weeks. Complex or interactive projects may take longer depending on scope. I\'ll give you a clear timeline before we start.',
  },
  {
    q: 'Do you work with clients outside Delhi?',
    a: 'Yes. I\'m based in Delhi but work with clients worldwide. Async communication and shared project tools make remote collaboration straightforward.',
  },
];

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

/* ═══════════════════════════════════════════════════════════════ */

export default function ServicesContent() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-6 pt-28 md:pt-32 pb-16 md:pt-16 md:pb-20 border-b border-border-hard">
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
            className="text-[clamp(2.8rem,6.5vw,5.5rem)] font-black uppercase tracking-[-0.03em] leading-[0.95] text-text-primary max-w-5xl"
          >
            Web design &
            <br />
            development
            <br />
            <span className="inline-block bg-maroon text-white px-3 py-1 mt-1 align-middle">
              services.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-text-muted text-lg md:text-xl max-w-[540px] mt-8 leading-[1.7]"
          >
            Professional websites designed and built for service businesses,
            startups, and independent brands. Based in Delhi, available worldwide.
          </motion.p>
        </div>
      </section>

      {/* ═══ SERVICE CARDS ═══ */}
      <AnimatedSection className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          className="flex items-end justify-between mb-14 border-b border-border-hard pb-6"
        >
          <div>
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">
              What I Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary mt-2">
              All Services
            </h2>
          </div>
          <span className="hidden sm:block font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.15em] pb-1">
            {services.length} Services
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`}>
              <motion.div
                variants={fadeUp}
                className="bg-white border border-border-hard p-6 md:p-7 shadow-hard-sm group h-full relative overflow-hidden hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-maroon scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <p className="font-[family-name:var(--font-mono)] text-xs text-maroon">
                  {s.num}
                </p>
                <h3 className="text-lg font-bold mt-3 text-text-primary group-hover:text-maroon transition-colors duration-200 leading-tight">
                  {s.title}
                </h3>
                <p className="text-text-muted text-sm mt-3 leading-relaxed">
                  {s.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-maroon-soft text-maroon font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-border">
                  <span className="text-[11px] text-maroon font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] font-medium group-hover:underline">
                    LEARN MORE &rarr;
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ PROCESS OVERVIEW ═══ */}
      <section className="border-t border-border-hard bg-bg-surface-2">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <AnimatedSection className="mb-0">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-maroon inline-block" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">
                How It Works
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary max-w-3xl leading-[1.1]"
            >
              Every project follows a clear process.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-text-muted text-base md:text-lg max-w-2xl mt-5 leading-[1.7]"
            >
              No surprises, no unclear timelines. Four steps from brief to launch.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="mt-14 mb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  num: '01',
                  title: 'Understand',
                  desc: 'I learn your business, audience, and goals. We agree on scope, timeline, and deliverables before any design work starts.',
                },
                {
                  num: '02',
                  title: 'Design',
                  desc: 'I create the UI — layouts, typography, spacing, interaction patterns. You review and refine until it feels right.',
                },
                {
                  num: '03',
                  title: 'Build',
                  desc: 'I develop the production frontend with clean code, responsive layouts, performance optimization, and SEO built in.',
                },
                {
                  num: '04',
                  title: 'Launch',
                  desc: 'Final QA, browser testing, deployment, and handoff. I stay available for fixes and adjustments after launch.',
                },
              ].map((step) => (
                <motion.div
                  key={step.num}
                  variants={fadeUp}
                  className="bg-bg-surface border border-border-hard p-6 md:p-7 shadow-hard-sm"
                >
                  <p className="font-[family-name:var(--font-mono)] text-maroon text-2xl font-bold">
                    {step.num}
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-sm text-text-primary mt-2 font-bold">
                    {step.title}
                  </p>
                  <p className="text-text-muted text-sm mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ PRICING LINK ═══ */}
      <section className="border-t border-border-hard">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <AnimatedSection className="mb-0">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-maroon inline-block" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">
                Pricing
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary max-w-3xl leading-[1.1]"
            >
              Transparent packages for every scope.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-text-muted text-base md:text-lg max-w-2xl mt-5 leading-[1.7]"
            >
              Fixed-price packages with clear deliverables. No hidden costs, no
              scope ambiguity. Choose a tier that fits your project.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href="/packages"
                className="bg-maroon text-white border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200 inline-block"
              >
                VIEW PACKAGES &rarr;
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="border-t border-border-hard">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <AnimatedSection className="mb-0">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-maroon inline-block" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">
                Frequently Asked
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary max-w-2xl leading-[1.1]"
            >
              Common questions about my services.
            </motion.h2>
          </AnimatedSection>

          <AnimatedSection className="mt-12 mb-0">
            <div className="max-w-3xl border-t border-border">
              {faqItems.map((item, i) => (
                <FAQ key={i} q={item.q} a={item.a} i={i} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-t border-border-hard bg-text-primary">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon-light uppercase tracking-[0.2em]">
              Start a Project
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mt-5 leading-[1.1] tracking-[-0.02em]">
              Ready to build something that works?
            </h2>
            <p className="text-white/50 text-base md:text-lg mt-6 leading-[1.7] max-w-lg">
              Tell me about your project. I&apos;ll recommend the right service
              and give you a clear scope and timeline.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="mailto:hi.aditya.dev@gmail.com"
                className="bg-maroon text-white border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200 inline-block"
              >
                EMAIL ME &rarr;
              </a>
              <Link
                href="/packages"
                className="bg-white text-text-primary border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 inline-block"
              >
                VIEW PACKAGES &rarr;
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
