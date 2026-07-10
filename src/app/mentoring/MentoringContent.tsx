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

export default function MentoringContent() {
  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <FadeIn>
          <span className="font-mono text-xs text-accent uppercase tracking-widest">
            Project Help
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
            Frontend help for students, creators, and small businesses.
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">
            I help people turn rough website ideas, broken layouts, weak portfolios, and unfinished
            frontend projects into something cleaner, sharper, and ready to show.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="mailto:hi.aditya.dev@gmail.com"
              className="bg-accent text-bg-primary px-6 py-3 text-sm font-medium hover:bg-accent-dark transition-colors inline-block"
            >
              Email me →
            </a>
            <a
              href="tel:+919310736542"
              className="border border-border px-6 py-3 text-sm font-medium text-text-primary hover:border-border-hover transition-colors inline-block"
            >
              Call me →
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Who it's for */}
      <section className="mt-20 max-w-7xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-8">Who it&apos;s for</h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Students building portfolios',
              desc: 'Get help turning your projects into a portfolio that looks serious and explains your work clearly.',
            },
            {
              title: 'Small businesses needing a better website',
              desc: 'Improve layout, copy, responsiveness, and trust sections so the website feels more professional.',
            },
            {
              title: 'Creators and freelancers',
              desc: 'Build a clean landing page, digital profile, or interactive experience around your personal brand.',
            },
            {
              title: 'Developers stuck on UI polish',
              desc: 'Get help with spacing, animation, responsiveness, and the final 20% that makes a project feel complete.',
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

      {/* What we can work on */}
      <section className="mt-20 max-w-7xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-8">What we can work on</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-3">
            {[
              'Portfolio review',
              'Landing page structure',
              'UI/UX cleanup',
              'Animation polish',
              'Responsive fixes',
              'Project case studies',
              'GitHub profile cleanup',
              'Deployment and Vercel fixes',
            ].map((tag) => (
              <span
                key={tag}
                className="bg-bg-surface border border-border px-4 py-2 text-sm text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* How it works */}
      <section className="mt-20 max-w-7xl mx-auto px-6 pb-16">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-8">How it works</h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Send the project',
              desc: 'Share the live link, repo, screenshots, or problem.',
            },
            {
              step: '02',
              title: 'Define the outcome',
              desc: 'We decide what needs to improve: design, speed, layout, copy, responsiveness, or polish.',
            },
            {
              step: '03',
              title: 'Fix and build',
              desc: 'I help improve the actual interface, not just talk about it.',
            },
            {
              step: '04',
              title: 'Leave with something usable',
              desc: 'You get a cleaner project, clearer next steps, or a better page to show.',
            },
          ].map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.08}>
              <div className="bg-bg-surface border border-border p-6 h-full">
                <span className="font-mono text-xs text-accent tracking-widest">
                  {item.step}
                </span>
                <h3 className="font-bold text-base mt-3 mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-24 pt-16 border-t border-border text-center max-w-7xl mx-auto px-6 pb-24">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-bold">
            Want help with a project?
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-6 space-y-1">
            <a
              href="mailto:hi.aditya.dev@gmail.com"
              className="text-accent hover:underline underline-offset-4 transition-all"
            >
              hi.aditya.dev@gmail.com
            </a>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-2">
            <a
              href="tel:+919310736542"
              className="text-text-muted hover:text-text-primary transition-colors text-sm"
            >
              9310736542
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}