import { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact — Discuss a Project',
  description:
    'Share the company, current website, project goal and expected timing. I review the requirements and reply with the most practical next step.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Discuss a Project — Aditya',
    description:
      'Tell me what the website needs to achieve and I\'ll recommend a practical direction.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
