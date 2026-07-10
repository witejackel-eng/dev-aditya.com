'use client';

import { useRef, useState, type FormEvent, type ChangeEvent } from 'react';
import { motion, useInView } from 'framer-motion';

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — silently fail
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-3 text-text-muted hover:text-accent transition-colors text-xs font-mono uppercase tracking-widest shrink-0"
      aria-label="Copy to clipboard"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

const contactItems = [
  {
    label: 'Email',
    value: 'hi.aditya.dev@gmail.com',
    href: 'mailto:hi.aditya.dev@gmail.com',
    copyText: 'hi.aditya.dev@gmail.com',
  },
  {
    label: 'Phone',
    value: '+91 9310736542',
    href: 'tel:+919310736542',
    copyText: '+919310736542',
  },
  {
    label: 'Location',
    value: 'Delhi, India',
    href: undefined,
    copyText: 'Delhi, India',
  },
  {
    label: 'GitHub',
    value: 'witejackel-eng',
    href: 'https://github.com/witejackel-eng',
    copyText: 'witejackel-eng',
  },
];

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    budget: '',
    timeline: '',
    _honey: '',
    consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!formData.project.trim()) {
      newErrors.project = 'Project description is required.';
    }

    if (!formData.consent) {
      newErrors.consent = 'Please accept the consent.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          project: formData.project,
          budget: formData.budget,
          timeline: formData.timeline,
          _honey: formData._honey,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <FadeIn>
          <span className="font-mono text-xs text-accent uppercase tracking-widest">
            Contact
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
            Tell me what you&apos;re trying to build.
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">
            The short version is enough. Send the project, the current problem, or the kind of
            website you want. I&apos;ll reply by email.
          </p>
        </FadeIn>
      </section>

      {/* Two-column layout */}
      <section className="mt-16 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left column — Direct contact */}
          <FadeIn>
            <div>
              <h2 className="text-xl font-bold mb-8">Direct contact</h2>
              <div className="space-y-6">
                {contactItems.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center">
                      <span className="font-mono text-xs text-accent uppercase tracking-widest shrink-0">
                        {item.label}
                      </span>
                      <CopyButton text={item.copyText} />
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={
                          item.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        className="text-text-primary hover:text-accent transition-colors mt-1 block"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-text-primary mt-1">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right column — Contact form */}
          <FadeIn delay={0.15}>
            <div>
              {status === 'success' ? (
                <div className="bg-bg-surface border border-border p-8 text-center">
                  <p className="text-xl font-bold mb-2">Message sent.</p>
                  <p className="text-text-muted">
                    I&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className="mb-5">
                    <label
                      htmlFor="name"
                      className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2 block"
                    >
                      Your name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Aditya"
                      className="bg-bg-surface border border-border text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition w-full px-4 py-3 text-sm"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-5">
                    <label
                      htmlFor="email"
                      className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2 block"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="bg-bg-surface border border-border text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition w-full px-4 py-3 text-sm"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Project */}
                  <div className="mb-5">
                    <label
                      htmlFor="project"
                      className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2 block"
                    >
                      What&apos;s the project? *
                    </label>
                    <textarea
                      id="project"
                      name="project"
                      required
                      value={formData.project}
                      onChange={handleChange}
                      placeholder="A brief description of what you need built or fixed..."
                      maxLength={2000}
                      className="bg-bg-surface border border-border text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition w-full px-4 py-3 text-sm min-h-[140px] resize-y"
                    />
                    <div className="flex justify-between mt-1">
                      {errors.project && (
                        <p className="text-red-400 text-xs">{errors.project}</p>
                      )}
                      <span className="text-xs text-text-muted ml-auto">
                        {formData.project.length} / 2000
                      </span>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="mb-5">
                    <label
                      htmlFor="budget"
                      className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2 block"
                    >
                      Budget range
                    </label>
                    <input
                      id="budget"
                      name="budget"
                      type="text"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="e.g. ₹10k–₹30k"
                      className="bg-bg-surface border border-border text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition w-full px-4 py-3 text-sm"
                    />
                  </div>

                  {/* Timeline */}
                  <div className="mb-5">
                    <label
                      htmlFor="timeline"
                      className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2 block"
                    >
                      Timeline
                    </label>
                    <input
                      id="timeline"
                      name="timeline"
                      type="text"
                      value={formData.timeline}
                      onChange={handleChange}
                      placeholder="e.g. 2 weeks, end of month"
                      className="bg-bg-surface border border-border text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition w-full px-4 py-3 text-sm"
                    />
                  </div>

                  {/* Honeypot */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="_honey">Do not fill this</label>
                    <input
                      id="_honey"
                      name="_honey"
                      type="text"
                      value={formData._honey}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Consent */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-0.5 accent-accent"
                      />
                      <span className="text-text-muted text-sm leading-relaxed">
                        I&apos;m okay with Aditya reading this and replying by email or phone. No
                        spam.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-red-400 text-xs mt-1">{errors.consent}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-accent text-bg-primary px-8 py-3 font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send it →'}
                  </button>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm mt-3">
                      Something went wrong. Try emailing directly.
                    </p>
                  )}
                </form>
              )}

              {/* Below form links */}
              <div className="mt-8 space-y-2 text-sm text-text-muted">
                <p>
                  Prefer email?{' '}
                  <a
                    href="mailto:hi.aditya.dev@gmail.com"
                    className="text-accent hover:underline underline-offset-4 transition-all"
                  >
                    hi.aditya.dev@gmail.com
                  </a>
                </p>
                <p>
                  Prefer calling?{' '}
                  <a
                    href="tel:+919310736542"
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    +91 9310736542
                  </a>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}