import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Terms of service for the Aditya portfolio website.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="text-text-muted mt-2 text-sm">Last updated: July 2026</p>

      <p className="text-text-muted mt-8 leading-relaxed">
        These terms govern your use of this portfolio website. By accessing this site, you agree to these terms.
      </p>

      <h2 className="text-xl font-bold mt-10">Purpose</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        This website is a personal portfolio showcasing my work as a front-end developer and UI/UX designer. The content is for informational and demonstration purposes.
      </p>

      <h2 className="text-xl font-bold mt-10">Content accuracy</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        Project descriptions, technologies listed, and outcomes described reflect actual work completed. However, I make no warranties about the accuracy, completeness, or reliability of the content.
      </p>

      <h2 className="text-xl font-bold mt-10">External links</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        This website contains links to external sites including GitHub repositories and live project deployments. These links are provided for reference and I am not responsible for the content of external sites.
      </p>

      <h2 className="text-xl font-bold mt-10">Intellectual property</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        The design and code of this portfolio website are my original work. Project showcases are used with permission where applicable. Do not reproduce or redistribute without written permission.
      </p>

      <h2 className="text-xl font-bold mt-10">Contact</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        For questions about these terms, contact me at{' '}
        <a href="mailto:hi.aditya.dev@gmail.com" className="text-maroon hover:underline">
          hi.aditya.dev@gmail.com
        </a>.
      </p>
    </div>
  );
}
