'use client';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.section ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.section>
  );
}

/* ─── Data ─── */
const projects = [
  { num: '01', category: 'Immersive · Hospitality Experience', title: 'Saffron & Steam', desc: 'An immersive, motion-led concept café website with a WebGL hero scene featuring a sculptural ceramic cup and flowing saffron steam ribbon, editorial typography, day-to-night scroll sequences, and an interactive signature-menu rail — built around a Delhi garden café at golden hour.', stack: 'Next.js · TypeScript · Three.js · GSAP · Tailwind CSS', live: 'https://saffron-steam-experience.vercel.app/', caseStudy: '/work/saffron-steam-experience', github: 'https://github.com/witejackel-eng/saffron-steam-experience', outcome: 'Immersive café experience blending WebGL, editorial design, and scroll choreography', role: 'Frontend, UI Design, 3D/WebGL, Animations' },
  { num: '02', category: 'B2B \u00B7 Marketing Site', title: 'Corporate Lead-Gen Platform', desc: 'A high-conversion marketing platform with modular content system, built for a sales team to launch campaign pages without touching code. Designed with a component-driven architecture that keeps every page consistent.', stack: 'React \u00B7 Next.js \u00B7 Framer Motion', live: 'https://corporate-leadgen-platform-jet.vercel.app/', caseStudy: '/work/corporate-leadgen-platform', github: 'https://github.com/witejackel-eng/corporate-leadgen-platform', outcome: 'Modular system enabling non-technical team to ship pages independently', role: 'Frontend Architecture, UI System' },
  { num: '03', category: 'Experimental · Creative Technology', title: 'DUST//SIGNAL', desc: 'An original computational observatory exploring probability, uncertainty, rhythm, and motion. The experience combines mathematical simulations, cinematic interaction, procedural graphics, and an optional house-inspired sound system across a connected multi-route digital world.', stack: 'Next.js · TypeScript · Three.js · GSAP · Web Audio API · Tailwind CSS', live: 'https://dune-aditya.vercel.app/', caseStudy: '/work/dust-signal', github: 'https://github.com/witejackel-eng/dune', outcome: 'A distinctive interactive experience connecting quantitative mathematics, generative visuals, and procedural sound within one coherent visual system.', role: 'Creative Direction, UI/UX, Frontend Development, Motion, Generative Systems' },
  { num: '04', category: 'Legal · Boutique Practice', title: 'Aarohan Legal', desc: 'A restrained editorial website for an Indian boutique legal practice. The experience combines a procedural WebGL sculpture, custom practice-area illustrations, full-screen navigation and a carefully governed legal-content system without relying on stock photography, fabricated credentials, testimonials or promotional case-result claims.', stack: 'Next.js · TypeScript · Three.js · React Three Fiber · Framer Motion · Zod', live: 'https://aarohan-legal.vercel.app/', caseStudy: '/work/aarohan-legal', github: 'https://github.com/witejackel-eng/aarohan-legal', outcome: 'An original legal-practice experience balancing editorial character, professional restraint, accessibility and controlled content publishing', role: 'Brand Direction, UI/UX, Frontend, WebGL, Content Architecture' },
];

const stats = [
  { value: '4+', label: 'Shipped Projects' },
  { value: '100%', label: 'Frontend Focus' },
  { value: '3+', label: 'Tech Stacks' },
  { value: 'Remote', label: 'Delhi, India \u2192 Worldwide' },
];

const capabilities = [
  { title: 'Frontend Architecture', desc: 'Component systems, state management, and scalable codebases that don\'t collapse when requirements shift. Every project ships with clean, maintainable structure.' },
  { title: 'UI/UX Design', desc: 'Layouts, spacing, typography, and interaction flows designed for clarity \u2014 not decoration. Interfaces that communicate before the user reads a word.' },
  { title: 'Motion & Interaction', desc: 'Scroll-driven animations, micro-interactions, and transition systems that make interfaces feel responsive and intentional rather than decorative.' },
  { title: 'Performance Engineering', desc: 'Core Web Vitals, lazy loading, image optimization, and rendering strategies for production-speed pages. Speed is a feature, not an afterthought.' },
];

const faqItems = [
  { q: 'What kind of projects do you take on?', a: 'I focus on frontend-heavy projects: corporate websites, marketing platforms, interactive landing pages, dashboards, and web applications. If it has a screen and needs to look and feel professional, it\'s likely in my wheelhouse.' },
  { q: 'Do you work with existing designs, or do you design too?', a: 'Both. If you have Figma files or a brand system, I\'ll build faithfully to it. If you don\'t, I\'ll design the interface myself \u2014 layouts, typography, spacing, motion \u2014 and ship the frontend code.' },
  { q: 'What is your tech stack?', a: 'Primarily React, Next.js, and TypeScript. Tailwind CSS for styling. Framer Motion or CSS animations for interaction. I pick the right tool for each project rather than forcing a single stack.' },
  { q: 'How long does a typical project take?', a: 'A focused landing page or portfolio can ship in 1\u20132 weeks. A full corporate website or dashboard typically takes 2\u20134 weeks depending on scope and revision cycles.' },
  { q: 'Can I see the code before delivery?', a: 'Yes. I push code to a private GitHub repository so you can track progress, review commits, and request changes at any point during the build.' },
  { q: 'Do you work with international clients?', a: 'Yes. I\'m based in Delhi, India and work remotely with clients across time zones. Async communication works well for my workflow.' },
];

/* ─── FAQ Accordion ─── */
function FAQ({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group" aria-expanded={open}>
        <span className="flex items-start gap-5">
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted/50 mt-0.5 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
          <span className="text-[15px] font-medium text-text-primary group-hover:text-maroon transition-colors duration-200 leading-snug">{q}</span>
        </span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.15 }} className="text-text-muted text-xl shrink-0 mt-[-2px] font-light" aria-hidden="true">+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }} className="overflow-hidden">
            <p className="pl-[3.25rem] pb-6 text-text-muted text-[14px] leading-[1.7] max-w-2xl">{a}</p>
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
      {/* ═══ HERO ═══ */}
      <section className="pt-[100px] pb-0">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20 border-b border-border-hard">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex items-center gap-3 mb-8">
            <span className="w-3 h-3 bg-maroon inline-block" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Selected Work</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.8rem,6.5vw,5.5rem)] font-black uppercase tracking-[-0.03em] leading-[0.95] text-text-primary max-w-5xl"
          >
            Projects built
            <br />for clarity,
            <br />performance,{' '}
            <span className="inline-block bg-maroon text-white px-3 py-1 mt-1 align-middle">and real use.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-text-muted text-lg md:text-xl max-w-[540px] mt-8 leading-[1.7]"
          >
            A curated selection of websites, web apps, and interface systems — each designed and built to solve a real problem for a real user.
          </motion.p>
        </div>
      </section>

      {/* ═══ PROOF STRIP ═══ */}
      <section className="border-b border-border-hard">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-border">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.05 }}
                className="py-7 md:py-9 px-5 md:px-7"
              >
                <p className="text-3xl md:text-[2.5rem] font-black text-text-primary tracking-tight leading-none">{s.value}</p>
                <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.15em] mt-2.5 leading-none">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CASE STUDIES ═══ */}
      <Reveal className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-14 border-b border-border-hard pb-6">
          <div>
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-[0.2em]">Portfolio</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary mt-2">Case Studies</h2>
          </div>
          <span className="hidden sm:block font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.15em] pb-1">
            {projects.length} Projects
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <motion.div
              key={p.num}
              variants={fadeUp}
              className="bg-bg-surface border border-border-hard shadow-hard-sm group relative overflow-hidden hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200"
            >
              {/* Maroon top line on hover */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-maroon scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="p-6 md:p-7 pb-5 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted/60">{p.num}</span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-[0.12em] font-medium">{p.category}</span>
                </div>
                <Link href={p.caseStudy} className="block group/link">
                  <h3 className="text-2xl md:text-[1.7rem] font-black text-text-primary group-hover/link:text-maroon transition-colors duration-200 leading-[1.15] tracking-tight">
                    {p.title}
                  </h3>
                </Link>
              </div>

              <div className="p-6 md:p-7 pt-5">
                <p className="text-text-muted text-sm leading-[1.7]">{p.desc}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-border">
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-muted/60 uppercase tracking-[0.15em] mb-1.5">Outcome</p>
                    <p className="text-[13px] text-text-primary leading-snug">{p.outcome}</p>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-muted/60 uppercase tracking-[0.15em] mb-1.5">Role</p>
                    <p className="text-[13px] text-text-primary leading-snug">{p.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-5">
                  {p.stack.split(' \u00B7 ').map((tag) => (
                    <span key={tag} className="bg-maroon-soft text-maroon font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 font-medium">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center gap-6 mt-6 pt-5 border-t border-border">
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-[11px] text-maroon hover:underline font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] font-medium">VIEW LIVE &rarr;</a>
                  <Link href={p.caseStudy} className="text-[11px] text-text-muted hover:text-text-primary transition-colors font-[family-name:var(--font-mono)] uppercase tracking-[0.12em]">CASE STUDY &rarr;</Link>
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-[11px] text-text-muted hover:text-text-primary transition-colors font-[family-name:var(--font-mono)] uppercase tracking-[0.12em]">GITHUB &rarr;</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* ═══ CAPABILITIES ═══ */}
      <section className="border-t border-border-hard bg-bg-surface-2">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <Reveal className="mb-0">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-maroon inline-block" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">What I bring to each project</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary max-w-3xl leading-[1.1]">
              Every project gets the same level of intent.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-muted text-base md:text-lg max-w-2xl mt-5 leading-[1.7]">
              These projects represent what I do best: take a goal, turn it into a clear interface, and ship it so it works on every device, loads fast, and feels right to use.
            </motion.p>
          </Reveal>

          <Reveal className="mt-14 mb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {capabilities.map((c) => (
                <motion.div key={c.title} variants={fadeUp} className="bg-bg-surface border border-border-hard p-6 md:p-7 shadow-hard-sm hover:shadow-hard-hover hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-8 h-[3px] bg-maroon mb-5" />
                  <h3 className="text-base font-bold text-text-primary mb-2 tracking-tight">{c.title}</h3>
                  <p className="text-text-muted text-[13px] leading-[1.7]">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="border-t border-border-hard">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <Reveal className="mb-0">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-maroon inline-block" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Frequently Asked</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary max-w-2xl leading-[1.1]">
              Common questions about working with me.
            </motion.h2>
          </Reveal>

          <Reveal className="mt-12 mb-0">
            <div className="max-w-3xl border-t border-border">
              {faqItems.map((item, i) => (
                <FAQ key={i} q={item.q} a={item.a} i={i} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA BLOCK ═══ */}
      <section className="border-t border-border-hard bg-text-primary">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon-light uppercase tracking-[0.2em]">Start a Project</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mt-5 leading-[1.1] tracking-[-0.02em]">
              Have something that needs to look and feel better?
            </h2>
            <p className="text-white/50 text-base md:text-lg mt-6 leading-[1.7] max-w-lg">
              Send the short version. I&apos;ll understand the project, the current problem, and what needs to ship.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="mailto:hi.aditya.dev@gmail.com"
                className="bg-maroon text-white border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200 inline-block"
              >
                SEND AN EMAIL &rarr;
              </a>
              <a
                href="tel:+919310736542"
                className="bg-white text-text-primary border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 inline-block"
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