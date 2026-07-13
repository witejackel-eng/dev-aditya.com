import { Metadata } from 'next';
import CaseStudyContent from '@/components/CaseStudyContent';

export const metadata: Metadata = {
  title: 'Corporate Lead-Gen Platform — B2B lead-generation experience',
  description: 'A polished marketing platform built around modular sections, conversion-focused storytelling, and smooth motion.',
};

export default function CorporateCaseStudy() {
  return (
    <CaseStudyContent
      meta="CASE STUDY 02 · B2B MARKETING SITE · REACT / NEXT.JS / FRAMER MOTION"
      title="Designing a B2B lead-generation platform experience"
      summary="A polished marketing platform built around modular sections, conversion-focused storytelling, and smooth motion."
      proof={[
        { label: 'B2B marketing', value: 'Positioning, features, customer stories, case studies, FAQ, and CTA flow.' },
        { label: 'Modular system', value: 'Reusable sections for marketing pages.' },
        { label: 'Motion polish', value: 'Smooth animations without overwhelming the content.' },
      ]}
      problem="The goal was to create a landing experience that feels like a real enterprise SaaS platform, with enough structure to support product sections, proof, customer stories, case studies, pricing, and conversion CTAs."
      decision="Use a modern SaaS page structure: hero, trust strip, product features, dashboard preview, reasons to believe, technical showcase, customer stories, case studies, FAQ, and final CTA."
      built={[
        'SaaS-style landing page',
        'Product feature sections',
        'Dashboard preview area',
        'Case study cards',
        'FAQ section',
        'CTA sections',
        'Animation system',
        'Responsive layout',
        'Engineering showcase links',
      ]}
      proofText="The site uses clear product storytelling and structured sections so a visitor can understand the offer, inspect the product, see proof, and take action."
      honestMoment="The main risk was making the page look impressive while not becoming fake or bloated. Keep the copy believable, keep the UI clean, and do not invent unrealistic metrics."
      timeline={[
        { num: '01', title: 'Positioning', desc: 'Define the product story and user journey.' },
        { num: '02', title: 'Sections', desc: 'Create the full marketing page structure.' },
        { num: '03', title: 'Interface', desc: 'Build polished UI cards, dashboard elements, and motion.' },
        { num: '04', title: 'Conversion', desc: 'Add CTAs, FAQ, and trust-building sections.' },
      ]}
      stack="React, Next.js, Framer Motion, Tailwind CSS"
      liveUrl="https://corporate-leadgen-platform-jet.vercel.app/"
      githubUrl="https://github.com/witejackel-eng/corporate-leadgen-platform"
    />
  );
}