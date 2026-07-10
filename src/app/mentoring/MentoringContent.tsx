'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function MentoringContent() {
  return (
    <div>
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <FadeIn><span className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">Project Help</span></FadeIn>
        <FadeIn delay={0.08}><h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight text-text-primary">Frontend help for students, creators, and small businesses.</h1></FadeIn>
        <FadeIn delay={0.16}><p className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">I help people turn rough website ideas, broken layouts, weak portfolios, and unfinished frontend projects into something cleaner, sharper, and ready to show.</p></FadeIn>
        <FadeIn delay={0.24}>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="mailto:hi.aditya.dev@gmail.com" className="bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200 inline-block">EMAIL ME &rarr;</a>
            <a href="tel:+919310736542" className="bg-white text-text-primary border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest shadow-hard-sm hover:bg-maroon hover:text-white transition-all duration-200 inline-block">CALL ME &rarr;</a>
          </div>
        </FadeIn>
      </section>

      <section className="mt-20 max-w-7xl mx-auto px-6">
        <FadeIn><h2 className="text-2xl font-bold mb-8 text-text-primary">Who it&apos;s for</h2></FadeIn>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Students building portfolios', desc: 'Get help turning your projects into a portfolio that looks serious and explains your work clearly.' },
            { title: 'Small businesses needing a better website', desc: 'Improve layout, copy, responsiveness, and trust sections so the website feels more professional.' },
            { title: 'Creators and freelancers', desc: 'Build a clean landing page, digital profile, or interactive experience around your personal brand.' },
            { title: 'Developers stuck on UI polish', desc: 'Get help with spacing, animation, responsiveness, and the final 20% that makes a project feel complete.' },
          ].map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.06}>
              <div className="bg-white border border-border-hard p-6 h-full shadow-hard-sm">
                <h3 className="font-bold text-lg mb-2 text-text-primary">{card.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{card.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mt-20 max-w-7xl mx-auto px-6">
        <FadeIn><h2 className="text-2xl font-bold mb-8 text-text-primary">What we can work on</h2></FadeIn>
        <FadeIn delay={0.08}>
          <div className="flex flex-wrap gap-3">
            {['Portfolio review', 'Landing page structure', 'UI/UX cleanup', 'Animation polish', 'Responsive fixes', 'Project case studies', 'GitHub profile cleanup', 'Deployment and Vercel fixes'].map((tag) => (
              <span key={tag} className="bg-maroon-soft text-maroon border border-border-hard px-4 py-2 text-sm font-[family-name:var(--font-mono)] uppercase tracking-wider">{tag}</span>
            ))}
          </div>
        </FadeIn>
      </section>

      <section className="mt-20 max-w-7xl mx-auto px-6 pb-16">
        <FadeIn><h2 className="text-2xl font-bold mb-8 text-text-primary">How it works</h2></FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Send the project', desc: 'Share the live link, repo, screenshots, or problem.' },
            { step: '02', title: 'Define the outcome', desc: 'We decide what needs to improve: design, speed, layout, copy, responsiveness, or polish.' },
            { step: '03', title: 'Fix and build', desc: 'I help improve the actual interface, not just talk about it.' },
            { step: '04', title: 'Leave with something usable', desc: 'You get a cleaner project, clearer next steps, or a better page to show.' },
          ].map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.06}>
              <div className="bg-white border border-border-hard p-6 h-full shadow-hard-sm">
                <span className="font-[family-name:var(--font-mono)] text-xs text-maroon tracking-widest uppercase">{item.step}</span>
                <h3 className="font-bold text-base mt-3 mb-2 text-text-primary">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mt-24 pt-16 border-t border-border text-center max-w-7xl mx-auto px-6 pb-24">
        <FadeIn><h2 className="text-2xl md:text-3xl font-bold text-text-primary">Want help with a project?</h2></FadeIn>
        <FadeIn delay={0.08}>
          <div className="mt-6 space-y-1">
            <a href="mailto:hi.aditya.dev@gmail.com" className="text-maroon hover:underline underline-offset-4 transition-all font-[family-name:var(--font-mono)]">hi.aditya.dev@gmail.com</a>
          </div>
        </FadeIn>
        <FadeIn delay={0.16}>
          <div className="mt-2">
            <a href="tel:+919310736542" className="text-text-muted hover:text-text-primary transition-colors text-sm">9310736542</a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}