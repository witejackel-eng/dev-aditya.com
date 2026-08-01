import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About — Independent Web Designer & Frontend Developer',
  description:
    "I'm Aditya, an independent web designer and frontend developer based in Delhi, India, working with B2B companies and professional-service firms in India and internationally.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Aditya',
    description:
      'Independent web designer and frontend developer based in Delhi, working between design and engineering for B2B and professional-service firms.',
    url: '/about',
    type: 'profile',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
