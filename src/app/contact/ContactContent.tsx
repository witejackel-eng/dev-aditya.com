'use client';
import { useRef, useState, type FormEvent, type ChangeEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_LOCATION, GITHUB_URL } from '@/config/contact';

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const PROJECT_TYPES = [
  'Corporate website',
  'Website redesign',
  'B2B landing page',
  'Frontend development',
  'Dashboard or web application',
  'Interactive experience',
  'Other',
];

const directContact = [
  { label: 'EMAIL', value: CONTACT_EMAIL, href: CONTACT_EMAIL_HREF },
  { label: 'LOCATION', value: CONTACT_LOCATION, href: undefined },
  { label: 'GITHUB', value: 'witejackel-eng', href: GITHUB_URL },
];

const inputClass =
  'bg-white border border-border-hard text-text-primary placeholder:text-text-muted/50 focus:border-maroon focus:outline-none transition w-full px-4 py-3 text-sm';

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    projectType: '',
    scope: '',
    timing: '',
    details: '',
    _honey: '',
    consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Name is required.';
    if (!formData.email.trim()) e.email = 'Work email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email.';
    if (!formData.details.trim()) e.details = 'A short description of the project is required.';
    if (!formData.consent) e.consent = 'Please accept the consent.';
    setErrors(e);
    return Object.keys(e).length === 0;
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
          company: formData.company,
          website: formData.website,
          projectType: formData.projectType,
          scope: formData.scope,
          timing: formData.timing,
          details: formData.details,
          _honey: formData._honey,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <section className="pt-[110px] pb-16 max-w-7xl mx-auto px-6">
        <FadeIn><span className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">Discuss a Project</span></FadeIn>
        <FadeIn delay={0.08}><h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight tracking-tight text-text-primary">Tell me what the website needs to achieve.</h1></FadeIn>
        <FadeIn delay={0.16}><p className="text-text-muted text-lg max-w-3xl mt-6 leading-relaxed">Share the company, current website, project goal and expected timing. I&apos;ll review the requirements and reply with the most practical next step.</p></FadeIn>
      </section>

      <section className="mt-8 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16">
          <FadeIn className="md:col-span-4">
            <div>
              <h2 className="text-xl font-bold mb-8 text-text-primary tracking-tight">Direct contact</h2>
              <div className="space-y-6">
                {directContact.map((item) => (
                  <div key={item.label}>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">{item.label}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-text-primary hover:text-maroon transition-colors mt-1 block"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-text-primary mt-1">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-text-muted text-sm mt-8 leading-relaxed border-t border-border pt-6">
                Typical response time: within 1&ndash;2 business days.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="md:col-span-8">
            <div>
              {status === 'success' ? (
                <div className="bg-white border border-border-hard p-8 shadow-hard-sm">
                  <p className="text-xl font-bold mb-2 text-text-primary">Message sent.</p>
                  <p className="text-text-muted">Thanks — I&apos;ll review the requirements and reply within 1&ndash;2 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest mb-2 block">Name *</label>
                      <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
                      {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest mb-2 block">Work email *</label>
                      <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
                      {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="company" className="font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest mb-2 block">Company</label>
                      <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} placeholder="Company name" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="website" className="font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest mb-2 block">Current website</label>
                      <input id="website" name="website" type="text" value={formData.website} onChange={handleChange} placeholder="https://" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="projectType" className="font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest mb-2 block">Project type</label>
                      <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} className={inputClass}>
                        <option value="">Select one</option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="scope" className="font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest mb-2 block">Approximate scope</label>
                      <input id="scope" name="scope" type="text" value={formData.scope} onChange={handleChange} placeholder="e.g. 6-page corporate site" className={inputClass} />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="timing" className="font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest mb-2 block">Target launch timing</label>
                    <input id="timing" name="timing" type="text" value={formData.timing} onChange={handleChange} placeholder="e.g. within the next quarter" className={inputClass} />
                  </div>

                  <div className="mt-5">
                    <label htmlFor="details" className="font-[family-name:var(--font-mono)] text-xs text-text-muted uppercase tracking-widest mb-2 block">Project details *</label>
                    <textarea id="details" name="details" required value={formData.details} onChange={handleChange} placeholder="What the website needs to achieve, and what is not working today..." maxLength={2000}
                      className={`${inputClass} min-h-[140px] resize-y`} />
                    <div className="flex justify-between mt-1">
                      {errors.details && <p className="text-red-600 text-xs">{errors.details}</p>}
                      <span className="text-xs text-text-muted ml-auto">{formData.details.length} / 2000</span>
                    </div>
                  </div>

                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="_honey">Do not fill this</label>
                    <input id="_honey" name="_honey" type="text" value={formData._honey} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="mt-6 mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="mt-0.5 accent-[#7A1F2B]" />
                      <span className="text-text-muted text-sm leading-relaxed">I&apos;m okay with Aditya reading this enquiry and replying by email. No spam.</span>
                    </label>
                    {errors.consent && <p className="text-red-600 text-xs mt-1">{errors.consent}</p>}
                  </div>

                  <button type="submit" disabled={status === 'loading'}
                    className="bg-maroon text-white border border-border-hard px-8 py-3 font-medium text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest shadow-hard hover:bg-maroon-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {status === 'loading' ? 'SENDING…' : 'SEND ENQUIRY →'}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-600 text-sm mt-3">
                      Something went wrong. Please email <a href={CONTACT_EMAIL_HREF} className="text-maroon hover:underline">{CONTACT_EMAIL}</a> directly.
                    </p>
                  )}
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
