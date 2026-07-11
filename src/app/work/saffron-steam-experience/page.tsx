import { Metadata } from 'next';
import CaseStudyContent from '@/components/CaseStudyContent';

export const metadata: Metadata = {
  title: 'Saffron & Steam — Building an immersive café experience with WebGL and editorial design',
  description: 'An immersive, motion-led concept café website with a WebGL hero, day-to-night scroll sequences, editorial typography, and an interactive signature-menu rail.',
};

export default function SaffronSteamCaseStudy() {
  return (
    <CaseStudyContent
      meta="CASE STUDY 01 · IMMERSIVE EXPERIENCE · NEXT.JS / TYPESCRIPT / THREE.JS / GSAP"
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
  );
}
