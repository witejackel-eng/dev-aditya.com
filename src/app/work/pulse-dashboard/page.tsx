import { Metadata } from 'next';
import CaseStudyContent from '@/components/CaseStudyContent';

export const metadata: Metadata = {
  title: 'Pulse Dashboard — Building a real-time analytics dashboard interface',
  description: 'A responsive analytics dashboard concept with live-style metrics, charts, event views, and enterprise-ready UI patterns.',
};

export default function PulseDashboardCaseStudy() {
  return (
    <CaseStudyContent
      meta="CASE STUDY 04 · ANALYTICS DASHBOARD · NEXT.JS / CHART.JS / TAILWIND"
      title="Building a real-time analytics dashboard interface"
      summary="A responsive analytics dashboard concept with live-style metrics, charts, event views, and enterprise-ready UI patterns."
      proof={[
        { label: 'Dashboard UI', value: 'Metrics, charts, events, and system sections.' },
        { label: 'Responsive', value: 'Designed to work across screen sizes.' },
        { label: 'Data-focused', value: 'Clear hierarchy for fast decision-making.' },
      ]}
      problem="Dashboards can become visually noisy very quickly. The challenge was to organize revenue, product, customer, infrastructure, and pipeline metrics into one interface that feels useful instead of overwhelming."
      decision="Use a clean operational dashboard structure: executive metrics first, then real-time events, customer analytics, system health, sales pipeline, and enterprise-readiness."
      built={[
        'Dashboard landing page',
        'Metric cards',
        'Data sections',
        'Responsive layout',
        'Chart-ready structure',
        'Clear hierarchy',
        'Product-style interface',
      ]}
      proofText="The interface explains what the product does quickly: every metric that matters, updating when it happens."
      honestMoment="The main challenge was balancing visual polish with dashboard clarity. Data UI should feel impressive, but not distract from the numbers."
      timeline={[
        { num: '01', title: 'Data hierarchy', desc: 'Decide which information appears first.' },
        { num: '02', title: 'Layout', desc: 'Create cards, sections, and responsive grid behavior.' },
        { num: '03', title: 'UI build', desc: 'Implement the dashboard-style interface.' },
        { num: '04', title: 'Polish', desc: 'Refine spacing, typography, and mobile readability.' },
      ]}
      stack="Next.js, Chart.js, Tailwind CSS"
      liveUrl="https://pulse-aadi-project.vercel.app/"
      githubUrl="https://github.com/witejackel-eng/pulse-analytics-dashboard"
    />
  );
}