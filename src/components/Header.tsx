'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/services', label: 'SERVICES' },
  { href: '/work', label: 'WORK' },
  { href: '/packages', label: 'PACKAGES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/mentoring', label: 'PROJECT HELP' },
  { href: '/resources', label: 'RESOURCES' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [prevPath, setPrevPath] = useState(pathname);

  if (prevPath !== pathname) {
    setMobileOpen(false);
    setPrevPath(pathname);
  }

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary border-b border-border-hard">
      <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="bg-maroon text-white w-8 h-8 flex items-center justify-center text-sm font-bold border border-border-hard">
            A
          </span>
          <span className="font-bold text-text-primary tracking-tight text-sm uppercase font-[family-name:var(--font-mono)]">
            ADITYA
          </span>
        </Link>

        {/* Right: Nav + CTA */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase transition-colors duration-200 ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'text-maroon'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="mailto:hi.aditya.dev@gmail.com"
            className="bg-maroon text-white border border-border-hard px-4 py-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark transition-colors duration-200"
          >
            EMAIL ME →
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-text-primary"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-text-primary"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-text-primary"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[70px] bg-bg-primary border-x border-b border-border-hard md:hidden z-40 flex flex-col items-start px-6 py-8 gap-6"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: i * 0.04, duration: 0.15 }}
              >
                <Link
                  href={link.href}
                  className={`font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href)
                      ? 'text-maroon'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: navLinks.length * 0.04, duration: 0.15 }}
              className="mt-4"
            >
              <a
                href="mailto:hi.aditya.dev@gmail.com"
                className="inline-block bg-maroon text-white border border-border-hard px-5 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm"
              >
                EMAIL ME →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}