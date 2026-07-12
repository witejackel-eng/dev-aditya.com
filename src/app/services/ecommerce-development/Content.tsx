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
  { label: 'Fashion & Lifestyle Brands', desc: 'Clothing, accessories, and lifestyle brands that want an editorial shopping experience — not a generic storefront.' },
  { label: 'Product-Based Startups', desc: 'Startups launching their first online store who need a complete shopping flow from browse to buy, built right the first time.' },
  { label: 'Small to Medium Retailers', desc: 'Businesses moving online or upgrading from marketplace-only sales to their own branded e-commerce experience.' },
];

const deliverables = [
  'Full e-commerce website with product catalog, category filtering, and search',
  'Editorial product pages with image galleries, size guides, and related products',
  'Shopping cart with persistent state (survives page refresh and session recovery)',
  'Checkout flow with shipping, billing, and order summary',
  'Payment gateway integration (Razorpay, Stripe, or similar)',
  'Responsive design optimized for mobile shopping',
  'SEO-optimized product pages with structured data',
  'Admin-friendly product management through a headless CMS or custom dashboard',
];

const processSteps = [
  { num: '01', title: 'Understand', desc: 'I learn your products, target customers, pricing strategy, shipping requirements, and brand identity. We map the complete shopping flow before design begins.' },
  { num: '02', title: 'Design', desc: 'I create the visual design — product page layouts, category browsing, cart experience, and checkout flow. Editorial design that reflects your brand and drives purchases.' },
  { num: '03', title: 'Build', desc: 'I develop the full shopping experience: product catalog, cart system with persistent state, checkout flow, payment integration, and order management. Performance and security built in.' },
  { num: '04', title: 'Launch', desc: 'I test the complete purchase flow with real payment gateway sandbox accounts, verify shipping calculations, and deploy. Post-launch support for any issues.' },
];

const relatedProjects = [
  { title: 'Driftwear Studio', desc: 'Portfolio project — An editorial e-commerce experience for relaxed clothing with full shopping flow and Razorpay integration.', href: '/work/driftwear-ecommerce' },
];

const relatedResources = [
  { title: 'Next.js vs WordPress: Which Should You Choose?', desc: 'A comparison for building websites and online stores — performance, flexibility, and developer experience.', href: '/resources/nextjs-vs-wordpress' },
];

const faqItems = [
  {
    q: 'Which payment gateways do you integrate?',
    a: 'I primarily integrate Razorpay (popular in India) and Stripe (international). Both support cards, UPI, wallets, and net banking. If you need a different gateway, let me know and I\'ll evaluate the integration.',
  },
  {
    q: 'Can I manage products myself after launch?',
    a: 'Yes. I set up a product management system through a headless CMS (like Sanity or Contentful) or a custom admin dashboard. You can add products, update prices, manage inventory, and edit content without touching code.',
  },
  {
    q: 'Do you build custom e-commerce from scratch or use platforms like Shopify?',
    a: 'I build custom e-commerce frontends using Next.js with headless CMS integration. This gives you full design control, better performance, and no platform lock-in. If you specifically need Shopify, I can build a custom Shopify theme, but I generally recommend the headless approach for better flexibility.',
  },
  {
    q: 'How do you handle shipping and taxes?',
    a: 'I integrate shipping calculation APIs (like Shiprocket or Delhivery for India) and configure tax rules based on your business location and customer locations. The exact setup depends on your operational requirements.',
  },
  {
    q: 'Is the e-commerce site secure?',
    a: 'Security is built into every layer: HTTPS enforcement, secure payment processing through certified gateways (no card data touches our servers), input validation, CSRF protection, and secure session management. I follow OWASP best practices throughout.',
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
          E-commerce Website Development
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">
          Full shopping experiences from product browsing through cart to checkout. Editorial design, persistent cart state, category filtering, and payment integration — built for brands that want more than a generic storefront.
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
        <div className="mt-8">
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
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mt-4">E-commerce development packages.</h3>
          <p className="text-text-muted text-base mt-3 leading-relaxed max-w-xl">
            E-commerce projects are scoped individually based on product catalog size, payment requirements, and custom features. View base packages for reference pricing.
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
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-text-primary">Common questions about e-commerce development.</motion.h2>
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
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Need an e-commerce store?</h2>
          <p className="text-text-muted text-base mt-4 leading-relaxed max-w-xl">
            Tell me about your products, target market, and what you need the store to do. I&apos;ll scope the project and recommend the right approach.
          </p>
          <a href="mailto:hi.aditya.dev@gmail.com" className="inline-block mt-8 bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200">
            EMAIL ME &rarr;
          </a>
        </motion.div>
      </section>
    </>
  );
}
