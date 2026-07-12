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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">How to Choose a Freelance Web Designer in India</h1>
        <p className="text-text-muted mt-6 leading-relaxed">
          Choosing a freelance web designer is a high-stakes decision. Your website is the public face of your business, and the person building it needs to understand your goals, communicate clearly, and deliver something that actually works — not just looks acceptable in a screenshot. This article is written from both sides: as a freelancer who has been hired (and not hired), and as someone who has seen what goes wrong when the wrong person is chosen.
        </p>
      </AnimatedSection>

      {/* ─── WHAT TO LOOK FOR ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Evaluation Criteria</p>
        <h2 className="text-xl font-bold text-text-primary">What to Look For</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          The best indicator of future work is past work — but only if you know how to evaluate it properly. Here is what actually matters.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Portfolio Quality Over Quantity</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Five strong projects tell you more than thirty mediocre ones. Look for: Do the sites look professional? Do they load fast when you visit them live? Is the mobile experience good? Does the design match the type of business? A sleek portfolio site for a design agency is different from a conversion-optimized site for a chartered accountant — both can be excellent, but they serve different purposes.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          More importantly, can you visit the live sites? Screenshots are easy to fake or polish. A live site shows you the real product — how it performs, how it feels to navigate, whether the animations are smooth or janky, whether the mobile layout actually works. If a designer only shows mockups and not live URLs, that is a signal.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Relevant Experience</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          A designer who has built sites for service businesses understands the specific challenges: how to structure service pages, how to build trust without e-commerce proof, how to design contact forms that actually convert, how to write meta descriptions that compete in local search. If your designer has only built e-commerce sites or blogs, they may produce something technically competent but strategically misaligned.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          This does not mean they need experience in your exact industry. A designer who has worked with consultants, law firms, and real estate agencies will adapt to your accounting firm faster than one who has only built WooCommerce stores. The relevant experience is in the type of website, not the specific niche.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Communication</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          The quality of communication during your initial exchanges predicts the quality of communication during the project. Do they respond within a reasonable timeframe? Do they ask questions about your business, or just ask for your requirements? Do they explain their process clearly, or is it vague? Do they push back on unrealistic expectations, or do they agree to everything?
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          A designer who asks thoughtful questions in the first conversation is more invested in getting the right result than one who sends a generic proposal. The best projects I have worked on started with a conversation where I asked more questions than the client did — because I needed to understand the problem before proposing a solution.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Process Transparency</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Can the designer explain their process from start to finish? Not in vague terms like &quot;we will design and develop your site,&quot; but specifically: what happens in the first week, when do you see designs, how many revision rounds are included, what is the handoff process, what happens after launch? A clear process means fewer surprises. An unclear process means you are trusting someone&apos;s improvisation skills.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          My own process — discovery call, proposal with scope and timeline, design phase with wireframes then visual direction, development with staging previews, QA checklist, launch, and post-launch support — exists precisely because undefined processes lead to scope creep, missed deadlines, and disappointment on both sides.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Technical Skills</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          For a modern business website, the technical foundation matters more than most clients realize. Ask what stack they build with and why. A designer who can explain why they use Next.js instead of WordPress for your specific case, or who understands Core Web Vitals and can commit to performance targets, is more likely to deliver a site that performs well in search and on mobile devices.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          This is not about hiring the most technical person. It is about ensuring the person building your primary marketing asset understands the technical factors that determine whether that asset actually performs. Beautiful design on a slow, inaccessible, poorly-structured site is wasted investment.
        </p>
      </AnimatedSection>

      {/* ─── RED FLAGS ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Red Flags</p>
        <h2 className="text-xl font-bold text-text-primary">Red Flags to Watch For</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          These are not opinions — they are patterns I have seen repeatedly that lead to bad outcomes.
        </p>
        <ul className="mt-4 space-y-4 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon font-bold">✕</span> <span><strong className="text-text-primary">No live projects in the portfolio.</strong> If everything is mockups or &quot;coming soon,&quot; they have not shipped. Shipping is different from designing — it involves browser compatibility, performance optimization, deployment, and real-world testing. You want someone who has done all of this.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">✕</span> <span><strong className="text-text-primary">Vague or suspiciously low pricing.</strong> &quot;₹5,000 for a full website&quot; either means they are desperate, they will cut every corner, or they are planning to upsell you aggressively mid-project. Transparent, tiered pricing — like the packages at <Link href="/packages" className="text-maroon hover:underline">/packages</Link> — is a sign of professionalism. You know what you get and what it costs before you start.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">✕</span> <span><strong className="text-text-primary">No defined process.</strong> If you ask &quot;how does this work?&quot; and get a rambling answer without clear phases, milestones, or deliverables, the project will be chaotic. Process is not bureaucracy — it is how professionals manage risk.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">✕</span> <span><strong className="text-text-primary">Overpromising on rankings or traffic.</strong> No web designer can guarantee page-one Google rankings. If someone promises this, they are either dishonest or using black-hat techniques that will hurt you long-term. A good designer will promise a technically sound, well-optimized site and be honest that rankings depend on many factors beyond their control.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">✕</span> <span><strong className="text-text-primary">No contract or written agreement.</strong> A contract protects both parties. If a freelancer refuses to put scope, timeline, payment terms, and deliverables in writing, they are not ready for professional work — or they are planning to change the terms later.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">✕</span> <span><strong className="text-text-primary">Unwillingness to show code or explain technical decisions.</strong> You do not need to understand the code, but you should be able to have another developer review it. If the designer is defensive about this, the code quality is likely poor.</span></li>
        </ul>
      </AnimatedSection>

      {/* ─── FREELANCER VS AGENCY ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Comparison</p>
        <h2 className="text-xl font-bold text-text-primary">Freelancer vs Agency</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Both can deliver excellent work. The right choice depends on your project, budget, and working style.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border-hard">
                <th className="text-left py-3 pr-4 font-[family-name:var(--font-mono)] uppercase tracking-widest text-xs text-text-muted">Factor</th>
                <th className="text-left py-3 pr-4 font-[family-name:var(--font-mono)] uppercase tracking-widest text-xs text-text-muted">Freelancer</th>
                <th className="text-left py-3 font-[family-name:var(--font-mono)] uppercase tracking-widest text-xs text-text-muted">Agency</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Cost</td>
                <td className="py-3 pr-4 text-maroon font-medium">₹15,000–75,000</td>
                <td className="py-3">₹80,000–3,00,000+</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Direct communication</td>
                <td className="py-3 pr-4 text-maroon font-medium">Yes — you talk to the builder</td>
                <td className="py-3">Through account manager</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Speed</td>
                <td className="py-3 pr-4 text-maroon font-medium">1–5 weeks typical</td>
                <td className="py-3">6–16 weeks typical</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Team size</td>
                <td className="py-3 pr-4">1 person (may collaborate)</td>
                <td className="py-3 text-maroon font-medium">Full team (design, dev, PM)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Availability</td>
                <td className="py-3 pr-4">May be busy with other projects</td>
                <td className="py-3 text-maroon font-medium">Dedicated resources available</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Accountability</td>
                <td className="py-3 pr-4">Personal — one person owns it</td>
                <td className="py-3">Organizational — contracts protect you</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-text-primary">Best for</td>
                <td className="py-3 pr-4">Small-to-mid business sites</td>
                <td className="py-3">Complex, multi-stakeholder projects</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-text-primary">Risk</td>
                <td className="py-3 pr-4">Single point of failure</td>
                <td className="py-3">Higher cost, longer timeline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <p className="text-text-muted leading-relaxed">
          For most service businesses in India — a consulting firm needing a 5-page site, a startup launching its first web presence, a real estate agent needing lead generation — a freelancer is the more efficient choice. You get direct communication with the person building your site, faster turnaround, and lower cost. The risk is mitigated by checking the factors above: portfolio, process, communication, and contract.
        </p>
        <p className="text-text-muted mt-3 leading-relaxed">
          An agency makes sense when you have a complex project with multiple stakeholders, need a large team with specialized roles, or require ongoing retainer support that exceeds what one person can provide. The premium you pay is for capacity and organizational structure, not necessarily higher quality per deliverable.
        </p>
      </AnimatedSection>

      {/* ─── QUESTIONS TO ASK ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Interview</p>
        <h2 className="text-xl font-bold text-text-primary">Questions to Ask Before Hiring</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          These are not trick questions. They are straightforward inquiries that reveal how a designer thinks and works. Pay attention not just to the answers, but to how they respond — with specifics or with deflections.
        </p>
        <ul className="mt-4 space-y-4 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon font-bold">1.</span> <span><strong className="text-text-primary">&quot;Can I see live projects you have built?&quot;</strong> Not screenshots, not Dribbble shots — actual websites you can visit, navigate, and test on your phone.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">2.</span> <span><strong className="text-text-primary">&quot;What is your process from start to finish?&quot;</strong> They should be able to describe clear phases, milestones, and deliverables without hesitation.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">3.</span> <span><strong className="text-text-primary">&quot;What happens if I am not satisfied with the design?&quot;</strong> The answer should include a specific revision process — not unlimited revisions (which lead to scope creep) and not zero revisions (which is unreasonable).</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">4.</span> <span><strong className="text-text-primary">&quot;What do you need from me to start?&quot;</strong> A prepared designer will have a list: brand assets, content, access to existing accounts, answers to specific questions about your business.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">5.</span> <span><strong className="text-text-primary">&quot;How do you handle SEO and performance?&quot;</strong> They should mention specific technical practices — meta tags, schema markup, image optimization, performance testing — not just &quot;we do SEO.&quot;</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">6.</span> <span><strong className="text-text-primary">&quot;What is included in the price and what costs extra?&quot;</strong> Hosting, domain, content writing, revisions beyond the included rounds, post-launch support, maintenance — these should all be clear before you sign anything.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">7.</span> <span><strong className="text-text-primary">&quot;Can I talk to a past client?&quot;</strong> Not always possible, but a willingness to connect you with a reference is a strong positive signal.</span></li>
        </ul>
      </AnimatedSection>

      {/* ─── PRICING ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Pricing</p>
        <h2 className="text-xl font-bold text-text-primary">Understanding Pricing Structures</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Freelance web designers in India typically use one of three pricing models:
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Fixed-Price Packages</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          The most common and most client-friendly model. You pay a set amount for a defined scope — a specific number of pages, features, and revision rounds. This is what I use because it gives clients certainty: you know what you are getting and what it costs before you commit. My packages at <Link href="/packages" className="text-maroon hover:underline">/packages</Link> start at ₹14,999 for a starter site, ₹34,999 for a business site, and ₹74,999 for a premium build. The prices reflect the actual scope difference, not arbitrary tiering.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Hourly Rate</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          Some designers charge ₹500–3,000 per hour. This is common for ongoing work or projects where the scope is genuinely unknown. The risk for clients is obvious: you do not know the final cost until the project is done. If you go this route, insist on a cap (maximum hours) and regular progress updates. Hourly pricing rewards slowness; fixed pricing rewards efficiency.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-6">
        <h3 className="text-lg font-bold text-text-primary">Project-Based Custom Quote</h3>
        <p className="text-text-muted mt-3 leading-relaxed">
          For projects that do not fit a standard package — complex web applications, sites with unusual features, or redesigns with specific constraints — a custom quote based on the project requirements makes sense. The designer should provide a detailed breakdown of what is included and what would constitute scope creep (additional work beyond the original agreement).
        </p>
      </AnimatedSection>

      {/* ─── PORTFOLIO EVALUATION ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Portfolio Deep-Dive</p>
        <h2 className="text-xl font-bold text-text-primary">How to Evaluate a Portfolio</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Looking at a portfolio is not about whether you personally like the visual style. It is about whether the designer can produce work that serves the client&apos;s business goals. Here is a practical evaluation method:
        </p>
        <ul className="mt-4 space-y-4 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon font-bold">1.</span> <span><strong className="text-text-primary">Visit 2–3 live sites from the portfolio.</strong> Open them on your phone. Do they load fast? Is the text readable? Can you navigate without getting lost? Can you find the contact information in under 10 seconds?</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">2.</span> <span><strong className="text-text-primary">Check for diversity of solutions.</strong> Do all the sites look the same with different colors? Or does each one reflect the specific business it was built for? A designer who applies the same template to every project is a template applier, not a designer.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">3.</span> <span><strong className="text-text-primary">Look for problem-solving.</strong> If there are case studies, do they explain the client&apos;s problem and how the design addressed it? Or is it just &quot;I made this pretty website&quot;? The latter tells you about aesthetics; the former tells you about strategic thinking.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">4.</span> <span><strong className="text-text-primary">Verify technical quality.</strong> Run Lighthouse on one of their live sites. A performance score of 80+ is reasonable for a well-built site. Below 50 suggests the designer is not prioritizing performance — and your visitors and search rankings will suffer for it.</span></li>
        </ul>
      </AnimatedSection>

      {/* ─── GOOD RELATIONSHIP ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Working Together</p>
        <h2 className="text-xl font-bold text-text-primary">What a Good Working Relationship Looks Like</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          The best client-designer relationships have a few things in common, and they are not what most people expect.
        </p>
        <ul className="mt-4 space-y-4 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">Honest pushback.</strong> A good designer will tell you when your idea is likely to hurt the user experience, confuse visitors, or undermine your goals. Yes-people deliver mediocre work. You want someone who respects your business enough to disagree with you respectfully.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">Clear communication cadence.</strong> You should know when to expect updates and what format they will be in. Weekly progress emails? Staging URL updates? Scheduled calls? The specifics matter less than the consistency.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">Mutual respect for expertise.</strong> You know your business; they know web design. When you defer to their expertise on technical decisions and they defer to yours on business decisions, the result is always better than when either side micromanages the other.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">→</span> <span><strong className="text-text-primary">Written scope and changes.</strong> Even in a good relationship, scope changes happen. The professional way to handle them is to document what changed, discuss the impact on timeline and cost, and agree before proceeding — not to silently expand the project and argue about it later.</span></li>
        </ul>
      </AnimatedSection>

      {/* ─── PRACTICAL STEPS ─── */}
      <AnimatedSection className="mt-12">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-maroon mb-4">Action Steps</p>
        <h2 className="text-xl font-bold text-text-primary">From First Contact to Project Start</h2>
        <p className="text-text-muted mt-4 leading-relaxed">
          Here is the practical path, step by step:
        </p>
        <ul className="mt-4 space-y-4 text-text-muted leading-relaxed">
          <li className="flex gap-2"><span className="text-maroon font-bold">Step 1.</span> <span><strong className="text-text-primary">Shortlist 3–5 designers.</strong> Check their portfolios, read their websites, and see if their approach resonates with what you need. Do not just look at price — look at fit.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">Step 2.</span> <span><strong className="text-text-primary">Reach out to 2–3.</strong> Send a brief message explaining your project, your timeline, and your budget range. Designers who ask clarifying questions before quoting are more likely to deliver a thoughtful proposal.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">Step 3.</span> <span><strong className="text-text-primary">Have a conversation.</strong> A 20–30 minute call tells you more than 20 emails. You will learn how they think, how they communicate, and whether you would enjoy working with them. This matters more than people admit.</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">Step 4.</span> <span><strong className="text-text-primary">Review the proposal.</strong> It should include scope, timeline, pricing, process, and terms. Compare proposals on value, not just cost — what do you actually get? What is the revision policy? What happens after launch?</span></li>
          <li className="flex gap-2"><span className="text-maroon font-bold">Step 5.</span> <span><strong className="text-text-primary">Sign the agreement and provide onboarding materials.</strong> Brand assets (logo, colors, fonts), existing content, access to domain and hosting, and answers to the designer&apos;s intake questionnaire. The faster you provide these, the faster the project starts.</span></li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <div className="bg-bg-surface-2 border border-border p-5">
          <p className="text-text-muted leading-relaxed">
            If you are evaluating designers right now, my <Link href="/packages" className="text-maroon hover:underline">packages page</Link> has transparent pricing and detailed scope descriptions, and my <Link href="/about" className="text-maroon hover:underline">about page</Link> explains my approach and background. You can also check the <Link href="/work" className="text-maroon hover:underline">case studies</Link> to see live projects with the results they achieved. No pressure — take your time, compare options, and choose whoever is the best fit for your specific situation.
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
}
