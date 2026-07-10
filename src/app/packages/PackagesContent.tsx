'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
const packages = [
  {
    num: '01',
    name: 'Starter',
    price: '₹14,999',
    priceNote: 'Starting price',
    tagline: 'For individuals and small projects that need a professional web presence — fast.',
    ideal: ['Personal portfolios', 'Freelancer landing pages', 'Event or launch pages', 'Simple business cards online'],
    includes: [
      '1 landing page / single-page site',
      'Responsive design (mobile, tablet, desktop)',
      'Basic SEO meta tags & Open Graph',
      'Contact form / CTA integration',
      'Deployment to Vercel / Netlify / your host',
      'Up to 2 rounds of revisions',
      '1 week delivery',
    ],
    ctaSubject: 'Starter Package Inquiry',
    featured: false,
  },
  {
    num: '02',
    name: 'Business',
    price: '₹34,999',
    priceNote: 'Starting price',
    tagline: 'For businesses that need a credible, multi-page website that converts visitors into leads.',
    ideal: ['Service-based businesses', 'Startups needing a polished web presence', 'Consultants & agencies', 'Companies updating an outdated site'],
    includes: [
      'Up to 5 pages (Home, About, Services, Contact, +1)',
      'Responsive + cross-browser tested',
      'Full SEO setup (meta, sitemap, schema markup)',
      'Contact form with honeypot spam protection',
      'Smooth scroll animations',
      'Performance optimization basics',
      'GitHub repository with clean commit history',
      'Up to 3 rounds of revisions',
      '2–3 week delivery',
    ],
    ctaSubject: 'Business Package Inquiry',
    featured: true,
  },
  {
    num: '03',
    name: 'Premium',
    price: '₹74,999',
    priceNote: 'Starting price',
    tagline: 'For brands that need a premium web experience with custom design, advanced interactions, and production-level polish.',
    ideal: ['Brands launching a new product or service', 'Companies needing a standout web presence', 'SaaS landing pages with complex UI', 'Web apps with rich interaction design'],
    includes: [
      'Unlimited pages with full navigation system',
      'Custom UI/UX design system (components, tokens, spacing)',
      'Advanced animations (scroll-driven, micro-interactions, page transitions)',
      'Performance optimization (Core Web Vitals target)',
      'CMS / dynamic content integration (if needed)',
      '3D / WebGL elements (if scope allows)',
      'Accessibility audit (WCAG 2.1 AA basics)',
      'GitHub repository with documentation',
      'Up to 5 rounds of revisions',
      '3–5 week delivery',
      'Priority support for 2 weeks post-launch',
    ],
    ctaSubject: 'Premium Package Inquiry',
    featured: false,
  },
];

const addons = [
  { name: 'Extra Page', price: '₹2,999', unit: '/page', desc: 'Additional pages beyond your package limit.' },
  { name: 'CMS Integration', price: '₹9,999', unit: '', desc: 'Connect your site to a headless CMS like Sanity, Contentful, or Strapi for easy content updates.' },
  { name: 'Custom Animations Package', price: '₹7,999', unit: '', desc: 'Scroll-driven sequences, parallax, reveal-on-scroll, and micro-interaction systems.' },
  { name: 'Performance Audit & Fix', price: '₹4,999', unit: '', desc: 'Full Core Web Vitals audit, image optimization, bundle analysis, and rendering fixes.' },
  { name: '3D / WebGL Element', price: '₹14,999', unit: '', desc: 'A custom 3D scene or WebGL hero section using Three.js or React Three Fiber.' },
  { name: 'E-commerce Integration', price: '₹19,999', unit: '', desc: 'Product pages, cart, and checkout flow using Next.js Commerce or Stripe integration.' },
  { name: 'Blog / Content Section', price: '₹7,999', unit: '', desc: 'A fully styled blog listing and post template with MDX or CMS integration.' },
  { name: 'Rush Delivery', price: '+50%', unit: '', desc: 'Accelerated timeline — deliver in half the standard timeframe.' },
];

const process = [
  { step: '01', title: 'Brief & Scope', desc: 'You send a short brief. I clarify the goal, audience, pages needed, and any references. We align on scope before any work starts.' },
  { step: '02', title: 'Design & Prototype', desc: 'I design the layout, typography, spacing, and interaction patterns. You see the visual direction early and can request changes.' },
  { step: '03', title: 'Build & Iterate', desc: 'I build the frontend in code, wire interactions, and make it responsive. You review at milestones and give feedback.' },
  { step: '04', title: 'Polish & Ship', desc: 'Final QA: performance, SEO, accessibility, mobile testing, links, and deployment. You get clean code, docs, and a live site.' },
];

/* ═══════════════════════════════════════════════════════════════ */

export default function PackagesContent() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="pt-[100px] pb-0">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20 border-b border-border-hard">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex items-center gap-3 mb-8">
            <span className="w-3 h-3 bg-maroon inline-block" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Pricing</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.8rem,6.5vw,5.5rem)] font-black uppercase tracking-[-0.03em] leading-[0.95] text-text-primary max-w-5xl"
          >
            Website
            <br />packages
            <br /><span className="inline-block bg-maroon text-white px-3 py-1 mt-1 align-middle">built to ship.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-text-muted text-lg md:text-xl max-w-[540px] mt-8 leading-[1.7]"
          >
            Clear scope, transparent pricing, no hidden costs. Pick a package that fits your project — or contact me for a custom quote.
          </motion.p>
        </div>
      </section>

      {/* ═══ ALL 3 PACKAGES ═══ */}
      <section className="border-b border-border-hard">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <Reveal className="mb-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.num}
                  variants={fadeUp}
                  className={`bg-bg-surface flex flex-col relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-hard-hover ${
                    pkg.featured
                      ? 'border-2 border-border-hard shadow-hard p-6 md:p-8'
                      : 'border border-border-hard shadow-hard-sm p-6 md:p-7'
                  }`}
                >
                  {/* Featured badge */}
                  {pkg.featured && (
                    <div className="absolute -top-3 left-6 bg-maroon text-white px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest font-medium border border-border-hard z-10">
                      Most Popular
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted uppercase tracking-widest">{pkg.num}</span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest bg-maroon-soft px-2.5 py-1 font-medium">{pkg.name}</span>
                  </div>

                  <p className="text-4xl font-black text-text-primary tracking-tight">{pkg.price}</p>
                  <p className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted mt-1">{pkg.priceNote}</p>
                  <p className="text-text-muted text-[14px] leading-[1.7] mt-5 mb-6">{pkg.tagline}</p>

                  {/* Ideal for */}
                  <div className="mb-6">
                    <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-muted/60 uppercase tracking-[0.15em] mb-3">Ideal for</p>
                    <ul className="flex flex-col gap-1.5">
                      {pkg.ideal.map((item) => (
                        <li key={item} className="text-text-primary text-[13px] flex items-start gap-2">
                          <span className="text-maroon mt-0.5 shrink-0 text-[10px]">&#x25AA;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Includes */}
                  <div className="border-t border-border pt-6 mb-8 flex-1">
                    <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-muted/60 uppercase tracking-[0.15em] mb-3">What&apos;s included</p>
                    <ul className="flex flex-col gap-2.5">
                      {pkg.includes.map((item) => (
                        <li key={item} className="text-text-muted text-[13px] flex items-start gap-2.5 leading-snug">
                          <span className="text-maroon mt-0.5 shrink-0 text-xs">&#x2713;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <a
                    href={`mailto:hi.aditya.dev@gmail.com?subject=${pkg.ctaSubject}`}
                    className={`block text-center px-5 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.12em] font-medium border border-border-hard transition-all duration-200 ${
                      pkg.featured
                        ? 'bg-maroon text-white shadow-hard-sm hover:bg-maroon-dark'
                        : 'bg-white text-text-primary shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon'
                    }`}
                  >
                    GET STARTED &rarr;
                  </a>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ADD-ONS ═══ */}
      <section className="border-t border-border-hard bg-bg-surface-2">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <Reveal className="mb-0">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-maroon inline-block" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Extend Your Package</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary leading-[1.1]">
              Add-ons
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-muted max-w-2xl mt-4 leading-[1.7]">
              Need something extra? These can be added to any package. Prices are fixed — no surprises.
            </motion.p>
          </Reveal>

          <Reveal className="mt-14 mb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {addons.map((addon) => (
                <motion.div
                  key={addon.name}
                  variants={fadeUp}
                  className="bg-bg-surface border border-border-hard p-6 shadow-hard-sm hover:shadow-hard-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="text-base font-bold text-text-primary">{addon.name}</h3>
                    <span className="font-[family-name:var(--font-mono)] text-[13px] text-maroon font-medium shrink-0 ml-2">{addon.price}{addon.unit}</span>
                  </div>
                  <p className="text-text-muted text-[13px] leading-[1.6]">{addon.desc}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="border-t border-border-hard">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <Reveal className="mb-0">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-maroon inline-block" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">Process</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary leading-[1.1]">
              How a project works.
            </motion.h2>
          </Reveal>

          <Reveal className="mt-14 mb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {process.map((p) => (
                <motion.div key={p.step} variants={fadeUp} className="bg-bg-surface border border-border-hard p-6 shadow-hard-sm">
                  <span className="font-[family-name:var(--font-mono)] text-maroon text-3xl font-black">{p.step}</span>
                  <h3 className="text-base font-bold text-text-primary mt-3 mb-2 tracking-tight">{p.title}</h3>
                  <p className="text-text-muted text-[13px] leading-[1.7]">{p.desc}</p>
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
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase tracking-[0.2em]">FAQ</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-text-primary leading-[1.1] max-w-2xl">
              Common questions about pricing and process.
            </motion.h2>
          </Reveal>

          <Reveal className="mt-12 mb-0">
            <div className="max-w-3xl border-t border-border flex flex-col">
              {[
                { q: 'Are these prices fixed, or can they change?', a: 'These are starting prices. The final cost depends on the complexity of design, number of unique components, and any custom features. I\'ll give you an exact quote after understanding your project scope.' },
                { q: 'What if my project doesn\'t fit any package?', a: 'That\'s common. Most projects need something between or beyond these tiers. Send me a brief and I\'ll provide a custom scope and quote tailored to your exact needs.' },
                { q: 'Do I need to provide content (text, images)?', a: 'Yes — I design and build around your content. If you don\'t have finalized copy, I can work with placeholders and you can swap in the real content later. I also offer content structure guidance.' },
                { q: 'What happens after launch?', a: 'You get the full source code in a GitHub repository, deployment access, and a brief handoff document. For Premium packages, I provide 2 weeks of priority support for any post-launch fixes.' },
                { q: 'Can I upgrade my package mid-project?', a: 'Yes. If the scope grows, we can adjust the package and timeline. I\'ll always communicate the cost and timeline impact before starting additional work.' },
                { q: 'Do you offer refunds?', a: 'I don\'t offer refunds after work has started. However, I involve you at every milestone, so there are no surprises. If at any point you\'re not satisfied, we discuss it and adjust direction.' },
                { q: 'What payment methods do you accept?', a: 'Bank transfer (India), UPI, and PayPal for international clients. I typically work with a 50% upfront and 50% on delivery structure for larger projects.' },
              ].map((item, i) => (
                <div key={i} className="border-b border-border py-5">
                  <p className="text-[15px] font-medium text-text-primary leading-snug">{item.q}</p>
                  <p className="text-text-muted text-[14px] leading-[1.7] mt-2 max-w-2xl">{item.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-t border-border-hard bg-text-primary">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon-light uppercase tracking-[0.2em]">Ready to start?</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mt-5 leading-[1.1] tracking-[-0.02em]">
              Pick a package or tell me what you need.
            </h2>
            <p className="text-white/50 text-base md:text-lg mt-6 leading-[1.7] max-w-lg">
              Send the short version of your project. I&apos;ll reply with a clear scope, timeline, and exact price — usually within 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="mailto:hi.aditya.dev@gmail.com?subject=Package Inquiry" className="bg-maroon text-white border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] font-medium shadow-hard hover:bg-maroon-light transition-colors duration-200 inline-block">
                EMAIL ME &rarr;
              </a>
              <a href="tel:+919310736542" className="bg-white text-text-primary border border-border-hard px-6 py-3.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] shadow-hard-sm hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 inline-block">
                CALL ME &rarr;
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}