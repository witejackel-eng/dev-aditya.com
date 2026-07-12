import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Accessibility Statement',
  description: 'Accessibility statement for the Aditya portfolio website.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Accessibility</h1>
      <p className="text-text-muted mt-2 text-sm">Last updated: July 2026</p>

      <p className="text-text-muted mt-8 leading-relaxed">
        I am committed to making this portfolio website accessible to everyone, including people with disabilities. This page describes the current accessibility features and known considerations.
      </p>

      <h2 className="text-xl font-bold mt-10">Accessibility features</h2>
      <ul className="mt-4 space-y-2 text-text-muted leading-relaxed">
        <li className="flex gap-2"><span className="text-maroon">—</span> Semantic HTML structure for proper content hierarchy</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> Full keyboard navigation support</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> Visible focus indicators on all interactive elements</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> High contrast text on dark background</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> ARIA labels on navigation and interactive components</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> Reduced motion support via prefers-reduced-motion</li>
      </ul>

      <h2 className="text-xl font-bold mt-10">Technologies used</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        This site is built with Next.js, Tailwind CSS, and Framer Motion. These technologies support accessible web development when used correctly.
      </p>

      <h2 className="text-xl font-bold mt-10">Known considerations</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        Some scroll-based animations and transitions may be reduced or disabled when the user has enabled the reduced motion preference in their operating system settings. This is intentional to respect user preferences.
      </p>

      <h2 className="text-xl font-bold mt-10">Ongoing improvements</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        I continue to test and improve the accessibility of this website. If you encounter any barriers or have suggestions, please reach out.
      </p>

      <h2 className="text-xl font-bold mt-10">Contact</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        If you experience any accessibility issues or have feedback, contact me at{' '}
        <a href="mailto:hi.aditya.dev@gmail.com" className="text-maroon hover:underline">
          hi.aditya.dev@gmail.com
        </a>.
      </p>
    </div>
  );
}
