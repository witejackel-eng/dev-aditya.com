'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }} className={className}>
      {children}
    </motion.section>
  );
}

const projects = [
  { num: '01', category: 'Corporate \u00B7 Business Website', title: 'IBS', desc: 'Corporate business website showcasing company services, team, and brand identity with a refined professional design system, smooth scroll animations, and a responsive layout engineered for credibility and clarity.', stack: 'Next.js \u00B7 TypeScript \u00B7 Tailwind CSS', live: 'https://ibs-com-aadi.vercel.app/', caseStudy: '/work/ibs', github: 'https://github.com/witejackel-eng/IBS.com' },
  { num: '02', category: 'B2B \u00B7 Marketing Site', title: 'Corporate Lead-Gen Platform', desc: 'A high-conversion marketing platform with modular content system, built for a sales team to launch campaign pages without touching code.', stack: 'React \u00B7 Next.js \u00B7 Framer Motion', live: 'https://corporate-leadgen-platform-jet.vercel.app/', caseStudy: '/work/corporate-leadgen-platform', github: 'https://github.com/witejackel-eng/corporate-leadgen-platform' },
  { num: '03', category: 'Interactive \u00B7 Web App', title: 'Aadi Card', desc: 'An interactive digital card experience with stunning micro-animations, gesture-driven interactions, and a polished visual design system.', stack: 'React \u00B7 CSS Animations \u00B7 JavaScript', live: 'https://aadi-card.vercel.app/', caseStudy: '/work/aadi-card', github: 'https://github.com/witejackel-eng/AADI-CARD' },
  { num: '04', category: 'Dashboard \u00B7 Analytics', title: 'Pulse Dashboard', desc: 'A real-time analytics dashboard with live data visualization, interactive charts, and a responsive design that works across all devices.', stack: 'Next.js \u00B7 Chart.js \u00B7 Tailwind CSS', live: 'https://pulse-aadi-project.vercel.app/', caseStudy: '/work/pulse-dashboard', github: 'https://github.com/witejackel-eng/pulse-analytics-dashboard' },
];

export default function WorkContent() {
  return (
    <>
      <Section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <motion.p variants={fadeUp} className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">Work</motion.p>
        <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold mt-4 tracking-tight text-text-primary">Projects, interfaces, and shipped experiments.</motion.h1>
        <motion.p variants={fadeUp} className="text-text-muted text-lg max-w-2xl mt-6 leading-relaxed">Selected websites, web apps, and interface systems built around performance, clarity, and motion.</motion.p>
      </Section>

      <Section className="py-16 max-w-7xl mx-auto px-6">
        {projects.map((p) => (
          <motion.div key={p.num} variants={fadeUp} className="py-10 border-b border-border group">
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted">{p.num}</p>
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest mt-2">{p.category}</p>
            <Link href={p.caseStudy}>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 text-text-primary group-hover:text-maroon transition-colors duration-200">{p.title}</h2>
            </Link>
            <p className="text-text-muted mt-3 max-w-2xl leading-relaxed">{p.desc}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {p.stack.split(' \u00B7 ').map((tag) => (
                <span key={tag} className="bg-maroon-soft text-maroon font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider px-2 py-0.5">{tag}</span>
              ))}
            </div>
            <div className="flex gap-6 mt-5">
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-sm text-maroon hover:underline font-[family-name:var(--font-mono)] uppercase tracking-widest">VIEW PROJECT &rarr;</a>
              <Link href={p.caseStudy} className="text-sm text-text-muted hover:text-text-primary transition-colors font-[family-name:var(--font-mono)] uppercase tracking-widest">CASE STUDY &rarr;</Link>
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-text-primary transition-colors font-[family-name:var(--font-mono)] uppercase tracking-widest">GITHUB &rarr;</a>
            </div>
          </motion.div>
        ))}
      </Section>

      <section className="py-20 text-center max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Want this level of polish on your project?</h2>
        <Link href="/contact" className="text-maroon mt-6 inline-block hover:underline font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">Contact Aditya &rarr;</Link>
      </section>
    </>
  );
}