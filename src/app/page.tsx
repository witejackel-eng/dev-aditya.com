'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

/* ─── Reusable animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Small helper: reduced-motion check ─── */
function useReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ─── Section wrapper with scroll-triggered reveal ─── */
function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reduced = useReducedMotion();

  return (
    <motion.section
      ref={ref}
      initial={reduced ? 'visible' : 'hidden'}
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Data ─── */
const marqueeItems =
  'React \u25C6 Next.js \u25C6 TypeScript \u25C6 Tailwind CSS \u25C6 Framer Motion \u25C6 GSAP \u25C6 Three.js \u25C6 WebGL \u25C6 Node.js \u25C6 Express \u25C6 MongoDB \u25C6 PostgreSQL \u25C6 REST APIs \u25C6 ';

const projectCards = [
  {
    category: 'Corporate Website',
    title: 'IBS',
    desc: 'IBS business website designed for credibility, services, partners, and lead generation.',
    tags: 'Next.js \u00B7 TypeScript \u00B7 Tailwind CSS',
  },
  {
    category: 'B2B Marketing Platform',
    title: 'Corporate Lead-Gen Platform',
    desc: 'Corporate Lead-Gen Platform with modular sections, polished animations, and conversion-focused layout.',
    tags: 'React \u00B7 Next.js \u00B7 Framer Motion',
  },
  {
    category: 'Interactive Web App',
    title: 'Aadi Card',
    desc: 'An interactive digital card experience with micro-animations and gesture-driven UI.',
    tags: 'React \u00B7 CSS Animations \u00B7 JavaScript',
  },
  {
    category: 'Analytics Dashboard',
    title: 'Pulse Dashboard',
    desc: 'Pulse Dashboard, a real-time analytics interface with responsive data views.',
    tags: 'Next.js \u00B7 Chart.js \u00B7 Tailwind CSS',
  },
];

const engagementCards = [
  {
    title: 'Portfolio / Personal Website Build',
    bullets: [
      'Modern portfolio',
      'Responsive layout',
      'Smooth animations',
      'SEO basics',
      'Project case studies',
    ],
  },
  {
    title: 'Business / Corporate Website',
    bullets: [
      'Service pages',
      'Contact flow',
      'Trust sections',
      'Performance optimization',
      'Clean content structure',
    ],
  },
  {
    title: 'Interactive Landing Page',
    bullets: [
      '3D/WebGL hero',
      'Motion system',
      'Scroll-based sections',
      'Conversion-focused CTA',
    ],
  },
  {
    title: 'Dashboard / Web App UI',
    bullets: [
      'Data cards',
      'Responsive dashboard',
      'Component system',
      'Clean frontend architecture',
    ],
  },
];

const caseStudies = [
  {
    number: '01',
    category: 'Corporate \u00B7 Business Website',
    title: 'IBS Corporate Website',
    outcome:
      'Corporate business website designed for credibility, services, partners, and lead generation.',
    tags: 'Next.js \u00B7 TypeScript \u00B7 Tailwind CSS',
    href: '/work/ibs',
  },
  {
    number: '02',
    category: 'B2B Marketing \u00B7 Lead Generation',
    title: 'Corporate Lead-Gen Platform',
    outcome:
      'Corporate Lead-Gen Platform with modular sections, polished animations, and conversion-focused layout.',
    tags: 'React \u00B7 Next.js \u00B7 Framer Motion',
    href: '/work/corporate-leadgen-platform',
  },
];

const workItems = [
  {
    title: 'IBS',
    desc: 'IBS business website designed for credibility, services, partners, and lead generation.',
    tags: 'Next.js \u00B7 TypeScript \u00B7 Tailwind CSS',
    live: '#',
    caseStudy: '/work/ibs',
  },
  {
    title: 'Corporate Lead-Gen Platform',
    desc: 'Corporate Lead-Gen Platform with modular sections, polished animations, and conversion-focused layout.',
    tags: 'React \u00B7 Next.js \u00B7 Framer Motion',
    live: 'https://corporate-leadgen-platform-jet.vercel.app/',
    caseStudy: '/work/corporate-leadgen-platform',
  },
  {
    title: 'Aadi Card',
    desc: 'An interactive digital card experience with micro-animations and gesture-driven UI.',
    tags: 'React \u00B7 CSS Animations \u00B7 JavaScript',
    live: 'https://aadi-card.vercel.app/',
    caseStudy: '/work/aadi-card',
  },
  {
    title: 'Pulse Dashboard',
    desc: 'Pulse Dashboard, a real-time analytics interface with responsive data views.',
    tags: 'Next.js \u00B7 Chart.js \u00B7 Tailwind CSS',
    live: 'https://pulse-aadi-project.vercel.app/',
    caseStudy: '/work/pulse-dashboard',
  },
];

const processCards = [
  {
    number: '01',
    title: 'Understand the outcome',
    desc: 'I start by understanding what you actually need to ship and who it needs to reach.',
  },
  {
    number: '02',
    title: 'Design the system',
    desc: 'Layout, structure, interactions, and visual system — all planned before a single line of code.',
  },
  {
    number: '03',
    title: 'Build and polish',
    desc: 'Pixel-perfect implementation with real animations, responsive behaviour, and performance baked in.',
  },
  {
    number: '04',
    title: 'Ship clean',
    desc: 'Delivered code that is maintainable, well-structured, and production-ready from day one.',
  },
];

const specRows = [
  { label: 'Based', value: 'Delhi, India' },
  { label: 'Mode', value: 'Remote \u00B7 India / Intl' },
  { label: 'Engage', value: 'Freelance / Contract / Projects' },
  { label: 'Stack', value: 'React \u00B7 Next \u00B7 Three.js' },
  { label: 'Status', value: 'Available' },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      {/* ─── SECTION 1: HERO ─── */}
      <AnimatedSection className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        <motion.p
          variants={fadeUp}
          className="font-[family-name:var(--font-mono)] text-sm text-accent tracking-widest uppercase"
        >
          Front-End Developer &middot; UI/UX Designer &middot; Creative Engineer
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mt-6"
        >
          You have an idea.
          <br />
          I make it feel real.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-text-muted text-lg max-w-2xl mt-6"
        >
          I craft high-performance digital interfaces and immersive 3D web
          experiences that leave a lasting impression. Focused on immersive
          experiences, working remotely from India, turning ideas into
          interactive reality.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap gap-4 mt-8 items-center"
        >
          <Link
            href="/work"
            className="border border-border px-6 py-3 text-sm hover:border-accent transition-colors"
          >
            See the work &darr;
          </Link>
          <a
            href="mailto:hi.aditya.dev@gmail.com"
            className="bg-accent text-bg-primary px-6 py-3 text-sm font-medium hover:bg-accent-dark transition-colors"
          >
            Email me &rarr;
          </a>
          <a
            href="https://github.com/witejackel-eng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted text-sm hover:text-text-primary transition-colors underline"
          >
            GitHub &nearr;
          </a>
        </motion.div>

        {/* Developer spec card */}
        <motion.div
          variants={fadeUp}
          className="bg-bg-surface border border-border p-5 max-w-sm mt-8 rounded"
        >
          <p className="font-[family-name:var(--font-mono)] text-xs text-accent uppercase tracking-widest mb-3">
            Developer spec
          </p>
          <div className="flex flex-col gap-2">
            {specRows.map((row) => (
              <div key={row.label} className="flex gap-2">
                <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted shrink-0">
                  {row.label}:
                </span>
                <span className="text-sm text-text-primary">{row.value}</span>
              </div>
            ))}
          </div>
          <span className="bg-accent/10 text-accent border border-accent/30 px-3 py-1 text-xs font-[family-name:var(--font-mono)] rounded-full inline-block mt-3">
            Available for Projects
          </span>
        </motion.div>
      </AnimatedSection>

      {/* ─── SECTION 2: TECH MARQUEE ─── */}
      <div className="py-12 border-y border-border overflow-hidden">
        <div className="animate-marquee flex gap-8 whitespace-nowrap">
          <span className="text-text-muted/50 text-sm tracking-wide">
            {marqueeItems}
            {marqueeItems}
          </span>
          <span className="text-text-muted/50 text-sm tracking-wide" aria-hidden>
            {marqueeItems}
            {marqueeItems}
          </span>
        </div>
      </div>

      {/* ─── SECTION 3: PROOF, NOT ADJECTIVES ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.p
          variants={fadeUp}
          className="font-[family-name:var(--font-mono)] text-xs text-accent uppercase tracking-widest mb-4"
        >
          Proof, not adjectives
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold mb-12"
        >
          What I ship.
        </motion.h2>
        <div className="md:grid-cols-2 gap-4 grid">
          {projectCards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="bg-bg-surface border border-border p-6 hover:border-accent/30 transition-all duration-300 group"
            >
              <p className="font-[family-name:var(--font-mono)] text-xs text-accent mb-2">
                {card.category}
              </p>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-text-muted text-sm">{card.desc}</p>
              <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted mt-4">
                {card.tags}
              </p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── SECTION 4: TYPICAL ENGAGEMENTS ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold mb-12"
        >
          How you can hire me.
        </motion.h2>
        <div className="md:grid-cols-2 gap-4 grid">
          {engagementCards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="bg-bg-surface border border-border p-6"
            >
              <h3 className="text-lg font-bold mb-4">{card.title}</h3>
              <ul className="flex flex-col gap-2">
                {card.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="text-text-muted text-sm flex items-start gap-2"
                  >
                    <span className="text-accent mt-1 shrink-0">&#x25AA;</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/contact"
            className="text-accent hover:underline inline-block"
          >
            Start a project &rarr;
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ─── SECTION 5: SELECTED CASE STUDIES ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.p
          variants={fadeUp}
          className="font-[family-name:var(--font-mono)] text-xs text-accent uppercase tracking-widest mb-4"
        >
          Selected work
        </motion.p>
        <div className="flex flex-col gap-6">
          {caseStudies.map((study) => (
            <motion.div
              key={study.number}
              variants={fadeUp}
              className="border border-border p-6 md:p-8 hover:border-accent/30 transition-all group"
            >
              <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted">
                {study.number} &mdash; {study.category}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 group-hover:text-accent transition-colors">
                {study.title}
              </h3>
              <p className="text-text-muted mt-2">{study.outcome}</p>
              <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted mt-4">
                {study.tags}
              </p>
              <Link
                href={study.href}
                className="text-accent text-sm mt-4 inline-block hover:underline"
              >
                Read the full case &rarr;
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp} className="mt-8">
          <Link
            href="/work"
            className="text-accent hover:underline inline-block"
          >
            See all work &amp; projects &rarr;
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ─── SECTION 6: WHAT I ACTUALLY DO ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.p
          variants={fadeUp}
          className="font-[family-name:var(--font-mono)] text-xs text-accent uppercase tracking-widest"
        >
          What I actually do
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold mt-4 mb-6"
        >
          I turn unclear ideas into interfaces people can use.
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-text-muted max-w-2xl text-lg leading-relaxed"
        >
          Some projects start as a rough idea, a messy layout, or a website
          that does not feel good enough. I structure the page, design the
          interaction, build the frontend, and polish the experience until it
          feels clear, fast, and ready to show.
        </motion.p>

        <div className="mt-12 flex flex-col">
          {workItems.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="border-b border-border py-8 flex flex-col md:flex-row md:items-start gap-4 group"
            >
              <span className="font-[family-name:var(--font-mono)] text-text-muted text-sm shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm mt-1">{item.desc}</p>
                <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted mt-2">
                  {item.tags}
                </p>
              </div>
              <div className="flex gap-4 shrink-0 text-sm">
                <a
                  href={item.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Live &nearr;
                </a>
                <Link
                  href={item.caseStudy}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  Case study &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── SECTION 7: WHO YOU'D BE WORKING WITH ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold"
        >
          Who you&apos;d be working with
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-text-muted max-w-2xl text-lg mt-6 leading-relaxed"
        >
          I&apos;m Aditya &mdash; a Front-End Developer &amp; UI/UX Designer
          based in Delhi, India. I specialize in building high-performance,
          accessible, and visually compelling digital products. Every project
          starts from the same question: what does this interface need to do,
          and what is the fastest, clearest way to let it do that.
        </motion.p>
        <motion.p variants={fadeUp} className="text-text-muted mt-4">
          When I&apos;m not coding, I&apos;m exploring new design trends,
          gaming, or experimenting with creative coding and 3D web experiences.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8">
          <Link
            href="/about"
            className="text-accent hover:underline inline-block"
          >
            Read the full story &rarr;
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ─── SECTION 8: HOW I WORK ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <div className="md:grid-cols-2 lg:grid-cols-4 gap-4 grid">
          {processCards.map((step) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              className="bg-bg-surface border border-border p-6"
            >
              <span className="font-[family-name:var(--font-mono)] text-accent text-3xl font-bold">
                {step.number}
              </span>
              <h3 className="text-lg font-bold mt-2">{step.title}</h3>
              <p className="text-text-muted text-sm mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/contact"
            className="text-accent hover:underline inline-block"
          >
            Start a project &rarr;
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ─── SECTION 9: FINAL CTA ─── */}
      <AnimatedSection className="py-32 max-w-7xl mx-auto px-6 text-center">
        <motion.p
          variants={fadeUp}
          className="font-[family-name:var(--font-mono)] text-xs text-accent uppercase tracking-widest"
        >
          Let&apos;s talk
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-5xl font-bold mt-6"
        >
          Have something that needs to look and feel better?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-text-muted max-w-xl mx-auto mt-6"
        >
          Send the short version. I&apos;ll understand the project, the current
          problem, and what needs to ship.
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap gap-4 justify-center mt-10"
        >
          <a
            href="mailto:hi.aditya.dev@gmail.com"
            className="bg-accent text-bg-primary px-6 py-3 text-sm font-medium hover:bg-accent-dark transition-colors"
          >
            Send an email &rarr;
          </a>
          <a
            href="tel:+919310736542"
            className="border border-border px-6 py-3 text-sm hover:border-accent transition-colors"
          >
            Call me &rarr;
          </a>
          <a
            href="https://github.com/witejackel-eng"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border px-6 py-3 text-sm hover:border-accent transition-colors"
          >
            GitHub &nearr;
          </a>
        </motion.div>
      </AnimatedSection>
    </>
  );
}