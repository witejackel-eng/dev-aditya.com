'use client';

import Link from 'next/link';

const pageLinks = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/mentoring', label: 'Project Help' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];

const projectLinks = [
  { href: '/work/ibs', label: 'IBS' },
  { href: '/work/corporate-leadgen-platform', label: 'Corporate Lead-Gen Platform' },
  { href: '/work/aadi-card', label: 'Aadi Card' },
  { href: '/work/pulse-dashboard', label: 'Pulse Dashboard' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto bg-bg-surface border-t border-border" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Top section — Brand + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-border">
          {/* Brand */}
          <div className="lg:col-span-5">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-4">
              ADITYA
            </h2>
            <p className="text-text-muted text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest mb-3">
              Front-End Developer &amp; UI/UX Designer
            </p>
            <p className="text-text-muted text-base leading-relaxed max-w-md">
              Building high-performance digital interfaces with precision engineering and intentional design.
            </p>
          </div>

          {/* CTA Links */}
          <div className="lg:col-span-3 lg:col-start-7 flex flex-col gap-4">
            <span className="text-text-muted text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-1">
              Get in touch
            </span>
            <a
              href="mailto:hi.aditya.dev@gmail.com"
              className="text-text-primary hover:text-accent transition-colors duration-200 text-sm"
            >
              Email me
            </a>
            <a
              href="https://github.com/witejackel-eng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary hover:text-accent transition-colors duration-200 text-sm"
            >
              GitHub
            </a>
            <a
              href="tel:+919310736542"
              className="text-text-primary hover:text-accent transition-colors duration-200 text-sm"
            >
              Call
            </a>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="text-text-muted text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-1">
              Contact
            </span>
            <a
              href="mailto:hi.aditya.dev@gmail.com"
              className="text-text-muted text-sm hover:text-accent transition-colors duration-200"
            >
              hi.aditya.dev@gmail.com
            </a>
            <a
              href="tel:+919310736542"
              className="text-text-muted text-sm hover:text-accent transition-colors duration-200"
            >
              +91 93107 36542
            </a>
            <p className="text-text-muted text-sm">Delhi, India</p>
            <span className="inline-flex items-center gap-2 text-text-muted text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" aria-hidden="true" />
              Available for remote work
            </span>
          </div>
        </div>

        {/* Middle section — Pages + Projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12 border-b border-border">
          {/* Pages */}
          <div>
            <h3 className="text-text-primary text-sm font-semibold uppercase tracking-wider mb-5">
              Pages
            </h3>
            <ul className="flex flex-col gap-3">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-text-primary text-sm font-semibold uppercase tracking-wider mb-5">
              Projects
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-text-primary text-sm font-semibold uppercase tracking-wider mb-5">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-text-muted text-sm hover:text-accent transition-colors duration-200"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-text-muted text-sm hover:text-accent transition-colors duration-200"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-text-muted text-sm hover:text-accent transition-colors duration-200"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8">
          <p className="text-text-muted text-xs font-[family-name:var(--font-mono)]">
            © 2026 ADITYA — Built with Next.js &amp; Framer Motion
          </p>
          <button
            onClick={scrollToTop}
            className="text-text-muted hover:text-accent text-xs font-[family-name:var(--font-mono)] transition-colors duration-200 cursor-pointer"
            aria-label="Back to top"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}