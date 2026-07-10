'use client';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.section>
  );
}

/* ─── Project data (untouched) ─── */
const projects = [
  { num: '01', category: 'Corporate \u00B7 Business Website', title: 'IBS', desc: 'Corporate business website showcasing company services, team, and brand identity with a refined professional design system, smooth scroll animations, and a responsive layout engineered for credibility and clarity.', stack: 'Next.js \u00B7 TypeScript \u00B7 Tailwind CSS', live: 'https://ibs-com-aadi.vercel.app/', caseStudy: '/work/ibs', github: 'https://github.com/witejackel-eng/IBS.com', outcome: 'Professional corporate presence built for trust and lead generation', role: 'Frontend, UI Design, Animations' },
  { num: '02', category: 'B2B \u00B7 Marketing Site', title: 'Corporate Lead-Gen Platform', desc: 'A high-conversion marketing platform with modular content system, built for a sales team to launch campaign pages without touching code. Designed with a component-driven architecture that keeps every page consistent.', stack: 'React \u00B7 Next.js \u00B7 Framer Motion', live: 'https://corporate-leadgen-platform-jet.vercel.app/', caseStudy: '/work/corporate-leadgen-platform', github: 'https://github.com/witejackel-eng/corporate-leadgen-platform', outcome: 'Modular system enabling non-technical team to ship pages independently', role: 'Frontend Architecture, UI System' },
  { num: '03', category: 'Interactive \u00B7 Web App', title: 'Aadi Card', desc: 'An interactive digital card experience with micro-animations, gesture-driven interactions, and a polished visual design system. Focused on making every interaction feel intentional and responsive.', stack: 'React \u00B7 CSS Animations \u00B7 JavaScript', live: 'https://aadi-card.vercel.app/', caseStudy: '/work/aadi-card', github: 'https://github.com/witejackel-eng/AADI-CARD', outcome: 'Showcased creative coding and interaction design capabilities', role: 'Creative Frontend, Animation Design' },
  { num: '04', category: 'Dashboard \u00B7 Analytics', title: 'Pulse Dashboard', desc: 'A real-time analytics dashboard with live data visualization, interactive charts, and a responsive design that works across all devices. Built for clarity under data density.', stack: 'Next.js \u00B7 Chart.js \u00B7 Tailwind CSS', live: 'https://pulse-aadi-project.vercel.app/', caseStudy: '/work/pulse-dashboard', github: 'https://github.com/witejackel-eng/pulse-analytics-dashboard', outcome: 'Clean data interface that performs well under real-time updates', role: 'Frontend, Data Visualization, Responsive' },
];

/* ─── Stats ─── */
const stats = [
  { value: '4+', label: 'Shipped Projects' },
  { value: '100%', label: 'Frontend Focus' },
  { value: '3+', label: 'Tech Stacks' },
  { value: 'Remote', label: 'Delhi, India → Worldwide' },
];

/* ─── Services I bring to each project ─── */
const capabilities = [
  { title: 'Frontend Architecture', desc: 'Component systems, state management, and scalable codebases that don\'t collapse when requirements shift.' },
  { title: 'UI/UX Design', desc: 'Layouts, spacing, typography, and interaction flows designed for clarity — not decoration.' },
  { title: 'Motion & Interaction', desc: 'Scroll-driven animations, micro-interactions, and transition systems that make interfaces feel responsive.' },
  { title: 'Performance', desc: 'Core Web Vitals, lazy loading, image optimization, and rendering strategies for production-speed pages.' },
];

/* ─── FAQ ─── */
const faqItems = [
  { q: 'What kind of projects do you take on?', a: 'I focus on frontend-heavy projects: corporate websites, marketing platforms, interactive landing pages, dashboards, and web applications. If it has a screen and needs to look and feel professional, it\'s likely in my wheelhouse.' },
  { q: 'Do you work with existing designs, or do you design too?', a: 'Both. If you have Figma files or a brand system, I\'ll build faithfully to it. If you don\'t, I\'ll design the interface myself — layouts, typography, spacing, motion — and ship the frontend code.' },
  { q: 'What is your tech stack?', a: 'Primarily React, Next.js, and TypeScript. Tailwind CSS for styling. Framer Motion or CSS animations for interaction. I pick the right tool for each project rather than forcing a single stack.' },
  { q: 'How long does a typical project take?', a: 'A focused landing page or portfolio can ship in 1–2 weeks. A full corporate website or dashboard typically takes 2–4 weeks depending on scope and revision cycles.' },
  { q: 'Can I see the code before delivery?', a: 'Yes. I push code to a private GitHub repository so you can track progress, review commits, and request changes at any point during the build.' },
  { q: 'Do you work with international clients?', a: 'Yes. I\'m based in Delhi, India and work remotely with clients across time zones. Async communication works well for my workflow.' },
];

/* ─── FAQ Accordion ─── */
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      className="border-b border-border"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="flex items-start gap-4">
          <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted mt-0.5 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-base font-medium text-text-primary group-hover:text-maroon transition-colors duration-200">
            {q}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-muted text-lg shrink-0 mt-0.5"
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
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <p className="pl-10 pb-5 text-text-muted text-sm leading-relaxed max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */

export default function WorkContent() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-[100px] pb-0">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 border-b border-border-hard">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest"
          >
            Selected Work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 tracking-tight text-text-primary leading-[1.1] max-w-4xl"
          >
            Projects built for
            <br />
            clarity, performance,
            <br />
            <span className="text-maroon">and real use.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="text-text-muted text-lg md:text-xl max-w-2xl mt-6 leading-relaxed"
          >
            A curated selection of websites, web apps, and interface systems — each designed and built to solve a real problem for a real user.
          </motion.p>
        </div>
      </section>

      {/* ─── PROOF / STATS STRIP ─── */}
      <section className="border-b border-border-hard">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                className={`py-6 md:py-8 ${i < stats.length - 1 ? 'border-r border-border' : ''} ${i < 2 ? 'border-b lg:border-b-0 border-border' : ''}`}
              >
                <p className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{stat.value}</p>
                <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-widest mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROJECTS GRID ─── */}
      <Section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-12">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest">Portfolio</p>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mt-2">Case Studies</h2>
          </div>
          <span className="hidden sm:block font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest">
            {projects.length} Projects
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <motion.div
              key={p.num}
              variants={fadeUp}
              className="bg-bg-surface border border-border-hard group relative overflow-hidden hover:-translate-y-1 hover:shadow-hard-hover transition-all duration-200"
            >
              {/* Top maroon accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-maroon opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Number + Category */}
              <div className="p-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted">{p.num}</span>
                  <p className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest">{p.category}</p>
                </div>
                <Link href={p.caseStudy} className="block mt-3">
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-maroon transition-colors duration-200 leading-tight">
                    {p.title}
                  </h3>
                </Link>
              </div>

              {/* Body */}
              <div className="p-6 pt-4">
                <p className="text-text-muted text-sm leading-relaxed">{p.desc}</p>

                {/* Outcome */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-widest mb-1">Outcome</p>
                  <p className="text-sm text-text-primary">{p.outcome}</p>
                </div>

                {/* Role */}
                <div className="mt-3">
                  <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-widest mb-1">Role</p>
                  <p className="text-sm text-text-primary">{p.role}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {p.stack.split(' \u00B7 ').map((tag) => (
                    <span key={tag} className="bg-maroon-soft text-maroon font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-5 mt-5 pt-4 border-t border-border">
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-xs text-maroon hover:underline font-[family-name:var(--font-mono)] uppercase tracking-widest">
                    VIEW LIVE &rarr;
                  </a>
                  <Link href={p.caseStudy} className="text-xs text-text-muted hover:text-text-primary transition-colors font-[family-name:var(--font-mono)] uppercase tracking-widest">
                    CASE STUDY &rarr;
                  </Link>
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-text-primary transition-colors font-[family-name:var(--font-mono)] uppercase tracking-widest">
                    GITHUB &rarr;
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── WHAT THIS WORK REPRESENTS ─── */}
      <section className="border-t border-border-hard bg-bg-surface-2">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <Section className="mb-0">
            <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">
              What I bring to each project
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary mt-3 max-w-xl">
              Every project gets the same level of intent.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-muted max-w-2xl mt-4 leading-relaxed">
              These projects represent what I do best: take a goal, turn it into a clear interface, and ship it so it works on every device, loads fast, and feels right to use.
            </motion.p>
          </Section>

          <Section className="mt-12 mb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {capabilities.map((cap) => (
                <motion.div key={cap.title} variants={fadeUp} className="bg-bg-surface border border-border-hard p-6 shadow-hard-sm">
                  <h3 className="text-base font-bold text-text-primary mb-2">{cap.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{cap.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-border-hard">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <Section className="mb-0">
            <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">
              Frequently Asked
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary mt-3">
              Common questions about working with me.
            </motion.h2>
          </Section>

          <Section className="mt-10 mb-0">
            <div className="max-w-3xl">
              {faqItems.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ─── LARGE CTA BLOCK ─── */}
      <section className="border-t border-border-hard bg-text-primary">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="max-w-2xl"
          >
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon-light uppercase tracking-widest">
              Start a Project
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 leading-[1.15]">
              Have something that needs to look and feel better?
            </h2>
            <p className="text-white/60 text-base md:text-lg mt-6 leading-relaxed max-w-lg">
              Send the short version. I&apos;ll understand the project, the current problem, and what needs to ship.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="mailto:hi.aditya.dev@gmail.com"
                className="bg-maroon text-white border border-border-hard px-6 py-3.5 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200"
              >
                SEND AN EMAIL &rarr;
              </a>
              <a
                href="tel:+919310736542"
                className="bg-white text-text-primary border border-border-hard px-6 py-3.5 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200"
              >
                CALL ME &rarr;
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}