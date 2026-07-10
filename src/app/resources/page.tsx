import { Metadata } from 'next';
import ResourcesContent from './ResourcesContent';

export const metadata: Metadata = {
  title: 'Resources — Useful guides and checklists',
  description: 'Practical resources for building better portfolios, websites, and frontend projects.',
};

export default function ResourcesPage() {
  return <ResourcesContent />;
}