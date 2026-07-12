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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Next.js vs WordPress: Which Is Better for Your Business Website?</h1>
        <p className="text-text-muted mt-6 leading-relaxed">
          It depends entirely on your needs. If you need a fast, custom, performance-optimized website that a developer maintains for you, Next.js is the stronger choice. If you need a site that your non-technical team can update regularly with new content — especially blog posts — WordPress still has the edge. Neither is universally better. The right answer depends on who will manage the site, how often content changes, and what performance and customization you require.
        </p>
        <p className="text-text-muted mt-4 leading-relaxed">
          I build with both. My preference for most business sites has shifted toward Next.js over the past two years, but I am honest about when WordPress is the more practical option. This comparison comes from building and maintaining sites on both platforms for real businesses.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Next.js Strengths</p>
        <h2 className="text-xl font-bold text-text-primary">What Next.js Excels At</h2>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Performance</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Next.js sites, when built properly with static generation or server-side rendering, are fundamentally faster than WordPress sites. A statically generated Next.js page is pre-built HTML — no database queries, no PHP execution, no plugin overhead at request time. The server sends exactly what the browser needs, and nothing more.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          Google&apos;s Core Web Vitals documentation emphasizes that Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS) are critical ranking signals. In my testing, well-built Next.js sites consistently score 90+ on Lighthouse performance audits. WordPress sites, even with caching plugins, typically score 50–75 out of the box. You can optimize WordPress, but you are working against the platform&apos;s architecture rather than with it.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Custom Interactions and Modern UX</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Next.js is built on React, which means you get a full component model, state management, and the ability to build custom interactions without fighting your framework. Scroll-driven animations, page transitions, micro-interactions on hover and focus, interactive filtering — these are first-class concerns in Next.js. In WordPress, achieving the same level of interactivity typically requires bolting JavaScript onto a PHP-rendered page, which creates maintenance debt and performance compromises.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          The <Link href="/work/saffron-steam-experience" className="text-maroon hover:underline">Saffron Steam project</Link> on my portfolio is a good example — the scroll animations and interactive elements would be significantly harder to implement and maintain in WordPress.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Security</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          WordPress powers over 40% of the web, which makes it the largest target for automated attacks. Plugin vulnerabilities are a constant concern — a single outdated plugin can compromise an entire site. Next.js static sites have no database, no admin panel, and no server-side code executing at request time. The attack surface is dramatically smaller. For a business that does not want to think about security updates, this is a meaningful advantage.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Developer Experience and Maintainability</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Next.js uses TypeScript, a component-based architecture, and modern tooling (ESLint, Prettier, Git-based deployments). This means the codebase is predictable, testable, and maintainable by any competent React developer. WordPress codebases, especially those built with page builders, often become fragile over time — a theme update breaks layouts, a plugin conflict causes white screens, and nobody wants to touch the code because it is tangled.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">WordPress Strengths</p>
        <h2 className="text-xl font-bold text-text-primary">What WordPress Excels At</h2>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Content Management for Non-Technical Users</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          This is WordPress&apos;s killer feature and the main reason it still dominates. If your marketing team needs to publish blog posts weekly, update service descriptions, or add team members without calling a developer, WordPress gives them a visual editor and a familiar admin interface. The block editor (Gutenberg) has improved significantly, and page builders like Elementor make layout changes accessible to non-coders.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          With Next.js, content changes typically require a developer or a headless CMS setup. Adding a headless CMS like Sanity or Contentful gives non-technical editing capability, but it adds complexity and cost. It is worth it for the right project, but it is not as turnkey as WordPress.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Plugin Ecosystem</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Need WooCommerce for e-commerce? An events calendar? A membership system? Multilingual support? Form builders with payment integration? WordPress has mature plugins for all of these, and many are free or inexpensive. The ecosystem is enormous and battle-tested. Next.js does not have an equivalent plugin system — each feature needs to be built or integrated individually, which means more development time but also more control and fewer dependencies.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Blog-Heavy Sites</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          If your site is primarily a blog or content publication, WordPress is still the most efficient choice. Its content management, category/tag taxonomy, scheduling, and editorial workflow are purpose-built for this use case. Next.js with a headless CMS can match it, but you are reassembling functionality that WordPress provides out of the box.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Comparison</p>
        <h2 className="text-xl font-bold text-text-primary">Head-to-Head Comparison</h2>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border-hard">
                <th className="text-left py-3 pr-4 font-[family-name:var(--font-mono)] uppercase tracking-widest text-xs text-text-muted">Factor</th>
                <th className="text-left py-3 pr-4 font-[family-name:var(--font-mono)] uppercase tracking-widest text-xs text-text-muted">Next.js</th>
                <th className="text-left py-3 font-[family-name:var(--font-mono)] uppercase tracking-widest text-xs text-text-muted">WordPress</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Speed</td>
                <td className="py-3 pr-4 text-maroon font-medium">Excellent — static/SSR</td>
                <td className="py-3">Moderate — needs caching</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Customization</td>
                <td className="py-3 pr-4 text-maroon font-medium">Full control</td>
                <td className="py-3">Limited by theme/plugins</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">SEO</td>
                <td className="py-3 pr-4 text-maroon font-medium">Strong — fast + structured</td>
                <td className="py-3">Good with plugins</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Content editing</td>
                <td className="py-3 pr-4">Developer or headless CMS</td>
                <td className="py-3 text-maroon font-medium">Visual editor — easy</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Maintenance</td>
                <td className="py-3 pr-4 text-maroon font-medium">Low — no updates needed</td>
                <td className="py-3">Regular plugin/core updates</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Security</td>
                <td className="py-3 pr-4 text-maroon font-medium">Minimal attack surface</td>
                <td className="py-3">High target, plugin risks</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Cost (initial)</td>
                <td className="py-3 pr-4">₹15,000–75,000+</td>
                <td className="py-3">₹5,000–50,000 (cheaper entry)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Cost (ongoing)</td>
                <td className="py-3 pr-4 text-maroon font-medium">Low — hosting often free</td>
                <td className="py-3">₹1,500–8,000/mo hosting</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-text-primary">Scalability</td>
                <td className="py-3 pr-4 text-maroon font-medium">Excellent — CDN-first</td>
                <td className="py-3">Needs optimization at scale</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">When to Choose Next.js</p>
        <h2 className="text-xl font-bold text-text-primary">When to Choose Next.js</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Choose Next.js when:
        </p>
        <ul className="mt-4 space-y-3 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">Performance is critical.</strong> You need sub-second load times, high Lighthouse scores, and strong Core Web Vitals. This is not vanity — Google uses page experience as a ranking factor, and users abandon slow sites.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">You need custom interactions.</strong> Scroll-driven animations, interactive filtering, page transitions, or rich UI components that go beyond what a page builder can produce.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">A developer will maintain the site.</strong> Content changes infrequently, and when they do, you are comfortable contacting your developer or using a headless CMS.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">Security matters.</strong> You do not want to worry about plugin vulnerabilities, admin panel brute-force attacks, or PHP version compatibility.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">You want clean, maintainable code.</strong> The site is an investment, not a throwaway — you want a codebase that any competent developer can understand and extend.</span></li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">When to Choose WordPress</p>
        <h2 className="text-xl font-bold text-text-primary">When to Choose WordPress</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Choose WordPress when:
        </p>
        <ul className="mt-4 space-y-3 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">Your team needs to update content regularly.</strong> You publish blog posts weekly, update product listings, or change team pages — and the people doing this are not developers.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">You need specific plugins.</strong> WooCommerce for e-commerce, LearnDash for courses, or a booking system that has no equivalent in the Next.js ecosystem. The WordPress plugin ecosystem is decades ahead in breadth.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">Budget is tight and you need something now.</strong> A basic WordPress site with a pre-built theme can be live in a day. It will not be custom or fast, but it gives you a web presence immediately.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">Your site is primarily a blog.</strong> WordPress is purpose-built for content publishing. If 80% of your site is blog content, the editorial workflow advantage is significant.</span></li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Hybrid</p>
        <h2 className="text-xl font-bold text-text-primary">Hybrid Approaches</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          You do not have to choose one or the other exclusively. A common pattern is WordPress as a headless CMS with Next.js as the frontend. Your content editors work in the WordPress admin, and your visitors experience a fast, custom-built Next.js site. This gives you the best of both worlds — easy content management and excellent performance — but it adds architectural complexity and cost.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          I have set up this pattern for clients who need frequent content updates but refuse to compromise on performance. It works well, but it requires more upfront investment and ongoing coordination between the CMS and the frontend. For a small business that updates their site a few times a year, it is overkill. For a media company or a brand with an active content calendar, it can be the right architecture.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          Another option is Next.js with a dedicated headless CMS like Sanity, Contentful, or even Notion as a database. These are designed from the ground up to work with modern frameworks and give you a clean API, structured content, and real-time previews. The tradeoff is that they are less familiar to non-technical users compared to WordPress.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Real Experience</p>
        <h2 className="text-xl font-bold text-text-primary">My Experience Building Both</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          I started my career building WordPress sites. They were functional, and clients could update them themselves. But the recurring issues were consistent: plugins breaking after updates, sites slowing down as content grew, security scares from outdated dependencies, and the inability to build truly custom interactions without writing fragile JavaScript on top of PHP-rendered HTML.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          Switching to Next.js resolved these issues structurally. Sites are faster by default, the codebase is cleaner, security concerns are minimal, and I can build any interaction I can design. The tradeoff is that content changes come through me or through a headless CMS — there is no visual page builder that a marketing intern can use unsupervised.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          For most of my clients — service businesses, startups, and independent brands — this tradeoff is acceptable. They update their site a few times a year, and when they do, they want it done properly. They would rather email me to add a new service page than risk breaking their own layout in a page builder. If your situation is different — if you are publishing content daily or weekly — WordPress might genuinely be the better tool.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Decision Framework</p>
        <h2 className="text-xl font-bold text-text-primary">Quick Decision Framework</h2>
        <div className="mt-4 bg-bg-surface-2 border border-border p-5">
          <p className="text-text-muted leading-relaxed mb-3">Ask yourself these questions:</p>
          <ul className="space-y-3 text-text-muted leading-relaxed">
            <li className="flex gap-2"><span className="text-maroon font-bold">1.</span> <span>Will non-developers update content regularly? <strong className="text-text-primary">Yes → WordPress. No → Next.js.</strong></span></li>
            <li className="flex gap-2"><span className="text-maroon font-bold">2.</span> <span>Is performance a competitive advantage? <strong className="text-text-primary">Yes → Next.js. Not critical → Either works.</strong></span></li>
            <li className="flex gap-2"><span className="text-maroon font-bold">3.</span> <span>Do you need custom animations/interactions? <strong className="text-text-primary">Yes → Next.js. No → Either works.</strong></span></li>
            <li className="flex gap-2"><span className="text-maroon font-bold">4.</span> <span>Do you need WooCommerce or specific plugins? <strong className="text-text-primary">Yes → WordPress. No → Next.js.</strong></span></li>
            <li className="flex gap-2"><span className="text-maroon font-bold">5.</span> <span>Is your site primarily a blog? <strong className="text-text-primary">Yes → WordPress. No → Next.js.</strong></span></li>
          </ul>
        </div>
        <p className="text-text-muted mt-4 leading-relaxed">
          Still unsure? <Link href="/contact" className="text-maroon hover:underline">Reach out</Link> — I will give you an honest recommendation based on your specific situation, even if that means I suggest WordPress over my own preferred stack.
        </p>
      </AnimatedSection>
    </div>
  );
}
