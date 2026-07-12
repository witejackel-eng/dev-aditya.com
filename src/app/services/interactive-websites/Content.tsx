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
  { label: 'Creative Brands & Agencies', desc: 'Brands that want a website experience, not just a website. Agencies and studios that need an interactive portfolio or showcase that sets them apart.' },
  { label: 'Hospitality & Lifestyle', desc: 'Restaurants, cafés, hotels, and lifestyle brands where the website should evoke the same atmosphere as the physical space.' },
  { label: 'Product & Brand Launches', desc: 'Product launches and brand campaigns that need a memorable, shareable web experience that creates buzz and drives engagement.' },
];

const deliverables = [
  'Interactive website with WebGL, 3D, or advanced motion design',
  'Scroll-driven animations and choreography using GSAP or Framer Motion',
  'WebGL hero scenes with custom geometry, shaders, and lighting',
  'Responsive interactive experiences that work on mobile (with graceful fallbacks)',
  'Accessibility: prefers-reduced-motion support, static poster fallbacks, keyboard navigation',
  'Performance optimization — adaptive DPR, lazy loading, geometry optimization',
  'SEO-friendly architecture — per-route metadata, structured data, sitemap',
  'Analytics and engagement tracking setup',
];

const processSteps = [
  { num: '01', title: 'Mood & Narrative', desc: 'I learn your brand story, visual direction, and the emotional experience you want visitors to have. We define the interactive narrative before any design or code begins.' },
  { num: '02', title: 'Design & Prototype', desc: 'I design the visual system and prototype key interactive moments — the hero scene, scroll sequences, and transitions. You experience the direction before full development.' },
  { num: '03', title: 'Build', desc: 'I develop the production experience with WebGL scenes, scroll choreography, and responsive layouts. Performance and accessibility are built in from the start, not bolted on.' },
  { num: '04', title: 'Polish & Launch', desc: 'I optimize performance across devices, implement reduced-motion fallbacks, run final QA, and deploy. The experience works beautifully for every visitor.' },
];

const relatedProjects = [
  { title: 'Saffron & Steam Experience', desc: 'Portfolio project — An immersive café website with WebGL hero featuring a sculptural ceramic cup, steam ribbon, and day-to-night scroll sequences.', href: '/work/saffron-steam-experience' },
  { title: 'Real Estate Atelier', desc: 'Portfolio project — A cinematic luxury real estate platform with custom cursor, page loader, and GSAP-powered animations.', href: '/work/real-estate-atelier' },
];

const relatedResources = [
  { title: 'Portfolio Website Checklist', desc: 'A practical checklist for making a portfolio look credible, fast, and client-ready.', href: '/resources/portfolio-checklist' },
];

const faqItems = [
  {
    q: 'Will an interactive website be slow on mobile?',
    a: 'Not if it\'s built correctly. I use adaptive DPR (rendering at lower resolution on mobile), geometry optimization, and lazy loading to keep performance smooth. I also implement static poster fallbacks for devices that prefer reduced motion or can\'t handle WebGL.',
  },
  {
    q: 'What is the difference between interactive and standard websites?',
    a: 'A standard website presents information — text, images, and links. An interactive website creates an experience — scroll-driven narratives, 3D scenes, motion choreography, and moments that make visitors remember the brand. It\'s the difference between reading about a café and feeling the warmth of golden hour.',
  },
  {
    q: 'Do interactive websites work for SEO?',
    a: 'Yes, when built correctly. I use server-side rendering for the HTML content, proper heading structure, meta information, and structured data. The interactive layer enhances the experience without replacing the crawlable content. Search engines see a complete, well-structured page.',
  },
  {
    q: 'What technologies do you use for interactive websites?',
    a: 'I primarily use Three.js / React Three Fiber for WebGL and 3D, GSAP for scroll choreography and complex animations, and Framer Motion for React-native interaction patterns. All built on Next.js for performance and SEO.',
  },
  {
    q: 'How much does an interactive website cost?',
    a: 'Interactive websites require more design and development time than standard sites due to 3D work, animation choreography, and cross-device optimization. View my packages for base pricing, and I\'ll provide a specific quote after understanding your requirements.',
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
          Interactive & Immersive Website Development
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">
          Websites with WebGL, scroll choreography, and motion design that create memorable experiences. For brands that want visitors to feel something — not just read something.
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
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mt-4">Interactive website packages.</h3>
          <p className="text-text-muted text-base mt-3 leading-relaxed max-w-xl">
            Interactive projects are scoped based on complexity of 3D/WebGL work, animation sequences, and cross-device optimization requirements. View base packages for reference.
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
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Common questions about interactive websites.</motion.h2>
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
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Want an interactive web experience?</h2>
          <p className="text-text-muted text-base mt-4 leading-relaxed max-w-xl">
            Tell me about the experience you want visitors to have. I&apos;ll design the narrative and build the technology to make it real.
          </p>
          <a href="mailto:hi.aditya.dev@gmail.com" className="inline-block mt-8 bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200">
            EMAIL ME &rarr;
          </a>
        </motion.div>
      </section>
    </>
  );
}
