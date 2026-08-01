'use client';

import Link from 'next/link';
import {
  FOOTER_SERVICES,
  FOOTER_EXPLORE,
  FOOTER_LEGAL,
} from '@/config/navigation';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_LOCATION } from '@/config/contact';
import { SOCIAL_LINKS } from '@/config/socials';
import { SITE_ROLE } from '@/config/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-bg-surface-2 border-t border-border-hard" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Top section — Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-border">
          <div className="lg:col-span-5">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-4">
              ADITYA
            </h2>
            <p className="text-text-muted text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest mb-3">
              {SITE_ROLE}
            </p>
            <p className="text-text-muted text-base leading-relaxed max-w-md">
              Clear, high-performance websites for B2B companies and
              professional-service firms.
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-3">
            <span className="text-text-muted text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-1">
              Contact
            </span>
            <a
              href={CONTACT_EMAIL_HREF}
              className="text-text-primary hover:text-maroon transition-colors duration-200 text-sm"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="text-text-muted text-sm">{CONTACT_LOCATION}</p>
            <span className="inline-flex items-center gap-2 text-text-muted text-sm">
              <span className="w-2 h-2 rounded-full bg-green-600 inline-block" aria-hidden="true" />
              Available remotely
            </span>
          </div>
        </div>

        {/* Middle section — link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 py-12 border-b border-border">
          <div>
            <h3 className="text-text-primary text-sm font-semibold uppercase tracking-wider mb-5">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_SERVICES.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-muted text-sm hover:text-maroon transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-text-primary text-sm font-semibold uppercase tracking-wider mb-5">
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-muted text-sm hover:text-maroon transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-text-primary text-sm font-semibold uppercase tracking-wider mb-5">
              Connect
            </h3>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted text-sm hover:text-maroon transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-text-primary text-sm font-semibold uppercase tracking-wider mb-5">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LEGAL.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-muted text-sm hover:text-maroon transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8">
          <p className="text-text-muted text-xs font-[family-name:var(--font-mono)]">
            {`© ${year} Aditya. Independent Web Designer & Frontend Developer.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
