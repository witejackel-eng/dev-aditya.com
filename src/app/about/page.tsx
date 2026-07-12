import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About — Front-End Developer & UI/UX Designer',
  description:
    "I'm Aditya — a Front-End Developer & UI/UX Designer based in Delhi, India, building high-performance, accessible, and visually compelling digital products.",
};

export default function AboutPage() {
  return <AboutContent />;
}