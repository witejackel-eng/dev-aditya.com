import { Metadata } from 'next';
import WorkContent from './WorkContent';

export const metadata: Metadata = {
  title: 'Work — Projects, interfaces, and shipped experiments',
  description: 'Selected websites, web apps, and interface systems built around performance, clarity, and motion.',
};

export default function WorkPage() {
  return <WorkContent />;
}