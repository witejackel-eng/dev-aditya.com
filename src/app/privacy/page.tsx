import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for the Aditya portfolio website.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="text-text-muted mt-2 text-sm">Last updated: July 2026</p>

      <p className="text-text-muted mt-8 leading-relaxed">
        This privacy policy describes how your information is handled when you visit this portfolio website or use the contact form.
      </p>

      <h2 className="text-xl font-bold mt-10">Information collected</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        When you submit the contact form, the information you provide (name, email, project description, and any optional fields) is sent directly to me and used only to respond to your inquiry. This data is not stored in any database on this website.
      </p>

      <h2 className="text-xl font-bold mt-10">Cookies and tracking</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        This website does not use analytics cookies, tracking pixels, or third-party tracking services. No cookies are set unless required for essential functionality.
      </p>

      <h2 className="text-xl font-bold mt-10">Third-party services</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        This site may link to external websites (GitHub, project live links, etc.). Those sites have their own privacy policies and are not covered by this policy.
      </p>

      <h2 className="text-xl font-bold mt-10">Data sharing</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        Your contact information is not sold, shared, or distributed to any third parties. It is used solely to respond to your message.
      </p>

      <h2 className="text-xl font-bold mt-10">Contact</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        If you have questions about this privacy policy, contact me at{' '}
        <a href="mailto:hi.aditya.dev@gmail.com" className="text-accent hover:underline">
          hi.aditya.dev@gmail.com
        </a>.
      </p>
    </div>
  );
}