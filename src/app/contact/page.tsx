import { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact — Tell me what you are trying to build',
  description:
    'Send the short version. I\'ll understand the project, the current problem, and what needs to ship.',
};

export default function ContactPage() {
  return <ContactContent />;
}