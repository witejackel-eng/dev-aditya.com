import { Metadata } from 'next';
import ProcessContent from './ProcessContent';

export const metadata: Metadata = {
  title: 'Process — How a website project runs from brief to launch',
  description:
    'A six-stage process for corporate website projects: discovery and scope, structure and direction, design and development, review, testing and launch, and handover.',
  alternates: { canonical: '/process' },
  openGraph: {
    title: 'Process — Aditya',
    description:
      'A clear, predictable path from brief to launch for corporate website and frontend projects.',
    url: '/process',
    type: 'website',
  },
};

export default function ProcessPage() {
  return <ProcessContent />;
}
