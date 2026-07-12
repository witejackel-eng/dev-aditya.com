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

const services = [
  { title: 'Business Website Design', desc: 'Multi-page responsive websites for service businesses and professionals.', href: '/services/business-websites' },
  { title: 'Website Redesign', desc: 'Transform outdated websites into modern, fast, conversion-focused experiences.', href: '/services/website-redesign' },
  { title: 'Landing Page Design', desc: 'High-conversion pages for campaigns, launches, and lead generation.', href: '/services/landing-page-design' },
  { title: 'E-commerce Development', desc: 'Full shopping experiences with editorial design and payment integration.', href: '/services/ecommerce-development' },
  { title: 'Next.js Development', desc: 'Production-grade applications with SSR, API routes, and modern architecture.', href: '/services/nextjs-development' },
  { title: 'Interactive Websites', desc: 'Immersive experiences with WebGL, scroll choreography, and motion design.', href: '/services/interactive-websites' },
];

const recentProjects = [
  { title: 'Saffron & Steam Experience', desc: 'Portfolio project — Immersive café website with WebGL hero and editorial design.', href: '/work/saffron-steam-experience' },
  { title: 'Corporate Lead-Gen Platform', desc: 'Portfolio project — High-conversion marketing platform with modular campaign pages.', href: '/work/corporate-leadgen-platform' },
  { title: 'Driftwear Studio', desc: 'Portfolio project — Editorial e-commerce experience with persistent cart and Razorpay.', href: '/work/driftwear-ecommerce' },
  { title: 'Real Estate Atelier', desc: 'Portfolio project — Cinematic luxury real estate platform with curated property discovery.', href: '/work/real-estate-atelier' },
];

const remoteSteps = [
  { num: '01', title: 'First Conversation', desc: 'We start with a call or detailed email exchange. You describe your project, and I ask clarifying questions. No commitment required at this stage.' },
  { num: '02', title: 'Proposal & Agreement', desc: 'I send a written proposal with scope, timeline, deliverables, and pricing. If everything aligns, we sign a simple agreement and begin.' },
  { num: '03', title: 'Shared Tools', desc: 'I use shared project boards (Notion or Trello), a private GitHub repo for code, and Figma for design. You see progress in real-time and can review at any point.' },
  { num: '04', title: 'Check-ins & Delivery', desc: 'Regular async updates via email or Slack. Scheduled calls when needed. You review work at key milestones. Final delivery with documentation and post-launch support.' },
];

const faqItems = [
  {
    q: 'Are you based in Delhi? Can we meet in person?',
    a: 'Yes, I\'m based in Delhi. In-person meetings are possible for projects within Delhi/NCR when helpful — especially for initial discussions and project kickoffs. Most of my workflow is remote-friendly, which works well for ongoing collaboration.',
  },
  {
    q: 'Do you only work with clients in Delhi?',
    a: 'No. While I\'m based in Delhi and work with local businesses, most of my clients are outside Delhi — across India and internationally. Remote collaboration through shared tools, video calls, and async communication works reliably for my workflow.',
  },
  {
    q: 'How much does a website cost in Delhi?',
    a: 'Website costs vary widely depending on scope, complexity, and who you hire. My packages start at a fixed price for each tier with clear deliverables — you can view them at /packages. I\'m not the cheapest option in Delhi, and I\'m not trying to be. I focus on building premium, fast, well-architected websites.',
  },
  {
    q: 'What makes you different from other web designers in Delhi?',
    a: 'I focus exclusively on frontend development and UI/UX design — I don\'t spread across full-stack, mobile apps, or digital marketing. My work uses modern technology (Next.js, TypeScript, Tailwind CSS) rather than outdated WordPress themes. Every project gets custom design and clean code, not templates.',
  },
  {
    q: 'Can you help with website maintenance after launch?',
    a: 'Yes. I provide post-launch support for 2 weeks after every project at no additional cost. For ongoing maintenance — content updates, feature additions, or performance monitoring — we can set up a separate arrangement based on your needs.',
  },
];

export default function Content() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="max-w-4xl mx-auto px-6 pt-28 md:pt-32 pb-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex items-center gap-3 mb-6">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Delhi · India</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-text-primary">
          Web Designer in Delhi
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">
          Aditya Singh — designing and developing premium websites for Delhi businesses and beyond. Fast, SEO-optimized, and built to convert visitors into clients.
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="font-[family-name:var(--font-mono)] text-sm text-text-muted mt-4">
          Based in Delhi, India · Available worldwide for remote projects
        </motion.p>
      </section>

      {/* ═══ BASED IN DELHI ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Location</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Based in Delhi, working worldwide.</motion.h2>
        <motion.div variants={fadeUp} className="bg-white border border-border-hard p-6 md:p-8 shadow-hard-sm mt-8">
          <p className="text-text-muted leading-relaxed">
            I live and work in Delhi, India. Being based here means I understand the local market — the design expectations of Indian businesses, the importance of mobile-first experiences (most Indian web traffic is mobile), and the need for fast-loading pages on varying network speeds.
          </p>
          <p className="text-text-muted leading-relaxed mt-4">
            I work with businesses in Delhi/NCR, across India, and internationally. Remote collaboration is my default workflow — shared project tools, video calls, and async communication make location irrelevant to the quality of work.
          </p>
          <p className="text-text-muted leading-relaxed mt-4">
            For Delhi-based projects, in-person kickoff meetings and mid-project check-ins are available when they add value. For most projects, remote works perfectly.
          </p>
        </motion.div>
      </AnimatedSection>

      {/* ═══ SERVICES OFFERED ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Services</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Services I offer.</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {services.map((s) => (
            <Link key={s.href} href={s.href}>
              <motion.div variants={fadeUp} className="bg-white border border-border-hard p-5 shadow-hard-sm group hover:shadow-hard-hover hover:-translate-y-0.5 transition-all duration-200 h-full">
                <h3 className="text-base font-bold text-text-primary group-hover:text-maroon transition-colors duration-200">{s.title}</h3>
                <p className="text-text-muted text-sm mt-2 leading-relaxed">{s.desc}</p>
                <span className="text-[11px] text-maroon font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] font-medium mt-3 inline-block group-hover:underline">LEARN MORE &rarr;</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ RECENT PROJECTS ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Recent Work</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Recent projects.</motion.h2>
        <div className="grid md:grid-cols-2 gap-5 mt-8">
          {recentProjects.map((p) => (
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

      {/* ═══ REMOTE COLLABORATION ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 bg-maroon inline-block" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Remote Collaboration</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">How remote collaboration works.</motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted text-base max-w-2xl mt-4 leading-relaxed">
          Whether you&apos;re in Connaught Place, Gurugram, Bangalore, or Berlin — the process is the same. Clear communication, shared tools, and transparent progress.
        </motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {remoteSteps.map((step) => (
            <motion.div key={step.num} variants={fadeUp} className="bg-white border border-border-hard p-5 shadow-hard-sm">
              <p className="font-[family-name:var(--font-mono)] text-maroon text-2xl font-bold">{step.num}</p>
              <p className="font-[family-name:var(--font-mono)] text-sm text-text-primary mt-2 font-bold">{step.title}</p>
              <p className="text-text-muted text-sm mt-2 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ PRICING ═══ */}
      <AnimatedSection className="max-w-4xl mx-auto px-6 mt-20">
        <motion.div variants={fadeUp} className="bg-bg-surface-2 border border-border-hard p-8 md:p-10">
          <p className="font-[family-name:var(--font-mono)] text-sm text-maroon font-bold uppercase tracking-widest">Pricing</p>
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mt-4">Transparent packages, no surprises.</h3>
          <p className="text-text-muted text-base mt-3 leading-relaxed max-w-xl">
            Fixed-price packages with clear deliverables. Whether you&apos;re a Delhi startup or an international brand, the pricing is the same — and it&apos;s listed upfront.
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
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Common questions about working with a Delhi web designer.</motion.h2>
        </AnimatedSection>
        <AnimatedSection className="mt-8 mb-0">
          <div className="border-t border-border">
            {faqItems.map((item, i) => (
              <FAQ key={i} q={item.q} a={item.a} i={i} />
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ CONTACT CTA ═══ */}
      <section className="max-w-4xl mx-auto px-6 mt-20 pt-16 border-t border-border pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Let&apos;s build your website.</h2>
          <p className="text-text-muted text-base mt-4 leading-relaxed max-w-xl">
            Whether you&apos;re in Delhi or elsewhere, the process is the same. Tell me about your project and I&apos;ll get back with a clear recommendation.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="mailto:hi.aditya.dev@gmail.com" className="bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200 inline-block">
              EMAIL ME &rarr;
            </a>
            <Link href="/contact" className="bg-white text-text-primary border border-border-hard px-6 py-3 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 inline-block">
              CONTACT FORM &rarr;
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
