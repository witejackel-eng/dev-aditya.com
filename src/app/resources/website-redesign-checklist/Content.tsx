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

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-text-muted leading-relaxed">
      <span className="w-5 h-5 mt-0.5 border border-border-hard rounded flex-shrink-0" />
      {children}
    </li>
  );
}

export default function Content() {
  return (
    <div className="mt-8">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Website Redesign Checklist for Service Businesses</h1>
        <p className="text-text-muted mt-6 leading-relaxed">
          Redesigning a website is not just about making it look different — it is about making it work better. For service businesses, your website is often the first impression a potential client has of your work. A redesign that does not address the underlying problems (poor messaging, slow performance, broken mobile experience) is just reskinning the same problems. This checklist is built from the redesigns I have done for service businesses — the steps that actually matter, the ones people skip and regret, and the order that prevents rework.
        </p>
      </AnimatedSection>

      {/* ─── WHY REDESIGN ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">01 · Why</p>
        <h2 className="text-xl font-bold text-text-primary">Signs You Need a Redesign</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Before committing to a redesign, be clear about what is wrong. Vague dissatisfaction leads to vague results. Here are the concrete signs I see most often in service businesses:
        </p>
        <ul className="mt-4 space-y-3">
          <ChecklistItem>Your site looks dated compared to competitors — and prospects mention it</ChecklistItem>
          <ChecklistItem>Mobile experience is poor — text is too small, buttons are unclickable, layouts break</ChecklistItem>
          <ChecklistItem>Page load time exceeds 3 seconds on a typical connection</ChecklistItem>
          <ChecklistItem>Bounce rate is above 70% on key landing pages</ChecklistItem>
          <ChecklistItem>Your messaging does not reflect your current services or positioning</ChecklistItem>
          <ChecklistItem>Contact form submissions have dropped over time</ChecklistItem>
          <ChecklistItem>You are embarrassed to share the URL</ChecklistItem>
          <ChecklistItem>The site was built more than 3 years ago and has had no significant updates</ChecklistItem>
        </ul>
        <p className="text-text-muted mt-4 leading-relaxed">
          If you checked three or more of these, a redesign is worth considering. If you checked one or two, targeted fixes may be more efficient than a full redesign. I have had clients come to me wanting a complete rebuild when the real issue was a slow host and an unclear call-to-action — problems that could be solved in a week without starting from scratch.
        </p>
      </AnimatedSection>

      {/* ─── PRE-REDESIGN AUDIT ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">02 · Audit</p>
        <h2 className="text-xl font-bold text-text-primary">Pre-Redesign Audit</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Before designing anything, understand what you have. This is the most skipped step and the one that causes the most rework later.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Current Performance Baseline</h3>
        <ul className="mt-3 space-y-3">
          <ChecklistItem>Run Lighthouse audit on current site — record scores for Performance, Accessibility, Best Practices, SEO</ChecklistItem>
          <ChecklistItem>Check Core Web Vitals in Google Search Console — LCP, FID/INP, CLS</ChecklistItem>
          <ChecklistItem>Measure actual page load time on a 4G mobile connection (not just desktop Wi-Fi)</ChecklistItem>
          <ChecklistItem>Document current analytics: monthly visitors, bounce rate, top pages, conversion rate</ChecklistItem>
          <ChecklistItem>Identify which pages get the most traffic — these need the most careful handling during migration</ChecklistItem>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Content Audit</h3>
        <ul className="mt-3 space-y-3">
          <ChecklistItem>Inventory all existing pages — URLs, content, purpose</ChecklistItem>
          <ChecklistItem>Flag content that is outdated, inaccurate, or redundant</ChecklistItem>
          <ChecklistItem>Identify content that performs well in search — do not delete or drastically change these pages without a migration plan</ChecklistItem>
          <ChecklistItem>Decide what to keep, revise, combine, or remove entirely</ChecklistItem>
          <ChecklistItem>Check for existing backlinks to important pages — these need URL redirects if paths change</ChecklistItem>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Competitor and Market Review</h3>
        <ul className="mt-3 space-y-3">
          <ChecklistItem>Review 3–5 direct competitor websites — note what they do well and what they miss</ChecklistItem>
          <ChecklistItem>Search for the keywords your clients actually use — see who ranks and what their pages look like</ChecklistItem>
          <ChecklistItem>Identify gaps — services competitors do not cover, messaging angles they ignore, experiences they fail to provide</ChecklistItem>
        </ul>
        <p className="text-text-muted mt-3 leading-relaxed">
          This is not about copying competitors. It is about understanding the landscape so you can differentiate meaningfully. I once redesigned a site for a consulting firm that was trying to sound like every other consulting firm. When we shifted their messaging to their actual differentiator — they worked exclusively with family-owned businesses — inquiries tripled. The design change was minor. The strategy change was everything.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">User Feedback</h3>
        <ul className="mt-3 space-y-3">
          <ChecklistItem>Ask 3–5 recent clients what they thought of your site before contacting you</ChecklistItem>
          <ChecklistItem>Ask people who visited but did not contact you — what stopped them?</ChecklistItem>
          <ChecklistItem>Watch someone unfamiliar with your site try to find your services and contact information</ChecklistItem>
        </ul>
        <p className="text-text-muted mt-3 leading-relaxed">
          This is uncomfortable but invaluable. People are polite in surveys, but watching someone struggle to find your phone number on your own site tells you more than any analytics report.
        </p>
      </AnimatedSection>

      {/* ─── STRATEGY ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">03 · Strategy</p>
        <h2 className="text-xl font-bold text-text-primary">Strategy Phase</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Strategy is where redesigns succeed or fail. Design and development can only execute on a clear strategy — they cannot create one.
        </p>
        <ul className="mt-4 space-y-3">
          <ChecklistItem><strong className="text-text-primary">Define the primary goal.</strong> More inquiries? Higher-value clients? Better brand perception? Stronger search visibility? Pick one primary goal and make every decision serve it.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Define your target audience.</strong> Not demographics — behaviors. Who are they? What problem are they trying to solve? What would make them trust you?</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Clarify your key messages.</strong> What three things must a visitor understand within 10 seconds of landing on your site? If you cannot answer this quickly, your visitors certainly cannot.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Position against competitors.</strong> What makes you different — not just better, but different — from the other options your audience is considering?</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Set measurable success criteria.</strong> 50% more inquiries in 6 months? Lighthouse performance score above 90? Page load under 2 seconds? Without measurable targets, you cannot evaluate whether the redesign worked.</ChecklistItem>
        </ul>
      </AnimatedSection>

      {/* ─── CONTENT PLANNING ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">04 · Content</p>
        <h2 className="text-xl font-bold text-text-primary">Content Planning</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Content and design are not separate phases. Your content structure determines your layout, not the other way around. Designing first and filling in content later is the most common cause of redesign failure.
        </p>
        <ul className="mt-4 space-y-3">
          <ChecklistItem><strong className="text-text-primary">Define page structure.</strong> What pages do you need? Home, About, Services (individual pages per service?), Work/Case Studies, Contact, Blog? List every page and its purpose.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Write page outlines before design.</strong> Each page needs a headline, sub-headline, key points, and call-to-action. Even rough drafts are better than designing around placeholder text.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Map keywords to pages.</strong> Each page should target 1–3 primary keywords. Your services page should not compete with your homepage for the same terms.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Plan images and media.</strong> Which pages need photography? Which need icons or illustrations? Do you have high-resolution assets, or do you need a brand photography session?</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Write calls-to-action for every page.</strong> Every page should answer: what should the visitor do next? Contact us? View our work? Read more? Do not leave this for later.</ChecklistItem>
        </ul>
        <p className="text-text-muted mt-3 leading-relaxed">
          I have seen redesigns where the design was excellent but the content was still the old, generic text from the previous site. The result: a beautiful site that converted no better than the ugly one it replaced. Content is not a detail — it is the foundation.
        </p>
      </AnimatedSection>

      {/* ─── DESIGN ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">05 · Design</p>
        <h2 className="text-xl font-bold text-text-primary">Design Phase</h2>
        <ul className="mt-4 space-y-3">
          <ChecklistItem><strong className="text-text-primary">Start with wireframes.</strong> Low-fidelity layouts that show structure, hierarchy, and flow — not colors or typography. This is where you decide what goes where before investing in visual polish.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Define visual direction.</strong> Color palette, typography, spacing system, component styles. For my clients, this is captured in a design system that ensures consistency across every page.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Design mobile-first.</strong> Over 60% of web traffic in India is mobile. If your design does not work on a 375px screen, it does not work. I design mobile layouts first and enhance for desktop — not the reverse.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Prioritize hierarchy and readability.</strong> Large, clear headings. Generous line spacing. Strong contrast. No 12px light-gray text on a white background. This is not aesthetics — it is usability.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Plan animations intentionally.</strong> Animations should guide attention, communicate state changes, or add personality — not slow down the experience or distract from content. Every animation should answer: what purpose does this serve?</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Design the states.</strong> Hover, focus, active, error, empty, loading — these are not edge cases. They are part of the experience. Designing only the happy path means the unhappy path gets handled by the browser defaults, which is never good.</ChecklistItem>
        </ul>
      </AnimatedSection>

      {/* ─── DEVELOPMENT ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">06 · Development</p>
        <h2 className="text-xl font-bold text-text-primary">Development Phase</h2>
        <ul className="mt-4 space-y-3">
          <ChecklistItem><strong className="text-text-primary">Choose the right tech stack.</strong> For most service businesses, a statically generated framework (Next.js) hosted on Vercel or Netlify delivers the best performance-to-cost ratio. If your team needs to update content frequently, consider a headless CMS integration.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Set performance targets early.</strong> Lighthouse Performance score above 90. LCP under 2.5 seconds. CLS under 0.1. Write these down before development starts and test against them continuously.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Build with a component system.</strong> Reusable components with consistent spacing, typography, and interaction patterns. This is faster to develop, easier to maintain, and more consistent for visitors.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Implement SEO fundamentals during development.</strong> Semantic HTML, proper heading hierarchy, meta tags, Open Graph, schema markup, sitemap generation. Retrofitting SEO after launch is always harder and less effective.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Build accessibility in, not on.</strong> Alt text, ARIA labels, keyboard navigation, focus management, sufficient color contrast. WCAG 2.1 AA compliance is a reasonable target. Testing this later means rewriting significant portions of code.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Optimize images from the start.</strong> Modern formats (WebP, AVIF), responsive srcsets, lazy loading, proper dimensions to prevent layout shift. Images are the largest performance bottleneck on most sites.</ChecklistItem>
        </ul>
      </AnimatedSection>

      {/* ─── PRE-LAUNCH ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">07 · Pre-Launch</p>
        <h2 className="text-xl font-bold text-text-primary">Pre-Launch Checklist</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Launch day is not the finish line — it is the starting line. These checks prevent the most common post-launch problems.
        </p>
        <ul className="mt-4 space-y-3">
          <ChecklistItem><strong className="text-text-primary">Cross-browser testing:</strong> Chrome, Firefox, Safari, Edge — on both desktop and mobile</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Mobile QA:</strong> Test on actual devices, not just browser DevTools. iOS Safari and Android Chrome render differently.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">SEO verification:</strong> Meta titles and descriptions on every page. Canonical URLs correct. Schema markup validates without errors (test with Google&apos;s Rich Results Test). Sitemap generates correctly. robots.txt is present and correct.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Analytics setup:</strong> Google Analytics or equivalent installed and verified. Event tracking on key interactions (contact form submissions, CTA clicks). Goal funnels configured.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">URL redirects:</strong> If any URLs changed, set up 301 redirects from old paths to new ones. This preserves search rankings and prevents 404 errors from existing backlinks.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Contact form testing:</strong> Submit the form. Verify you receive the email. Test error states. Test on mobile.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Performance verification:</strong> Run Lighthouse on the deployed site (not localhost). Core Web Vitals check via PageSpeed Insights. Compare against the targets you set in the development phase.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Content review:</strong> Read every page. Check for typos, broken links, missing images, placeholder text. Have someone who was not involved in the project read it — fresh eyes catch what yours skip.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Security basics:</strong> No exposed API keys or secrets in client-side code. HTTPS enforced. No admin panels exposed to the public.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Favicon and app icons:</strong> Present and correct across devices and browsers.</ChecklistItem>
        </ul>
      </AnimatedSection>

      {/* ─── POST-LAUNCH ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">08 · Post-Launch</p>
        <h2 className="text-xl font-bold text-text-primary">Post-Launch Actions</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          The first two weeks after launch tell you whether the redesign achieved its goals. Pay attention and be ready to iterate.
        </p>
        <ul className="mt-4 space-y-3">
          <ChecklistItem><strong className="text-text-primary">Monitor analytics daily for the first week.</strong> Are visitors reaching key pages? Is the bounce rate improving? Are form submissions coming through? Compare against pre-redesign baseline.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Check search console for crawl errors.</strong> New sites sometimes have indexing issues. Submit the sitemap manually if pages are not being indexed within a few days.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Watch Core Web Vitals.</strong> Real-user data (field data) can differ from lab data. If real-world performance is worse than your Lighthouse scores, investigate and fix.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Collect real feedback.</strong> Ask new clients what they thought of the site. Their first impression is the most valuable data you will get.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Plan content updates.</strong> A static site that never changes loses search relevance over time. Decide on an update cadence — monthly blog posts, quarterly case studies, or at minimum, updating the copyright year and current services.</ChecklistItem>
          <ChecklistItem><strong className="text-text-primary">Schedule a 90-day review.</strong> Measure against the success criteria you defined in the strategy phase. What worked? What did not? What needs adjustment? This is where the real ROI of the redesign becomes clear.</ChecklistItem>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Common Mistakes</p>
        <h2 className="text-xl font-bold text-text-primary">Mistakes I See Most Often</h2>
        <ul className="mt-4 space-y-4 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon font-bold">1.</span> <span><strong className="text-text-primary">Redesigning without a strategy.</strong> A new visual layer on the same unclear messaging is just an expensive way to get the same results. Strategy first. Always.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">2.</span> <span><strong className="text-text-primary">Copying competitors.</strong> Your competitors&apos; websites work for their business, not yours. Imitation eliminates differentiation — the one thing that should be strongest in a redesign.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">3.</span> <span><strong className="text-text-primary">Skipping the content audit.</strong> Migrating all your old content to a new design without reviewing it means you are carrying forward every problem the old site had.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">4.</span> <span><strong className="text-text-primary">Not setting up redirects.</strong> If your old /about-us URL now goes to /about, and there is no redirect, every link pointing to the old URL returns a 404. Search rankings drop. Backlink value is lost.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">5.</span> <span><strong className="text-text-primary">Treating launch as the end.</strong> A redesign is a process, not an event. The post-launch period is where you validate assumptions and make the adjustments that determine whether the investment pays off.</span></li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <div className="bg-bg-surface-2 border border-border p-5">
          <p className="text-text-muted leading-relaxed">
            If you are considering a redesign and want to talk through the strategy before committing to anything, <Link href="/contact" className="text-maroon hover:underline">reach out</Link>. I would rather help you figure out whether a full redesign is even the right move than build something you do not need.
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
}
