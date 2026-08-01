import { Metadata } from 'next';
import Link from 'next/link';
import Content from './Content';

export const metadata: Metadata = {
  title: 'AI Website Agency Starter Notes',
  description: 'Notes on packaging websites, AI chatbots, lead capture, and automation for small businesses.',
};

export default function AIWebsiteAgencyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <Link href="/resources" className="text-sm text-text-muted hover:text-text-primary transition-colors">
        ← All resources
      </Link>
      <Content />
    </div>
  );
}