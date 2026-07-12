import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import CaseStudyContent from '@/components/CaseStudyContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateCreativeWorkSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Saffron & Steam — Immersive Café Website with WebGL & Editorial Design',
  description: 'Case study: an immersive, motion-led concept café website with a WebGL hero, day-to-night scroll sequences, editorial typography, and an interactive signature-menu rail. Built with Next.js, TypeScript, Three.js, and GSAP.',
  path: '/work/saffron-steam-experience',
  type: 'article',
  publishedTime: '2026-07-10T00:00:00+05:30',
  modifiedTime: '2026-07-10T00:00:00+05:30',
  section: 'Case Study',
  keywords: ['immersive website', 'WebGL website', 'café website design', 'Three.js', 'GSAP'],
});

export default function SaffronSteamCaseStudy() {
  const creativeWorkSchema = generateCreativeWorkSchema({
    title: 'Saffron & Steam — Immersive Café Website',
    description: 'An immersive, motion-led concept café website with WebGL hero and editorial design.',
    path: '/work/saffron-steam-experience',
    year: '2026',
    stack: 'Next.js, TypeScript, Three.js, GSAP',
    liveUrl: 'https://saffron-steam-experience.vercel.app/',
    codeRepository: 'https://github.com/witejackel-eng/saffron-steam-experience',
    keywords: ['immersive website', 'WebGL', 'café website'],
    projectType: 'Portfolio Project',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Saffron & Steam', path: '/work/saffron-steam-experience' },
  ]);

  return (
    <>
      <JsonLd data={[creativeWorkSchema, breadcrumbs]} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-4xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/work" className="hover:text-maroon transition-colors">Work</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Saffron &amp; Steam</li>
        </ol>
      </nav>
      <CaseStudyContent
        meta="CASE STUDY 01 · IMMERSIVE EXPERIENCE · NEXT.JS / TYPESCRIPT / THREE.JS / GSAP · PORTFOLIO PROJECT"
        title="Building an immersive café experience with WebGL and editorial design"
        summary="An immersive, motion-led concept café website with a WebGL hero featuring a sculptural ceramic cup and flowing saffron steam ribbon, editorial typography, day-to-night scroll sequences, and an interactive signature-menu rail — built around a Delhi garden café at golden hour."
        proof={[
          { label: 'WebGL Hero', value: 'Custom lathe-geometry ceramic cup, tube-geometry steam ribbon, floating marigold petals, sunset lighting, and adaptive DPR.' },
          { label: 'Scroll Choreography', value: 'Day-to-night room transformation from morning coffee to midday brunch to evening wine.' },
          { label: 'Editorial Design', value: 'Interactive signature-menu rail, full-screen gallery, and reservation form with validation.' },
        ]}
        problem="A café website can easily feel generic — just another menu page with photos. The challenge was to create an experience that captures the warmth and intimacy of a Delhi garden café at golden hour, making visitors feel the sunlight through linen curtains, the warmth of ceramic cups, and the slow rhythm of a brunch before it transitions to an evening of wine and conversation."
        decision="Treat the website as a narrative experience, not a brochure. Use WebGL to create a sculptural hero scene that establishes mood immediately. Layer GSAP scroll choreography to take visitors through a day-to-night journey. Build editorial typography and interactive menu systems that feel as considered as the café itself."
        built={[
          'WebGL hero scene with custom ceramic cup and steam geometry',
          'Day-to-night scroll sequence with room transformations',
          'Interactive signature-menu rail with keyboard navigation',
          'Full-screen gallery with keyboard-navigable lightbox',
          'Editorial menu page with sticky category nav and dietary filters',
          'Demo-mode reservation form with Zod validation',
          'Accessibility: prefers-reduced-motion support, static poster fallback',
          'SEO: per-route metadata, XML sitemap, PWA manifest, structured data',
        ]}
        proofText="Every section of the site exists to immerse the visitor in the café experience — from the 3D hero that establishes warmth and mood, to the scroll sequences that transition through the day, to the interactive menu that makes browsing the food feel like being at the table."
        honestMoment="The hardest part was balancing WebGL performance with visual richness. The steam ribbon and marigold petals needed to feel alive without tanking frame rates on mobile. The solution was adaptive DPR, geometry optimization, and a static poster fallback for reduced-motion preferences."
        timeline={[
          { num: '01', title: 'Mood & Narrative', desc: 'Define the golden-hour café story and visual direction.' },
          { num: '02', title: 'WebGL Hero', desc: 'Build the ceramic cup, steam, petals, and sunset lighting scene.' },
          { num: '03', title: 'Scroll System', desc: 'Create day-to-night transitions and editorial sections.' },
          { num: '04', title: 'Polish', desc: 'Optimize performance, accessibility, and mobile experience.' },
        ]}
        stack="Next.js, TypeScript, Three.js, React Three Fiber, GSAP, Framer Motion, Tailwind CSS"
        liveUrl="https://saffron-steam-experience.vercel.app/"
        githubUrl="https://github.com/witejackel-eng/saffron-steam-experience"
      />
    </>
  );
}
