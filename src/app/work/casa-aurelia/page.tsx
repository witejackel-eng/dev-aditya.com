import { Metadata } from 'next';
import CaseStudyContent from '@/components/CaseStudyContent';
import { getProject } from '@/config/projects';

const project = getProject('casa-aurelia')!;

export const metadata: Metadata = {
  title: `${project.name} — ${project.outcomeHeadline}`,
  description: project.context,
  alternates: { canonical: project.caseStudyUrl },
  openGraph: {
    title: `${project.name} — ${project.outcomeHeadline}`,
    description: project.context,
    url: project.caseStudyUrl,
    type: 'article',
  },
};

export default function CaseStudyPage() {
  const cs = project.caseStudy;
  return (
    <CaseStudyContent
      meta={`CASE STUDY · ${project.industry} · ${project.technology.join(' / ')}`}
      disclosure={cs.disclosure}
      title={project.outcomeHeadline}
      summary={project.context}
      proof={cs.proof.map((p) => ({ label: p.label, value: p.value }))}
      problem={cs.problem}
      decision={cs.decisions.map((d) => `${d.title}: ${d.desc}`).join(' ')}
      built={cs.built}
      proofText={cs.outcome}
      honestMoment={cs.honestMoment}
      timeline={cs.timeline.map((t) => ({ num: t.num, title: t.title, desc: t.desc }))}
      stack={project.technology.join(', ')}
      liveUrl={project.liveUrl || ''}
      githubUrl={project.githubUrl}
    />
  );
}
