'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Reveal, fadeUp } from '@/components/Reveal';
import { CAPABILITIES, TOOL_GROUPS } from '@/config/capabilities';
import { CONTACT_LOCATION } from '@/config/contact';

export default function AboutContent() {
  return (
    <div>
      {/* Intro */}
      <section className="pt-[110px] pb-16 max-w-7xl mx-auto px-6 border-b border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">
            About
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold tracking-tight leading-[1.1] text-text-primary max-w-3xl"
        >
          Design judgment supported by technical execution.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="max-w-3xl mt-8 space-y-4 text-text-muted text-lg leading-relaxed"
        >
          <p>
            I&apos;m Aditya, an independent web designer and frontend developer
            based in Delhi, India.
          </p>
          <p>
            I work with companies that need more than a visually polished
            website. The work begins with structure: understanding what the
            organisation offers, what its audience needs to understand and what
            action the website should make easier.
          </p>
          <p>
            I then translate that structure into a clear interface and
            production-ready frontend.
          </p>
        </motion.div>
      </section>

      {/* How design and engineering combine */}
      <Reveal className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary max-w-2xl leading-[1.2]">
          Where design and engineering meet.
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {[
            {
              title: 'Structure before decoration',
              desc: 'Information architecture and page hierarchy come first, so the website communicates before a visitor reads a single line of detail.',
            },
            {
              title: 'Design that carries intent',
              desc: 'Layout, typography, spacing and motion are used to establish credibility and guide attention, not to decorate.',
            },
            {
              title: 'Production-ready frontend',
              desc: 'The approved design is implemented as accessible, responsive, maintainable code, faithful to the direction we agreed.',
            },
            {
              title: 'Careful delivery',
              desc: 'Performance, accessibility and technical SEO are checked before launch, followed by an organised handover.',
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="bg-white border border-border-hard p-6 h-full shadow-hard-sm"
            >
              <h3 className="font-bold text-lg mb-2 text-text-primary tracking-tight">{card.title}</h3>
              <p className="text-text-muted text-sm leading-[1.7]">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* Core capabilities */}
      <Reveal className="py-16 md:py-20 border-t border-border bg-bg-surface-2">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
            Core capabilities
          </motion.h2>
          <motion.ul variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 mt-8 border-t border-border pt-8">
            {CAPABILITIES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-text-primary leading-snug">
                <span className="text-maroon mt-0.5 shrink-0" aria-hidden="true">▪</span>
                {item}
              </li>
            ))}
          </motion.ul>
        </div>
      </Reveal>

      {/* Tools */}
      <Reveal className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mb-8">
          Tools and technologies
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {TOOL_GROUPS.map((col) => (
            <motion.div key={col.category} variants={fadeUp}>
              <h3 className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mb-4">
                {col.category}
              </h3>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item} className="text-sm text-text-muted">{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* Location + working style */}
      <Reveal className="py-16 md:py-20 border-t border-border bg-bg-surface-2">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              Location and availability
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-muted text-base mt-4 leading-relaxed max-w-md">
              Based in {CONTACT_LOCATION}, working remotely with organisations in
              India and internationally. Async communication and a shared staging
              website keep projects moving across time zones.
            </motion.p>
          </div>
          <div>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              Working style
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-muted text-base mt-4 leading-relaxed max-w-md">
              Clear scope before work begins, regular progress updates and
              decisions documented as we go. Outside of client work I explore
              motion, WebGL and generative systems—which is where the creative
              technology projects come from.
            </motion.p>
          </div>
        </div>
      </Reveal>

      {/* CTA */}
      <section className="py-20 md:py-24 border-t border-border max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Have a project in mind?
          </h2>
          <p className="text-text-muted text-base mt-4 leading-relaxed max-w-lg">
            Tell me what the website needs to achieve and I&apos;ll recommend a
            practical direction.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 bg-maroon text-white border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200"
          >
            DISCUSS A PROJECT →
          </Link>
        </div>
      </section>
    </div>
  );
}
