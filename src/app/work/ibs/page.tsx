import { Metadata } from 'next';
import CaseStudyContent from '@/components/CaseStudyContent';

export const metadata: Metadata = {
  title: 'IBS — Building a corporate website for Insight Business Solutions',
  description: 'A service-heavy business website redesigned around clarity, trust, responsive layouts, and a professional brand experience.',
};

export default function IBSCaseStudy() {
  return (
    <CaseStudyContent
      meta="CASE STUDY 01 · CORPORATE WEBSITE · NEXT.JS / TYPESCRIPT / TAILWIND"
      title="Building a corporate website for Insight Business Solutions"
      summary="A service-heavy business website redesigned around clarity, trust, responsive layouts, and a professional brand experience."
      proof={[
        { label: 'Corporate website', value: 'Service pages, company sections, partners, support, and contact flow.' },
        { label: 'Responsive', value: 'Built to work across mobile, tablet, laptop, and desktop.' },
        { label: 'Credibility-first', value: 'Structured for business trust, not just visuals.' },
      ]}
      problem="The company needed a website that could explain multiple technical service areas without feeling confusing. The challenge was to make communication, AV, networking, security, call center, and support services feel connected under one clear business identity."
      decision="Instead of treating the site as a decorative brochure, structure it like a trust-building sales asset: clear hero, service taxonomy, industries served, process, partners, support, and contact paths."
      built={[
        'Responsive corporate homepage',
        'Service cards',
        'Industry cards',
        'Partner/logo sections',
        'Contact CTA',
        'Smooth scroll animations',
        'Clean visual hierarchy',
        'Mobile-friendly layout',
        'Professional brand system',
      ]}
      proofText="Every major section exists to answer a business question: what IBS does, who they serve, what brands they work with, how they support clients, and how to contact them."
      honestMoment="The hardest part was keeping the site premium without making it too long or too generic. The solution was to reduce repeated sections, make service categories clearer, and keep every section tied to a real business purpose."
      timeline={[
        { num: '01', title: 'Content audit', desc: 'Understand the existing business, services, and pages.' },
        { num: '02', title: 'Structure', desc: 'Group services and industries into a clear navigation system.' },
        { num: '03', title: 'Build', desc: 'Create responsive layouts, cards, animations, and CTA sections.' },
        { num: '04', title: 'Polish', desc: 'Check spacing, mobile behavior, readability, and credibility.' },
      ]}
      stack="Next.js, TypeScript, Tailwind CSS, Framer Motion"
      liveUrl="https://ibs-com-aadi.vercel.app/"
      githubUrl="https://github.com/witejackel-eng/IBS.com"
    />
  );
}