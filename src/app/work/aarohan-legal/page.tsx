import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aarohan Legal — Designing an editorial digital presence for an Indian boutique legal practice',
  description: 'A detailed case study of Aarohan Legal, an original Next.js and WebGL website balancing editorial design, professional restraint, accessibility, security and legal-content governance.',
  openGraph: {
    title: 'Aarohan Legal — Editorial Digital Presence for an Indian Boutique Legal Practice',
    description: 'A detailed case study of Aarohan Legal, an original Next.js and WebGL website balancing editorial design, professional restraint, accessibility, security and legal-content governance.',
    url: 'https://dev-aditya.com/work/aarohan-legal',
    type: 'article',
  },
};

/* ═══ Shared visual components ═══ */

function MaroonDivider() {
  return <div className="w-full h-px bg-border my-0" aria-hidden="true" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted/60 uppercase tracking-[0.2em] mb-4">{children}</p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight leading-[1.2]">{children}</h2>;
}

function BodyText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-text-muted text-[15px] leading-[1.8] mt-4 ${className}`}>{children}</p>;
}

function ProofCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-surface border border-border-hard p-5 shadow-hard-sm">
      <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">{label}</p>
      <p className="text-sm text-text-primary mt-2 leading-[1.7]">{value}</p>
    </div>
  );
}

function DecisionItem({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 md:gap-6">
      <span className="font-[family-name:var(--font-mono)] text-maroon text-lg md:text-xl font-bold shrink-0 mt-0.5 tabular-nums">{num}</span>
      <div>
        <p className="text-text-primary text-[15px] font-semibold leading-snug">{title}</p>
        <p className="text-text-muted text-sm leading-[1.7] mt-1.5">{desc}</p>
      </div>
    </div>
  );
}

function MetaGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
      {items.map((item) => (
        <div key={item.label} className="border border-border p-4">
          <p className="font-[family-name:var(--font-mono)] text-[9px] text-text-muted/60 uppercase tracking-[0.15em]">{item.label}</p>
          <p className="text-sm text-text-primary mt-1.5 leading-snug">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-6 font-[family-name:var(--font-mono)] text-sm">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          <span className="bg-bg-surface border border-border-hard px-3 py-1.5 text-xs text-text-primary tracking-wide">{step}</span>
          {i < steps.length - 1 && <span className="text-maroon text-xs" aria-hidden="true">&rarr;</span>}
        </span>
      ))}
    </div>
  );
}

function StackGrid({ groups }: { groups: { title: string; items: string[] }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {groups.map((g) => (
        <div key={g.title} className="border border-border p-4">
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest mb-3">{g.title}</p>
          <ul className="space-y-1.5">
            {g.items.map((item) => (
              <li key={item} className="text-sm text-text-muted leading-snug">{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ProtectionList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li key={item} className="text-text-muted text-sm leading-[1.7] flex gap-2">
          <span className="text-maroon mt-0.5 shrink-0">&mdash;</span> {item}
        </li>
      ))}
    </ul>
  );
}

/* ═══ Page ═══ */

export default function AarohanLegalCaseStudy() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* ─── Back link ─── */}
      <div className="pt-32">
        <Link
          href="/work"
          className="text-sm text-text-muted hover:text-maroon transition-colors font-[family-name:var(--font-mono)] uppercase tracking-widest"
        >
          &larr; All work
        </Link>
      </div>

      {/* ─── HERO ─── */}
      <section className="mt-10 pb-16 border-b border-border-hard">
        <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted">
          CASE STUDY 04 &middot; LEGAL PRACTICE &middot; NEXT.JS / TYPESCRIPT / THREE.JS / CONTENT GOVERNANCE
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mt-6 tracking-tight leading-[1.1] text-text-primary max-w-3xl">
          Designing a legally restrained digital presence for an Indian boutique practice
        </h1>
        <p className="text-text-muted text-lg max-w-3xl mt-6 leading-[1.8]">
          Aarohan Legal explores how an Indian legal-practice website can feel distinctive without behaving like a conventional commercial landing page. The project replaces stock courthouse imagery, aggressive calls to action and unverifiable claims with editorial hierarchy, procedural illustration, quiet motion and a content system built around review, restraint and clear professional boundaries.
        </p>

        <MetaGrid
          items={[
            { label: 'Sector', value: 'Indian Legal Practice' },
            { label: 'Project Type', value: 'Independent Portfolio Project' },
            { label: 'Role', value: 'Brand Direction, UI/UX, Frontend, WebGL and Content Architecture' },
            { label: 'Platform', value: 'Responsive Web' },
            { label: 'Visual System', value: 'Original Procedural Illustration' },
            { label: 'Status', value: 'Technical and Editorial Implementation' },
          ]}
        />

        <div className="flex flex-wrap gap-4 mt-8">
          <a
            href="https://aarohan-legal.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-maroon text-white border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200"
          >
            View Live Website &nearr;
          </a>
          <a
            href="https://github.com/witejackel-eng/aarohan-legal"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-text-primary border border-border-hard px-5 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 shadow-hard-sm"
          >
            View GitHub Repository &nearr;
          </a>
        </div>
      </section>

      {/* ─── PROOF CARDS ─── */}
      <section className="py-16">
        <div className="grid md:grid-cols-2 gap-4">
          <ProofCard
            label="Original Visual System"
            value="A procedural WebGL sculpture and seven custom SVG illustration systems replace generic legal stock photography."
          />
          <ProofCard
            label="Editorial Architecture"
            value="Principles, practice areas, perspectives, disclaimers and enquiries are organised as a restrained digital publication."
          />
          <ProofCard
            label="Content Governance"
            value="Legal perspectives remain unpublished until their review status and legal-review flags are explicitly approved."
          />
          <ProofCard
            label="Production Safeguards"
            value="Reduced-motion support, keyboard navigation, server-side validation, rate limiting and security headers are included."
          />
        </div>
      </section>

      <MaroonDivider />

      {/* ─── THE CONTEXT ─── */}
      <section className="py-16">
        <SectionLabel>Section 01</SectionLabel>
        <SectionHeading>The context</SectionHeading>
        <BodyText>
          Legal websites have an unusual design problem. They must communicate competence and clarity, but an advocate&apos;s website should not resemble an aggressive sales funnel. Conventional portfolio patterns&mdash;testimonials, client logos, victory claims, countdowns and exaggerated calls to action&mdash;would be inappropriate here.
        </BodyText>
        <BodyText>
          The project therefore began with a different question: how can a boutique Indian legal practice establish a memorable digital identity while remaining informational, restrained and honest about what the website can and cannot represent?
        </BodyText>
      </section>

      <MaroonDivider />

      {/* ─── THE CENTRAL CHALLENGE ─── */}
      <section className="py-16">
        <SectionLabel>Section 02</SectionLabel>
        <SectionHeading>The central challenge</SectionHeading>
        <BodyText>
          The main challenge was not making the website appear premium. It was making it distinctive without relying on the visual and commercial shortcuts commonly used by professional-service websites.
        </BodyText>
        <BodyText>
          The interface needed to feel contemporary without becoming fashionable for its own sake, Indian without decorative stereotypes, authoritative without inventing credentials, and useful without presenting general information as advice for an individual legal matter.
        </BodyText>

        <div className="mt-8 border border-border p-6">
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest mb-4">Constraints</p>
          <ul className="space-y-2.5">
            {[
              'No fabricated advocate profiles or qualifications',
              'No testimonials or client-result claims',
              'No generic scales, gavels, handshakes or courthouse photography',
              'No aggressive lead-generation language',
              'No automatic publication of unreviewed legal content',
              'No implication that an enquiry creates an advocate-client relationship',
              'No claim that the implementation itself certifies legal compliance',
            ].map((item) => (
              <li key={item} className="text-text-muted text-sm leading-[1.7] flex gap-2">
                <span className="text-maroon mt-0.5 shrink-0">&mdash;</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MaroonDivider />

      {/* ─── DESIGN STRATEGY ─── */}
      <section className="py-16">
        <SectionLabel>Section 03</SectionLabel>
        <SectionHeading>Editorial, not promotional</SectionHeading>
        <BodyText>
          The design strategy treats the website more like an independent legal publication than a conventional agency landing page. Large typography, deliberate spacing, numbered sections and a structured full-screen index create a measured reading rhythm.
        </BodyText>
        <BodyText>
          The visual identity uses paper, ink, constitutional red, antique brass and dark editorial surfaces. These references create an Indian legal character without copying ceremonial imagery or reducing the identity to decorative cultural motifs.
        </BodyText>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {[
            { title: 'Restraint', desc: 'Motion and colour establish hierarchy without turning every interaction into a spectacle.' },
            { title: 'Precision', desc: 'Labels, section numbers, type scales and alignment rules make the interface feel deliberate.' },
            { title: 'Originality', desc: 'Typography, geometry and procedural illustration replace downloaded imagery and legal clichés.' },
            { title: 'Legibility', desc: 'Long-form information remains readable across desktop, tablet and mobile layouts.' },
            { title: 'Professional boundaries', desc: 'The interface distinguishes general information, editorial perspectives and direct enquiries.' },
          ].map((p) => (
            <div key={p.title} className="border border-border p-5">
              <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">{p.title}</p>
              <p className="text-sm text-text-muted mt-2 leading-[1.7]">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <MaroonDivider />

      {/* ─── INFORMATION ARCHITECTURE ─── */}
      <section className="py-16">
        <SectionLabel>Section 04</SectionLabel>
        <SectionHeading>Structuring a legal practice without turning it into a sales catalogue</SectionHeading>
        <BodyText>
          Rather than presenting the practice as a product with feature lists and pricing, the content is organised into distinct editorial areas, each serving a different purpose in the visitor&apos;s understanding of the practice.
        </BodyText>

        <div className="mt-8 space-y-6">
          <div className="border border-border p-5">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">Principles</p>
            <p className="text-sm text-text-muted mt-2 leading-[1.7]">Five operating principles establish the practice&apos;s intended character before the visitor reaches detailed service information.</p>
          </div>
          <div className="border border-border p-5">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">Practice Areas</p>
            <p className="text-sm text-text-muted mt-2 leading-[1.7]">Seven practice areas use consistent editorial structure and custom procedural illustrations rather than product-style sales cards.</p>
          </div>
          <div className="border border-border p-5">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">Perspectives</p>
            <p className="text-sm text-text-muted mt-2 leading-[1.7]">Editorial notes are treated as reviewed publications, not automatically generated blog content.</p>
          </div>
          <div className="border border-border p-5">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">Disclaimer</p>
            <p className="text-sm text-text-muted mt-2 leading-[1.7]">A first-session disclaimer establishes the informational nature of the website before the main experience is entered.</p>
          </div>
          <div className="border border-border p-5">
            <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">General Enquiries</p>
            <p className="text-sm text-text-muted mt-2 leading-[1.7]">The enquiry flow collects only necessary information and explicitly avoids creating an automatic advocate-client relationship.</p>
          </div>
        </div>

        <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted/60 uppercase tracking-[0.15em] mt-10 mb-3">Content flow</p>
        <FlowDiagram steps={['Entry', 'Disclaimer', 'Principles', 'Practice Areas', 'Perspectives', 'General Enquiry']} />
      </section>

      <MaroonDivider />

      {/* ─── THE CONSTITUTIONAL FIELD ─── */}
      <section className="py-16">
        <SectionLabel>Section 05</SectionLabel>
        <SectionHeading>A procedural hero instead of a legal cliché</SectionHeading>
        <BodyText>
          The hero centres on &ldquo;The Constitutional Field,&rdquo; a procedural WebGL sculpture created with Three.js and React Three Fiber. Its role is not to represent a literal legal symbol. It creates a shifting field of structure, tension and order that can support the identity without dictating a single interpretation.
        </BodyText>
        <BodyText>
          Because the geometry is generated in code, the project avoids licensing concerns, downloaded imagery and generic AI-generated lawyer portraits. A static alternative is provided when reduced motion is requested or the full WebGL experience is unsuitable.
        </BodyText>

        <StackGrid
          groups={[
            { title: 'Core 3D', items: ['Three.js', 'React Three Fiber', 'React Three Drei'] },
            { title: 'Canvas behaviour', items: ['Responsive canvas sizing', 'Controlled animation', 'Reduced-motion fallback'] },
            { title: 'Approach', items: ['Progressive enhancement', 'No essential information inside the canvas'] },
          ]}
        />
      </section>

      <MaroonDivider />

      {/* ─── PRACTICE-AREA ILLUSTRATIONS ─── */}
      <section className="py-16">
        <SectionLabel>Section 06</SectionLabel>
        <SectionHeading>Seven areas, one visual grammar</SectionHeading>
        <BodyText>
          Each practice area receives an original procedural SVG illustration. Instead of assigning a literal icon to every legal subject, the illustrations share a common system of lines, fields, intersections and structured movement.
        </BodyText>
        <BodyText>
          This creates enough variation to distinguish the practice areas while keeping them visibly part of one identity. The illustrations remain lightweight, scalable and compatible with the restrained no-stock-image direction. Meaningful illustrations carry accessible labels where appropriate, while purely decorative geometry is hidden from assistive technologies.
        </BodyText>
      </section>

      <MaroonDivider />

      {/* ─── CONTENT GOVERNANCE ─── */}
      <section className="py-16">
        <SectionLabel>Section 07</SectionLabel>
        <SectionHeading>Designing for review before publication</SectionHeading>
        <BodyText>
          A legal website should not treat publishing as a frictionless content-marketing exercise. Aarohan Legal therefore separates drafting, editorial review and public publication.
        </BodyText>
        <BodyText>
          Perspective entries carry an explicit status and legal-review flag. An article is intended to become public only after both publishing conditions are satisfied. The validation workflow checks the article&apos;s title, dates, abstract, disclaimer, legal-review state, sources and body before publication.
        </BodyText>

        <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted/60 uppercase tracking-[0.15em] mt-8 mb-3">Publishing workflow</p>
        <FlowDiagram steps={['Draft', 'Editorial Review', 'Legal Review', 'Validation', 'Publication']} />

        <div className="mt-8 border border-border p-5 bg-bg-surface">
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest mb-3">Relevant architecture</p>
          <ul className="space-y-1.5">
            {[
              'src/content/perspectives.ts',
              'scripts/validate-perspectives.mjs',
              'status: draft | reviewed | published',
              'legalReview: boolean',
            ].map((item) => (
              <li key={item} className="font-[family-name:var(--font-mono)] text-sm text-text-muted leading-snug">{item}</li>
            ))}
          </ul>
        </div>

        <BodyText className="mt-6 text-sm">
          This is a technical safeguard supporting review&mdash;not a substitute for review by an enrolled advocate.
        </BodyText>
      </section>

      <MaroonDivider />

      {/* ─── DISCLAIMER EXPERIENCE ─── */}
      <section className="py-16">
        <SectionLabel>Section 08</SectionLabel>
        <SectionHeading>Setting expectations before interaction</SectionHeading>
        <BodyText>
          The disclaimer appears for the first browser session. Acceptance uses <code className="font-[family-name:var(--font-mono)] text-sm text-maroon">sessionStorage</code>. There is no preselected acceptance. Keyboard focus remains inside the dialog and is restored after acceptance. A link to the full disclaimer is visible. Analytics remain disabled by default. Escape provides a leave action. Public informational content remains available for indexing.
        </BodyText>
        <BodyText className="text-sm">
          The gate is designed as a clear informational boundary, not as a guaranteed legal-compliance mechanism.
        </BodyText>
      </section>

      <MaroonDivider />

      {/* ─── ENQUIRY FLOW AND SECURITY ─── */}
      <section className="py-16">
        <SectionLabel>Section 09</SectionLabel>
        <SectionHeading>A restrained enquiry system</SectionHeading>
        <BodyText>
          The enquiry flow is intentionally narrower than a conventional lead-generation form. It validates submissions on the server, limits request size, reduces automated spam and returns generic error messages without exposing internal application details.
        </BodyText>
        <BodyText>
          The form does not promise a response time, subscribe the visitor to a mailing list, upload confidential documents or imply that submission creates an advocate-client relationship.
        </BodyText>

        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest mb-4">Form protections</p>
            <ProtectionList
              items={[
                'Zod server-side validation',
                'Honeypot field',
                'Per-IP rate limiting',
                '10 KB request-size limit',
                'Generic safe errors',
                'No form content logged',
                'No attachment uploads',
                'No automatic CRM forwarding',
                'No automatic legal response',
                'Graceful failure when email delivery is not configured',
              ]}
            />
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest mb-4">Security headers</p>
            <ProtectionList
              items={[
                'Content-Security-Policy',
                'Strict-Transport-Security',
                'X-Content-Type-Options',
                'Referrer-Policy',
                'Permissions-Policy',
                "frame-ancestors 'none'",
              ]}
            />
          </div>
        </div>
      </section>

      <MaroonDivider />

      {/* ─── ACCESSIBILITY ─── */}
      <section className="py-16">
        <SectionLabel>Section 10</SectionLabel>
        <SectionHeading>Motion and editorial design without excluding users</SectionHeading>
        <BodyText>
          The project targets WCAG 2.2 AA as a design target. No formal external audit has been conducted, and the project does not claim WCAG certification. The following accessible patterns are implemented throughout:
        </BodyText>

        <ProtectionList
          items={[
            'Semantic heading hierarchy with one logical h1 per page',
            'Skip-to-content link',
            'Keyboard-operable navigation and full-screen index',
            'Visible focus treatment on all interactive elements',
            'Focus trapping and restoration in the disclaimer dialog',
            'Reduced-motion support via prefers-reduced-motion media query',
            'Descriptive form errors tied to fields',
            'Accessible SVG handling (aria-hidden for decorative, labels for meaningful)',
            'No information communicated by colour alone',
            'No autoplay audio',
            'Responsive text sizing using clamp()',
            'No horizontal overflow at common mobile widths (320px through 1440px)',
          ]}
        />
      </section>

      <MaroonDivider />

      {/* ─── TECHNICAL ARCHITECTURE ─── */}
      <section className="py-16">
        <SectionLabel>Section 11</SectionLabel>
        <SectionHeading>The implementation</SectionHeading>
        <BodyText>
          The website uses a single-route, client-side view-state architecture to create a multi-view editorial experience. This allows fluid transitions between sections without full-page reloads, at the cost of a more complex state management model. Separate server-rendered routes could provide a simpler long-term model for large-scale content growth&mdash;this trade-off is acknowledged rather than presented as universally ideal.
        </BodyText>

        <StackGrid
          groups={[
            { title: 'Framework', items: ['Next.js 16 with the App Router', 'React 19', 'TypeScript in strict mode'] },
            { title: 'Styling & interaction', items: ['Tailwind CSS 4', 'Framer Motion', 'Custom CSS-generated graphics'] },
            { title: 'Procedural visuals', items: ['Three.js', '@react-three/fiber', '@react-three/drei', 'Custom SVG illustration components'] },
            { title: 'Forms & validation', items: ['React Hook Form', 'Zod', 'Optional Resend email delivery'] },
          ]}
        />

        <div className="mt-6 border border-border p-5">
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest mb-3">Content</p>
          <ul className="space-y-1.5">
            {[
              'Typed content modules in src/content',
              'Central configuration in src/config/site.ts',
              'No external CMS',
            ].map((item) => (
              <li key={item} className="text-sm text-text-muted leading-snug">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <MaroonDivider />

      {/* ─── KEY DESIGN DECISIONS ─── */}
      <section className="py-16">
        <SectionLabel>Section 12</SectionLabel>
        <SectionHeading>Key design decisions</SectionHeading>

        <div className="space-y-6 mt-8">
          <DecisionItem
            num="01"
            title="Replace stock imagery with procedural systems"
            desc="This gave the practice an original identity while avoiding generic lawyer portraits, courtrooms, gavels and licensing dependencies."
          />
          <DecisionItem
            num="02"
            title="Use an editorial index instead of standard dropdown navigation"
            desc="The navigation behaves like a publication index and gives every section a clear numerical position."
          />
          <DecisionItem
            num="03"
            title="Keep motion quiet"
            desc="Transitions support hierarchy and orientation rather than constantly demanding attention."
          />
          <DecisionItem
            num="04"
            title="Separate draft content from public content"
            desc="Publishing requires explicit editorial and legal-review states."
          />
          <DecisionItem
            num="05"
            title="Make disclaimers part of the experience"
            desc="Professional boundaries are communicated before the visitor reaches enquiry actions."
          />
          <DecisionItem
            num="06"
            title="Build graceful fallbacks"
            desc="The experience remains usable without WebGL, full motion or configured email delivery."
          />
        </div>
      </section>

      <MaroonDivider />

      {/* ─── RESPONSIVE DESIGN ─── */}
      <section className="py-16">
        <SectionLabel>Section 13</SectionLabel>
        <SectionHeading>Preserving the editorial rhythm on smaller screens</SectionHeading>
        <BodyText>
          The responsive implementation makes specific decisions rather than applying a single &ldquo;fully responsive&rdquo; label. Oversized headings scale with <code className="font-[family-name:var(--font-mono)] text-sm text-maroon">clamp()</code>. Multi-column grids collapse cleanly. Navigation remains keyboard accessible at every breakpoint. Practice illustrations retain usable proportions. WebGL canvas height and complexity adapt to viewport width. Dense metadata is reorganised instead of simply shrunk. Touch targets retain sufficient size. Marquees and animation respect reduced-motion preferences.
        </BodyText>
      </section>

      <MaroonDivider />

      {/* ─── ONE HONEST TRADE-OFF ─── */}
      <section className="py-16">
        <SectionLabel>Section 14</SectionLabel>
        <SectionHeading>One honest trade-off</SectionHeading>
        <BodyText>
          The most difficult balance was creating a distinctive legal experience without making the interface feel theatrical. The WebGL field, full-screen index and large editorial typography could easily have overpowered the information.
        </BodyText>
        <BodyText>
          The solution was to limit the number of animated systems, keep transitions measured and ensure every critical action remained available through ordinary semantic interface controls. The visual layer supports the content, but the content does not depend on it.
        </BodyText>
        <BodyText className="mt-6">
          The single-route view-state structure creates fluid transitions, but separate server-rendered routes could provide a simpler long-term model for large-scale content growth. The current architecture is an intentional choice for this scope, not automatically the best approach for every legal website.
        </BodyText>
      </section>

      <MaroonDivider />

      {/* ─── THE OUTCOME ─── */}
      <section className="py-16">
        <SectionLabel>Section 15</SectionLabel>
        <SectionHeading>The outcome</SectionHeading>
        <BodyText>
          The completed implementation establishes a coherent digital language for a boutique Indian legal practice without relying on aggressive marketing patterns or invented proof.
        </BodyText>
        <BodyText>
          It combines an original editorial identity, seven practice-area illustration systems, a procedural WebGL hero, controlled publishing states, accessible interaction patterns and a protected enquiry endpoint in one consistent responsive experience.
        </BodyText>

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          {[
            'Original procedural identity',
            'Seven practice-area visual systems',
            'Controlled perspective publishing',
            'Accessible disclaimer and navigation flows',
            'Protected general-enquiry endpoint',
            'Responsive editorial interface',
            'Documented prelaunch verification process',
          ].map((item) => (
            <div key={item} className="flex gap-3 items-start border border-border p-4">
              <span className="text-maroon text-xs mt-0.5 shrink-0" aria-hidden="true">&mdash;</span>
              <span className="text-sm text-text-primary leading-snug">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-text-muted/60 text-xs mt-4">These are delivered capabilities, not performance metrics.</p>
      </section>

      <MaroonDivider />

      {/* ─── BEFORE PRODUCTION USE ─── */}
      <section className="py-16">
        <SectionLabel>Section 16</SectionLabel>
        <SectionHeading>Before production use</SectionHeading>
        <BodyText>
          The implementation is not a substitute for professional legal review. Before a real practice publishes the website, an enrolled advocate should verify all firm information, practice descriptions, disclaimers, contact details, professional credentials, privacy language and current Bar Council requirements.
        </BodyText>
        <BodyText>
          Provisional information should remain visibly identified until it has been verified, and no legal perspective should be published solely because it was generated or edited by an automated system.
        </BodyText>

        <ProtectionList
          items={[
            'Verify firm name and contact information',
            'Verify advocate profiles and enrolment details',
            'Review practice-area descriptions',
            'Review disclaimer wording',
            'Review privacy obligations',
            'Confirm applicable State Bar Council requirements',
            'Review every legal perspective',
            'Configure production email securely',
            'Run accessibility and security checks',
            'Remove or confirm all provisional content',
          ]}
        />
      </section>

      {/* ─── CTA ─── */}
      <section className="mt-16 pt-16 border-t border-border pb-32">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
          Need a professional website that must build trust without relying on hype?
        </h2>
        <p className="text-text-muted text-base max-w-2xl mt-4 leading-[1.7]">
          I design and build clear, responsive digital experiences for businesses and professional practices that need strong visual identity, careful content structure and production-ready frontend implementation.
        </p>
        <a
          href="mailto:hi.aditya.dev@gmail.com"
          className="inline-block mt-8 bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200"
        >
          EMAIL ME &rarr;
        </a>
      </section>
    </div>
  );
}