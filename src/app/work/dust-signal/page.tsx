import { Metadata } from 'next';
import CaseStudyContent from '@/components/CaseStudyContent';

const baseUrl = 'https://dev-aditya.com';

export const metadata: Metadata = {
  title: 'DUST//SIGNAL — Building a computational observatory where probability has a pulse | Aditya',
  description:
    'An original experimental web experience combining mathematical simulations, generative visuals, cinematic motion, and procedural audio using Next.js, TypeScript, Three.js, GSAP, and the Web Audio API.',
  openGraph: {
    title: 'DUST//SIGNAL — Probability Has a Pulse',
    description:
      'A computational observatory exploring mathematics, uncertainty, rhythm, and motion through an original interactive web experience.',
    url: `${baseUrl}/work/dust-signal`,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DUST//SIGNAL — Probability Has a Pulse',
    description:
      'A computational observatory exploring mathematics, uncertainty, rhythm, and motion through an original interactive web experience.',
  },
};

export default function DustSignalCaseStudy() {
  return (
    <CaseStudyContent
      meta="CASE STUDY 03 · CREATIVE CODING · NEXT.JS / TYPESCRIPT / THREE.JS / GSAP / WEB AUDIO"
      title="Building a computational observatory where probability has a pulse"
      summary="DUST//SIGNAL is an original interactive digital experience built around mathematics, sound, and cinematic scale. It transforms stochastic motion, covariance, Fourier composition, and rhythmic sequencing into a connected computational world that visitors can observe, control, and hear."
      proof={[
        {
          label: 'MATHEMATICAL SYSTEMS',
          value:
            'Interactive models translate stochastic drift, volatility, covariance, probability distributions, and Fourier composition into visible behavior.',
        },
        {
          label: 'PROCEDURAL SIGNAL',
          value:
            'A user-initiated four-channel sequencer generates original rhythm through the Web Audio API without commercial samples or autoplay.',
        },
        {
          label: 'CINEMATIC INTERACTION',
          value:
            'Motion, typography, procedural environments, and responsive visual systems create scale while adapting to different devices and reduced-motion preferences.',
        },
      ]}
      problem="Most experimental technology websites fall into one of two extremes: visual spectacle without meaning, or technically accurate interfaces that feel like dashboards. The challenge was to create something cinematic and emotionally engaging while ensuring that the mathematics, interaction, and sound were more than decoration.

The project also needed to remain original. It could draw from monumental science-fiction atmosphere, quantitative systems, and underground house rhythm without reproducing a film world, soundtrack, logo, scene, or visual identity."
      decision="Build the experience as a fictional computational observatory rather than a conventional portfolio or product page. Mathematics would generate structure, rhythm would govern movement, and scale would create emotion.

A restrained palette of carbon, mineral, dust, bone, amber, and signal red keeps the world cohesive. Large typography establishes scale, technical labels make the system feel measurable, and the interactive models allow visitors to observe how changing parameters changes the field."
      built={[
        'A cinematic Observatory homepage connecting procedural environments, typography, mathematical fields, and rhythmic interaction',
        'Four interactive mathematical models covering stochastic drift, volatility, covariance, and Fourier composition',
        'A Monte Carlo probability chamber with seeded simulations and percentile-based output',
        'A sixteen-step, four-channel procedural audio-visual sequencer',
        'Six creative-coding archive experiments based on genuine mathematical systems',
        'Reproducible seeded states for simulations and interactive patterns',
        'User-controlled audio with mute, volume, and no autoplay',
        'Adaptive rendering and reduced-quality behavior for less powerful devices',
        'Responsive layouts for desktop, tablet, and mobile',
        'Keyboard support, reduced-motion handling, and accessible controls',
        'An original emblem, typography system, interface language, and visual world',
        'Route-specific pages for Observatory, Models, Signal, Archive, and Protocol',
      ]}
      proofText="DUST//SIGNAL demonstrates that creative coding can be both expressive and accountable. The mathematics determines the behavior, the sound responds to interaction, and the visual identity connects every route into the same world. It is not a themed landing page with decorative particles; it is a complete experimental system with its own logic, language, and interaction model."
      honestMoment="The hardest part was balancing cinematic density with clarity and performance. Large typography, procedural visuals, moving particles, simulations, and audio controls can compete for attention and processing power. The work required repeated adjustments to scene complexity, content hierarchy, responsive behavior, and rendering quality so that the experience remained readable and usable instead of becoming visual noise. The dual-rendering strategy — WebGL for the primary observatory scene with a Canvas 2D fallback — was essential to keep the experience accessible across devices without sacrificing the homepage impact."
      timeline={[
        { num: '01', title: 'WORLD & SYSTEM', desc: 'Define the original observatory concept, emblem, palette, typography, routes, and interaction language.' },
        { num: '02', title: 'MATHEMATICAL ENGINE', desc: 'Build seeded simulations and translate probability, covariance, volatility, and frequency into visual behavior.' },
        { num: '03', title: 'MOTION & SIGNAL', desc: 'Connect cinematic animation, procedural graphics, and user-initiated sound into one responsive system.' },
        { num: '04', title: 'POLISH & VALIDATION', desc: 'Repair responsive layouts, improve accessibility, optimize rendering, verify routes, and prepare the production deployment.' },
      ]}
      stack="Next.js, TypeScript, Three.js, React Three Fiber, GSAP, Web Audio API, Tailwind CSS"
      liveUrl="https://dune-aditya.vercel.app/"
      githubUrl="https://github.com/witejackel-eng/dune"
    />
  );
}