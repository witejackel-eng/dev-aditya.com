/**
 * Project metadata.
 *
 * Shared between the homepage (Selected Work + Creative Technology) and the
 * /work page. Corporate and creative-technology projects are grouped
 * separately. Every project here is self-initiated; the `disclosure` field
 * records that honestly so nothing implies a commissioned client engagement.
 */

export type ProjectGroup = 'corporate' | 'creative';

export interface Project {
  slug: string;
  name: string;
  /** Short editorial category label, e.g. "LEGAL SERVICES". */
  industry: string;
  /** Concrete project type. */
  projectType: string;
  group: ProjectGroup;
  /** One-sentence business challenge the project is built around. */
  challenge: string;
  /** Wider business context, used on the Work page. */
  context: string;
  scope: string;
  role: string;
  /** How the built system serves the objective — no invented metrics. */
  outcome: string;
  /** Technology, kept as secondary metadata (rendered last). */
  technology: string[];
  /** Honest label recording that the project is self-initiated. */
  disclosure: string;
  liveUrl: string;
  caseStudyUrl: string;
  githubUrl: string;
}

export const PROJECTS: Project[] = [
  {
    slug: 'aarohan-legal',
    name: 'Aarohan Legal',
    industry: 'LEGAL SERVICES',
    projectType: 'Corporate website concept',
    group: 'corporate',
    challenge:
      'A boutique legal practice needs a credible online presence without the testimonials, result claims and stock imagery that professional-conduct rules discourage.',
    context:
      'Legal practices must communicate competence and clarity while staying within professional boundaries. The website has to feel distinctive and trustworthy without behaving like a sales funnel.',
    scope:
      'Information architecture, editorial design system, content governance, responsive frontend and a protected enquiry flow.',
    role: 'Design and frontend development',
    outcome:
      'The final website is structured as a restrained digital publication, with a controlled publishing workflow and an accessible enquiry flow that keeps professional boundaries clear.',
    technology: ['Next.js', 'TypeScript', 'Three.js', 'Framer Motion'],
    disclosure:
      'Independent concept project. It was not commissioned by a represented business.',
    liveUrl: 'https://aarohan-legal.vercel.app/',
    caseStudyUrl: '/work/aarohan-legal',
    githubUrl: 'https://github.com/witejackel-eng/aarohan-legal',
  },
  {
    slug: 'corporate-leadgen-platform',
    name: 'Corporate Lead-Gen Platform',
    industry: 'B2B MARKETING PLATFORM',
    projectType: 'Marketing platform concept',
    group: 'corporate',
    challenge:
      'A B2B marketing team needs to launch consistent campaign and service pages without rebuilding layouts or touching code each time.',
    context:
      'Marketing sites drift out of consistency as new pages are added under deadline. The platform is built around a component-driven system so every page shares the same structure and standards.',
    scope:
      'Modular section system, marketing page structure, motion system and responsive implementation.',
    role: 'Frontend architecture and UI system',
    outcome:
      'The modular system supports launching new marketing pages from reusable sections, keeping structure and presentation consistent across the site.',
    technology: ['React', 'Next.js', 'Framer Motion'],
    disclosure:
      'Independent concept project. It was not commissioned by a represented business.',
    liveUrl: 'https://corporate-leadgen-platform-jet.vercel.app/',
    caseStudyUrl: '/work/corporate-leadgen-platform',
    githubUrl: 'https://github.com/witejackel-eng/corporate-leadgen-platform',
  },
  {
    slug: 'saffron-steam-experience',
    name: 'Saffron & Steam',
    industry: 'HOSPITALITY · CONCEPT',
    projectType: 'Interactive brand experience',
    group: 'creative',
    challenge:
      'Explore how motion, WebGL and editorial design can express the atmosphere of a garden café without relying on a conventional menu-and-photos template.',
    context:
      'A self-initiated exploration of narrative, scroll choreography and 3D on the web, built around the mood of a Delhi garden café at golden hour.',
    scope:
      'WebGL hero scene, day-to-night scroll system, editorial menu and a demo reservation flow.',
    role: 'Design, frontend and WebGL',
    outcome:
      'The experience demonstrates a cohesive narrative interface where motion and 3D support the story rather than decorate it.',
    technology: ['Next.js', 'TypeScript', 'Three.js', 'GSAP'],
    disclosure:
      'Independent concept project created to explore a specific design and technical direction. It was not commissioned by the represented business.',
    liveUrl: 'https://saffron-steam-experience.vercel.app/',
    caseStudyUrl: '/work/saffron-steam-experience',
    githubUrl: 'https://github.com/witejackel-eng/saffron-steam-experience',
  },
  {
    slug: 'dust-signal',
    name: 'DUST//SIGNAL',
    industry: 'CREATIVE TECHNOLOGY',
    projectType: 'Generative interactive system',
    group: 'creative',
    challenge:
      'Turn mathematical systems, probability and procedural sound into a coherent interactive experience that is expressive without becoming visual noise.',
    context:
      'A self-initiated computational observatory connecting seeded simulations, generative visuals and user-initiated audio across a multi-route world.',
    scope:
      'Mathematical models, a Monte Carlo simulation chamber, a procedural sequencer and adaptive rendering.',
    role: 'Concept, design, frontend and generative systems',
    outcome:
      'The implementation supports an accountable creative-coding experience where the mathematics drives the behaviour and the sound responds to interaction.',
    technology: ['Next.js', 'TypeScript', 'Three.js', 'Web Audio API'],
    disclosure:
      'Independent concept project created to explore a specific design and technical direction. It was not commissioned by any organisation.',
    liveUrl: 'https://dune-aditya.vercel.app/',
    caseStudyUrl: '/work/dust-signal',
    githubUrl: 'https://github.com/witejackel-eng/dune',
  },
];

export const CORPORATE_PROJECTS = PROJECTS.filter((p) => p.group === 'corporate');
export const CREATIVE_PROJECTS = PROJECTS.filter((p) => p.group === 'creative');
