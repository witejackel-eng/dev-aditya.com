import { Metadata } from 'next';
import CaseStudyContent from '@/components/CaseStudyContent';

export const metadata: Metadata = {
  title: 'Aadi Card — Creating an interactive digital card experience',
  description: 'A compact interactive web app focused on motion, gesture-driven interaction, and polished visual feedback.',
};

export default function AadiCardCaseStudy() {
  return (
    <CaseStudyContent
      meta="CASE STUDY 03 · INTERACTIVE WEB APP · REACT / CSS ANIMATIONS / JAVASCRIPT"
      title="Creating an interactive digital card experience"
      summary="A compact interactive web app focused on motion, gesture-driven interaction, and polished visual feedback."
      proof={[
        { label: 'Interactive', value: 'Built around motion and user interaction.' },
        { label: 'Micro-animations', value: 'Small details that make the card feel alive.' },
        { label: 'Lightweight', value: 'Focused experience without unnecessary pages.' },
      ]}
      problem="A digital card can easily feel static. The challenge was to make a simple concept feel premium, interactive, and memorable."
      decision="Keep the scope small, but polish every interaction: hover states, transitions, gesture feedback, spacing, and visual hierarchy."
      built={[
        'Interactive card interface',
        'Motion states',
        'Micro-interactions',
        'Responsive layout',
        'Polished visual design',
        'Click/gesture behavior',
      ]}
      proofText="The project shows that even a small interface can feel valuable when interaction and motion are treated as part of the product."
      honestMoment="The challenge was avoiding animation for animation's sake. Every movement needed to make the card feel clearer, more tactile, or more memorable."
      timeline={[
        { num: '01', title: 'Concept', desc: 'Start with a simple digital card idea.' },
        { num: '02', title: 'Interaction', desc: 'Define hover, click, movement, and visual response.' },
        { num: '03', title: 'Build', desc: 'Implement the card UI and animation states.' },
        { num: '04', title: 'Polish', desc: 'Refine timing, spacing, and mobile behavior.' },
      ]}
      stack="React, JavaScript, CSS Animations"
      liveUrl="https://aadi-card.vercel.app/"
      githubUrl="https://github.com/witejackel-eng/AADI-CARD"
    />
  );
}