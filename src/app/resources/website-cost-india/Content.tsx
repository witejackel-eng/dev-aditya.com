'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.section ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} className={className}>
      {children}
    </motion.section>
  );
}

export default function Content() {
  return (
    <div className="mt-8">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">How Much Does a Business Website Cost in India?</h1>
        <p className="text-text-muted mt-6 leading-relaxed">
          A business website in India typically costs between <strong className="text-text-primary">₹15,000 and ₹75,000+</strong>, depending on the number of pages, design complexity, features, and who you hire. A single-page starter site begins around ₹14,999; a multi-page business site with proper SEO and animations starts around ₹34,999; and a premium build with custom design systems and advanced interactions starts at ₹74,999.
        </p>
        <p className="text-text-muted mt-4 leading-relaxed">
          I am breaking this down from firsthand experience building websites for businesses across India — from Delhi-based service companies to remote-first startups. These are not hypothetical numbers pulled from a survey. They reflect what real projects cost when you hire a competent freelance web designer or small studio in 2026.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">What Determines the Cost</p>
        <h2 className="text-xl font-bold text-text-primary">What Actually Determines Website Cost</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Every project is different, but the main cost drivers are consistent. Understanding these helps you make better decisions about where to invest and where to save.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-bold text-text-primary">Number of Pages</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          A single landing page is fundamentally different from a 7-page site with individual service pages, a blog, and case studies. Each additional page requires its own layout, content strategy, responsive design, and QA. A one-page site might take 3–5 days of focused work; a 5-page business site takes 2–3 weeks because every page needs to work together as a coherent experience, not just exist in isolation.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-bold text-text-primary">Design Complexity</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          A clean, minimal layout using a well-structured component system is faster to build than a heavily customized design with unique layouts on every page. Custom illustrations, bespoke iconography, and complex grid layouts all add time. Animation work — scroll-driven reveals, hover micro-interactions, page transitions — is particularly labor-intensive because it requires tuning timing, easing, and performance across devices.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          In my own work, the difference between a Business package (smooth scroll animations) and a Premium package (advanced scroll-driven animations, micro-interactions, page transitions, 3D elements) accounts for a significant portion of the price gap. Animation is not decoration — it is communication — but it demands careful implementation.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-bold text-text-primary">Features and Functionality</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          A contact form is baseline. But what about a CMS so your team can update content? E-commerce with payment integration? A booking system? Multi-language support? Dynamic filtering for a portfolio? Each feature adds both development time and ongoing maintenance complexity. A simple contact form with email forwarding is straightforward; a full CMS integration with content modeling, preview workflows, and editorial training is a different scope entirely.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-bold text-text-primary">SEO and Performance Requirements</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Basic meta tags and Open Graph images are table stakes. But comprehensive SEO — schema markup, sitemap generation, keyword-mapped content structure, Core Web Vitals optimization — requires specific expertise and time. Google has documented that page experience signals, including Core Web Vitals, factor into ranking. A site that loads in 1.5 seconds versus one that loads in 4 seconds is not just a better user experience; it is a competitive advantage in search results.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Price Tiers</p>
        <h2 className="text-xl font-bold text-text-primary">Realistic Price Tiers in India (2026)</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Based on my packages and what I see across the market, here are the three realistic tiers for a business website built by a competent professional.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <div className="bg-bg-surface border border-border-hard p-6 shadow-hard-sm">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-text-muted mb-2">Tier 1 · Starter</p>
          <p className="text-2xl font-bold text-text-primary">₹14,999 <span className="text-sm font-normal text-text-muted">starting</span></p>
          <p className="text-text-muted mt-3 leading-relaxed">
            A single-page site — a focused landing page or online business card. This works when your business has one clear offer and you need a professional presence fast.
          </p>
          <p className="text-text-muted mt-3 leading-relaxed"><strong className="text-text-primary">What you typically get:</strong></p>
          <ul className="mt-2 space-y-2 text-text-muted leading-relaxed">
            <li className="flex gap-2"><span className="text-maroon">—</span> 1 responsive landing page</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Basic SEO meta tags and Open Graph</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Contact form or CTA integration</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Deployed to your hosting (Vercel, Netlify, etc.)</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Up to 2 rounds of revisions</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> ~1 week delivery</li>
          </ul>
          <p className="text-text-muted mt-3 leading-relaxed">
            <strong className="text-text-primary">Best for:</strong> Freelancers, personal portfolios, event pages, simple business card sites.
          </p>
          <p className="text-text-muted mt-3 leading-relaxed">
            <strong className="text-text-primary">Limitations:</strong> No multi-page navigation, limited room for content depth, minimal animation work, basic SEO only.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <div className="bg-maroon-soft border-2 border-maroon p-6 shadow-hard-sm">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-2">Tier 2 · Business — Most Common</p>
          <p className="text-2xl font-bold text-text-primary">₹34,999 <span className="text-sm font-normal text-text-muted">starting</span></p>
          <p className="text-text-muted mt-3 leading-relaxed">
            A multi-page website built to convert visitors into leads. This is what most service businesses need — enough pages to tell your story properly, with the SEO foundation to actually get found.
          </p>
          <p className="text-text-muted mt-3 leading-relaxed"><strong className="text-text-primary">What you typically get:</strong></p>
          <ul className="mt-2 space-y-2 text-text-muted leading-relaxed">
            <li className="flex gap-2"><span className="text-maroon">—</span> Up to 5 pages (Home, About, Services, Contact, +1)</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Full responsive design + cross-browser testing</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Comprehensive SEO (meta, sitemap, schema markup)</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Smooth scroll animations</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Performance optimization basics</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Contact form with spam protection</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Clean Git repository with proper commit history</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Up to 3 rounds of revisions</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> 2–3 weeks delivery</li>
          </ul>
          <p className="text-text-muted mt-3 leading-relaxed">
            <strong className="text-text-primary">Best for:</strong> Service businesses, startups, consultants, agencies, companies with an outdated site needing a refresh.
          </p>
          <p className="text-text-muted mt-3 leading-relaxed">
            <strong className="text-text-primary">Limitations:</strong> Page count is capped; animation work is present but not extensive; no CMS or dynamic content by default.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <div className="bg-bg-surface border border-border-hard p-6 shadow-hard-sm">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-text-muted mb-2">Tier 3 · Premium</p>
          <p className="text-2xl font-bold text-text-primary">₹74,999 <span className="text-sm font-normal text-text-muted">starting</span></p>
          <p className="text-text-muted mt-3 leading-relaxed">
            A premium web experience with custom design, advanced interactions, and production-level polish. This is for brands that need to stand out — not just exist online.
          </p>
          <p className="text-text-muted mt-3 leading-relaxed"><strong className="text-text-primary">What you typically get:</strong></p>
          <ul className="mt-2 space-y-2 text-text-muted leading-relaxed">
            <li className="flex gap-2"><span className="text-maroon">—</span> Unlimited pages with full navigation system</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Custom UI/UX design system (components, tokens, spacing)</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Advanced animations (scroll-driven, micro-interactions, page transitions)</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Core Web Vitals performance optimization</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> CMS / dynamic content integration if needed</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Accessibility audit (WCAG 2.1 AA basics)</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> 3D / WebGL elements where scope allows</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> Extended support and handoff documentation</li>
            <li className="flex gap-2"><span className="text-maroon">—</span> 3–5 weeks delivery</li>
          </ul>
          <p className="text-text-muted mt-3 leading-relaxed">
            <strong className="text-text-primary">Best for:</strong> Brands launching a new product, SaaS landing pages with complex UI, companies that need a standout web presence, web apps with rich interactions.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Hidden Costs</p>
        <h2 className="text-xl font-bold text-text-primary">Hidden Costs Most People Overlook</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          The website build itself is one part of the total cost. There are other expenses that frequently catch people off guard, especially first-time website owners.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-bold text-text-primary">Domain Name</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          A <code className="text-sm bg-bg-surface-2 px-1.5 py-0.5 border border-border">.com</code> domain costs approximately ₹800–1,200 per year. A <code className="text-sm bg-bg-surface-2 px-1.5 py-0.5 border border-border">.in</code> domain is usually cheaper at ₹400–700 per year. Some designers bundle the first year; many do not. Ask upfront.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-bold text-text-primary">Hosting</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          For static sites built with Next.js or similar frameworks, hosting on Vercel or Netlify is free for personal projects and has reasonable free tiers for business use. However, if you need a CMS, server-side rendering at scale, or higher bandwidth, you may need a paid plan — typically ₹1,500–5,000 per month for mid-tier cloud hosting. WordPress hosting on services like WP Engine or Kinsta runs ₹1,500–8,000 per month depending on traffic.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-bold text-text-primary">Content Creation</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Many clients assume content is included. It usually is not — at least not professional copywriting. If you need someone to write your page copy, blog posts, or case studies, budget an additional ₹5,000–20,000 depending on volume and quality. Good content is worth paying for because it directly affects conversions and SEO. I have seen beautiful sites underperform because the copy was an afterthought.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-bold text-text-primary">Maintenance</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Websites are not one-and-done. Security updates, content changes, feature additions, and performance monitoring all require ongoing attention. Some designers offer maintenance packages (typically ₹3,000–10,000 per month). Static sites built on modern frameworks need less ongoing maintenance than WordPress sites, which require regular plugin and core updates.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-bold text-text-primary">Professional Photography and Branding</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          If you do not have professional photos of your work, team, or products, stock photography is the fallback — and it shows. Brand photography in India typically costs ₹10,000–30,000 for a half-day session. Logo design and brand identity work ranges from ₹5,000 for a simple mark to ₹30,000+ for a full brand system. These are separate from the website cost, but they affect the final result dramatically.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">When to Go Cheap vs Invest More</p>
        <h2 className="text-xl font-bold text-text-primary">When a Cheaper Option Is Fine vs When You Need More</h2>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <p className="text-text-muted leading-relaxed">
          A starter site at ₹14,999 is perfectly fine when:
        </p>
        <ul className="mt-3 space-y-2 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon">—</span> You are a solo freelancer or consultant with one service</li>
          <li className="flex gap-2"><span className="text-maroon">—</span> You need a web presence quickly — within a week</li>
          <li className="flex gap-2"><span className="text-maroon">—</span> Most of your clients come through referrals, not search</li>
          <li className="flex gap-2"><span className="text-maroon">—</span> You plan to expand the site later as your business grows</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <p className="text-text-muted leading-relaxed">
          You should invest in a business or premium build when:
        </p>
        <ul className="mt-3 space-y-2 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon">—</span> Your website is a primary lead generation channel</li>
          <li className="flex gap-2"><span className="text-maroon">—</span> You have multiple services or product lines that each need their own page</li>
          <li className="flex gap-2"><span className="text-maroon">—</span> You are in a competitive market where your site needs to build trust immediately</li>
          <li className="flex gap-2"><span className="text-maroon">—</span> You care about SEO performance and want to rank for specific keywords</li>
          <li className="flex gap-2"><span className="text-maroon">—</span> Your brand positioning is premium — a basic site undermines that</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <p className="text-text-muted leading-relaxed">
          I have worked with businesses that tried to save ₹20,000 on their website and then spent months wondering why their site was not generating inquiries. The issue was never the code — it was that a single page could not adequately communicate their range of services, build credibility through case studies, or optimize for the search terms their clients were actually using. The savings were real; the opportunity cost was much larger.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Value vs Price</p>
        <h2 className="text-xl font-bold text-text-primary">How to Evaluate Value vs Price</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          The cheapest quote is rarely the best value. Here is a framework for thinking about it:
        </p>
        <ul className="mt-4 space-y-4 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon font-bold">1.</span> <span><strong className="text-text-primary">Look at the portfolio.</strong> Not screenshots — live sites. Open them on your phone. Check if they load fast. Navigate around. A designer who delivers fast, functional, beautiful sites is worth more than one who delivers pretty mockups that fall apart on mobile.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">2.</span> <span><strong className="text-text-primary">Ask about process.</strong> Someone with a clear process (discovery → design → development → QA → launch) is less likely to miss deadlines or deliver something unexpected. Process is invisible until it is absent.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">3.</span> <span><strong className="text-text-primary">Consider the ongoing relationship.</strong> Will this person be available for updates in 3 months? Do they provide documentation? Do they hand over clean code? The cheapest option often disappears after delivery.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">4.</span> <span><strong className="text-text-primary">Factor in opportunity cost.</strong> Every week your site is not live or not performing is a week of lost leads. A designer who takes 3 weeks to deliver a working site is often a better investment than one who takes 8 weeks for the same result at a slightly lower price.</span></li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Who You Hire Matters</p>
        <h2 className="text-xl font-bold text-text-primary">The Cost Also Depends on Who You Hire</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          A student or hobbyist might charge ₹5,000–10,000 for a website. A mid-level freelancer charges ₹15,000–50,000. A small agency charges ₹40,000–1,50,000. A large agency charges ₹2,00,000+.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          The price difference is not arbitrary. It reflects experience, reliability, process maturity, and the quality of the final product. A student can build you a site, but they may not understand SEO, performance, accessibility, or how to structure content for conversions. A freelancer like me brings focused expertise and personal accountability. An agency brings a team but also overhead and longer timelines.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          For most small and mid-size businesses in India, a skilled freelancer hits the sweet spot: professional quality without agency overhead. My packages at <Link href="/packages" className="text-maroon hover:underline">/packages</Link> are structured to make this straightforward — you know exactly what you get at each price point.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Summary</p>
        <h2 className="text-xl font-bold text-text-primary">Quick Summary</h2>
        <div className="mt-4 bg-bg-surface-2 border border-border p-5">
          <ul className="space-y-3 text-text-muted leading-relaxed">
            <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span>Starter (1 page): <strong className="text-text-primary">₹14,999</strong> — fast, focused, professional</span></li>
            <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span>Business (5 pages): <strong className="text-text-primary">₹34,999</strong> — most common, SEO-ready, conversion-focused</span></li>
            <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span>Premium (unlimited): <strong className="text-text-primary">₹74,999+</strong> — custom design, advanced animations, full polish</span></li>
            <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span>Budget extra for domain (~₹1,000/yr), hosting (free–₹5,000/mo), content (₹5,000–20,000), and maintenance (₹3,000–10,000/mo)</span></li>
          </ul>
        </div>
        <p className="text-text-muted mt-4 leading-relaxed">
          If you are deciding between tiers, the best thing to do is have a conversation about your specific situation. I am transparent about what each package includes and when a lower tier is genuinely sufficient. Reach out through <Link href="/contact" className="text-maroon hover:underline">the contact page</Link> or email me directly.
        </p>
      </AnimatedSection>
    </div>
  );
}
