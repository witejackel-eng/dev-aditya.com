'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};


function useReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
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
const marqueeItems = 'React \u25C6 Next.js \u25C6 TypeScript \u25C6 Tailwind CSS \u25C6 Framer Motion \u25C6 GSAP \u25C6 Three.js \u25C6 WebGL \u25C6 Node.js \u25C6 Express \u25C6 MongoDB \u25C6 PostgreSQL \u25C6 REST APIs \u25C6 ';

const projectCards = [
  { category: 'Immersive Experience', title: 'Saffron & Steam', desc: 'An immersive café website with WebGL hero, editorial typography, and day-to-night scroll sequences.', tags: 'Next.js \u00B7 TypeScript \u00B7 Three.js \u00B7 GSAP' },
  { category: 'B2B Marketing Platform', title: 'Corporate Lead-Gen Platform', desc: 'Corporate Lead-Gen Platform with modular sections, polished animations, and conversion-focused layout.', tags: 'React \u00B7 Next.js \u00B7 Framer Motion' },
  { category: 'E-commerce', title: 'Driftwear Studio', desc: 'An editorial e-commerce experience for relaxed clothing with full cart flow and Razorpay integration.', tags: 'Next.js \u00B7 TypeScript \u00B7 Zustand \u00B7 Tailwind CSS' },
  { category: 'Real Estate', title: 'Real Estate Atelier', desc: 'A premium real estate advisory website with curated property collections and cinematic editorial design.', tags: 'Next.js \u00B7 TypeScript \u00B7 GSAP \u00B7 Framer Motion' },
];

const engagementCards = [
  { title: 'Portfolio / Personal Website Build', bullets: ['Modern portfolio', 'Responsive layout', 'Smooth animations', 'SEO basics', 'Project case studies'] },
  { title: 'Business / Corporate Website', bullets: ['Service pages', 'Contact flow', 'Trust sections', 'Performance optimization', 'Clean content structure'] },
  { title: 'Interactive Landing Page', bullets: ['3D/WebGL hero', 'Motion system', 'Scroll-based sections', 'Conversion-focused CTA'] },
  { title: 'Dashboard / Web App UI', bullets: ['Data cards', 'Responsive dashboard', 'Component system', 'Clean frontend architecture'] },
];

const caseStudies = [
  { number: '01', category: 'Immersive \u00B7 Hospitality Experience', title: 'Saffron & Steam', outcome: 'An immersive café website with WebGL hero, editorial typography, and day-to-night scroll sequences.', tags: 'Next.js \u00B7 TypeScript \u00B7 Three.js \u00B7 GSAP', href: '/work/saffron-steam-experience' },
  { number: '02', category: 'B2B Marketing \u00B7 Lead Generation', title: 'Corporate Lead-Gen Platform', outcome: 'Corporate Lead-Gen Platform with modular sections, polished animations, and conversion-focused layout.', tags: 'React \u00B7 Next.js \u00B7 Framer Motion', href: '/work/corporate-leadgen-platform' },
];

const workItems = [
  { title: 'Saffron & Steam', desc: 'An immersive café website with WebGL hero, editorial typography, and day-to-night scroll sequences.', tags: 'Next.js \u00B7 TypeScript \u00B7 Three.js \u00B7 GSAP', live: 'https://saffron-steam-experience.vercel.app/', caseStudy: '/work/saffron-steam-experience' },
  { title: 'Corporate Lead-Gen Platform', desc: 'Corporate Lead-Gen Platform with modular sections, polished animations, and conversion-focused layout.', tags: 'React \u00B7 Next.js \u00B7 Framer Motion', live: 'https://corporate-leadgen-platform-jet.vercel.app/', caseStudy: '/work/corporate-leadgen-platform' },
  { title: 'Driftwear Studio', desc: 'An editorial e-commerce experience for relaxed clothing with full cart flow and Razorpay integration.', tags: 'Next.js \u00B7 TypeScript \u00B7 Zustand \u00B7 Tailwind CSS', live: 'https://driftwear-ecommerce.vercel.app/', caseStudy: '/work/driftwear-ecommerce' },
  { title: 'Real Estate Atelier', desc: 'A premium real estate advisory website with curated property collections and cinematic editorial design.', tags: 'Next.js \u00B7 TypeScript \u00B7 GSAP \u00B7 Framer Motion', live: 'https://real-estate-atelier.vercel.app/', caseStudy: '/work/real-estate-atelier' },
];

const processCards = [
  { number: '01', title: 'Understand the outcome', desc: 'Before design or code, I clarify what the page needs to achieve: trust, leads, clarity, speed, or a better product impression.' },
  { number: '02', title: 'Design the system', desc: 'I turn rough ideas into layouts, sections, components, spacing, typography, and motion rules.' },
  { number: '03', title: 'Build and polish', desc: 'I build the frontend, wire interactions, optimize responsiveness, and make the page feel smooth on real devices.' },
  { number: '04', title: 'Ship clean', desc: 'I check performance, accessibility, SEO basics, links, mobile layout, and final deployment readiness.' },
];

const specRows = [
  { label: 'BASED', value: 'Delhi, India' },
  { label: 'MODE', value: 'Remote \u00B7 India / Intl' },
  { label: 'ENGAGE', value: 'Freelance / Projects' },
  { label: 'STACK', value: 'React \u00B7 Next \u00B7 Three.js' },
  { label: 'STATUS', value: 'Available' },
];

/* ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <>
      {/* ─── SECTION 1: HERO ─── */}
      <section className="pt-[100px] pb-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left column */}
          <div className="lg:col-span-7">
            <AnimatedSection>
              <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
                <span className="w-3 h-3 bg-maroon inline-block" />
                <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted tracking-widest uppercase">
                  FRONT-END DEVELOPER &middot; UI/UX DESIGNER &middot; CREATIVE ENGINEER
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase tracking-tighter leading-[0.95]"
              >
                <span className="block text-text-primary">YOU HAVE</span>
                <span className="block text-text-primary">AN IDEA.</span>
                <span className="inline-block bg-maroon text-white px-2 py-0.5 mt-1">I MAKE IT</span>
                <span className="block text-text-primary">REAL.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-text-muted text-base md:text-lg max-w-xl mt-8 leading-relaxed"
              >
                I craft high-performance digital interfaces and immersive web experiences that turn rough ideas into polished, interactive products.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-8 items-center">
                <Link
                  href="/work"
                  className="bg-white text-text-primary border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 shadow-hard-sm"
                >
                  SEE THE WORK &darr;
                </Link>
                <a
                  href="mailto:hi.aditya.dev@gmail.com"
                  className="bg-maroon text-white border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200"
                >
                  EMAIL ME &rarr;
                </a>
                <a
                  href="https://github.com/witejackel-eng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary text-sm underline underline-offset-4 hover:text-maroon transition-colors duration-200"
                >
                  GITHUB &nearr;
                </a>
              </motion.div>
            </AnimatedSection>
          </div>

          {/* Right column — Spec card */}
          <div className="lg:col-span-5 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            >
              <div className="bg-white border border-border-hard shadow-hard relative">
                {/* Side badge */}
                <div className="absolute -right-3 top-4 bg-text-primary text-white px-2 py-4 flex flex-col items-center gap-1 z-10">
                  <span className="text-xs font-bold">A.</span>
                  <span className="text-[8px] uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>Portfolio</span>
                </div>

                {/* Title bar */}
                <div className="bg-maroon text-white border-b border-border-hard px-5 py-3">
                  <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest font-medium">
                    DEVELOPER SPEC
                  </span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border">
                  {specRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-3">
                      <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-wider">
                        {row.label}
                      </span>
                      <span className="text-sm text-text-primary font-medium">
                        {row.value}
                        {row.label === 'STATUS' && (
                          <span className="inline-block w-2 h-2 rounded-full bg-green-600 ml-2 align-middle" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: TECH MARQUEE ─── */}
      <div className="py-10 border-y border-border overflow-hidden">
        <div className="animate-marquee flex gap-8 whitespace-nowrap">
          <span className="text-text-muted/40 text-sm tracking-wide">{marqueeItems}{marqueeItems}</span>
          <span className="text-text-muted/40 text-sm tracking-wide" aria-hidden>{marqueeItems}{marqueeItems}</span>
        </div>
      </div>

      {/* ─── SECTION 3: PROOF, NOT ADJECTIVES ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
          Proof, not adjectives
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-12 text-text-primary">
          What I ship.
        </motion.h2>
        <div className="md:grid-cols-2 gap-4 grid">
          {projectCards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="bg-white border border-border-hard p-6 hover:-translate-y-1 hover:shadow-hard-hover transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-maroon opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <p className="font-[family-name:var(--font-mono)] text-[11px] text-maroon uppercase tracking-widest mb-2">
                {card.category}
              </p>
              <h3 className="text-xl font-bold mb-2 text-text-primary">{card.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{card.desc}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {card.tags.split(' \u00B7 ').map((tag) => (
                  <span key={tag} className="bg-maroon-soft text-maroon font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── SECTION 4: TYPICAL ENGAGEMENTS ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-12 text-text-primary">
          How you can hire me.
        </motion.h2>
        <div className="md:grid-cols-2 gap-4 grid">
          {engagementCards.map((card) => (
            <motion.div key={card.title} variants={fadeUp} className="bg-white border border-border-hard p-6 shadow-hard-sm">
              <h3 className="text-lg font-bold mb-4 text-text-primary">{card.title}</h3>
              <ul className="flex flex-col gap-2">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="text-text-muted text-sm flex items-start gap-2">
                    <span className="text-maroon mt-1 shrink-0">&#x25AA;</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp} className="mt-10">
          <Link href="/contact" className="text-maroon hover:underline inline-block font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
            Start a project &rarr;
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ─── SECTION 4.5: WEBSITE PACKAGES ─── */}
      <section className="border-t border-border-hard">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <AnimatedSection className="mb-0">
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-maroon inline-block" />
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted tracking-widest uppercase">
                Pricing
              </span>
            </motion.div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
                  Website Packages
                </motion.h2>
                <motion.p variants={fadeUp} className="text-text-muted max-w-xl mt-3 leading-relaxed">
                  Clear scope, transparent pricing, no hidden costs. Every package includes responsive design, clean code, and deployment.
                </motion.p>
              </div>
              <motion.div variants={fadeUp}>
                <Link href="/packages" className="text-maroon hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
                  View full details &rarr;
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* 3 Package Cards */}
          <AnimatedSection className="mb-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Starter */}
              <motion.div variants={fadeUp} className="bg-bg-surface border border-border-hard p-6 md:p-7 shadow-hard-sm hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-widest">01</span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest bg-maroon-soft px-2.5 py-1 font-medium">Starter</span>
                </div>
                <p className="text-3xl font-black text-text-primary tracking-tight">₹14,999</p>
                <p className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted mt-1">Starting price</p>
                <p className="text-text-muted text-sm leading-relaxed mt-4 mb-6">
                  A clean, professional single-page website designed to establish your online presence fast.
                </p>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {['1 landing page / single-page site', 'Responsive design (mobile, tablet, desktop)', 'Basic SEO meta tags & Open Graph', 'Contact form / CTA integration', 'Up to 2 rounds of revisions', '1 week delivery'].map((item) => (
                    <li key={item} className="text-text-muted text-[13px] flex items-start gap-2.5">
                      <span className="text-maroon mt-0.5 shrink-0 text-xs">&#x2713;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="mailto:hi.aditya.dev@gmail.com?subject=Starter Package Inquiry" className="block text-center bg-white text-text-primary border border-border-hard px-5 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200">
                  GET STARTED &rarr;
                </a>
              </motion.div>

              {/* Business — Featured */}
              <motion.div variants={fadeUp} className="bg-bg-surface border-2 border-border-hard p-6 md:p-7 shadow-hard hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200 flex flex-col relative">
                <div className="absolute -top-3 left-6 bg-maroon text-white px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest font-medium border border-border-hard">
                  Most Popular
                </div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-widest">02</span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest bg-maroon-soft px-2.5 py-1 font-medium">Business</span>
                </div>
                <p className="text-3xl font-black text-text-primary tracking-tight">₹34,999</p>
                <p className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted mt-1">Starting price</p>
                <p className="text-text-muted text-sm leading-relaxed mt-4 mb-6">
                  A multi-page business website built for credibility, lead generation, and clear communication of your services.
                </p>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {['Up to 5 pages (Home, About, Services, etc.)', 'Responsive + cross-browser tested', 'Full SEO setup (meta, sitemap, schema)', 'Contact form with spam protection', 'Smooth scroll animations', 'Up to 3 rounds of revisions', '2–3 week delivery'].map((item) => (
                    <li key={item} className="text-text-muted text-[13px] flex items-start gap-2.5">
                      <span className="text-maroon mt-0.5 shrink-0 text-xs">&#x2713;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="mailto:hi.aditya.dev@gmail.com?subject=Business Package Inquiry" className="block text-center bg-maroon text-white border border-border-hard px-5 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors duration-200">
                  GET STARTED &rarr;
                </a>
              </motion.div>

              {/* Premium */}
              <motion.div variants={fadeUp} className="bg-bg-surface border border-border-hard p-6 md:p-7 shadow-hard-sm hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-widest">03</span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest bg-maroon-soft px-2.5 py-1 font-medium">Premium</span>
                </div>
                <p className="text-3xl font-black text-text-primary tracking-tight">₹74,999</p>
                <p className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted mt-1">Starting price</p>
                <p className="text-text-muted text-sm leading-relaxed mt-4 mb-6">
                  A full-scale web experience with custom interactions, advanced animations, and polished production quality.
                </p>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {['Unlimited pages with full navigation', 'Custom UI/UX design system', 'Advanced animations (scroll, micro, page transitions)', 'Performance optimization (Core Web Vitals)', 'CMS / dynamic content integration', 'Up to 5 rounds of revisions', '3–5 week delivery', 'Priority support for 2 weeks post-launch'].map((item) => (
                    <li key={item} className="text-text-muted text-[13px] flex items-start gap-2.5">
                      <span className="text-maroon mt-0.5 shrink-0 text-xs">&#x2713;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="mailto:hi.aditya.dev@gmail.com?subject=Premium Package Inquiry" className="block text-center bg-white text-text-primary border border-border-hard px-5 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200">
                  GET STARTED &rarr;
                </a>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Add-ons strip */}
          <AnimatedSection className="mt-14 mb-0">
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-widest mb-5">Available Add-ons</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Extra Page', price: '₹2,999/page' },
                { name: 'CMS Integration', price: '₹9,999' },
                { name: 'Custom Animations', price: '₹7,999' },
                { name: 'Performance Audit', price: '₹4,999' },
              ].map((addon) => (
                <motion.div key={addon.name} variants={fadeUp} className="bg-bg-surface-2 border border-border p-4">
                  <p className="text-sm font-medium text-text-primary">{addon.name}</p>
                  <p className="font-[family-name:var(--font-mono)] text-[11px] text-maroon mt-1">{addon.price}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── SECTION 5: SELECTED CASE STUDIES ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
          Selected work
        </motion.p>
        <div className="flex flex-col gap-6">
          {caseStudies.map((study) => (
            <motion.div
              key={study.number}
              variants={fadeUp}
              className="bg-white border border-border-hard p-6 md:p-8 hover:-translate-y-1 hover:shadow-hard-hover transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-full h-1 bg-maroon opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted">
                {study.number} &mdash; {study.category}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 text-text-primary group-hover:text-maroon transition-colors duration-200">
                {study.title}
              </h3>
              <p className="text-text-muted mt-2">{study.outcome}</p>
              <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted mt-4">{study.tags}</p>
              <Link href={study.href} className="text-maroon text-sm mt-4 inline-block hover:underline font-[family-name:var(--font-mono)] uppercase tracking-widest">
                Read the full case &rarr;
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp} className="mt-8">
          <Link href="/work" className="text-maroon hover:underline inline-block font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
            See all work &amp; projects &rarr;
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ─── SECTION 6: WHAT I ACTUALLY DO ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">
          What I actually do
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-text-primary">
          I turn unclear ideas into interfaces people can use.
        </motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted max-w-2xl text-lg leading-relaxed">
          Some projects start as a rough idea, a messy layout, or a website that does not feel good enough. I structure the page, design the interaction, build the frontend, and polish the experience until it feels clear, fast, and ready to show.
        </motion.p>

        <div className="mt-12 flex flex-col">
          {workItems.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="border-b border-border py-8 flex flex-col md:flex-row md:items-start gap-4 group"
            >
              <span className="font-[family-name:var(--font-mono)] text-text-muted text-sm shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-text-primary group-hover:text-maroon transition-colors duration-200">{item.title}</h3>
                <p className="text-text-muted text-sm mt-1 leading-relaxed">{item.desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.split(' \u00B7 ').map((tag) => (
                    <span key={tag} className="bg-maroon-soft text-maroon font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 shrink-0 text-sm">
                <a href={item.live} target="_blank" rel="noopener noreferrer" className="text-maroon hover:underline font-[family-name:var(--font-mono)] uppercase tracking-widest text-xs">
                  VIEW PROJECT &rarr;
                </a>
                <Link href={item.caseStudy} className="text-text-muted hover:text-text-primary transition-colors font-[family-name:var(--font-mono)] uppercase tracking-widest text-xs">
                  CASE STUDY &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── SECTION 7: WHO YOU'D BE WORKING WITH ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-text-primary">
          Who you&apos;d be working with
        </motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted max-w-2xl text-lg mt-6 leading-relaxed">
          I&apos;m Aditya &mdash; a Front-End Developer &amp; UI/UX Designer based in Delhi, India. I specialize in building high-performance, accessible, and visually compelling digital products. Every project starts from the same question: what does this interface need to do, and what is the fastest, clearest way to let it do that.
        </motion.p>
        <motion.p variants={fadeUp} className="text-text-muted mt-4 leading-relaxed">
          When I&apos;m not coding, I&apos;m exploring new design trends, gaming, or experimenting with creative coding and 3D web experiences.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8">
          <Link href="/about" className="text-maroon hover:underline inline-block font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
            Read the full story &rarr;
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ─── SECTION 8: HOW I WORK ─── */}
      <AnimatedSection className="py-24 max-w-7xl mx-auto px-6">
        <div className="md:grid-cols-2 lg:grid-cols-4 gap-4 grid">
          {processCards.map((step) => (
            <motion.div key={step.number} variants={fadeUp} className="bg-white border border-border-hard p-6 shadow-hard-sm">
              <span className="font-[family-name:var(--font-mono)] text-maroon text-3xl font-bold">{step.number}</span>
              <h3 className="text-lg font-bold mt-2 text-text-primary">{step.title}</h3>
              <p className="text-text-muted text-sm mt-2 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp} className="mt-10">
          <Link href="/contact" className="text-maroon hover:underline inline-block font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
            Start a project &rarr;
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ─── SECTION 9: FINAL CTA ─── */}
      <AnimatedSection className="py-32 max-w-7xl mx-auto px-6 text-center">
        <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">
          Let&apos;s talk
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold mt-6 text-text-primary">
          Have something that needs to look and feel better?
        </motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted max-w-xl mx-auto mt-6">
          Send the short version. I&apos;ll understand the project, the current problem, and what needs to ship.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center mt-10">
          <a
            href="mailto:hi.aditya.dev@gmail.com"
            className="bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200"
          >
            SEND AN EMAIL &rarr;
          </a>
          <a
            href="tel:+919310736542"
            className="bg-white text-text-primary border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200"
          >
            CALL ME &rarr;
          </a>
          <a
            href="https://github.com/witejackel-eng"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-text-primary border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200"
          >
            GITHUB &nearr;
          </a>
        </motion.div>
      </AnimatedSection>
    </>
  );
}