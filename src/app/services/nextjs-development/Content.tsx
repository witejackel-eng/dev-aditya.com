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
  { label: 'Businesses That Need SEO', desc: 'Companies that rely on organic search traffic and need server-rendered pages that load fast and rank well. Next.js SSR delivers on both.' },
  { label: 'Teams Building Web Applications', desc: 'Startups and product teams that need a full-stack React application with API routes, authentication, database integration, and deployment infrastructure.' },
  { label: 'Projects Outgrowing Create React App', desc: 'Teams migrating from Create React App or client-only React setups to a framework with SSR, routing, and better performance out of the box.' },
];

const deliverables = [
  'Production Next.js application with App Router and TypeScript',
  'Server-side rendering (SSR) and static generation (SSG) where appropriate',
  'API routes for backend logic — forms, webhooks, and integrations',
  'SEO-optimized with per-page metadata, sitemap, and structured data',
  'Authentication integration (NextAuth.js or similar)',
  'Database integration with Prisma ORM',
  'Performance optimization — code splitting, lazy loading, image optimization',
  'Deployment setup on Vercel with CI/CD pipeline',
];

const processSteps = [
  { num: '01', title: 'Understand', desc: 'I learn your application requirements, user flows, technical constraints, and infrastructure needs. We agree on architecture, tech choices, and project scope.' },
  { num: '02', title: 'Design & Architect', desc: 'I design the UI and plan the technical architecture — data models, API endpoints, rendering strategies, and component structure. You review and approve before development.' },
  { num: '03', title: 'Build', desc: 'I develop the application with clean TypeScript, modular components, server-rendered pages, and API routes. Incremental progress with regular check-ins and code reviews.' },
  { num: '04', title: 'Deploy & Launch', desc: 'I set up deployment on Vercel, configure CI/CD, run final QA, and launch. Post-launch monitoring and support included.' },
];

const relatedProjects = [
  { title: 'Saffron & Steam Experience', desc: 'Portfolio project — An immersive café website with WebGL hero, scroll choreography, and editorial design built on Next.js.', href: '/work/saffron-steam-experience' },
  { title: 'Driftwear Studio', desc: 'Portfolio project — An editorial e-commerce experience with full shopping flow, persistent cart, and Razorpay integration built on Next.js.', href: '/work/driftwear-ecommerce' },
];

const relatedResources = [
  { title: 'Next.js vs WordPress: Which Should You Choose?', desc: 'A practical comparison for building websites — performance, developer experience, and flexibility.', href: '/resources/nextjs-vs-wordpress' },
];

const faqItems = [
  {
    q: 'Why Next.js instead of plain React?',
    a: 'Next.js provides server-side rendering, file-based routing, API routes, and built-in optimization out of the box. Plain React is a library for building UIs — Next.js is a framework for building complete web applications. If you need SEO, fast initial loads, or API endpoints, Next.js is the right choice.',
  },
  {
    q: 'Do you use the App Router or Pages Router?',
    a: 'I use the App Router (the modern Next.js approach) for all new projects. It supports server components, streaming, nested layouts, and better data fetching patterns. If you have an existing Pages Router project that needs work, I can work with that too.',
  },
  {
    q: 'Can you integrate with existing backends or databases?',
    a: 'Yes. I commonly integrate with REST APIs, GraphQL endpoints, and databases through Prisma ORM. Whether you have an existing backend or need one built from scratch using Next.js API routes, I can handle both.',
  },
  {
    q: 'What about hosting and deployment?',
    a: 'I primarily deploy to Vercel (the creators of Next.js), which provides optimal performance, automatic HTTPS, preview deployments, and CI/CD. If you need a different hosting setup (AWS, DigitalOcean, etc.), I can configure that as well.',
  },
  {
    q: 'Is the codebase maintainable after handoff?',
    a: 'Yes. I write clean TypeScript with proper type definitions, modular component architecture, and documented project structure. Every project includes a README with setup instructions, and I provide 2 weeks of post-launch support for questions and fixes.',
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
          Next.js Website & Application Development
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">
          Production-grade Next.js applications with server-side rendering, API routes, and modern architecture. Built for speed, SEO, and scale — not just for the demo.
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
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mt-4">Next.js project packages.</h3>
          <p className="text-text-muted text-base mt-3 leading-relaxed max-w-xl">
            Next.js applications are scoped based on complexity, number of routes, API requirements, and integrations. View base packages for reference pricing.
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
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Common questions about Next.js development.</motion.h2>
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
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Need a Next.js application?</h2>
          <p className="text-text-muted text-base mt-4 leading-relaxed max-w-xl">
            Tell me about your project requirements and technical needs. I&apos;ll recommend the right architecture and give you a clear scope and timeline.
          </p>
          <a href="mailto:hi.aditya.dev@gmail.com" className="inline-block mt-8 bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200">
            EMAIL ME &rarr;
          </a>
        </motion.div>
      </section>
    </>
  );
}
