'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { hasInstagram, INSTAGRAM_URL, getSampleEmailLink } from '@/config/socials';

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

function AnimatedSection({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();
  return (
    <motion.section
      ref={ref}
      id={id}
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
  { category: 'Creative Coding', title: 'DUST//SIGNAL', desc: 'A cinematic computational observatory where probability, mathematical systems, procedural sound, and motion become one interactive web experience.', tags: 'Next.js \u00B7 TypeScript \u00B7 Three.js \u00B7 GSAP', caseStudy: '/work/dust-signal' },
  { category: 'Legal Practice', title: 'Aarohan Legal', desc: 'An editorial website for an Indian boutique legal practice, shaped around professional restraint, original procedural visuals and a content system designed for careful legal review.', tags: 'Next.js \u00B7 TypeScript \u00B7 Three.js \u00B7 Framer Motion' },
];

const engagementCards = [
  { title: 'Portfolio / Personal Website Build', bullets: ['Modern portfolio', 'Responsive layout', 'Smooth animations', 'SEO basics', 'Project case studies'] },
  { title: 'Business / Corporate Website', bullets: ['Service pages', 'Contact flow', 'Trust sections', 'Performance optimization', 'Clean content structure'] },
  { title: 'Interactive Landing Page', bullets: ['3D/WebGL hero', 'Motion system', 'Scroll-based sections', 'Conversion-focused CTA'] },
  { title: 'Dashboard / Web App UI', bullets: ['Data cards', 'Responsive dashboard', 'Component system', 'Clean frontend architecture'] },
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

      {/* ─── SECTION 2.5: FREE HOMEPAGE SAMPLE ─── */}
      <AnimatedSection id="free-sample" className="py-20 bg-bg-surface-2 border-y border-border scroll-mt-[70px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left */}
            <div className="lg:col-span-7">
              <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
                Free Homepage Sample
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-text-primary leading-[1.1]">
                See the direction before you pay.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-text-muted text-base mt-4 leading-relaxed max-w-lg">
                Send me your current website, Instagram page or business details. I&rsquo;ll create one focused homepage hero concept showing how your website could look before you decide to hire me.
              </motion.p>
            </div>
            {/* Right - Compact offer panel */}
            <div className="lg:col-span-5">
              <motion.div variants={fadeUp} className="bg-bg-surface border border-border-hard shadow-hard p-6">
                <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-text-muted mb-3">
                  What you receive
                </p>
                <ul className="flex flex-col gap-2 mb-6">
                  <li className="text-sm text-text-primary flex items-start gap-2">
                    <span className="text-maroon mt-0.5 shrink-0 text-xs" aria-hidden="true">&#x25AA;</span>
                    <span>One custom homepage hero direction</span>
                  </li>
                  <li className="text-sm text-text-primary flex items-start gap-2">
                    <span className="text-maroon mt-0.5 shrink-0 text-xs" aria-hidden="true">&#x25AA;</span>
                    <span>One desktop visual concept</span>
                  </li>
                  <li className="text-sm text-text-primary flex items-start gap-2">
                    <span className="text-maroon mt-0.5 shrink-0 text-xs" aria-hidden="true">&#x25AA;</span>
                    <span>Suggested headline and call-to-action</span>
                  </li>
                  <li className="text-sm text-text-primary flex items-start gap-2">
                    <span className="text-maroon mt-0.5 shrink-0 text-xs" aria-hidden="true">&#x25AA;</span>
                    <span>A clear visual direction for the full website</span>
                  </li>
                  <li className="text-sm text-text-muted flex items-start gap-2">
                    <span className="text-text-muted mt-0.5 shrink-0 text-xs" aria-hidden="true">&#x25AA;</span>
                    <span>No editable source files or production code</span>
                  </li>
                  <li className="text-sm text-text-muted flex items-start gap-2">
                    <span className="text-text-muted mt-0.5 shrink-0 text-xs" aria-hidden="true">&#x25AA;</span>
                    <span>No obligation to continue</span>
                  </li>
                </ul>
                {hasInstagram() ? (
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label='DM "SAMPLE" on Instagram — opens in a new tab'
                    className="w-full bg-maroon text-white border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors block text-center"
                  >
                    DM &ldquo;SAMPLE&rdquo; ON INSTAGRAM &rarr;
                  </a>
                ) : (
                  <a
                    href={getSampleEmailLink()}
                    aria-label="Request free homepage sample by email"
                    className="w-full bg-maroon text-white border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors block text-center"
                  >
                    REQUEST FREE SAMPLE BY EMAIL &rarr;
                  </a>
                )}
                <p className="text-xs text-text-muted leading-relaxed mt-4">
                  Send your business name, current website or Instagram page, what you offer, and what feels wrong with the current website.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

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
              <h3 className="text-xl font-bold mb-2 text-text-primary">{card.caseStudy ? <Link href={card.caseStudy} className="hover:text-maroon transition-colors duration-200">{card.title}</Link> : card.title}</h3>
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

      {/* ─── SECTION 5: WHO YOU'D BE WORKING WITH ─── */}
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