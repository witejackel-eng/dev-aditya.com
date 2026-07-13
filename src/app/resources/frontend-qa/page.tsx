import { Metadata } from 'next';
import Link from 'next/link';
import Content from './Content';

export const metadata: Metadata = {
  title: 'Frontend Project QA Checklist',
  description: 'Responsive, accessibility, SEO, performance, and deployment checks before shipping.',
};

export default function FrontendQAPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <Link href="/resources" className="text-sm text-text-muted hover:text-text-primary transition-colors">
        ← All resources
      </Link>
      <Content />
    </div>
  );
}