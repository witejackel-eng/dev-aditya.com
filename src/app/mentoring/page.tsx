import { Metadata } from 'next';
import MentoringContent from './MentoringContent';

export const metadata: Metadata = {
  title: 'Project Help — Frontend help for students, creators, and small businesses',
  description:
    'I help people turn rough website ideas, broken layouts, weak portfolios, and unfinished frontend projects into something cleaner, sharper, and ready to show.',
};

export default function MentoringPage() {
  return <MentoringContent />;
}