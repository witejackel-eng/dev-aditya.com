import { Metadata } from 'next';
import WorkContent from './WorkContent';

export const metadata: Metadata = {
  title: 'Work — Aditya | Front-End Developer & UI/UX Designer',
  description: 'Selected case studies: corporate websites, marketing platforms, interactive web apps, and analytics dashboards built with React, Next.js, and TypeScript.',
  openGraph: {
    title: 'Work — Aditya | Front-End Developer & UI/UX Designer',
    description: 'Selected case studies: corporate websites, marketing platforms, interactive web apps, and analytics dashboards built with React, Next.js, and TypeScript.',
  },
};

export default function WorkPage() {
  return <WorkContent />;
}