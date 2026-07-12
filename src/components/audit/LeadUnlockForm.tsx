'use client';

import { useState, useCallback, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadUnlockFormProps {
  auditId: string;
  onSuccess: (data: unknown) => void;
}

export default function LeadUnlockForm({ auditId, onSuccess }: LeadUnlockFormProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Honeypot check
    if (honeypotRef.current && honeypotRef.current.value) return;

    // Validation
    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/audits/${auditId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          firstName: firstName.trim(),
          email: email.trim(),
          businessName: businessName.trim() || null,
          marketingConsent,
          turnstileToken: null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSuccess(true);
      onSuccess(data);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }, [auditId, firstName, email, businessName, marketingConsent, onSuccess]);

  const firstNameErrorId = 'unlock-firstname-error';
  const emailErrorId = 'unlock-email-error';
  const formErrorId = 'unlock-form-error';

  if (success) {
    return (
      <div className="bg-bg-surface border border-border-hard p-6 md:p-8">
        <div
          ref={liveRegionRef}
          role="status"
          aria-live="polite"
          aria-label="Form submitted successfully"
          className="flex items-start gap-3"
        >
          <span className="inline-block w-6 h-6 bg-green-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
            ✓
          </span>
          <div>
            <h3 className="text-base font-bold text-text-primary mb-1">
              REPORT UNLOCKED.
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Your complete action plan is now visible below. A copy has also been sent to {email}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-hard p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-3">
        UNLOCK YOUR COMPLETE ACTION PLAN.
      </h2>

      <p className="text-sm text-text-muted leading-relaxed mb-6">
        Get the remaining findings, detailed SEO and security checks, a prioritized fix order and a copy of the report by email.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot */}
        <input
          ref={honeypotRef}
          type="text"
          name="website_confirm"
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 h-0 w-0 overflow-hidden"
          aria-hidden="true"
        />

        {/* First name */}
        <div className="mb-4">
          <label htmlFor="unlock-firstname" className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-1.5 block">
            FIRST NAME <span className="text-maroon" aria-label="required">*</span>
          </label>
          <input
            id="unlock-firstname"
            type="text"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setError(null); }}
            disabled={loading}
            required
            autoComplete="given-name"
            aria-describedby={firstNameErrorId}
            className="w-full bg-bg-surface border border-border-hard px-4 py-3 text-text-primary font-[family-name:var(--font-sans)] text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="unlock-email" className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-1.5 block">
            EMAIL ADDRESS <span className="text-maroon" aria-label="required">*</span>
          </label>
          <input
            id="unlock-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            disabled={loading}
            required
            autoComplete="email"
            aria-describedby={emailErrorId}
            className="w-full bg-bg-surface border border-border-hard px-4 py-3 text-text-primary font-[family-name:var(--font-sans)] text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Business name (optional) */}
        <div className="mb-4">
          <label htmlFor="unlock-business" className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-1.5 block">
            BUSINESS NAME <span className="text-text-muted" aria-label="optional">(OPTIONAL)</span>
          </label>
          <input
            id="unlock-business"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            disabled={loading}
            autoComplete="organization"
            className="w-full bg-bg-surface border border-border-hard px-4 py-3 text-text-primary font-[family-name:var(--font-sans)] text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Turnstile container */}
        <div id="turnstile-unlock" data-turnstile className="mb-4" />

        {/* Marketing consent */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              disabled={loading}
              className="mt-0.5 w-4 h-4 border-border-hard text-maroon focus:ring-maroon focus:ring-offset-0 rounded-none accent-maroon"
            />
            <span className="text-xs text-text-muted leading-relaxed group-hover:text-text-primary transition-colors">
              I would also like occasional practical website improvement guidance from Aditya.
            </span>
          </label>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              id={formErrorId}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mb-4 text-sm text-maroon font-[family-name:var(--font-sans)]"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-maroon text-white border border-border-hard px-6 py-4 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark hover:shadow-hard-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-hard"
        >
          {loading ? 'UNLOCKING…' : 'UNLOCK FULL REPORT →'}
        </button>
      </form>

      {/* Privacy note */}
      <p className="mt-4 text-[11px] text-text-muted leading-relaxed">
        The audit processes the submitted public URL and stores the resulting report so it can be displayed and emailed. Your email is used to deliver the report and respond to your enquiry. Marketing guidance is optional.
      </p>

      {/* Hidden live region for success announcement */}
      <div ref={liveRegionRef} className="sr-only" aria-live="polite" />
    </div>
  );
}
