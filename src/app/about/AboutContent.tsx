'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutContent() {
  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <FadeIn>
          <span className="font-mono text-xs text-accent uppercase tracking-widest">
            About
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
            I&apos;m the developer you call when the interface needs to feel sharp.
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">
            I&apos;m Aditya — a Front-End Developer &amp; UI/UX Designer based in Delhi, India. I
            build high-performance, accessible, and visually compelling digital products for people
            who want their website or app to feel polished, fast, and intentional.
          </p>
        </FadeIn>
      </section>

      {/* The short version */}
      <section className="mt-20 max-w-7xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-6">The short version</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-text-muted leading-relaxed max-w-3xl">
            I specialize in frontend development, UI/UX design, motion, and creative web
            experiences. Every project starts from the same question: what does this interface need to
            do, and what is the fastest, clearest way to let it do that.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-text-muted leading-relaxed max-w-3xl mt-4">
            When I&apos;m not coding, you&apos;ll find me exploring new design trends, gaming, or
            experimenting with creative coding and 3D web experiences.
          </p>
        </FadeIn>
      </section>

      {/* How I think */}
      <section className="mt-20 max-w-7xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-8">How I think</h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Context before visuals',
              desc: 'I first understand the goal: trust, leads, clarity, product value, or a stronger first impression.',
            },
            {
              title: 'Structure before decoration',
              desc: 'A beautiful website still fails if the sections are confusing. I care about hierarchy, layout, and user flow before effects.',
            },
            {
              title: 'Motion with purpose',
              desc: 'Animation should guide attention, not distract from the message.',
            },
            {
              title: 'Ship clean',
              desc: 'I care about responsive behavior, accessibility, performance, and final polish.',
            },
          ].map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.08}>
              <div className="bg-bg-surface border border-border p-6 h-full">
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{card.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="mt-20 max-w-7xl mx-auto px-6 pb-16">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-8">Stack</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              category: 'Frontend & Creative',
              items: [
                'React',
                'Next.js',
                'TypeScript',
                'Tailwind CSS',
                'Framer Motion',
                'GSAP',
                'Three.js',
                'WebGL',
              ],
            },
            {
              category: 'Backend Tools',
              items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs'],
            },
            {
              category: 'Workflow',
              items: [
                'GitHub',
                'Vercel',
                'Component systems',
                'Responsive design',
                'SEO basics',
                'Accessibility basics',
              ],
            },
          ].map((col, i) => (
            <FadeIn key={col.category} delay={i * 0.1}>
              <div>
                <h3 className="font-bold text-base mb-4">{col.category}</h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="text-sm text-text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mt-24 pt-16 border-t border-border text-center max-w-7xl mx-auto px-6 pb-24">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-bold">
            Sound like what you need?
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <a
            href="mailto:hi.aditya.dev@gmail.com"
            className="inline-block text-accent mt-6 text-lg hover:underline underline-offset-4 transition-all"
          >
            Email me →
          </a>
        </FadeIn>
      </section>
    </div>
  );
}